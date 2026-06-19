import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, Home, Leaf, Menu } from 'lucide-react';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
import { cn } from '@/lib/utils';

type TabDef = {
    id: string;
    label: string;
    icon: React.ElementType;
    route?: string;
    action?: 'more';
};

const TABS: TabDef[] = [
    { id: 'dashboard', label: 'Home', icon: Home, route: GROWER_ROUTES.dashboard },
    { id: 'farm-profile', label: 'Farm', icon: Leaf, route: GROWER_ROUTES.farmProfile },
    { id: 'training', label: 'Train', icon: BookOpen, route: GROWER_ROUTES.training },
    { id: 'project-funding', label: 'Fund', icon: BarChart3, route: GROWER_ROUTES.projectFunding },
    { id: 'more', label: 'More', icon: Menu, action: 'more' },
];

type Props = {
    activeSidebarItem: string;
    moreOpen: boolean;
    onOpenMore: () => void;
    onNavigateStart?: () => void;
};

const GrowerMobileBottomNav: React.FC<Props> = ({
    activeSidebarItem,
    moreOpen,
    onOpenMore,
    onNavigateStart,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isTabActive = (tab: TabDef) => {
        if (tab.action === 'more') return moreOpen;
        return activeSidebarItem === tab.id;
    };

    const isOnRoute = (route: string) =>
        location.pathname === route || location.pathname.startsWith(`${route}/`);

    const handleTab = (tab: TabDef) => {
        if (tab.action === 'more') {
            onOpenMore();
            return;
        }
        if (tab.route && !isOnRoute(tab.route)) {
            onNavigateStart?.();
            navigate(tab.route);
        }
    };

    return (
        <div className="grower-mobile-bottom-nav pointer-events-none fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
            <nav
                className="pointer-events-auto mx-auto grid w-full max-w-[22rem] grid-cols-5 items-center rounded-[1.75rem] bg-[#002f37] px-1 py-1.5 shadow-[0_10px_40px_rgba(0,47,55,0.5)] ring-1 ring-white/8"
                aria-label="Grower navigation"
            >
                {TABS.map((tab) => {
                    const active = isTabActive(tab);
                    const Icon = tab.icon;

                    return (
                        <div key={tab.id} className="flex justify-center px-0.5">
                            <button
                                type="button"
                                onClick={() => handleTab(tab)}
                                aria-label={tab.label}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'grower-mobile-nav-tab flex items-center justify-center rounded-full transition-all duration-300 ease-out',
                                    active
                                        ? 'gap-1 bg-[#7ede56] px-2 py-2 min-h-[40px] max-w-full'
                                        : 'h-10 w-10 text-white/45 hover:text-white/70'
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'shrink-0',
                                        active
                                            ? 'h-[15px] w-[15px] text-[#002f37]'
                                            : 'h-[19px] w-[19px]'
                                    )}
                                    strokeWidth={active ? 2.25 : 1.75}
                                />
                                {active ? (
                                    <span className="truncate text-[10px] font-bold leading-none text-[#002f37]">
                                        {tab.label}
                                    </span>
                                ) : null}
                            </button>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default GrowerMobileBottomNav;
