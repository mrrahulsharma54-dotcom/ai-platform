import React from 'react';
import { ArrowRight, Calendar, Clock, ExternalLink } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const BlogSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const defaultPosts = [
    {
      id: 'b1',
      title: 'The Art of Slow Culinary Alchemy & Rare Spices',
      description: 'An exploration into ancient cooking wisdom, stone-ground garam masalas, and wood-fired copper cauldrons.',
      date: 'Oct 12, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      category: 'Traditions',
    },
    {
      id: 'b2',
      title: 'Pairing Single Estate Teas and Vintages with Royal Courses',
      description: 'Master sommelier guide on harmonizing delicate aromatic saffron dishes with rare highland vintages.',
      date: 'Sep 28, 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
      category: 'Pairings',
    },
    {
      id: 'b3',
      title: 'Architecture of Imperial Feasts: Designing the Atmosphere',
      description: 'How traditional jali screens, warm candlelight, and live sitar create immersive dining majesty.',
      date: 'Sep 14, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      category: 'Design',
    },
  ];

  const items = section.items && section.items.length > 0 ? section.items : defaultPosts;

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
          {section.title || 'Journal & Insights'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((post, idx) => (
          <article
            key={post.id || idx}
            className={`overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${radius}`}
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-slate-800">
                <img
                  src={post.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  {post.category && (
                    <span 
                      className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${theme.primaryColor || '#4F46E5'}20`, color: theme.primaryColor || '#4F46E5' }}
                    >
                      {post.category}
                    </span>
                  )}
                  {post.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:translate-x-1 transition-transform" style={{ color: theme.primaryColor || '#4F46E5' }}>
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export const PortfolioSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const defaultProjects = [
    {
      id: 'p1',
      title: 'The Grand Pavilion Banquet',
      category: 'Hospitality Architecture',
      description: 'Restoration and interior curation of a 19th-century royal banquet hall in New Delhi.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'p2',
      title: 'Aura Waterfront Villa',
      category: 'Residential Luxury',
      description: 'Complete interior design and mood lighting for an exclusive beachfront retreat.',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'p3',
      title: 'Celestial Sommelier Cellar',
      category: 'Bespoke Cellar',
      description: 'Custom climate-controlled reserve cellar holding over 4,000 rare international vintages.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const items = section.items && section.items.length > 0 ? section.items : defaultProjects;

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
          {section.title || 'Featured Works & Portfolio'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className={`group overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 ${radius}`}
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src={proj.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
                alt={proj.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {proj.category}
              </span>
              <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                {proj.title}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {proj.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
