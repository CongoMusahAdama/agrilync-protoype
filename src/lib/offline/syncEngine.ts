import api from '@/utils/api';
import {
    bumpSyncRetry,
    getSyncQueue,
    removeSyncItem,
} from './syncQueue';

export type SyncResult = {
    synced: number;
    failed: number;
    errors: string[];
};

import { MAX_SYNC_RETRIES } from './constants';

export const processSyncQueue = async (): Promise<SyncResult> => {
    const queue = await getSyncQueue();
    const result: SyncResult = { synced: 0, failed: 0, errors: [] };

    for (const item of queue) {
        if (item.retries >= MAX_SYNC_RETRIES) {
            result.failed += 1;
            result.errors.push(`${item.label}: max retries reached`);
            continue;
        }

        try {
            if (item.method === 'POST') {
                await api.post(item.url, item.payload);
            } else {
                await api.put(item.url, item.payload);
            }
            await removeSyncItem(item.id);
            result.synced += 1;
        } catch (err) {
            const axiosErr = err as { response?: { status?: number; data?: { msg?: string } }; message?: string };
            const status = axiosErr?.response?.status;
            const serverMsg = axiosErr?.response?.data?.msg;

            if (status === 400 || status === 401 || status === 403 || status === 409) {
                await removeSyncItem(item.id);
                result.failed += 1;
                result.errors.push(`${item.label}: ${serverMsg || 'Rejected by server'}`);
                continue;
            }

            await bumpSyncRetry(item);
            result.failed += 1;
            const msg = serverMsg || (err instanceof Error ? err.message : 'Sync failed');
            result.errors.push(`${item.label}: ${msg}`);
        }
    }

    return result;
};
