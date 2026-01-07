/**
 * Environment utilities
 * Shared utilities for environment detection
 */

/**
 * Check if we're running on localhost
 * Used to bypass authentication on localhost (still fetches from DB)
 */
export const isLocalhost = (): boolean => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
};
