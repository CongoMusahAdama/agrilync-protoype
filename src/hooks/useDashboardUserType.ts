import { useParams, useLocation } from 'react-router-dom';
import { isGrowerDashboardPath } from '@/utils/growerRoutes';

/**
 * Resolves dashboard user type from URL params or explicit grower routes.
 * Grower pages use fixed paths (/dashboard/grower/...) without a :userType segment.
 */
export function useDashboardUserType(): string | undefined {
    const { userType } = useParams();
    const location = useLocation();

    if (userType) return userType;
    if (isGrowerDashboardPath(location.pathname)) return 'grower';

    return undefined;
}
