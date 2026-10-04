import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const ContactSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Info Column */}
        <div className="space-y-8">
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
            {section.title || 'Get in Touch with Our Concierge'}
          </h2>

          <p className="text-lg text-slate-300 leading-relaxed">
            {section.subtitle || section.description || 'Have a special request, inquiry, or reservation inquiry? Our executive desk is at your complete disposal.'}
          </p>

          <div className="space-y-5 pt-4">
            {config.address && (
              <div className="flex items-start gap-4">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow"
                  style={{ backgroundColor: `${theme.primaryColor || '#4F46E5'}25`, color: theme.primaryColor || '#4F46E5' }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-white text-sm">Location Address</h5>
                  <p className="text-sm text-slate-300 mt-0.5">{config.address}</p>
                </div>
              </div>
            )}

            {config.contactPhone && (
              <div className="flex items-start gap-4">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow"
                  style={{ backgroundColor: `${theme.primaryColor || '#4F46E5'}25`, color: theme.primaryColor || '#4F46E5' }}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-white text-sm">Phone Hotline</h5>
                  <p className="text-sm text-slate-300 mt-0.5">{config.contactPhone}</p>
                </div>
              </div>
            )}

            {config.contactEmail && (
              <div className="flex items-start gap-4">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow"
                  style={{ backgroundColor: `${theme.primaryColor || '#4F46E5'}25`, color: theme.primaryColor || '#4F46E5' }}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-semibold text-white text-sm">Email Inquiries</h5>
                  <p className="text-sm text-slate-300 mt-0.5">{config.contactEmail}</p>
                </div>
              </div>
            )}

            {config.whatsappNumber && (
              <div className="pt-2">
                <a
                  href={`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 font-semibold text-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Direct Chat</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Form Column */}
        <div className={`p-8 bg-white/5 border border-white/10 ${radius} shadow-2xl relative`}>
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">Thank You!</h3>
              <p className="text-slate-300 text-sm max-w-sm mx-auto">
                Your message has been received. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
              <p className="text-xs text-slate-400">Fill out this quick form and we will reply within 24 hours.</p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Message / Special Request
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${radius}`}
                style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
              >
                <span>Send Inquiry</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export const CtaSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config, onNavigate, onOpenBookingModal } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const handleAction = () => {
    if (onOpenBookingModal) {
      onOpenBookingModal();
    } else {
      onNavigate('/contact');
    }
  };

  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div 
        className={`relative overflow-hidden p-10 sm:p-16 text-center shadow-2xl border border-white/10 ${radius}`}
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor || '#4F46E5'}25, rgba(15, 23, 42, 0.95))`,
        }}
      >
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {section.badge && (
            <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-amber-300 inline-block">
              {section.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            {section.title || 'Begin Your Extraordinary Experience Today'}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {section.subtitle || section.description || 'Join our private circle of delighted patrons. Discover the distinction for yourself.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleAction}
              className={`px-8 py-4 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${radius}`}
              style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
            >
              {section.primaryAction?.text || 'Get in Touch'}
            </button>
            {section.secondaryAction && (
              <button
                onClick={() => onNavigate(section.secondaryAction?.pageSlug || '/about')}
                className={`px-8 py-4 font-semibold text-slate-200 border border-white/20 bg-white/5 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer ${radius}`}
              >
                {section.secondaryAction.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FooterSection: React.FC<{ section?: WebsiteSection }> = () => {
  const { config, onNavigate } = useWebsiteContext();
  const theme = config.theme;
  const footer = config.footer;

  return (
    <footer 
      className="border-t py-16 px-4 sm:px-6 lg:px-8 transition-colors"
      style={{
        backgroundColor: theme.isDark ? '#080E1A' : '#F8FAFC',
        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        color: theme.textColor || (theme.isDark ? '#F8FAFC' : '#0F172A'),
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <div 
            onClick={() => onNavigate('/')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg text-white"
              style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
            >
              {(config.siteName || 'B')[0].toUpperCase()}
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              {footer.brandName || config.siteName}
            </span>
          </div>

          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            {footer.description || config.description || 'Crafting memorable, prestigious moments with passion and bespoke care.'}
          </p>

          {/* Socials */}
          {footer.socials && footer.socials.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              {footer.socials.map((soc, i) => (
                <a
                  key={i}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-white/30 transition-colors"
                >
                  {soc.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Columns */}
        {(footer.columns || []).map((col, idx) => (
          <div key={idx} className="space-y-3">
            <h5 className="font-bold text-sm uppercase tracking-wider text-white">
              {col.title}
            </h5>
            <ul className="space-y-2">
              {col.links.map((link, lidx) => (
                <li key={lidx}>
                  <button
                    onClick={() => {
                      if (link.href.startsWith('/')) {
                        onNavigate(link.href);
                      }
                    }}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>{footer.copyright || `© 2026 ${config.siteName}. All rights reserved.`}</p>
        <p className="flex items-center gap-1">
          <span>Powered by</span>
          <span className="font-semibold text-white">Boxput AI Website Builder</span>
        </p>
      </div>
    </footer>
  );
};
