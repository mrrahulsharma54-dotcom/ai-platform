import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const TeamSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const defaultTeam = [
    {
      id: 'tm1',
      title: 'Alistair Sterling',
      role: 'Founding Principal & Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      description: 'Dedicated to cultivating extraordinary experiences with two decades of industry leadership.',
    },
    {
      id: 'tm2',
      title: 'Sophia Chen',
      role: 'Head of Operations & Experience',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      description: 'Master of hospitality orchestrating seamless luxury guest itineraries and bespoke services.',
    },
  ];

  const items = section.items && section.items.length > 0 ? section.items : defaultTeam;

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
          {section.title || 'Meet the Leadership Team'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((member, idx) => (
          <div
            key={member.id || idx}
            className={`overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group ${radius}`}
          >
            <div className="aspect-[4/5] overflow-hidden bg-slate-800">
              <img
                src={member.avatar || ('image' in member ? (member as any).image : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')}
                alt={member.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-white mb-1">{member.title}</h4>
              <p className="text-xs uppercase tracking-wider font-semibold text-amber-400 mb-3">
                {member.role}
              </p>
              {member.description && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {member.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const FaqSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const defaultFaqs = [
    {
      id: 'f1',
      title: 'How do I place a reservation or inquiry?',
      description: 'You can easily book online using our integrated booking system or contact our concierge hotline directly via phone or WhatsApp.',
    },
    {
      id: 'f2',
      title: 'What sets your experience apart from others?',
      description: 'We believe in tailored excellence. Every offering is curated with high caliber ingredients, individualized attention, and supreme craftsmanship.',
    },
    {
      id: 'f3',
      title: 'What is your cancellation and reschedule policy?',
      description: 'We provide hassle-free rescheduling up to 24 hours prior to your scheduled reservation or appointment time.',
    },
  ];

  const items = section.items && section.items.length > 0 ? section.items : defaultFaqs;

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-16 space-y-4">
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
          {section.title || 'Frequently Asked Questions'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.id || idx}
              className={`border border-white/10 bg-white/5 transition-all overflow-hidden ${radius}`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-amber-400 transition-colors"
              >
                <span className="text-base sm:text-lg">{item.title}</span>
                {isOpen ? (
                  <Minus className="w-5 h-5 flex-shrink-0 text-slate-400" />
                ) : (
                  <Plus className="w-5 h-5 flex-shrink-0 text-slate-400" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
                  {item.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
