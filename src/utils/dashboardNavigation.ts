import { GROWER_ROUTES } from '@/utils/growerRoutes';

/** Shared dashboard sidebar / mobile nav route map */
export const getDashboardNavRoute = (userType: string, itemId: string): string | null => {
    const agentRoutes: Record<string, string> = {
        dashboard: '/dashboard/agent',
        settings: '/dashboard/agent/profile',
        'farm-analytics': '/dashboard/agent/farm-analytics',
        'investor-matches': '/dashboard/agent/investor-farmer-matches',
        'training-sessions': '/dashboard/agent/training-performance',
        'farm-management': '/dashboard/agent/farm-management',
        'tasks-alerts': '/dashboard/agent/tasks',
        notifications: '/dashboard/agent/notifications-center',
        'farmers-management': '/dashboard/agent/farmers-management',
        'media-gallery': '/dashboard/agent/media',
        performance: '/dashboard/agent/performance',
        'offline-field-guide': '/dashboard/agent/offline-guide',
    };

    const superAdminRoutes: Record<string, string> = {
        dashboard: '/dashboard/super-admin',
        settings: '/dashboard/super-admin/settings',
        'regional-performance': '/dashboard/super-admin/regions',
        'agent-management': '/dashboard/super-admin/agents',
        'field-audit': '/dashboard/super-admin/audit',
        'farm-oversight': '/dashboard/super-admin/oversight',
        escalations: '/dashboard/super-admin/escalations',
        performance: '/dashboard/super-admin/performance',
        'reports-analytics': '/dashboard/super-admin/analytics',
        'system-logs': '/dashboard/super-admin/logs',
    };

    const growerRoutes: Record<string, string> = {
        dashboard: GROWER_ROUTES.dashboard,
        account: GROWER_ROUTES.account,
        'farm-profile': GROWER_ROUTES.farmProfile,
        'project-funding': GROWER_ROUTES.projectFunding,
        training: GROWER_ROUTES.training,
        'farm-visits': GROWER_ROUTES.farmVisits,
        'yield-harvest': GROWER_ROUTES.yieldHarvest,
        help: GROWER_ROUTES.help,
        settings: GROWER_ROUTES.settings,
    };

    if (userType === 'agent') return agentRoutes[itemId] ?? null;
    if (userType === 'super-admin') return superAdminRoutes[itemId] ?? null;
    if (userType === 'grower') return growerRoutes[itemId] ?? null;

    return agentRoutes[itemId] ?? `/dashboard/${userType}/${itemId}`;
};
