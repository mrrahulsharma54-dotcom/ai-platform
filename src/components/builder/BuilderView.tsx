import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Globe, 
  Download, 
  ArrowLeft, 
  History, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Plus,
  RefreshCw,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { 
  WebsiteConfig, 
  Project, 
  ProjectVersion, 
  DeviceMode,
  GenerationStep 
} from '../../types/website';
import { WebsiteRenderer } from '../renderer/WebsiteRenderer';
import { EDIT_SUGGESTIONS } from '../../utils/defaults';
import { exportWebsiteZip } from '../../utils/zipExporter';

interface BuilderViewProps {
  project: Project;
  onSaveConfig: (updatedConfig: WebsiteConfig, promptNote?: string) => Promise<void>;
  onEditWithAI: (instruction: string) => Promise<{ success: boolean; config?: WebsiteConfig; error?: string }>;
  onBackToDashboard: () => void;
  onPublish: (slug?: string) => Promise<{ success: boolean; publishedUrl?: string; slug?: string }>;
  onViewPublicSite: (slug: string) => void;
  versions: ProjectVersion[];
  onRestoreVersion: (version: ProjectVersion) => Promise<void>;
}

export const BuilderView: React.FC<BuilderViewProps> = ({
  project,
  onSaveConfig,
  onEditWithAI,
  onBackToDashboard,
  onPublish,
  onViewPublicSite,
  versions,
  onRestoreVersion,
}) => {
  const [currentConfig, setCurrentConfig] = useState<WebsiteConfig>(project.websiteConfig);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [activeTab, setActiveTab] = useState<'ai' | 'pages' | 'theme' | 'history'>('ai');
  const [instructionInput, setInstructionInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Hello! I generated the initial configuration for "${project.projectName}". You can customize sections, colors, fonts, or tell me anything to change.`,
      time: 'Just now',
    },
  ]);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [customSlug, setCustomSlug] = useState(project.slug || '');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(project.published);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activePageSlug, setActivePageSlug] = useState<string>('/');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentConfig(project.websiteConfig);
  }, [project.websiteConfig]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, generationSteps]);

  // Handle AI Edit Submission
  const handleSendEdit = async (instructionToRun?: string) => {
    const text = (instructionToRun || instructionInput).trim();
    if (!text || isProcessing) return;

    // Add user message to chat
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInstructionInput('');
    setIsProcessing(true);

    // Multi-step animated progress indicators
    setGenerationSteps([
      { message: 'Understanding your idea...', completed: false },
      { message: 'Planning the website update...', completed: false },
      { message: 'Generating sections...', completed: false },
      { message: 'Preparing your website...', completed: false },
    ]);

    // Animate the steps gracefully
    const stepTimer1 = setTimeout(() => {
      setGenerationSteps((steps) =>
        steps.map((s, i) => (i === 0 ? { ...s, completed: true } : s))
      );
    }, 400);

    const stepTimer2 = setTimeout(() => {
      setGenerationSteps((steps) =>
        steps.map((s, i) => (i <= 1 ? { ...s, completed: true } : s))
      );
    }, 1100);

    const stepTimer3 = setTimeout(() => {
      setGenerationSteps((steps) =>
        steps.map((s, i) => (i <= 2 ? { ...s, completed: true } : s))
      );
    }, 1800);

    try {
      const result = await onEditWithAI(text);
      if (result.success && result.config) {
        setCurrentConfig(result.config);
        setGenerationSteps((steps) => steps.map((s) => ({ ...s, completed: true })));
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `Updated "${project.projectName}" according to your request: "${text}". Check out the live preview on the right.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `I encountered an issue processing that edit: ${result.error || 'Please try rephrasing'}. Your previous configuration remains active.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e: any) {
      console.error(e);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `An error occurred: ${e.message || 'Unable to complete edit'}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsProcessing(false);
      setTimeout(() => setGenerationSteps([]), 1500);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportWebsiteZip(currentConfig);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentConfig.slug || 'website'}-source.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export error', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    try {
      const res = await onPublish(customSlug);
      if (res.success) {
        setPublishSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyPublicUrl = () => {
    const fullUrl = `${window.location.origin}/site/${customSlug || project.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Quick manual theme tweak
  const handleUpdateThemeColor = (color: string) => {
    const updated = {
      ...currentConfig,
      theme: { ...currentConfig.theme, primaryColor: color },
    };
    setCurrentConfig(updated);
    onSaveConfig(updated, `Changed color to ${color}`);
  };

  const handleToggleThemeDark = (isDark: boolean) => {
    const updated: WebsiteConfig = {
      ...currentConfig,
      theme: {
        ...currentConfig.theme,
        isDark,
        backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        textColor: isDark ? '#F8FAFC' : '#0F172A',
      },
    };
    setCurrentConfig(updated);
    onSaveConfig(updated, `Switched to ${isDark ? 'dark' : 'light'} theme`);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Builder Control Header */}
      <header className="h-14 border-b border-white/10 bg-slate-900/90 px-4 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="h-4 w-[1px] bg-white/15" />
          <h2 className="font-bold text-sm text-white max-w-[180px] sm:max-w-xs truncate">
            {project.projectName}
          </h2>
          <span className="hidden md:inline px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
            {currentConfig.businessType}
          </span>
        </div>

        {/* Device Mode Switchers */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (100% width)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: Publish, Export, Public Link */}
        <div className="flex items-center gap-2">
          {project.published && (
            <button
              onClick={() => onViewPublicSite(project.slug)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-colors"
              title="Open Public Website"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </button>
          )}

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Export Source Code ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>

          <button
            onClick={() => setPublishModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: AI Chat & Controls */}
        <aside className="w-full sm:w-[380px] lg:w-[420px] flex-shrink-0 border-r border-white/10 bg-slate-900/95 flex flex-col z-10">
          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-slate-950/60 p-1">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'pages' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pages ({currentConfig.pages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'theme' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* TAB 1: AI Chat Assistant */}
          {activeTab === 'ai' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Chat history stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 mb-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Boxput AI Architect</span>
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {/* Loading Experience Steps */}
                {isProcessing && generationSteps.length > 0 && (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2.5 animate-pulse">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Applying AI Modifications...</span>
                    </span>
                    <div className="space-y-1.5 pt-1">
                      {generationSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          {step.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400/40 border-t-indigo-400 animate-spin flex-shrink-0" />
                          )}
                          <span className={step.completed ? 'text-slate-300 font-medium' : 'text-indigo-200'}>
                            {step.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions Chips & Input Form */}
              <div className="p-3 border-t border-white/10 bg-slate-950/80 space-y-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Quick AI Prompts:
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {EDIT_SUGGESTIONS.slice(0, 5).map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendEdit(sug)}
                        disabled={isProcessing}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-400 hover:bg-white/10 text-[11px] text-slate-300 whitespace-nowrap transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendEdit();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={instructionInput}
                    onChange={(e) => setInstructionInput(e.target.value)}
                    placeholder="e.g. Add a WhatsApp contact button..."
                    disabled={isProcessing}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!instructionInput.trim() || isProcessing}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-transform active:scale-95 shadow cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: Pages Manager */}
          {activeTab === 'pages' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white">Pages in Website</span>
                <button
                  onClick={() => handleSendEdit('Add a new FAQ page with accordion answers')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>AI Add Page</span>
                </button>
              </div>

              {currentConfig.pages.map((page, idx) => {
                const isActive = activePageSlug === page.slug;
                return (
                  <div
                    key={page.slug + idx}
                    onClick={() => setActivePageSlug(page.slug)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold">{page.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">{page.slug}</span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {page.sections.length} Sections: {page.sections.map((s) => s.type).join(', ')}
                      </p>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500 text-white">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: Theme Customizer */}
          {activeTab === 'theme' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Primary Accent Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    '#D97706', // Gold / Amber
                    '#4F46E5', // Indigo
                    '#2563EB', // Blue
                    '#059669', // Emerald
                    '#E11D48', // Rose
                    '#7C3AED', // Violet
                    '#0F172A', // Slate Dark
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleUpdateThemeColor(color)}
                      className={`w-9 h-9 rounded-xl border-2 transition-transform hover:scale-110 ${
                        currentConfig.theme.primaryColor === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Theme Appearance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleToggleThemeDark(false)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      !currentConfig.theme.isDark
                        ? 'bg-white text-slate-900 border-white'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    Light Theme
                  </button>
                  <button
                    onClick={() => handleToggleThemeDark(true)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      currentConfig.theme.isDark
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    Dark Luxury
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-white block">Theme Preset: {currentConfig.theme.style}</span>
                <p>Font: <span className="font-mono">{currentConfig.theme.font}</span></p>
                <p>Corners: <span className="font-mono">{currentConfig.theme.borderRadius}</span></p>
                <button
                  onClick={() => handleSendEdit('Change the typography to clean Space Grotesk and minimal borders')}
                  className="text-xs text-amber-400 hover:underline font-semibold pt-1 block"
                >
                  Prompt AI for custom typography & style →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Version History & Undo */}
          {activeTab === 'history' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white">Version Snapshots</span>
                <span className="text-[11px] text-slate-400">{versions.length} recorded</span>
              </div>

              {versions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <p>Snapshots are saved automatically with each AI edit instruction.</p>
                </div>
              ) : (
                versions.map((ver, idx) => (
                  <div
                    key={ver.id || idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-white/20 transition-all"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white">Version #{ver.versionNumber}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{ver.promptNote || 'Snapshot'}</p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <button
                      onClick={() => onRestoreVersion(ver)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </aside>

        {/* RIGHT PANEL: Live Website Preview */}
        <main className="flex-1 bg-slate-900/50 overflow-y-auto relative flex flex-col items-center">
          {/* Active Page Header Navigation Bar */}
          <div className="w-full bg-slate-950/80 backdrop-blur border-b border-white/10 px-4 py-2 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preview Page:</span>
              {currentConfig.pages.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setActivePageSlug(p.slug)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activePageSlug === p.slug
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Synced</span>
            </div>
          </div>

          {/* Rendered Live Website Component with chosen Device Frame */}
          <div className="w-full p-2 sm:p-6 flex-1 flex justify-center">
            <WebsiteRenderer
              config={currentConfig}
              deviceMode={deviceMode}
              initialPageSlug={activePageSlug}
            />
          </div>
        </main>
      </div>

      {/* Publish Modal */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-6 text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Publish to Worldwide Web</h3>
              <p className="text-xs text-slate-400">
                Anyone with this public URL can view your responsive website without signing in.
              </p>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Public Website Slug / Path
                </label>
                <div className="flex items-center rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm">
                  <span className="text-slate-500 text-xs font-mono">{window.location.origin}/site/</span>
                  <input
                    type="text"
                    required
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="my-awesome-site"
                    className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none px-1"
                  />
                </div>
              </div>

              {publishSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Website is Live!</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPublicUrl}
                    className="font-bold underline text-white hover:text-emerald-200"
                  >
                    {copiedUrl ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isPublishing ? 'Publishing...' : 'Confirm Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
