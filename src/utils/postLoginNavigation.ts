/** Where staff land after login or password change */
export const getStaffDashboardPath = (
    role?: string,
    hasChangedPassword?: boolean
): string => {
    if (role === 'super_admin') return '/dashboard/super-admin';
    if (role === 'supervisor') {
        if (!hasChangedPassword) return '/dashboard/agent/change-password';
        return '/dashboard/supervisor';
    }
    if (!hasChangedPassword) return '/dashboard/agent/change-password';
    return '/dashboard/agent';
};

export const SUPERVISOR_PENDING_PATH = '/dashboard/supervisor';
