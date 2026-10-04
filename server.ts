import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WebsiteConfig, Project, ProjectVersion } from './src/types/website';
import { DEFAULT_RESTAURANT_SITE, repairJsonString, slugify } from './src/utils/defaults';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. Initialize Gemini API Client (Server-side ONLY)
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 2. Initialize Supabase (or fallback storage)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const isSupabaseLive = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

const supabase: SupabaseClient | null = isSupabaseLive
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// In-memory fallback database for persistent local storage when custom Supabase is not yet connected
interface LocalDB {
  projects: Map<string, Project>;
  versions: Map<string, ProjectVersion[]>;
}

const localDB: LocalDB = {
  projects: new Map<string, Project>(),
  versions: new Map<string, ProjectVersion[]>(),
};

// Seed initial sample restaurant project so users have immediate rich content
const seedSampleProject: Project = {
  id: 'royal-spice-sample-id',
  userId: 'demo-creator-123',
  projectName: 'Royal Spice Restaurant',
  businessType: 'Luxury Restaurant',
  slug: 'royal-spice-restaurant',
  websiteConfig: DEFAULT_RESTAURANT_SITE,
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  versionCount: 1,
};
localDB.projects.set(seedSampleProject.id, seedSampleProject);
localDB.versions.set(seedSampleProject.id, [
  {
    id: 'ver-initial-1',
    projectId: seedSampleProject.id,
    versionNumber: 1,
    websiteConfig: DEFAULT_RESTAURANT_SITE,
    promptNote: 'Initial Generated Version',
    createdAt: new Date().toISOString(),
  },
]);

// Basic Rate Limiting Map
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  if (now - entry.lastReset > 60000) {
    entry.count = 1;
    entry.lastReset = now;
    rateLimitMap.set(ip, entry);
    return true;
  }
  if (entry.count > 30) {
    return false;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return true;
}

// System Instruction for Gemini Structured Website Configuration Generation
const SYSTEM_PROMPT = `You are Boxput AI Website Builder's core website generation engine.
You generate production-ready website configurations in strict, valid JSON format only.
NO conversational prose, NO markdown backticks unless wrapping pure JSON, NO explanations.

You MUST build reusable component-based sections chosen from this exact list of types:
- 'hero': title, subtitle, badge, primaryAction, secondaryAction, backgroundImage, layout
- 'about': title, description, badge, image, items (each with title, description)
- 'services': title, subtitle, badge, items (each with title, description, price, icon)
- 'features': title, subtitle, badge, items (each with title, description, icon)
- 'pricing': title, subtitle, badge, items (each with title, price, period, description, features, highlighted, badge)
- 'products': title, subtitle, badge, items (each with title, price, category, image, description, badge)
- 'restaurant-menu': title, subtitle, badge, items (each with title, price, category, description, image, highlighted)
- 'gallery': title, subtitle, badge, items (each with title, image)
- 'testimonials': title, subtitle, badge, items (each with author, role, description, rating, avatar)
- 'team': title, subtitle, badge, items (each with title, role, avatar, description)
- 'faq': title, subtitle, badge, items (each with title, description)
- 'contact': title, subtitle, badge
- 'cta': title, subtitle, badge, primaryAction, secondaryAction
- 'blog': title, subtitle, badge, items (each with title, description, category, date, readTime, image)
- 'portfolio': title, subtitle, badge, items (each with title, category, description, image)
- 'property-listings': title, subtitle, badge, items (each with title, subtitle, price, description, image, specs: { beds, baths, area })
- 'property-search': title, subtitle
- 'booking-form': title, subtitle, badge, image

Include multiple pages (at minimum Home and About or Menu/Services/Contact based on the business).
Use real, relevant Unsplash image URLs with query params (e.g. https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80).
Ensure the theme has:
- style ('modern' | 'luxury' | 'minimal' | 'bold' | 'playful' | 'tech')
- primaryColor (hex like '#4F46E5' or '#D97706')
- secondaryColor
- backgroundColor ('#0F172A' or '#FFFFFF')
- textColor ('#F8FAFC' or '#0F172A')
- font ('inter' | 'plus-jakarta' | 'playfair' | 'space-grotesk')
- borderRadius ('none' | 'sm' | 'md' | 'lg' | 'full')
- isDark (boolean)`;

