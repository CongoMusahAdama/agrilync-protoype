import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getStaffDashboardPath } from '@/utils/postLoginNavigation';
import Preloader from '@/components/ui/Preloader';

const SuperAdminDashboard = () => {
    const location = useLocation();
    const { agent, loading } = useAuth();

    if (loading) {
        return <Preloader />;
    }

    if (!agent || agent.role !== 'super_admin') {
        return <Navigate to={getStaffDashboardPath(agent?.role, agent?.hasChangedPassword)} replace />;
    }

    // Determine active sidebar item based on path
    const getActiveItem = () => {
        const path = location.pathname;
        if (path === '/dashboard/super-admin') return 'dashboard';
        if (path.includes('/regions')) return 'regional-performance';
        if (path.includes('/agents') || path.includes('/users')) return 'agent-management';
        if (path.includes('/audit')) return 'field-audit';
        if (path.includes('/oversight') || path.includes('/farms')) return 'farm-oversight';
        if (path.includes('/performance')) return 'performance';
        if (path.includes('/partnerships')) return 'partnerships-summary';
        if (path.includes('/escalations')) return 'escalations';
        if (path.includes('/analytics') || path.includes('/reports')) return 'reports-analytics';
        if (path.includes('/logs')) return 'system-logs';
        if (path.includes('/settings')) return 'settings';
        if (path.includes('/notifications')) return 'notifications';
        return 'dashboard';
    };

    const pageTitles: Record<string, string> = {
        dashboard: 'Overview',
        'regional-performance': 'Regional Performance',
        'agent-management': 'Admin Setup',
        'field-audit': 'Field Audit',
        'farm-oversight': 'Farm Oversight',
        performance: 'Performance',
        'partnerships-summary': 'Partnerships',
        escalations: 'Escalations',
        'reports-analytics': 'Reports',
        'system-logs': 'System Logs',
        settings: 'Settings',
        notifications: 'Notifications',
    };

    const activeItem = getActiveItem();

    return (
        <DashboardLayout
            userType="super-admin"
            activeSidebarItem={activeItem}
            title={pageTitles[activeItem] || 'Super Admin'}
            subtitle="Platform control & oversight"
        >
            <Outlet />
        </DashboardLayout>
    );
};

export default SuperAdminDashboard;
