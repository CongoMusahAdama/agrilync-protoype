import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Clock,
  CheckCheck,
  Trash2,
  Leaf,
  Bell
} from 'lucide-react';

const Notifications = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { darkMode, toggleDarkMode } = useDarkMode();


  // Mock data for notifications
  const mockNotifications = [
    {
      id: 1,
      title: 'New Investor Match Found',
      description: 'AgriInvest Ghana Ltd is interested in your cocoa plantation. Investment amount: GHS 50,000',
      type: 'success',
      status: 'unread',
      date: '2024-01-15',
      time: '10:30 AM',
      priority: 'high',
      action: 'View Details'
    },
    {
      id: 2,
      title: 'Training Session Reminder',
      description: 'Modern Cocoa Farming Techniques workshop starts tomorrow at 9:00 AM',
      type: 'info',
      status: 'unread',
      date: '2024-01-14',
      time: '02:15 PM',
      priority: 'medium',
      action: 'Join Session'
    },
    {
      id: 3,
      title: 'Farm Visit Scheduled',
      description: 'Dr. Kwame Asante will visit your farm on January 20th at 8:00 AM',
      type: 'info',
      status: 'read',
      date: '2024-01-13',
      time: '09:45 AM',
      priority: 'medium',
      action: 'Confirm Visit'
    },
    {
      id: 4,
      title: 'Payment Received',
      description: 'GHS 15,000 payment received for maize harvest from Green Fields Coop',
      type: 'success',
      status: 'read',
      date: '2024-01-12',
      time: '11:20 AM',
      priority: 'high',
      action: 'View Transaction'
    },
    {
      id: 5,
      title: 'Weather Alert',
      description: 'Heavy rainfall expected in your region. Take necessary precautions for your crops.',
      type: 'warning',
      status: 'unread',
      date: '2024-01-11',
      time: '08:00 AM',
      priority: 'high',
      action: 'View Weather'
    },
    {
      id: 6,
      title: 'Profile Update Required',
      description: 'Please update your farm details to get better investor matches',
      type: 'info',
      status: 'read',
      date: '2024-01-10',
      time: '03:30 PM',
      priority: 'low',
      action: 'Update Profile'
    },
    {
      id: 7,
      title: 'Investment Opportunity',
      description: 'New investment opportunity in poultry farming. Check details in your portfolio.',
      type: 'info',
      status: 'unread',
      date: '2024-01-09',
      time: '01:15 PM',
      priority: 'medium',
      action: 'View Opportunity'
    },
    {
      id: 8,
      title: 'System Maintenance',
      description: 'Scheduled maintenance on January 18th from 2:00 AM to 4:00 AM. Some features may be unavailable.',
      type: 'warning',
      status: 'read',
      date: '2024-01-08',
      time: '04:00 PM',
      priority: 'low',
      action: 'Learn More'
    }
  ];

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    if (darkMode) {
      switch (priority) {
        case 'high': return 'bg-red-900/30 text-red-300';
        case 'medium': return 'bg-yellow-900/30 text-yellow-300';
        case 'low': return 'bg-gray-800 text-gray-300';
        default: return 'bg-gray-800 text-gray-300';
      }
    } else {
      switch (priority) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const unreadCount = mockNotifications.filter(n => n.status === 'unread').length;


  return (
    <DashboardLayout activeSidebarItem="notifications" title="Notifications" description="Manage your updates and alerts">
      <div className="w-full p-3 sm:p-4 md:p-6">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}`}
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className={darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Types</SelectItem>
                <SelectItem value="system" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>System</SelectItem>
                <SelectItem value="investment" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Investment</SelectItem>
                <SelectItem value="training" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Training</SelectItem>
                <SelectItem value="alert" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Status</SelectItem>
                <SelectItem value="unread" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Unread</SelectItem>
                <SelectItem value="read" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 mb-6">
          <Badge className="bg-[#7ede56] text-[#002f37]">All</Badge>
          <Badge className={darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}>High Priority</Badge>
          <Badge className={darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}>System Alerts</Badge>
        </div>

        {/* Notification Stats - Aligned with Farm Management style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {/* Total Notifications - Green */}
          <Card className="hover:shadow-md transition-shadow bg-[#7ede56] border-none shadow-lg">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90 uppercase tracking-wider">Total</span>
                <span className="text-xl sm:text-3xl font-bold text-white">{mockNotifications.length}</span>
              </div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center">
                <Bell className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Unread - Red */}
          <Card className="hover:shadow-md transition-shadow bg-[#ff6347] border-none shadow-lg">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90 uppercase tracking-wider">Unread</span>
                <span className="text-xl sm:text-3xl font-bold text-white">{unreadCount}</span>
              </div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* High Priority - Orange */}
          <Card className="hover:shadow-md transition-shadow bg-[#ffa500] border-none shadow-lg">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90 uppercase tracking-wider">Priority</span>
                <span className="text-xl sm:text-3xl font-bold text-white">
                  {mockNotifications.filter(n => n.priority === 'high').length}
                </span>
              </div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Today - Purple */}
          <Card className="hover:shadow-md transition-shadow bg-[#9333ea] border-none shadow-lg">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90 uppercase tracking-wider">Today</span>
                <span className="text-xl sm:text-3xl font-bold text-white">
                  {mockNotifications.filter(n => new Date(n.date).toDateString() === new Date().toDateString()).length}
                </span>
              </div>
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-md transition-shadow ${notification.status === 'unread'
                ? `border-l-4 border-l-[#7ede56] ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`
                : ''
                } ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</h3>
                          {notification.status === 'unread' && (
                            <div className="w-2 h-2 bg-[#7ede56] rounded-full flex-shrink-0"></div>
                          )}
                          <Badge className={`${getPriorityColor(notification.priority)} text-[10px] sm:text-xs`}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className={`mb-3 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{notification.description}</p>
                        <div className={`flex flex-wrap items-center gap-4 text-[10px] sm:text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(notification.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button
                          size="sm"
                          className="flex-1 sm:flex-none bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] font-bold text-xs"
                        >
                          {notification.action}
                        </Button>
                        {notification.status === 'unread' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`flex-1 sm:flex-none text-xs ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' : ''}`}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredNotifications.length === 0 && (
            <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
              <CardContent className="p-8 sm:p-12 text-center">
                <Bell className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No notifications found</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'You\'re all caught up! New notifications will appear here.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
