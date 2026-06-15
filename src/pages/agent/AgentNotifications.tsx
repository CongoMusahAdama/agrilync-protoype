import React, { useState, useEffect } from 'react';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import Swal from 'sweetalert2';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertTriangle, Bell, ShieldCheck, UserCheck, Clock, X, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AgentNotifications: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        Swal.fire({
          icon: 'error',
          title: 'Could not load alerts',
          text: 'Check your connection and try again.',
          confirmButtonColor: '#065f46',
          customClass: { popup: 'rounded-[2rem]' }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsReadSilently = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => ((n._id === id || n.id === id) ? { ...n, read: true } : n))
    );
    try {
      await api.put(`/notifications/${id}`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const openNotification = (notification: any) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      void markAsReadSilently(notification._id || notification.id);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    if (filter === 'admin') return n.senderRole === 'super-admin';
    if (filter === 'supervisor') return n.senderRole === 'supervisor' || !n.senderRole;
    return n.type === filter;
  });

  const total = notifications.length;
  const unread = notifications.filter(n => !n.read).length;
  const adminAlerts = notifications.filter(n => n.senderRole === 'super-admin').length;
  const supervisorAlerts = notifications.filter(n => n.senderRole === 'supervisor' || !n.senderRole).length;

  const summaryCards = [
    { title: 'All Updates', label: 'CORPORATE', value: total, icon: Bell, type: 'all', iconColor: 'text-gray-400', bgColor: 'bg-gray-100' },
    { title: 'Unread Alerts', label: 'URGENT', value: unread, icon: Bell, type: 'unread', iconColor: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { title: 'Admin Directives', label: 'SYSTEM', value: adminAlerts, icon: ShieldCheck, type: 'admin', iconColor: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { title: 'Supervisor Briefs', label: 'FIELD', value: supervisorAlerts, icon: UserCheck, type: 'supervisor', iconColor: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  ];

  const cardClass = darkMode ? 'bg-[#002f37] border-gray-600 border' : 'bg-white';
  const titleClass = darkMode ? 'text-white' : 'text-gray-900';
  const descClass = darkMode ? 'text-gray-400' : '';
  const notificationItemClass = darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-white';
  const notificationTitleClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const notificationTimeClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  const formatNotificationDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const renderSenderBadge = (notification: any, compact = false) => (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-black uppercase tracking-widest rounded-md',
        compact ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-3 py-1 rounded-full',
        notification.senderRole === 'super-admin'
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-blue-50 text-blue-600'
      )}
    >
      {notification.senderRole === 'super-admin' ? (
        <>
          <ShieldCheck className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          System
        </>
      ) : (
        <>
          <UserCheck className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          Field
        </>
      )}
    </span>
  );

  const renderNotificationCard = (n: any) => {
    const { time } = formatNotificationDate(n.createdAt);
    return (
      <button
        type="button"
        key={n._id || n.id}
        onClick={() => openNotification(n)}
        className={cn(
          'w-full text-left p-5 rounded-[1.75rem] border shadow-sm transition-all active:scale-[0.98]',
          darkMode ? 'bg-[#0f434a] border-white/5' : 'bg-white border-gray-100',
          !n.read && 'ring-2 ring-emerald-500/15'
        )}
      >
        <div className="flex justify-between items-start gap-3 mb-2">
          {renderSenderBadge(n, true)}
          <span className="text-[9px] font-bold text-gray-400 shrink-0">{time}</span>
        </div>
        <h3 className={cn('text-[15px] font-black mb-1 leading-tight', darkMode ? 'text-white' : 'text-[#002f37]')}>
          {n.title}
        </h3>
        <p className="text-[12px] font-medium text-gray-500/80 line-clamp-2 leading-normal">{n.message}</p>
        {!n.read && (
          <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
            Tap to read
          </span>
        )}
      </button>
    );
  };

  const detailDialog = (
    <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
      <DialogContent
        hideCloseButton
        className={cn(
          'w-full max-w-md p-0 gap-0 overflow-hidden border-0 shadow-2xl',
          'max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto max-md:translate-x-0 max-md:translate-y-0',
          'max-md:max-h-[85dvh] max-md:rounded-t-3xl max-md:rounded-b-none',
          'md:rounded-2xl',
          darkMode ? 'bg-[#002f37]' : 'bg-white'
        )}
      >
        {selectedNotification && (
          <div className="flex flex-col max-h-[85dvh] md:max-h-[80vh]">
            {/* Header */}
            <div className="shrink-0 bg-[#065f46] px-5 py-4 text-white relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 pr-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-100 mb-2">
                    {selectedNotification.senderRole === 'super-admin' ? (
                      <>
                        <ShieldCheck className="h-3 w-3" />
                        System
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3 w-3" />
                        Field
                      </>
                    )}
                  </span>
                  <DialogTitle className="text-lg font-bold leading-snug text-white text-left">
                    {selectedNotification.title}
                  </DialogTitle>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="h-10 w-10 shrink-0 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Meta */}
            <DialogDescription asChild>
              <div
                className={cn(
                  'shrink-0 px-5 py-3 text-xs border-b flex flex-col gap-1',
                  darkMode ? 'border-white/10 text-gray-400 bg-[#0a3d45]' : 'border-gray-100 text-gray-500 bg-gray-50'
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {formatNotificationDate(selectedNotification.createdAt).date}
                  {' · '}
                  {formatNotificationDate(selectedNotification.createdAt).time}
                </span>
                {selectedNotification.senderName && (
                  <span>From {selectedNotification.senderName}</span>
                )}
              </div>
            </DialogDescription>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 min-h-0">
              <p
                className={cn(
                  'text-[15px] leading-relaxed whitespace-pre-wrap break-words rounded-xl p-4',
                  darkMode ? 'text-gray-100 bg-white/5' : 'text-gray-700 bg-[#f8fafc] border border-gray-100'
                )}
              >
                {selectedNotification.message || 'No additional details.'}
              </p>
            </div>

            {/* Footer */}
            <div
              className={cn(
                'shrink-0 px-5 py-4 border-t',
                darkMode ? 'border-white/10' : 'border-gray-100',
                'pb-[max(1rem,env(safe-area-inset-bottom))]'
              )}
            >
              <Button
                className="w-full rounded-xl bg-[#065f46] hover:bg-[#054a38] text-white min-h-[48px] font-semibold text-base"
                onClick={() => setSelectedNotification(null)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  if (isMobile) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#002f37] text-white' : 'bg-[#f8fafc] text-[#002f37]'} flex flex-col`}>
        <div className={`sticky top-0 z-50 ${darkMode ? 'bg-[#002f37]' : 'bg-white/80 backdrop-blur-md'} px-6 py-4 border-b border-gray-100/10`}>
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full -ml-2">
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-[18px] font-black uppercase tracking-tight">Notifications</h1>
            <Button variant="ghost" size="icon" className="rounded-full -mr-2">
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'admin', label: 'Admin' },
              { id: 'supervisor', label: 'Superv.' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 active:scale-95 touch-manipulation ${
                  filter === t.id
                    ? (darkMode ? 'bg-[#7ede56] text-[#002f37] border-[#7ede56] shadow-lg shadow-[#7ede56]/20' : 'bg-[#002f37] text-white border-[#002f37] shadow-lg shadow-[#002f37]/20')
                    : (darkMode ? 'bg-white/5 text-white/60 border-white/10' : 'bg-white text-gray-400 border-gray-100 shadow-sm')
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 border-4 border-[#7ede56]/20 border-t-[#7ede56] rounded-full animate-spin" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="relative mb-8 w-24 h-24">
                <div className="absolute inset-0 bg-[#7ede56] rounded-[2.5rem] rounded-bl-none shadow-xl flex items-center justify-center">
                  <Bell className="h-10 w-10 text-[#002f37] opacity-20" />
                </div>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-3">No Alerts</h2>
              <p className="text-[13px] font-medium text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                Your operational sector is currently clear.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              {filteredNotifications.map(renderNotificationCard)}
            </div>
          )}
        </div>

        {detailDialog}
      </div>
    );
  }

  return (
    <AgentLayout
      activeSection="notifications"
      title="Notifications & Updates"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {summaryCards.map((card, idx) => {
            const isActive = filter === card.type;
            return (
              <Card
                key={idx}
                className={`rounded-[2rem] p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-36 flex flex-col justify-between group border-2 cursor-pointer ${isActive ? 'border-[#7ede56] bg-[#002f37] text-white' : darkMode ? 'bg-[#0f3035] border-transparent' : 'bg-white border-transparent'}`}
                onClick={() => setFilter(card.type)}
              >
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
                  <card.icon className={`h-24 w-24 ${isActive ? 'text-[#7ede56]' : card.iconColor} -rotate-12`} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-[#7ede56]/20' : card.bgColor}`}>
                    <card.icon className={`h-5 w-5 ${isActive ? 'text-[#7ede56]' : card.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-black ${isActive ? 'text-[#7ede56]/60' : 'text-gray-400'} uppercase tracking-widest`}>{card.label}</span>
                </div>
                <div className="relative z-10">
                  <p className={`text-[10px] font-black ${isActive ? 'text-[#7ede56]/40' : 'text-gray-500'} uppercase tracking-widest mb-1`}>{card.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className={`text-4xl font-black leading-none ${isActive ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</h3>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <Card className={`rounded-[2.5rem] border-none shadow-2xl transition-colors ${cardClass}`}>
          <CardHeader className="p-8 pb-4">
            <CardTitle className={`text-2xl font-black uppercase tracking-tight ${titleClass}`}>Recent Alerts</CardTitle>
            <CardDescription className={descClass}>Tap any alert to read the full message.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <ul className="space-y-4">
              {filteredNotifications.map((notification) => (
                <li key={notification._id || notification.id}>
                  <button
                    type="button"
                    onClick={() => openNotification(notification)}
                    className={`w-full text-left flex items-start gap-5 rounded-[2rem] border p-6 transition-all hover:border-[#7ede56]/30 ${notificationItemClass} ${!notification.read ? 'ring-2 ring-emerald-500/10' : ''}`}
                  >
                    <span
                      className={`mt-1 flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${notification.type === 'alert'
                        ? 'bg-rose-50 text-rose-500'
                        : 'bg-emerald-50 text-emerald-600'
                        }`}
                    >
                      {notification.type === 'alert' ? <AlertTriangle className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <p className={`text-lg font-black uppercase tracking-tight ${notificationTitleClass}`}>{notification.title}</p>
                        {renderSenderBadge(notification)}
                      </div>

                      <p className={`text-sm font-medium mb-4 leading-relaxed line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>

                      <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${notificationTimeClass}`}>
                        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(notification.createdAt).toLocaleDateString()}</div>
                        <div className="h-1 w-1 bg-gray-300 rounded-full" />
                        <div>{new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-gray-200" />
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">All sectors clear</p>
                </div>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {detailDialog}
    </AgentLayout>
  );
};

export default AgentNotifications;
