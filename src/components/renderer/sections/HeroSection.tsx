import React from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const HeroSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config, onNavigate, onOpenBookingModal } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const handlePrimaryClick = () => {
    if (section.primaryAction?.pageSlug) {
      onNavigate(section.primaryAction.pageSlug);
    } else if (onOpenBookingModal) {
      onOpenBookingModal();
    } else {
      onNavigate('/contact');
    }
  };

  const handleSecondaryClick = () => {
    if (section.secondaryAction?.pageSlug) {
      onNavigate(section.secondaryAction.pageSlug);
    } else {
      onNavigate('/about');
    }
  };

  const bgImage = section.backgroundImage || section.image;

  return (
    <section 
      className="relative min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 lg:py-28 overflow-hidden"
      style={{
        backgroundImage: bgImage
          ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.92)), url('${bgImage}')`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Decorative gradient overlay */}
      {!bgImage && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${theme.primaryColor || '#4F46E5'} 0%, transparent 70%)`
          }}
        />
      )}

      <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
        {/* Badge */}
        {section.badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/20 bg-white/10 backdrop-blur-md text-amber-300 shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{section.badge}</span>
          </div>
        )}

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
          {section.title || config.siteName}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          {section.subtitle || section.description || config.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handlePrimaryClick}
            className={`w-full sm:w-auto px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${radius}`}
            style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
          >
            <span>{section.primaryAction?.text || 'Explore Offerings'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {section.secondaryAction && (
            <button
              onClick={handleSecondaryClick}
              className={`w-full sm:w-auto px-8 py-4 text-base font-medium text-slate-200 border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur transition-all hover:scale-105 active:scale-95 cursor-pointer ${radius}`}
            >
              {section.secondaryAction.text}
            </button>
          )}
        </div>

        {/* Trust indicator */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span>Rated 4.9/5 by 1,200+ satisfied clients</span>
          <span className="hidden sm:inline">•</span>
          <span>Verified Excellence</span>
        </div>
      </div>
    </section>
  );
};
