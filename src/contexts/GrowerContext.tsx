import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    getAccountType,
    getGrowerProfile,
    getGrowerToken,
    persistGrowerSession,
    type GrowerProfile,
} from '@/utils/authToken';
import { GROWER_ACCOUNT_TYPE } from '@/utils/growerRoutes';
import {
    DEV_GROWER_AGENT,
    DEV_GROWER_FARMS,
    DEV_GROWER_PROFILE,
    DEV_GROWER_STATS,
    isGrowerLocalhostBypass,
} from '@/utils/devGrower';

export type GrowerDashboardStats = {
    totalFarms: number;
    activeCrops: number;
    investorMatches: number;
    activeInvestorMatches: number;
    trainingSessions: number;
    totalEarnings: number;
    currentStage: string;
};

export type GrowerFarmSummary = {
    id: string;
    farmCode: string;
    name: string;
    crop: string;
    location: string;
    status: string;
    currentStage?: string;
};

export type GrowerAssignedAgent = {
    id: string;
    name: string;
    contact?: string;
    email?: string;
    agentId?: string;
    region?: string;
    district?: string;
};

type GrowerContextValue = {
    grower: GrowerProfile | null;
    assignedAgent: GrowerAssignedAgent | null;
    stats: GrowerDashboardStats | null;
    farms: GrowerFarmSummary[];
    loading: boolean;
    refreshGrower: () => Promise<void>;
    refreshDashboard: () => Promise<void>;
};

const GrowerContext = createContext<GrowerContextValue | undefined>(undefined);

export const GrowerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isGrowerSession =
        getAccountType() === GROWER_ACCOUNT_TYPE && !!getGrowerToken();
    const isLocalhostBypass = isGrowerLocalhostBypass() && !isGrowerSession;

    const [grower, setGrower] = useState<GrowerProfile | null>(() => {
        const stored = getGrowerProfile();
        if (stored) return stored;
        if (isLocalhostBypass) return DEV_GROWER_PROFILE;
        return null;
    });
    const [assignedAgent, setAssignedAgent] = useState<GrowerAssignedAgent | null>(() =>
        isLocalhostBypass ? DEV_GROWER_AGENT : null
    );
    const [stats, setStats] = useState<GrowerDashboardStats | null>(() =>
        isLocalhostBypass ? DEV_GROWER_STATS : null
    );
    const [farms, setFarms] = useState<GrowerFarmSummary[]>(() =>
        isLocalhostBypass ? DEV_GROWER_FARMS : []
    );
    const [loading, setLoading] = useState(false);

    const refreshGrower = useCallback(async () => {
        if (!isGrowerSession) return;
        try {
            const res = await api.get('/grower/me');
            const profile = res.data?.grower;
            if (profile) {
                setGrower(profile);
                const token = getGrowerToken();
                if (token) persistGrowerSession(token, profile);
            }
            setAssignedAgent(res.data?.assignedAgent || null);
        } catch {
            /* keep cached profile on transient errors */
        }
    }, [isGrowerSession]);

    const refreshDashboard = useCallback(async () => {
        if (!isGrowerSession) return;
        setLoading(true);
        try {
            const res = await api.get('/grower/dashboard');
            const profile = res.data?.grower;
            if (profile) {
                setGrower(profile);
                const token = getGrowerToken();
                if (token) persistGrowerSession(token, profile);
            }
            setStats(res.data?.stats || null);
            setFarms(Array.isArray(res.data?.farms) ? res.data.farms : []);
        } catch {
            /* dashboard falls back to empty stats in UI */
        } finally {
            setLoading(false);
        }
    }, [isGrowerSession]);

    useEffect(() => {
        if (isGrowerSession) {
            refreshGrower();
            refreshDashboard();
            return;
        }
        if (isLocalhostBypass) {
            setGrower(DEV_GROWER_PROFILE);
            setAssignedAgent(DEV_GROWER_AGENT);
            setStats(DEV_GROWER_STATS);
            setFarms(DEV_GROWER_FARMS);
        }
    }, [isGrowerSession, isLocalhostBypass, refreshGrower, refreshDashboard]);

    return (
        <GrowerContext.Provider
            value={{
                grower,
                assignedAgent,
                stats,
                farms,
                loading,
                refreshGrower,
                refreshDashboard,
            }}
        >
            {children}
        </GrowerContext.Provider>
    );
};

export const useGrower = (): GrowerContextValue => {
    const ctx = useContext(GrowerContext);
    if (!ctx) {
        throw new Error('useGrower must be used within GrowerProvider');
    }
    return ctx;
};

/** Safe hook for components that may render outside grower shell (e.g. admin preview). */
export const useGrowerOptional = (): GrowerContextValue | null => {
    return useContext(GrowerContext) ?? null;
};
