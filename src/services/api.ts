import { Project, ProjectVersion, WebsiteConfig } from '../types/website';
import { DEFAULT_RESTAURANT_SITE } from '../utils/defaults';

export async function generateWebsiteFromPrompt(prompt: string, businessType?: string): Promise<{ success: boolean; config: WebsiteConfig; error?: string }> {
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, businessType }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to generate website');
    }

    return { success: true, config: data.config };
  } catch (err: any) {
    console.error('API generate error:', err);
    return {
      success: false,
      config: DEFAULT_RESTAURANT_SITE,
      error: err.message || 'Error communicating with generation engine',
    };
  }
}

export async function editWebsiteWithAI(
  currentConfig: WebsiteConfig,
  instruction: string
): Promise<{ success: boolean; config: WebsiteConfig; summary?: string; error?: string }> {
  try {
    const res = await fetch('/api/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: currentConfig, instruction }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to apply AI edit');
    }

    return { success: true, config: data.config, summary: data.summary };
  } catch (err: any) {
    console.error('API edit error:', err);
    return {
      success: false,
      config: currentConfig,
      error: err.message || 'Error processing AI edit instruction',
    };
  }
}

export async function fetchProjects(userId: string): Promise<Project[]> {
  try {
    const res = await fetch(`/api/projects?userId=${encodeURIComponent(userId)}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.projects)) {
      return data.projects;
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    return [];
  }
}

export async function saveProjectApi(project: {
  id?: string;
  userId: string;
  projectName: string;
  businessType: string;
  slug: string;
  websiteConfig: WebsiteConfig;
  published?: boolean;
}): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to save project');
    }
    return { success: true, project: data.project };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProjectApi(projectId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error('Failed to delete project:', err);
    return false;
  }
}

export async function fetchProjectVersions(projectId: string): Promise<ProjectVersion[]> {
  try {
    const res = await fetch(`/api/projects/${projectId}/versions`);
    const data = await res.json();
    if (data.success && Array.isArray(data.versions)) {
      return data.versions;
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch versions:', err);
    return [];
  }
}

export async function restoreProjectVersionApi(
  projectId: string,
  versionId: string
): Promise<{ success: boolean; config?: WebsiteConfig; error?: string }> {
  try {
    const res = await fetch(`/api/projects/${projectId}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionId }),
    });
    const data = await res.json();
    if (data.success && data.config) {
      return { success: true, config: data.config };
    }
    throw new Error(data.error || 'Failed to restore version');
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function publishProjectApi(
  projectId: string,
  slug?: string
): Promise<{ success: boolean; publishedUrl?: string; slug?: string; error?: string }> {
  try {
    const res = await fetch(`/api/projects/${projectId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    const data = await res.json();
    if (data.success) {
      return { success: true, publishedUrl: data.publishedUrl, slug: data.slug };
    }
    throw new Error(data.error || 'Failed to publish project');
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchPublicSite(slug: string): Promise<{ success: boolean; config?: WebsiteConfig; error?: string }> {
  try {
    const res = await fetch(`/api/public/site/${encodeURIComponent(slug)}`);
    const data = await res.json();
    if (data.success && data.config) {
      return { success: true, config: data.config };
    }
    throw new Error(data.error || 'Site not found');
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchHealth(): Promise<{ status: string; geminiConfigured: boolean; supabaseConnected: boolean }> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { status: 'unknown', geminiConfigured: false, supabaseConnected: false };
  }
}
