import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';
import { isLocalhost } from '@/utils/env';

interface Agent {
    id: string;
    name: string;
    email: string;
    agentId: string;
    hasChangedPassword: boolean;
    isVerified: boolean;
    verificationStatus: string;
    region?: string;
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
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateAgent: (updatedAgent: Partial<Agent>) => Promise<void>;
    setAgent: React.Dispatch<React.SetStateAction<Agent | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [agent, setAgent] = useState<Agent | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAgent = async () => {
            const isDev = isLocalhost();
            
            if (token) {
                try {
                    // Always fetch fresh profile from database to ensure role and session are valid
                    const res = await api.get('/agents/profile');
                    setAgent(res.data);
                } catch (err: any) {
                    console.error('Failed to load agent', err);
                    // If 401, clear token
                    if (err?.response?.status === 401) {
                        localStorage.removeItem('token');
                        setToken(null);
                        setAgent(null);
                    }
                }
            } else {
                // On localhost, allow access without token but still try to fetch from DB
                // This allows testing without login while still using real data
                if (isDev) {
                    try {
                        // Try to fetch agent profile without token (may fail, that's OK)
                        const res = await api.get('/agents/profile');
                        setAgent(res.data);
                    } catch (err) {
                        // If no token and fetch fails, just allow access without agent
                        // This is expected on localhost for testing
                        setAgent(null);
                    }
                } else {
                    setAgent(null);
                }
            }
            setLoading(false);
        };

        loadAgent();
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, agent } = res.data;
        localStorage.setItem('token', token);
        setToken(token);
        setAgent(agent);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout API call failed', err);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setAgent(null);
        }
    };

    const updateAgent = async (updatedAgent: Partial<Agent>) => {
        try {
            const res = await api.put('/agents/profile', updatedAgent);
            setAgent(res.data);
            return res.data;
        } catch (error) {
            console.error('Update profile failed', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ agent, token, loading, login, logout, updateAgent, setAgent }}>
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
