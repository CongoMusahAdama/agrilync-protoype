import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = () => {
    const { agent, loading, token } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
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
