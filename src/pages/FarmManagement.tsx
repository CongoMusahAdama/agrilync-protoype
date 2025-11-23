import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarProfileCard from '@/components/SidebarProfileCard';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Leaf,
  Calendar,
  MapPin,
  TrendingUp,
  Activity,
  Edit,
  Trash2,
  Eye,
  Moon,
  Sun,
  Settings,
  Bell,
  BarChart3,
  Users,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Sprout,
  Scissors,
  Wrench,
  MoreHorizontal,
  CheckCircle,
  Menu
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const FarmManagement = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [farmProjects, setFarmProjects] = useState<Array<{
    id: string;
    name: string;
    type: string;
    category: string;
    area: string;
    investment: number;
    startDate: string;
    description: string;
    currentStage: string;
  }>>([
    {
      id: '1',
      name: 'Cocoa Plantation 2024',
      type: 'crop',
      category: 'Cocoa',
      area: '2.5 acres',
      investment: 15000,
      startDate: '2024-01-15',
      description: 'Premium cocoa plantation using improved Amelonado variety. Focus on sustainable farming practices and high yield.',
      currentStage: 'growing'
    },
    {
      id: '2',
      name: 'Poultry Farm Project',
      type: 'livestock',
      category: 'Poultry',
      area: '0.5 acres',
      investment: 8000,
      startDate: '2024-02-01',
      description: 'Modern broiler poultry farm with automated feeding system. Expected to produce 180 birds per cycle.',
      currentStage: 'growing'
    }
  ]);
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    type: '',
    category: '',
    area: '',
    investment: '',
    startDate: '',
    description: ''
  });
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('farm-management');
  const [farmStage, setFarmStage] = useState<string>('planning');
  const [showStageDialog, setShowStageDialog] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [stageDetails, setStageDetails] = useState<{ [key: string]: { date: string; notes: string; status: string; activities: Array<{ id: string; date: string; activity: string; description: string; resources?: string }> } }>({
    planning: { 
      date: '2024-01-15', 
      notes: 'Initial planning phase completed with budget allocation', 
      status: 'completed', 
      activities: [
        { id: '1', date: '2024-01-10', activity: 'Land Survey', description: 'Conducted comprehensive land survey to assess soil quality and drainage', resources: 'Survey equipment, 2 workers' },
        { id: '2', date: '2024-01-12', activity: 'Budget Planning', description: 'Created detailed budget plan for the entire farming cycle', resources: 'Financial planning software' },
        { id: '3', date: '2024-01-15', activity: 'Resource Procurement', description: 'Identified and listed all required resources and suppliers', resources: 'Supplier contacts, price lists' }
      ] 
    },
    planting: { 
      date: '2024-02-01', 
      notes: 'Planting completed successfully with proper spacing', 
      status: 'completed', 
      activities: [
        { id: '4', date: '2024-01-28', activity: 'Land Preparation', description: 'Cleared and tilled the land, removed weeds and debris', resources: 'Tractor, 3 workers, 2 days' },
        { id: '5', date: '2024-02-01', activity: 'Seed Sowing', description: 'Planted seeds with proper spacing and depth', resources: '50kg seeds, 4 workers' }
      ] 
    },
    growing: { 
      date: '2024-02-15', 
      notes: 'Crops growing well, regular monitoring in progress', 
      status: 'in-progress', 
      activities: [
        { id: '6', date: '2024-02-10', activity: 'First Fertilizer Application', description: 'Applied NPK fertilizer to support early growth', resources: '50kg NPK fertilizer, spreader' },
        { id: '7', date: '2024-02-15', activity: 'Irrigation Setup', description: 'Installed irrigation system for consistent watering', resources: 'Irrigation pipes, water pump' },
        { id: '8', date: '2024-02-20', activity: 'Pest Control', description: 'Applied organic pesticides to prevent pest infestation', resources: 'Organic pesticides, sprayer' }
      ] 
    },
    harvesting: { date: '', notes: '', status: 'pending', activities: [] },
    maintenance: { date: '', notes: '', status: 'pending', activities: [] },
    other: { date: '', notes: '', status: 'pending', activities: [] }
  });
  const [newActivity, setNewActivity] = useState({ date: '', activity: '', description: '', resources: '' });
  const [expandedStages, setExpandedStages] = useState<{ [key: string]: boolean }>({
    planning: true,
    planting: true,
    growing: true,
    harvesting: false,
    maintenance: false,
    other: false
  });

  const toggleStageExpansion = (stage: string) => {
    setExpandedStages({
      ...expandedStages,
      [stage]: !expandedStages[stage]
    });
  };

  // Check if we should open the create project modal (from Dashboard redirect)
  useEffect(() => {
    const shouldCreate = searchParams.get('create');
    if (shouldCreate === 'true') {
      setShowCreateProjectDialog(true);
      // Remove the query parameter from URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

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

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.type || !newProject.category || !newProject.area) {
      return;
    }

    const project = {
      id: Date.now().toString(),
      name: newProject.name,
      type: newProject.type,
      category: newProject.category,
      area: newProject.area,
      investment: newProject.investment ? parseFloat(newProject.investment) : 0,
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      description: newProject.description,
      currentStage: 'planning'
    };

    setFarmProjects([...farmProjects, project]);
    setNewProject({
      name: '',
      type: '',
      category: '',
      area: '',
      investment: '',
      startDate: '',
      description: ''
    });
    setShowCreateProjectDialog(false);
    setFarmStage('planning');
  };


  const getTypeIcon = (type: string) => {
    return type === 'crop' ? <Leaf className="h-4 w-4" /> : <Activity className="h-4 w-4" />;
  };

  // Handle opening stage edit dialog
  const handleEditStage = (stage: string) => {
    setSelectedStage(stage);
    setNewActivity({ date: '', activity: '', description: '', resources: '' });
    setShowStageDialog(true);
  };

  // Handle saving stage details
  const handleSaveStageDetails = () => {
    if (!selectedStage) return;
    
    const updatedDetails = {
      ...stageDetails,
      [selectedStage]: stageDetails[selectedStage]
    };
    
    // If this is the current stage, update farm stage to next
    const stages = ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'];
    const currentIndex = stages.indexOf(farmStage);
    if (selectedStage === farmStage && currentIndex < stages.length - 1) {
      setFarmStage(stages[currentIndex + 1]);
    }
    
    setShowStageDialog(false);
    // Here you would typically save to backend
    console.log('Stage details saved:', updatedDetails);
  };

  const handleAddActivity = () => {
    if (!selectedStage || !newActivity.date || !newActivity.activity) return;
    
    const activityId = Date.now().toString();
    const activity = {
      id: activityId,
      date: newActivity.date,
      activity: newActivity.activity,
      description: newActivity.description,
      resources: newActivity.resources || undefined
    };
    
    setStageDetails({
      ...stageDetails,
      [selectedStage]: {
        ...stageDetails[selectedStage],
        activities: [...(stageDetails[selectedStage].activities || []), activity]
      }
    });
    
    setNewActivity({ date: '', activity: '', description: '', resources: '' });
  };

  const handleDeleteActivity = (activityId: string) => {
    if (!selectedStage) return;
    
    setStageDetails({
      ...stageDetails,
      [selectedStage]: {
        ...stageDetails[selectedStage],
        activities: stageDetails[selectedStage].activities.filter(a => a.id !== activityId)
      }
    });
  };

  // Get stage colors based on metric card colors
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning':
        return {
          bg: '#7ede56',
          textOnLight: '#0f5132',
          textOnDark: '#d8ffd0'
        };
      case 'planting':
        return {
          bg: '#ffa500',
          textOnLight: '#8a4a00',
          textOnDark: '#ffe9c2'
        };
      case 'growing':
        return {
          bg: '#ff6347',
          textOnLight: '#7c1f0a',
          textOnDark: '#ffdcd5'
        };
      case 'harvesting':
        return {
          bg: '#921573',
          textOnLight: '#5e0e4a',
          textOnDark: '#f3d1f0'
        };
      case 'maintenance':
        return {
          bg: '#5fd646',
          textOnLight: '#0f5132',
          textOnDark: '#d8ffd0'
        };
      case 'other':
        return {
          bg: '#ffb547',
          textOnLight: '#8a4a00',
          textOnDark: '#ffe9c2'
        };
      default:
        return {
          bg: '#6b7280',
          textOnLight: '#374151',
          textOnDark: '#e5e7eb'
        };
    }
  };

  // Get stage icon
  const getStageIcon = (stage: string, isCompleted: boolean, isCurrent: boolean) => {
    // Completed stages show checkmark with white icon
    if (isCompleted) {
      return <CheckCircle className="h-6 w-6 text-white" />;
    }
    switch(stage) {
      case 'planning':
        return <FileText className="h-6 w-6 text-white" />;
      case 'planting':
        return <Sprout className="h-6 w-6 text-white" />;
      case 'growing':
        return <Leaf className="h-6 w-6 text-white" />;
      case 'harvesting':
        return <Scissors className="h-6 w-6 text-white" />;
      case 'maintenance':
        return <Wrench className="h-6 w-6 text-white" />;
      case 'other':
        return <MoreHorizontal className="h-6 w-6 text-white" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
    }
  };

  const getActivityLabel = (activity: any) => {
    if (!activity) return 'Activity logged';
    if (typeof activity === 'string') return activity;
    if (activity.activity) return activity.activity;
    if (activity.description) return activity.description;
    return 'Activity logged';
  };

  const outlineButtonClasses = darkMode
    ? 'bg-[#01424d] text-white border-[#0f4a53] hover:bg-[#02596b] hover:text-white'
    : 'border-gray-200 text-[#002f37] hover:bg-gray-100';

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
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
    <div className={`h-screen overflow-hidden ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
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
                  <h1 className={`text-lg sm:text-2xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Farm Management</h1>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Manage your crops and livestock</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center gap-1 sm:gap-2 rounded-full p-2 ${darkMode ? 'text-white hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
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
            {/* Stats Cards - Matching Main Dashboard Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              {/* Total Items - Green */}
              <Card className="bg-[#7ede56] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                {/* Leaf Pattern Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="h-8 w-8 text-white" />
                    <p className="text-sm font-medium text-white">Total Items</p>
                  </div>
                  <div className="flex-1 flex items-center">
                    <p className="text-4xl font-bold text-white">{farmProjects.length}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <a href="#" className="text-sm font-medium text-white hover:underline">View items</a>
                  </div>
                </div>
              </Card>

            {/* Crops - Orange */}
              <Card className="bg-[#ffa500] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                {/* Leaf Pattern Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex flex-col h-full relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Leaf className="h-8 w-8 text-white" />
                  <p className="text-sm font-medium text-white">Crops</p>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-4xl font-bold text-white">
                      {farmProjects.filter(item => item.type === 'crop').length}
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <a href="#" className="text-sm font-medium text-white hover:underline">View crops</a>
                </div>
              </div>
            </Card>

            {/* Livestock - Red/Coral */}
              <Card className="bg-[#ff6347] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                {/* Leaf Pattern Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex flex-col h-full relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-8 w-8 text-white" />
                  <p className="text-sm font-medium text-white">Livestock</p>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-4xl font-bold text-white">
                      {farmProjects.filter(item => item.type === 'livestock').length}
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <a href="#" className="text-sm font-medium text-white hover:underline">View livestock</a>
                </div>
              </div>
            </Card>

            {/* Total Investment - Deep Magenta */}
              <Card className="bg-[#921573] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                {/* Leaf Pattern Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex flex-col h-full relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                  <p className="text-sm font-medium text-white">Total Investment</p>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-4xl font-bold text-white">
                      GHS {farmProjects.reduce((sum, item) => sum + item.investment, 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <a href="#" className="text-sm font-medium text-white hover:underline">View investment</a>
                </div>
              </div>
            </Card>
            </div>

            {/* Farm Journey Section - Only for farmers and growers */}
            {(userType === 'farmer' || userType === 'grower') && (
              <Card className={`mb-8 transition-colors ${darkMode ? 'bg-[#002f37] border border-gray-700' : 'bg-white border border-gray-200'} shadow-md`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={`flex items-center gap-2 text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Leaf className={`h-6 w-6 ${darkMode ? 'text-[#7ede56]' : 'text-[#0b8a62]'}`} />
                        Your Farm Journey
                      </CardTitle>
                      <CardDescription className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Track every activity in your farming journey. Click on any stage to record detailed activities, dates, resources used, and observations from planning through harvest.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select value={farmStage} onValueChange={setFarmStage}>
                        <SelectTrigger className={`h-10 w-48 border-2 border-[#7ede56] ${darkMode ? 'bg-[#002f37] text-white border-gray-600' : 'bg-white'}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                          <SelectItem value="planning" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Planning</SelectItem>
                          <SelectItem value="planting" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Planting</SelectItem>
                          <SelectItem value="growing" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Growing</SelectItem>
                          <SelectItem value="harvesting" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Harvesting</SelectItem>
                          <SelectItem value="maintenance" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Maintenance</SelectItem>
                          <SelectItem value="other" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={() => {
                          console.log('Farm stage updated:', farmStage);
                        }}
                        className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                      >
                        Update Current Stage
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Roadmap Timeline */}
                  <div className="relative mt-6">
                    {/* Progress Line */}
                    <div className={`absolute top-6 left-0 right-0 h-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className="h-1 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${((['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].indexOf(farmStage) + 1) / 6) * 100}%`,
                          background: `linear-gradient(to right, rgba(126, 222, 86, 0.9), rgba(126, 222, 86, 0.6))`
                        }}
                      ></div>
                    </div>

                    {/* Stages */}
                    <div className="relative flex justify-between items-start mb-8">
                      {['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].map((stage, index) => {
                        const currentIndex = ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].indexOf(farmStage);
                        const isCompleted = index < currentIndex || stageDetails[stage].status === 'completed';
                        const isCurrent = index === currentIndex;
                        const isUpcoming = index > currentIndex && stageDetails[stage].status !== 'completed';
                        const stageColor = getStageColor(stage);
                        const stageActivities = stageDetails[stage]?.activities || [];

                        return (
                          <div key={stage} className="flex flex-col items-center flex-1">
                            {/* Stage Circle - Clickable */}
                            <button
                              onClick={() => handleEditStage(stage)}
                              className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 ${
                                isCompleted 
                                  ? 'shadow-lg' 
                                  : isCurrent 
                                  ? 'shadow-lg'
                                  : `${darkMode ? 'bg-gray-800 border border-gray-600 text-gray-200' : 'bg-gray-100 border border-gray-300 text-gray-600'} hover:border-opacity-60`
                              }`}
                              style={{
                                backgroundColor: isCompleted || isCurrent ? stageColor.bg : undefined,
                                color: '#ffffff',
                                boxShadow: isCompleted || isCurrent 
                                  ? `0 10px 15px -3px ${stageColor.bg}50, 0 4px 6px -2px ${stageColor.bg}50${isCurrent ? `, 0 0 0 4px ${stageColor.bg}30` : ''}` 
                                  : undefined,
                                borderColor: !isCompleted && !isCurrent ? (darkMode ? '#4b5563' : stageColor.bg) : undefined
                              }}
                              title={`Click to ${isCompleted ? 'view' : 'add/update'} ${stage} details`}
                            >
                              {isUpcoming ? (
                                <div className={`w-4 h-4 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                              ) : (
                                getStageIcon(stage, isCompleted, isCurrent)
                              )}
                            </button>

                            {/* Stage Label */}
                            <div className="mt-3 text-center">
                              <p className={`text-sm font-semibold ${
                                isCurrent 
                                  ? 'text-[#7ede56]' 
                                  : isCompleted 
                                  ? darkMode ? 'text-[#d9f4dd]' : 'text-[#0f5132]' 
                                  : darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {stage.charAt(0).toUpperCase() + stage.slice(1)}
                              </p>
                              {isCurrent && (
                                <p className="text-xs text-[#7ede56] font-medium mt-1">Current Stage</p>
                              )}
                            </div>

                            {/* Activities Summary */}
                            <div className={`mt-3 w-full px-3 py-2 rounded-lg text-xs ${darkMode ? 'bg-[#0f3a40]' : 'bg-gray-50'}`}>
                              {stageActivities.length > 0 ? (
                                <div className="space-y-1">
                                  {stageActivities.slice(0, 3).map((activity, activityIndex) => {
                                    const label = getActivityLabel(activity);
                                    return (
                                      <div key={activityIndex} className={`flex items-center gap-2 ${darkMode ? 'text-[#d4f5d7]' : 'text-[#1f5133]'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-[#7ede56]' : 'bg-[#3a9258]'}`}></div>
                                        <span className="truncate">{label}</span>
                                      </div>
                                    );
                                  })}
                                  {stageActivities.length > 3 && (
                                    <p className={`text-[11px] italic ${darkMode ? 'text-[#a3d6aa]' : 'text-[#3f6b45]'}`}>
                                      + {stageActivities.length - 3} more updates
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className={`${darkMode ? 'text-[#7aa9af]' : 'text-gray-500'} italic`}>
                                  No activities recorded yet
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Activities Display by Stage - Collapsible */}
                    <div className="mt-8 space-y-4">
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stage Activities</h3>
                      {['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].map((stage) => {
                        const stageActivities = stageDetails[stage]?.activities || [];
                        const stageColor = getStageColor(stage);
                        const currentIndex = ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].indexOf(farmStage);
                        const stageIndex = ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].indexOf(stage);
                        const isCompleted = stageIndex < currentIndex || stageDetails[stage].status === 'completed';
                        const isCurrent = stageIndex === currentIndex;
                        const isUpcoming = stageIndex > currentIndex && stageDetails[stage].status !== 'completed';
                        const isExpanded = expandedStages[stage] || false;

                        if (stageActivities.length === 0 && !isCurrent && !isCompleted) {
                          return null;
                        }

                        return (
                          <div 
                            key={stage} 
                            className={`rounded-lg border transition-all duration-200 ${
                              darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
                            } ${isExpanded ? 'shadow-md' : ''}`}
                          >
                            {/* Stage Header - Clickable to Expand/Collapse */}
                            <button
                              onClick={() => toggleStageExpansion(stage)}
                              className={`w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-colors ${
                                darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: stageColor.bg }}
                                ></div>
                                <div className="flex items-center gap-2">
                                  <h4 
                                    className={`font-semibold text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}
                                    style={{ color: isCurrent || isCompleted ? (darkMode ? stageColor.textOnDark : stageColor.textOnLight) : undefined }}
                                  >
                                    {stage.charAt(0).toUpperCase() + stage.slice(1)} Stage
                                  </h4>
                                  {isCurrent && (
                                    <Badge className="bg-[#7ede56] text-white text-xs">Current</Badge>
                                  )}
                                  {isCompleted && (
                                    <Badge className="bg-green-500 text-white text-xs">Completed</Badge>
                                  )}
                                  {stageActivities.length > 0 && (
                                    <Badge variant="outline" className={`text-xs ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}`}>
                                      {stageActivities.length} {stageActivities.length === 1 ? 'activity' : 'activities'}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditStage(stage);
                                  }}
                                  className={`text-xs ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  {stageActivities.length > 0 ? 'Edit' : 'Add'}
                                </Button>
                                {isExpanded ? (
                                  <ChevronUp className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                ) : (
                                  <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                )}
                              </div>
                            </button>

                            {/* Collapsible Content */}
                            {isExpanded && (
                              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                {stageActivities.length > 0 ? (
                                  <div className="space-y-2">
                                    {stageActivities.map((activity, activityIndex) => {
                                      const label = getActivityLabel(activity);
                                      const activityId = typeof activity === 'string' ? `${stage}-activity-${activityIndex}` : activity.id ?? `${stage}-activity-${activityIndex}`;
                                      const activityDate = typeof activity === 'string' || !activity.date ? null : new Date(activity.date).toLocaleDateString();
                                      const activityDescription = typeof activity === 'string' ? null : activity.description;
                                      const activityResources = typeof activity === 'string' ? null : activity.resources;
                                      return (
                                        <div 
                                          key={activityId}
                                          className={`p-3 rounded-md ${darkMode ? 'bg-gray-800/50' : 'bg-white'} border-l-4 transition-all hover:shadow-sm`}
                                          style={{ borderLeftColor: stageColor.bg }}
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-1">
                                                {activityDate && (
                                                  <>
                                                    <Calendar className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                      {activityDate}
                                                    </span>
                                                  </>
                                                )}
                                                <Badge 
                                                  className="text-xs"
                                                  style={{ backgroundColor: stageColor.bg, color: 'white' }}
                                                >
                                                  {label}
                                                </Badge>
                                              </div>
                                              {activityDescription && (
                                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                  {activityDescription}
                                                </p>
                                              )}
                                              {activityResources && (
                                                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                  <span className="font-medium">Resources:</span> {activityResources}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className={`text-center py-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm mb-3">No activities recorded yet</p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditStage(stage)}
                                      className="text-xs"
                                      style={{ borderColor: stageColor.bg, color: darkMode ? stageColor.textOnDark : stageColor.textOnLight }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add First Activity
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create Farm Project Button */}
            {(userType === 'farmer' || userType === 'grower') && (
              <div className="mb-6">
                <Button 
                  onClick={() => setShowCreateProjectDialog(true)}
                  className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Farm Project
                </Button>
              </div>
            )}

            {/* Farm Projects List */}
            {farmProjects.length > 0 ? (
            <div className="space-y-4">
                {farmProjects.map((project) => (
                  <Card key={project.id} className={`hover:shadow-md transition-shadow ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                              {getTypeIcon(project.type)}
                              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.name}</h3>
                      </div>
                      <Badge variant="outline" className={darkMode ? 'border-gray-700 text-gray-300' : ''}>
                              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                            </Badge>
                            <Badge className="bg-[#7ede56] text-white">
                              {project.currentStage.charAt(0).toUpperCase() + project.currentStage.slice(1)}
                      </Badge>
                    </div>
                    
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</p>
                              <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.category}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Area/Quantity</p>
                              <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.area}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investment</p>
                              <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>GHS {project.investment.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-6 text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-2">
                        <Calendar className={`h-4 w-4 ${darkMode ? 'text-gray-500' : ''}`} />
                              <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                          {project.description && (
                            <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-medium">Description:</span> {project.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                            onClick={() => {
                              setFarmStage(project.currentStage);
                              // Navigate to project details or open journey tracking
                            }}
                      className={`flex items-center gap-2 ${outlineButtonClasses}`}
                    >
                      <Eye className="h-4 w-4" />
                            View Journey
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                            onClick={() => {
                              // Handle delete project
                              setFarmProjects(farmProjects.filter(p => p.id !== project.id));
                            }}
                      className={`flex items-center gap-2 ${darkMode ? 'border-gray-700 text-red-400 hover:bg-gray-800 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
              ))}
              </div>
            ) : (
              <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
              <CardContent className="p-12 text-center">
                <Leaf className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No farm projects yet</h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create your first farm project to start tracking your farming journey from planning to harvest
                </p>
                  <Button 
                    onClick={() => setShowCreateProjectDialog(true)}
                    className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Farm Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Stage Details Dialog - Enhanced with Activity Tracking */}
      <Dialog open={showStageDialog} onOpenChange={setShowStageDialog}>
        <DialogContent className={`${darkMode ? 'bg-[#002f37] border-gray-600' : ''} max-w-4xl max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? 'text-white' : ''}>
              {selectedStage ? `${selectedStage.charAt(0).toUpperCase() + selectedStage.slice(1)} Stage - Track Your Activities` : 'Stage Details'}
            </DialogTitle>
            <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
              Record all activities, dates, and details for this stage. Track everything you do from planning to harvest.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Stage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stage-date" className={darkMode ? 'text-gray-300' : ''}>
                  Stage Start Date
                </Label>
                <Input
                  id="stage-date"
                  type="date"
                  value={selectedStage ? stageDetails[selectedStage]?.date || '' : ''}
                  onChange={(e) => {
                    if (selectedStage) {
                      setStageDetails({
                        ...stageDetails,
                        [selectedStage]: {
                          ...stageDetails[selectedStage],
                          date: e.target.value
                        }
                      });
                    }
                  }}
                  className={darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}
                />
              </div>
              <div>
                <Label htmlFor="stage-status" className={darkMode ? 'text-gray-300' : ''}>Status</Label>
                <Select
                  value={selectedStage ? stageDetails[selectedStage]?.status || 'pending' : 'pending'}
                  onValueChange={(value) => {
                    if (selectedStage) {
                      setStageDetails({
                        ...stageDetails,
                        [selectedStage]: {
                          ...stageDetails[selectedStage],
                          status: value
                        }
                      });
                    }
                  }}
                >
                  <SelectTrigger className={darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                    <SelectItem value="pending" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Pending</SelectItem>
                    <SelectItem value="in-progress" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>In Progress</SelectItem>
                    <SelectItem value="completed" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Activities Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : ''}`}>Activities Log</h3>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedStage && stageDetails[selectedStage]?.activities?.length || 0} activities recorded
                </span>
              </div>

              {/* Add New Activity Form */}
              <Card className={`mb-4 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="activity-date" className={darkMode ? 'text-gray-300' : ''}>Activity Date *</Label>
                      <Input
                        id="activity-date"
                        type="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                        className={darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="activity-name" className={darkMode ? 'text-gray-300' : ''}>Activity Name *</Label>
                      <Input
                        id="activity-name"
                        placeholder={selectedStage === 'planning' ? 'e.g., Land preparation, Budget planning' : selectedStage === 'planting' ? 'e.g., Seed sowing, Transplanting' : selectedStage === 'growing' ? 'e.g., Fertilizer application, Irrigation' : selectedStage === 'harvesting' ? 'e.g., First harvest, Sorting' : 'e.g., Equipment maintenance'}
                        value={newActivity.activity}
                        onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
                        className={darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="activity-description" className={darkMode ? 'text-gray-300' : ''}>Description</Label>
                      <Textarea
                        id="activity-description"
                        placeholder="Describe what you did, quantities, methods, observations, etc."
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        rows={3}
                        className={darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="activity-resources" className={darkMode ? 'text-gray-300' : ''}>Resources Used (Optional)</Label>
                      <Input
                        id="activity-resources"
                        placeholder="e.g., 50kg fertilizer, 200L water, 2 workers"
                        value={newActivity.resources}
                        onChange={(e) => setNewActivity({ ...newActivity, resources: e.target.value })}
                        className={darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddActivity}
                    disabled={!newActivity.date || !newActivity.activity}
                    className="mt-4 bg-[#7ede56] hover:bg-[#6bc947] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
              </CardContent>
            </Card>

              {/* Activities List */}
              {selectedStage && stageDetails[selectedStage]?.activities && stageDetails[selectedStage].activities.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stageDetails[selectedStage].activities.map((activity) => (
                    <Card key={activity.id} className={darkMode ? 'bg-gray-800/50 border-gray-700' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Calendar className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                              <span className={`font-semibold ${darkMode ? 'text-white' : ''}`}>
                                {new Date(activity.date).toLocaleDateString()}
                              </span>
                              <Badge className="bg-[#7ede56] text-white">{activity.activity}</Badge>
                            </div>
                            {activity.description && (
                              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {activity.description}
                              </p>
                            )}
                            {activity.resources && (
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="font-medium">Resources:</span> {activity.resources}
                              </p>
              )}
            </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteActivity(activity.id)}
                            className={darkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
          </div>
                      </CardContent>
                    </Card>
                  ))}
        </div>
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No activities recorded yet. Add your first activity above.</p>
      </div>
              )}
            </div>

            {/* General Notes */}
            <div className="border-t pt-4">
              <Label htmlFor="stage-notes" className={darkMode ? 'text-gray-300' : ''}>General Notes</Label>
              <Textarea
                id="stage-notes"
                placeholder="Add any additional notes, observations, challenges, or achievements for this stage..."
                value={selectedStage ? stageDetails[selectedStage]?.notes || '' : ''}
                onChange={(e) => {
                  if (selectedStage) {
                    setStageDetails({
                      ...stageDetails,
                      [selectedStage]: {
                        ...stageDetails[selectedStage],
                        notes: e.target.value
                      }
                    });
                  }
                }}
                rows={4}
                className={darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStageDialog(false)}
              className={darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' : ''}
            >
              Close
            </Button>
            <Button
              onClick={handleSaveStageDetails}
              className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
            >
              Save All Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Farm Project Dialog - Enhanced */}
      <Dialog open={showCreateProjectDialog} onOpenChange={setShowCreateProjectDialog}>
        <DialogContent className={`${darkMode ? 'bg-[#002f37] border-gray-600' : ''} max-w-4xl max-h-[85vh] overflow-y-auto`}>
          <DialogHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-[#7ede56]/20' : 'bg-[#7ede56]/10'}`}>
                <Leaf className={`h-5 w-5 ${darkMode ? 'text-[#7ede56]' : 'text-[#6bc947]'}`} />
              </div>
              <div>
                <DialogTitle className={`text-xl ${darkMode ? 'text-white' : ''}`}>Create New Farm Project</DialogTitle>
                <DialogDescription className={`text-sm ${darkMode ? 'text-gray-400' : ''}`}>
                  Start tracking your farming journey from planning to harvest
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Project Name & Type */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="project-name" className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                  <span className="text-red-500">*</span>
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  placeholder="e.g., Cocoa Plantation 2024"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''} h-10 text-sm`}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="project-type" className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                  <span className="text-red-500">*</span>
                  Project Type
                </Label>
                <Select value={newProject.type} onValueChange={(value) => setNewProject({ ...newProject, type: value })}>
                  <SelectTrigger className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''} h-10 text-sm`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                    <SelectItem value="crop" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        <span>Crop</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="livestock" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span>Livestock</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mixed" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Mixed</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="project-category" className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                  <span className="text-red-500">*</span>
                  Category
                </Label>
                <Input
                  id="project-category"
                  placeholder="e.g., Cocoa, Maize, Poultry"
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''} h-10 text-sm`}
                />
              </div>
            </div>

            {/* Area, Investment & Start Date */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="project-area" className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                  <span className="text-red-500">*</span>
                  Area/Quantity
                </Label>
                <Input
                  id="project-area"
                  placeholder="e.g., 2.5 acres, 200 birds"
                  value={newProject.area}
                  onChange={(e) => setNewProject({ ...newProject, area: e.target.value })}
                  className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''} h-10 text-sm`}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="project-investment" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                  Initial Investment (GHS)
                </Label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>₵</span>
                  <Input
                    id="project-investment"
                    type="number"
                    placeholder="15000"
                    value={newProject.investment}
                    onChange={(e) => setNewProject({ ...newProject, investment: e.target.value })}
                    className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''} h-10 pl-8 text-sm`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="project-start-date" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                  Start Date
                </Label>
                <Input
                  id="project-start-date"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''} h-10 text-sm`}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="project-description" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                Project Description
              </Label>
              <Textarea
                id="project-description"
                placeholder="Provide a brief overview of the project goals, expected outcomes, and key activities."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={4}
                className={`${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}`}
              />
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowCreateProjectDialog(false)}
                className={darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' : ''}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmManagement;