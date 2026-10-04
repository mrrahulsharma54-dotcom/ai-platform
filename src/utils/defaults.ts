import { WebsiteConfig } from '../types/website';

export const EXAMPLE_PROMPTS = [
  {
    title: 'Luxury Restaurant in Delhi',
    prompt: 'Create a modern website for a luxury restaurant in Delhi called Royal Spice. Include Home, About, Menu, Gallery, Testimonials and Contact sections.',
    icon: 'Utensils',
    category: 'Hospitality',
  },
  {
    title: 'Pet Grooming & Spa',
    prompt: 'Create a modern, playful website for a pet grooming and boutique spa called Paws & Bubbles with services, pricing tiers, customer reviews, and appointment booking form.',
    icon: 'Sparkles',
    category: 'Pet Care',
  },
  {
    title: 'High-End Real Estate Agency',
    prompt: 'Build a luxury real estate agency website called Apex Living featuring property search, luxury villa listings, neighborhood guides, agent team, and VIP private consultation booking.',
    icon: 'Building2',
    category: 'Real Estate',
  },
  {
    title: 'SaaS AI Productivity Tool',
    prompt: 'Design a sleek dark-mode SaaS landing page for TaskFlow AI with interactive feature breakdown, pricing comparison, live metrics, tech integrations, and customer testimonials.',
    icon: 'Cpu',
    category: 'Technology',
  },
  {
    title: 'Modern Fitness & Crossfit Studio',
    prompt: 'Create a bold, energetic fitness studio website for IronForge Gym with workout classes schedule, trainer roster, membership tiers, transformation stories, and free pass booking.',
    icon: 'Dumbbell',
    category: 'Fitness',
  },
  {
    title: 'Creative Portfolio & Design Studio',
    prompt: 'Build a minimal, editorial portfolio website for Studio Mono showcasing architectural projects, design philosophy, client case studies, and project inquiry form.',
    icon: 'Palette',
    category: 'Creative',
  }
];

export const EDIT_SUGGESTIONS = [
  'Make the website more premium and luxurious',
  'Change the primary color to an electric cobalt blue',
  'Change the website to a sleek dark theme',
  'Add a WhatsApp contact floating button',
  'Add a modern pricing section with 3 tiers',
  'Add a customer testimonials section with 5-star reviews',
  'Make the hero section larger with a bold headline and dual CTAs',
  'Add an About page with company story and leadership team'
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-website';
}

