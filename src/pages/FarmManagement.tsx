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
import DashboardLayout from '@/components/DashboardLayout';
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
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const FarmManagement = () => {
  const { darkMode } = useDarkMode();
  const { userType } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [farmStage, setFarmStage] = useState<string>('planning'); // Global current stage
  const [activeStageTab, setActiveStageTab] = useState<string>('planning'); // Currently viewed tab
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
    status: string;
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
      currentStage: 'growing',
      status: 'active'
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
      currentStage: 'growing',
      status: 'active'
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
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('farm-management');
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
      // Mobile sidebar state is managed by DashboardLayout
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
      currentStage: 'planning',
      status: 'active'
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
    switch (stage) {
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



  return (
    <DashboardLayout
      activeSidebarItem="farm-management"
      title="Farm Management"
      subtitle="Manage your crops and livestock"
    >
      <div className="w-full">
        {/* Stats Cards - Matching Main Dashboard Style */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
          {/* Total Items - Green */}
          <Card className="hover:shadow-md transition-shadow bg-[#7ede56] border-none">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Total Items</span>
                <span className="text-xl sm:text-2xl font-bold text-white">{farmProjects.length}</span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Crops - Orange */}
          <Card className="hover:shadow-md transition-shadow bg-[#ffa500] border-none">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Crops</span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {farmProjects.filter(p => p.type === 'crop').length}
                </span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Livestock - Blue */}
          <Card className="hover:shadow-md transition-shadow bg-[#3b82f6] border-none">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Livestock</span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {farmProjects.filter(p => p.type === 'livestock').length}
                </span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Equipment - Purple */}
          <Card className="hover:shadow-md transition-shadow bg-[#9333ea] border-none">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Equipment</span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {farmProjects.filter(p => p.type === 'equipment').length}
                </span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Total Investment - Pink/Magenta */}
          <Card className="hover:shadow-md transition-shadow bg-[#921573] border-none overflow-hidden">
            <CardContent className="p-3 sm:p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                <span className="text-[10px] sm:text-xs font-medium text-white/90">Investment</span>
                <span className="text-lg sm:text-2xl font-bold text-white truncate">
                  ₵{farmProjects.reduce((sum, item) => sum + item.investment, 0).toLocaleString()}
                </span>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Stage Activities Section (Tabbed) */}
        {
          (userType === 'farmer' || userType === 'grower') && (
            <Card className={`mb-8 transition-colors ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white border-gray-200'} shadow-md`}>
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <CardTitle className={`flex items-center gap-2 text-lg sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Leaf className={`h-5 w-5 sm:h-6 sm:w-6 ${darkMode ? 'text-[#7ede56]' : 'text-[#0b8a62]'}`} />
                      Stage Activities
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Manage activities for each stage of your farming cycle
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowCreateProjectDialog(true)}
                    className="bg-[#7ede56] hover:bg-[#6bc947] text-white w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2 !text-white" />
                    <span className="!text-white">Create Project</span>
                  </Button>
                </div>

                {/* Horizontal Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].map((stage) => {
                    const isActive = activeStageTab === stage;
                    const isCurrentStage = farmStage === stage;

                    return (
                      <button
                        key={stage}
                        onClick={() => setActiveStageTab(stage)}
                        className={`
                              relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 
                              ${isActive
                            ? 'border-[#7ede56] text-[#7ede56]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          }
                            `}
                      >
                        <span className="flex items-center gap-2">
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}
                          {isCurrentStage && (
                            <Badge className="h-5 px-1.5 bg-[#7ede56] text-white text-[10px]">Current</Badge>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent className="pt-6 min-h-[300px]">
                {/* Active Stage Content */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activeStageTab.charAt(0).toUpperCase() + activeStageTab.slice(1)} Activities
                      </h3>
                      {farmStage === activeStageTab ? (
                        <Badge className="bg-[#7ede56] text-white text-[10px] sm:text-xs">Current</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFarmStage(activeStageTab)}
                          className={`h-7 px-2 text-[10px] sm:text-xs ${darkMode ? 'border-[#7ede56] text-[#7ede56] hover:bg-[#7ede56]/10' : 'border-[#7ede56] text-[#0b8a62] hover:bg-[#7ede56]/10'}`}
                        >
                          Set as Current
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditStage(activeStageTab)}
                      className={`w-full sm:w-auto text-xs sm:text-sm ${darkMode ? 'border-gray-600 text-[#7ede56] hover:text-[#7ede56] hover:bg-[#7ede56]/10' : ''}`}
                    >
                      <Edit className="h-3.5 w-3.5 mr-2" />
                      Manage Activities
                    </Button>
                  </div>

                  {stageDetails[activeStageTab]?.activities && stageDetails[activeStageTab].activities.length > 0 ? (
                    <div className="space-y-3">
                      {stageDetails[activeStageTab].activities.map((activity: any, index: number) => {
                        const activityId = typeof activity === 'string' ? `${activeStageTab}-activity-${index}` : activity.id ?? `${activeStageTab}-activity-${index}`;
                        const activityDate = typeof activity === 'string' || !activity.date ? null : new Date(activity.date).toLocaleDateString();
                        const activityDescription = typeof activity === 'string' ? null : activity.description;
                        const label = getActivityLabel(activity);

                        return (
                          <div
                            key={activityId}
                            className={`p-4 rounded-lg border-l-4 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                            style={{ borderLeftColor: getStageColor(activeStageTab).bg }}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge
                                    className="text-xs"
                                    style={{ backgroundColor: getStageColor(activeStageTab).bg, color: 'white' }}
                                  >
                                    {label}
                                  </Badge>
                                  {activityDate && (
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {activityDate}
                                    </span>
                                  )}
                                </div>
                                {activityDescription && (
                                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {activityDescription}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`text-center py-12 border-2 border-dashed rounded-xl ${darkMode ? 'border-gray-700 bg-gray-800/20' : 'border-gray-200 bg-gray-50'}`}>
                      <Activity className={`h-12 w-12 mx-auto mb-3 opacity-20 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                      <p className={`text-base font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No activities yet</p>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        There are no activities recorded for the {activeStageTab} stage.
                      </p>
                      <Button
                        onClick={() => handleEditStage(activeStageTab)}
                        className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        }



        {/* Farm Projects List */}
        {
          farmProjects.length > 0 ? (
            <div className="space-y-4">
              {farmProjects.map((project) => (
                <Card key={project.id} className={`hover:shadow-md transition-shadow ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex-1 w-full min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(project.type)}
                            <h3 className={`text-lg sm:text-xl font-semibold truncate max-w-[150px] sm:max-w-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={`text-[10px] sm:text-xs ${darkMode ? 'border-gray-700 text-gray-300' : ''}`}>
                              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                            </Badge>
                            <Badge className="bg-[#7ede56] text-white text-[10px] sm:text-xs">
                              {project.currentStage.charAt(0).toUpperCase() + project.currentStage.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                          <div>
                            <p className={`text-[10px] sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</p>
                            <p className={`text-xs sm:text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.category}</p>
                          </div>
                          <div>
                            <p className={`text-[10px] sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Area/Qty</p>
                            <p className={`text-xs sm:text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.area}</p>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <p className={`text-[10px] sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investment</p>
                            <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₵{project.investment.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className={`flex items-center gap-4 text-[10px] sm:text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {project.description && (
                          <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2 sm:line-clamp-none`}>
                              <span className="font-medium">Description:</span> {project.description}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFarmStage(project.currentStage);
                          }}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 text-xs sm:text-sm ${outlineButtonClasses}`}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="inline sm:hidden lg:inline">Journey</span>
                          <span className="hidden sm:inline lg:hidden">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFarmProjects(farmProjects.filter(p => p.id !== project.id));
                          }}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 text-xs sm:text-sm ${darkMode ? 'border-gray-700 text-red-400 hover:bg-gray-800 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
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
          )
        }
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stage-date" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
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
                  className={`mt-1.5 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}`}
                />
              </div>
              <div>
                <Label htmlFor="stage-status" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>Status</Label>
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
                  <SelectTrigger className={`mt-1.5 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}`}>
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
          <DialogFooter className="flex flex-row sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStageDialog(false)}
              className={`flex-1 sm:flex-none ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' : ''}`}
            >
              Close
            </Button>
            <Button
              onClick={handleSaveStageDetails}
              className="flex-1 sm:flex-none bg-[#7ede56] hover:bg-[#6bc947] text-white"
            >
              Save Details
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
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
            <div className="flex flex-row sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowCreateProjectDialog(false)}
                className={`flex-1 sm:flex-none ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' : ''}`}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                className="flex-1 sm:flex-none bg-[#7ede56] hover:bg-[#6bc947] text-white"
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FarmManagement;
