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
  LogOut,
  Home,
  GraduationCap,
  Leaf,
  Layout,
  PlusCircle,
  FileText,
  ClipboardCheck,
  Image as ImageIcon,
  BarChart3,
  Briefcase
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type AgentNavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
};

const agentNavItems: AgentNavItem[] = [
  { id: 'dashboard', label: 'Home / Overview', icon: Home, path: '/dashboard/agent' },
  { id: 'farm-management', label: 'Manage Your Farm', icon: Layout, path: '/dashboard/agent/farm-management' },
  { id: 'media-gallery', label: 'Media Gallery', icon: ImageIcon, path: '/dashboard/agent/media' },
  { id: 'tasks-alerts', label: 'Tasks', icon: Briefcase, path: '/dashboard/agent/tasks' },
  { id: 'performance', label: 'My Performance', icon: BarChart3, path: '/dashboard/agent/performance' },
  { id: 'settings', label: 'Settings & Support', icon: Settings, path: '/dashboard/agent/profile' }
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
      <div className="space-y-8 px-2 py-4 pb-24 sm:px-6 sm:py-8 sm:pb-8">
        {children}
      </div>
    </DashboardLayout>
  );
};

export default AgentLayout;

