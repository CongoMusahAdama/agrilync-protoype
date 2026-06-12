import { getOfflineDb, type SyncActionType, type SyncQueueItem } from './db';

const makeId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sync-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const enqueueSyncAction = async (input: {
    type: SyncActionType;
    method: 'POST' | 'PUT';
    url: string;
    payload: Record<string, unknown>;
    label: string;
}): Promise<SyncQueueItem> => {
    const db = await getOfflineDb();
    const item: SyncQueueItem = {
        id: makeId(),
        type: input.type,
        method: input.method,
        url: input.url,
        payload: input.payload,
        createdAt: Date.now(),
        retries: 0,
        label: input.label,
    };
    await db.put('syncQueue', item);
    return item;
};

export const getSyncQueue = async (): Promise<SyncQueueItem[]> => {
    const db = await getOfflineDb();
    return db.getAllFromIndex('syncQueue', 'by-created');
};

export const getPendingSyncCount = async (): Promise<number> => {
    const db = await getOfflineDb();
    return db.count('syncQueue');
};

export const getPendingSyncSummary = async () => {
    const queue = await getSyncQueue();
    return queue.reduce(
        (acc, q) => {
            acc.total += 1;
            if (q.type === 'farmer') acc.farmers += 1;
            if (q.type === 'field-visit' || q.type === 'scheduled-visit') acc.visits += 1;
            return acc;
        },
        { total: 0, farmers: 0, visits: 0 }
    );
};

export const removeSyncItem = async (id: string) => {
    const db = await getOfflineDb();
    await db.delete('syncQueue', id);
};

export const bumpSyncRetry = async (item: SyncQueueItem) => {
    const db = await getOfflineDb();
    await db.put('syncQueue', { ...item, retries: item.retries + 1 });
};
