export type ThemeStyle = 'modern' | 'luxury' | 'minimal' | 'bold' | 'playful' | 'tech';

export type FontFamily = 'inter' | 'plus-jakarta' | 'playfair' | 'space-grotesk' | 'system';

export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ThemeConfig {
  style: ThemeStyle;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  font: FontFamily;
  borderRadius: BorderRadius;
  isDark?: boolean;
}

export interface NavLink {
  label: string;
  pageSlug: string;
  href?: string;
}

export interface NavigationConfig {
  logoText: string;
  logoUrl?: string;
  links: NavLink[];
  ctaButton?: {
    text: string;
    action?: string;
    href?: string;
  };
}

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterConfig {
  brandName: string;
  description: string;
  columns: FooterColumn[];
  socials: Array<{ platform: string; url: string }>;
  copyright: string;
  newsletter?: {
    heading: string;
    placeholder: string;
    buttonText: string;
  };
}

export type SectionType =
  | 'navbar'
  | 'hero'
  | 'about'
  | 'services'
  | 'features'
  | 'pricing'
  | 'products'
  | 'restaurant-menu'
  | 'gallery'
  | 'testimonials'
  | 'team'
  | 'faq'
  | 'contact'
  | 'cta'
  | 'footer'
  | 'blog'
  | 'portfolio'
  | 'property-listings'
  | 'property-search'
  | 'booking-form';

export interface SectionAction {
  text: string;
  url?: string;
  pageSlug?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface SectionItem {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  price?: string | number;
  period?: string;
  category?: string;
  image?: string;
  icon?: string;
  features?: string[];
  highlighted?: boolean;
  rating?: number;
  author?: string;
  role?: string;
  avatar?: string;
  tags?: string[];
  date?: string;
  readTime?: string;
  specs?: { [key: string]: string | number };
  badge?: string;
}

export interface WebsiteSection {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  primaryAction?: SectionAction;
  secondaryAction?: SectionAction;
  image?: string;
  backgroundImage?: string;
  layout?: 'grid' | 'cards' | 'split' | 'centered' | 'carousel' | 'sidebar' | 'columns';
  items?: SectionItem[];
  extraData?: Record<string, any>;
}

export interface WebsitePage {
  name: string;
  slug: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  sections: WebsiteSection[];
}

export interface WebsiteConfig {
  id?: string;
  siteName: string;
  tagline?: string;
  businessType: string;
  description?: string;
  slug: string;
  published?: boolean;
  publishedUrl?: string;
  theme: ThemeConfig;
  navigation: NavigationConfig;
  pages: WebsitePage[];
  footer: FooterConfig;
  whatsappNumber?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  websiteConfig: WebsiteConfig;
  promptNote?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  projectName: string;
  businessType: string;
  slug: string;
  websiteConfig: WebsiteConfig;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  versionCount?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface GenerationStep {
  message: string;
  completed: boolean;
}
