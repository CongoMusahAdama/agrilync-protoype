/** AgriLync mobile app store links — set when iOS/Android apps are live. */
export const APP_STORE_URL = import.meta.env.VITE_APP_STORE_URL?.trim() || '';
export const PLAY_STORE_URL = import.meta.env.VITE_PLAY_STORE_URL?.trim() || '';

export const isMobileAppLive = Boolean(APP_STORE_URL || PLAY_STORE_URL);

export type FarmerMobileRole = 'grower' | 'solo';

export const FARMER_MOBILE_ROLE_LABELS: Record<FarmerMobileRole, string> = {
    grower: 'Lync Grower',
    solo: 'Solo Farmer',
};
