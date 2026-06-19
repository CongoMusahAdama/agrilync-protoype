import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
import { GD_BTN_PILL, GD_FONT } from '@/constants/growerDashboardTypography';

type NavTab = {
    id: string;
    label: string;
    mobileLabel?: string;
    route: string;
    activeClass: string;
    inactiveClass: string;
};

const NAV_TABS: NavTab[] = [
    {
        id: 'farm-profile',
        label: 'Profile',
        route: GROWER_ROUTES.farmProfile,
        activeClass: 'bg-[#7ede56] text-white shadow-md shadow-[#7ede56]/25',
        inactiveClass: 'text-[#002f37] bg-[#7ede56]/12',
    },
    {
        id: 'training',
        label: 'Training',
        mobileLabel: 'Train',
        route: GROWER_ROUTES.training,
        activeClass: 'bg-orange-600 text-white shadow-md shadow-orange-600/20',
        inactiveClass: 'text-orange-700 bg-orange-50',
    },
    {
        id: 'farm-visits',
        label: 'Visits',
        route: GROWER_ROUTES.farmVisits,
        activeClass: 'bg-blue-600 text-white shadow-md shadow-blue-600/20',
        inactiveClass: 'text-blue-700 bg-blue-50',
    },
    {
        id: 'help',
        label: 'Support',
        mobileLabel: 'Help',
        route: GROWER_ROUTES.help,
        activeClass: 'bg-rose-600 text-white shadow-md shadow-rose-600/20',
        inactiveClass: 'text-rose-700 bg-rose-50',
    },
];

const GrowerHomeShortcuts: React.FC<{ mobileOnly?: boolean }> = ({ mobileOnly = false }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isTabActive = (route: string) =>
        location.pathname === route || location.pathname.startsWith(`${route}/`);

    if (mobileOnly) {
        return (
            <div className={`grid grid-cols-4 gap-1.5 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm ${GD_FONT}`}>
                {NAV_TABS.map((tab) => {
                    const active = isTabActive(tab.route);
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => navigate(tab.route)}
                            className={`${GD_BTN_PILL} flex items-center justify-center rounded-xl py-3 px-1 min-h-[42px] leading-none text-center transition-all active:scale-[0.97] ${
                                active ? tab.activeClass : tab.inactiveClass
                            }`}
                        >
                            {tab.mobileLabel ?? tab.label}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={`bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm overflow-x-auto scrollbar-hide flex gap-1.5 md:grid md:grid-cols-4 md:overflow-visible ${GD_FONT}`}>
            {NAV_TABS.map((tab) => {
                const active = isTabActive(tab.route);
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => navigate(tab.route)}
                        className={`${GD_BTN_PILL} shrink-0 md:shrink md:w-auto px-5 sm:px-8 py-3.5 rounded-xl text-xs sm:text-[11px] tracking-wider transition-all whitespace-nowrap min-h-[44px] ${
                            active ? `${tab.activeClass} scale-[1.02]` : tab.inactiveClass
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default GrowerHomeShortcuts;
