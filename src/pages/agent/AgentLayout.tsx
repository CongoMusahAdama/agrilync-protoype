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
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, RefreshCw } from 'lucide-react';

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
  hideTopBar?: boolean;
}

const AgentLayout: React.FC<AgentLayoutProps> = ({
  activeSection,
  title,
  subtitle,
  headerActions,
  children,
  hideTopBar = false
}) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { agent } = useAuth();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

  return (
    <DashboardLayout
      userType="agent"
      activeSidebarItem={activeSection}
      title={title}
      description={subtitle}
      headerActions={headerActions}
      hideHeaderOnMobile={true}
    >
      <div className="space-y-6 px-2 py-4 pb-24 sm:px-6 sm:py-8 sm:pb-8">
        {isMobile && !hideTopBar && (
          <div className="sticky top-[-1px] z-50 bg-[#f8fafc]/95 backdrop-blur-md px-1 py-4 mb-6 -mx-2 border-b border-gray-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3 ml-2">
              <Avatar 
                className="h-11 w-11 border-2 border-[#7ede56]/30 shadow-md cursor-pointer"
                onClick={() => setProfileSheetOpen(true)}
              >
                <AvatarImage src={agent?.avatar} />
                <AvatarFallback className="bg-[#065f46] text-white text-xs font-bold">{agent?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setProfileSheetOpen(true)}>
                  <h1 className="text-[17px] font-bold text-[#002f37] leading-none">Hello {agent?.name?.split(' ')[0] || 'Musah'}!</h1>
                  <ChevronDown className="h-4 w-4 text-gray-500 mt-0.5" />
                </div>
                <span className="text-[11px] font-medium text-gray-500 mt-0.5">{agent?.agentId || '053 187 8243'}</span>
              </div>
            </div>
            <div className="relative mr-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white shadow-sm border border-gray-100 h-10 w-10"
                onClick={() => navigate('/dashboard/agent/notifications-center')}
              >
                <Bell className="h-6 w-6 text-[#002f37]" />
              </Button>
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>

            {/* Profile Popover - Floats from top like provided image */}
            <div 
              className={`absolute top-0 left-0 right-0 z-[60] bg-white rounded-b-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 transition-all duration-300 transform ${profileSheetOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
            >
              <div className="flex flex-col items-center text-center space-y-5 pb-2">
                {/* Close handle/indicator */}
                <div 
                   className="w-12 h-1 bg-gray-100 rounded-full mb-2 cursor-pointer"
                   onClick={() => setProfileSheetOpen(false)}
                />
                
                <Avatar className="h-20 w-20 border-[4px] border-[#7ede56]/20 shadow-xl">
                  <AvatarImage src={agent?.avatar} />
                  <AvatarFallback className="bg-[#065f46] text-white text-2xl font-bold">{agent?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-montserrat text-[#002f37] leading-tight mb-2 uppercase tracking-tight">{agent?.name || 'Musah Adams Congo'}</h3>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-gray-500 font-bold font-inter text-[13px] tabular-nums">
                      <span className="text-[#002f37]/40 uppercase tracking-widest text-[9px] font-inter">Agent ID:</span>
                      <span className="font-inter">{agent?.agentId || '053 187 8243'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 font-medium font-inter text-[11px] uppercase tracking-widest">
                       <span>{agent?.region || 'Upper East'}</span>
                       <span className="h-2 w-[1.5px] bg-gray-200"></span>
                       <span>{agent?.district || 'Bawku'}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 mt-1 border border-emerald-100">
                       <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56]"></div>
                       <span className="text-[#065f46] text-[10px] font-bold font-inter uppercase tracking-widest">Active Account</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-white hover:bg-gray-50 text-[#002f37] border border-gray-200 rounded-full h-12 font-bold font-montserrat text-[14px] shadow-sm mt-2 transition-all active:scale-[0.98]"
                  onClick={() => {
                     setProfileSheetOpen(false);
                     navigate('/dashboard/agent/profile');
                  }}
                >
                  MANAGE YOUR ACCOUNT
                </Button>
              </div>
            </div>
            
            {/* Backdrop for the top-popover */}
            {profileSheetOpen && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]"
                onClick={() => setProfileSheetOpen(false)}
              />
            )}
          </div>
        )}
        {children}
      </div>
    </DashboardLayout>
  );
};

export default AgentLayout;

