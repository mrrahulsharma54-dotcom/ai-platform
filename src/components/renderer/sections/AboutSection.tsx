import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const AboutSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const defaultImg = 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1000&q=80';

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Image with accent badge */}
        <div className="relative">
          <div className="relative z-10 overflow-hidden shadow-2xl rounded-2xl border border-white/10 group">
            <img
              src={section.image || defaultImg}
              alt={section.title || 'About Us'}
              className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {/* Subtle decorative glow card */}
          <div 
            className="absolute -bottom-6 -right-6 w-48 sm:w-60 p-5 rounded-2xl backdrop-blur-xl border border-white/20 bg-slate-900/90 shadow-2xl z-20 hidden sm:block"
          >
            <span className="text-3xl font-black text-amber-400">100%</span>
            <p className="text-xs text-slate-300 font-medium mt-1">Dedicated Craftsmanship & Client Obsession</p>
          </div>
        </div>

        {/* Right Column: Story & Details */}
        <div className="space-y-6">
          {section.badge && (
            <span 
              className="text-xs uppercase font-extrabold tracking-widest px-3 py-1.5 rounded-full border"
              style={{
                borderColor: `${theme.primaryColor || '#4F46E5'}40`,
                backgroundColor: `${theme.primaryColor || '#4F46E5'}15`,
                color: theme.primaryColor || '#4F46E5',
              }}
            >
              {section.badge}
            </span>
          )}

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {section.title || 'A Heritage of Passion and Distinction'}
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed">
            {section.description || section.subtitle || 'Every single offering we present is shaped by tireless dedication, high aesthetic values, and a commitment to surpassing expectations.'}
          </p>

          {/* Highlights list */}
          {section.items && section.items.length > 0 && (
            <div className="space-y-4 pt-2">
              {section.items.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 
                    className="w-5 h-5 flex-shrink-0 mt-0.5" 
                    style={{ color: theme.primaryColor || '#4F46E5' }} 
                  />
                  <div>
                    <h4 className="text-base font-semibold text-white">{item.title}</h4>
                    {item.description && <p className="text-sm text-slate-400 mt-0.5">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
