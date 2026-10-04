import React, { useState } from 'react';
import { X, Server, Database, Key, Copy, CheckCircle2, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const envSample = `# Hostinger Node.js Environment Configuration (.env)
PORT=3000
NODE_ENV=production
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
SUPABASE_URL="https://yourproject.supabase.co"
SUPABASE_ANON_KEY="eyJh...yourAnonKeyHere"
APP_URL="https://yourcustomdomain.com"
`;

  const hostingerSteps = `1. Log in to Hostinger hPanel > Web Hosting > Manage.
2. Navigate to "Advanced" > "Node.js".
3. Click "Create Application":
   - Node.js Version: 20.x or 22.x LTS
   - Application Mode: Production
   - Application Root: /home/u12345/public_html
   - Application Startup File: server.ts (or built dist server)
4. In "Environment Variables", set:
   - GEMINI_API_KEY
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
5. In Git Repository or File Manager, upload your exported project repository.
6. Open Terminal / SSH:
   npm install
   npm run build
7. Click "Restart" in Hostinger Node.js panel.`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-slate-900 border border-white/15 rounded-3xl max-w-3xl w-full shadow-2xl p-6 sm:p-8 space-y-6 text-white max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                Hostinger Node.js Deployment Guide
              </h3>
              <p className="text-xs text-slate-400">
                Production-ready setup with Node.js backend, Gemini AI, and Supabase Database
              </p>
            </div>
          </div>
        </div>

        {/* Current status pill */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs font-semibold">
              Status: {isSupabaseConfigured ? 'Supabase Connected' : 'Local Sandbox Mode (Ready for Supabase)'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Hostinger Node.js 20+ compatible
          </span>
        </div>

        {/* Step 1: Environment Variables */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Step 1: Set Hostinger Environment Variables</span>
            </h4>
            <button
              onClick={() => copyToClipboard(envSample, 'env')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copiedSection === 'env' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'env' ? 'Copied' : 'Copy .env.example'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {envSample}
          </pre>
        </div>

        {/* Step 2: Supabase Database Schema */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Step 2: Initialize Supabase SQL Schema</span>
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            Create a project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">supabase.com</a>, open the <strong>SQL Editor</strong>, and paste the schema located in <code className="text-amber-300">/supabase/schema.sql</code>. It provisions tables for <code className="text-slate-300">projects</code> and <code className="text-slate-300">project_versions</code> with Row-Level Security policies.
          </p>
        </div>

        {/* Step 3: Deploy to Hostinger */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>Step 3: Hostinger hPanel Walkthrough</span>
            </h4>
            <button
              onClick={() => copyToClipboard(hostingerSteps, 'steps')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copiedSection === 'steps' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'steps' ? 'Copied' : 'Copy Instructions'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {hostingerSteps}
          </pre>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
