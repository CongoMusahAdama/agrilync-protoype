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
