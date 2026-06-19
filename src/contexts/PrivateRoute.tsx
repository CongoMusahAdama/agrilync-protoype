import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Preloader from '@/components/ui/Preloader';
import { isLocalhost } from '@/utils/env';
import { isEndUserDashboardPath, isAgentDashboardPath } from '@/utils/dashboardRoutes';
import { getGrowerToken, getAccountType } from '@/utils/authToken';
import { GROWER_ACCOUNT_TYPE, GROWER_ROUTES } from '@/utils/growerRoutes';
import { SUPERVISOR_PENDING_PATH } from '@/utils/postLoginNavigation';

const PrivateRoute = () => {
    const { agent, loading, token } = useAuth();
    const location = useLocation();
    const isEndUserPreview = isEndUserDashboardPath(location.pathname);
    const hasGrowerSession =
        getAccountType() === 'grower' && !!getGrowerToken();
    const canPreviewEndUserDashboard =
        isEndUserPreview && (isLocalhost() || agent?.role === 'super_admin' || hasGrowerSession);

    if (canPreviewEndUserDashboard) {
        return <Outlet />;
    }

    if (loading && !token) {
        return <Preloader />;
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (agent?.role === 'supervisor') {
        if (!agent.hasChangedPassword && location.pathname !== '/dashboard/agent/change-password') {
            return <Navigate to="/dashboard/agent/change-password" replace />;
        }
        const supervisorAllowed =
            location.pathname === SUPERVISOR_PENDING_PATH ||
            location.pathname === '/dashboard/agent/change-password';
        if (!supervisorAllowed) {
            return <Navigate to={SUPERVISOR_PENDING_PATH} replace />;
        }
        return <Outlet />;
    }

    if (agent && !agent.hasChangedPassword && location.pathname !== '/dashboard/agent/change-password') {
        return <Navigate to="/dashboard/agent/change-password" replace />;
    }

    if (
        isAgentDashboardPath(location.pathname) &&
        getAccountType() === GROWER_ACCOUNT_TYPE &&
        !!getGrowerToken()
    ) {
        return <Navigate to={GROWER_ROUTES.dashboard} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
