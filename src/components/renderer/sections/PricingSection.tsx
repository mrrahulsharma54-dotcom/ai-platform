import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const PricingSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config, onNavigate, onOpenBookingModal } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const defaultTiers = [
    {
      id: 'p1',
      title: 'Starter / Essential',
      price: '$49',
      period: '/mo',
      description: 'Ideal for individuals and boutique businesses just starting out.',
      features: ['Core experience access', 'Standard priority response', 'Digital consultation', 'Email support'],
      highlighted: false,
    },
    {
      id: 'p2',
      title: 'Pro / Signature',
      price: '$129',
      period: '/mo',
      description: 'Our most sought-after plan with comprehensive benefits and perks.',
      features: ['Everything in Starter', 'Dedicated concierge specialist', 'Unlimited revisions & requests', 'Priority phone & 24/7 WhatsApp'],
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      id: 'p3',
      title: 'Royal / Enterprise',
      price: '$299',
      period: '/mo',
      description: 'Uncompromising luxury tailored exclusively for distinguished clients.',
      features: ['Bespoke private sessions', 'Direct executive hotline', 'Custom tailored deliverables', 'SLA guarantee & VIP perks'],
      highlighted: false,
    },
  ];

  const tiers = section.items && section.items.length > 0 ? section.items : defaultTiers;

  const handleSelectTier = () => {
    if (onOpenBookingModal) {
      onOpenBookingModal();
    } else {
      onNavigate('/contact');
    }
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
          {section.title || 'Transparent, Value-Driven Pricing'}
        </h2>
        {section.subtitle && (
          <p className="text-lg text-slate-400">
            {section.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier, idx) => {
          const isPopular = tier.highlighted;
          return (
            <div
              key={tier.id || idx}
              className={`relative flex flex-col justify-between p-8 ${radius} border transition-all duration-300 ${
                isPopular
                  ? 'bg-slate-900/90 shadow-2xl scale-105 z-10'
                  : 'bg-white/5 hover:border-white/20'
              }`}
              style={{
                borderColor: isPopular ? (theme.primaryColor || '#4F46E5') : 'rgba(255,255,255,0.1)',
              }}
            >
              {isPopular && (
                <div 
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1.5 uppercase tracking-wider"
                  style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{tier.badge || 'Recommended'}</span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.title}</h3>
                <p className="text-sm text-slate-400 mb-6">{tier.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-white">{tier.price}</span>
                  <span className="text-slate-400 text-sm">{tier.period || ''}</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Included features:</p>
                  {(tier.features || ['Complete package access', 'Guaranteed satisfaction', 'Priority support']).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: theme.primaryColor || '#4F46E5' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={handleSelectTier}
                  className={`w-full py-3.5 font-bold text-sm text-center shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${radius}`}
                  style={{
                    backgroundColor: isPopular ? (theme.primaryColor || '#4F46E5') : 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                >
                  Choose {tier.title}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
