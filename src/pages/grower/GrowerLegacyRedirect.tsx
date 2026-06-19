import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GROWER_LEGACY_ROUTE_REDIRECTS } from '@/utils/growerRoutes';

/** Redirects old grower URLs to the new simplified IA. */
const GrowerLegacyRedirect: React.FC = () => {
    const { pathname } = useLocation();
    const target = GROWER_LEGACY_ROUTE_REDIRECTS[pathname];
    if (!target) {
        return <Navigate to="/dashboard/grower" replace />;
    }
    return <Navigate to={target} replace />;
};

export default GrowerLegacyRedirect;
