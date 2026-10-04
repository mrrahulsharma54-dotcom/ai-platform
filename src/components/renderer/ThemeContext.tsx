import React, { createContext, useContext } from 'react';
import { ThemeConfig, WebsiteConfig } from '../../types/website';

interface WebsiteContextType {
  config: WebsiteConfig;
  activePageSlug: string;
  onNavigate: (slug: string) => void;
  onOpenBookingModal?: () => void;
  onContactSubmit?: (data: any) => void;
}

const WebsiteContext = createContext<WebsiteContextType | null>(null);

export function useWebsiteContext() {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsiteContext must be used within a WebsiteProvider');
  }
  return context;
}

export const WebsiteProvider: React.FC<{
  value: WebsiteContextType;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>;
};

export function getFontFamilyClass(font?: string): string {
  switch (font) {
    case 'playfair':
      return 'font-serif';
    case 'space-grotesk':
      return 'font-mono';
    case 'inter':
    case 'plus-jakarta':
    default:
      return 'font-sans';
  }
}

export function getBorderRadiusClass(radius?: string): string {
  switch (radius) {
    case 'none':
      return 'rounded-none';
    case 'sm':
      return 'rounded-sm';
    case 'md':
      return 'rounded-md';
    case 'lg':
      return 'rounded-2xl';
    case 'full':
      return 'rounded-full';
    default:
      return 'rounded-xl';
  }
}
