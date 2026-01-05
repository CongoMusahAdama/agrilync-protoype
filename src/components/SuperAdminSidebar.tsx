import { useNavigate, useLocation } from 'react-router-dom';
import {
    CreditCard,
    Map,
    Users,
    Activity,
    AlertTriangle,
    FileText,
    Settings,
    LogOut,
    LayoutDashboard,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const SuperAdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const width = 'w-64'; // Fixed width

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/super-admin' },
        { icon: Map, label: 'Regional Performance', path: '/dashboard/super-admin/regions' },
        { icon: Users, label: 'Agent Accountability', path: '/dashboard/super-admin/agents' },
        { icon: Users, label: 'User Management', path: '/dashboard/super-admin/users' },
        { icon: Activity, label: 'Farm Oversight', path: '/dashboard/super-admin/farms' },
        { icon: AlertTriangle, label: 'Escalations', path: '/dashboard/super-admin/escalations' },
        { icon: ShieldAlert, label: 'System Logs', path: '/dashboard/super-admin/logs' },
        { icon: FileText, label: 'Reports', path: '/dashboard/super-admin/reports' },
        { icon: Settings, label: 'Settings', path: '/dashboard/super-admin/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className={cn("hidden md:flex flex-col h-screen bg-[#002f37] text-white fixed left-0 top-0 z-50", width)}>
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold text-[#7ede56]">AgriLync</h1>
                <p className="text-xs text-gray-400 mt-1">SUPER ADMIN</p>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Button
                            key={item.path}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-white/10",
                                isActive && "bg-white/10 text-[#7ede56] font-medium"
                            )}
                            onClick={() => navigate(item.path)}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Button>
                    );
                })}
            </div>

            <div className="p-6 border-t border-white/10">
                <Button
                    variant="destructive"
                    className="w-full justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default SuperAdminSidebar;
