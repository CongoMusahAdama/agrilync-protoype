import api, { getApiBaseUrl } from '@/utils/api';

export type BlogAdminUser = {
  id: string;
  username?: string;
  email: string;
  requiresPasswordChange?: boolean;
};

export function getBlogAdminToken(): string | null {
  return localStorage.getItem('blogAdminToken');
}

export function getBlogAdminHeaders(): Record<string, string> {
  const token = getBlogAdminToken();
  return token ? { 'x-auth-token': token } : {};
}

export function getBackendOrigin(): string {
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}

/** Call on dashboard mount in production to surface misconfiguration early. */
export function assertApiConfiguredForProduction(): void {
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL?.trim()) {
    throw new Error(
      'VITE_API_URL is not configured for this production build. Set it to your live API (e.g. https://your-api.com/api).'
    );
  }
}

export function resolveUploadedImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${getBackendOrigin()}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
}

export function getApiErrorMessage(err: unknown, fallback = 'Request failed.'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { msg?: string } | string; status?: number } }).response;
    if (typeof res?.data === 'object' && res?.data?.msg) return res.data.msg;
    if (typeof res?.data === 'string' && res.data.trim()) return res.data;
    if (res?.status === 401) return 'Session expired. Please log in again.';
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export async function validateBlogAdminSession(): Promise<BlogAdminUser> {
  const { data } = await api.get<{ admin: BlogAdminUser }>('/blogs/auth/me', {
    headers: getBlogAdminHeaders(),
  });
  localStorage.setItem('blogAdminUser', JSON.stringify(data.admin));
  return data.admin;
}

export async function fetchAdminBlogs() {
  const { data } = await api.get('/blogs');
  return data;
}

export async function fetchAdminResources() {
  const { data } = await api.get('/resources/admin/all', {
    headers: getBlogAdminHeaders(),
  });
  return data;
}

export type SubscriberRecord = {
  _id: string;
  email: string;
  phone?: string;
  source?: string;
  lastResource?: string;
  createdAt: string;
  updatedAt?: string;
};

export async function fetchAdminSubscribers(): Promise<SubscriberRecord[]> {
  const { data } = await api.get<SubscriberRecord[]>('/blogs/subscribers', {
    headers: getBlogAdminHeaders(),
  });
  return data;
}

export async function uploadBlogImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post<{ imageUrl: string }>('/blogs/upload', formData, {
    headers: getBlogAdminHeaders(),
  });
  return resolveUploadedImageUrl(data.imageUrl);
}

export type BlogPostPayload = {
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  author: string;
  sendBlast?: boolean;
};

export async function createBlogPost(payload: BlogPostPayload) {
  const { data } = await api.post('/blogs', payload, { headers: getBlogAdminHeaders() });
  return data;
}

export async function updateBlogPost(id: string, payload: Omit<BlogPostPayload, 'sendBlast'>) {
  const { data } = await api.put(`/blogs/${id}`, payload, { headers: getBlogAdminHeaders() });
  return data;
}

export type ResourcePayload = {
  title: string;
  category: string;
  type: string;
  description: string;
  coverImage: string;
  documentUrl: string;
  badge: string;
  tags: string[];
  stats: string;
  published: boolean;
};

export async function createResource(payload: ResourcePayload) {
  const { data } = await api.post('/resources', payload, { headers: getBlogAdminHeaders() });
  return data;
}

export async function updateResource(id: string, payload: ResourcePayload) {
  const { data } = await api.put(`/resources/${id}`, payload, { headers: getBlogAdminHeaders() });
  return data;
}

export function clearBlogAdminSession(): void {
  localStorage.removeItem('blogAdminToken');
  localStorage.removeItem('blogAdminUser');
}
