import React from 'react';
import * as Icons from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const ServicesSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config, onNavigate } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const getDynamicIcon = (name?: string) => {
    if (!name) return <Icons.Sparkles className="w-6 h-6" />;
    const Comp = (Icons as any)[name];
    if (Comp) return <Comp className="w-6 h-6" />;
    return <Icons.Sparkles className="w-6 h-6" />;
  };

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        {section.badge && (
          <span 
            className="text-xs uppercase font-extrabold tracking-widest px-3 py-1.5 rounded-full border inline-block"
            style={{
              borderColor: `${theme.primaryColor || '#4F46E5'}40`,
              backgroundColor: `${theme.primaryColor || '#4F46E5'}15`,
              color: theme.primaryColor || '#4F46E5',
            }}
          >
            {section.badge}
          </span>
        )}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          {section.title || 'Our Premium Services'}
        </h2>
        {section.subtitle && (
          <p className="text-lg text-slate-400">
            {section.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(section.items || []).map((item, idx) => (
          <div
            key={item.id || idx}
            className={`p-8 bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${radius} group`}
          >
            <div>
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${theme.primaryColor || '#4F46E5'}25`, color: theme.primaryColor || '#4F46E5' }}
              >
                {getDynamicIcon(item.icon)}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {item.description}
              </p>
            </div>

            {item.price && (
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Starting from</span>
                <span className="text-lg font-bold text-white" style={{ color: theme.primaryColor || '#4F46E5' }}>
                  {item.price}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export const FeaturesSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  return <ServicesSection section={section} />;
};
