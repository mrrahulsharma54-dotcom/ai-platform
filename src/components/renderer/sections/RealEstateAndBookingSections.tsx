import React, { useState } from 'react';
import { Bed, Bath, Maximize2, MapPin, Search, Calendar, Users, Clock, CheckCircle2 } from 'lucide-react';
import { WebsiteSection } from '../../../types/website';
import { useWebsiteContext, getBorderRadiusClass } from '../ThemeContext';

export const PropertySearchSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto -mt-14 relative z-20">
      <div className={`p-6 sm:p-8 bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl ${radius}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="City or neighborhood"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Property Type</label>
            <select className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500">
              <option>All Properties</option>
              <option>Luxury Villa</option>
              <option>Penthouse</option>
              <option>Estate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Price Range</label>
            <select className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500">
              <option>Any Price</option>
              <option>$500k - $1M</option>
              <option>$1M - $3M</option>
              <option>$3M+</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              className={`w-full py-2.5 font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform ${radius}`}
              style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
            >
              <Search className="w-4 h-4" />
              <span>Search Listings</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const PropertyListingsSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config, onOpenBookingModal } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const defaultProperties = [
    {
      id: 'pr1',
      title: 'Villa Paradiso Waterfront',
      subtitle: 'Goa Coastline',
      price: '$2,850,000',
      description: 'Private infinity pool, panoramic Arabian Sea views, 5 bespoke suites and private staff quarters.',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      specs: { beds: '5 Beds', baths: '6 Baths', area: '6,400 sq.ft' },
      badge: 'Exclusive Exclusive',
    },
    {
      id: 'pr2',
      title: 'The Sky Sanctuary Penthouse',
      subtitle: 'Central Delhi',
      price: '$4,200,000',
      description: 'Double height glass atrium, private rooftop garden, temperature controlled cellar, 4 garage bays.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      specs: { beds: '4 Beds', baths: '5 Baths', area: '7,800 sq.ft' },
      badge: 'Rare Find',
    },
    {
      id: 'pr3',
      title: 'Aura Forest Pavilion Estate',
      subtitle: 'Aravali Hills',
      price: '$1,950,000',
      description: 'Secluded 3-acre modern sanctuary surrounded by native teak woods with solar sustainable systems.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      specs: { beds: '4 Beds', baths: '4 Baths', area: '5,200 sq.ft' },
    },
  ];

  const items = section.items && section.items.length > 0 ? section.items : defaultProperties;

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
          {section.title || 'Premier Property Portfolio'}
        </h2>
        {section.subtitle && <p className="text-lg text-slate-400">{section.subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((prop, idx) => (
          <div
            key={prop.id || idx}
            className={`overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between ${radius}`}
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={prop.image || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'}
                  alt={prop.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {prop.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur text-amber-400 border border-amber-400/20">
                    {prop.badge}
                  </span>
                )}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur text-white font-extrabold text-base">
                  {prop.price}
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{prop.subtitle || 'Prime Location'}</span>
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {prop.title}
                </h4>
                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-white/10 mt-4">
              <div className="flex items-center justify-between text-xs text-slate-300 py-3">
                <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-slate-400" /> {prop.specs?.beds || '4 Beds'}</span>
                <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-slate-400" /> {prop.specs?.baths || '4 Baths'}</span>
                <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4 text-slate-400" /> {prop.specs?.area || '4,500 sq ft'}</span>
              </div>
              <button
                onClick={onOpenBookingModal}
                className={`w-full py-2.5 text-xs font-bold text-white uppercase tracking-wider rounded-xl transition-all shadow`}
                style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
              >
                Inquire For Private Tour
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const BookingFormSection: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  const { config } = useWebsiteContext();
  const theme = config.theme;
  const radius = getBorderRadiusClass(theme.borderRadius);

  const [booked, setBooked] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: '2 Guests',
    notes: '',
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => setBooked(false), 5000);
  };

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className={`overflow-hidden border border-white/10 bg-slate-900/90 shadow-2xl ${radius}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Visual Column */}
          <div className="relative min-h-[350px] lg:min-h-full">
            <img
              src={section.image || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80'}
              alt={section.title || 'Booking'}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-8 sm:p-12">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-2">
                Guaranteed Excellence
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {section.title || 'Reserve Your Private Experience'}
              </h3>
              <p className="text-slate-300 text-sm mt-2 max-w-md">
                {section.subtitle || 'Experience unmatched hospitality and customized attention tailored precisely to your party.'}
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="p-8 sm:p-12">
            {booked ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-400 animate-bounce" />
                <h4 className="text-2xl font-bold text-white">Reservation Confirmed!</h4>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  A confirmation SMS and email have been dispatched with your booking itinerary.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <h4 className="text-xl font-bold text-white mb-2">Schedule Your Appointment</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formState.date}
                      onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Preferred Time
                    </label>
                    <select
                      value={formState.time}
                      onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="12:30">12:30 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="19:00">07:00 PM</option>
                      <option value="20:30">08:30 PM</option>
                      <option value="21:30">09:30 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Party Size
                    </label>
                    <select
                      value={formState.guests}
                      onChange={(e) => setFormState({ ...formState, guests: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option>1 Person</option>
                      <option>2 Guests</option>
                      <option>4 Guests</option>
                      <option>6+ VIP Banquet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Dietary or Seating Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={formState.notes}
                    onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                    placeholder="e.g. Window booth, anniversary celebration..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${radius}`}
                  style={{ backgroundColor: theme.primaryColor || '#4F46E5' }}
                >
                  Complete Instant Booking
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
