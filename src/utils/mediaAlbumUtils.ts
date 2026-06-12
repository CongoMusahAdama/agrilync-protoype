export type MediaLike = {
    name?: string;
    album?: string | null;
    url?: string;
    type?: string;
};

const ALBUM_PREFIX = /^\[album\]\s*/i;

/** Strip "[Album] " prefix and normalize spacing for comparisons */
export const normalizeAlbumName = (value?: string | null): string => {
    if (!value) return '';
    return value.replace(ALBUM_PREFIX, '').trim();
};

/** Album folder name for a media row (empty if not in an album) */
export const resolveItemAlbum = (item: MediaLike): string => {
    const fromField = normalizeAlbumName(item.album);
    if (fromField) return fromField;
    if (item.name && ALBUM_PREFIX.test(item.name)) {
        return normalizeAlbumName(item.name);
    }
    return '';
};

export const isAlbumPlaceholder = (item: MediaLike): boolean => item.url === 'album-placeholder';

export const isAlbumFolderRecord = (item: MediaLike): boolean =>
    isAlbumPlaceholder(item) || (Boolean(item.name && ALBUM_PREFIX.test(item.name)) && isAlbumPlaceholder(item));

export const albumsMatch = (a?: string | null, b?: string | null): boolean =>
    normalizeAlbumName(a).toLowerCase() === normalizeAlbumName(b).toLowerCase();

/** True when item belongs inside a folder (not shown on library root) */
export const isMediaInsideAlbum = (item: MediaLike): boolean => {
    if (isAlbumPlaceholder(item)) return false;
    return resolveItemAlbum(item).length > 0;
};
