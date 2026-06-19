import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DASHBOARD_POLL_INTERVAL_MS } from '@/data/dashboardConfig';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Bell, Settings, Users, UserRoundPlus, LayoutGrid, Leaf, Bot, Search, LogOut, BarChart3, GraduationCap, Zap, MapPin, Sprout, Activity } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import { getDashboardNavRoute } from '@/utils/dashboardNavigation';
import { GROWER_ROUTES, isGrowerDashboardPath } from '@/utils/growerRoutes';
import Preloader from './ui/Preloader';
import AddFarmerModal from './agent/AddFarmerModal';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getGrowerProfile } from '@/utils/authToken';
import { useGrowerOptional } from '@/contexts/GrowerContext';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';
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
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { playNotificationBeep } from '@/utils/audio';
import OfflineBanner from '@/components/agent/OfflineBanner';
import InstallPwaPrompt from '@/components/agent/InstallPwaPrompt';
import GrowerMobileBottomNav from '@/components/grower/GrowerMobileBottomNav';
import GrowerMobileDrawer from '@/components/grower/mobile/GrowerMobileDrawer';
import { GROWER_NAV_PRELOADER_MS } from '@/constants/platformAccess';

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
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const isMobile = useIsMobile();
    const { agent } = useAuth();
    const growerCtx = useGrowerOptional();
    const growerFromPath = isGrowerDashboardPath(location.pathname) ? 'grower' : undefined;
    const userType =
        explicitUserType ||
        paramUserType ||
        growerFromPath ||
        (agent?.role === 'super_admin' ? 'super-admin' : agent?.role === 'agent' ? 'agent' : undefined);
    const isGrowerView = userType === 'grower';
    const grower = isGrowerView ? growerCtx?.grower ?? getGrowerProfile() : null;
    const headerDisplayName = isGrowerView ? grower?.name || 'Lync Grower' : agent?.name;
    const headerRoleLabel = isGrowerView
        ? 'Lync Grower'
        : agent?.role === 'super_admin'
          ? 'Super Admin'
          : agent?.role === 'supervisor'
            ? 'Supervisor'
            : 'Field Agent';
    const headerEmail = isGrowerView
        ? grower?.email || grower?.contact || 'grower@agrilync.com'
        : agent?.email;
    const headerAvatarSrc = isGrowerView
        ? grower?.profilePicture
            ? resolvePublicAssetUrl(grower.profilePicture)
            : undefined
        : agent?.avatar || (agent as any)?.profilePicture;
    const queryClient = useQueryClient();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const growerNavPending = useRef(false);
    const [addFarmerModalOpen, setAddFarmerModalOpen] = useState(false);
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

    const isSuperAdmin = userType === 'super-admin';
    const receivesStaffNotifications = userType === 'agent' || isSuperAdmin;

    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/notifications');
            return Array.isArray(res.data) ? res.data : (res.data?.data || []);
        },
        enabled: receivesStaffNotifications,
        staleTime: DASHBOARD_POLL_INTERVAL_MS,
        refetchInterval: receivesStaffNotifications && !addFarmerModalOpen ? DASHBOARD_POLL_INTERVAL_MS : false,
        refetchIntervalInBackground: false,
    });

    useEffect(() => {
        if (location.pathname.startsWith('/dashboard')) {
            setIsNavigating(false);

            // Initialize Notifications for Agents (only on first mount to avoid spam)
            const hasNotifications = typeof window !== 'undefined' && 'Notification' in window;
            if (userType === 'agent' && agent && hasNotifications && Notification.permission !== 'denied') {
                const setupNotifications = async () => {
                    try {
                        // Only request if not already granted or denied
                        if (Notification.permission === 'default') {
                            await requestNotificationPermission();
                        }
                        
                        // Set up live listener for in-app popups
                        onMessageListener().then((payload: any) => {
                            if (payload?.notification) {
                                playNotificationBeep();
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
                    } catch (err) {
                        console.error('Notification setup failed:', err);
                    }
                };
                setupNotifications();
            }
        }
    }, [location.pathname, agent, userType, navigate, queryClient]);

    // Portaled modals render on document.body — tag body so mobile form/modal CSS applies there too
    useEffect(() => {
        if (userType === 'agent') {
            document.body.classList.add('agent-dashboard-active');
            return () => document.body.classList.remove('agent-dashboard-active');
        }
        if (isGrowerView) {
            document.body.classList.add('grower-dashboard-active');
            return () => document.body.classList.remove('grower-dashboard-active');
        }
        if (isSuperAdmin) {
            document.body.classList.add('admin-dashboard-active');
            return () => document.body.classList.remove('admin-dashboard-active');
        }
        return undefined;
    }, [userType, isGrowerView, isSuperAdmin]);

    const effectiveSubtitle = description || subtitle;
    const currentTitle = title || 'Dashboard';
    const activeNotifications = receivesStaffNotifications ? notifications : agentNotifications;
    const unreadAlertCount = activeNotifications.filter((n) => !n.read).length;
    const isAgent = userType === 'agent' && agent?.role !== 'super_admin';

    useNotificationSound(receivesStaffNotifications ? notifications : [], receivesStaffNotifications);

    const beginGrowerNav = useCallback(() => {
        growerNavPending.current = true;
        setIsNavigating(true);
    }, []);

    useEffect(() => {
        if (!growerNavPending.current) return;
        growerNavPending.current = false;
        const timer = setTimeout(() => setIsNavigating(false), GROWER_NAV_PRELOADER_MS);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const isGrowerRoute = (route: string) => {
        if (route === GROWER_ROUTES.dashboard) return location.pathname === route;
        return location.pathname === route || location.pathname.startsWith(`${route}/`);
    };

    const handleSidebarNavigate = (item: string) => {
        setMobileSidebarOpen(false);
        const route = getDashboardNavRoute(userType || '', item);
        if (route && isGrowerView && !isGrowerRoute(route)) {
            beginGrowerNav();
        }
        if (route) navigate(route);
    };

    const mobileNavBtn = (active: boolean) => {
        if (isSuperAdmin) return active ? 'text-[#7ede56]' : 'text-white/45';
        if (active) return darkMode ? 'text-[#7ede56]' : 'text-[#065f46]';
        return 'text-[#002f37]/40';
    };

    return (
        <div
            className={`h-screen overflow-hidden font-inter ${
                isAgent
                    ? 'agent-dashboard-root'
                    : isGrowerView
                      ? 'grower-dashboard-root'
                      : isSuperAdmin
                        ? 'admin-dashboard-root'
                        : ''
            } ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}
        >
            {isGrowerView && isNavigating && <Preloader />}
            <div className="flex h-full">
                {/* Mobile Sidebar */}
                {isMobile && (
                    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                        <SheetContent
                            side="left"
                            hideCloseButton
                            className="w-[min(320px,88vw)] max-w-[320px] p-0 border-none bg-white"
                        >
                            <SheetHeader className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>Access different sections of the dashboard</SheetDescription>
                            </SheetHeader>
                            {isGrowerView ? (
                                <GrowerMobileDrawer
                                    activeItem={activeSidebarItem}
                                    onNavigate={handleSidebarNavigate}
                                    onClose={() => setMobileSidebarOpen(false)}
                                />
                            ) : (
                                <div className="flex flex-col h-full bg-[#002f37] text-white">
                            {isSuperAdmin && (
                                <div className="px-5 pt-5 pb-3 border-b border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#7ede56]">AgriLync Command</p>
                                    <h2 className="text-lg font-black text-white mt-1">Super Admin</h2>
                                    <p className="text-[11px] font-medium text-white/50 mt-0.5">Platform control & oversight</p>
                                </div>
                            )}
                            <DashboardSidebar
                                userType={userType || ''}
                                sidebarCollapsed={false}
                                setSidebarCollapsed={() => { }}
                                activeSidebarItem={activeSidebarItem}
                                isMobile={true}
                                onNavigate={handleSidebarNavigate}
                            />
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                )}

                {/* Desktop Sidebar */}
                {!isMobile && (
                    <div className={`${userType === 'grower' ? 'w-[325px]' : (sidebarCollapsed ? 'w-16' : 'w-[325px]')} ${userType === 'grower' ? 'bg-[#7ede56]' : 'bg-[#065f46]'} flex-shrink-0 transition-all duration-300 shadow-xl`}>
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
                        <header className={`bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40 shadow-sm ${
                            isMobile && isSuperAdmin ? 'px-3 pt-[env(safe-area-inset-top)]' : 'px-6 md:px-8'
                        } py-0`}>
                        <div className={`flex items-center justify-between ${isMobile && isSuperAdmin ? 'h-14' : 'h-[68px]'}`}>

                            {/* Left: Mobile menu + Search */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {isMobile && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setMobileSidebarOpen(true)}
                                        className={`md:hidden -ml-2 shrink-0 h-10 w-10 rounded-xl ${
                                            isSuperAdmin ? 'bg-[#065f46]/10 hover:bg-[#065f46]/15' : ''
                                        }`}
                                    >
                                        <Menu className={`h-5 w-5 ${isSuperAdmin ? 'text-[#065f46]' : 'text-gray-600'}`} />
                                    </Button>
                                )}
                                {isMobile && isSuperAdmin && (
                                    <div className="flex flex-col min-w-0 flex-1 md:hidden">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7ede56] leading-none">
                                            AgriLync Admin
                                        </span>
                                        <span className="text-base font-black text-[#002f37] truncate leading-tight mt-0.5">
                                            {currentTitle}
                                        </span>
                                    </div>
                                )}
                                {/* Premium Search Bar */}
                                <form
                                    onSubmit={handleSearch}
                                    className={`${isSuperAdmin ? 'hidden' : 'hidden md:flex'} relative max-w-sm w-full group`}
                                >
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
                            <div className="flex items-center gap-2 sm:gap-5 shrink-0">
                                {headerActions}
                                {/* Mobile alerts — super admin */}
                                {isMobile && isSuperAdmin && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl bg-[#065f46]/8 hover:bg-[#065f46]/12 relative shrink-0"
                                            >
                                                <Bell className="h-5 w-5 text-[#065f46]" />
                                                {unreadAlertCount > 0 && (
                                                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center">
                                                        {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                                                    </span>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[min(92vw,360px)] rounded-2xl border-gray-100 shadow-2xl p-0 overflow-hidden">
                                            <div className="bg-[#002f37] p-4 text-white">
                                                <h3 className="text-xs font-black uppercase tracking-widest">Alerts</h3>
                                            </div>
                                            <div className="max-h-[50vh] overflow-y-auto divide-y divide-gray-50">
                                                {activeNotifications.slice(0, 5).map((n, i) => (
                                                    <DropdownMenuItem key={i} className="p-3 gap-3 cursor-pointer">
                                                        <p className="text-[11px] font-black uppercase leading-tight">{n.title}</p>
                                                    </DropdownMenuItem>
                                                ))}
                                                {activeNotifications.length === 0 && (
                                                    <p className="p-6 text-center text-[10px] font-bold text-gray-400 uppercase">No alerts</p>
                                                )}
                                            </div>
                                            <div className="p-3 border-t">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full text-[10px] font-black uppercase text-[#065f46] h-10 rounded-xl"
                                                    onClick={() => navigate('/dashboard/super-admin/notifications')}
                                                >
                                                    View All
                                                </Button>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                {/* Action Group: Notifications & Global Settings - Redesigned with Text Labels */}
                                <div className="hidden md:flex items-center bg-[#f8fafc] rounded-full p-1 border border-gray-100/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] gap-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="relative h-9 rounded-full text-gray-500 hover:text-[#065f46] hover:bg-white transition-all shadow-none group px-4 gap-2.5"
                                            >
                                                <Bell className="h-[20px] w-[20px] stroke-[3px] transition-transform group-active:scale-90" />
                                                <span className="hidden xl:inline text-[11px] font-black uppercase tracking-[0.1em] opacity-80 group-hover:opacity-100">Alerts</span>
                                                {unreadAlertCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm leading-none z-10">
                                                        {unreadAlertCount > 99 ? '99+' : unreadAlertCount}
                                                    </span>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[380px] mt-2 rounded-[24px] border-gray-100 shadow-2xl p-0 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="bg-[#002f37] p-5 text-white flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-sm font-black uppercase tracking-widest">Notifications</h3>
                                                    <p className="text-[10px] font-bold text-[#7ede56] uppercase tracking-widest mt-0.5">Alerts & Updates</p>
                                                </div>
                                                <Badge className="bg-red-500 text-white border-none text-[9px] font-black min-w-[22px] justify-center">
                                                    {unreadAlertCount} NEW
                                                </Badge>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
                                                {activeNotifications.length > 0 ? (
                                                    activeNotifications.slice(0, 5).map((n, i) => (
                                                        <DropdownMenuItem key={i} className="p-4 gap-4 cursor-pointer hover:bg-gray-50 transition-colors focus:bg-gray-50 outline-none">
                                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${n.read ? 'bg-gray-100 text-gray-400' : 'bg-[#eefcf0] text-[#002f37]'} border border-white/5`}>
                                                                <Zap className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <p className={`text-[12px] font-black uppercase tracking-tight leading-none ${n.read ? 'text-gray-400' : 'text-[#002f37]'}`}>{n.title}</p>
                                                                <p className="text-[11px] font-bold text-gray-500 leading-tight line-clamp-2 uppercase tracking-wide">{n.message || n.body}</p>
                                                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">2 MINUTES AGO</p>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    ))
                                                ) : (
                                                    <div className="p-12 text-center space-y-3">
                                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto">
                                                            <Bell className="w-8 h-8 text-gray-200" />
                                                        </div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No notifications yet</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                                                <Button 
                                                    variant="ghost" 
                                                    className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-[#065f46] hover:bg-white h-10 rounded-xl"
                                                    onClick={() =>
                                                        navigate(
                                                            isSuperAdmin
                                                                ? '/dashboard/super-admin/notifications'
                                                                : userType === 'agent'
                                                                  ? '/dashboard/agent/notifications-center'
                                                                  : `/dashboard/${userType}/notifications`
                                                        )
                                                    }
                                                >
                                                    View All Notifications
                                                </Button>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 rounded-full text-gray-400 hover:text-[#065f46] hover:bg-white transition-all shadow-none group px-4 gap-2.5"
                                        onClick={() => {
                                            const route = getDashboardNavRoute(userType || '', 'settings');
                                            if (route) navigate(route);
                                        }}
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
                                                    {headerDisplayName ? headerDisplayName : <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="h-1 w-1 rounded-full bg-[#7ede56] shadow-[0_0_8px_rgba(126,222,86,0.6)]" />
                                                    <span className="text-[10px] font-black text-[#065f46] uppercase tracking-[0.05em] leading-none opacity-80">
                                                        {headerRoleLabel}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Avatar with Halo Effect */}
                                            <div className="relative">
                                                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#065f46] to-[#7ede56] opacity-40 group-hover:opacity-100 transition-all blur-[1px]"></div>
                                                <Avatar className="relative h-9 w-9 border-2 border-white shadow-lg transition-transform group-hover:rotate-[4deg]">
                                                    <AvatarImage src={headerAvatarSrc} className="object-cover" />
                                                    <AvatarFallback className="bg-[#065f46] text-white text-[11px] font-black">
                                                        {headerDisplayName ? headerDisplayName.split(' ').map(n => n?.[0]).join('').substring(0, 2).toUpperCase() : 'AL'}
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
                                            <p className="text-[13px] font-bold text-[#002f37] truncate">{headerEmail || 'authenticated_user'}</p>
                                        </div>
                                        <DropdownMenuGroup className="space-y-0.5">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    const route = getDashboardNavRoute(userType || '', 'settings');
                                                    if (route) navigate(route);
                                                }}
                                                className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer group hover:bg-[#065f46]/5 hover:text-[#065f46] transition-all"
                                            >
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
                    <main
                        className={`flex-1 overflow-y-auto overflow-x-hidden ${
                            isSuperAdmin && isMobile ? 'p-3 sm:p-6 md:p-8' : 'p-4 sm:p-6 md:p-8'
                        } ${
                            isMobile
                                ? isGrowerView
                                    ? 'pb-[max(5.25rem,calc(4.25rem+env(safe-area-inset-bottom)))]'
                                    : 'pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))]'
                                : 'pb-8'
                        }`}
                    >
                        {isAgent && <OfflineBanner />}
                        {children}
                    </main>

                    {/* Mobile bottom navigation */}
                    {isMobile && userType === 'grower' && (
                        <GrowerMobileBottomNav
                            activeSidebarItem={activeSidebarItem}
                            moreOpen={mobileSidebarOpen}
                            onOpenMore={() => setMobileSidebarOpen(true)}
                            onNavigateStart={beginGrowerNav}
                        />
                    )}
                    {isMobile && userType !== 'grower' && (
                        <div className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pointer-events-none admin-mobile-bottom-nav">
                            <div
                                className={`pointer-events-auto flex items-end justify-between px-2 sm:px-3 py-2 rounded-[1.75rem] shadow-[0_20px_50px_-12px_rgba(0,47,55,0.25)] border backdrop-blur-md ${
                                    isSuperAdmin
                                        ? 'bg-[#002f37]/98 border-[#7ede56]/25'
                                        : darkMode
                                          ? 'bg-[#002f37]/95 border-gray-700'
                                          : 'bg-white/95 border-gray-100'
                                }`}
                            >
                                {isSuperAdmin ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/dashboard/super-admin')}
                                            className={`admin-mobile-nav-item flex flex-col items-center gap-0.5 flex-1 min-w-0 py-1 transition-all ${mobileNavBtn(activeSidebarItem === 'dashboard')}`}
                                        >
                                            <div className={`p-2 rounded-xl ${activeSidebarItem === 'dashboard' ? 'bg-[#7ede56]/15' : ''}`}>
                                                <LayoutGrid className="h-5 w-5" />
                                            </div>
                                            <span className="text-[8px] font-black uppercase truncate max-w-full">Home</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/dashboard/super-admin/regions')}
                                            className={`admin-mobile-nav-item flex flex-col items-center gap-0.5 flex-1 min-w-0 py-1 transition-all ${mobileNavBtn(activeSidebarItem === 'regional-performance')}`}
                                        >
                                            <div className={`p-2 rounded-xl ${activeSidebarItem === 'regional-performance' ? 'bg-[#7ede56]/15' : ''}`}>
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            <span className="text-[8px] font-black uppercase truncate max-w-full">Regions</span>
                                        </button>
                                        <div className="relative -top-5 px-0.5 flex flex-col items-center shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => navigate('/dashboard/super-admin/audit')}
                                                className={`h-[3.75rem] w-[3.75rem] rounded-full border-[3px] shadow-[0_12px_28px_-8px_rgba(0,47,55,0.5)] flex flex-col items-center justify-center active:scale-90 transition-all ${
                                                    activeSidebarItem === 'field-audit'
                                                        ? 'bg-[#7ede56] border-white text-[#002f37]'
                                                        : 'bg-[#002f37] border-[#7ede56] text-[#7ede56]'
                                                }`}
                                            >
                                                <Activity className="h-5 w-5 stroke-[2.5px]" />
                                                <span className="text-[6px] font-black uppercase tracking-tight mt-0.5">Audit</span>
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/dashboard/super-admin/oversight')}
                                            className={`admin-mobile-nav-item flex flex-col items-center gap-0.5 flex-1 min-w-0 py-1 transition-all ${mobileNavBtn(activeSidebarItem === 'farm-oversight')}`}
                                        >
                                            <div className={`p-2 rounded-xl ${activeSidebarItem === 'farm-oversight' ? 'bg-[#7ede56]/15' : ''}`}>
                                                <Sprout className="h-5 w-5" />
                                            </div>
                                            <span className="text-[8px] font-black uppercase truncate max-w-full">Farms</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMobileSidebarOpen(true)}
                                            className={`admin-mobile-nav-item flex flex-col items-center gap-0.5 flex-1 min-w-0 py-1 transition-all ${mobileNavBtn(mobileSidebarOpen)}`}
                                        >
                                            <div className={`p-2 rounded-xl ${mobileSidebarOpen ? 'bg-[#7ede56]/15' : ''}`}>
                                                <Menu className="h-5 w-5" />
                                            </div>
                                            <span className="text-[8px] font-black uppercase truncate max-w-full">More</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate('/dashboard/agent')}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'dashboard' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-gray-400'}`}
                                        >
                                            <div className="p-1">
                                                <LayoutGrid className={`h-6 w-6 ${activeSidebarItem === 'dashboard' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${activeSidebarItem === 'dashboard' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`}>Home</span>
                                        </button>
                                        <button
                                            onClick={() => navigate('/dashboard/agent/training-performance')}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'training-sessions' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-gray-400'}`}
                                        >
                                            <div className="p-1">
                                                <GraduationCap className={`h-6 w-6 ${activeSidebarItem === 'training-sessions' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${activeSidebarItem === 'training-sessions' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`}>Training</span>
                                        </button>
                                        <div className="relative -top-6 px-1 flex flex-col items-center">
                                            <button
                                                onClick={() => setAddFarmerModalOpen(true)}
                                                className="h-16 w-16 rounded-full bg-[#7ede56] border-[5px] border-white shadow-[0_15px_30px_-10px_rgba(126,222,86,0.6)] flex flex-col items-center justify-center active:scale-90 transition-all group relative overflow-hidden normal-case"
                                            >
                                                <UserRoundPlus className="h-6 w-6 text-[#002f37] stroke-[3px] mb-0.5 animate-[bounce_2s_infinite]" />
                                                <span className="text-[7px] font-black text-[#002f37] font-montserrat tracking-tighter">Onboard</span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => navigate('/dashboard/agent/farm-management')}
                                            className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeSidebarItem === 'farm-management' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-gray-400'}`}
                                        >
                                            <div className="p-1">
                                                <Leaf className={`h-6 w-6 ${activeSidebarItem === 'farm-management' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${activeSidebarItem === 'farm-management' ? (darkMode ? 'text-[#7ede56]' : 'text-[#065f46]') : 'text-[#002f37]/40'}`}>Farm</span>
                                        </button>
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
                <>
                    <AddFarmerModal open={addFarmerModalOpen} onOpenChange={setAddFarmerModalOpen} />
                    <InstallPwaPrompt />
                </>
            )}
        </div>
    );
};

export default DashboardLayout;




