import React from 'react';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText, Bell, ShieldCheck, UserCheck, Clock, X, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const AgentNotifications: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [filter, setFilter] = React.useState('all');
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(Array.isArray(res.data) ? res.data : (res.data.data || []));
        setIsLoaded(true);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const toggleReadStatus = async (id: string) => {
    try {
      await api.put(`/notifications/${id}`);
      setNotifications(notifications.map(n =>
        (n._id === id || n.id === id) ? { ...n, read: true } : n
      ));
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  // Stats calculation
  // Stats calculation
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

  if (isMobile) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#002f37] text-white' : 'bg-white text-gray-900'} px-6 py-4 flex flex-col`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <X className="h-6 w-6" />
          </Button>
          <h1 className="text-[17px] font-bold">Notifications</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>

        {/* Filter Chips - Compact for full visibility */}
        <div className="flex gap-1.5 mb-8 overflow-x-hidden px-0.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'admin', label: 'Admin' },
            { id: 'supervisor', label: 'Superv.' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex-1 px-2 py-2 rounded-full text-[10.5px] font-bold font-montserrat uppercase tracking-tight transition-all border whitespace-nowrap text-center ${
                filter === t.id 
                  ? (darkMode ? 'bg-[#7ede56] text-[#002f37] border-[#7ede56]' : 'bg-[#002f37] text-white border-[#002f37]') 
                  : (darkMode ? 'bg-transparent text-white border-white/10' : 'bg-white text-gray-400 border-gray-100')
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-16">
          {filteredNotifications.length === 0 ? (
            <div className="text-center space-y-6 max-w-[300px]">
              {/* Custom Brand Green Bot Icon */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#7ede56] rounded-[2.5rem] rounded-bl-none transform transition-all hover:scale-110 shadow-[0_20px_40px_-10px_rgba(126,222,86,0.4)]">
                  {/* Eyes */}
                  <div className="absolute top-[38%] left-[28%] w-2.5 h-1 bg-[#002f37] rounded-full"></div>
                  <div className="absolute top-[38%] right-[28%] w-2.5 h-1 bg-[#002f37] rounded-full"></div>
                  {/* Mouth */}
                  <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#002f37] opacity-40"></div>
                  {/* Tear / Signal Drop */}
                  <div className="absolute top-[48%] left-[25%] w-3 h-4 bg-white/40 backdrop-blur-sm rounded-full rounded-tr-none animate-bounce"></div>
                  {/* Antenna */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-[#002f37] rounded-full">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#002f37] rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-[24px] font-bold font-montserrat tracking-tighter text-[#002f37] dark:text-white uppercase">No Alerts Yet</h2>
                <p className="text-[13px] font-medium font-inter text-gray-400 leading-relaxed px-4">
                  Stay updated on important field alerts, operational directives, and system updates.
                </p>
              </div>
            </div>
          ) : (
            <ul className="w-full space-y-3">
              {filteredNotifications.map((n) => (
                <li key={n._id || n.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-[#0f434a] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[9px] font-bold font-inter uppercase tracking-[0.2em] text-[#7ede56]">
                      {n.type || 'Alert'}
                    </span>
                    <span className="text-[9px] font-medium font-inter text-gray-400">
                       {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-[13.5px] font-bold font-montserrat mb-1 text-[#002f37] dark:text-white leading-tight">{n.title}</h3>
                  <p className="text-[11px] font-medium font-inter text-gray-500/80 line-clamp-2 leading-normal">{n.message}</p>
                </li>
              ))}
            </ul>
            )
          }
        </div>
      </div>
    );
  }

  return (
    <AgentLayout
      activeSection="notifications"
      title="Notifications & Updates"
    >
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {summaryCards.map((card, idx) => {
            const isPrimary = card.title === 'Total Alerts';
            return (
              <Card
                key={idx}
                className={`rounded-none p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-36 flex flex-col justify-between group border-none cursor-pointer ${filter === card.type ? 'ring-2 ring-offset-[#065f46] ring-[#065f46]' : ''} ${isPrimary ? 'bg-[#065f46]' : darkMode ? 'bg-[#0f3035]' : 'bg-white'}`}
                onClick={() => setFilter(card.type)}
              >
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
                  <card.icon className={`h-24 w-24 ${isPrimary ? 'text-white' : card.iconColor} -rotate-12`} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className={`p-2 rounded-lg ${isPrimary ? 'bg-white/10' : card.bgColor}`}>
                    <card.icon className={`h-5 w-5 ${isPrimary ? 'text-white' : card.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-black ${isPrimary ? 'text-white/40' : 'text-gray-400'} uppercase tracking-widest`}>{card.label}</span>
                </div>
                <div className="relative z-10">
                  <p className={`text-[10px] font-black ${isPrimary ? 'text-white/60' : 'text-gray-500'} uppercase tracking-widest mb-1`}>{card.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className={`text-4xl font-black leading-none ${isPrimary ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</h3>
                    <span className={`text-[10px] font-bold ${isPrimary ? 'text-white/80' : 'text-gray-500'}`}>{card.value === 1 ? 'Alert' : 'Alerts'}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <Card className={`transition-colors ${cardClass}`}>
          <CardHeader>
            <CardTitle className={`text-xl ${titleClass}`}>Recent Alerts</CardTitle>
            <CardDescription className={descClass}>Tap an alert to view the full context and mark it as resolved.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {filteredNotifications.map((notification) => (
                <li
                  key={notification._id || notification.id}
                  className={`flex items-start gap-4 rounded-2xl border p-4 shadow-sm ${notificationItemClass} ${!notification.read ? 'border-l-4 border-l-[#065f46]' : ''}`}
                >
                  <span
                    className={`mt-1 flex h-10 w-10 items-center justify-center rounded-xl ${notification.type === 'alert'
                      ? 'bg-rose-500/10 text-rose-600'
                      : notification.type === 'action'
                        ? 'bg-[#065f46]/20 text-[#065f46]'
                        : 'bg-[#065f46]/10 text-[#065f46]'
                      }`}
                  >
                    {notification.type === 'alert' ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : notification.type === 'action' ? (
                      <FileText className="h-5 w-5" />
                    ) : (
                      <Bell className="h-5 w-5" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-black ${notificationTitleClass}`}>{notification.title}</p>
                      {/* Role Badge */}
                      {notification.senderRole === 'super-admin' ? (
                        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-100 shadow-sm">
                          <ShieldCheck className="h-2.5 w-2.5" /> SUPER ADMIN
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-blue-700 border border-blue-100 shadow-sm">
                          <UserCheck className="h-2.5 w-2.5" /> SUPERVISOR
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {notification.message || 'New directive published for your regional operational network.'}
                    </p>

                    <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${notificationTimeClass}`}>
                      <Clock className="h-3 w-3" />
                      {new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      <span className="mx-1 opacity-20">•</span>
                      {new Date(notification.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={darkMode ? 'text-[#065f46] hover:bg-[#0d3036] hover:text-[#065f46]' : 'text-[#065f46] hover:text-[#065f46]/80'}
                    onClick={() => toggleReadStatus(notification._id || notification.id)}
                  >
                    {notification.read ? 'View' : 'Mark as Read'}
                  </Button>
                </li>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No notifications found</p>
                </div>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  );
};

export default AgentNotifications;


