import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const GallerySection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const items = section.items || [];

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
          {section.title || 'Visual Splendor & Moments'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => setSelectedImg(item.image || null)}
            className={`group relative overflow-hidden aspect-[4/3] cursor-pointer border border-white/10 ${radius} shadow-lg`}
          >
            <img
              src={item.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
              alt={item.title || 'Gallery image'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-semibold text-lg">{item.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button 
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImg} 
            alt="Preview" 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl" 
          />
        </div>
      )}
    </section>
  );
};

export const TestimonialsSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const defaultTestimonials = [
    {
      id: 't1',
      author: 'Eleanor Vance',
      role: 'Luxury Connoisseur & Critic',
      description: 'An unparalleled standard of excellence. Every interaction and deliverable was curated with meticulous mastery.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 't2',
      author: 'Marcus Aurelius Vance',
      role: 'Private Investor',
      description: 'The attention to detail and bespoke touch truly exceeded our highest benchmarks. Highly recommended to discerning patrons.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const items = section.items && section.items.length > 0 ? section.items : defaultTestimonials;

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
          {section.title || 'Client Praises & Recognition'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`p-8 bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between ${radius}`}
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-base leading-relaxed italic mb-8">
                "{item.description}"
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              {item.avatar && (
                <img
                  src={item.avatar}
                  alt={item.author || 'Avatar'}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
              )}
              <div>
                <h5 className="font-bold text-white text-sm">{item.author || ('title' in item ? (item as any).title : 'Guest')}</h5>
                <p className="text-xs text-slate-400">{item.role || 'Verified Client'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
