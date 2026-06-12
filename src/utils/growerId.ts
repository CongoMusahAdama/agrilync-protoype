/** Display grower system ID (LYG-########) — never Ghana Card. */
export const getGrowerDisplayId = (farmer?: {
    id?: string;
    lyncId?: string;
} | null): string => {
    const candidate = String(farmer?.id || farmer?.lyncId || '').trim();
    if (candidate && /^LYG-\d{8}$/i.test(candidate)) return candidate.toUpperCase();
    if (candidate && candidate.startsWith('LYG-') && !candidate.includes('GHA')) return candidate;
    return candidate || 'Pending';
};

export const buildGrowerVerifyUrl = (growerId: string): string => {
    const id = getGrowerDisplayId({ id: growerId });
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://agrilync.com';
    return `${origin}/verify/grower/${encodeURIComponent(id)}`;
};
