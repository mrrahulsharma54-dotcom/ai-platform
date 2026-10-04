import JSZip from 'jszip';
import { WebsiteConfig } from '../types/website';

export async function exportWebsiteZip(config: WebsiteConfig): Promise<Blob> {
  const zip = new JSZip();

  // 1. Standalone production index.html (self-contained, beautifully styled, works anywhere)
  const standaloneHtml = generateStandaloneHtml(config);
  zip.file('index.html', standaloneHtml);

  // 2. Structured configuration JSON
  zip.file('website-config.json', JSON.stringify(config, null, 2));

  // 3. React Vite App files
  const packageJson = {
    name: config.slug || 'boxput-generated-website',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'lucide-react': '^0.460.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.3.0',
      autoprefixer: '^10.4.20',
      postcss: '^8.4.40',
      tailwindcss: '^3.4.10',
      typescript: '^5.5.0',
      vite: '^5.4.0'
    }
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // 4. README with deployment instructions
  const readme = `# ${config.siteName}
Built with Boxput AI Website Builder.

## Quick Start
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start local development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## Deployment to Hostinger
- **Static Hosting**: Upload the \`index.html\` file directly to your public_html directory.
- **Node.js Hosting**: Run \`npm run build\` and point your Node.js application to the \`dist\` output folder.
`;
  zip.file('README.md', readme);

  return await zip.generateAsync({ type: 'blob' });
}

function generateStandaloneHtml(config: WebsiteConfig): string {
  const theme = config.theme;
  const primary = theme.primaryColor || '#4F46E5';
  const secondary = theme.secondaryColor || '#6366F1';
  const bg = theme.backgroundColor || '#0F172A';
  const textColor = theme.textColor || '#F8FAFC';
  const font = theme.font === 'playfair' ? "'Playfair Display', serif" : "'Plus Jakarta Sans', sans-serif";

  // Build nav links
  const navLinksHtml = config.navigation.links
    .map(link => `<a href="#${link.label.toLowerCase()}" class="hover:text-[${primary}] transition-colors">${link.label}</a>`)
    .join('\n');

  // Build sections HTML
  const homePage = config.pages[0] || { sections: [] };
  const sectionsHtml = homePage.sections.map(section => {
    switch (section.type) {
      case 'hero':
        return `
        <!-- Hero Section -->
        <section class="relative min-h-[85vh] flex items-center justify-center text-center px-4 py-24 overflow-hidden" style="background-image: ${section.backgroundImage ? `linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.92)), url('${section.backgroundImage}')` : 'none'}; background-size: cover; background-position: center;">
          <div class="max-w-4xl mx-auto space-y-6">
            ${section.badge ? `<span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/20 bg-white/10 backdrop-blur">${section.badge}</span>` : ''}
            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight">${section.title || config.siteName}</h1>
            <p class="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">${section.subtitle || config.description || ''}</p>
            <div class="flex flex-wrap gap-4 justify-center pt-4">
              <a href="#contact" class="px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105" style="background-color: ${primary}; color: #ffffff;">${section.primaryAction?.text || 'Get Started'}</a>
              ${section.secondaryAction ? `<a href="#explore" class="px-8 py-3.5 rounded-xl font-semibold border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">${section.secondaryAction.text}</a>` : ''}
            </div>
          </div>
        </section>`;

      case 'features':
      case 'services':
        return `
        <!-- Features/Services Section -->
        <section id="${section.type}" class="py-24 px-6 max-w-7xl mx-auto">
          <div class="text-center max-w-3xl mx-auto mb-16">
            ${section.badge ? `<span class="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 text-amber-400">${section.badge}</span>` : ''}
            <h2 class="text-3xl sm:text-4xl font-bold mt-3">${section.title || 'Our Features'}</h2>
            <p class="text-slate-400 mt-3 text-lg">${section.subtitle || ''}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${(section.items || []).map(item => `
              <div class="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
                <h3 class="text-xl font-bold text-white mb-2">${item.title || ''}</h3>
                <p class="text-slate-400 leading-relaxed">${item.description || ''}</p>
              </div>
            `).join('')}
          </div>
        </section>`;

      case 'restaurant-menu':
        return `
        <!-- Menu Section -->
        <section id="menu" class="py-24 px-6 max-w-7xl mx-auto">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold">${section.title || 'Our Menu'}</h2>
            <p class="text-slate-400 mt-2">${section.subtitle || ''}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${(section.items || []).map(item => `
              <div class="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 items-center">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" />` : ''}
                <div class="flex-1">
                  <div class="flex justify-between items-baseline mb-1">
                    <h4 class="font-bold text-lg text-white">${item.title}</h4>
                    <span class="font-bold text-amber-400">${item.price || ''}</span>
                  </div>
                  <p class="text-sm text-slate-400 line-clamp-2">${item.description || ''}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>`;

      case 'testimonials':
        return `
        <!-- Testimonials Section -->
        <section class="py-24 px-6 max-w-7xl mx-auto">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold">${section.title || 'What Our Clients Say'}</h2>
            <p class="text-slate-400 mt-2">${section.subtitle || ''}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            ${(section.items || []).map(item => `
              <div class="p-8 rounded-2xl bg-white/5 border border-white/10">
                <p class="text-lg italic text-slate-300 mb-6">"${item.description || ''}"</p>
                <div class="flex items-center gap-4">
                  ${item.avatar ? `<img src="${item.avatar}" class="w-12 h-12 rounded-full object-cover" />` : ''}
                  <div>
                    <h5 class="font-bold text-white">${item.author || item.title || ''}</h5>
                    <p class="text-xs text-slate-400">${item.role || ''}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>`;

      default:
        return `
        <section class="py-16 px-6 max-w-7xl mx-auto text-center">
          <h2 class="text-3xl font-bold">${section.title || ''}</h2>
          <p class="text-slate-400 mt-2">${section.subtitle || section.description || ''}</p>
        </section>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.siteName} | ${config.tagline || config.businessType}</title>
  <meta name="description" content="${config.description || ''}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: ${font};
      background-color: ${bg};
      color: ${textColor};
    }
  </style>
</head>
<body class="min-h-screen">
  <!-- Navigation -->
  <header class="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/10">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="#" class="text-2xl font-bold tracking-tight text-white">${config.navigation.logoText || config.siteName}</a>
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        ${navLinksHtml}
      </nav>
      ${config.navigation.ctaButton ? `
        <a href="#contact" class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow" style="background-color: ${primary}; color: #ffffff;">
          ${config.navigation.ctaButton.text}
        </a>
      ` : ''}
    </div>
  </header>

  <main>
    ${sectionsHtml}
  </main>

  <!-- Footer -->
  <footer class="border-t border-white/10 bg-slate-950/50 py-16 px-6">
    <div class="max-w-7xl mx-auto text-center space-y-4">
      <h3 class="text-xl font-bold text-white">${config.footer.brandName || config.siteName}</h3>
      <p class="text-slate-400 text-sm max-w-lg mx-auto">${config.footer.description || ''}</p>
      <p class="text-xs text-slate-500 pt-4">${config.footer.copyright || `© 2026 ${config.siteName}. All rights reserved.`}</p>
    </div>
  </footer>
</body>
</html>`;
}
