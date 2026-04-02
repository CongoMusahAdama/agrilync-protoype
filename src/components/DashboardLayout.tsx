import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Bell, Sun, Moon, Home, MapPin, BarChart3, Settings, Plus, Users, UserPlus, UserRoundPlus, LayoutGrid, ListTodo, UserCircle, Calendar, Leaf, Bot, AlertTriangle, Search, LogOut, Briefcase, Image as ImageIcon, RefreshCw, GraduationCap } from 'lucide-react';
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
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeSidebarItem: string;
    title?: string;
    subtitle?: string;
    description?: string; // Add description as an alias for subtitle
    userType?: string; // Allow passing userType explicitly
    headerActions?: React.ReactNode; // Allow custom header actions
    hideHeaderOnMobile?: boolean; // New prop to hide the top header purely on mobile
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    activeSidebarItem,
    title,
    subtitle,
    description,
    userType: explicitUserType,
    headerActions,
    hideHeaderOnMobile = false
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

            // Initialize Notifications for Agents
            if (userType === 'agent' && agent) {
                requestNotificationPermission();
                
                // Set up live listener for in-app popups
                onMessageListener().then((payload: any) => {
                    if (payload?.notification) {
                        toast.info(payload.notification.title, {
                            description: payload.notification.body,
                            duration: 6000,
                            action: {
                                label: 'View',
                                onClick: () => navigate('/dashboard/agent/notifications-center')
                            }
                        });
                        // Also re-fetch internal notification list
                        queryClient.invalidateQueries({ queryKey: ['notifications'] });
                    }
                }).catch(err => console.error('FCM Listener failed:', err));
            }
        }
    }, [location.pathname, agent, userType, navigate, queryClient]);

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
                    <div className={`${userType === 'grower' ? 'w-[325px]' : (sidebarCollapsed ? 'w-16' : 'w-[325px]')} bg-[#065f46] flex-shrink-0 transition-all duration-300 shadow-xl`}>
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
                    {! (isMobile && hideHeaderOnMobile) && (
                        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 md:px-8 py-0 sticky top-0 z-40 shadow-sm">
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
                            {/* Right: Actions + Profile - Redesigned for Premium Look */}
                            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                                {headerActions}
                                {/* Action Group: Notifications & Global Settings - Redesigned with Text Labels */}
                                <div className="hidden md:flex items-center bg-[#f8fafc] rounded-full p-1 border border-gray-100/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="relative h-9 rounded-full text-gray-500 hover:text-[#065f46] hover:bg-white transition-all shadow-none group px-4 gap-2.5"
                                        onClick={() => navigate(userType === 'agent' ? '/dashboard/agent/notifications-center' : `/dashboard/${userType}/notifications`)}
                                    >
                                        <Bell className="h-[20px] w-[20px] stroke-[3px] transition-transform group-active:scale-90" />
                                        <span className="hidden xl:inline text-[11px] font-black uppercase tracking-[0.1em] opacity-80 group-hover:opacity-100">Alerts</span>
                                        {activeNotifications.filter(n => !n.read).length > 0 && (
                                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#7ede56] border-2 border-white shadow-sm animate-pulse"></span>
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 rounded-full text-gray-400 hover:text-[#065f46] hover:bg-white transition-all shadow-none group px-4 gap-2.5"
                                        onClick={() => navigate(userType === 'agent' ? '/dashboard/agent/profile' : `/dashboard/${userType}/settings`)}
                                    >
                                        <Settings className="h-[20px] w-[20px] stroke-[3px] transition-transform group-active:scale-90" />
                                        <span className="hidden xl:inline text-[11px] font-black uppercase tracking-[0.1em] opacity-80 group-hover:opacity-100">Support</span>
                                    </Button>
                                </div>

                                {/* Divider: Only visible on desktop when action group is shown */}
                                <div className="hidden lg:block w-px h-6 bg-gray-100" />

                                {/* User Context Menu (Premium Identity) */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-3 cursor-pointer group active:scale-[0.98] transition-all outline-none pl-2 pr-1.5 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100/80">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <span className="text-[14px] font-bold text-gray-900 leading-tight group-hover:text-[#065f46] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                    {agent?.name ? agent.name : <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="h-1 w-1 rounded-full bg-[#7ede56] shadow-[0_0_8px_rgba(126,222,86,0.6)]" />
                                                    <span className="text-[10px] font-black text-[#065f46] uppercase tracking-[0.05em] leading-none opacity-80">
                                                        {agent?.role === 'super_admin' ? 'Super Admin' : agent?.role === 'supervisor' ? 'Supervisor' : 'Field Agent'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Avatar with Halo Effect */}
                                            <div className="relative">
                                                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#065f46] to-[#7ede56] opacity-40 group-hover:opacity-100 transition-all blur-[1px]"></div>
                                                <Avatar className="relative h-9 w-9 border-2 border-white shadow-lg transition-transform group-hover:rotate-[4deg]">
                                                    <AvatarImage src={agent?.avatar} />
                                                    <AvatarFallback className="bg-[#065f46] text-white text-[11px] font-black">
                                                        {agent?.name ? agent.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AL'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {/* Online Status Beacon */}
                                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#7ede56] border-2 border-white shadow-sm ring-1 ring-gray-100"></span>
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 mt-2 rounded-[1.25rem] border-gray-100 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-3 py-2.5 mb-1 bg-gray-50/50 rounded-xl">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                                            <p className="text-[13px] font-bold text-[#002f37] truncate">{agent?.email || 'authenticated_user'}</p>
                                        </div>
                                        <DropdownMenuGroup className="space-y-0.5">
                                            <DropdownMenuItem onClick={() => navigate(userType === 'agent' ? '/dashboard/agent/profile' : `/dashboard/${userType}/settings`)} className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer group hover:bg-[#065f46]/5 hover:text-[#065f46] transition-all">
                                                <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                                    <Users className="h-4 w-4 text-gray-500 group-hover:text-[#065f46]" />
                                                </div>
                                                <span className="font-bold text-[14px]">Personal Profile</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer group hover:bg-[#065f46]/5 hover:text-[#065f46] transition-all">
                                                <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                                                    <Settings className="h-4 w-4 text-gray-500 group-hover:text-[#065f46]" />
                                                </div>
                                                <span className="font-bold text-[14px]">System Settings</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator className="my-2 bg-gray-100/50" />
                                        <DropdownMenuItem 
                                            onClick={() => { localStorage.clear(); navigate('/login'); }} 
                                            className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all font-bold"
                                        >
                                            <div className="p-1.5 bg-rose-100/50 rounded-lg">
                                                <LogOut className="h-4 w-4 text-rose-600" />
                                            </div>
                                            <span className="text-[14px]">Secure Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                        </div>
                    </header>
                    )}

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 sm:pb-8">
                        {children}
                    </main>

                    {/* Mobile Bottom Navigation - Redesigned for Premium Look */}
                    {isMobile && (
                        <div className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-3 pointer-events-none">
                            <div className={`pointer-events-auto flex items-center justify-between px-3 py-1.5 rounded-[1.75rem] shadow-[0_20px_50px_-12px_rgba(0,47,55,0.25)] border ${darkMode ? 'bg-[#002f37]/95 border-gray-700 backdrop-blur-md' : 'bg-white/95 border-gray-100 backdrop-blur-md'}`}>
                                {userType === 'grower' ? (
                                    <>
                                        {/* Home */}
                                        <button
                                            onClick={() => navigate(`/dashboard/grower`)}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'dashboard' ? 'text-[#7ede56]' : 'text-gray-400'}`}
                                        >
                                            <div className={`p-2.5 rounded-[1.25rem] transition-colors ${activeSidebarItem === 'dashboard' ? (darkMode ? 'bg-[#7ede56]/20' : 'bg-[#7ede56]/10') : ''}`}>
                                                <Home className={`h-5 w-5 ${activeSidebarItem === 'dashboard' ? 'text-[#7ede56]' : 'text-gray-400'}`} />
                                            </div>
                                            <span className={`text-[10px] font-bold ${activeSidebarItem === 'dashboard' ? 'text-[#7ede56]' : 'text-gray-400'}`}>Home</span>
                                        </button>

                                        {/* Farm Management */}
                                        <button
                                            onClick={() => navigate(`/dashboard/grower/farm-management`)}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'farm-management' ? 'text-[#7ede56]' : 'text-gray-400'}`}
                                        >
                                            <div className={`p-2.5 rounded-[1.25rem] transition-colors ${activeSidebarItem === 'farm-management' ? (darkMode ? 'bg-[#7ede56]/20' : 'bg-[#7ede56]/10') : ''}`}>
                                                <Leaf className={`h-5 w-5 ${activeSidebarItem === 'farm-management' ? 'text-[#7ede56]' : 'text-gray-400'}`} />
                                            </div>
                                            <span className={`text-[10px] font-bold ${activeSidebarItem === 'farm-management' ? 'text-[#7ede56]' : 'text-gray-400'}`}>Farm</span>
                                        </button>

                                        {/* AI Advisory Action - Premium Floating Button */}
                                        <div className="relative -top-7 px-2">
                                            <button
                                                onClick={() => navigate(`/dashboard/grower/training-sessions?tab=advisory`)}
                                                className="h-16 w-16 rounded-full bg-[#002f37] border-[3px] border-[#7ede56] shadow-[0_8px_20px_-4px_rgba(126,222,86,0.4)] flex items-center justify-center active:scale-95 transition-all group overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-tr from-[#7ede56]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Bot className="h-7 w-7 text-[#7ede56] relative z-10" />
                                            </button>
                                        </div>

                                        {/* Analytics */}
                                        <button
                                            onClick={() => navigate(`/dashboard/grower/farm-analytics`)}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'farm-analytics' ? 'text-[#7ede56]' : 'text-gray-400'}`}
                                        >
                                            <div className={`p-2.5 rounded-[1.25rem] transition-colors ${activeSidebarItem === 'farm-analytics' ? (darkMode ? 'bg-[#7ede56]/20' : 'bg-[#7ede56]/10') : ''}`}>
                                                <BarChart3 className={`h-5 w-5 ${activeSidebarItem === 'farm-analytics' ? 'text-[#7ede56]' : 'text-gray-400'}`} />
                                            </div>
                                            <span className={`text-[10px] font-bold ${activeSidebarItem === 'farm-analytics' ? 'text-[#7ede56]' : 'text-gray-400'}`}>Analytics</span>
                                        </button>

                                        {/* Settings / Profile */}
                                        <button
                                            onClick={() => navigate(`/dashboard/grower/settings`)}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'settings' ? 'text-[#7ede56]' : 'text-gray-400'}`}
                                        >
                                            <div className={`p-2.5 rounded-[1.25rem] transition-colors ${activeSidebarItem === 'settings' ? (darkMode ? 'bg-[#7ede56]/20' : 'bg-[#7ede56]/10') : ''}`}>
                                                <Settings className={`h-5 w-5 ${activeSidebarItem === 'settings' ? 'text-[#7ede56]' : 'text-gray-400'}`} />
                                            </div>
                                            <span className={`text-[10px] font-bold ${activeSidebarItem === 'settings' ? 'text-[#7ede56]' : 'text-gray-400'}`}>Profile</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Agent/Super Admin Navigation - Redesigned like Pulse */}
                                        {/* Home */}
                                        <button
                                            onClick={() => navigate(userType === 'agent' ? '/dashboard/agent' : '/dashboard/super-admin')}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'dashboard' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-gray-400'}`}
                                        >
                                            <div className="p-1">
                                                <LayoutGrid className={`h-6 w-6 ${activeSidebarItem === 'dashboard' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${activeSidebarItem === 'dashboard' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`}>Home</span>
                                        </button>
                                        
                                        {/* Training */}
                                        <button
                                            onClick={() => navigate('/dashboard/agent/training-performance')}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'training-sessions' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-gray-400'}`}
                                        >
                                            <div className="p-1">
                                                <GraduationCap className={`h-6 w-6 ${activeSidebarItem === 'training-sessions' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${activeSidebarItem === 'training-sessions' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`}>Training</span>
                                        </button>

                                        {/* Pulse Inspired Quick Action - ONBOARDING */}
                                        <div className="relative -top-6 px-1 flex flex-col items-center">
                                            <button
                                                onClick={() => setAddFarmerModalOpen(true)}
                                                className="h-16 w-16 rounded-full bg-[#7ede56] border-[5px] border-white shadow-[0_15px_30px_-10px_rgba(126,222,86,0.6)] flex flex-col items-center justify-center active:scale-90 transition-all group relative overflow-hidden normal-case"
                                            >
                                                <UserRoundPlus className="h-6 w-6 text-[#002f37] stroke-[3px] mb-0.5 animate-[bounce_2s_infinite]" />
                                                <span className="text-[7px] font-black text-[#002f37] font-montserrat tracking-tighter">Onboard</span>
                                            </button>
                                        </div>

                                        {/* Farm Management */}
                                        <button
                                            onClick={() => navigate('/dashboard/agent/farm-management')}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'farm-management' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-gray-400'}`}
                                        >
                                            <div className="p-1">
                                                <Leaf className={`h-6 w-6 ${activeSidebarItem === 'farm-management' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${activeSidebarItem === 'farm-management' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`}>Farm</span>
                                        </button>

                                        {/* More / Menu */}
                                        <button
                                            onClick={() => setMobileSidebarOpen(true)}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${mobileSidebarOpen ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-gray-400'}`}
                                        >
                                            <div className="p-1 group-active:rotate-90 transition-transform">
                                                <Menu className={`h-6 w-6 ${mobileSidebarOpen ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${mobileSidebarOpen ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`}>More</span>
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




