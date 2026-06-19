import { Coins, FileText, Sprout, User, type LucideIcon } from 'lucide-react';

export type GrowerOnboardingStep = {
    id: number;
    label: string;
    sub: string;
    icon: LucideIcon;
};

/** Matches agent AddFarmerModal step labels. */
export const GROWER_ONBOARDING_STEPS: GrowerOnboardingStep[] = [
    { id: 1, label: 'Identity', sub: 'Name, phone & ID', icon: User },
    { id: 2, label: 'Farm', sub: 'Location & crops', icon: Sprout },
    { id: 3, label: 'Investment', sub: 'Optional funding info', icon: Coins },
    { id: 4, label: 'Verify', sub: 'Photos & status', icon: FileText },
];

export const GROWER_TRAINING_MODULE_LABELS: Record<string, string> = {
    soil_crop: 'Soil & Crop Management',
    financial_lit: 'Financial Literacy & Record Keeping',
    market_access: 'Market Access & Pricing',
    sustainable_farming: 'Sustainable Farming Practices',
    climate_smart: 'Climate Smart Agriculture',
    farmpartner_orientation: 'FarmPartner Investment Orientation',
};

export const formatFarmType = (value?: string) => {
    if (!value) return '—';
    const map: Record<string, string> = {
        crop: 'Crop',
        livestock: 'Livestock',
        mixed: 'Mixed',
        aquaculture: 'Aquaculture',
    };
    return map[value] || value;
};

export const formatInvestmentInterest = (value?: string) => {
    if (!value) return '—';
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatLivestockInventory = (
    inventory?: Array<{ type?: string; count?: number; otherLabel?: string }>
) => {
    if (!inventory?.length) return '—';
    return inventory
        .filter((item) => item.count && item.count > 0)
        .map((item) => {
            const label = item.type === 'Other' ? item.otherLabel || 'Other' : item.type;
            return `${label} (${item.count})`;
        })
        .join(', ');
};
