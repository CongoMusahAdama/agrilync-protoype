/** Lync Grower / Solo Farmer / Investor dashboard URL prefixes */
export const END_USER_DASHBOARD_PREFIXES = [
    '/dashboard/grower',
    '/dashboard/farmer',
    '/dashboard/investor',
] as const;

export const isEndUserDashboardPath = (pathname: string): boolean =>
    END_USER_DASHBOARD_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
