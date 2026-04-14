import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    MapPin,
    BarChart3,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sprout,
    Handshake,
    AlertTriangle,
    Briefcase,
    Activity,
    Image as ImageIcon,
    Layout,
    LogOut,
    Users,
    ShieldAlert,
    GraduationCap,
    Scale
} from 'lucide-react';
import SidebarProfileCard from './SidebarProfileCard';
import { useAuth } from '@/contexts/AuthContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface NavSection {
    section: string;
    items: NavItem[];
}

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
    const { logout } = useAuth();

    const handleNavigation = (item: string) => {
        if (onNavigate) {
            onNavigate(item);
        } else {
            const routes: Record<string, string> = {
                'dashboard': userType === 'agent' ? '/dashboard/agent' : (userType === 'super-admin' ? '/dashboard/super-admin' : `/dashboard/${userType}`),
                'settings': userType === 'agent' ? '/dashboard/agent/profile' : (userType === 'super-admin' ? '/dashboard/super-admin/settings' : `/dashboard/${userType}/settings`),
                'farm-analytics': `/dashboard/${userType}/farm-analytics`,
                'investor-matches': userType === 'agent' ? '/dashboard/agent/investor-farmer-matches' : `/dashboard/${userType}/investor-matches`,
                'training-sessions': userType === 'agent' ? '/dashboard/agent/training-performance' : `/dashboard/${userType}/training-sessions`,
                'farm-management': userType === 'agent' ? '/dashboard/agent/farm-management' : `/dashboard/${userType}/farm-management`,
                'tasks-alerts': '/dashboard/agent/tasks',
                'notifications': userType === 'agent' ? '/dashboard/agent/notifications-center' : `/dashboard/${userType}/notifications`,
                'farmers-management': '/dashboard/agent/farmers-management',
                'media-gallery': '/dashboard/agent/media',
                'regional-performance': '/dashboard/super-admin/regions',
                'agent-management': '/dashboard/super-admin/agents',
                'field-audit': '/dashboard/super-admin/audit',
                'farm-oversight': '/dashboard/super-admin/oversight',
                'escalations': '/dashboard/super-admin/escalations',
                'reports-analytics': '/dashboard/super-admin/analytics',
                'system-logs': '/dashboard/super-admin/logs',
                'performance': userType === 'agent' ? '/dashboard/agent/performance' : `/dashboard/${userType}/performance`,
            };
            if (routes[item]) navigate(routes[item]);
        }
    };

    const agentNavSections: NavSection[] = [
        {
            section: 'Overview',
            items: [
                { id: 'dashboard', label: 'Home / Overview', icon: Home },
            ]
        },
        {
            section: 'Farm Operations',
            items: [
                { id: 'farm-management', label: 'Manage Farms', icon: Layout },
                { id: 'farmers-management', label: 'Grower Directory', icon: Users },
                { id: 'media-gallery', label: 'Media Gallery', icon: ImageIcon },
            ]
        },
        {
            section: 'Engagement',
            items: [
                { id: 'tasks-alerts', label: 'Tasks', icon: Briefcase },
                { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
        },
        {
            section: 'Performance',
            items: [
                { id: 'performance', label: 'My Performance', icon: BarChart3 },
                { id: 'training-sessions', label: 'Training', icon: GraduationCap },
            ]
        },
        {
            section: 'Account',
            items: [
                { id: 'settings', label: 'Settings & Support', icon: Settings },
            ]
        },
    ];

    const superAdminNavSections: NavSection[] = [
        {
            section: 'Overview',
            items: [
                { id: 'dashboard', label: 'Overview', icon: Home },
            ]
        },
        {
            section: 'Operations',
            items: [
                { id: 'regional-performance', label: 'Regional Performance', icon: MapPin },
                { id: 'agent-management', label: 'Agent Management', icon: Briefcase },
                { id: 'field-audit', label: 'Field Operations Audit', icon: Activity },
                { id: 'farm-oversight', label: 'Farm & Farmer Oversight', icon: Sprout },
            ]
        },
        {
            section: 'Alerts & Escalations',
            items: [
                { id: 'escalations', label: 'Escalations & Alerts', icon: AlertTriangle },
            ]
        },
        {
            section: 'Analytics',
            items: [
                { id: 'performance', label: 'Performance Monitoring', icon: Activity },
                { id: 'reports-analytics', label: 'Reports & Analytics', icon: BarChart3 },
                { id: 'system-logs', label: 'System Logs & Audit', icon: ShieldAlert },
            ]
        },
        {
            section: 'Account',
            items: [
                { id: 'settings', label: 'Settings & Roles', icon: Settings },
            ]
        },
    ];

    const navSections: NavSection[] = userType === 'agent'
        ? agentNavSections
        : userType === 'super-admin'
            ? superAdminNavSections
            : agentNavSections;

    return (
        <div className="flex flex-col h-full overflow-hidden shadow-2xl relative" style={{ backgroundColor: '#002f37' }}>
            
            {/* Collapse Toggle Button - Enhanced Premium Style */}
            {!isMobile && (
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-4 top-14 z-50 h-8 w-8 rounded-full bg-white border border-emerald-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center text-[#002f37] hover:bg-[#7ede56] hover:text-[#002f37] hover:scale-125 transition-all duration-300 ring-4 ring-transparent hover:ring-[#7ede56]/20 group active:scale-95"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    ) : (
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    )}
                </button>
            )}

            {/* Top spacing placeholder */}
            <div className="pt-2 pb-2"></div>
            {/* Agent Profile Card */}
            <SidebarProfileCard
                sidebarCollapsed={sidebarCollapsed}
                isMobile={isMobile}
                darkMode={false}
                userType={userType}
            />

            {/* Navigation Sections */}
            <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar pb-2">
                {navSections.map((section, sectionIdx) => (
                    <div key={section.section} className={sectionIdx > 0 ? 'mt-1' : ''}>
                        {/* Section Label */}
                        {(!sidebarCollapsed || isMobile) && (
                            <div className={`px-2 ${sectionIdx === 0 ? 'pt-3' : 'pt-4'} pb-1.5`}>
                                <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.22em]">
                                    {section.section}
                                </p>
                            </div>
                        )}
                        {sidebarCollapsed && !isMobile && sectionIdx > 0 && (
                            <div className="mx-3 my-2 border-t border-white/10" />
                        )}
                        {/* Items */}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = activeSidebarItem === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex items-center gap-3.5 px-4 py-[13px] rounded-xl cursor-pointer transition-all duration-200 group relative ${isActive
                                            ? 'bg-white text-[#065f46] shadow-lg shadow-black/25'
                                            : 'text-white/65 hover:text-white hover:bg-white/[0.08]'
                                        }`}
                                        onClick={() => handleNavigation(item.id)}
                                    >
                                        {/* Active left bar */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#7ede56] rounded-r-full" />
                                        )}

                                        <item.icon
                                            className={`h-[18px] w-[18px] shrink-0 transition-all duration-200 ${isActive ? 'text-[#065f46]' : 'text-white/50 group-hover:text-white'}`}
                                        />

                                        {(!sidebarCollapsed || isMobile) && (
                                            <span
                                                className={`text-[13.5px] font-medium tracking-[-0.01em] truncate transition-all ${isActive ? 'font-semibold' : ''}`}
                                            >
                                                {item.label}
                                            </span>
                                        )}

                                        {/* Collapsed active dot */}
                                        {isActive && sidebarCollapsed && !isMobile && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#7ede56]" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer: Sign Out */}
            <div className="p-4 border-t border-white/10">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div className={`flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer text-white/40 hover:text-white hover:bg-red-500/10 transition-all group`}>
                            <LogOut className="h-[18px] w-[18px] shrink-0 group-hover:translate-x-0.5 transition-transform text-white/40 group-hover:text-red-400" />
                            {(!sidebarCollapsed || isMobile) && (
                                <span className="text-[13.5px] font-medium group-hover:text-red-400 transition-colors">
                                    Sign Out
                                </span>
                            )}
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white rounded-3xl border-none shadow-2xl p-8 max-w-sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[20px] font-bold text-gray-900">
                                Sign Out?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[14px] text-gray-500 mt-1">
                                You'll be logged out of your current session. Any unsaved changes may be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className="flex-1 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => { logout(); navigate('/'); }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-xl"
                            >
                                Sign Out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default DashboardSidebar;
