import { getApiBaseUrl } from '@/utils/api';

/** API origin without /api suffix — where /uploads are served. */
export function getBackendOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}

const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;

/** Store paths like /uploads/blogs/... instead of localhost full URLs. */
export function normalizeStoredAssetUrl(url: string): string {
  if (!url?.trim()) return '';
  const trimmed = url.trim();
  if (LOCAL_ORIGIN.test(trimmed)) {
    const path = trimmed.replace(LOCAL_ORIGIN, '');
    return path.startsWith('/') ? path : `/${path}`;
  }
  const backendOrigin = getBackendOrigin();
  if (backendOrigin && trimmed.startsWith(backendOrigin)) {
    const path = trimmed.slice(backendOrigin.length);
    return path.startsWith('/') ? path : `/${path}`;
  }
  return trimmed;
}

/** Resolve image/document URLs for display on any domain (Netlify, .com, localhost). */
export function resolvePublicAssetUrl(url: string): string {
  if (!url?.trim()) return '';

  const trimmed = url.trim();

  if (trimmed.startsWith('/lovable-uploads') || trimmed.startsWith('/assets/')) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${trimmed}`;
    }
    return trimmed;
  }

  const backendOrigin = getBackendOrigin();

  if (LOCAL_ORIGIN.test(trimmed)) {
    const path = trimmed.replace(LOCAL_ORIGIN, '');
    return `${backendOrigin}${path.startsWith('/') ? path : `/${path}`}`;
  }

  if (trimmed.startsWith('/uploads')) {
    return `${backendOrigin}${trimmed}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${backendOrigin}${trimmed}`;
  }

  return trimmed;
}

/** Normalize blog HTML before save — keep /uploads paths relative in the database. */
export function normalizeBlogContent(html: string): string {
  if (!html) return html;
  const backendOrigin = getBackendOrigin();
  const escaped = backendOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html
    .replace(new RegExp(`${escaped}(/uploads/[^"'\\s>]+)`, 'gi'), '$1')
    .replace(
      /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/uploads\/[^"'\s>]+)/gi,
      '$3'
    );
}

/** Fix inline Quill images in blog HTML (localhost or relative /uploads paths). */
export function rewriteHtmlAssetUrls(html: string): string {
  if (!html) return html;
  const origin = getBackendOrigin();
  return html
    .replace(
      /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/uploads\/[^"'\s>]+)/gi,
      `${origin}$3`
    )
    .replace(/src="(\/uploads\/[^"]+)"/gi, `src="${origin}$1"`);
}
