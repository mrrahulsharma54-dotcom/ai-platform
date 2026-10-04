import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Laptop, 
  Smartphone, 
  Sliders, 
  Code, 
  Globe, 
  History, 
  Zap, 
  ShieldCheck, 
  Terminal,
  Utensils,
  Building2,
  Cpu,
  Dumbbell,
  Palette
} from 'lucide-react';
import { EXAMPLE_PROMPTS } from '../utils/defaults';

interface LandingPageProps {
  onGenerateFromPrompt: (prompt: string) => void;
  onOpenDeployGuide: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGenerateFromPrompt,
  onOpenDeployGuide,
  onExploreDemo,
}) => {
  const [promptInput, setPromptInput] = useState(
    'Create a modern website for a luxury restaurant in Delhi called Royal Spice. Include Home, About, Menu, Gallery, Testimonials and Contact sections.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onGenerateFromPrompt(promptInput.trim());
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'Building2':
        return <Building2 className="w-4 h-4 text-sky-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-indigo-400" />;
      case 'Dumbbell':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'Palette':
        return <Palette className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Generation AI Website Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Build Your Website <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              With Pure AI
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Describe your dream business in natural language. Boxput generates a complete, multi-page, component-driven website with live preview, AI editing, and instant publishing.
          </p>

          {/* Large Prompt Input Form */}
          <div className="pt-4 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="p-2 sm:p-3 rounded-3xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500/80 transition-all">
              <div className="flex flex-col gap-3">
                <textarea
                  rows={3}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Create a modern website for a pet grooming business called Paws & Bubbles..."
                  className="w-full p-4 bg-transparent text-white placeholder-slate-500 text-base sm:text-lg focus:outline-none resize-none leading-relaxed"
                />
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10 px-2 pb-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Gemini 3.8 Flash • Structured Schema • Instant Preview</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Generate Website</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Example Prompt Chips */}
          <div className="pt-6 space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Or Try An Example Prompt:
            </span>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
              {EXAMPLE_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(item.prompt);
                    onGenerateFromPrompt(item.prompt);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 text-xs font-medium text-slate-300 transition-all flex items-center gap-2 text-left cursor-pointer group"
                >
                  {getCategoryIcon(item.icon)}
                  <span className="group-hover:text-white">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Preview Teaser Showcase */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-8 shadow-2xl overflow-hidden relative">
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-md">
                split-screen-builder / live-preview
              </span>
            </div>
            <button
              onClick={onExploreDemo}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <span>Explore Sample Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                AI Interactive Editing
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Modify Anything with Conversational Prompts
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Type instructions like "Change theme to dark luxury", "Add an appointment booking form", or "Update the primary color to gold" and see changes applied in milliseconds.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  'Split-Screen Live Builder with Desktop, Tablet, & Mobile Modes',
                  'Version Snapshots with 1-Click Undo & Restore',
                  'One-Click Public URL Publishing & SEO Tags',
                  'Full Source ZIP Export for Hostinger Node.js Hosting',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-white/10 p-4 shadow-inner">
              <div className="aspect-[16/10] rounded-xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                  alt="Live website preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Live Generated Result
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">Royal Spice Restaurant</h4>
                  <p className="text-xs text-slate-300 mt-1">Multi-page website with Menu, Booking, and Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Breakdown */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
            Engineered For Creators & Agencies
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Everything You Need In An AI Builder
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Built on component-based architecture rather than random unmaintainable code generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
              title: 'Server-Side Gemini AI',
              desc: 'State-of-the-art gemini-3.8-flash model generating structured JSON configurations safely on the server side without exposing API keys.',
            },
            {
              icon: <Sliders className="w-6 h-6 text-amber-400" />,
              title: '20+ Reusable Components',
              desc: 'From Restaurant Menus and Property Listings to Booking Forms, FAQs, Pricing Tiers, and Testimonials.',
            },
            {
              icon: <History className="w-6 h-6 text-emerald-400" />,
              title: 'Version History & Undo',
              desc: 'Never lose a version. Every AI prompt edit saves an automatic snapshot allowing instant rollback and preview.',
            },
            {
              icon: <Smartphone className="w-6 h-6 text-sky-400" />,
              title: 'Responsive Device Modes',
              desc: 'Preview and verify how your site appears across Desktop, Tablet, and Mobile screens with high-fidelity viewport containers.',
            },
            {
              icon: <Globe className="w-6 h-6 text-violet-400" />,
              title: 'Instant Public Publishing',
              desc: 'Deploy to a clean public URL like /site/royal-spice-restaurant accessible worldwide without login requirements.',
            },
            {
              icon: <Terminal className="w-6 h-6 text-rose-400" />,
              title: 'Hostinger Ready Export',
              desc: 'Download clean standalone source code and deploy directly to Hostinger Node.js hosting with ease.',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-indigo-500/40 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">How Boxput Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Describe Your Vision',
              desc: 'Input your business type, target audience, style preferences, and required sections.',
            },
            {
              step: '02',
              title: 'AI Architecting',
              desc: 'Gemini plans the navigation, theme palette, typography, layout, and generates bespoke sections.',
            },
            {
              step: '03',
              title: 'Refine & Publish',
              desc: 'Iterate via split-screen AI chat, test responsive devices, and publish or export to Hostinger.',
            },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 relative">
              <span className="text-5xl font-black text-slate-700/60 block mb-4 font-mono">
                {item.step}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Placeholder */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
            SaaS Membership Plans
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Simple, Fair Pricing</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Build and publish your first AI websites for free. Upgrade for unlimited generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {[
            {
              name: 'Free Trial',
              price: '$0',
              period: 'forever',
              desc: 'Great for testing and prototyping AI ideas.',
              features: ['3 AI Website generations', 'Live split-screen builder', 'Standard component library', 'Community support'],
              cta: 'Start Free',
              highlight: false,
            },
            {
              name: 'Pro Creator',
              price: '$29',
              period: '/month',
              desc: 'For freelancers, agencies, and businesses.',
              features: ['Unlimited AI generations & edits', 'Custom domain publishing', 'Full source code ZIP export', 'Version history snapshots', 'Priority Gemini generation speed'],
              cta: 'Get Started',
              highlight: true,
            },
            {
              name: 'Agency VIP',
              price: '$79',
              period: '/month',
              desc: 'For high-volume client deliveries.',
              features: ['Everything in Pro', 'Unlimited client projects', 'White-label custom branding', 'Hostinger deployment API access', 'Dedicated SLA assistance'],
              cta: 'Contact Sales',
              highlight: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all ${
                plan.highlight
                  ? 'bg-slate-900 border-indigo-500 shadow-2xl scale-105 z-10'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div>
                <h4 className="text-xl font-bold text-white mb-1">{plan.name}</h4>
                <p className="text-xs text-slate-400 mb-6">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>
                <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onGenerateFromPrompt(promptInput)}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  plan.highlight
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-tr from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to Build Your Website in Seconds?
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Experience the future of web design. Enter a brief description and watch Gemini architect your production-ready site.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onGenerateFromPrompt(promptInput)}
              className="px-8 py-4 rounded-2xl bg-white text-slate-950 font-extrabold text-base hover:bg-slate-200 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Building Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 Boxput AI Website Builder. Deployable to Hostinger Node.js hosting.</p>
        <div className="flex items-center gap-6">
          <button onClick={onOpenDeployGuide} className="hover:text-white transition-colors">
            Deployment Docs
          </button>
          <button onClick={onExploreDemo} className="hover:text-white transition-colors">
            Demo Showcase
          </button>
        </div>
      </footer>
    </div>
  );
};
