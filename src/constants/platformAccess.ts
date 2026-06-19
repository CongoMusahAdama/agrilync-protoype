/** Web vs mobile platform access paths and timing constants */

export const FARMER_APP_SIGNUP_PATH = '/signup?app=grower';
export const SOLO_APP_SIGNUP_PATH = '/signup?app=solo';

/** Minimum grower mobile nav preloader display (ms) */
export const GROWER_NAV_PRELOADER_MS = 550;

/**
 * Investor web login is not wired to a backend yet (SignupInvestor is UI-only).
 * When implemented, route successful investor auth to `/dashboard/investor`.
 */
export const INVESTOR_DASHBOARD_PATH = '/dashboard/investor';
