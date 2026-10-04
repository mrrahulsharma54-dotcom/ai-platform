import React, { useState } from 'react';
import { 
  PlusCircle, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Download, 
  Globe, 
  Clock, 
  Layers, 
  Sparkles, 
  FolderKanban,
  CheckCircle2,
  Copy,
  AlertCircle
} from 'lucide-react';
import { Project, WebsiteConfig } from '../types/website';
import { exportWebsiteZip } from '../utils/zipExporter';

interface DashboardProps {
  projects: Project[];
  onOpenBuilder: (project: Project) => void;
  onNewWebsite: () => void;
  onDeleteProject: (projectId: string) => void;
  onPublishProject: (project: Project) => void;
  onViewPublicSite: (slug: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  onOpenBuilder,
  onNewWebsite,
  onDeleteProject,
  onPublishProject,
  onViewPublicSite,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/site/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleExportZip = async (project: Project) => {
    try {
      setExportingId(project.id);
      const blob = await exportWebsiteZip(project.websiteConfig);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.slug || 'website'}-source.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-indigo-400" />
            <span>My Websites</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage, customize, publish, and export your AI-generated websites.
          </p>
        </div>

        <button
          onClick={onNewWebsite}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Website</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Websites</span>
          <p className="text-3xl font-black text-white mt-1">{projects.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Published Live</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">
            {projects.filter((p) => p.published).length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Hostinger Ready</span>
          <p className="text-3xl font-black text-indigo-400 mt-1">100%</p>
        </div>
      </div>

      {/* Projects List / Empty State */}
      {projects.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Websites Generated Yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Give Boxput a prompt describing your business idea and generate your first website in seconds.
          </p>
          <button
            onClick={onNewWebsite}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105"
          >
            Generate First Website
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const config = project.websiteConfig;
            const primaryColor = config.theme?.primaryColor || '#4F46E5';
            const pageCount = config.pages?.length || 1;
            const heroSection = config.pages?.[0]?.sections?.find((s) => s.type === 'hero');
            const previewImg = heroSection?.backgroundImage || heroSection?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={project.id}
                className="rounded-3xl border border-white/10 bg-slate-900/80 hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group"
              >
                <div>
                  {/* Preview Banner */}
                  <div className="aspect-[16/9] relative overflow-hidden bg-slate-800">
                    <img
                      src={previewImg}
                      alt={project.projectName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                      {project.published ? (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur flex items-center gap-1 shadow">
                          <Globe className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-800/90 text-slate-300 backdrop-blur border border-white/10">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Color dot */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[11px] text-white">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                      <span className="capitalize">{config.theme?.style || 'modern'}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white truncate drop-shadow">
                        {project.projectName}
                      </h3>
                      <p className="text-xs text-slate-300 truncate">
                        {project.businessType || config.businessType || 'General'}
                      </p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Public URL row if published */}
                    {project.published && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                        <span className="truncate text-slate-300 max-w-[200px] font-mono text-[11px]">
                          /site/{project.slug}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyLink(project.slug)}
                            className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                            title="Copy link"
                          >
                            {copiedSlug === project.slug ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onViewPublicSite(project.slug)}
                            className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                            title="Open live site"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-5 pt-0 border-t border-white/10 mt-2 flex items-center justify-between gap-2 pt-4">
                  <button
                    onClick={() => onOpenBuilder(project)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Open Builder</span>
                  </button>

                  <button
                    onClick={() => handleExportZip(project)}
                    disabled={exportingId === project.id}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                    title="Export ZIP package"
                  >
                    {exportingId === project.id ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full block" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
