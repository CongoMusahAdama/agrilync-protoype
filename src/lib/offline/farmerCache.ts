import api from '@/utils/api';
import { getOfflineDb, type CachedFarmer } from './db';
import { OFFLINE_PRELOAD_MAX_PAGES, OFFLINE_PRELOAD_PAGE_SIZE } from './constants';

/** Keep only small, JSON-safe fields — large base64 photos break IndexedDB writes */
export const sanitizeFarmerForCache = (farmer: CachedFarmer): CachedFarmer | null => {
    const mongoId = farmer._id != null ? String(farmer._id) : '';
    const lyncId = farmer.id != null ? String(farmer.id) : '';
    const _id = mongoId || lyncId;
    if (!_id) return null;

    return {
        _id,
        id: lyncId || undefined,
        name: typeof farmer.name === 'string' ? farmer.name : undefined,
        contact: typeof farmer.contact === 'string' ? farmer.contact : undefined,
        community: typeof farmer.community === 'string' ? farmer.community : undefined,
        region: typeof farmer.region === 'string' ? farmer.region : undefined,
        district: typeof farmer.district === 'string' ? farmer.district : undefined,
        ghanaCardNumber: typeof farmer.ghanaCardNumber === 'string' ? farmer.ghanaCardNumber : undefined,
        farmType: typeof farmer.farmType === 'string' ? farmer.farmType : undefined,
        status: typeof farmer.status === 'string' ? farmer.status : undefined,
    };
};

export const fetchAllAgentFarmers = async (): Promise<CachedFarmer[]> => {
    const allFarmers: CachedFarmer[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages && page <= OFFLINE_PRELOAD_MAX_PAGES) {
        const res = await api.get('/farmers', {
            params: { page, limit: OFFLINE_PRELOAD_PAGE_SIZE },
        });
        const payload = res.data;

        if (payload?.success === false) {
            throw new Error(payload.message || 'Could not load growers from server');
        }

        const batch = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];

        allFarmers.push(...batch);
        totalPages = typeof payload?.pages === 'number' && payload.pages > 0 ? payload.pages : page;
        if (batch.length === 0) break;
        page += 1;
    }

    return allFarmers;
};

export const cacheFarmers = async (farmers: CachedFarmer[]) => {
    const db = await getOfflineDb();
    const sanitized = farmers
        .map(sanitizeFarmerForCache)
        .filter((f): f is CachedFarmer => f != null);

    const tx = db.transaction('farmersCache', 'readwrite');
    await tx.store.clear();
    for (const farmer of sanitized) {
        await tx.store.put(farmer);
    }
    await tx.done;

    const metaTx = db.transaction('meta', 'readwrite');
    await metaTx.store.put({
        key: 'farmersCachedAt',
        value: Date.now(),
        updatedAt: Date.now(),
    });
    await metaTx.done;

    return sanitized.length;
};

export const getCachedFarmers = async (): Promise<CachedFarmer[]> => {
    const db = await getOfflineDb();
    return db.getAll('farmersCache');
};

export const getFarmersCachedAt = async (): Promise<number | null> => {
    const db = await getOfflineDb();
    const row = await db.get('meta', 'farmersCachedAt');
    return typeof row?.value === 'number' ? row.value : null;
};

export const preloadErrorMessage = (err: unknown): string => {
    if (err instanceof DOMException) {
        if (err.name === 'QuotaExceededError') {
            return 'Phone storage is full. Free space and try again.';
        }
        if (err.name === 'DataCloneError') {
            return 'Could not save grower data on this device. Try updating your browser.';
        }
    }
    if (err && typeof err === 'object' && 'response' in err) {
        const data = (err as { response?: { data?: { message?: string } } }).response?.data;
        if (data?.message) return data.message;
    }
    if (err instanceof Error && err.message) {
        return err.message;
    }
    return 'Could not download field data. Check your connection and try again.';
};
