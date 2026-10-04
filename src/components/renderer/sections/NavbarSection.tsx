import React, { useState } from 'react';
import { Menu, X, ArrowRight, PhoneCall } from 'lucide-react';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const NavbarSection: React.FC = () => {
  const { config, activePageSlug, onNavigate, onOpenBookingModal } = useWebsiteContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const handleCtaClick = () => {
    if (config.navigation.ctaButton?.action === 'booking' && onOpenBookingModal) {
      onOpenBookingModal();
    } else {
      onNavigate('/contact');
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200"
      style={{
        backgroundColor: theme.isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.88)',
        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        color: theme.textColor || (theme.isDark ? '#F8FAFC' : '#0F172A'),
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('/')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          {config.navigation.logoUrl ? (
            <img src={config.navigation.logoUrl} alt={config.siteName} className="h-10 w-auto object-contain" />
          ) : (
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-md text-white transition-transform group-hover:scale-105"
              style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
            >
              {(config.navigation.logoText || config.siteName || 'B')[0].toUpperCase()}
            </div>
          )}
          <span className="font-bold text-xl tracking-tight">
            {config.navigation.logoText || config.siteName}
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {config.navigation.links.map((link) => {
            const isActive = activePageSlug === link.pageSlug;
            return (
              <button
                key={link.pageSlug + link.label}
                onClick={() => onNavigate(link.pageSlug)}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive 
                    ? 'font-semibold text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? { backgroundColor: theme.primaryColor || '#4F46E5' } : {}}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          {config.whatsappNumber && (
            <a
              href={`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              title="Chat on WhatsApp"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          )}

          {config.navigation.ctaButton && (
            <button
              onClick={handleCtaClick}
              className={`px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 ${radius}`}
              style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
            >
              <span>{config.navigation.ctaButton.text}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-b px-4 py-4 space-y-2"
          style={{
            backgroundColor: theme.isDark ? '#0F172A' : '#FFFFFF',
            borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        >
          {config.navigation.links.map((link) => (
            <button
              key={link.pageSlug + link.label}
              onClick={() => {
                onNavigate(link.pageSlug);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </button>
          ))}
          {config.navigation.ctaButton && (
            <div className="pt-2">
              <button
                onClick={() => {
                  handleCtaClick();
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-3 text-sm font-semibold text-white text-center rounded-xl shadow`}
                style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
              >
                {config.navigation.ctaButton.text}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
