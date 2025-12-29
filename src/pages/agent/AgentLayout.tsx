import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Menu,
  Moon,
  Sprout,
  Sun,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type AgentNavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
};

const agentNavItems: AgentNavItem[] = [
  { id: 'profile-overview', label: 'Dashboard', icon: Activity, path: '/dashboard/agent' },
  { id: 'farmers-management', label: 'Farmers Management', icon: Users, path: '/dashboard/agent/farmers-management' },
  { id: 'farm-management', label: 'Farm Management', icon: Sprout, path: '/dashboard/agent/farm-management' },
  { id: 'investor-farmer-matches', label: 'Investor-Farmer Matches', icon: Handshake, path: '/dashboard/agent/investor-farmer-matches' },
  { id: 'dispute-management', label: 'Dispute Management', icon: AlertTriangle, path: '/dashboard/agent/dispute-management' },
  { id: 'training-performance', label: 'Training & Performance', icon: Calendar, path: '/dashboard/agent/training-performance' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/agent/notifications-center' },
  { id: 'profile', label: 'Profile & Settings', icon: Settings, path: '/dashboard/agent/profile' }
];

interface AgentLayoutProps {
  activeSection: string;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

const AgentLayout: React.FC<AgentLayoutProps> = ({
  activeSection,
  title,
  subtitle,
  headerActions,
  children
}) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <DashboardLayout
      userType="agent"
      activeSidebarItem={activeSection}
      title={title}
      description={subtitle}
      headerActions={headerActions}
    >
      <div className="space-y-8 px-2 py-4 sm:px-6 sm:py-8">
        {children}
      </div>
    </DashboardLayout>
  );
};

export default AgentLayout;

