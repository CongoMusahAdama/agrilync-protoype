import { getAccessToken, getRefreshToken } from '@/utils/authToken';

const AGENT_PROFILE_KEY = 'agentProfile';
const OFFLINE_CREDENTIAL_HASH_KEY = 'offlineCredentialHash';
const OFFLINE_CREDENTIAL_EMAIL_KEY = 'offlineCredentialEmail';
const DEVICE_SALT_KEY = 'offlineAuthDeviceSalt';

export type CachedAgentProfile = {
    id: string;
    name: string;
    email: string;
    agentId: string;
    hasChangedPassword: boolean;
    isVerified: boolean;
    verificationStatus: string;
    region?: string;
    avatar?: string;
    role: 'super_admin' | 'supervisor' | 'agent';
    status: 'active' | 'inactive' | 'suspended';
};

type OfflineLoginResult = {
    token: string;
    refreshToken: string | null;
    agent: CachedAgentProfile;
};

function normalizeLoginId(value: string): string {
    return value.trim().toLowerCase();
}

function normalizeRegion(value: string): string {
    return value.toLowerCase().replace(' region', '').trim();
}

function regionsMatch(selected: string, assigned: string): boolean {
    const a = normalizeRegion(selected);
    const b = normalizeRegion(assigned);
    return a === b || b.includes(a) || a.includes(b);
}

async function getDeviceSalt(): Promise<string> {
    let salt = localStorage.getItem(DEVICE_SALT_KEY);
    if (!salt) {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        salt = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem(DEVICE_SALT_KEY, salt);
    }
    return salt;
}

async function hashCredentials(email: string, password: string): Promise<string> {
    const salt = await getDeviceSalt();
    const payload = `${salt}:${normalizeLoginId(email)}:${password}`;
    const encoded = new TextEncoder().encode(payload);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export function persistAgentProfile(agent: CachedAgentProfile): void {
    localStorage.setItem(AGENT_PROFILE_KEY, JSON.stringify(agent));
}

export function getCachedAgentProfile(): CachedAgentProfile | null {
    try {
        const raw = localStorage.getItem(AGENT_PROFILE_KEY);
        return raw ? (JSON.parse(raw) as CachedAgentProfile) : null;
    } catch {
        return null;
    }
}

export async function saveOfflineLogin(
    email: string,
    password: string,
    agent: CachedAgentProfile
): Promise<void> {
    const hash = await hashCredentials(email, password);
    localStorage.setItem(OFFLINE_CREDENTIAL_HASH_KEY, hash);
    localStorage.setItem(OFFLINE_CREDENTIAL_EMAIL_KEY, normalizeLoginId(email));
    persistAgentProfile(agent);
}

export async function tryOfflineLogin(
    email: string,
    password: string,
    region: string
): Promise<OfflineLoginResult | null> {
    const storedHash = localStorage.getItem(OFFLINE_CREDENTIAL_HASH_KEY);
    const storedEmail = localStorage.getItem(OFFLINE_CREDENTIAL_EMAIL_KEY);
    const agent = getCachedAgentProfile();
    const token = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!storedHash || !storedEmail || !agent || !token) {
        return null;
    }

    if (normalizeLoginId(email) !== storedEmail) {
        return null;
    }

    const hash = await hashCredentials(email, password);
    if (hash !== storedHash) {
        return null;
    }

    if (!agent.region || !regionsMatch(region, agent.region)) {
        return null;
    }

    return { token, refreshToken, agent };
}

export function hasOfflineLoginSaved(): boolean {
    return !!(
        localStorage.getItem(OFFLINE_CREDENTIAL_HASH_KEY) &&
        localStorage.getItem(OFFLINE_CREDENTIAL_EMAIL_KEY) &&
        getCachedAgentProfile() &&
        getAccessToken()
    );
}

export function clearOfflineAuth(): void {
    localStorage.removeItem(AGENT_PROFILE_KEY);
    localStorage.removeItem(OFFLINE_CREDENTIAL_HASH_KEY);
    localStorage.removeItem(OFFLINE_CREDENTIAL_EMAIL_KEY);
}
