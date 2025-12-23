import React from 'react';
import AgentLayout from './AgentLayout';
import { agentNotifications } from './agent-data';
import { useDarkMode } from '@/contexts/DarkModeContext';
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
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Stats calculation
  const total = agentNotifications.length;
  const unread = agentNotifications.filter(n => !n.read).length;
  const actionRequired = agentNotifications.filter(n => n.type === 'action').length;
  const alerts = agentNotifications.filter(n => n.type === 'alert').length;

  const summaryCards = [
    { title: 'Total Alerts', value: total, icon: Bell, type: 'all', color: 'bg-slate-600' },
    { title: 'Unread', value: unread, icon: Bell, type: 'unread', color: 'bg-blue-600' },
    { title: 'Action Items', value: actionRequired, icon: FileText, type: 'action', color: 'bg-orange-600' },
    { title: 'System Alerts', value: alerts, icon: AlertTriangle, type: 'alert', color: 'bg-rose-600' },
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {summaryCards.map((card, idx) => (
            <Card
              key={idx}
              className={`${card.color} border-none rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-700 relative overflow-hidden ${filter === card.type ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
              onClick={() => setFilter(card.type)}
            >
              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <card.icon className="absolute top-1 right-1 h-12 w-12 text-white rotate-12" />
              </div>

              <div className="p-3 sm:p-5 flex flex-col h-full relative z-10 text-left">
                <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                  <card.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  <p className="text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider">{card.title}</p>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-2xl sm:text-4xl font-bold text-white">{card.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card className={`transition-colors ${cardClass}`}>
          <CardHeader>
            <CardTitle className={`text-xl ${titleClass}`}>Recent Alerts</CardTitle>
            <CardDescription className={descClass}>Tap an alert to view the full context and mark it as resolved.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {agentNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-2xl border p-4 shadow-sm ${notificationItemClass}`}
                >
                  <span
                    className={`mt-1 flex h-10 w-10 items-center justify-center rounded-xl ${notification.type === 'alert'
                      ? 'bg-rose-500/10 text-rose-600'
                      : notification.type === 'action'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-emerald-500/10 text-emerald-600'
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
                    <p className={`mt-1 text-xs uppercase tracking-wide ${notificationTimeClass}`}>{notification.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className={darkMode ? 'text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'}>
                    View
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  );
};

export default AgentNotifications;

