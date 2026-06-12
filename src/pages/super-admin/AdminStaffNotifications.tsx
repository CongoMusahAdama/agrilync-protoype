import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, ShieldCheck, UserCheck, Clock, Eye } from 'lucide-react';

const AdminStaffNotifications: React.FC = () => {
    const { darkMode } = useDarkMode();
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setNotifications(data);
            } catch (err) {
                console.error('Error fetching admin notifications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const toggleReadStatus = async (id: string) => {
        try {
            await api.put(`/notifications/${id}`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error('Error marking notification read:', err);
        }
    };

    const filteredNotifications = notifications.filter((n) => {
        if (filter === 'unread') return !n.read;
        if (filter === 'admin') return n.senderRole === 'super-admin';
        if (filter === 'field') return n.senderRole === 'supervisor';
        return true;
    });

    const cardClass = darkMode ? 'bg-[#0f3035] text-white' : 'bg-white';
    const titleClass = darkMode ? 'text-white' : 'text-gray-900';
    const descClass = darkMode ? 'text-gray-400' : 'text-gray-500';
    const notificationItemClass = darkMode ? 'bg-[#002f37]/50 border-white/5' : 'bg-gray-50/50 border-gray-100';
    const notificationTitleClass = darkMode ? 'text-gray-100' : 'text-gray-900';
    const notificationTimeClass = darkMode ? 'text-gray-400' : 'text-gray-500';

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="h-10 w-10 border-4 border-[#7ede56]/20 border-t-[#7ede56] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-2 md:p-0">
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'admin', label: 'System' },
                    { id: 'field', label: 'Field' },
                ].map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setFilter(t.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            filter === t.id
                                ? 'bg-[#002f37] text-white border-[#002f37]'
                                : 'bg-white text-gray-500 border-gray-100'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <Card className={`rounded-[2rem] border-none shadow-xl ${cardClass}`}>
                <CardHeader className="p-8 pb-4">
                    <CardTitle className={`text-2xl font-black uppercase tracking-tight ${titleClass}`}>
                        Admin Alerts
                    </CardTitle>
                    <CardDescription className={descClass}>
                        Deletion requests, escalations, and platform alerts delivered to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                    <ul className="space-y-4">
                        {filteredNotifications.map((notification) => (
                            <li
                                key={notification._id || notification.id}
                                className={`flex items-start gap-5 rounded-[2rem] border p-6 transition-all hover:border-[#7ede56]/30 ${notificationItemClass} ${!notification.read ? 'ring-2 ring-emerald-500/10' : ''}`}
                            >
                                <span
                                    className={`mt-1 flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${
                                        notification.type === 'alert'
                                            ? 'bg-rose-50 text-rose-500'
                                            : 'bg-emerald-50 text-emerald-600'
                                    }`}
                                >
                                    {notification.type === 'alert' ? (
                                        <AlertTriangle className="h-6 w-6" />
                                    ) : (
                                        <Bell className="h-6 w-6" />
                                    )}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <p className={`text-lg font-black uppercase tracking-tight ${notificationTitleClass}`}>
                                            {notification.title}
                                        </p>
                                        {notification.senderRole === 'super-admin' ? (
                                            <div className="flex items-center gap-1.5 rounded-full bg-emerald-100/50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700">
                                                <ShieldCheck className="h-3 w-3" /> SYSTEM
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 rounded-full bg-blue-100/50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-blue-700">
                                                <UserCheck className="h-3 w-3" /> FIELD
                                            </div>
                                        )}
                                    </div>
                                    <p className={`text-sm font-medium mb-4 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {notification.message}
                                    </p>
                                    <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${notificationTimeClass}`}>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            {notification.createdAt
                                                ? new Date(notification.createdAt).toLocaleDateString()
                                                : notification.time || 'Just now'}
                                        </div>
                                    </div>
                                </div>
                                {!notification.read && (
                                    <Button
                                        variant="ghost"
                                        className="rounded-xl h-11 px-6 font-black uppercase text-[10px] tracking-widest text-[#065f46] hover:bg-emerald-50 shrink-0"
                                        onClick={() => toggleReadStatus(notification._id || notification.id)}
                                    >
                                        Mark read
                                    </Button>
                                )}
                            </li>
                        ))}
                        {filteredNotifications.length === 0 && (
                            <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-200" />
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">No alerts yet</p>
                            </div>
                        )}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminStaffNotifications;
