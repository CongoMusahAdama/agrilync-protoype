/** Resolve API base URL — production builds MUST set VITE_API_URL at build time. */
export function getApiBaseUrl(): string {
    const envUrl = import.meta.env.VITE_API_URL?.trim();
    if (envUrl) return envUrl.replace(/\/$/, '');
    if (import.meta.env.DEV) return '/api';
    console.error(
        '[AgriLync] VITE_API_URL is not set. Blog/resource publishing will fail in production.'
    );
    return 'http://127.0.0.1:5000/api';
}
