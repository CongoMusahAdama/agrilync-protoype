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
import { AlertTriangle, FileText, Bell } from 'lucide-react';

const AgentNotifications: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [filter, setFilter] = React.useState('all');
  const [notifications, setNotifications] = React.useState<any[]>([]);
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
    return n.type === filter;
  });

  const total = notifications.length;
  const unread = notifications.filter(n => !n.read).length;
  const actionRequired = notifications.filter(n => n.type === 'action').length;
  const alerts = notifications.filter(n => n.type === 'alert').length;

  const summaryCards = [
    { title: 'Total Alerts', label: 'ALL', value: total, icon: Bell, type: 'all', iconColor: 'text-gray-500', bgColor: 'bg-gray-500/10' },
    { title: 'Unread', label: 'NEW', value: unread, icon: Bell, type: 'unread', iconColor: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { title: 'Action Items', label: 'ACTION', value: actionRequired, icon: FileText, type: 'action', iconColor: 'text-[#065f46]', bgColor: 'bg-[#065f46]/10' },
    { title: 'System Alerts', label: 'SYSTEM', value: alerts, icon: AlertTriangle, type: 'alert', iconColor: 'text-rose-500', bgColor: 'bg-rose-500/10' },
  ];

  const cardClass = darkMode ? 'bg-[#002f37] border-gray-600 border' : 'bg-white';
  const titleClass = darkMode ? 'text-white' : 'text-gray-900';
  const descClass = darkMode ? 'text-gray-400' : '';
  const notificationItemClass = darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-white';
  const notificationTitleClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const notificationTimeClass = darkMode ? 'text-gray-400' : 'text-gray-500';

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
                className={`rounded-xl p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-36 flex flex-col justify-between group border-none cursor-pointer ${filter === card.type ? 'ring-2 ring-offset-[#065f46] ring-[#065f46]' : ''} ${isPrimary ? 'bg-[#065f46]' : darkMode ? 'bg-[#0f3035]' : 'bg-white'}`}
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
                    <p className={`text-sm font-semibold ${notificationTitleClass}`}>{notification.title}</p>
                    <p className={`mt-1 text-xs uppercase tracking-wide ${notificationTimeClass}`}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
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


