import { useNavigate, useLocation } from 'react-router-dom';
import {
    Map,
    Users,
    Activity,
    AlertTriangle,
    FileText,
    Settings,
    LogOut,
    LayoutDashboard,
    ShieldAlert,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
}
interface NavSection {
    section: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        section: 'Overview',
        items: [
            { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/super-admin' },
        ]
    },
    {
        section: 'Management',
        items: [
            { icon: Map, label: 'Regional Performance', path: '/dashboard/super-admin/regions' },
            { icon: Users, label: 'Agent Accountability', path: '/dashboard/super-admin/agents' },
            { icon: Users, label: 'User Management', path: '/dashboard/super-admin/users' },
            { icon: Activity, label: 'Farm Oversight', path: '/dashboard/super-admin/farms' },
        ]
    },
    {
        section: 'Monitoring',
        items: [
            { icon: AlertTriangle, label: 'Escalations', path: '/dashboard/super-admin/escalations' },
            { icon: ShieldAlert, label: 'System Logs', path: '/dashboard/super-admin/logs' },
        ]
    },
    {
        section: 'Reports',
        items: [
            { icon: FileText, label: 'Reports', path: '/dashboard/super-admin/reports' },
        ]
    },
    {
        section: 'Account',
        items: [
            { icon: Settings, label: 'Settings', path: '/dashboard/super-admin/settings' },
        ]
    },
];

const SuperAdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="hidden md:flex flex-col h-screen text-white fixed left-0 top-0 z-50 w-64 shadow-2xl"
            style={{ background: 'linear-gradient(180deg, #065f46 0%, #054d39 60%, #043d2c 100%)' }}>

            {/* Logo */}
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <img
                        src="/lovable-uploads/Frame 74.png"
                        alt="AgriLync"
                        className="h-[48px] w-auto object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <div>
                        <h1 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>AgriLync</h1>
                        <p className="text-[10px] font-semibold text-[#7ede56] uppercase tracking-widest mt-0.5">Super Admin</p>
                    </div>
                </div>
            </div>

            {/* Nav Sections */}
            <div className="flex-1 overflow-y-auto px-3 pb-2 custom-scrollbar">
                {navSections.map((section, sectionIdx) => (
                    <div key={section.section} className={sectionIdx === 0 ? '' : 'mt-1'}>
                        {/* Section Label */}
                        <div className={`px-2 ${sectionIdx === 0 ? 'pt-3' : 'pt-4'} pb-1.5`}>
                            <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.22em]">
                                {section.section}
                            </p>
                        </div>
                        {/* Items */}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <div
                                        key={item.path}
                                        className={cn(
                                            'flex items-center gap-3.5 px-4 py-[11px] rounded-xl cursor-pointer transition-all duration-200 group relative',
                                            isActive
                                                ? 'bg-white text-[#065f46] shadow-lg shadow-black/25'
                                                : 'text-white/65 hover:text-white hover:bg-white/[0.08]'
                                        )}
                                        onClick={() => navigate(item.path)}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#7ede56] rounded-r-full" />
                                        )}
                                        <item.icon className={cn(
                                            'h-[18px] w-[18px] shrink-0 transition-all duration-200',
                                            isActive ? 'text-[#065f46]' : 'text-white/50 group-hover:text-white'
                                        )} />
                                        <span
                                            className={cn(
                                                'text-[13.5px] font-medium tracking-[-0.01em] truncate transition-all',
                                                isActive && 'font-semibold'
                                            )}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sign Out */}
            <div className="p-4 border-t border-white/10">
                <div
                    className="flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-pointer text-white/40 hover:text-white hover:bg-red-500/10 transition-all group"
                    onClick={handleLogout}
                >
                    <LogOut className="h-[18px] w-[18px] shrink-0 group-hover:translate-x-0.5 transition-transform text-white/40 group-hover:text-red-400" />
                    <span className="text-[13.5px] font-medium group-hover:text-red-400 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Sign Out
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminSidebar;
