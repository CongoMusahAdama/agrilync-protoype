import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Bell, Sun, Moon, Home, MapPin, BarChart3, Settings, Plus, Users, Calendar, Leaf, Bot, AlertTriangle, Search } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import Preloader from './ui/Preloader';
import AddFarmerModal from './agent/AddFarmerModal';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import api from '@/utils/api';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { agentNotifications } from '@/pages/agent/agent-data';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeSidebarItem: string;
    title?: string;
    subtitle?: string;
    description?: string; // Add description as an alias for subtitle
    userType?: string; // Allow passing userType explicitly
    headerActions?: React.ReactNode; // Allow custom header actions
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    activeSidebarItem,
    title,
    subtitle,
    description,
    userType: explicitUserType,
    headerActions
}) => {
    const { userType: paramUserType } = useParams();
    const userType = explicitUserType || paramUserType;
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const isMobile = useIsMobile();
    const { agent } = useAuth();
    const queryClient = useQueryClient();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isInitialMount, setIsInitialMount] = useState(false);
    const [addFarmerModalOpen, setAddFarmerModalOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const location = useLocation();
    const [prevPath, setPrevPath] = useState(location.pathname);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        // Check if we're on the farm management page already
        if (location.pathname.includes('/farm-management')) {
            navigate(`${location.pathname}?search=${encodeURIComponent(searchQuery)}`);
            toast.success(`Filtering farms for: ${searchQuery}`);
        } else {
            // Navigate to farms page and pass the search query in URL
            toast.loading('Searching...', { duration: 500 });
            setTimeout(() => {
                navigate(`/dashboard/${userType}/farm-management?search=${encodeURIComponent(searchQuery)}`);
                toast.success(`Showing results for: ${searchQuery}`);
            }, 500);
        }
    };

    // Check if any queries are fetching to show preloader
    const isFetching = queryClient.isFetching() > 0;

    // Notifications are now fetched as part of the dashboard summary in most views,
    // but the sidebar needs them globally. keeping them but making it more efficient.
    useEffect(() => {
        if (userType === 'agent') {
            const fetchNotifications = async () => {
                try {
                    // Only fetch if we don't already have them from a higher-level query if applicable
                    const res = await api.get('/notifications');
                    setNotifications(res.data);
                } catch (err) {
                    // Fail silently for notifications to not block the UI
                    console.error('Failed to fetch notifications', err);
                }
            };
            fetchNotifications();
        }
    }, [userType]);

    // Track initial mount and show preloader on first dashboard load
    useEffect(() => {
        if (location.pathname.startsWith('/dashboard')) {
            setIsLoading(false);
            setIsNavigating(false);
            setIsInitialMount(false);
        }
    }, [location.pathname, agent]);

    const effectiveSubtitle = description || subtitle;
    const currentTitle = title || 'Dashboard';
    const activeNotifications = userType === 'agent' ? notifications : agentNotifications;

    return (
        <div className={`h-screen overflow-hidden font-inter ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
            {/* Full-page preloader only on initial app boot if needed, otherwise rely on skeletons */}
            {/* Preloader removed to improve perceived performance */}
            <div className="flex h-full">
                {/* Mobile Sidebar */}
                {isMobile && (
                    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                        <SheetContent side="left" className={`w-[280px] p-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'}`}>
                            <SheetHeader className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>Access different sections of the dashboard</SheetDescription>
                            </SheetHeader>
                            <DashboardSidebar
                                userType={userType || ''}
                                sidebarCollapsed={false}
                                setSidebarCollapsed={() => { }}
                                activeSidebarItem={activeSidebarItem}
                                isMobile={true}
                                onNavigate={(item) => {
                                    setMobileSidebarOpen(false);
                                    const routes: Record<string, string> = {
                                        'dashboard': userType === 'agent' ? '/dashboard/agent' : `/dashboard/${userType}`,
                                        'settings': userType === 'agent' ? '/dashboard/agent/profile' : `/dashboard/${userType}/settings`,
                                        'farm-analytics': `/dashboard/${userType}/farm-analytics`,
                                        'investor-matches': userType === 'agent' ? '/dashboard/agent/investor-farmer-matches' : `/dashboard/${userType}/investor-matches`,
                                        'training-sessions': userType === 'agent' ? '/dashboard/agent/training-performance' : `/dashboard/${userType}/training-sessions`,
                                        'farm-management': userType === 'agent' ? '/dashboard/agent/farm-management' : `/dashboard/${userType}/farm-management`,
                                        'tasks-alerts': '/dashboard/agent/tasks',
                                        'notifications': userType === 'agent' ? '/dashboard/agent/notifications-center' : `/dashboard/${userType}/notifications`,
                                        'farmers-management': '/dashboard/agent/farmers-management',
                                        'media-gallery': '/dashboard/agent/media',
                                        'performance': userType === 'agent' ? '/dashboard/agent/performance' : `/dashboard/${userType}/performance`,
                                        // Super Admin Routes
                                        'regional-performance': '/dashboard/super-admin/regions',
                                        'agent-accountability': '/dashboard/super-admin/agents',
                                        'farm-oversight': '/dashboard/super-admin/oversight',
                                        'partnerships-summary': '/dashboard/super-admin/partnerships',
                                        'escalations': '/dashboard/super-admin/escalations',
                                        'reports-analytics': '/dashboard/super-admin/analytics',
                                        'system-logs': '/dashboard/super-admin/logs',
                                    };
                                    if (routes[item]) {
                                        navigate(routes[item]);
                                    }
                                }}
                            />
                        </SheetContent>
                    </Sheet>
                )}

                {/* Desktop Sidebar */}
                {!isMobile && (
                    <div className={`${userType === 'grower' ? 'w-64' : (sidebarCollapsed ? 'w-16' : 'w-72')} bg-[#065f46] flex-shrink-0 transition-all duration-300 shadow-xl`}>
                        <DashboardSidebar
                            userType={userType || ''}
                            sidebarCollapsed={sidebarCollapsed}
                            setSidebarCollapsed={setSidebarCollapsed}
                            activeSidebarItem={activeSidebarItem}
                        />
                    </div>
                )}

                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-colors bg-[#f8fafc]`}>
                    {/* Top Header */}
                    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 md:px-8 py-0 sticky top-0 z-20 shadow-sm">
                        <div className="flex items-center justify-between h-[68px]">

                            {/* Left: Mobile menu + Search */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {isMobile && (
                                    <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(true)} className="md:hidden -ml-2 shrink-0">
                                        <Menu className="h-5 w-5 text-gray-600" />
                                    </Button>
                                )}
                                {/* Premium Search Bar */}
                                <form onSubmit={handleSearch} className="hidden md:flex relative max-w-sm w-full group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#065f46] transition-colors duration-200" />
                                    </div>
                                    <input
                                        type="search"
                                        placeholder="Search farmer, farm, ID…"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-[#f1f5f9] border border-transparent rounded-full py-2.5 pl-11 pr-[90px] text-[14px] text-gray-700 font-inter font-medium focus:bg-white focus:border-[#065f46]/30 focus:ring-4 focus:ring-[#065f46]/8 transition-all outline-none placeholder:text-gray-400 placeholder:font-normal"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute inset-y-1.5 right-1.5 px-5 bg-[#065f46] hover:bg-[#065f46]/90 text-white text-xs font-semibold rounded-full transition-all flex items-center gap-1 shadow-sm"
                                        style={{ opacity: searchQuery ? 1 : 0, pointerEvents: searchQuery ? 'auto' : 'none' }}
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>

                            {/* Right: Actions + Profile */}
                            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                {headerActions}

                                {/* Notification Bell */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative h-10 w-10 rounded-full text-gray-500 hover:text-[#065f46] hover:bg-[#065f46]/8 transition-all"
                                >
                                    <Bell className="h-[18px] w-[18px]" />
                                    {activeNotifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#7ede56] border-2 border-white shadow-sm"></span>
                                    )}
                                </Button>
                                 {/* Settings */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full text-gray-500 hover:text-[#065f46] hover:bg-[#065f46]/8 transition-all"
                                    onClick={() => navigate(userType === 'agent' ? '/dashboard/agent/profile' : `/dashboard/${userType}/settings`)}
                                >
                                    <Settings className="h-[18px] w-[18px]" />
                                </Button>

                                {/* Divider */}
                                <div className="hidden sm:block w-px h-8 bg-gray-100 mx-2" />

                                {/* User Profile */}
                                <div
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => navigate(userType === 'agent' ? '/dashboard/agent/profile' : `/dashboard/${userType}/settings`)}
                                >
                                    {/* Text info */}
                                    <div className="hidden sm:flex flex-col items-end">

                                        <span className="text-[14px] font-semibold text-gray-900 group-hover:text-[#065f46] transition-colors leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {agent?.name ? agent.name : <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />}
                                        </span>
                                        <span className="text-[11px] font-bold text-[#065f46] uppercase tracking-wider leading-tight">
                                            {agent?.role === 'super_admin' ? 'Super Admin' : agent?.role === 'supervisor' ? 'Supervisor' : 'Field Agent'}
                                        </span>
                                    </div>

                                    {/* Avatar with gradient ring */}
                                    <div className="relative">
                                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#065f46] to-[#7ede56] opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                        <Avatar className="relative h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarImage src={agent?.avatar} />
                                            <AvatarFallback className="bg-[#065f46] text-white text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                {agent?.name ? agent.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : ''}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
                        {children}
                    </main>

                    {/* Mobile Bottom Navigation - Matching the premium design */}
                    {isMobile && (
                        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
                            <div className={`flex items-center justify-between px-2 py-3 rounded-2xl shadow-2xl border ${darkMode ? 'bg-[#003c47]/95 border-gray-700 backdrop-blur-md' : 'bg-white/95 border-gray-200 backdrop-blur-md'}`}>
                                {userType === 'grower' ? (
                                    <>
                                        {/* Home */}
                                        <button
                                            onClick={() => navigate(`/dashboard/grower`)}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'dashboard' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'dashboard' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <Home className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Home</span>
                                        </button>

                                        {/* Farm Management */}
                                        <button
                                            onClick={() => navigate(`/dashboard/grower/farm-management`)}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'farm-management' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'farm-management' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <Leaf className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Farm</span>
                                        </button>

                                        {/* AI Advisory Action - Circular Center Button */}
                                        <div className="relative -top-4 sm:-top-5 px-1">
                                            <button
                                                onClick={() => navigate(`/dashboard/grower/training-sessions?tab=advisory`)}
                                                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#7ede56] shadow-lg flex items-center justify-center text-[#002f37] border-4 border-[#002f37] active:scale-90 transition-transform group"
                                            >
                                                <div className="bg-[#002f37] rounded-full p-2 group-hover:bg-[#003c47] transition-colors">
                                                    <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-[#7ede56]" />
                                                </div>
                                            </button>
                                        </div>

                                        {/* Analytics */}
                                        <button
                                            onClick={() => navigate(`/dashboard/grower/farm-analytics`)}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'farm-analytics' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'farm-analytics' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <BarChart3 className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Analytics</span>
                                        </button>

                                        {/* Settings / Profile */}
                                        <button
                                            onClick={() => navigate(`/dashboard/grower/settings`)}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'settings' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'settings' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <Settings className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Profile</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Agent/Super Admin Navigation */}
                                        {/* Home */}
                                        <button
                                            onClick={() => navigate(userType === 'agent' ? '/dashboard/agent' : '/dashboard/super-admin')}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'dashboard' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'dashboard' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <Home className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Home</span>
                                        </button>

                                        {/* Farmers Management / Regions */}
                                        <button
                                            onClick={() => navigate(userType === 'agent' ? '/dashboard/agent/farmers-management' : '/dashboard/super-admin/regions')}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'farmers-management' || activeSidebarItem === 'regional-performance' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'farmers-management' || activeSidebarItem === 'regional-performance' ? 'bg-[#7ede56]/10' : ''}`}>
                                                {userType === 'agent' ? <Users className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                                            </div>
                                            <span className="text-[10px] font-bold">{userType === 'agent' ? 'Farmers' : 'Regions'}</span>
                                        </button>

                                        {/* Quick Action */}
                                        <div className="relative -top-5 px-1">
                                            <button
                                                onClick={() => {
                                                    if (userType === 'agent') {
                                                        setAddFarmerModalOpen(true);
                                                    } else {
                                                        navigate('/dashboard/super-admin/settings');
                                                    }
                                                }}
                                                className="h-14 w-14 rounded-full bg-[#7ede56] shadow-lg flex items-center justify-center text-[#002f37] border-4 border-[#002f37] active:scale-90 transition-transform"
                                            >
                                                <div className="bg-[#002f37] rounded-full p-2">
                                                    <Plus className="h-6 w-6 text-[#7ede56]" />
                                                </div>
                                            </button>
                                        </div>

                                        {/* Training / Escalations */}
                                        <button
                                            onClick={() => navigate(userType === 'agent' ? '/dashboard/agent/training-performance' : '/dashboard/super-admin/escalations')}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'training-sessions' || activeSidebarItem === 'escalations' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'training-sessions' || activeSidebarItem === 'escalations' ? 'bg-[#7ede56]/10' : ''}`}>
                                                {userType === 'agent' ? <Calendar className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                                            </div>
                                            <span className="text-[10px] font-bold">{userType === 'agent' ? 'Training' : 'Alerts'}</span>
                                        </button>

                                        {/* Settings / Profile */}
                                        <button
                                            onClick={() => navigate(userType === 'agent' ? '/dashboard/agent/profile' : '/dashboard/super-admin/settings')}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'settings' || activeSidebarItem === 'profile' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'settings' || activeSidebarItem === 'profile' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <Settings className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Profile</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Global Modals for Agent */}
            {userType === 'agent' && (
                <AddFarmerModal open={addFarmerModalOpen} onOpenChange={setAddFarmerModalOpen} />
            )}
        </div>
    );
};

export default DashboardLayout;




