import React from 'react';
import { WebsiteSection } from '../../types/website';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection, FeaturesSection } from './sections/ServicesSection';
import { PricingSection } from './sections/PricingSection';
import { ProductCardsSection, RestaurantMenuSection } from './sections/ProductCardsSection';
import { GallerySection, TestimonialsSection } from './sections/GallerySection';
import { TeamSection, FaqSection } from './sections/TeamSection';
import { ContactSection, CtaSection } from './sections/ContactSection';
import { BlogSection, PortfolioSection } from './sections/BlogAndPortfolioSections';
import { PropertyListingsSection, PropertySearchSection, BookingFormSection } from './sections/RealEstateAndBookingSections';

export const SectionRenderer: React.FC<{ section: WebsiteSection }> = ({ section }) => {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} />;
    case 'about':
      return <AboutSection section={section} />;
    case 'services':
      return <ServicesSection section={section} />;
    case 'features':
      return <FeaturesSection section={section} />;
    case 'pricing':
      return <PricingSection section={section} />;
    case 'products':
      return <ProductCardsSection section={section} />;
    case 'restaurant-menu':
      return <RestaurantMenuSection section={section} />;
    case 'gallery':
      return <GallerySection section={section} />;
    case 'testimonials':
      return <TestimonialsSection section={section} />;
    case 'team':
      return <TeamSection section={section} />;
    case 'faq':
      return <FaqSection section={section} />;
    case 'contact':
      return <ContactSection section={section} />;
    case 'cta':
      return <CtaSection section={section} />;
    case 'blog':
      return <BlogSection section={section} />;
    case 'portfolio':
      return <PortfolioSection section={section} />;
    case 'property-listings':
      return <PropertyListingsSection section={section} />;
    case 'property-search':
      return <PropertySearchSection section={section} />;
    case 'booking-form':
      return <BookingFormSection section={section} />;
    default:
      return null;
  }
};
