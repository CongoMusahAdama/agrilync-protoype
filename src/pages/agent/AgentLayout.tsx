import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import SidebarProfileCard from '@/components/SidebarProfileCard';
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
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { agentProfile } from './agent-data';

type AgentNavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
};

const agentNavItems: AgentNavItem[] = [
  { id: 'profile-overview', label: 'Profile Overview', icon: Activity, path: '/dashboard/agent' },
  { id: 'farm-management', label: 'Farm Management', icon: Sprout, path: '/dashboard/agent/farm-management' },
  { id: 'investor-farmer-matches', label: 'Investor-Farmer Matches', icon: Handshake, path: '/dashboard/agent/investor-farmer-matches' },
  { id: 'dispute-management', label: 'Dispute Management', icon: AlertTriangle, path: '/dashboard/agent/dispute-management' },
  { id: 'training-performance', label: 'Training & Performance', icon: Calendar, path: '/dashboard/agent/training-performance' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/agent/notifications-center' }
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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(activeSection);

  useEffect(() => {
    // Sort items by path length descending to ensure specific paths are matched before general ones
    // e.g., '/dashboard/agent/farmers-management' should match before '/dashboard/agent'
    const sortedItems = [...agentNavItems].sort((a, b) => b.path.length - a.path.length);
    const match = sortedItems.find((item) => location.pathname.startsWith(item.path));

    if (match) {
      setCurrentSection(match.id);
    } else {
      setCurrentSection(activeSection);
    }
  }, [location.pathname, activeSection]);

  const handleNavigation = (item: AgentNavItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Set the section immediately for instant visual feedback
    setCurrentSection(item.id);
    // Then navigate
    navigate(item.path);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  const SidebarContent = ({ mobileView = false }: { mobileView?: boolean }) => (
    <div className="flex h-full flex-col">
      <div
        className={`p-4 border-b flex-shrink-0 ${darkMode ? 'border-gray-200/60' : 'border-[#002f37] border-opacity-20'
          }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
              alt="AgriLync Logo"
              className="h-8 w-8"
            />
            {(!sidebarCollapsed || mobileView) && (
              <span
                className={`text-xl font-bold ${darkMode ? 'text-[#002f37]' : 'text-[#f4ffee]'
                  }`}
              >
                AgriLync
              </span>
            )}
          </div>
          {!mobileView && (
            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className={`p-2 rounded-lg transition-colors ${darkMode
                ? 'text-[#002f37] hover:bg-gray-100'
                : 'text-[#f4ffee] hover:bg-[#01343c]'
                }`}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <SidebarProfileCard
          sidebarCollapsed={sidebarCollapsed && !mobileView}
          isMobile={mobileView}
          darkMode={darkMode}
          userType="agent"
        />
      </div>

      <nav className="flex-1 space-y-2 p-4 overflow-y-auto min-h-0">
        {agentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={(e) => handleNavigation(item, e)}
              className={`flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-[#7ede56] text-[#002f37] shadow-md'
                : darkMode
                  ? 'text-[#002f37] hover:bg-gray-100'
                  : 'text-[#f4ffee] hover:bg-[#01343c]'
                }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {(!sidebarCollapsed || mobileView) && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div
        className={`border-t p-4 flex-shrink-0 ${darkMode ? 'border-[#124b53] bg-[#0b2528]' : 'border-[#002f37] border-opacity-20 bg-[#002f37]'
          }`}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`flex w-full items-center gap-3 rounded-lg p-3 font-medium transition-colors ${darkMode
            ? 'bg-[#0d3a41] text-white hover:bg-[#124c56]'
            : 'bg-[#0a4a52] text-white hover:bg-[#0d606b]'
            }`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || mobileView) && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`h-screen overflow-hidden ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {isMobile && (
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent
              side="left"
              className={`w-[280px] p-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'} overflow-y-auto`}
            >
              <div className="flex h-full flex-col">
                <SidebarContent mobileView />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {!isMobile && (
          <div
            className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-white' : 'bg-[#002f37]'
              } flex-shrink-0 border-r transition-all duration-300 ${darkMode ? 'border-gray-200/60' : 'border-[#00404a]'
              } fixed left-0 top-0 h-screen z-30`}
          >
            <div className="flex h-full flex-col">
              <SidebarContent />
            </div>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'} ${!isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}`}>
          <div
            className={`${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white border-gray-200'} border-b px-3 py-3 sm:px-6 sm:py-4 sticky top-0 z-20`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileSidebarOpen(true)}
                    className={darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}
                    aria-label="Open sidebar"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Lync Agent Dashboard
                  </p>
                  <h1 className={`text-lg font-bold sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                  </h1>
                  {subtitle && (
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{subtitle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {headerActions}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 rounded-full px-3 ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={toggleDarkMode}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-gray-600" />}
                  <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' : ''}
                  onClick={() => navigate('/dashboard/agent/notifications')}
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </Button>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  onClick={() => navigate('/dashboard/agent/profile')}
                  role="button"
                >
                  <Avatar className="h-9 w-9 border-2 border-[#7ede56]">
                    <AvatarImage src={agentProfile.avatar} alt={agentProfile.name} />
                    <AvatarFallback className="bg-[#002f37] text-white text-sm font-semibold">
                      SM
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col sm:flex text-left">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {agentProfile.name}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Lync Agent · {agentProfile.region}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-3 py-6 sm:px-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLayout;

