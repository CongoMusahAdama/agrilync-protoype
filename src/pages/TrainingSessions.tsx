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
import DashboardLayout from '@/components/DashboardLayout';
import {
  ArrowLeft,
  ArrowRight,
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
  Star,
  Calendar,
  Upload,
  Paperclip,
  Send,
  MoreHorizontal,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

const TrainingSessions = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const { darkMode, toggleDarkMode } = useDarkMode();
  const sidebarDarkMode = !darkMode;
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('training-sessions');
  const [activeTab, setActiveTab] = useState<'available' | 'schedule' | 'advisory'>('available');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'advisory') {
      setActiveTab('advisory');
    }
  }, []);
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [infestationDetails, setInfestationDetails] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAnalyzeInfestation = () => {
    if (!infestationDetails.trim() && !selectedImage) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const response = {
        id: aiHistory.length + 1,
        question: `Analysis Report: ${infestationDetails || 'Image Upload'}`,
        response: `Our AI has analyzed your report. Based on the patterns detected, this appears to be early-stage ${userType === 'grower' ? 'Fall Armyworm infestation' : 'Newcastle Disease'}. 

Recommended Action:
1. Isolate the affected ${userType === 'grower' ? 'crops' : 'livestock'} immediately.
2. Apply ${userType === 'grower' ? 'Neem-based organic pesticide' : 'Virkon-S disinfection'}.
3. I have notified Agent Kwame Mensah to schedule an emergency visit.`,
        timestamp: 'Just now',
        type: 'analysis'
      };
      setAiHistory([response, ...aiHistory]);
      setIsAnalyzing(false);
      setInfestationDetails('');
      setSelectedImage(null);
      setActiveTab('advisory');
    }, 2000);
  };


  return (
    <DashboardLayout activeSidebarItem="training-sessions" title="Training Sessions" description="Discover and manage your learning opportunities">

      <div className="w-full p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className={`p-1 flex bg-opacity-50 backdrop-blur-sm rounded-xl border ${darkMode ? 'bg-[#01343c] border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            {[
              { id: 'available', label: 'Marketplace', icon: BookOpen },
              { id: 'advisory', label: 'AI Advisory', icon: Bot },
              { id: 'schedule', label: 'My Learning', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-[#7ede56] text-[#002f37] shadow-[0_4px_12px_rgba(126,222,86,0.3)]'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    : 'text-gray-600 hover:text-[#002f37] hover:bg-gray-100'
                  }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`px-4 py-1.5 rounded-full ${darkMode ? 'border-[#7ede56] text-[#7ede56]' : 'border-[#002f37] text-[#002f37]'}`}>
              {activeTab === 'available' ? `${filteredSessions.length} Programs Available` :
                activeTab === 'schedule' ? `${registeredTrainings.length} Active Courses` : 'AI Advisor Online'}
            </Badge>
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
                            className={`text-xs ${training.status === 'Completed'
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Rail: Infestation Upload & Tools */}
            <div className="xl:col-span-1 space-y-6">
              <Card className={`overflow-hidden border-none shadow-xl ${darkMode ? 'bg-[#01343c]/50' : 'bg-white'}`}>
                <div className="bg-gradient-to-r from-[#7ede56] to-[#6bc947] p-4 text-[#002f37]">
                  <h3 className="font-bold flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Instant Diagnosis
                  </h3>
                  <p className="text-xs opacity-80 mt-1">Upload a photo for AI-powered pest & disease analysis</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${darkMode ? 'border-gray-700 bg-black/20 hover:border-[#7ede56]/50' : 'border-gray-300 bg-gray-50 hover:border-[#7ede56]'
                      }`}
                    onClick={() => setSelectedImage('mock_image_path')}
                  >
                    {selectedImage ? (
                      <div className="relative w-full h-full p-2">
                        <div className="w-full h-full rounded-lg bg-[#7ede56]/10 flex items-center justify-center border border-[#7ede56]/30">
                          <ImageIcon className="h-12 w-12 text-[#7ede56]" />
                        </div>
                        <Badge className="absolute top-4 right-4 bg-[#7ede56] text-[#002f37]">Image Selected</Badge>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-[#7ede56]/10">
                          <ImageIcon className="h-8 w-8 text-[#7ede56]" />
                        </div>
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Drop your photo here</p>
                        <p className="text-xs text-gray-500">Supports JPG, PNG (Max 5MB)</p>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Additional Context</label>
                    <textarea
                      placeholder="Describe the symptoms or changes you've noticed..."
                      value={infestationDetails}
                      onChange={(e) => setInfestationDetails(e.target.value)}
                      className={`w-full h-24 p-3 rounded-xl border transition-all resize-none outline-none focus:ring-2 focus:ring-[#7ede56] ${darkMode ? 'bg-[#002f37] border-gray-700 text-white placeholder:text-gray-600' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    />
                  </div>

                  <Button
                    className="w-full bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] font-bold h-12 rounded-xl flex items-center justify-center gap-2 group"
                    onClick={handleAnalyzeInfestation}
                    disabled={isAnalyzing || (!infestationDetails.trim() && !selectedImage)}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-[#002f37]/30 border-t-[#002f37] rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Bot className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Run AI Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className={`p-4 border-none shadow-lg ${darkMode ? 'bg-gradient-to-br from-[#01343c] to-[#002f37]' : 'bg-gradient-to-br from-[#7ede56]/5 to-white'}`}>
                <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <CheckCircle className="h-4 w-4 text-[#7ede56]" />
                  AI Capabilities
                </h4>
                <div className="space-y-3">
                  {[
                    'Instant Pest Identification',
                    'Real-time Soil Health Advice',
                    'Climate Impact Forecasting',
                    'Integrated Management Plans'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56]" />
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Center: AI Chat Assistant */}
            <div className="xl:col-span-2 flex flex-col h-[700px]">
              <Card className={`flex-1 flex flex-col border-none shadow-2xl overflow-hidden ${darkMode ? 'bg-[#01343c]/30' : 'bg-gray-50/50'}`}>
                {/* Chat Header */}
                <div className={`p-4 flex items-center justify-between border-b ${darkMode ? 'border-gray-700/50 bg-[#01343c]/50' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7ede56] to-[#6bc947] flex items-center justify-center">
                        <Bot className="h-6 w-6 text-[#002f37]" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[#7ede56] rounded-full border-2 border-white dark:border-[#01343c]" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AkuafoAdanfo</h3>
                      <p className="text-[10px] text-[#7ede56] font-bold uppercase tracking-wider">Online & Analyzing</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {aiHistory.map((entry) => (
                    <div key={entry.id} className="space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end pr-8">
                        <div className={`max-w-[80%] p-4 rounded-2xl rounded-tr-none shadow-sm ${darkMode ? 'bg-[#7ede56] text-[#002f37]' : 'bg-[#002f37] text-white'
                          }`}>
                          <p className="text-sm leading-relaxed">{entry.question}</p>
                          <p className={`text-[10px] mt-2 opacity-60 text-right`}>{entry.timestamp}</p>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex justify-start pl-8">
                        <div className={`max-w-[85%] p-5 rounded-2xl rounded-tl-none border shadow-md relative ${darkMode ? 'bg-[#01343c] border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'
                          }`}>
                          <div className={`absolute -left-10 top-0 h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-[#01424d]' : 'bg-gray-100'
                            }`}>
                            <Bot className="h-5 w-5 text-[#7ede56]" />
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{entry.response}</p>
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                            <button className="text-[10px] font-bold text-[#7ede56] hover:underline">Apply Recommendation</button>
                            <button className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors">Not Helpful</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isAnalyzing && (
                    <div className="flex justify-start pl-8 animate-pulse">
                      <div className={`p-4 rounded-2xl bg-gray-200/20 dark:bg-white/5`}>
                        <div className="flex gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700/50' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-2 max-w-4xl mx-auto">
                    <button className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100'}`}>
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className={`h-12 rounded-xl border-none pr-12 text-sm ${darkMode ? 'bg-[#002f37] text-white placeholder:text-gray-600' : 'bg-gray-100 text-gray-900 border-none'
                          }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && aiPrompt.trim()) {
                            const newEntry = {
                              id: aiHistory.length + 1,
                              question: aiPrompt,
                              response: 'AkuafoAdanfo is processing your request. I will provide details shortly. Your local agent has also been updated.',
                              timestamp: 'Just now'
                            };
                            setAiHistory([newEntry, ...aiHistory]);
                            setAiPrompt('');
                          }
                        }}
                      />
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-[#7ede56] text-[#002f37] flex items-center justify-center"
                        onClick={() => {
                          if (!aiPrompt.trim()) return;
                          const newEntry = {
                            id: aiHistory.length + 1,
                            question: aiPrompt,
                            response: 'AkuafoAdanfo is processing your request. I will provide details shortly. Your local agent has also been updated.',
                            timestamp: 'Just now'
                          };
                          setAiHistory([newEntry, ...aiHistory]);
                          setAiPrompt('');
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="h-12 w-12 rounded-xl bg-[#7ede56]/10 text-[#7ede56] flex items-center justify-center hover:bg-[#7ede56]/20 transition-colors">
                      <Mic className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedTraining?.title || 'Training Details'}</DialogTitle>
            <DialogDescription>
              {selectedTraining?.description || 'Review the details of this training session below.'}
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
    </DashboardLayout>
  );
};

export default TrainingSessions;