import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { BuilderView } from './components/builder/BuilderView';
import { PublicSiteView } from './components/PublicSiteView';
import { AuthModal } from './components/AuthModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { Project, ProjectVersion, UserProfile, WebsiteConfig } from './types/website';
import { 
  fetchProjects, 
  saveProjectApi, 
  deleteProjectApi, 
  generateWebsiteFromPrompt, 
  editWebsiteWithAI, 
  publishProjectApi, 
  fetchProjectVersions, 
  restoreProjectVersionApi 
} from './services/api';
import { getLocalUser, setLocalUser } from './services/supabaseClient';
import { DEFAULT_RESTAURANT_SITE, slugify } from './utils/defaults';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'builder' | 'public'>('landing');
  const [publicSlug, setPublicSlug] = useState<string>('royal-spice-restaurant');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [deployGuideOpen, setDeployGuideOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeVersions, setActiveVersions] = useState<ProjectVersion[]>([]);
  
  // Loading & Generation modal state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('Understanding your idea...');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initial URL detection and session restoration
  useEffect(() => {
    // Check if initial path is /site/:slug
    const path = window.location.pathname;
    if (path.startsWith('/site/')) {
      const slug = path.replace('/site/', '').split('/')[0];
      if (slug) {
        setPublicSlug(slug);
        setCurrentView('public');
      }
    }

    // Restore user session
    const savedUser = getLocalUser();
    if (savedUser) {
      setUser(savedUser as UserProfile);
    } else {
      // Auto-set initial demo creator session so the user can immediately build without hurdles
      const defaultUser: UserProfile = {
        id: 'demo-creator-123',
        email: 'creator@boxput.ai',
        fullName: 'Rahul Sharma',
      };
      setUser(defaultUser);
      setLocalUser(defaultUser);
    }
  }, []);

  // 2. Load user's projects when user changes
  useEffect(() => {
    if (user?.id) {
      loadProjects(user.id);
    }
  }, [user]);

  const loadProjects = async (userId: string) => {
    const list = await fetchProjects(userId);
    setProjects(list);
  };

  // Load versions for active project
  const loadVersions = async (projectId: string) => {
    const vers = await fetchProjectVersions(projectId);
    setActiveVersions(vers);
  };

  // 3. New Website Generation Flow
  const handleGenerateWebsite = async (prompt: string) => {
    setIsGenerating(true);
    setGenerationStep('Understanding your idea...');

    const step1 = setTimeout(() => setGenerationStep('Planning the website layout & navigation...'), 1200);
    const step2 = setTimeout(() => setGenerationStep('Generating components & high-res images...'), 2400);
    const step3 = setTimeout(() => setGenerationStep('Preparing your live split-screen preview...'), 3800);

    try {
      const result = await generateWebsiteFromPrompt(prompt);
      const config = result.config;

      const newProjectData = {
        userId: user?.id || 'demo-creator-123',
        projectName: config.siteName || 'New Website',
        businessType: config.businessType || 'General',
        slug: config.slug || slugify(config.siteName || 'website'),
        websiteConfig: config,
        published: false,
      };

      const saveRes = await saveProjectApi(newProjectData);
      if (saveRes.success && saveRes.project) {
        setActiveProject(saveRes.project);
        setProjects((prev) => [saveRes.project!, ...prev]);
        await loadVersions(saveRes.project.id);
        setCurrentView('builder');
        showToast(`Website "${config.siteName}" generated successfully!`);
      } else {
        throw new Error(saveRes.error || 'Failed to save project');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Generation issue. Opening curated template.', 'info');
      // Graceful fallback to default
      const fallbackProject: Project = {
        id: 'proj_' + Date.now(),
        userId: user?.id || 'demo-creator-123',
        projectName: 'Royal Spice Restaurant',
        businessType: 'Luxury Restaurant',
        slug: 'royal-spice-restaurant',
        websiteConfig: DEFAULT_RESTAURANT_SITE,
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActiveProject(fallbackProject);
      setCurrentView('builder');
    } finally {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      setIsGenerating(false);
    }
  };

  // 4. Save Config updates
  const handleSaveConfig = async (updatedConfig: WebsiteConfig, promptNote?: string) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      websiteConfig: updatedConfig,
      updatedAt: new Date().toISOString(),
    };
    setActiveProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? updated : p)));
    await saveProjectApi(updated);
    await loadVersions(activeProject.id);
  };

  // 5. AI Edit handler for active project
  const handleEditWithAI = async (instruction: string) => {
    if (!activeProject) return { success: false, error: 'No active project' };

    const res = await editWebsiteWithAI(activeProject.websiteConfig, instruction);
    if (res.success && res.config) {
      await handleSaveConfig(res.config, instruction);
      showToast('AI edit applied successfully!');
      return { success: true, config: res.config };
    }
    return { success: false, error: res.error };
  };

  // 6. Delete Project
  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this website?')) {
      await deleteProjectApi(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (activeProject?.id === projectId) {
        setActiveProject(null);
        setCurrentView('dashboard');
      }
      showToast('Project deleted successfully', 'info');
    }
  };

  // 7. Publish Project
  const handlePublishProject = async (slug?: string) => {
    if (!activeProject) return { success: false };
    const res = await publishProjectApi(activeProject.id, slug);
    if (res.success) {
      const updated: Project = {
        ...activeProject,
        published: true,
        slug: res.slug || activeProject.slug,
      };
      setActiveProject(updated);
      setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? updated : p)));
      showToast('Website is now live to the world!');
      return res;
    }
    showToast(res.error || 'Failed to publish', 'error');
    return { success: false };
  };

  // 8. Restore Version
  const handleRestoreVersion = async (version: ProjectVersion) => {
    if (!activeProject) return;
    const res = await restoreProjectVersionApi(activeProject.id, version.id);
    if (res.success && res.config) {
      const updated: Project = {
        ...activeProject,
        websiteConfig: res.config,
      };
      setActiveProject(updated);
      showToast(`Restored to Version #${version.versionNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 border border-white/20 shadow-2xl text-xs sm:text-sm text-white animate-bounce">
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Generation Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
              <Sparkles className="w-10 h-10 text-amber-400" />
            </div>
            <div className="absolute inset-0 rounded-3xl border-4 border-t-amber-400 border-indigo-500/20 animate-spin" />
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-2xl font-extrabold text-white">Boxput AI Engine</h3>
            <p className="text-sm font-medium text-amber-300 animate-fade-in">{generationStep}</p>
            <p className="text-xs text-slate-400 pt-2">
              Generating structured pages, palettes, and components...
            </p>
          </div>
        </div>
      )}

      {/* Main App Navigation (only shown for non-public site view) */}
      {currentView !== 'public' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={() => {
            setUser(null);
            setLocalUser(null);
            showToast('Signed out of Boxput session', 'info');
          }}
          onNewWebsite={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDeployGuide={() => setDeployGuideOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingPage
            onGenerateFromPrompt={handleGenerateWebsite}
            onOpenDeployGuide={() => setDeployGuideOpen(true)}
            onExploreDemo={() => {
              const sampleProj = projects.find((p) => p.slug === 'royal-spice-restaurant') || {
                id: 'royal-spice-sample-id',
                userId: 'demo-creator-123',
                projectName: 'Royal Spice Restaurant',
                businessType: 'Luxury Restaurant',
                slug: 'royal-spice-restaurant',
                websiteConfig: DEFAULT_RESTAURANT_SITE,
                published: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setActiveProject(sampleProj);
              setCurrentView('builder');
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            projects={projects}
            onOpenBuilder={(proj) => {
              setActiveProject(proj);
              loadVersions(proj.id);
              setCurrentView('builder');
            }}
            onNewWebsite={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDeleteProject={handleDeleteProject}
            onPublishProject={(proj) => {
              setActiveProject(proj);
              handlePublishProject();
            }}
            onViewPublicSite={(slug) => {
              setPublicSlug(slug);
              setCurrentView('public');
            }}
          />
        )}

        {currentView === 'builder' && activeProject && (
          <BuilderView
            project={activeProject}
            onSaveConfig={handleSaveConfig}
            onEditWithAI={handleEditWithAI}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onPublish={handlePublishProject}
            onViewPublicSite={(slug) => {
              setPublicSlug(slug);
              setCurrentView('public');
            }}
            versions={activeVersions}
            onRestoreVersion={handleRestoreVersion}
          />
        )}

        {currentView === 'public' && (
          <PublicSiteView
            slug={publicSlug}
            onBackToApp={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          showToast(`Welcome back, ${u.fullName || u.email}!`);
        }}
      />

      <DeployGuideModal
        isOpen={deployGuideOpen}
        onClose={() => setDeployGuideOpen(false)}
      />
    </div>
  );
}
