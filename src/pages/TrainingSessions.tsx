import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarProfileCard from '@/components/SidebarProfileCard';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Video,
  Download,
  Search,
  Filter,
  Moon,
  Sun,
  Settings,
  Bell,
  BarChart3,
  TrendingUp,
  Activity,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Menu,
  Mic,
  Bot,
  MessageCircle,
  Phone,
  Mail,
  Star
} from 'lucide-react';

const TrainingSessions = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('training-sessions');
  const [activeTab, setActiveTab] = useState<'available' | 'schedule' | 'advisory'>('available');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiHistory, setAiHistory] = useState([
    {
      id: 1,
      question: 'AkuafoAdanfo, how often should I apply fertilizer to my maize during the growing stage?',
      response:
        'Apply NPK 15-15-15 two weeks after germination and repeat every four weeks. I will monitor leaf colour changes and alert you if early chlorosis is detected.',
      timestamp: 'Today, 9:45 AM'
    },
    {
      id: 2,
      question: 'AkuafoAdanfo, what is the best way to control armyworms without chemicals?',
      response:
        'Use neem extract spray twice a week and encourage natural predators by intercropping with legumes. I can help you identify armyworm damage from leaf photos and suggest targeted organic controls.',
      timestamp: 'Yesterday, 4:10 PM'
    }
  ]);
  const [bookedSessions, setBookedSessions] = useState([
    {
      id: 1,
      advisor: 'Kwame Mensah',
      specialization: 'Crop Protection',
      region: 'Ashanti',
      mode: 'Phone Call',
      date: '15 Nov 2025',
      time: '2:00 PM',
      status: 'Upcoming'
    }
  ]);

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

  // Mock data for training sessions
  const mockSessions = [
    {
      id: 1,
      title: 'Modern Cocoa Farming Techniques',
      description: 'Learn advanced cocoa cultivation methods, pest management, and yield optimization strategies.',
      date: '2025-11-12',
      time: '09:00 AM',
      duration: '4 hours',
      mode: 'Field Workshop',
      location: 'Kumasi Agricultural Training Center',
      instructor: 'Dr. Kwame Asante',
      maxParticipants: 30,
      currentParticipants: 18,
      status: 'upcoming',
      category: 'Crop Farming',
      region: 'Ashanti',
      organization: 'Ministry of Food & Agriculture',
      materials: ['Training Manual', 'Video Tutorials', 'Certificate']
    },
    {
      id: 2,
      title: 'Poultry Management Best Practices',
      description: 'Comprehensive guide to poultry farming including feeding, health management, and business planning.',
      date: '2025-11-20',
      time: '10:00 AM',
      duration: '3 hours',
      mode: 'Online Webinar',
      location: 'Online - Zoom',
      instructor: 'Mrs. Akosua Mensah',
      maxParticipants: 50,
      currentParticipants: 35,
      status: 'upcoming',
      category: 'Livestock',
      region: 'Greater Accra',
      organization: 'AgriLync Advisory',
      materials: ['E-book', 'Live Q&A', 'Certificate']
    },
    {
      id: 3,
      title: 'Soil Health and Fertilizer Management',
      description: 'Understanding soil composition, testing methods, and proper fertilizer application techniques.',
      date: '2025-10-28',
      time: '08:00 AM',
      duration: '5 hours',
      mode: 'Field Practical',
      location: 'Ejisu Farm Demonstration Site',
      instructor: 'Prof. Nana Yaa',
      maxParticipants: 25,
      currentParticipants: 25,
      status: 'completed',
      category: 'Soil Management',
      region: 'Ashanti',
      organization: 'KNUST Extension',
      materials: ['Field Guide', 'Soil Test Kit', 'Certificate']
    },
    {
      id: 4,
      title: 'Financial Planning for Farmers',
      description: 'Budgeting, record keeping, and financial planning strategies for sustainable farming businesses.',
      date: '2025-10-15',
      time: '02:00 PM',
      duration: '2 hours',
      mode: 'Online Clinic',
      location: 'Online - Teams',
      instructor: 'Mr. Kofi Boateng',
      maxParticipants: 100,
      currentParticipants: 78,
      status: 'completed',
      category: 'Business',
      region: 'National',
      organization: 'AgriFinance Hub',
      materials: ['Financial Templates', 'Recording', 'Certificate']
    },
    {
      id: 5,
      title: 'Organic Farming Certification',
      description: 'Complete certification program for organic farming practices and certification requirements.',
      date: '2025-12-05',
      time: '09:00 AM',
      duration: '6 hours',
      mode: 'Field Workshop',
      location: 'Accra Organic Training Center',
      instructor: 'Dr. Ama Serwaa',
      maxParticipants: 20,
      currentParticipants: 12,
      status: 'upcoming',
      category: 'Organic Farming',
      region: 'Greater Accra',
      organization: 'Ghana Organic Alliance',
      materials: ['Certification Guide', 'Practice Manual', 'Certificate']
    }
  ];

  const registeredTrainings = [
    {
      id: 1,
      title: 'Organic Maize Management',
      date: '2025-11-12',
      mode: 'Field Workshop',
      status: 'Registered',
      trainer: 'Ext. Agent John',
      organization: 'AgriLync Extension'
    },
    {
      id: 2,
      title: 'Record Keeping for Small Farmers',
      date: '2025-11-20',
      mode: 'Online Webinar',
      status: 'Upcoming',
      trainer: 'AgriLync Advisory',
      organization: 'AgriLync Advisory'
    },
    {
      id: 3,
      title: 'Climate-Smart Irrigation Tips',
      date: '2025-09-05',
      mode: 'SMS Series',
      status: 'Completed',
      trainer: 'AI Advisor',
      organization: 'AgriLync AI'
    }
  ];

  const advisors = [
    {
      id: 1,
      name: 'Grace Adjei',
      region: 'Ashanti',
      specialization: 'Crop Protection & Soil Health',
      availability: 'In-person slots today from 2:00 PM',
      mode: 'Field Visit'
    },
    {
      id: 2,
      name: 'Yaw Boakye',
      region: 'Ashanti',
      specialization: 'Livestock Health & Feeding',
      availability: 'Tomorrow at 9:00 AM (Farm visit)',
      mode: 'Field Visit'
    },
    {
      id: 3,
      name: 'Kwesi Opoku',
      region: 'Ashanti',
      specialization: 'Business Planning & Record Keeping',
      availability: 'Next slot: 14 Nov, 11:30 AM',
      mode: 'On-site / Phone'
    }
  ];

  const availableTrainings = mockSessions.filter((session) => session.status === 'upcoming');

  const trainingCategories = Array.from(new Set(mockSessions.map((session) => session.category)));
  const trainingRegions = Array.from(new Set(mockSessions.map((session) => session.region)));
  const trainingModes = Array.from(new Set(mockSessions.map((session) => session.mode)));

  const filteredSessions = availableTrainings.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || session.category === categoryFilter;
    const matchesRegion = regionFilter === 'all' || session.region === regionFilter;
    const matchesMode = modeFilter === 'all' || session.mode === modeFilter;
    return matchesSearch && matchesCategory && matchesRegion && matchesMode;
  });

  const getStatusColor = (status: string) => {
    if (darkMode) {
      switch (status) {
        case 'upcoming': return 'bg-blue-900/30 text-blue-300';
        case 'completed': return 'bg-green-900/30 text-green-300';
        case 'cancelled': return 'bg-red-900/30 text-red-300';
        default: return 'bg-gray-800 text-gray-300';
      }
    } else {
      switch (status) {
        case 'upcoming': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Online Webinar':
      case 'Online Clinic':
        return <Video className="h-4 w-4" />;
      case 'Field Workshop':
        return <Users className="h-4 w-4" />;
      case 'Field Practical':
        return <MapPin className="h-4 w-4" />;
      case 'SMS Series':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

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
              <span className={`text-xl font-bold ${darkMode ? 'text-[#002f37]' : 'text-[#f4ffee]'}`}>AgriLync</span>
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
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'dashboard' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('dashboard')}
        >
          <Activity className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Dashboard</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'settings' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('settings')}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Profile & Settings</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'farm-management' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('farm-management')}
        >
          <MapPin className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Farm Management</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'farm-analytics' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('farm-analytics')}
        >
          <BarChart3 className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Farm Analytics</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'investor-matches' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('investor-matches')}
        >
          <Users className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Investor Matches</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'training-sessions' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('training-sessions')}
        >
          <Calendar className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Training Sessions</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'notifications' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('notifications')}
        >
          <Bell className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Notifications</span>}
        </div>
      </nav>

      {/* Log Out - Sticky at bottom */}
      <div className={`mt-auto p-4 border-t ${darkMode ? 'border-gray-200' : 'border-[#002f37] border-opacity-20'} sticky bottom-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'}`}>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'}`}
          onClick={() => navigate('/')}
        >
          <ArrowRight className="h-5 w-5 flex-shrink-0" />
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
                  <h1 className={`text-lg sm:text-2xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Training Sessions</h1>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discover and manage your learning opportunities</p>
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
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
            <div className="mb-6">
              <div className={`flex flex-wrap gap-2 p-1 rounded-full ${darkMode ? 'bg-[#01343c]' : 'bg-white shadow-sm border border-gray-200'}`}>
                {[
                  { id: 'available', label: 'Available Trainings' },
                  { id: 'schedule', label: 'My Schedule' },
                  { id: 'advisory', label: 'Advisory Sessions' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#7ede56] text-[#002f37]'
                        : darkMode
                        ? 'text-gray-300 hover:bg-[#0f515b]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'available' && (
              <div className="space-y-6">
                <Card className={darkMode ? 'bg-[#002f37] border border-gray-700' : 'bg-white shadow-sm'}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                      <div className="flex-1 space-y-2">
                        <label className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Search trainings</label>
                        <Input
                          placeholder="Search by title, trainer, or keywords"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}`}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                        <div className="space-y-2">
                          <label className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</label>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}`}>
                              <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                              <SelectItem value="all">All</SelectItem>
                              {trainingCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Region</label>
                          <Select value={regionFilter} onValueChange={setRegionFilter}>
                            <SelectTrigger className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}`}>
                              <SelectValue placeholder="All regions" />
                            </SelectTrigger>
                            <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                              <SelectItem value="all">All</SelectItem>
                              {trainingRegions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mode</label>
                          <Select value={modeFilter} onValueChange={setModeFilter}>
                            <SelectTrigger className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}`}>
                              <SelectValue placeholder="All modes" />
                            </SelectTrigger>
                            <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                              <SelectItem value="all">All</SelectItem>
                              {trainingModes.map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                  {mode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSessions.map((session, index) => {
                    const occupancy = Math.round((session.currentParticipants / session.maxParticipants) * 100);
                    return (
                      <Card
                        key={session.id}
                        className={`transition-all duration-300 ${darkMode ? 'bg-[#002f37] border-gray-700' : 'bg-white shadow-md'} hover:-translate-y-1 hover:shadow-lg`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-[#7ede56] text-[#002f37] text-xs">{session.category}</Badge>
                            <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                              {session.status === 'upcoming' ? 'Open for Registration' : session.status}
                            </Badge>
                          </div>
                          <CardTitle className={`text-lg mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {session.title}
                          </CardTitle>
                          <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {session.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(session.date).toLocaleDateString()}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <Clock className="h-4 w-4" />
                              <span>{session.time}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {getTypeIcon(session.mode)}
                              <span>{session.mode}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <MapPin className="h-4 w-4" />
                              <span>{session.region}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Trainer</p>
                              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{session.instructor}</p>
                            </div>
                            <div>
                              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Organizer</p>
                              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{session.organization}</p>
                            </div>
                          </div>
                          <div>
                            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {session.currentParticipants} of {session.maxParticipants} seats filled
                            </p>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div
                                className="h-full bg-gradient-to-r from-[#7ede56] to-[#6bc947] transition-all duration-300"
                                style={{ width: `${occupancy}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button
                              variant="outline"
                              className={`text-xs ${darkMode ? 'border-transparent bg-[#01424d] text-white hover:bg-[#01525f]' : 'text-[#002f37] hover:bg-gray-100'}`}
                              onClick={() => {
                                setSelectedTraining(session);
                                setShowDetailsDialog(true);
                              }}
                            >
                              View Details
                            </Button>
                            <Button className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] text-xs px-4">
                              Register
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filteredSessions.length === 0 && (
                    <Card className={`col-span-full ${darkMode ? 'bg-[#002f37] border-gray-700' : 'bg-white shadow'} `}>
                      <CardContent className="p-8 text-center">
                        <BookOpen className={`h-10 w-10 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          No trainings match your filters
                        </h3>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Try adjusting your filters or check back later for new programs tailored to your farm.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <Card className={darkMode ? 'bg-[#002f37] border border-gray-700' : 'bg-white shadow-sm'}>
                <CardHeader className="pb-4">
                  <CardTitle className={darkMode ? 'text-white' : 'text-gray-900'}>My Training Schedule</CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Track the trainings you have registered for, monitor completion status, and access materials.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead className={darkMode ? 'bg-[#01343c]' : 'bg-gray-50'}>
                        <tr>
                          {['Training Title', 'Date', 'Mode', 'Status', 'Trainer', 'Actions'].map((header) => (
                            <th
                              key={header}
                              scope="col"
                              className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
                        {registeredTrainings.map((training) => (
                          <tr key={training.id} className={darkMode ? 'hover:bg-[#01343c]' : 'hover:bg-gray-50'}>
                            <td className={`px-4 py-3 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {training.title}
                            </td>
                            <td className={darkMode ? 'px-4 py-3 text-gray-300' : 'px-4 py-3 text-gray-600'}>
                              {training.date}
                            </td>
                            <td className={darkMode ? 'px-4 py-3 text-gray-300' : 'px-4 py-3 text-gray-600'}>
                              {training.mode}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                className={`text-xs ${
                                  training.status === 'Completed'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                    : training.status === 'Upcoming'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                                }`}
                              >
                                {training.status}
                              </Badge>
                            </td>
                            <td className={darkMode ? 'px-4 py-3 text-gray-300' : 'px-4 py-3 text-gray-600'}>
                              {training.trainer}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className={`text-xs ${darkMode ? 'border-transparent bg-[#01424d] text-white hover:bg-[#01525f]' : 'text-[#002f37] hover:bg-gray-100'}`}>
                                  View Details
                                </Button>
                                {training.status === 'Completed' ? (
                                  <Button size="sm" className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] text-xs">
                                    Download Certificate
                                  </Button>
                                ) : (
                                  <Button variant="outline" size="sm" className={`text-xs ${darkMode ? 'border-gray-600 text-white hover:bg-gray-800' : ''}`}>
                                    Reschedule
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'advisory' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={darkMode ? 'bg-[#002f37] border border-gray-700' : 'bg-white shadow-sm'}>
                  <CardHeader>
                    <CardTitle className={darkMode ? 'text-white' : 'text-gray-900'}>AI Advisory Assistant</CardTitle>
                    <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Get instant recommendations on crops, pests, soil health, and climate based on your questions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#01343c]' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Bot className={`h-6 w-6 ${darkMode ? 'text-[#7ede56]' : 'text-[#0b8a62]'}`} />
                        <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ask AkuafoAdanfo (AI Advisor)</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          placeholder="Ask AkuafoAdanfo about pests, crop stress, or livestock health..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}`}
                        />
                        <Button
                          className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37]"
                          onClick={() => {
                            if (!aiPrompt.trim()) return;
                            const newEntry = {
                              id: aiHistory.length + 1,
                              question: aiPrompt,
                              response:
                                'AkuafoAdanfo is analysing your request. I will detect possible pest or disease issues, suggest treatments, and notify your regional extension agent if an inspection is required.',
                              timestamp: 'Just now'
                            };
                            setAiHistory([newEntry, ...aiHistory]);
                            setAiPrompt('');
                          }}
                        >
                          Ask
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <Mic className="h-3.5 w-3.5" />
                        Voice input in Twi, Ewe, and English coming soon. Simply say “AkuafoAdanfo check my cocoa leaves.”
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {aiHistory.map((entry) => (
                        <div
                          key={entry.id}
                          className={`rounded-lg p-4 border ${darkMode ? 'border-gray-700 bg-[#01343c]' : 'border-gray-200 bg-white shadow-sm'}`}
                        >
                          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{entry.timestamp}</p>
                          <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.question}</p>
                          <p className={`text-sm leading-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{entry.response}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className={darkMode ? 'bg-[#002f37] border border-gray-700' : 'bg-white shadow-sm'}>
                  <CardHeader>
                    <CardTitle className={darkMode ? 'text-white' : 'text-gray-900'}>Human Advisory & Booking</CardTitle>
                    <CardDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Book sessions with extension agents, track upcoming consultations, and review past feedback.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming Sessions</h3>
                      <div className={`space-y-3 max-h-32 overflow-y-auto pr-1 ${darkMode ? '' : ''}`}>
                        {bookedSessions.map((session) => (
                          <div
                            key={session.id}
                            className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#01343c]' : 'border-gray-200 bg-gray-50'}`}
                          >
                            <div className="flex items-center justify-between text-sm">
                              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.advisor}</p>
                              <Badge className="bg-[#7ede56] text-[#002f37] text-xs">{session.status}</Badge>
                            </div>
                            <div className={`flex items-center gap-2 text-xs mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <Calendar className="h-3.5 w-3.5" />
                              {session.date} • {session.time} • {session.mode}
                            </div>
                          </div>
                        ))}
                        {bookedSessions.length === 0 && (
                          <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>No sessions booked yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Available Advisors</h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {advisors.map((advisor) => (
                          <div
                            key={advisor.id}
                            className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#01343c]' : 'border-gray-200 bg-white shadow-sm'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{advisor.name}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{advisor.specialization}</p>
                              </div>
                              <div className="flex items-center gap-2 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}">
                                <MapPin className="h-3.5 w-3.5" />
                                {advisor.region}
                              </div>
                            </div>
                            <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {advisor.availability}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                size="sm"
                                className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] text-xs"
                                onClick={() =>
                                  setBookedSessions([
                                    ...bookedSessions,
                                    {
                                      id: bookedSessions.length + 1,
                                      advisor: advisor.name,
                                      specialization: advisor.specialization,
                                      region: advisor.region,
                                      mode: advisor.mode,
                                      date: 'Pending confirmation with Ashanti team',
                                      time: 'To be scheduled',
                                      status: 'Requested'
                                    }
                                  ])
                                }
                              >
                                Request Visit
                              </Button>
                              <Button variant="outline" size="sm" className={`text-xs ${darkMode ? 'border-gray-600 text-white hover:bg-gray-800' : ''}`}>
                                Contact
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-[#01343c]' : 'border-gray-200 bg-gray-50'}`}>
                      <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Share Feedback</p>
                      <p className={`text-xs mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Help us improve advisory quality. Rate your last session and leave suggestions for the advisor.
                      </p>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, index) => (
                          <Star key={index} className={`h-4 w-4 ${darkMode ? 'text-[#7ede56]' : 'text-[#facc15]'}`} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTraining?.title}</DialogTitle>
            <DialogDescription>
              {selectedTraining?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{new Date(selectedTraining?.date).toLocaleDateString()}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.time}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.duration}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mode</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.mode}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.location}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Instructor</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.instructor}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Participants</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.maxParticipants}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Participants</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.currentParticipants}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.status}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.category}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Region</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.region}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">{selectedTraining?.organization}</dd>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Materials</dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">
                <ul className="list-disc list-inside">
                  {(selectedTraining?.materials || []).map((material: string, index: number) => (
                    <li key={`${material}-${index}`}>{material}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
            <Button onClick={() => {
              setSelectedTraining(null);
              setShowDetailsDialog(false);
            }}>Register</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingSessions;