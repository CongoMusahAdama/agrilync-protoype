import { GROWER_ROUTES } from '@/utils/growerRoutes';

/** Lync Grower dashboard — final simplified IA (FF001–FF005 aligned). */
export type GrowerNavItem = {
    id: string;
    label: string;
    route: string;
    features: string[];
};

export type GrowerNavSection = {
    section: string;
    items: GrowerNavItem[];
};

export const GROWER_NAV_SECTIONS: GrowerNavSection[] = [
    {
        section: 'Overview',
        items: [
            {
                id: 'dashboard',
                label: 'Home',
                route: GROWER_ROUTES.dashboard,
                features: [
                    'Verification status (Pending Review, Verified, Incomplete/Returned)',
                    'Project status flag: On Track / At Risk / Off Track',
                    'Farm snapshot: crop/livestock, size, planting date, days since planting',
                ],
            },
        ],
    },
    {
        section: 'My Farm',
        items: [
            {
                id: 'farm-profile',
                label: 'My Farm Profile',
                route: GROWER_ROUTES.farmProfile,
                features: [
                    'Farm insight — season progress, map, and photos',
                    'About my farm (English bio for investors when verified)',
                    'Your notes per season stage',
                    'Edit official details in Settings',
                ],
            },
            {
                id: 'project-funding',
                label: 'Project & Funding',
                route: GROWER_ROUTES.projectFunding,
                features: [
                    'Investment terms and funding status',
                    'Milestone-based disbursement progress and timeline',
                    'On Track / At Risk / Off Track visibility (training & visits for now; funding later)',
                ],
            },
        ],
    },
    {
        section: 'Growth',
        items: [
            {
                id: 'training',
                label: 'Training',
                route: GROWER_ROUTES.training,
                features: [
                    'Assigned modules (Financial Literacy, Farm Planning)',
                    'Completion status in preferred language',
                    'Certificates and digital badges for partners',
                ],
            },
            {
                id: 'farm-visits',
                label: 'Farm Visits & Reports',
                route: GROWER_ROUTES.farmVisits,
                features: [
                    'Agent visit history (agent-onboarded farmers)',
                    'Self-reported updates with photos and status flags',
                    'Transparency into partner-facing farm reports',
                ],
            },
            {
                id: 'yield-harvest',
                label: 'Yield & Harvest',
                route: GROWER_ROUTES.yieldHarvest,
                features: [
                    'Season-end harvest data (manual entry for now)',
                    'Settlement and repayment information',
                ],
            },
        ],
    },
    {
        section: 'Account',
        items: [
            {
                id: 'help',
                label: 'Help & Support',
                route: GROWER_ROUTES.help,
                features: [
                    'Call, WhatsApp, and email contact',
                    'Farmer-facing FAQs',
                    'Request agent visit or raise an issue',
                ],
            },
            {
                id: 'settings',
                label: 'Settings',
                route: GROWER_ROUTES.settings,
                features: [
                    'Language preference',
                    'Notification preferences (SMS vs in-app)',
                    'Profile and contact update requests',
                ],
            },
        ],
    },
];

/** Sign-up lives outside the dashboard shell. */
export const GROWER_SIGNUP_FEATURES = [
    'Self-service registration: name, Ghana Card, phone, GPS pin',
    'Farm size, crop/livestock type, language, photo upload',
    'Same admin review queue as agent-submitted profiles',
    'Status: Pending Review, Verified, or Incomplete/Returned (with reason)',
];

export const getGrowerNavItem = (id: string): GrowerNavItem | undefined =>
    GROWER_NAV_SECTIONS.flatMap((s) => s.items).find((item) => item.id === id);
