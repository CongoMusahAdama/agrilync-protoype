import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';

const SuperAdminDashboard = () => {
    const location = useLocation();

    // Determine active sidebar item based on path
    const getActiveItem = () => {
        const path = location.pathname;
        if (path === '/dashboard/super-admin') return 'dashboard';
        if (path.includes('/regions')) return 'regional-performance';
        if (path.includes('/agents')) return 'agent-accountability';
        if (path.includes('/oversight')) return 'farm-oversight';
        if (path.includes('/partnerships')) return 'partnerships-summary';
        if (path.includes('/escalations')) return 'escalations';
        if (path.includes('/analytics')) return 'reports-analytics';
        if (path.includes('/logs')) return 'system-logs';
        if (path.includes('/settings')) return 'settings';
        return 'dashboard';
    };

    return (
        <DashboardLayout
            userType="super-admin"
            activeSidebarItem={getActiveItem()}
            title="AgriLync Super Admin"
            subtitle="Full Platform Visibility & Authority"
        >
            <Outlet />
        </DashboardLayout>
    );
};

export default SuperAdminDashboard;
