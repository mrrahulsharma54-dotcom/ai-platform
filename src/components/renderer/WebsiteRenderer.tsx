import React, { useState } from 'react';
import { WebsiteConfig, DeviceMode } from '../../types/website';
import { WebsiteProvider, getFontFamilyClass } from './ThemeContext';
import { NavbarSection } from './sections/NavbarSection';
import { SectionRenderer } from './SectionRenderer';
import { FooterSection } from './sections/ContactSection';
import { MessageSquare, X, CheckCircle2 } from 'lucide-react';

interface WebsiteRendererProps {
  config: WebsiteConfig;
  deviceMode?: DeviceMode;
  initialPageSlug?: string;
  isPublicView?: boolean;
}

export const WebsiteRenderer: React.FC<WebsiteRendererProps> = ({
  config,
  deviceMode = 'desktop',
  initialPageSlug = '/',
  isPublicView = false,
}) => {
  const [activePageSlug, setActivePageSlug] = useState<string>(initialPageSlug);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Find active page or fallback to first page
  const activePage = config.pages.find((p) => p.slug === activePageSlug) || config.pages[0];

  const theme = config.theme;
  const fontClass = getFontFamilyClass(theme.font);

  // Filter out any navbar/footer duplicate inside sections list
  const mainSections = (activePage?.sections || []).filter(
    (s) => s.type !== 'navbar' && s.type !== 'footer'
  );

  const deviceContainerClass =
    deviceMode === 'mobile'
      ? 'max-w-[390px] my-6 mx-auto rounded-[40px] shadow-2xl border-[10px] border-slate-800 overflow-hidden ring-1 ring-white/10'
      : deviceMode === 'tablet'
      ? 'max-w-[768px] my-6 mx-auto rounded-[28px] shadow-2xl border-[8px] border-slate-800 overflow-hidden ring-1 ring-white/10'
      : 'w-full';

  return (
    <WebsiteProvider
      value={{
        config,
        activePageSlug,
        onNavigate: (slug) => {
          setActivePageSlug(slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onOpenBookingModal: () => setBookingModalOpen(true),
      }}
    >
      <div className={`transition-all duration-300 ${deviceContainerClass}`}>
        <div
          className={`min-h-screen flex flex-col ${fontClass} selection:bg-amber-500 selection:text-white`}
          style={{
            backgroundColor: theme.backgroundColor || (theme.isDark ? '#0F172A' : '#FFFFFF'),
            color: theme.textColor || (theme.isDark ? '#F8FAFC' : '#0F172A'),
          }}
        >
          {/* Main Top Header / Navbar */}
          <NavbarSection />

          {/* Body Sections */}
          <main className="flex-1">
            {mainSections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </main>

          {/* Footer */}
          <FooterSection />

          {/* Floating WhatsApp Action Button */}
          {config.whatsappNumber && (
            <a
              href={`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
              title="Chat with us on WhatsApp"
            >
              <MessageSquare className="w-6 h-6" />
            </a>
          )}

          {/* Global Quick Booking Modal */}
          {bookingModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div 
                className="bg-slate-900 border border-white/20 p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl relative text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    setBookingSuccess(false);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>

                {bookingSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-400" />
                    <h3 className="text-xl font-bold">Request Received!</h3>
                    <p className="text-sm text-slate-300">
                      Our desk will reach out to finalize your reservation time.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setBookingSuccess(true);
                      setTimeout(() => {
                        setBookingModalOpen(false);
                        setBookingSuccess(false);
                      }, 2500);
                    }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold">Instant Inquiry / Reservation</h3>
                    <p className="text-xs text-slate-400">
                      Direct booking with {config.siteName}. Fast confirmation.
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Date & Notes</label>
                      <textarea
                        rows={2}
                        placeholder="Date, party size, or specific requirements..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
                    >
                      Confirm Booking Request
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </WebsiteProvider>
  );
};
