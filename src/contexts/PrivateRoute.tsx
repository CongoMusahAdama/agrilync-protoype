import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Preloader from '@/components/ui/Preloader';
import { isLocalhost } from '@/utils/env';

const PrivateRoute = () => {
    const { agent, loading, token } = useAuth();
    const location = useLocation();
    const isDev = isLocalhost();

    // On localhost, allow access without authentication for testing
    if (isDev && !token) {
        return <Outlet />;
    }

    if (loading && !token) {
        return <Preloader />;
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If agent hasn't changed their password, redirect to change password page
    if (agent && !agent.hasChangedPassword && location.pathname !== '/dashboard/agent/change-password') {
        return <Navigate to="/dashboard/agent/change-password" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
