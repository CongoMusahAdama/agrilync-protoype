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
      subtitle="Action investor requests, system alerts, and field assignments in one place."
    >
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
                  className={`mt-1 flex h-10 w-10 items-center justify-center rounded-xl ${
                    notification.type === 'alert'
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
    </AgentLayout>
  );
};

export default AgentNotifications;

