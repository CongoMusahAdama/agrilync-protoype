import { useEffect, useRef } from 'react';
import { playNotificationBeep } from '@/utils/audio';

type NotificationItem = {
    _id?: string;
    id?: string;
    read?: boolean;
};

const getNotificationId = (n: NotificationItem) => n._id || n.id || '';

/**
 * Plays a short beep when new unread notifications appear (skips initial load).
 */
export const useNotificationSound = (
    notifications: NotificationItem[],
    enabled = true
) => {
    const seenUnreadRef = useRef<Set<string> | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const unreadIds = notifications
            .filter((n) => !n.read)
            .map(getNotificationId)
            .filter(Boolean);

        const currentUnread = new Set(unreadIds);

        if (seenUnreadRef.current === null) {
            seenUnreadRef.current = currentUnread;
            return;
        }

        const hasNewUnread = unreadIds.some((id) => !seenUnreadRef.current!.has(id));
        seenUnreadRef.current = currentUnread;

        if (hasNewUnread) {
            playNotificationBeep();
        }
    }, [notifications, enabled]);
};
