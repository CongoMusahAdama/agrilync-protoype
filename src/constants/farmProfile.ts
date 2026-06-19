export const FARM_STATUS_LABELS: Record<string, { label: string; className: string }> = {
    on_track: { label: 'On Track', className: 'bg-[#7ede56] text-[#065f46]' },
    at_risk: { label: 'At Risk', className: 'bg-amber-100 text-amber-800' },
    off_track: { label: 'Off Track', className: 'bg-red-100 text-red-800' },
};

export const PRIMARY_ACTIVITY_LABELS: Record<string, string> = {
    crop: 'Crop',
    livestock: 'Livestock',
    mixed: 'Crop & Livestock',
};

/** Matches agent dashboard tables */
export const AGENT_TABLE = {
    header: 'bg-[#065f46]',
    headRow: 'border-none hover:bg-transparent',
    headCell:
        'text-white font-black text-[10px] uppercase tracking-widest py-4 px-4 sm:px-6 bg-[#065f46] border-r border-white/10 last:border-r-0',
    bodyRow: 'border-b border-gray-100 hover:bg-[#065f46]/5',
    bodyCell: 'text-gray-800 font-medium text-sm py-4 px-4 sm:px-6',
} as const;

export const GROWER_PROFILE_CARD =
    'bg-white rounded-2xl border border-gray-200/60 shadow-[0_8px_30px_rgba(0,47,55,0.06)] overflow-hidden w-full';

export const FARM_HERO_IMAGE =
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop';

/** Homepage Partnership Tiers banner (InvestmentPackagesSection) */
export const FARM_PARTNERSHIP_HERO_IMAGE = '/lovable-uploads/investment.png';

/** Farm identity metric card — defaults by activity (use resolveFarmIdentityBackground for specifics) */
export const FARM_IDENTITY_BG: Record<string, string> = {
    crop: '/lovable-uploads/image%20copy%2020.png',
    livestock: '/lovable-uploads/image%20copy%2021.png',
    mixed: FARM_PARTNERSHIP_HERO_IMAGE,
};
