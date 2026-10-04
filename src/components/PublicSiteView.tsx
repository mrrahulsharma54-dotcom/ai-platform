import React, { useEffect, useState } from 'react';
import { WebsiteConfig } from '../types/website';
import { fetchPublicSite } from '../services/api';
import { WebsiteRenderer } from './renderer/WebsiteRenderer';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface PublicSiteViewProps {
  slug: string;
  onBackToApp: () => void;
}

export const PublicSiteView: React.FC<PublicSiteViewProps> = ({ slug, onBackToApp }) => {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadSite() {
      setLoading(true);
      setError(null);
      const res = await fetchPublicSite(slug);
      if (mounted) {
        if (res.success && res.config) {
          setConfig(res.config);
          document.title = `${res.config.siteName} | ${res.config.tagline || res.config.businessType}`;
        } else {
          setError(res.error || 'Website not found or not yet published.');
        }
        setLoading(false);
      }
    }
    loadSite();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading website...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Website Not Available</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          {error || 'This public website does not exist or has not been published yet.'}
        </p>
        <button
          onClick={onBackToApp}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Boxput AI Builder</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Top Floating Attribution / Back to App Bar */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-3 text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-semibold text-white">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Published on Boxput AI</span>
        </span>
        <div className="h-3 w-[1px] bg-white/20" />
        <button
          onClick={onBackToApp}
          className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
        >
          <span>Open Builder</span>
        </button>
      </div>

      {/* Render the full site */}
      <WebsiteRenderer config={config} deviceMode="desktop" isPublicView={true} />
    </div>
  );
};
