import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';

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
            if (token) {
                try {
                    // Always fetch fresh profile to ensure role and session are valid
                    const res = await api.get('/agents/profile');
                    setAgent(res.data);
                } catch (err) {
                    console.error('Failed to load agent', err);
                    // If 401, clear token
                    // @ts-ignore
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem('token');
                        setToken(null);
                        setAgent(null);
                    }
                    // If other error (network), keep token for retry? Or maybe not.
                    // For now, let's strictly clear on auth failure
                }
            } else {
                setAgent(null);
            }
            setLoading(false);
        };

        loadAgent();
    }, [token]); // Remove 'agent' from dependency to avoid loop if we wanted to enforce fresh fetch.
    // Actually, if we depend on 'agent', and we setAgent, it triggers again. 
    // We only want to run when token changes (login/logout/startup).

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
