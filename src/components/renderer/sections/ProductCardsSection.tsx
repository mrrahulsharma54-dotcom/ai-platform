import React, { useState } from 'react';
import { ShoppingBag, Star, Plus } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const ProductCardsSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config, onOpenBookingModal } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const items = section.items || [];
  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter((i) => i.category === selectedCategory);

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
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
          {section.title || 'Curated Collection'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      {/* Category Filter */}
      {categories.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat!)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              style={selectedCategory === cat ? { backgroundColor: theme.primaryColor || '#4F46E5' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${radius}`}
          >
            <div className="relative aspect-square overflow-hidden bg-slate-800">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur text-white border border-white/10">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {item.category && (
                  <span className="text-xs font-medium text-slate-400 block mb-1">
                    {item.category}
                  </span>
                )}
                <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-lg font-black text-white">
                  {item.price || '$99'}
                </span>
                <button
                  onClick={onOpenBookingModal}
                  className="p-2 rounded-lg text-white transition-transform hover:scale-110 active:scale-95 shadow"
                  style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
                  title="Add to order"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const RestaurantMenuSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const items = section.items || [];
  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter((i) => i.category === activeCategory);

  return (
    <section id="menu" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
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
          {section.title || 'Grand Dining Menu'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      {/* Category selector */}
      {categories.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat!)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              style={activeCategory === cat ? { backgroundColor: theme.primaryColor || '#4F46E5' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-5 ${radius} group`}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h4 className="text-lg font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>
                <span className="text-lg font-extrabold text-amber-400 flex-shrink-0">
                  {item.price}
                </span>
              </div>
              {item.category && (
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  {item.category}
                </span>
              )}
              <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
