/** Normalize list responses — supports legacy bare arrays and paginated `{ data: [] }`. */
export const parseApiList = <T>(payload: unknown): T[] => {
    if (Array.isArray(payload)) return payload as T[];
    if (
        payload &&
        typeof payload === 'object' &&
        'data' in payload &&
        Array.isArray((payload as { data: unknown }).data)
    ) {
        return (payload as { data: T[] }).data;
    }
    return [];
};
