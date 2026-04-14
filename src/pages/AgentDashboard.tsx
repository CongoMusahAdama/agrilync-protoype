import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentLayout from './agent/AgentLayout';
import AddFarmerModal from '@/components/agent/AddFarmerModal';
import ViewFarmerModal from '@/components/agent/ViewFarmerModal';
import ViewMatchModal from '@/components/agent/ViewMatchModal';
import ReviewMatchModal from '@/components/agent/ReviewMatchModal';
import ViewDisputeModal from '@/components/agent/ViewDisputeModal';
import ViewVisitDetailsModal from '@/components/agent/ViewVisitDetailsModal';
import VerificationQueueModal from '@/components/agent/VerificationQueueModal';
import UploadReportModal from '@/components/agent/UploadReportModal';
import ScheduleVisitModal from '@/components/agent/ScheduleVisitModal';
import { TrainingPerformanceContent } from './agent/TrainingPerformance';
import { TasksDashboardContent } from './agent/TasksDashboard';
import { Button } from '@/components/ui/button';
import BulkSmsModal from '@/components/agent/BulkSmsModal';
import ActiveFarmsModal from '@/components/agent/ActiveFarmsModal';
import MediaUploadModal from '@/components/agent/MediaUploadModal';
import FarmJourneyModal from '@/components/agent/FarmJourneyModal';
import OperationalMap from '@/components/agent/OperationalMap';
import AddFieldModal from '@/components/agent/AddFieldModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Trigger reload
import {
  Users,
  Sprout,
  Handshake,
  Calendar,
  FileText,
  AlertTriangle,
  Bell,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  Edit,
  Flag,
  Plus,
  Leaf,
  AlertCircle,
  ArrowUpRight,
  Check,
  Info,
  UserCheck,
  DollarSign,
  TrendingUp,
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  ClipboardList,
  Image as ImageIcon,
  LineChart,
  MapPin,
  Clock,
  Activity,
  GraduationCap,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Download,
  Star,
  MessageSquare,
  FileDown,
  Bot,
  RefreshCw,
  PhoneCall,
  ChevronDown,
  Send
} from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import {
  GHANA_COORDS,
  STATUS_STYLES,
  DASHBOARD_CACHE_STALE_TIME,
  DASHBOARD_CACHE_GC_TIME
} from '@/data/dashboardConfig';

// Modular Tab Components
import OverviewTab from './agent/dashboard/OverviewTab';
import FarmsTab from './agent/dashboard/FarmsTab';
import VisitsTab from './agent/dashboard/VisitsTab';
import MediaTab from './agent/dashboard/MediaTab';
import ReportsTab from './agent/dashboard/ReportsTab';

import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import Preloader from '@/components/ui/Preloader';
import { useDebounce } from '@/hooks/useDebounce';

const MetricCardSkeleton = () => (
  <Card className="bg-gray-800/50 h-40 rounded-none border-none p-3 sm:p-6 shadow-lg animate-pulse">
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 bg-gray-700" />
        <Skeleton className="h-4 w-24 bg-gray-700" />
      </div>
      <div className="flex-1 flex items-center">
        <Skeleton className="h-10 w-16 bg-gray-700" />
      </div>
      <div className="flex justify-end mt-4">
        <Skeleton className="h-3 w-12 bg-gray-700" />
      </div>
    </div>
  </Card>
);

