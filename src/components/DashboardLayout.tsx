import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Bell, Sun, Moon, Home, MapPin, BarChart3, Settings, Plus, Users, Calendar, Leaf, Bot } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import Preloader from './ui/Preloader';
import AddFarmerModal from './agent/AddFarmerModal';
import { Badge } from './ui/badge';
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
    const effectiveSubtitle = description || subtitle;
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const isMobile = useIsMobile();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [addFarmerModalOpen, setAddFarmerModalOpen] = useState(false);

    // Simulate loading on mount and navigation
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200); // Premium feel loading duration
        return () => clearTimeout(timer);
    }, [activeSidebarItem, title]); // Re-trigger on sidebar change or title change

    // Use the same mock data logic as in pages to show profile info in header
    const mockProfile = {
        name: 'John Agribusiness', // Default or fetch based on userType
        id: 'LYG1234567'
    };

    const currentTitle = title || 'Dashboard';

    return (
        <div className={`h-screen overflow-hidden ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
            {isLoading && <Preloader />}
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
                                        'dashboard': `/dashboard/${userType}`,
                                        'settings': `/dashboard/${userType}/settings`,
                                        'farm-analytics': `/dashboard/${userType}/farm-analytics`,
                                        'investor-matches': `/dashboard/${userType}/investor-matches`,
                                        'training-sessions': `/dashboard/${userType}/training-sessions`,
                                        'farm-management': `/dashboard/${userType}/farm-management`,
                                        'notifications': `/dashboard/${userType}/notifications`
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
                    <div className={`${userType === 'grower' ? 'w-64' : (sidebarCollapsed ? 'w-16' : 'w-64')} ${darkMode ? 'bg-white' : 'bg-[#002f37]'} flex-shrink-0 transition-all duration-300 border-r ${darkMode ? 'border-gray-200' : 'border-gray-800'}`}>
                        <DashboardSidebar
                            userType={userType || ''}
                            sidebarCollapsed={sidebarCollapsed}
                            setSidebarCollapsed={setSidebarCollapsed}
                            activeSidebarItem={activeSidebarItem}
                        />
                    </div>
                )}

                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-colors ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
                    {/* Top Header */}
                    <header className={`${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white border-gray-200'} border-b px-4 py-3 sm:px-6 sm:py-4 transition-colors sticky top-0 z-20`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isMobile && (
                                    <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(true)} className="md:hidden -ml-2">
                                        <Menu className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                                    </Button>
                                )}
                                <div>
                                    <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentTitle}</h1>
                                    {effectiveSubtitle && <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{effectiveSubtitle}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-4">
                                {headerActions}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`flex items-center gap-2 rounded-full p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    onClick={toggleDarkMode}
                                >
                                    {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
                                    <span className="hidden sm:inline ml-1 font-medium">{darkMode ? 'Light' : 'Dark'}</span>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`relative flex items-center gap-2 ${darkMode ? 'bg-transparent border-gray-600 text-white hover:bg-gray-800' : ''}`}
                                        >
                                            <Bell className="h-4 w-4" />
                                            {agentNotifications.filter(n => !n.read).length > 0 && (
                                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-600 text-[10px] font-black text-white flex items-center justify-center border-2 border-white dark:border-[#002f37]">
                                                    {agentNotifications.filter(n => !n.read).length}
                                                </span>
                                            )}
                                            <span className="hidden sm:inline font-medium">Notifications</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-80 p-0 border-none shadow-2xl" align="end">
                                        <div className={`p-4 border-b ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                                            <div className="flex items-center justify-between">
                                                <h3 className={`font-black uppercase tracking-widest text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Latest Updates</h3>
                                                <Badge variant="outline" className="text-[9px] font-bold border-none bg-emerald-100 text-emerald-700">
                                                    {agentNotifications.filter(n => !n.read).length} New
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className={`max-h-[350px] overflow-y-auto ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
                                            {agentNotifications.slice(0, 5).map((notif) => (
                                                <DropdownMenuItem
                                                    key={notif.id}
                                                    className={`p-4 cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-900/20 border-b last:border-none ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}
                                                    onClick={() => navigate(`/dashboard/${userType}/notifications`)}
                                                >
                                                    <div className="flex gap-3 w-full">
                                                        <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${notif.type === 'alert' ? 'bg-rose-100 text-rose-600' :
                                                            notif.type === 'training' ? 'bg-purple-100 text-purple-600' :
                                                                'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            <Bell className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs font-bold leading-tight mb-1 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notif.title}</p>
                                                            <p className="text-[10px] text-gray-400 font-medium">{notif.time}</p>
                                                        </div>
                                                        {!notif.read && <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1"></div>}
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                        <div className={`p-3 border-t text-center ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-100"
                                                onClick={() => navigate(`/dashboard/${userType}/notifications`)}
                                            >
                                                View All Notifications
                                            </Button>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div
                                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                                    onClick={() => navigate(`/dashboard/${userType}/settings`)}
                                >
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-[#7ede56]">
                                        <AvatarFallback className="bg-[#002f37] text-white text-xs sm:text-sm font-semibold">
                                            JA
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden sm:flex flex-col items-start min-w-0">
                                        <span className={`text-sm font-semibold truncate max-w-[120px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>{mockProfile.name}</span>
                                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {(userType || 'user').charAt(0).toUpperCase() + (userType || 'user').slice(1)}
                                        </span>
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
                                        <div className="relative -top-5 px-1">
                                            <button
                                                onClick={() => navigate(`/dashboard/grower/training-sessions?tab=advisory`)}
                                                className="h-14 w-14 rounded-full bg-[#7ede56] shadow-lg flex items-center justify-center text-[#002f37] border-4 border-[#002f37] active:scale-90 transition-transform group"
                                            >
                                                <div className="bg-[#002f37] rounded-full p-2 group-hover:bg-[#003c47] transition-colors">
                                                    <Bot className="h-6 w-6 text-[#7ede56]" />
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
                                        {/* Agent Navigation */}
                                        {/* Home */}
                                        <button
                                            onClick={() => navigate(`/dashboard/agent`)}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'dashboard' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'dashboard' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <Home className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Home</span>
                                        </button>

                                        {/* Farmers Management */}
                                        <button
                                            onClick={() => navigate(`/dashboard/agent/farmers-management`)}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'farmers-management' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'farmers-management' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Farmers</span>
                                        </button>

                                        {/* Quick Action */}
                                        <div className="relative -top-5 px-1">
                                            <button
                                                onClick={() => setAddFarmerModalOpen(true)}
                                                className="h-14 w-14 rounded-full bg-[#7ede56] shadow-lg flex items-center justify-center text-[#002f37] border-4 border-[#002f37] active:scale-90 transition-transform"
                                            >
                                                <div className="bg-[#002f37] rounded-full p-2">
                                                    <Plus className="h-6 w-6 text-[#7ede56]" />
                                                </div>
                                            </button>
                                        </div>

                                        {/* Training & Sessions */}
                                        <button
                                            onClick={() => navigate(`/dashboard/agent/training-performance`)}
                                            className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeSidebarItem === 'training-sessions' ? 'text-[#7ede56] scale-110' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                                        >
                                            <div className={`p-1.5 rounded-xl ${activeSidebarItem === 'training-sessions' ? 'bg-[#7ede56]/10' : ''}`}>
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <span className="text-[10px] font-bold">Training</span>
                                        </button>

                                        {/* Settings / Profile */}
                                        <button
                                            onClick={() => navigate(`/dashboard/agent/profile`)}
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
