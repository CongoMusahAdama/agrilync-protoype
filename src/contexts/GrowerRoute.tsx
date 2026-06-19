import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { GrowerProvider } from './GrowerContext';
import Preloader from '@/components/ui/Preloader';
import { isLocalhost } from '@/utils/env';
import { getAccountType, getGrowerToken } from '@/utils/authToken';
import { GROWER_ACCOUNT_TYPE } from '@/utils/growerRoutes';
import { isGrowerLocalhostBypass } from '@/utils/devGrower';
import { FARMER_APP_SIGNUP_PATH } from '@/constants/platformAccess';

/**
 * Protects /dashboard/grower/* — grower session only.
 * Localhost bypass + super-admin preview are dev/support paths only.
 * Everyone else is sent to the mobile-app signup prompt (no web dashboard).
 */
const GrowerRoute = () => {
    const { agent, loading, token } = useAuth();
    const location = useLocation();
    const hasGrowerSession =
        getAccountType() === GROWER_ACCOUNT_TYPE && !!getGrowerToken();
    const isLocalhostBypass = isGrowerLocalhostBypass() && !hasGrowerSession;
    const isStaffPreview =
        agent?.role === 'super_admin' && !!token && !hasGrowerSession;

    if (hasGrowerSession || isLocalhostBypass || isStaffPreview) {
        return (
            <GrowerProvider>
                <Outlet />
            </GrowerProvider>
        );
    }

    if (loading && !token && !hasGrowerSession) {
        return <Preloader />;
    }

    if (token && agent && !hasGrowerSession) {
        const agentHome =
            agent.role === 'super_admin'
                ? '/dashboard/super-admin'
                : agent.role === 'supervisor'
                  ? '/dashboard/supervisor'
                  : '/dashboard/agent';
        return <Navigate to={agentHome} replace />;
    }

    return (
        <Navigate
            to={FARMER_APP_SIGNUP_PATH}
            replace
            state={{ from: location.pathname, reason: 'grower-web-dashboard-retired' }}
        />
    );
};

export default GrowerRoute;
