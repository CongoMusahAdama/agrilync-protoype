import api from '@/utils/api';
import { isBrowserOnline, type SyncActionType } from './db';
import { enqueueSyncAction } from './syncQueue';

export type SubmitOrQueueResult =
    | { status: 'synced'; data: unknown }
    | { status: 'queued'; label: string };

const isNetworkFailure = (err: unknown) => {
    if (!err || typeof err !== 'object') return false;
    const e = err as { message?: string; response?: unknown };
    return !e.response || e.message?.includes('Network error') || e.message?.includes('timed out');
};

export const submitOrQueue = async (input: {
    type: SyncActionType;
    method: 'POST' | 'PUT';
    url: string;
    payload: Record<string, unknown>;
    label: string;
}): Promise<SubmitOrQueueResult> => {
    if (!isBrowserOnline()) {
        await enqueueSyncAction(input);
        return { status: 'queued', label: input.label };
    }

    try {
        const res =
            input.method === 'POST'
                ? await api.post(input.url, input.payload)
                : await api.put(input.url, input.payload);
        return { status: 'synced', data: res.data };
    } catch (err) {
        if (isNetworkFailure(err)) {
            await enqueueSyncAction(input);
            return { status: 'queued', label: input.label };
        }
        throw err;
    }
};