// 3. API Endpoints

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    geminiConfigured: Boolean(geminiApiKey),
    supabaseConnected: isSupabaseLive,
    timestamp: new Date().toISOString(),
  });
});

// Generate Website from user prompt
app.post('/api/generate', async (req: Request, res: Response) => {
  const clientIp = req.ip || '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ success: false, error: 'Rate limit exceeded. Please wait a minute.' });
  }

  const { prompt, businessType } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, error: 'A valid text prompt is required.' });
  }

  try {
    if (!geminiApiKey) {
      // Return beautiful fallback template if Gemini API key is missing
      const fallback = JSON.parse(JSON.stringify(DEFAULT_RESTAURANT_SITE));
      fallback.siteName = prompt.split(' ')[0] ? prompt.split(' ').slice(0, 3).join(' ') : 'My Website';
      fallback.slug = slugify(fallback.siteName);
      return res.json({ success: true, config: fallback, note: 'Generated using curated fallback' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a complete website configuration for the following request: "${prompt}".
Business Type Context: ${businessType || 'General Business'}.
Return pure JSON matching the website configuration schema.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    const cleanJson = repairJsonString(rawText);
    const parsedConfig: WebsiteConfig = JSON.parse(cleanJson);

    // Ensure essential defaults
    if (!parsedConfig.slug) {
      parsedConfig.slug = slugify(parsedConfig.siteName || 'boxput-website');
    }
    if (!parsedConfig.theme) {
      parsedConfig.theme = {
        style: 'modern',
        primaryColor: '#4F46E5',
        secondaryColor: '#6366F1',
        backgroundColor: '#0F172A',
        textColor: '#F8FAFC',
        font: 'plus-jakarta',
        borderRadius: 'lg',
        isDark: true,
      };
    }
    if (!parsedConfig.pages || parsedConfig.pages.length === 0) {
      parsedConfig.pages = DEFAULT_RESTAURANT_SITE.pages;
    }
    if (!parsedConfig.navigation) {
      parsedConfig.navigation = {
        logoText: parsedConfig.siteName,
        links: parsedConfig.pages.map((p) => ({ label: p.name, pageSlug: p.slug })),
      };
    }
    if (!parsedConfig.footer) {
      parsedConfig.footer = {
        brandName: parsedConfig.siteName,
        description: parsedConfig.description || '',
        columns: [],
        socials: [],
        copyright: `© 2026 ${parsedConfig.siteName}. All rights reserved.`,
      };
    }

    return res.json({ success: true, config: parsedConfig });
  } catch (error: any) {
    console.error('Error generating website via Gemini:', error);
    // Graceful fallback to avoid crashing
    const fallback = JSON.parse(JSON.stringify(DEFAULT_RESTAURANT_SITE));
    fallback.siteName = 'Curated Experience';
    fallback.slug = slugify('curated-experience-' + Date.now().toString().slice(-4));
    return res.json({
      success: true,
      config: fallback,
      error: 'AI generation timed out or schema repair triggered fallback: ' + error.message,
    });
  }
});

// Edit existing Website configuration with AI
app.post('/api/edit', async (req: Request, res: Response) => {
  const clientIp = req.ip || '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ success: false, error: 'Rate limit exceeded. Please wait a minute.' });
  }

  const { config, instruction } = req.body;
  if (!config || !instruction) {
    return res.status(400).json({ success: false, error: 'Both current config and instruction are required.' });
  }

  try {
    if (!geminiApiKey) {
      // Simple local edit simulation
      const copy = JSON.parse(JSON.stringify(config));
      const lower = instruction.toLowerCase();
      if (lower.includes('blue')) copy.theme.primaryColor = '#2563EB';
      else if (lower.includes('gold') || lower.includes('luxury') || lower.includes('premium')) copy.theme.primaryColor = '#D97706';
      else if (lower.includes('green') || lower.includes('emerald')) copy.theme.primaryColor = '#059669';
      else if (lower.includes('dark')) {
        copy.theme.isDark = true;
        copy.theme.backgroundColor = '#0F172A';
        copy.theme.textColor = '#F8FAFC';
      } else if (lower.includes('light')) {
        copy.theme.isDark = false;
        copy.theme.backgroundColor = '#FFFFFF';
        copy.theme.textColor = '#0F172A';
      }
      return res.json({ success: true, config: copy, summary: 'Updated theme settings' });
    }

    const editPrompt = `Current Website Configuration (JSON):
${JSON.stringify(config, null, 2)}

User Instruction: "${instruction}"

TASK:
Modify the current website configuration according to the user's instructions.
CRITICAL:
1. Do NOT wipe out existing pages or sections unless specifically instructed.
2. If the user asks for a color change, modify theme.primaryColor / theme.secondaryColor.
3. If the user asks for a section addition (e.g. "Add a pricing section"), insert it into the relevant page sections.
4. If the user asks to add an About or Contact page, add it to the pages array and navigation links.
5. If the user asks for a WhatsApp button, set "whatsappNumber": "+919876543210".
6. Return the COMPLETE updated JSON configuration.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: editPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    const cleanJson = repairJsonString(rawText);
    const updatedConfig: WebsiteConfig = JSON.parse(cleanJson);

    return res.json({ success: true, config: updatedConfig, summary: 'Applied AI instruction' });
  } catch (error: any) {
    console.error('Error applying edit via Gemini:', error);
    return res.status(500).json({ success: false, error: 'Could not apply AI edit: ' + error.message });
  }
});

// GET user projects
app.get('/api/projects', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'demo-creator-123';

  if (isSupabaseLive && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        const formatted: Project[] = data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          projectName: d.project_name,
          businessType: d.business_type,
          slug: d.slug,
          websiteConfig: d.website_config,
          published: d.published,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
        return res.json({ success: true, projects: formatted });
      }
    } catch (e) {
      console.warn('Supabase query failed, using local storage fallback:', e);
    }
  }

  // Fallback to local DB
  const list = Array.from(localDB.projects.values()).filter(
    (p) => p.userId === userId || userId === 'all' || p.userId === 'demo-creator-123'
  );
  return res.json({ success: true, projects: list });
});

// Save or Update project
app.post('/api/projects', async (req: Request, res: Response) => {
  const { id, userId, projectName, businessType, slug, websiteConfig, published } = req.body;
  const targetId = id || 'proj_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();
  const safeSlug = slug || slugify(projectName || 'website');

  const projectRecord: Project = {
    id: targetId,
    userId: userId || 'demo-creator-123',
    projectName: projectName || websiteConfig?.siteName || 'New Website',
    businessType: businessType || websiteConfig?.businessType || 'General',
    slug: safeSlug,
    websiteConfig: websiteConfig || DEFAULT_RESTAURANT_SITE,
    published: Boolean(published),
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseLive && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .upsert({
          id: targetId,
          user_id: projectRecord.userId,
          project_name: projectRecord.projectName,
          business_type: projectRecord.businessType,
          slug: projectRecord.slug,
          website_config: projectRecord.websiteConfig,
          published: projectRecord.published,
          updated_at: now,
        })
        .select()
        .single();

      if (!error && data) {
        // Also save snapshot in project_versions
        await supabase.from('project_versions').insert({
          project_id: targetId,
          version_number: Date.now(),
          website_config: projectRecord.websiteConfig,
          prompt_note: 'Saved project state',
        });

        return res.json({ success: true, project: projectRecord });
      }
    } catch (e) {
      console.warn('Supabase save failed, storing locally:', e);
    }
  }

  // Local storage save
  localDB.projects.set(targetId, projectRecord);

  // Version snapshot
  const vers = localDB.versions.get(targetId) || [];
  vers.unshift({
    id: 'ver_' + Math.random().toString(36).substring(2, 9),
    projectId: targetId,
    versionNumber: vers.length + 1,
    websiteConfig: projectRecord.websiteConfig,
    promptNote: 'Snapshot',
    createdAt: now,
  });
  localDB.versions.set(targetId, vers);

  return res.json({ success: true, project: projectRecord });
});

// Delete project
app.delete('/api/projects/:id', async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (isSupabaseLive && supabase) {
    try {
      await supabase.from('projects').delete().eq('id', projectId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  localDB.projects.delete(projectId);
  localDB.versions.delete(projectId);

  return res.json({ success: true });
});

// GET Project Version History
app.get('/api/projects/:id/versions', async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (isSupabaseLive && supabase) {
    try {
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formatted: ProjectVersion[] = data.map((d: any) => ({
          id: d.id,
          projectId: d.project_id,
          versionNumber: d.version_number,
          websiteConfig: d.website_config,
          promptNote: d.prompt_note,
          createdAt: d.created_at,
        }));
        return res.json({ success: true, versions: formatted });
      }
    } catch (e) {
      console.warn('Supabase version fetch error:', e);
    }
  }

  const list = localDB.versions.get(projectId) || [];
  return res.json({ success: true, versions: list });
});

// Restore Project Version
app.post('/api/projects/:id/restore', async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const { versionId } = req.body;

  const vers = localDB.versions.get(projectId) || [];
  const targetVer = vers.find((v) => v.id === versionId);

  if (targetVer) {
    const proj = localDB.projects.get(projectId);
    if (proj) {
      proj.websiteConfig = targetVer.websiteConfig;
      proj.updatedAt = new Date().toISOString();
      localDB.projects.set(projectId, proj);
    }
    return res.json({ success: true, config: targetVer.websiteConfig });
  }

  return res.status(404).json({ success: false, error: 'Version not found' });
});

// Publish Project
app.post('/api/projects/:id/publish', async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const { slug } = req.body;

  const proj = localDB.projects.get(projectId);
  if (proj) {
    proj.published = true;
    if (slug) proj.slug = slugify(slug);
    proj.websiteConfig.published = true;
    proj.updatedAt = new Date().toISOString();
    localDB.projects.set(projectId, proj);

    if (isSupabaseLive && supabase) {
      try {
        await supabase
          .from('projects')
          .update({ published: true, slug: proj.slug, updated_at: proj.updatedAt })
          .eq('id', projectId);
      } catch (e) {
        console.warn('Supabase publish update error:', e);
      }
    }

    return res.json({
      success: true,
      publishedUrl: `/site/${proj.slug}`,
      slug: proj.slug,
    });
  }

  return res.status(404).json({ success: false, error: 'Project not found' });
});

// Public Website GET by Slug (No login required)
app.get('/api/public/site/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug;

  if (isSupabaseLive && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('website_config, published')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (!error && data?.website_config) {
        return res.json({ success: true, config: data.website_config });
      }
    } catch (e) {
      console.warn('Supabase public site fetch error:', e);
    }
  }

  // Check localDB
  for (const proj of localDB.projects.values()) {
    if (proj.slug === slug && proj.published) {
      return res.json({ success: true, config: proj.websiteConfig });
    }
  }

  // Fallback to sample if slug matches
  if (slug === 'royal-spice-restaurant' || slug === 'sample') {
    return res.json({ success: true, config: DEFAULT_RESTAURANT_SITE });
  }

  return res.status(404).json({ success: false, error: 'Published website not found' });
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Boxput AI Website Builder running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
