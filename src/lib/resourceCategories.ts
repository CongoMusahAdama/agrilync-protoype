import {
  Wrench,
  BookOpen,
  FileText,
  Video,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

export const RESOURCE_CATEGORY_OPTIONS = [
  { id: 'tools', label: 'Tools' },
  { id: 'guides', label: 'Guides & eBooks' },
  { id: 'templates', label: 'Templates' },
  { id: 'videos', label: 'Video Recordings' },
  { id: 'reports', label: 'Reports' },
] as const;

export type ResourceCategoryId = (typeof RESOURCE_CATEGORY_OPTIONS)[number]['id'];

export const RESOURCE_CATEGORY_ICONS: Record<ResourceCategoryId, LucideIcon> = {
  tools: Wrench,
  guides: BookOpen,
  templates: FileText,
  videos: Video,
  reports: BarChart3,
};

export const DEFAULT_TYPE_BY_CATEGORY: Record<ResourceCategoryId, string> = {
  tools: 'Tool',
  guides: 'Guide',
  templates: 'Template',
  videos: 'Webinar',
  reports: 'Report',
};

export function getCategoryLabel(id: string): string {
  return RESOURCE_CATEGORY_OPTIONS.find(c => c.id === id)?.label ?? id;
}
