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
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  FileText,
  Users,
  Sprout,
  Handshake,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const AgentNotifications: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [filter, setFilter] = React.useState('all');

  // Stats calculation
  const total = agentNotifications.length;
  const unread = agentNotifications.filter(n => !n.read).length;
  const actionRequired = agentNotifications.filter(n => n.priority === 'high' || n.priority === 'medium').length;
  const urgent = agentNotifications.filter(n => n.priority === 'high').length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'training': return { icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'report': return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'alert': return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'verification': return { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'message': return { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'dispute': return { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' };
      case 'match': return { icon: Handshake, color: 'text-emerald-600', bg: 'bg-emerald-50' };
      default: return { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const summaryCards = [
    { title: 'Total Notifications', value: total, icon: Bell, type: 'all', color: 'text-gray-600', bg: 'bg-gray-50' },
    { title: 'Unread Alerts', value: unread, icon: Bell, type: 'unread', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Action Required', value: actionRequired, icon: Clock, type: 'action', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Urgent Issues', value: urgent, icon: AlertCircle, type: 'urgent', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <AgentLayout
      activeSection="notifications"
      title="Notification Center"
      subtitle="Stay informed with real-time updates and system alerts."
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Notification List Section */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Notification List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900 font-outfit'}`}>Recent Activity</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Mark all as read</Button>
              </div>
            </div>

            <div className="space-y-3">
              {agentNotifications.map((notif) => {
                const style = getIcon(notif.type);
                return (
                  <Card key={notif.id} className={`group transition-all hover:shadow-md border-none shadow-sm ${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white'} ${!notif.read ? 'ring-l-4 ring-emerald-500' : ''}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${style.bg} ${style.color}`}>
                        <style.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {!notif.read && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                          <h3 className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notif.title}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{notif.time}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${notif.priority === 'high' ? 'text-rose-600' : 'text-gray-400'}`}>{notif.priority} Priority</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50">
                        View <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar / Settings */}
          <div className="space-y-6">
            <Card className={`${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-100'} p-6 shadow-sm border-none`}>
              <h3 className={`text-sm font-black uppercase tracking-widest mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Search & Filter</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search alerts..." className="pl-9 h-11 text-sm border-gray-100 bg-gray-50/50" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Type</p>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Alerts', 'Training', 'System'].map(t => (
                      <Badge key={t} variant="outline" className={`cursor-pointer px-3 py-1 text-[10px] font-bold uppercase border-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all ${t === 'All' ? 'bg-emerald-600 text-white border-none' : ''}`}>
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none p-6 shadow-lg relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Bell className="h-40 w-40 text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Notification Settings</h3>
                <p className="text-white/80 text-xs mb-6 leading-relaxed">Customize how and when you receive alerts for farm activities and investor matches.</p>
                <Button className="w-full bg-white text-indigo-800 hover:bg-indigo-50 font-bold uppercase tracking-wider text-[10px] h-10 border-none">
                  Configure Alerts
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
};

export default AgentNotifications;

