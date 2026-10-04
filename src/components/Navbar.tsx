import React, { useState } from 'react';
import { 
  Sparkles, 
  Layout, 
  ExternalLink, 
  User as UserIcon, 
  LogOut, 
  PlusCircle, 
  ShieldCheck, 
  FileCode2, 
  Server,
  Layers
} from 'lucide-react';
import { UserProfile } from '../types/website';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'builder' | 'public';
  onNavigate: (view: 'landing' | 'dashboard' | 'builder') => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNewWebsite: () => void;
  onOpenDeployGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
  onNewWebsite,
  onOpenDeployGuide,
}) => {
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between">
      {/* Brand logo */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>Boxput</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 hidden sm:block">Website Builder SaaS</span>
          </div>
        </div>

        {/* View switcher links */}
        <div className="hidden md:flex items-center gap-1 pl-4 border-l border-white/10">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === 'landing' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Landing
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Websites
          </button>
          <button
            onClick={onOpenDeployGuide}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 hover:bg-white/5 transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>Hostinger Deploy Guide</span>
          </button>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Backend & Supabase Status Pill */}
        <div 
          onClick={onOpenDeployGuide}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10 bg-slate-900 text-slate-300 cursor-pointer hover:border-white/20 transition-all"
          title="Click to view Hostinger & Supabase Deployment Instructions"
        >
          <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local / Preview Mode'}</span>
        </div>

        {/* New Website Action */}
        <button
          onClick={onNewWebsite}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Create Website</span>
          <span className="sm:hidden">Create</span>
        </button>

        {/* User profile / auth */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-xs text-white"
            >
              <span className="max-w-[120px] truncate font-medium">
                {user.fullName || user.email.split('@')[0]}
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                {(user.fullName || user.email)[0].toUpperCase()}
              </div>
            </button>

            {profileDropdown && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 z-50 space-y-1"
                onClick={() => setProfileDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-semibold text-white truncate">{user.fullName || 'User'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Layout className="w-4 h-4 text-indigo-400" />
                  <span>My Dashboard</span>
                </button>
                <button
                  onClick={onOpenDeployGuide}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Server className="w-4 h-4 text-amber-400" />
                  <span>Deployment Setup</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] cursor-pointer"
          >
            Sign In / Register
          </button>
        )}
      </div>
    </nav>
  );
};
