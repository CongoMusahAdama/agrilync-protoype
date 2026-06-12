/** Age in full years from onboarding date string (YYYY-MM-DD or ISO) */
export const calcGrowerAge = (dob?: string | null): number | null => {
    if (!dob) return null;
    const raw = String(dob).trim();
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const birth = iso
        ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
        : new Date(raw);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
    return age >= 0 && age < 130 ? age : null;
};

export const parseYearsOfExperience = (value?: number | string | null): number | null => {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : null;
};

/** Map years of farming experience to a 1–5 star tier for the ID card */
export const experienceStarCount = (years?: number | null): number => {
    const y = Number(years) || 0;
    if (y <= 0) return 1;
    if (y <= 2) return 2;
    if (y <= 5) return 3;
    if (y <= 10) return 4;
    return 5;
};

export const formatCardIssueDate = (value?: string | Date | null): string => {
    if (!value) {
        return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) {
        return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getDigitalCardNumber = (farmer?: {
    digitalCardNumber?: string;
} | null): string => farmer?.digitalCardNumber || 'Pending';

/** Card label under "Lync Grower" — Livestock Farmer, Crop Farmer, Mixed Farmer, etc. */
export const formatDobForCard = (dob?: string | null): string => {
    if (!dob) return '—';
    const raw = String(dob).trim();
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
        const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
        if (!Number.isNaN(d.getTime())) {
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
    }
    const d = new Date(raw);
    return Number.isNaN(d.getTime())
        ? '—'
        : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatFarmTypeForCard = (farmType?: string | null): string => {
    const raw = String(farmType || '').toLowerCase().trim();
    if (!raw) return 'Crop Farmer';
    if (raw.includes('livestock')) return 'Livestock Farmer';
    if (raw.includes('mixed')) return 'Mixed Farmer';
    if (raw.includes('aquaculture')) return 'Aquaculture Farmer';
    if (raw.includes('crop')) return 'Crop Farmer';
    const titled = raw.charAt(0).toUpperCase() + raw.slice(1);
    return titled.endsWith('Farmer') ? titled : `${titled} Farmer`;
};

export type GrowerCardData = {
    growerId: string;
    cardNumber: string;
    verifyUrl: string;
    profileSrc: string;
    name: string;
    age: number | null;
    yearsExp: number | null;
    stars: number;
    issueDate: string;
    dobLabel: string;
    gender: string;
    region: string;
    district: string;
    community: string;
    fieldAgent: string;
    fieldAgentName: string;
    farmTypeLabel: string;
    contact: string;
};

export const buildGrowerCardData = (
    farmer: any,
    growerId: string,
    verifyUrl: string
): GrowerCardData => ({
    growerId,
    cardNumber: getDigitalCardNumber(farmer),
    verifyUrl,
    profileSrc:
        farmer.profilePicture ||
        farmer.avatar ||
        farmer.photo ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(farmer.name || 'Grower')}`,
    name: farmer.name || 'Grower',
    age: calcGrowerAge(farmer.dob),
    yearsExp: parseYearsOfExperience(farmer.yearsOfExperience),
    stars: experienceStarCount(parseYearsOfExperience(farmer.yearsOfExperience) ?? 0),
    issueDate: formatCardIssueDate(farmer.digitalCardIssuedAt),
    dobLabel: formatDobForCard(farmer.dob),
    gender: farmer.gender ? String(farmer.gender) : '—',
    region: farmer.region || '—',
    district: farmer.district || farmer.region || '—',
    community: farmer.community || '—',
    fieldAgent: farmer.agent?.agentId || farmer.agentId || farmer.onboardingAgentId || '—',
    fieldAgentName: farmer.agent?.name || '—',
    farmTypeLabel: formatFarmTypeForCard(farmer.farmType),
    contact: farmer.contact || '—',
});
