import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export type SyncActionType = 'field-visit' | 'scheduled-visit' | 'farmer';

export interface SyncQueueItem {
    id: string;
    type: SyncActionType;
    method: 'POST' | 'PUT';
    url: string;
    payload: Record<string, unknown>;
    createdAt: number;
    retries: number;
    label: string;
}

export interface CachedFarmer {
    _id?: string;
    id?: string;
    name?: string;
    contact?: string;
    community?: string;
    region?: string;
    district?: string;
    ghanaCardNumber?: string;
    [key: string]: unknown;
}

interface AgriLyncOfflineDB extends DBSchema {
    syncQueue: {
        key: string;
        value: SyncQueueItem;
        indexes: { 'by-created': number };
    };
    farmersCache: {
        key: string;
        value: CachedFarmer;
    };
    meta: {
        key: string;
        value: { key: string; value: unknown; updatedAt: number };
    };
}

const DB_NAME = 'agrilync-offline';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<AgriLyncOfflineDB>> | null = null;

export const getOfflineDb = () => {
    if (!dbPromise) {
        dbPromise = openDB<AgriLyncOfflineDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                const queue = db.createObjectStore('syncQueue', { keyPath: 'id' });
                queue.createIndex('by-created', 'createdAt');

                db.createObjectStore('farmersCache', { keyPath: '_id' });
                db.createObjectStore('meta', { keyPath: 'key' });
            },
        });
    }
    return dbPromise;
};

export const isBrowserOnline = () =>
    typeof navigator !== 'undefined' ? navigator.onLine : true;