export function repairJsonString(input: string): string {
  let cleaned = input.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  cleaned = cleaned.trim();

  // Try direct parse first
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch (e) {
    // Attempt basic repairs for common trailing comma or truncated closing braces
    let repaired = cleaned;
    // Remove trailing commas before closing braces/brackets
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

    // Count open vs close braces/brackets
    const openBraces = (repaired.match(/{/g) || []).length;
    const closeBraces = (repaired.match(/}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;

    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      repaired += ']';
    }
    for (let i = 0; i < openBraces - closeBraces; i++) {
      repaired += '}';
    }

    try {
      JSON.parse(repaired);
      return repaired;
    } catch {
      // Return original cleaned if repair was insufficient
      return cleaned;
    }
  }
}

export const DEFAULT_RESTAURANT_SITE: WebsiteConfig = {
  id: 'royal-spice-sample',
  siteName: 'Royal Spice',
  tagline: 'Authentic Indian Fine Dining & Royal Heritage Cuisine',
  businessType: 'Luxury Restaurant',
  description: 'Experience regal culinary excellence with centuries-old royal recipes reimagined for the modern connoisseur.',
  slug: 'royal-spice-restaurant',
  published: true,
  theme: {
    style: 'luxury',
    primaryColor: '#D97706', // warm amber / gold
    secondaryColor: '#B45309',
    backgroundColor: '#0F172A',
    textColor: '#F8FAFC',
    font: 'playfair',
    borderRadius: 'lg',
    isDark: true,
  },
  whatsappNumber: '+919876543210',
  contactEmail: 'reservations@royalspice.dining',
  contactPhone: '+91 11 4567 8900',
  address: 'Connaught Place, Inner Circle, New Delhi, India',
  navigation: {
    logoText: 'ROYAL SPICE',
    links: [
      { label: 'Home', pageSlug: '/' },
      { label: 'About', pageSlug: '/about' },
      { label: 'Menu', pageSlug: '/menu' },
      { label: 'Gallery', pageSlug: '/gallery' },
      { label: 'Contact', pageSlug: '/contact' },
    ],
    ctaButton: {
      text: 'Reserve a Table',
      action: 'booking',
    },
  },
  pages: [
    {
      name: 'Home',
      slug: '/',
      seo: {
        title: 'Royal Spice | Luxury Indian Dining in Delhi',
        description: 'Immerse yourself in authentic Awadhi & Mughlai royal cuisine in the heart of Delhi.',
      },
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          badge: 'Award-Winning Culinary Journey',
          title: 'Where Regal Flavors Meet Modern Elegance',
          subtitle: 'Step into an exquisite culinary palace of slow-cooked gravies, rare aromatic spices, and regal hospitality.',
          primaryAction: { text: 'Reserve Your Table', variant: 'primary' },
          secondaryAction: { text: 'Explore Royal Menu', variant: 'outline', pageSlug: '/menu' },
          backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
          layout: 'centered',
        },
        {
          id: 'features-1',
          type: 'features',
          badge: 'The Royal Distinction',
          title: 'Crafted with Royal Heritage',
          subtitle: 'Every creation honours time-tested recipes preserved across royal courts.',
          layout: 'cards',
          items: [
            {
              id: 'f1',
              title: 'Master Dum Chefs',
              description: 'Generations of culinary lineage specializing in slow dum pukht claypot cooking.',
              icon: 'ChefHat',
            },
            {
              id: 'f2',
              title: 'Single-Estate Spices',
              description: 'Hand-sourced saffron from Kashmir, cardamom from Idukki, and aged basmati.',
              icon: 'Sparkles',
            },
            {
              id: 'f3',
              title: 'Private Royal Dining',
              description: 'Intimate bespoke dining cabanas inspired by Rajputana architecture.',
              icon: 'Crown',
            },
          ],
        },
        {
          id: 'menu-highlights',
          type: 'restaurant-menu',
          badge: 'Chef Curations',
          title: 'Signature Dishes',
          subtitle: 'Handpicked culinary marvels celebrating rich regional diversity.',
          layout: 'grid',
          items: [
            {
              id: 'm1',
              title: 'Shahi Gosht Galouti Kebab',
              price: '$28',
              category: 'Royal Starters',
              description: 'Melt-in-mouth smoked lamb patties infused with 32 secret spices and rose essence.',
              image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
              highlighted: true,
            },
            {
              id: 'm2',
              title: 'Awadhi Dum Biryani',
              price: '$34',
              category: 'Main Course',
              description: 'Long grain aged basmati layered with tender saffron lamb sealed in purdah pastry.',
              image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
              highlighted: true,
            },
            {
              id: 'm3',
              title: 'Paneer Kundan Kalia',
              price: '$26',
              category: 'Vegetarian Royalties',
              description: 'Cottage cheese simmered in a luscious golden gravy infused with real edible gold leaf.',
              image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
            },
            {
              id: 'm4',
              title: 'Zafrani Kulfi Falooda',
              price: '$18',
              category: 'Desserts',
              description: 'Traditional slow-reduced milk kulfi topped with pistachios and rose nectar.',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
            }
          ]
        },
        {
          id: 'booking-section',
          type: 'booking-form',
          badge: 'Instant Reservation',
          title: 'Book Your Royal Experience',
          subtitle: 'Tables fill up rapidly. Reserve your luxury dining slot in advance.',
          layout: 'split',
          image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        },
        {
          id: 'testimonials-1',
          type: 'testimonials',
          badge: 'Guest Praises',
          title: 'Loved by Discerning Diners',
          subtitle: 'Honored with Michelin guide and world gourmet accolades.',
          layout: 'cards',
          items: [
            {
              id: 't1',
              author: 'Lord Julian Sterling',
              role: 'International Food Critic',
              description: 'The Shahi Biryani is arguably the most sublime interpretation in Asia. Flawless hospitality.',
              rating: 5,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            },
            {
              id: 't2',
              author: 'Priya Mehra',
              role: 'Luxury Lifestyle Editor',
              description: 'Stepping into Royal Spice feels like an intimate banquet in an ancient maharaja palace.',
              rating: 5,
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
            }
          ]
        },
        {
          id: 'cta-1',
          type: 'cta',
          badge: 'Private Banquets',
          title: 'Host Your Memorable Celebrations With Us',
          subtitle: 'From intimate wedding soirees to prestigious corporate dinners, our palace is at your service.',
          primaryAction: { text: 'Inquire for Events', variant: 'primary' },
          secondaryAction: { text: 'Call Desk Directly', variant: 'secondary' },
        }
      ],
    },
    {
      name: 'About',
      slug: '/about',
      seo: {
        title: 'About Us | Royal Spice Heritage',
        description: 'Discover the story, master chefs, and traditions behind Royal Spice Delhi.',
      },
      sections: [
        {
          id: 'about-hero',
          type: 'hero',
          badge: 'Our Heritage',
          title: 'A Tale of Royal Culinary Secrets',
          subtitle: 'Reviving centuries-old secret recipes handed down through generations of royal khansamas.',
          layout: 'centered',
          backgroundImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
        },
        {
          id: 'about-content',
          type: 'about',
          badge: 'Since 1982',
          title: 'Culinary Nobility in Every Morsel',
          description: 'Founded with a vision to preserve indigenous royal cooking arts that were disappearing into history. Royal Spice brings together ancient Dum Pukht techniques, slow copper deg charcoal cooking, and world-class sommelier pairings.',
          image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80',
          layout: 'split',
          items: [
            { id: 'ab1', title: 'Over 40 Years of Heritage', description: 'Celebrated by dignitaries and culinary enthusiasts worldwide.' },
            { id: 'ab2', title: '100% Organic Local Sourcing', description: 'Fresh farm-to-table dairy and artisanal stone-ground spices.' }
          ]
        },
        {
          id: 'team-section',
          type: 'team',
          badge: 'Our Culinary Masters',
          title: 'The Maestros in the Kitchen',
          subtitle: 'Guided by Executive Chef Raghuvendra Singh and a brigade of master specialists.',
          layout: 'cards',
          items: [
            {
              id: 'tm1',
              title: 'Chef Raghuvendra Singh',
              role: 'Executive Chef & Custodian',
              avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80',
              description: '30+ years perfecting Awadhi court cuisines and charcoal cooking techniques.'
            },
            {
              id: 'tm2',
              title: 'Ananya Deshmukh',
              role: 'Head Pastry & Confectionery',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
              description: 'Reimagining classic Mithai and saffron infused dessert creations.'
            }
          ]
        }
      ]
    },
    {
      name: 'Menu',
      slug: '/menu',
      seo: {
        title: 'Grand Menu | Royal Spice Delhi',
        description: 'Explore our complete royal menu including appetizers, gravies, biryanis, and desserts.',
      },
      sections: [
        {
          id: 'menu-full',
          type: 'restaurant-menu',
          badge: 'The Grand Carte',
          title: 'Exquisite Selections',
          subtitle: 'Prepared fresh to order in traditional clay tandoors and copper degs.',
          layout: 'grid',
          items: [
            { id: 'm10', title: 'Murgh Malai Peshawari', price: '$24', category: 'Royal Starters', description: 'Chicken supreme marinated in curd cheese and green cardamom.' },
            { id: 'm11', title: 'Tandoori Jheenga King Prawns', price: '$36', category: 'Royal Starters', description: 'Bay of Bengal tiger prawns char-grilled over acacia wood.' },
            { id: 'm12', title: 'Nalli Nihari Khaas', price: '$38', category: 'Main Course', description: 'Slow simmered lamb shanks in rich bone marrow reduction sauce.' },
            { id: 'm13', title: 'Dal Royal Makhani', price: '$22', category: 'Main Course', description: 'Slow cooked black lentils simmered for 36 hours over gentle charcoal embers.' },
            { id: 'm14', title: 'Subz Handi Biryani', price: '$26', category: 'Biryanis & Breads', description: 'Garden vegetables sealed with long-grain basmati and wild mint.' },
            { id: 'm15', title: 'Kesar Phirni in Clay Pots', price: '$16', category: 'Desserts', description: 'Creamy ground rice pudding infused with saffron and silver varq.' },
          ]
        }
      ]
    },
    {
      name: 'Gallery',
      slug: '/gallery',
      seo: {
        title: 'Gallery & Ambiance | Royal Spice',
        description: 'Take a virtual tour of our regal interiors, private booths, and culinary art.',
      },
      sections: [
        {
          id: 'gallery-sec',
          type: 'gallery',
          badge: 'Visual Experience',
          title: 'Moments of Majesty',
          subtitle: 'A glimpse into our opulent interiors and handcrafted dishes.',
          layout: 'grid',
          items: [
            { id: 'g1', title: 'Royal Main Dining Hall', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
            { id: 'g2', title: 'Artisanal Kebab Platter', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80' },
            { id: 'g3', title: 'The Private Alcove', image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80' },
            { id: 'g4', title: 'Claypot Saffron Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
            { id: 'g5', title: 'Sommelier Wine Lounge', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80' },
            { id: 'g6', title: 'Dessert Craftsmanship', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
          ]
        }
      ]
    },
    {
      name: 'Contact',
      slug: '/contact',
      seo: {
        title: 'Contact & Reservations | Royal Spice',
        description: 'Get in touch for table reservations, banquets, and directions.',
      },
      sections: [
        {
          id: 'contact-sec',
          type: 'contact',
          badge: 'Visit Us',
          title: 'We Look Forward to Welcoming You',
          subtitle: 'Conveniently located in central New Delhi with valet parking available.',
          layout: 'split',
        },
        {
          id: 'faq-sec',
          type: 'faq',
          badge: 'Dining Queries',
          title: 'Frequently Asked Questions',
          layout: 'cards',
          items: [
            { id: 'faq1', title: 'Do you require a dress code?', description: 'We recommend smart casual to formal attire in keeping with our fine dining ambiance.' },
            { id: 'faq2', title: 'Can you accommodate dietary restrictions?', description: 'Yes, our chefs curate dedicated Jain, vegan, gluten-free, and halal preparations upon request.' },
            { id: 'faq3', title: 'Is valet parking available?', description: 'Complimentary chauffeured valet parking is available right at our main entrance portico.' }
          ]
        }
      ]
    }
  ],
  footer: {
    brandName: 'ROYAL SPICE',
    description: 'Delhi’s crown jewel of authentic royal Indian gastronomy. Celebrating tradition, flavor, and aristocratic hospitality.',
    columns: [
      {
        title: 'Quick Links',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Royal Menu', href: '/menu' },
          { label: 'Our Story', href: '/about' },
          { label: 'Gallery', href: '/gallery' },
        ]
      },
      {
        title: 'Dining Hours',
        links: [
          { label: 'Lunch: 12:30 PM - 3:30 PM', href: '#' },
          { label: 'Dinner: 7:00 PM - 11:30 PM', href: '#' },
          { label: 'Sunday Royal Brunch: 12:00 PM - 4:00 PM', href: '#' },
        ]
      },
      {
        title: 'Contact',
        links: [
          { label: 'Connaught Place, New Delhi', href: '#' },
          { label: '+91 11 4567 8900', href: 'tel:+911145678900' },
          { label: 'reservations@royalspice.dining', href: 'mailto:reservations@royalspice.dining' },
        ]
      }
    ],
    socials: [
      { platform: 'Instagram', url: 'https://instagram.com' },
      { platform: 'Facebook', url: 'https://facebook.com' },
      { platform: 'TripAdvisor', url: 'https://tripadvisor.com' },
    ],
    copyright: '© 2026 Royal Spice Fine Dining Ltd. All rights reserved.',
    newsletter: {
      heading: 'Join The Connoisseur Club',
      placeholder: 'Enter your email for private tasting invitations',
      buttonText: 'Subscribe',
    }
  }
};
