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
    logout: () => void;
    updateAgent: (updatedAgent: Partial<Agent>) => Promise<void>;
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
                    const res = await api.get('/agents/profile');
                    setAgent(res.data);
                } catch (err) {
                    console.error('Failed to load agent', err);
                    localStorage.removeItem('token');
                    setToken(null);
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

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setAgent(null);
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
        <AuthContext.Provider value={{ agent, token, loading, login, logout, updateAgent }}>
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
