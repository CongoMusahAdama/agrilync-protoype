import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';
import { getRegionKey } from '@/data/ghanaRegions';
import {
    clearAuthSession,
    getAccessToken,
    getRefreshToken,
    persistAuthSession,
    refreshAccessToken,
} from '@/utils/authToken';

interface Agent {
    id: string;
    name: string;
    email: string;
    agentId: string;
    hasChangedPassword: boolean;
    isVerified: boolean;
    verificationStatus: string;
    region?: string;
    district?: string;
    community?: string;
    contact?: string;
    avatar?: string;
    role: 'super_admin' | 'supervisor' | 'agent';
    status: 'active' | 'inactive' | 'suspended';
    stats?: {
        farmersOnboarded: number;
        activeFarms: number;
        investorMatches: number;
        pendingDisputes: number;
        reportsThisMonth: number;
        trainingsAttended: number;
    };
}

interface AuthContextType {
    agent: Agent | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string, region?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateAgent: (updatedAgent: Partial<Agent>) => Promise<void>;
    setAgent: React.Dispatch<React.SetStateAction<Agent | null>>;
    setSession: (token: string, agent: Agent, refreshToken?: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [agent, setAgent] = useState<Agent | null>(null);
    const [token, setToken] = useState<string | null>(() => getAccessToken());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAgent = async () => {
            if (token) {
                try {
                    const res = await api.get('/agents/profile');
                    const profile = res.data;
                    setAgent({
                        ...profile,
                        region: getRegionKey(profile.region) || profile.region,
                    });
                } catch (err: any) {
                    console.error('Failed to load agent', err);
                    if (err?.response?.status === 401 && !getRefreshToken()) {
                        clearAuthSession();
                        setToken(null);
                        setAgent(null);
                    }
                }
            } else {
                setAgent(null);
            }
            setLoading(false);
        };

        loadAgent();
    }, [token]);

    // Keep session alive on long dashboard idle (super admin, agents)
    useEffect(() => {
        if (!token || !getRefreshToken()) return undefined;

        const REFRESH_INTERVAL_MS = 45 * 60 * 1000; // 45 minutes
        const id = window.setInterval(async () => {
            try {
                const newToken = await refreshAccessToken();
                setToken(newToken);
            } catch {
                // Interceptor handles hard logout on next API call
            }
        }, REFRESH_INTERVAL_MS);

        return () => window.clearInterval(id);
    }, [token]);

    const login = async (email: string, password: string, region?: string) => {
        const res = await api.post('/auth/login', { email, password, region });
        const { token, refreshToken, agent } = res.data;
        persistAuthSession(token, refreshToken);
        setToken(token);
        setAgent(agent);
    };

    const setSession = (accessToken: string, agent: Agent, refreshToken?: string | null) => {
        persistAuthSession(accessToken, refreshToken);
        setToken(accessToken);
        setAgent({
            ...agent,
            region: agent.region ? (getRegionKey(agent.region) || agent.region) : agent.region,
        });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout API call failed', err);
        } finally {
            clearAuthSession();
            setToken(null);
            setAgent(null);
        }
    };

    const updateAgent = async (updatedAgent: Partial<Agent>) => {
        try {
            const res = await api.put('/agents/profile', updatedAgent);
            const profile = res.data;
            setAgent({
                ...profile,
                region: getRegionKey(profile.region) || profile.region,
            });
            return res.data;
        } catch (error) {
            console.error('Update profile failed', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ agent, token, loading, login, logout, updateAgent, setAgent, setSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
