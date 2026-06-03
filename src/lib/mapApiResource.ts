import {
  RESOURCE_CATEGORY_ICONS,
  DEFAULT_TYPE_BY_CATEGORY,
  type ResourceCategoryId,
} from '@/lib/resourceCategories';
import { getApiBaseUrl } from '@/utils/api';
import type { LucideIcon } from 'lucide-react';
import { FileText } from 'lucide-react';

export function resolvePublicAssetUrl(url: string): string {
  if (!url || url.startsWith('http')) return url;
  const origin = getApiBaseUrl().replace(/\/api\/?$/, '');
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}

export type ApiResourceRecord = {
  _id: string;
  title: string;
  category: string;
  type?: string;
  description: string;
  coverImage: string;
  documentUrl: string;
  badge?: string;
  tags?: string[];
  stats?: string;
};

export type DisplayResource = {
  id: string | number;
  category: string;
  type: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  accent: string;
  badge: string;
  badgeColor: string;
  featured: boolean;
  stats: string;
  link: string;
  driveLink: string;
  action: string;
  actionType: 'download' | 'link';
  tags: string[];
  bgImage: string;
  fromApi?: boolean;
};

const TEAL = '#002F37';
const GREEN = '#7ede56';
const MAGENTA = '#921573';

export function mapApiResourceToDisplay(r: ApiResourceRecord): DisplayResource {
  const cat = r.category as ResourceCategoryId;
  const Icon = RESOURCE_CATEGORY_ICONS[cat] || FileText;
  const isPremium = r.badge?.toLowerCase().includes('premium');

  return {
    id: `api-${r._id}`,
    category: r.category,
    type: r.type || DEFAULT_TYPE_BY_CATEGORY[cat] || 'Resource',
    title: r.title,
    description: r.description,
    icon: Icon,
    color: isPremium ? MAGENTA : TEAL,
    accent: isPremium ? '#c41d98' : GREEN,
    badge: r.badge || 'Free',
    badgeColor: isPremium ? 'bg-[#921573] text-white' : 'bg-[#7ede56] text-[#002f37]',
    featured: false,
    stats: r.stats || '',
    link: r.documentUrl,
    driveLink: r.documentUrl,
    action: 'Get Free Access',
    actionType: 'download',
    tags: r.tags?.length ? r.tags : [],
    bgImage: resolvePublicAssetUrl(r.coverImage),
    fromApi: true,
  };
}
