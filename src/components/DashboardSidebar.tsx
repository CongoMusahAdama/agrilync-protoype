import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    MapPin,
    BarChart3,
    Users,
    Calendar,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    ArrowRight,
    Leaf,
    Sprout,
    Handshake,
    AlertTriangle,
    Briefcase,
    GraduationCap
} from 'lucide-react';
import SidebarProfileCard from './SidebarProfileCard';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface DashboardSidebarProps {
    userType: string;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    activeSidebarItem: string;
    isMobile?: boolean;
    onNavigate?: (item: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    userType,
    sidebarCollapsed,
    setSidebarCollapsed,
    activeSidebarItem,
    isMobile = false,
    onNavigate
}) => {
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const sidebarDarkMode = !darkMode;

    const handleNavigation = (item: string) => {
        if (onNavigate) {
            onNavigate(item);
        } else {
            const routes: Record<string, string> = {
                'dashboard': userType === 'agent' ? '/dashboard/agent' : `/dashboard/${userType}`,
                'settings': userType === 'agent' ? '/dashboard/agent/profile' : `/dashboard/${userType}/settings`,
                'farm-analytics': `/dashboard/${userType}/farm-analytics`,
                'investor-matches': userType === 'agent' ? '/dashboard/agent/investor-farmer-matches' : `/dashboard/${userType}/investor-matches`,
                'training-sessions': userType === 'agent' ? '/dashboard/agent/training-performance' : `/dashboard/${userType}/training-sessions`,
                'farm-management': userType === 'agent' ? '/dashboard/agent/farm-management' : `/dashboard/${userType}/farm-management`,
                'notifications': userType === 'agent' ? '/dashboard/agent/notifications-center' : `/dashboard/${userType}/notifications`,
                'farmers-management': '/dashboard/agent/farmers-management',
                'dispute-management': '/dashboard/agent/dispute-management',
            };
            if (routes[item]) {
                navigate(routes[item]);
            }
        }
    };

    const navItems = userType === 'agent'
        ? [
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'farm-management', label: 'Field Operations', icon: Sprout },
            { id: 'investor-matches', label: 'Partnership Manager', icon: Handshake },
            { id: 'dispute-management', label: 'Resolution Center', icon: AlertTriangle },
            { id: 'training-sessions', label: 'Training & Performance', icon: GraduationCap },
            { id: 'notifications', label: 'Alert Center', icon: Bell },
            { id: 'settings', label: 'Profile & Settings', icon: Settings },
        ]
        : [
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'farm-management', label: 'Farm Management', icon: Leaf },
            { id: 'farm-analytics', label: 'Farm Analytics', icon: BarChart3 },
            { id: 'investor-matches', label: 'Investor Matches', icon: Users },
            { id: 'training-sessions', label: 'Training Sessions', icon: Calendar },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'settings', label: 'Profile & Settings', icon: Settings },
        ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Logo/App Name */}
            <div className={`p-4 border-b flex-shrink-0 ${sidebarDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <img
                            src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
                            alt="AgriLync Logo"
                            className="h-8 w-8"
                        />
                        {(!sidebarCollapsed || isMobile) && (
                            <span className={`text-xl font-bold ${sidebarDarkMode ? 'text-[#f4ffee]' : 'text-[#002f37]'}`}>AgriLync</span>
                        )}
                    </div>
                    {!isMobile && userType !== 'grower' && (
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className={`p-2 rounded-lg ${sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10' : 'text-[#002f37] hover:bg-gray-100'} transition-colors`}
                            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {sidebarCollapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            <SidebarProfileCard
                sidebarCollapsed={sidebarCollapsed && !isMobile}
                isMobile={isMobile}
                darkMode={darkMode}
                userType={userType}
            />

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm transition-all duration-200 ${activeSidebarItem === item.id
                            ? 'bg-[#7ede56] text-[#002f37] border-l-4 border-[#002f37] shadow-sm'
                            : sidebarDarkMode
                                ? 'text-[#f4ffee] hover:bg-white/10 border-l-4 border-transparent'
                                : 'text-[#002f37] hover:bg-gray-100 border-l-4 border-transparent'
                            }`}
                        onClick={() => handleNavigation(item.id)}
                        title={sidebarCollapsed && !isMobile ? item.label : undefined}
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {(!sidebarCollapsed || isMobile) && <span className="font-medium">{item.label}</span>}
                    </div>
                ))}
            </nav>

            <div className={`mt-auto p-4 border-t space-y-2 ${sidebarDarkMode ? 'border-gray-800' : 'border-gray-200'} ${sidebarDarkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
                <div
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10' : 'text-[#002f37] hover:bg-gray-100'}`}
                    onClick={toggleDarkMode}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {darkMode ? <Sun className="h-4 w-4 shrink-0 text-yellow-500" /> : <Moon className="h-4 w-4 shrink-0 text-gray-400" />}
                    {(!sidebarCollapsed || isMobile) && <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                </div>
                <div
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10' : 'text-[#002f37] hover:bg-gray-100'}`}
                    onClick={() => navigate('/')}
                >
                    <ArrowRight className="h-4 w-4 shrink-0" />
                    {(!sidebarCollapsed || isMobile) && <span className="font-medium">Log Out</span>}
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebar;
