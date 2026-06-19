/** Account type chosen at signup (Lync Grower). */
export const GROWER_ACCOUNT_TYPE = 'grower' as const;

export const GROWER_DASHBOARD_PREFIX = '/dashboard/grower';

/** Public self-service onboarding (outside dashboard shell). */
export const GROWER_SIGNUP_PATH = '/signup/grower';

export const GROWER_ROUTES = {
    dashboard: GROWER_DASHBOARD_PREFIX,
    account: `${GROWER_DASHBOARD_PREFIX}/account`,
    farmProfile: `${GROWER_DASHBOARD_PREFIX}/farm-profile`,
    projectFunding: `${GROWER_DASHBOARD_PREFIX}/project-funding`,
    training: `${GROWER_DASHBOARD_PREFIX}/training`,
    farmVisits: `${GROWER_DASHBOARD_PREFIX}/farm-visits`,
    yieldHarvest: `${GROWER_DASHBOARD_PREFIX}/yield-harvest`,
    help: `${GROWER_DASHBOARD_PREFIX}/help`,
    settings: `${GROWER_DASHBOARD_PREFIX}/settings`,
} as const;

/** Old routes → new IA (bookmarks / links). */
export const GROWER_LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
    [`${GROWER_DASHBOARD_PREFIX}/profile`]: GROWER_ROUTES.account,
    [`${GROWER_DASHBOARD_PREFIX}/farm-management`]: GROWER_ROUTES.farmProfile,
    [`${GROWER_DASHBOARD_PREFIX}/farm-analytics`]: GROWER_ROUTES.projectFunding,
    [`${GROWER_DASHBOARD_PREFIX}/training-sessions`]: GROWER_ROUTES.training,
    [`${GROWER_DASHBOARD_PREFIX}/notifications`]: GROWER_ROUTES.help,
};

export const isGrowerDashboardPath = (pathname: string): boolean =>
    pathname === GROWER_DASHBOARD_PREFIX || pathname.startsWith(`${GROWER_DASHBOARD_PREFIX}/`);
