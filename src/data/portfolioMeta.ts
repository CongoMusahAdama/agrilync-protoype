export type PortfolioItem = {
  id: string | number;
  title: string;
  image: string;
  region: string;
  category: string;
  date: string;
  description: string;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
  /** Built-in gallery images — always shown first; hero is always the first static item. */
  isStatic?: boolean;
};

export const PORTFOLIO_REGIONS = [
  'All Regions',
  'Western Region',
  'Northern Region',
  'Bono Ahafo Region',
  'Ashanti Region',
  'Eastern Region',
  'Greater Accra Region',
  'Asunafo North Ahafo Region',
  'Ahafo Region',
  'Volta Region',
  'Central Region',
] as const;

export const PORTFOLIO_CATEGORIES = [
  'All Categories',
  'Pineapple Plantation',
  'Palm Nut Farming',
  'Conference',
  'Training',
  'Catfish Farming',
  'Poultry Farming',
  'Extension Services',
  'Community Outreach',
] as const;

/** Options for admin forms (without "All" prefix). */
export const PORTFOLIO_REGION_OPTIONS = PORTFOLIO_REGIONS.filter((r) => r !== 'All Regions');
export const PORTFOLIO_CATEGORY_OPTIONS = PORTFOLIO_CATEGORIES.filter((c) => c !== 'All Categories');
