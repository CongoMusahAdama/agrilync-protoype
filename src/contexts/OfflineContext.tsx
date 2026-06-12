import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    cacheFarmers,
    getCachedFarmers,
    getFarmersCachedAt,
    fetchAllAgentFarmers,
    preloadErrorMessage,
    getPendingSyncCount,
    getPendingSyncSummary,
    processSyncQueue,
    SYNC_DEBOUNCE_MS,
    type CachedFarmer,
    type SyncResult,
} from '@/lib/offline';
import { toast } from 'sonner';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

type PendingSummary = { total: number; farmers: number; visits: number };

type OfflineContextValue = {
    isOnline: boolean;
    pendingCount: number;
    pendingSummary: PendingSummary;
    cachedFarmers: CachedFarmer[];
    farmersCachedAt: number | null;
    isSyncing: boolean;
    isPreloading: boolean;
    preloadFieldData: () => Promise<void>;
    syncNow: () => Promise<SyncResult>;
    refreshOfflineState: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextValue | null>(null);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isOnline = useOnlineStatus();
    const queryClient = useQueryClient();
    const [pendingCount, setPendingCount] = useState(0);
    const [pendingSummary, setPendingSummary] = useState<PendingSummary>({
        total: 0,
        farmers: 0,
        visits: 0,
    });
    const [cachedFarmers, setCachedFarmers] = useState<CachedFarmer[]>([]);
    const [farmersCachedAt, setFarmersCachedAt] = useState<number | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isPreloading, setIsPreloading] = useState(false);

    const refreshOfflineState = useCallback(async () => {
        const [count, summary, farmers, cachedAt] = await Promise.all([
            getPendingSyncCount(),
            getPendingSyncSummary(),
            getCachedFarmers(),
            getFarmersCachedAt(),
        ]);
        setPendingCount(count);
        setPendingSummary(summary);
        setCachedFarmers(farmers);
        setFarmersCachedAt(cachedAt);
    }, []);

    useEffect(() => {
        void refreshOfflineState();
    }, [refreshOfflineState]);

    const syncNow = useCallback(async () => {
        if (!isOnline) {
            return { synced: 0, failed: 0, errors: ['No internet connection'] };
        }
        setIsSyncing(true);
        try {
            const result = await processSyncQueue();
            await refreshOfflineState();
            if (result.synced > 0) {
                await queryClient.invalidateQueries({ queryKey: ['fieldVisits'] });
                await queryClient.invalidateQueries({ queryKey: ['scheduledVisits'] });
                await queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
                await queryClient.invalidateQueries({ queryKey: ['agentFarmers'] });
                await queryClient.invalidateQueries({ queryKey: ['farmers'] });
                await queryClient.invalidateQueries({ queryKey: ['agentFarmersDirectory'] });
                toast.success(`${result.synced} item(s) synced to AgriLync`);
            }
            if (result.errors.length > 0) {
                toast.error(result.errors[0]);
            } else if (result.failed > 0 && result.synced === 0) {
                toast.error('Some items could not sync. Will retry when online.');
            }
            return result;
        } finally {
            setIsSyncing(false);
        }
    }, [isOnline, refreshOfflineState, queryClient]);

    useEffect(() => {
        if (!isOnline || pendingCount === 0) return;
        const timer = window.setTimeout(() => {
            void syncNow();
        }, SYNC_DEBOUNCE_MS);
        return () => window.clearTimeout(timer);
    }, [isOnline, pendingCount, syncNow]);

    const preloadFieldData = useCallback(async () => {
        if (!isOnline) {
            toast.error('Connect to the internet to download grower data.');
            return;
        }
        setIsPreloading(true);
        try {
            const allFarmers = await fetchAllAgentFarmers();
            const savedCount = await cacheFarmers(allFarmers);
            await refreshOfflineState();
            if (savedCount === 0) {
                toast.info('No growers to download yet. Onboard growers first, then download again.');
            } else {
                toast.success(`Downloaded ${savedCount} grower(s) for offline use`);
            }
        } catch (err) {
            console.error('[offline] preloadFieldData failed:', err);
            toast.error(preloadErrorMessage(err));
        } finally {
            setIsPreloading(false);
        }
    }, [isOnline, refreshOfflineState]);

    const value = useMemo(
        () => ({
            isOnline,
            pendingCount,
            pendingSummary,
            cachedFarmers,
            farmersCachedAt,
            isSyncing,
            isPreloading,
            preloadFieldData,
            syncNow,
            refreshOfflineState,
        }),
        [
            isOnline,
            pendingCount,
            pendingSummary,
            cachedFarmers,
            farmersCachedAt,
            isSyncing,
            isPreloading,
            preloadFieldData,
            syncNow,
            refreshOfflineState,
        ]
    );

    return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};

export const useOffline = () => {
    const ctx = useContext(OfflineContext);
    if (!ctx) {
        throw new Error('useOffline must be used within OfflineProvider');
    }
    return ctx;
};

/** Safe hook for components that may render outside OfflineProvider */
export const useOfflineOptional = () => useContext(OfflineContext);
