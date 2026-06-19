import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    ClipboardList,
    GraduationCap,
    HelpCircle,
    Home,
    Leaf,
    LogOut,
    Settings,
    Wheat,
    ArrowRight,
    X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getGrowerProfile } from '@/utils/authToken';
import { useGrowerOptional } from '@/contexts/GrowerContext';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
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
} from '@/components/ui/alert-dialog';

type MenuItem = {
    id: string;
    label: string;
    icon: React.ElementType;
    route?: string;
};

const MENU_ITEMS: MenuItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home, route: GROWER_ROUTES.dashboard },
    { id: 'farm-profile', label: 'My Farm Profile', icon: Leaf, route: GROWER_ROUTES.farmProfile },
    { id: 'project-funding', label: 'Project & Funding', icon: BarChart3, route: GROWER_ROUTES.projectFunding },
    { id: 'training', label: 'Training', icon: GraduationCap, route: GROWER_ROUTES.training },
    { id: 'farm-visits', label: 'Farm Visits & Reports', icon: ClipboardList, route: GROWER_ROUTES.farmVisits },
    { id: 'yield-harvest', label: 'Yield & Harvest', icon: Wheat, route: GROWER_ROUTES.yieldHarvest },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, route: GROWER_ROUTES.help },
    { id: 'settings', label: 'Settings', icon: Settings, route: GROWER_ROUTES.settings },
];

type Props = {
    activeItem: string;
    onNavigate: (itemId: string) => void;
    onClose: () => void;
};

const GrowerMobileDrawer: React.FC<Props> = ({ activeItem, onNavigate, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const grower = useGrowerOptional()?.grower ?? getGrowerProfile();

    const displayName = grower?.name || 'Lync Grower';
    const initials = displayName
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    const avatarSrc = grower?.profilePicture
        ? resolvePublicAssetUrl(grower.profilePicture)
        : undefined;

    const go = (item: MenuItem) => {
        onNavigate(item.id);
    };

    return (
        <div className="flex flex-col h-full bg-[#7ede56] overflow-hidden">
            {/* Profile header */}
            <div className="shrink-0 px-5 pt-6 pb-7 text-white">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="h-14 w-14 border-[3px] border-white/50 shadow-lg shrink-0">
                            <AvatarImage src={avatarSrc} alt={displayName} className="object-cover" />
                            <AvatarFallback className="bg-white text-[#002f37] font-black">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 text-left flex-1">
                            <p className="text-lg font-bold leading-tight truncate">{displayName}</p>
                            <p className="text-sm text-white/90 mt-0.5">Lync Grower</p>
                            {grower?.lyncId ? (
                                <p className="text-[10px] font-bold uppercase tracking-wider text-white/75 mt-1">
                                    {grower.lyncId}
                                </p>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => onNavigate('account')}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#002f37] shadow-sm active:scale-[0.98] transition-transform"
                            >
                                View Profile
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 shrink-0 active:scale-95 transition-transform"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Menu panel — rounded overlap, no wave */}
            <div className="flex flex-1 flex-col min-h-0 bg-white rounded-t-[1.75rem] shadow-[0_-6px_28px_rgba(0,47,55,0.12)]">
                <nav className="flex-1 overflow-y-auto px-4 pt-5 pb-3 space-y-0.5" aria-label="Grower menu">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = activeItem === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => go(item)}
                                className={`flex w-full items-center gap-3.5 rounded-2xl px-2 py-3 text-left transition-colors active:scale-[0.99] ${
                                    active ? 'bg-[#7ede56]/12' : 'hover:bg-gray-50'
                                }`}
                            >
                                <span
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                        active ? 'bg-[#7ede56] text-white' : 'bg-[#7ede56]/18 text-[#002f37]'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" strokeWidth={2} />
                                </span>
                                <span className="text-[15px] font-semibold text-[#002f37]">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="shrink-0 border-t border-gray-100 p-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                type="button"
                                className="flex w-full items-center gap-3.5 rounded-2xl px-2 py-3 text-left hover:bg-red-50 transition-colors"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <LogOut className="h-5 w-5" />
                                </span>
                                <span className="text-[15px] font-semibold text-red-600">Log out</span>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl max-w-sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Sign out?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You will leave your grower session on this device.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="rounded-xl bg-red-500 hover:bg-red-600"
                                    onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}
                                >
                                    Sign out
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};

export default GrowerMobileDrawer;
