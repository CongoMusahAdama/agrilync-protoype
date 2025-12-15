import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarProfileCard from '@/components/SidebarProfileCard';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Clock,
  CheckCheck,
  Trash2,
  Moon,
  Sun,
  Settings,
  Users,
  MapPin,
  UserCheck,
  BarChart3,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Menu
} from 'lucide-react';

const Notifications = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('notifications');

  // Handle sidebar navigation
  const handleSidebarNavigation = (item: string) => {
    setActiveSidebarItem(item);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
    const routes: { [key: string]: string } = {
      'dashboard': `/dashboard/${userType}`,
      'settings': `/dashboard/${userType}/settings`,
      'farm-analytics': `/dashboard/${userType}/farm-analytics`,
      'investor-matches': `/dashboard/${userType}/investor-matches`,
      'training-sessions': `/dashboard/${userType}/training-sessions`,
      'farm-management': `/dashboard/${userType}/farm-management`,
      'notifications': `/dashboard/${userType}/notifications`
    };
    if (routes[item]) {
      navigate(routes[item]);
    }
  };

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

  const SidebarContent = () => (
    <>
      {/* Logo/App Name */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-200' : 'border-[#002f37] border-opacity-20'}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
              alt="AgriLync Logo"
              className="h-8 w-8"
            />
            {(!sidebarCollapsed || isMobile) && (
              <span className={`text-xl font-bold ${darkMode ? 'text-[#002f37]' : 'text-[#f4ffee]'}`}>
                AgriLync
              </span>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'} transition-colors`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" aria-label="Expand sidebar" />
              ) : (
                <ChevronLeft className="h-5 w-5" aria-label="Collapse sidebar" />
              )}
            </button>
          )}
        </div>
      </div>

      <SidebarProfileCard
        sidebarCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        darkMode={darkMode}
        userType={userType}
      />

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: Activity },
          { key: 'farm-management', label: 'Farm Management', icon: MapPin },
          { key: 'farm-analytics', label: 'Farm Analytics', icon: BarChart3 },
          { key: 'investor-matches', label: 'Investor Matches', icon: Users },
          { key: 'training-sessions', label: 'Training Sessions', icon: Calendar },
          { key: 'notifications', label: 'Notifications', icon: Bell },
          { key: 'settings', label: 'Profile & Settings', icon: Settings }
        ].map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm ${activeSidebarItem === item.key
              ? 'bg-[#7ede56] text-[#002f37]'
              : darkMode
                ? 'text-[#002f37] hover:bg-gray-100'
                : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
              }`}
            onClick={() => handleSidebarNavigation(item.key)}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {(!sidebarCollapsed || isMobile) && <span className="font-medium">{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Log Out - Sticky at bottom */}
      <div className={`mt-auto p-4 border-t space-y-2 ${darkMode ? 'border-gray-200' : 'border-[#002f37] border-opacity-20'} sticky bottom-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'}`}>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'}`}
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="h-4 w-4 flex-shrink-0 text-yellow-500" /> : <Moon className="h-4 w-4 flex-shrink-0 text-gray-400" />}
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </div>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'}`}
          onClick={() => navigate('/')}
        >
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Log Out</span>}
        </div>
      </div>
    </>
  );

  return (
    <div className={`h-screen overflow-hidden transition-colors ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {isMobile && (
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent
              side="left"
              className={`w-[280px] p-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'} overflow-y-auto`}
            >
              <div className="flex flex-col h-full">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {!isMobile && (
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-white' : 'bg-[#002f37]'} flex-shrink-0 transition-all duration-300 border-r ${darkMode ? 'border-gray-200/60' : 'border-[#00404a]'}`}>
            <div className="flex flex-col h-full sticky top-0 overflow-hidden">
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto transition-colors ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
          {/* Top Header */}
          <div className={`${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white border-gray-200'} border-b px-3 sm:px-6 py-3 sm:py-4 transition-colors sticky top-0 z-20`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileSidebarOpen(true)}
                    className={`p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className={`text-lg sm:text-2xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Notifications
                  </h1>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Stay updated with your farm activities
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 sm:gap-2 rounded-full p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={toggleDarkMode}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600" />
                  )}
                  <span className="hidden sm:inline ml-1">{darkMode ? 'Light' : 'Dark'}</span>
                </Button>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
            </div>
          </div>

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

            {/* Notification Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              <Card className="bg-[#7ede56] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-white">Total Notifications</p>
                    <p className="text-2xl font-bold text-white">{mockNotifications.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-white" />
                </div>
              </Card>

              <Card className="bg-[#ff6347] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-white">Unread</p>
                    <p className="text-2xl font-bold text-white">{unreadCount}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </Card>

              <Card className="bg-[#ffa500] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-white">High Priority</p>
                    <p className="text-2xl font-bold text-white">
                      {mockNotifications.filter(n => n.priority === 'high').length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </Card>

              <Card className="bg-[#921573] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-white">Today</p>
                    <p className="text-2xl font-bold text-white">
                      {mockNotifications.filter(n => new Date(n.date).toDateString() === new Date().toDateString()).length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-white" />
                </div>
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
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</h3>
                              {notification.status === 'unread' && (
                                <div className="w-2 h-2 bg-[#7ede56] rounded-full"></div>
                              )}
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className={`mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{notification.description}</p>
                            <div className={`flex items-center gap-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              size="sm"
                              className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                            >
                              {notification.action}
                            </Button>
                            {notification.status === 'unread' && (
                              <Button variant="outline" size="sm" className={darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' : ''}>
                                Mark as Read
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
        </div>
      </div>
    </div>
  );
};

export default Notifications;