const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { agent } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL if it changes with whitelisting for security
  useEffect(() => {
    const allowedTabs = ['overview', 'farms', 'visits', 'media', 'quick-reports', 'operational-map', 'performance'];
    const tabFromUrl = queryParams.get('tab');
    if (tabFromUrl && allowedTabs.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search, activeTab, queryParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/agent?tab=${tab}`);
  };
  const [farmerSearch, setFarmerSearch] = useState('');
  const debouncedFarmerSearch = useDebounce(farmerSearch, 300);
  const [farmerStatusFilter, setFarmerStatusFilter] = useState<'all' | 'Completed' | 'Pending' | 'inactive'>('all');
  const [farmStatusFilter, setFarmStatusFilter] = useState<'all' | 'verified' | 'scheduled' | 'needs-attention'>('all');
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // New state for matches and disputes
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [viewMatchModalOpen, setViewMatchModalOpen] = useState(false);
  const [reviewMatchModalOpen, setReviewMatchModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [viewDisputeModalOpen, setViewDisputeModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [viewVisitModalOpen, setViewVisitModalOpen] = useState(false);
  const [isVerificationQueueModalOpen, setIsVerificationQueueModalOpen] = useState(false);
  const [isActiveFarmsModalOpen, setIsActiveFarmsModalOpen] = useState(false);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [isUploadReportModalOpen, setIsUploadReportModalOpen] = useState(false);
  const [isBulkSmsModalOpen, setIsBulkSmsModalOpen] = useState(false);
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [logVisitModalOpen, setLogVisitModalOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [finalizedFarmer, setFinalizedFarmer] = useState<any>(null);
  const [topCardIndex, setTopCardIndex] = useState(0);
  const topSwipeRef = React.useRef<HTMLDivElement>(null);

  // useQuery for all-in-one dashboard data with optimized caching
  // New state for matches and disputes
  const [activeMetric, setActiveMetric] = useState('onboarding');

  const { data: summaryData, isLoading: loading, isFetching, refetch: refreshData } = useQuery({
    queryKey: ['agentDashboardSummary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary');
      return response.data.data;
    },
    staleTime: DASHBOARD_CACHE_STALE_TIME,
    refetchOnReconnect: true,
    refetchInterval: 5000, // Real-time background refresh
  });

  // Fetch scheduled visits for the summary card
  const { data: scheduledVisitsData = [] } = useQuery({
    queryKey: ['scheduledVisits'],
    queryFn: async () => {
      const response = await api.get('/scheduled-visits');
      const resData = response.data;
      return Array.isArray(resData) ? resData : (resData?.data || []);
    },
    staleTime: 0,
    refetchInterval: 5000,
  });

  // Fetch upcoming tasks for real-time missions
  const { data: tasksData = [] } = useQuery({
    queryKey: ['agentTasksDashboard'],
    queryFn: async () => {
      const response = await api.get('/tasks');
      const resData = response.data?.data || response.data || [];
      return Array.isArray(resData) ? resData : [];
    },
    staleTime: 0,
    refetchInterval: 5000,
  });

  const scheduledVisits = useMemo(() => {
    // Combine visits and tasks into a unified "Missions" list
    const combined = [
      ...scheduledVisitsData.map((v: any) => ({
        ...v,
        type: 'visit',
        displayTitle: v.purpose || 'Field Visit',
        displayStatus: v.status || 'Scheduled',
        displayTime: v.scheduledTime || '09:00',
        displaySubtext: v.community || 'On-site mission'
      })),
      ...tasksData.filter((t: any) => t.status !== 'done').map((t: any) => ({
        ...t,
        type: 'task',
        farmerName: t.farmer || 'General Task',
        displayTitle: t.title || 'Upcoming Task',
        displayStatus: t.status === 'pending' ? 'Scheduled' : 'In-Progress',
        displayTime: t.startTime || '09:00',
        displaySubtext: t.location || 'Operation start'
      }))
    ];
    
    // Sort by time or creation (most recent/upcoming first)
    return combined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [scheduledVisitsData, tasksData]);

  // Fetch Media Items for the archive tab
  const { data: mediaItems = [] } = useQuery({
    queryKey: ['mediaItems'],
    queryFn: async () => {
      try {
        const res = await api.get('/media');
        return Array.isArray(res.data) ? res.data : (res.data.data || []);
      } catch (err) {
        console.error('Error fetching media:', err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const agentCoords = GHANA_COORDS[agent?.region || 'Ashanti Region'] || GHANA_COORDS['Ashanti Region'];

  // Real-time weather via Open-Meteo (free, no API key)
  const { data: weatherData } = useQuery({
    queryKey: ['weather', agentCoords.lat, agentCoords.lng],
    queryFn: async () => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${agentCoords.lat}&longitude=${agentCoords.lng}&current=weather_code,temperature_2m,precipitation&timezone=Africa%2FAccra`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather fetch failed');
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // refresh every 10 mins
    retry: 1,
  });

  // WMO weather code → human-readable label + emoji
  const getWeatherInfo = (code: number | undefined, precip: number | undefined) => {
    if (code === undefined) return null;
    const isRainingNow = (precip ?? 0) > 0;
    if (code === 0) return { emoji: '☀️', label: 'Clear skies. Great day for field visits!', color: 'text-amber-500' };
    if (code <= 2) return { emoji: '⛅', label: 'Partly cloudy conditions.', color: 'text-sky-500' };
    if (code === 3) return { emoji: '☁️', label: 'Overcast skies today.', color: 'text-gray-500' };
    if (code <= 49) return { emoji: '🌫️', label: 'Foggy conditions. Drive carefully.', color: 'text-gray-400' };
    if (code <= 69 || isRainingNow) return { emoji: '🌧️', label: 'It\'s raining. Please plan your field visits carefully!', color: 'text-blue-600' };
    if (code <= 79) return { emoji: '🌨️', label: 'Sleet or snow conditions detected.', color: 'text-blue-400' };
    if (code <= 84) return { emoji: '🌦️', label: 'Rain showers expected. Carry rain gear.', color: 'text-blue-500' };
    if (code <= 99) return { emoji: '⛈️', label: 'Thunderstorm warning! Avoid open fields.', color: 'text-red-500' };
    return { emoji: '🌡️', label: 'Checking weather...', color: 'text-gray-400' };
  };

  const currentWeather = weatherData?.current;
  const weatherInfo = getWeatherInfo(currentWeather?.weather_code, currentWeather?.precipitation);
  const weatherTemp = currentWeather?.temperature_2m;

  // Extract data from summary with fallbacks and filter by agent's region
  const stats = summaryData?.stats || {};
  const farmersRaw = summaryData?.farmers || [];
  const farmsRaw = summaryData?.farms || [];
  const notifications = summaryData?.notifications || [];
  const activitiesRaw = summaryData?.activities || [];
  const matchesRaw = summaryData?.matches || [];
  const disputesRaw = summaryData?.disputes || [];
  const pendingFarmersRaw = summaryData?.pendingQueue || [];

  const farmers = useMemo(() => {
    return farmersRaw;
  }, [farmersRaw]);

  const farms = useMemo(() => {
    return farmsRaw;
  }, [farmsRaw]);

  const activities = useMemo(() => {
    return activitiesRaw;
  }, [activitiesRaw]);

  const reportCount = stats.reportsThisMonth || 0;
  const reportGoal = 15;
  const reportProgress = Math.min(Math.round((reportCount / reportGoal) * 100), 100);

  const matches = useMemo(() => {
    return matchesRaw;
  }, [matchesRaw]);

  const disputes = useMemo(() => {
    return disputesRaw;
  }, [disputesRaw]);

  const pendingFarmers = useMemo(() => {
    const effectiveRegion = agent?.region || "Ashanti Region";
    const regSearch = (effectiveRegion || '').toLowerCase().replace(' region', '').trim();
    return pendingFarmersRaw.filter((f: any) => {
      const fReg = (f.region || '').toLowerCase().replace(' region', '').trim();
      return !regSearch || fReg === regSearch || fReg.includes(regSearch) || regSearch.includes(fReg);
    });
  }, [pendingFarmersRaw, agent?.region]);

  const fetchData = useCallback(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Notification State
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'alert' | 'update'>('all');

  const unreadNotifications = notifications.filter((n: any) => !n.read).length;

  const queryClient = useQueryClient();

  const handleMarkAllRead = async () => {
    queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
  };

  const toggleReadStatus = async (id: string, type?: string) => {
    try {
      await api.put(`/notifications/${id}`);
      queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });

      if (type === 'verification') {
        setActiveTab('farms');
        setFarmStatusFilter('all');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const filteredNotifications = notifications.filter((n: any) => {
    if (notificationFilter === 'all') return true;
    if (notificationFilter === 'alert') return n.type === 'alert' || n.priority === 'high';
    if (notificationFilter === 'update') return n.type !== 'alert' && n.priority !== 'high';
    return true;
  });

  const handleViewMatch = (match: any) => {
    setSelectedMatch(match);
    setViewMatchModalOpen(true);
  };

  const handleReviewMatch = (match: any) => {
    setSelectedMatch(match);
    setReviewMatchModalOpen(true);
  };

  const handleApproveMatch = useCallback(async (matchId: string) => {
    try {
      await api.post(`/matches/${matchId}/approve`);
      queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
      await Swal.fire({
        icon: 'success',
        title: 'Match Approved!',
        html: `
          <div style="text-align: center; padding: 10px 0;">
            <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
              Match approved successfully
            </p>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#065f46',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to approve match';
      Swal.fire({
        icon: 'error',
        title: 'Approval Failed',
        text: errorMessage,
        confirmButtonColor: '#065f46'
      });
    }
  }, [queryClient]);

  const handleRejectMatch = useCallback(async (matchId: string) => {
    try {
      await api.post(`/matches/${matchId}/reject`);
      queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
      await Swal.fire({
        icon: 'success',
        title: 'Match Rejected',
        html: `
          <div style="text-align: center; padding: 10px 0;">
            <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
              Match rejected successfully
            </p>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#065f46',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to reject match';
      Swal.fire({
        icon: 'error',
        title: 'Rejection Failed',
        text: errorMessage,
        confirmButtonColor: '#065f46'
      });
    }
  }, [queryClient]);

  const handleViewDispute = (dispute: any) => {
    setSelectedDispute(dispute);
    setViewDisputeModalOpen(true);
  };

  const handleViewVisit = (visit: any) => {
    setSelectedVisit(visit);
    setViewVisitModalOpen(true);
  };

  const handleFarmAction = (farm: any) => {
    setSelectedFarmer(farm);
    setViewModalOpen(true);
  };

  const handleViewFarmer = (farmer: any) => {
    setSelectedFarmer(farmer);
    setViewModalOpen(true);
  };

  const handleUploadReport = (farmer: any) => {
    setSelectedFarmer(farmer);
    setIsMediaUploadModalOpen(true);
  };

  const handleLogVisit = (farmer: any) => {
    setSelectedFarmer(farmer);
    setLogVisitModalOpen(true);
  };

  const handleAddField = (farmer: { _id?: string; id?: string; name?: string }) => {
    setSelectedFarmer(farmer);
    setIsAddFieldModalOpen(true);
  };

  const handleEditFarmer = async (farmer: any) => {
    try {
      const res = await api.get(`/farmers/${farmer._id}`);
      setSelectedFarmer(res.data);
      setEditModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching farmer data:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Data Load Warning',
        text: 'Failed to load full farmer data.',
        confirmButtonColor: '#065f46',
        timer: 3000
      });
      setSelectedFarmer(farmer);
      setEditModalOpen(true);
    }
  };

  const handleTrackJourney = (farmer: any) => {
    setSelectedFarmer(farmer);
    setIsJourneyModalOpen(true);
  };

  const handleHarvestTrackerClick = () => {
    Swal.fire({
      title: 'Feature Unavailable',
      text: "The Harvest Season Tracker is currently unavailable because farmers haven't started harvesting yet.",
      icon: 'info',
      confirmButtonColor: '#065f46',
      confirmButtonText: 'Got it!',
      background: darkMode ? '#0b2528' : '#fff',
      color: darkMode ? '#fff' : '#000',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-8 py-3'
      }
    });
  };

  const filteredFarmers = useMemo(() => {
    const searchValue = debouncedFarmerSearch.toLowerCase();
    return farmers.reduce((acc: any[], f: any) => {
      let displayStatus = f.status === 'active' ? 'Completed' : f.status === 'pending' ? 'Pending' : f.status;
      const matchesSearch = f.name?.toLowerCase().includes(searchValue) || (f.contact && f.contact.includes(searchValue));
      const matchesStatus = farmerStatusFilter === 'all' ? true : displayStatus === farmerStatusFilter;
      if (matchesSearch && matchesStatus) {
        acc.push({ ...f, displayStatus });
      }
      return acc;
    }, []);
  }, [farmers, debouncedFarmerSearch, farmerStatusFilter]);

  const filteredFarms = useMemo(() => {
    return farms.filter((farm: any) => {
      if (farmStatusFilter === 'all') return true;
      return farm.status === farmStatusFilter;
    });
  }, [farms, farmStatusFilter]);

  const highlightCards = useMemo(() => [
    {
      id: 'total-farms',
      title: 'Grower Impact',
      value: summaryData?.stats?.farmersOnboarded || stats.farmersOnboarded || 0,
      subtext: 'Farmers Empowered',
      color: 'bg-[#065f46]',
      icon: Users,
      image: '/lovable-uploads/metric.png',
    },
    {
      id: 'active-farms',
      title: 'Verified Farms',
      value: summaryData?.stats?.activeFarms || stats.activeFarms || 0,
      subtext: 'Active deliveries',
      color: 'bg-blue-600',
      icon: CheckCircle2,
      image: '/lovable-uploads/metric2.png',
    },
    {
      id: 'farms-at-risk',
      title: 'Farms at Risk',
      value: summaryData?.stats?.pendingDisputes || stats.pendingDisputes || 0,
      subtext: 'Critical attention',
      color: 'bg-rose-600',
      icon: AlertTriangle,
      image: '/lovable-uploads/metrci3.png',
    },
    {
      id: 'scheduled-visits',
      title: 'Scheduled Visits',
      value: scheduledVisits.length,
      subtext: 'Next 7 days',
      color: 'bg-orange-600',
      icon: Calendar,
      image: '/lovable-uploads/countryside-workers-together-field.jpg',
    }
  ], [summaryData, stats, scheduledVisits]);

  const getLocalizedGreeting = () => {
    const hour = new Date().getHours();
    const displayName = agent?.name || 'Agent';
    let timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return (
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2">
          {timeGreeting}, <span className="text-[#065f46]">{displayName}</span>
        </span>
        {weatherInfo && (
          <span className={`text-sm font-medium flex items-center gap-1.5 ${weatherInfo.color}`}>
            {weatherInfo.emoji} Weather Alert: {weatherInfo.label}
            {weatherTemp !== undefined && (
              <span className="text-xs font-bold ml-1 text-gray-400">({Math.round(weatherTemp)}°C)</span>
            )}
          </span>
        )}
      </div>
    );
  };

  const sectionCardClass = darkMode
    ? 'border border-[#124b53] bg-[#0b2528] text-gray-100 shadow-lg'
    : 'border-none bg-white text-gray-900 shadow-sm';

  return (
    <AgentLayout
      activeSection={activeTab === 'performance' ? 'performance' : 'dashboard'}
      title={activeTab === 'performance' ? 'My Performance' : 'Dashboard'}
      hideTopBar={isMobile}
    >
      {(loading || isFetching) && !summaryData ? (
        <Preloader />
      ) : isMobile ? (
        <div className="flex flex-col -mt-4 pb-12 relative">
          <div className="sticky top-0 z-50 bg-[#f8fafc] dark:bg-[#0b2528] -mx-4 px-4 pt-4 pb-4 border-b border-gray-100/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  className="h-11 w-11 border-2 border-[#7ede56]/30 shadow-md cursor-pointer"
                  onClick={() => setProfileSheetOpen(true)}
                >
                  <AvatarImage src={agent?.avatar} />
                  <AvatarFallback className="bg-[#065f46] text-white text-xs font-bold">{agent?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setProfileSheetOpen(true)}>
                    <h1 className="text-[17px] font-bold text-[#002f37] dark:text-white leading-none">Hello {agent?.name?.split(' ')[0] || 'Agent'}!</h1>
                    <ChevronDown className="h-4 w-4 text-gray-500 mt-0.5" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 mt-0.5">{agent?.agentId || 'Verified Agent'}</span>
                </div>
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white shadow-sm border border-gray-100 h-10 w-10 active:scale-95"
                  onClick={() => navigate('/dashboard/agent/notifications-center')}
                >
                  <img src="/lovable-uploads/notifs.png" alt="Notifications" className="h-6 w-6 object-contain" />
                </Button>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-white rounded-full border-2 border-red-500 flex items-center justify-center text-[10px] font-black text-red-600 shadow-sm z-10">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-6 px-1">
            <div className="relative w-full">
              <div
                ref={topSwipeRef}
                onScroll={() => {
                  const el = topSwipeRef.current;
                  if (!el) return;
                  setTopCardIndex(Math.round(el.scrollLeft / el.offsetWidth));
                }}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-0 w-full"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                <div className="snap-center shrink-0 w-full px-1">
                  <div
                    className="relative overflow-hidden rounded-[2rem] h-32 shadow-xl group cursor-pointer active:scale-[0.98] transition-all duration-200 bg-[#ffcc00] border border-white/5"
                    onClick={() => navigate('/dashboard/agent/performance')}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                      alt="Performance"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffcc00] via-[#ffcc00]/30 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between h-full px-6">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-black/80 uppercase tracking-[0.25em] font-inter">Personal KPIs</span>
                        <h3 className="text-2xl font-black text-black tracking-tight font-montserrat uppercase leading-none">Agent <br /> Performance</h3>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-black/10 flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="h-6 w-6 text-black" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="snap-center shrink-0 w-full px-1">
                  <div
                    className="relative overflow-hidden rounded-[2rem] h-32 shadow-xl group cursor-pointer active:scale-[0.98] transition-all duration-200 bg-emerald-900 border border-white/5"
                    onClick={() => setIsAddFarmerModalOpen(true)}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop"
                      className="absolute inset-0 w-full h-full object-cover opacity-85"
                      alt="Add Record"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#064e3b] via-[#064e3b]/40 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between h-full px-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.25em]">Grower Management</span>
                        <h3 className="text-2xl font-black text-white tracking-tight font-montserrat uppercase leading-none">Add record</h3>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-[#7ede56]/20 flex items-center justify-center backdrop-blur-sm">
                        <Plus className="h-6 w-6 text-[#7ede56]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="snap-center shrink-0 w-full px-1">
                  <div
                    className="relative overflow-hidden rounded-[2rem] h-32 shadow-xl group cursor-pointer active:scale-[0.98] transition-all duration-200 bg-purple-950 border border-white/5"
                    onClick={() => setLogVisitModalOpen(true)}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2040&auto=format&fit=crop"
                      className="absolute inset-0 w-full h-full object-cover opacity-85"
                      alt="Log Visit"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3b0764] via-[#3b0764]/40 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between h-full px-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-violet-300 uppercase tracking-[0.25em]">Field Operations</span>
                        <h3 className="text-2xl font-black text-white tracking-tight font-montserrat uppercase leading-none">Log visit</h3>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-violet-400/20 flex items-center justify-center backdrop-blur-sm">
                        <MapPin className="h-6 w-6 text-violet-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="snap-center shrink-0 w-full px-1">
                  <div
                    className="relative overflow-hidden rounded-[2rem] h-32 shadow-xl group cursor-pointer active:scale-[0.98] transition-all duration-200 bg-[#002f37] border border-white/5"
                    onClick={() => setIsBulkSmsModalOpen(true)}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                      className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-[3s] group-active:scale-110" 
                      alt="Communicaton" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#002f37] via-[#002f37]/40 to-[#7ede56]/15" />
                    <div className="relative z-10 flex items-center justify-between h-full px-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.25em]">Operational</span>
                        <h3 className="text-2xl font-black text-white tracking-tight font-montserrat uppercase leading-none">Bulk SMS</h3>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-[#7ede56]/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                        <Send className="h-6 w-6 text-[#7ede56]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-1.5 mt-2">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${topCardIndex === i ? 'w-5 bg-[#002f37]' : 'w-1.5 bg-gray-300'}`} />
                ))}
              </div>
            </div>

            <div className="relative w-full aspect-[22/8] rounded-[1.25rem] overflow-hidden shadow-md group cursor-pointer" onClick={handleHarvestTrackerClick}>
              <img src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Harvest" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
                <h3 className="text-white font-bold font-montserrat text-base uppercase tracking-tight leading-tight max-w-[150px]">Harvest Season Tracker</h3>
                <p className="text-white/70 font-inter font-medium text-[9px] mt-1">Verify farm yields precisely</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#002f37]">Active Metrics</h2>
              <div className="grid grid-cols-2 gap-3 -mt-2 px-0.5">
                {highlightCards.map((item, idx) => (
                  <Card 
                    key={item.id} 
                    className={`${item.color} border-none rounded-none h-24 flex flex-col justify-between shadow-lg active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    {/* Background Icon Decoration */}
                    <div className="absolute -right-3 -bottom-3 opacity-10 pointer-events-none">
                      <item.icon className="h-12 w-12 text-white rotate-12" />
                    </div>

                    <div className="p-3 flex flex-col h-full relative z-10 justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="p-1 bg-white/10 rounded-lg">
                          <item.icon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-[7.5px] font-black text-white/80 uppercase tracking-widest leading-none truncate">{item.title}</span>
                      </div>
                      
                      <div className="space-y-0">
                        <p className="text-[20px] font-black text-white leading-none">
                          <CountUp end={parseInt(String(item.value).replace(/,/g, '')) || 0} duration={1000} />
                        </p>
                        <span className="text-[8px] font-bold text-white/50 uppercase tracking-tight">{item.subtext}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#002f37] dark:text-white">Field Missions</h2>
                <button onClick={() => navigate('/dashboard/agent/tasks')} className="text-[11px] font-black text-[#065f46] uppercase border-b-2 border-[#7ede56]">View All</button>
              </div>
              <div className="space-y-3">
                {scheduledVisits.length > 0 ? scheduledVisits.slice(0, 3).map((mission: any, idx: number) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 rounded-[1.75rem] shadow-sm border border-gray-100 ${darkMode ? 'bg-[#0f434a] border-white/5' : 'bg-white'}`}>
                    <div className={`h-12 w-12 rounded-[1.25rem] flex items-center justify-center ${mission.type === 'task' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {mission.type === 'task' ? <ClipboardList className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[15px] font-bold truncate ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{mission.farmerName}</h4>
                      <p className="text-[11px] font-medium text-gray-400 truncate">{mission.displaySubtext} • {mission.displayTitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[13px] font-black text-[#002f37] dark:text-white block">{mission.displayTime}</span>
                      <span className={`text-[9px] font-black uppercase ${mission.displayStatus?.toLowerCase() === 'completed' || mission.status === 'done' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {mission.displayStatus}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center bg-gray-50/50 rounded-[1.75rem] border border-dashed border-gray-200">
                    <p className="text-[11px] font-bold text-gray-400">No active missions scheduled</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 px-1">
              <h2 className="text-lg font-bold text-[#002f37] dark:text-white">Field Operations Map</h2>
              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden h-72 relative">
                <div className="w-full h-full relative bg-gray-50 overflow-hidden"><OperationalMap farms={farms} darkMode={darkMode} /></div>
              </Card>
            </div>

            <div className="space-y-3 px-1 pb-6">
              <h2 className="text-[15px] font-bold text-[#002f37]">Recent activities</h2>
              <div className="space-y-2">
                {activities.length > 0 ? activities.slice(0, 3).map((activity: any, idx: number) => (
                  <div key={idx} className="flex gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-[0.99] transition-transform">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${activity.status === 'Completed' ? 'bg-[#7ede56]/15 text-[#065f46]' : 'bg-amber-50 text-amber-600'}`}>
                      {activity.type === 'verification' ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[#002f37] leading-snug truncate">{activity.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-400">{new Date(activity.createdAt).toLocaleDateString()}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${activity.status === 'Completed' ? 'bg-[#7ede56]/15 text-[#065f46]' : 'bg-amber-100 text-amber-700'}`}>{activity.status || 'Verified'}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center bg-gray-50/50 rounded-[1.5rem]"><p className="text-[11px] font-bold text-gray-400">No field activity</p></div>
                )}
              </div>
            </div>

            <div className={`fixed top-0 left-0 right-0 z-[100] bg-white rounded-b-[2rem] shadow-xl p-5 transition-all duration-500 transform ${profileSheetOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-10 h-1 bg-gray-100 rounded-full mb-1 cursor-pointer" onClick={() => setProfileSheetOpen(false)} />
                <Avatar className="h-16 w-16 border-2 border-[#7ede56]/20 shadow-lg">
                  <AvatarImage src={agent?.avatar} />
                  <AvatarFallback className="bg-[#065f46] text-white text-xl font-bold">{agent?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-[19px] font-bold font-montserrat uppercase">{agent?.name}</h3>
                  <p className="text-gray-500 text-[11px] mt-1">{agent?.agentId}</p>
                </div>
                <Button className="w-full bg-white text-[#002f37] border border-gray-100 rounded-full h-11 font-bold text-[13px]" onClick={() => { setProfileSheetOpen(false); navigate('/dashboard/agent/profile'); }}>Manage Your Account</Button>
              </div>
            </div>
            {profileSheetOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[90]" onClick={() => setProfileSheetOpen(false)} />}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">{getLocalizedGreeting()}</h1>
              <p className="text-[13px] text-gray-500 mt-1">Operations Tracker • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                className="bg-[#002f37] hover:bg-[#002f37]/90 text-white font-bold h-12 rounded-xl px-6 flex items-center gap-2 border-none shadow-lg shadow-[#002f37]/10"
                onClick={() => setIsBulkSmsModalOpen(true)}
              >
                <Send className="h-4 w-4" /> Bulk Message
              </Button>
              <Button className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-semibold h-12 rounded-xl px-6 flex items-center gap-2" onClick={() => { setSelectedFarmer(null); setIsAddFarmerModalOpen(true); }}>
                <Plus className="h-5 w-5" /> Onboard Grower
              </Button>
              <Button variant="outline" className="border-2 border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white font-semibold h-12 rounded-xl px-6" onClick={() => setLogVisitModalOpen(true)}>
                <Calendar className="h-5 w-5 mr-2" /> Log Visit
              </Button>
            </div>
          </div>



          <div className="relative w-full h-32 rounded-[1.75rem] overflow-hidden shadow-xl mb-10 group cursor-pointer bg-[#002f37]" onClick={handleHarvestTrackerClick}>
            <img src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[3s] group-hover:scale-105" alt="Harvest" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#002f37] via-[#002f37]/40 to-transparent flex flex-col justify-center px-10">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.3em]">Seasonal Intelligence</span>
                <h2 className="text-2xl font-black text-white font-montserrat uppercase tracking-tight">Harvest Season Tracker</h2>
              </div>
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg"><TrendingUp className="h-8 w-8 text-[#7ede56]" /></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {highlightCards.map((item, idx) => (
              <Card 
                key={item.id} 
                className={`${item.color} border-none rounded-none h-40 shadow-xl transition-all hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Background Icon Decoration */}
                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <item.icon className="h-32 w-32 text-white rotate-12" />
                </div>

                <div className="p-8 h-full flex flex-col justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{item.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-4xl font-black text-white tracking-tight">
                      <CountUp end={parseInt(String(item.value).replace(/,/g, '')) || 0} duration={1500} />
                    </h3>
                    <p className="text-[12px] font-bold text-white/60 mt-1 uppercase tracking-widest">{item.subtext}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <div className="bg-white border rounded-2xl mb-8 p-1.5 flex gap-1 shadow-sm overflow-x-auto scrollbar-hide shrink-0 z-20 sticky top-0">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'farms', label: 'Growers' },
                { id: 'visits', label: 'Visit Log' },
                { id: 'media', label: 'Gallery' },
                { id: 'quick-reports', label: 'Reports' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'performance', label: 'Performance' },
                { id: 'operational-map', label: 'Field Map' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-8 py-3.5 rounded-xl text-[11px] font-black tracking-widest transition-all uppercase whitespace-nowrap ${activeTab === tab.id ? 'bg-[#002f37] text-white shadow-xl scale-105' : 'text-gray-400 hover:text-[#002f37] hover:bg-gray-50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <TabsContent value="overview">
              <OverviewTab 
                farms={farms} 
                activities={activities} 
                notifications={notifications} 
                stats={stats} 
                agent={agent} 
                tasks={tasksData}
                handleLogVisit={handleLogVisit} 
                handleOpenBulkSms={() => setIsBulkSmsModalOpen(true)} 
                sectionCardClass={sectionCardClass} 
                darkMode={darkMode} 
              />
            </TabsContent>
            <TabsContent value="farms">
              <FarmsTab filteredFarms={filteredFarms} farmerSearch={farmerSearch} setFarmerSearch={setFarmerSearch} handleViewFarmer={handleViewFarmer} handleLogVisit={handleLogVisit} />
            </TabsContent>
            <TabsContent value="visits">
              <VisitsTab activities={activities} stats={stats} setIsUploadReportModalOpen={setIsUploadReportModalOpen} />
            </TabsContent>
            <TabsContent value="media">
              <MediaTab mediaItems={mediaItems} />
            </TabsContent>
            <TabsContent value="quick-reports">
              <ReportsTab sectionCardClass={sectionCardClass} />
            </TabsContent>
            <TabsContent value="tasks">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 border-none shadow-xl rounded-2xl bg-white space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm border border-amber-200">
                      <ClipboardList className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[#002f37] tracking-tight">Active Operations</h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Task Sync Status</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-[#002f37]">{tasksData.filter((t: any) => t.status !== 'done').length}</span>
                    <span className="text-sm font-bold text-gray-400 uppercase">Pending Actions</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-[13px] text-gray-500 font-medium">
                    "Ensure all field tasks are synced and completed to maintain optimal KPI rankings."
                  </div>
                  <Button onClick={() => setActiveTab('overview')} variant="outline" className="w-full h-12 rounded-xl border-gray-200 text-[#002f37] font-black uppercase text-[11px] tracking-widest hover:bg-gray-50">
                    Back to Overview
                  </Button>
                </Card>
                <div className="space-y-4">
                   {tasksData.filter((t: any) => t.status !== 'done').slice(0, 3).map((task: any, idx: number) => (
                     <div key={idx} className="p-5 bg-white rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between group hover:border-[#065f46]/30 transition-all">
                       <div className="flex items-center gap-4">
                         <div className="h-2 w-2 rounded-full bg-amber-500" />
                         <div>
                            <p className="text-sm font-bold text-[#002f37]">{task.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task.farmer || 'General Operation'}</p>
                         </div>
                       </div>
                       <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#065f46] transition-colors" />
                     </div>
                   ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="performance">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 border-none shadow-xl rounded-2xl bg-[#002f37] text-white relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 opacity-10">
                    <TrendingUp className="h-40 w-40" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                        <Activity className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Agent Metric Hub</h3>
                        <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Real-time KPI Analytics</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Loyalty Score</p>
                        <p className="text-2xl font-black text-white">98.2%</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Growth Rate</p>
                        <p className="text-2xl font-black text-[#7ede56]">+12%</p>
                      </div>
                    </div>
                    <Button onClick={() => setActiveTab('overview')} className="w-full h-12 rounded-xl bg-[#7ede56] text-[#002f37] font-black uppercase text-[11px] tracking-widest hover:bg-[#7ede56]/90 border-none shadow-xl">
                       Full Analytics Overview
                    </Button>
                  </div>
                </Card>
                <div className="space-y-4">
                   {[
                     { label: 'Farmer Engagement', value: 92, color: 'bg-emerald-500' },
                     { label: 'Data Registry Accuracy', value: 99, color: 'bg-[#7ede56]' },
                     { label: 'Reporting Timeliness', value: 85, color: 'bg-amber-500' }
                   ].map((metric, idx) => (
                     <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-50 shadow-sm">
                       <div className="flex justify-between items-center mb-3">
                         <span className="text-xs font-black text-[#002f37] uppercase tracking-widest">{metric.label}</span>
                         <span className="text-sm font-black text-[#065f46]">{metric.value}%</span>
                       </div>
                       <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.value}%` }} />
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="operational-map">
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden h-[600px] flex flex-col">
                <CardHeader className="bg-white border-b border-gray-50 z-10">
                  <CardTitle className="text-xl font-black text-[#002f37] flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#065f46]" /> Field Operations Map
                  </CardTitle>
                </CardHeader>
                <div className="flex-1 relative bg-gray-50"><OperationalMap farms={farms} darkMode={darkMode} /></div>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Modals */}
      <ViewFarmerModal open={viewModalOpen} onOpenChange={setViewModalOpen} farmer={selectedFarmer} onNewVisit={handleLogVisit} onUploadMedia={handleUploadReport} onAddField={handleAddField} />
      <AddFarmerModal open={isAddFarmerModalOpen} onOpenChange={setIsAddFarmerModalOpen} onSuccess={fetchData} />
      <AddFarmerModal open={editModalOpen} onOpenChange={setEditModalOpen} farmer={selectedFarmer} isEditMode={true} onSuccess={fetchData} />
      <ViewMatchModal open={viewMatchModalOpen} onOpenChange={setViewMatchModalOpen} match={selectedMatch} />
      <ReviewMatchModal open={reviewMatchModalOpen} onOpenChange={setReviewMatchModalOpen} match={selectedMatch} onApprove={handleApproveMatch} onReject={handleRejectMatch} />
      <ViewDisputeModal open={viewDisputeModalOpen} onOpenChange={setViewDisputeModalOpen} dispute={selectedDispute} />
      <ViewVisitDetailsModal open={viewVisitModalOpen} onOpenChange={setViewVisitModalOpen} visit={selectedVisit} />
      <VerificationQueueModal open={isVerificationQueueModalOpen} onOpenChange={setIsVerificationQueueModalOpen} pendingFarmers={pendingFarmers} agent={agent} darkMode={darkMode} onSuccess={fetchData} onView={handleViewFarmer} onEdit={handleEditFarmer} />
      <ActiveFarmsModal open={isActiveFarmsModalOpen} onOpenChange={setIsActiveFarmsModalOpen} farms={farms} onTrackJourney={handleTrackJourney} />
      <FarmJourneyModal open={isJourneyModalOpen} onOpenChange={setIsJourneyModalOpen} farmer={selectedFarmer} />
      <UploadReportModal open={isUploadReportModalOpen} onOpenChange={setIsUploadReportModalOpen} farmer={selectedFarmer} farmers={farmers} onUpload={fetchData} />
      <MediaUploadModal open={isMediaUploadModalOpen} onOpenChange={setIsMediaUploadModalOpen} farmer={selectedFarmer} onSuccess={fetchData} />
      <ScheduleVisitModal open={logVisitModalOpen} onOpenChange={setLogVisitModalOpen} onSuccess={fetchData} />
      <BulkSmsModal open={isBulkSmsModalOpen} onOpenChange={setIsBulkSmsModalOpen} farmers={farmers} agent={agent} />
      <AddFieldModal open={isAddFieldModalOpen} onOpenChange={setIsAddFieldModalOpen} farmer={selectedFarmer} onSuccess={fetchData} />
    </AgentLayout>
  );
};

export default AgentDashboard;
