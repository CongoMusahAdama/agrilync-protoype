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
import { Button } from '@/components/ui/button';
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
  ChevronDown
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
  METRIC_DATA,
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
  <Card className="bg-gray-800/50 border-gray-700 p-3 sm:p-6 shadow-lg animate-pulse">
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
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab && allowedTabs.includes(tab) && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search, activeTab]);
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
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [logVisitModalOpen, setLogVisitModalOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [topCardIndex, setTopCardIndex] = useState(0);
  const topSwipeRef = React.useRef<HTMLDivElement>(null);

  // useQuery for all-in-one dashboard data with optimized caching
  // New state for matches and disputes
  const [activeMetric, setActiveMetric] = useState('onboarding');
  const metricData = METRIC_DATA;

  const currentMetric = metricData[activeMetric];

  const { data: summaryData, isLoading: loading, isFetching, refetch: refreshData } = useQuery({
    queryKey: ['agentDashboardSummary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary');
      return response.data.data;
    },
    staleTime: DASHBOARD_CACHE_STALE_TIME,
    gcTime: DASHBOARD_CACHE_GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnReconnect: true
  });

  // Fetch scheduled visits for the summary card
  const { data: scheduledVisitsData = [] } = useQuery({
    queryKey: ['scheduledVisits'],
    queryFn: async () => {
      const response = await api.get('/scheduled-visits');
      const resData = response.data;
      return Array.isArray(resData) ? resData : (resData?.data || []);
    },
    staleTime: 5 * 60 * 1000,
  });

  const scheduledVisits = useMemo(() => {
    return (scheduledVisitsData || []);
  }, [scheduledVisitsData]);

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

  const loadingStats = loading;
  const loadingFarmers = loading;
  const loadingFarms = loading;
  const loadingQueue = loading;
  const loadingNotifications = loading;
  const loadingMatches = loading;
  const loadingActivities = loading;
  const loadingDisputes = loading;

  const fetchData = useCallback(() => {
    refreshData();
  }, [refreshData]);

  // Notification State
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'alert' | 'update'>('all');

  const unreadNotifications = notifications.filter((n: any) => !n.read).length;

  const queryClient = useQueryClient();

  const handleMarkAllRead = async () => {
    // In a optimized world, we'd have an API for this
    // For now, let's invalidate to show fresh data
    queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
  };

  const toggleReadStatus = async (id: string, type?: string) => {
    try {
      await api.put(`/notifications/${id}`);
      // Invalidate to refresh summary data
      queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });

      // Actionable notifications
      if (type === 'verification') {
        setActiveTab('farmers');
        setFarmerStatusFilter('Pending');
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
      toast.error(errorMessage);
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
      toast.error(errorMessage);
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
      // Fetch full farmer data including Ghana card images
      const res = await api.get(`/farmers/${farmer._id}`);
      setSelectedFarmer(res.data);
      setEditModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching farmer data:', error);
      toast.error('Failed to load farmer data. Using available data.');
      // Fallback to available data if fetch fails
      setSelectedFarmer(farmer);
      setEditModalOpen(true);
    }
  };

  const handleTrackJourney = (farmer: any) => {
    setSelectedFarmer(farmer);
    setIsJourneyModalOpen(true);
  };

  const filteredFarmers = useMemo(() => {
    const searchValue = debouncedFarmerSearch.toLowerCase();
    return farmers.reduce((acc: any[], f: any) => {
      let displayStatus = f.status === 'active' ? 'Completed' : f.status === 'pending' ? 'Pending' : f.status;

      const matchesSearch =
        f.name?.toLowerCase().includes(searchValue) ||
        (f.contact && f.contact.includes(searchValue)) ||
        (f.region && f.region.toLowerCase().includes(searchValue)) ||
        (f.community && f.community.toLowerCase().includes(searchValue));

      const matchesStatus =
        farmerStatusFilter === 'all' ? true : displayStatus === farmerStatusFilter;

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
      color: 'bg-purple-600',
      icon: Calendar,
      image: '/lovable-uploads/countryside-workers-together-field.jpg',
    }
  ], [summaryData, stats, scheduledVisits]);


  const statusStyles = STATUS_STYLES;


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  const headerActions = (
    <div className="hidden gap-3 md:flex">
      <Button
        variant="outline"
        className={`border-[#065f46]/30 text-[#065f46] hover:bg-[#065f46]/5`}
        onClick={() => navigate('/dashboard/agent/farmers-management')}
      >
        <Users className="mr-2 h-4 w-4" />
        Manage Farmers
      </Button>
    </div>
  );

  const sectionCardClass = darkMode
    ? 'border border-[#124b53] bg-[#0b2528] text-gray-100 shadow-lg'
    : 'border-none bg-white text-gray-900 shadow-sm';

  const inputBaseClasses = darkMode
    ? 'bg-[#10363d] border-[#1b5b65] text-gray-100 placeholder:text-gray-400'
    : '';

  const selectTriggerClasses = darkMode
    ? 'bg-[#10363d] border-[#1b5b65] text-gray-100'
    : '';

  const tableHeaderRowClass = 'bg-[#002f37] text-white border-[#002f37]';
  const tableBodyRowClass = 'border-b border-[#002f37]/10 hover:bg-[#002f37]/5';
  const tableCellClass = 'text-gray-900 py-2.5 px-6 border-r border-[#002f37]/10 last:border-r-0';

  const getLocalizedGreeting = () => {
    const hour = new Date().getHours();
    const displayName = agent?.name || 'Agent';

    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

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
          {/* 1. COMPREHENSIVE STICKY TOP SECTION - Now just the profile bar */}
          <div className="sticky top-0 z-50 bg-[#f8fafc] dark:bg-[#002f37] -mx-4 px-4 pt-4 pb-4 border-b border-gray-100/10 shadow-sm">
            {/* Status Bar / User Profile */}
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
                    <h1 className="text-[17px] font-bold text-[#002f37] dark:text-white leading-none">Hello {agent?.name?.split(' ')[0] || 'Musah'}!</h1>
                    <ChevronDown className="h-4 w-4 text-gray-500 mt-0.5" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 mt-0.5">{agent?.agentId || '053 187 8243'}</span>
                </div>
              </div>
              <div className="relative mt-2">
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

          {/* 2. SCROLLABLE AREA - Now includes the cards that were previously static */}
          <div className="flex flex-col gap-6 pt-6 px-1">
            {/* Swipeable Top Cards — Harvest-Tracker Style: Performance · Add Record · Log Visit */}
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
                {/* CARD 1 — Agent Performance */}
                <div className="snap-center shrink-0 w-full px-1">
                  <div
                    className="relative overflow-hidden rounded-[2.5rem] h-32 shadow-2xl group cursor-pointer active:scale-[0.97] transition-all duration-300 bg-[#001a1d]"
                    onClick={() => navigate('/dashboard/agent/performance')}
                  >
                    <img
                      src="/lovable-uploads/performance-card-bg.png"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/40 via-black/80 to-black" />

                    {/* Decorative glass element - Yellow Blur */}
                    <div className="absolute -right-4 -top-8 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl group-hover:bg-yellow-400/40 transition-all duration-700" />

                    <div className="relative z-10 flex items-center justify-between h-full px-8">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-1 w-4 bg-yellow-400 rounded-full" />
                          <span className="text-[11px] font-black text-yellow-400 uppercase tracking-[0.3em] font-inter">Performance</span>
                        </div>
                        <h3 className="text-3xl font-black text-white px-2 tracking-tighter font-montserrat uppercase leading-none drop-shadow-md">
                          Great progress
                        </h3>
                        <p className="text-[10px] font-bold text-white/50 font-inter mt-1.5 flex items-center gap-1.5 uppercase tracking-widest pl-2">
                          <Activity className="h-3 w-3 text-yellow-400" />
                          View your status stats
                        </p>
                      </div>

                      {/* Empty right side to prioritize background image visibility */}
                      <div className="w-16 h-16 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  </div>
                </div>

                {/* CARD 2 — Add Record / Onboard Grower */}
                <div className="snap-center shrink-0 w-full px-1">
                  <div
                    className="relative overflow-hidden rounded-[2rem] h-32 shadow-xl group cursor-pointer active:scale-[0.98] transition-all duration-200 bg-emerald-900 border border-white/5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddFarmerModalOpen(true);
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#064e3b] via-[#064e3b]/80 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between h-full px-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.25em] font-inter">Grower Management</span>
                        <h3 className="text-2xl font-black text-white tracking-tight font-montserrat uppercase leading-none">Add record</h3>
                        <p className="text-[10px] font-bold text-white/70 font-inter">Onboard a new farmer</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-[#7ede56]/20 border border-[#7ede56]/40 flex items-center justify-center shrink-0 backdrop-blur-sm">
                        <Users className="h-6 w-6 text-[#7ede56]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3 — Log Field Visit */}
                <div className="snap-center shrink-0 w-full px-1">
                  <div
                    className="relative overflow-hidden rounded-[2rem] h-32 shadow-xl group cursor-pointer active:scale-[0.98] transition-all duration-200 bg-purple-950 border border-white/5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogVisitModalOpen(true);
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2040&auto=format&fit=crop"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3b0764] via-[#3b0764]/80 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between h-full px-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-violet-300 uppercase tracking-[0.25em] font-inter">Field Operations</span>
                        <h3 className="text-2xl font-black text-white tracking-tight font-montserrat uppercase leading-none">Log visit</h3>
                        <p className="text-[10px] font-bold text-white/70 font-inter">Schedule a farm visit</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-violet-400/20 border border-violet-400/40 flex items-center justify-center shrink-0 backdrop-blur-sm">
                        <MapPin className="h-6 w-6 text-violet-300" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Dot indicators — 3 slides */}
              <div className="flex justify-center gap-1.5 mt-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${topCardIndex === i ? 'w-5 bg-[#002f37]' : 'w-1.5 bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Featured Carousel / Banner Style */}
            <div className="relative w-full aspect-[22/8] rounded-[1.25rem] overflow-hidden shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Farm Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
                <h3 className="text-white font-bold font-montserrat text-base uppercase tracking-tight leading-tight max-w-[150px]">Harvest Season Tracker</h3>
                <p className="text-white/70 font-inter font-medium text-[9px] mt-1">Verify farm yields precisely</p>
              </div>
            </div>


            {/* Balances / Stats section - Styled like the dark MTN cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-[#002f37]">Active Metrics</h2>
              </div>

              {/* Metric Cards - Image Background Style like Harvest Tracker */}
              <div className="grid grid-cols-2 gap-3 -mt-2 px-0.5">
                {highlightCards.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-[1.75rem] h-36 flex flex-col justify-end group shadow-md active:scale-[0.98] transition-transform cursor-pointer"
                    onClick={() => { }}
                  >
                    {/* Background Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay — bottom heavy like harvest tracker */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    {/* Top left icon badge */}
                    <div className="absolute top-3 left-3 p-1.5 rounded-xl bg-black/30 backdrop-blur-sm z-10">
                      <item.icon className="h-4 w-4 text-white/90" />
                    </div>
                    {/* Content */}
                    <div className="relative z-10 px-3.5 pb-3.5 space-y-0">
                      <span className="text-[8px] font-black text-white/60 uppercase tracking-widest block">{item.title}</span>
                      <p className="text-[22px] font-bold text-white tabular-nums leading-tight">
                        <CountUp end={parseInt(String(item.value).replace(/,/g, '')) || 0} duration={1000} />
                      </p>
                      <span className="text-[9px] font-medium text-[#7ede56]">{item.subtext}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Field Missions */}
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#002f37] dark:text-white">Field Missions</h2>
                <button onClick={() => navigate('/dashboard/agent/tasks')} className="text-[11px] font-black text-[#065f46] uppercase border-b-2 border-[#7ede56]">View All</button>
              </div>

              <div className="space-y-3">
                {scheduledVisits.length > 0 ? scheduledVisits.slice(0, 2).map((mission: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-[1.75rem] shadow-sm border border-gray-100 transition-all active:scale-[0.98] ${darkMode ? 'bg-[#0f434a] border-white/5' : 'bg-white'}`}
                  >
                    <div className={`h-12 w-12 rounded-[1.25rem] flex items-center justify-center shrink-0 ${idx % 2 === 0 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[15px] font-bold truncate normal-case ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{mission.farmerName}</h4>
                      <p className="text-[11px] font-medium text-gray-400 truncate normal-case">{mission.community} • Mission start</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[13px] font-black text-[#002f37] dark:text-white block tabular-nums">09:30</span>
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Ongoing</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center bg-gray-50/50 rounded-[1.75rem] border border-dashed border-gray-200">
                    <p className="text-[11px] font-bold text-gray-400 normal-case">No active missions scheduled</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. FIELD OPERATIONS MAP */}
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#002f37] dark:text-white">Field Operations</h2>
                <button
                  onClick={() => setActiveTab('operational-map')}
                  className="text-[11px] font-black text-[#065f46] uppercase border-b-2 border-[#7ede56]"
                >View Full Map</button>
              </div>

              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden h-72 relative flex flex-col">
                <div className="w-full h-full flex-1 relative bg-gray-50 overflow-hidden">
                  <OperationalMap farms={farms} darkMode={darkMode} />
                </div>
              </Card>
            </div>

            {/* Performance Summary - Premium Image Card & Quick Records */}
            <div className="px-1 overflow-visible">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
                {/* Field Reporting Progress Card */}
                <div className="relative shrink-0 overflow-hidden rounded-[2rem] h-40 shadow-xl group w-[85vw] sm:w-[320px] snap-center sm:snap-start">
                  <img
                    src="/lovable-uploads/countryside-workers-together-field.jpg"
                    alt="Performance"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#002f37]/90 to-[#002f37]/30" />
                  <div className="relative z-10 flex flex-col justify-between h-full p-6">
                    <div>
                      <p className="text-[9px] font-black text-[#7ede56] uppercase tracking-[0.2em] mb-0.5 font-inter">Monthly field reporting</p>
                      <h3 className="text-[22px] font-black text-white tracking-tight font-montserrat uppercase">
                        {reportProgress >= 100 ? 'Mission complete!' : 'Almost there!'}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest font-inter">Progress to goal</p>
                        <span className="text-[14px] font-black text-[#7ede56] font-montserrat">{reportProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7ede56] rounded-full transition-all duration-1000" style={{ width: `${reportProgress}%` }}></div>
                      </div>
                      <button
                        className="text-[10px] font-black text-white/80 uppercase tracking-widest font-inter hover:text-[#7ede56] transition-colors normal-case"
                        onClick={() => setActiveTab('visits')}
                      >Submit mission report →</button>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Farm Updates Timeline - Refined */}
            <div className="space-y-3 px-1 pb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[#002f37] font-inter normal-case">Recent activities</h2>
              </div>

              <div className="space-y-2">
                {activities.length > 0 ? activities.slice(0, 3).map((activity: any, idx: number) => {
                  const Icon = activity.type === 'verification' ? CheckCircle2 :
                    activity.type === 'report' ? FileText :
                      activity.type === 'training' ? GraduationCap : Activity;

                  return (
                    <div key={idx} className="flex gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm active:scale-[0.99] transition-transform">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${activity.status === 'Completed' ? 'bg-[#7ede56]/15 text-[#065f46]' : 'bg-amber-50 text-amber-600'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[#002f37] leading-snug font-inter mb-1 normal-case truncate">{activity.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-gray-400 tracking-widest normal-case font-inter">{new Date(activity.createdAt).toLocaleDateString()}</span>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${activity.status === 'Completed' ? 'bg-[#7ede56]/15 text-[#065f46]' : 'bg-amber-100 text-amber-700'}`}>{activity.status || 'Verified'}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-8 text-center bg-gray-50/50 rounded-[1.5rem]">
                    <p className="text-[11px] font-bold text-gray-400 normal-case">No recent field activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. PROFILE POPOVER LOGIC INTEGRATED */}
            <div
              className={`fixed top-0 left-0 right-0 z-[100] bg-white rounded-b-[2rem] shadow-[0_25px_50px_rgba(0,0,0,0.1)] p-5 pt-1 transition-all duration-500 transform ${profileSheetOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
            >
              <div className="flex flex-col items-center text-center space-y-2.5 pb-2">
                <div className="w-10 h-1 bg-gray-100 rounded-full mb-0.5 cursor-pointer active:bg-gray-200" onClick={() => setProfileSheetOpen(false)} />

                <Avatar className="h-16 w-16 border-[3px] border-[#7ede56]/20 shadow-lg">
                  <AvatarImage src={agent?.avatar} />
                  <AvatarFallback className="bg-[#065f46] text-white text-xl font-bold">{agent?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="space-y-0.5">
                  <h3 className="text-[19px] font-bold font-montserrat text-[#002f37] leading-tight uppercase tracking-tight">{agent?.name || 'Musah Adams Congo'}</h3>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex items-center gap-1.5 text-gray-500 font-bold font-inter text-[11px]">
                      <span className="text-[#002f37]/20 uppercase tracking-widest text-[8px] font-inter">Agent ID:</span>
                      <span className="font-inter">{agent?.agentId || 'AL-001'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 font-medium font-inter text-[10px] uppercase tracking-widest">
                      <span>{agent?.region || 'Upper East'}</span>
                      <span className="h-2 w-[1px] bg-gray-200"></span>
                      <span>{agent?.district || 'Bawku'}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#7ede56]/10 px-2.5 py-1 mt-1 border border-[#7ede56]/15">
                      <div className="h-1 w-1 rounded-full bg-[#7ede56]"></div>
                      <span className="text-[#065f46] text-[9px] font-bold font-inter uppercase tracking-widest">Active Account</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-white hover:bg-gray-50 text-[#002f37] border border-gray-100 rounded-full h-11 font-bold font-montserrat text-[13px] shadow-sm mt-1 uppercase tracking-wider transition-all active:scale-95"
                  onClick={() => {
                    setProfileSheetOpen(false);
                    navigate('/dashboard/agent/profile');
                  }}
                >
                  Manage Your Account
                </Button>
              </div>
            </div>

            {profileSheetOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[90] transition-opacity" onClick={() => setProfileSheetOpen(false)} />}
          </div>
        </div>
      </AgentLayout>
        </div >
      ) : (

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
              {getLocalizedGreeting()}
            </h1>
          </div>
          <p className="ui-label !normal-case !text-[13px] !mb-0">
            Operations Tracker • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-row sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
          <Button
            className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-semibold text-[13px] sm:text-[14px] px-3 sm:px-6 h-11 sm:h-12 rounded-xl shadow-lg shadow-[#065f46]/20 flex items-center justify-center gap-1 sm:gap-2 border-none flex-1 sm:flex-none sm:w-auto"
            onClick={() => {
              setSelectedFarmer(null);
              setIsAddFarmerModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <span className="whitespace-nowrap">Onboard Grower</span>
          </Button>
          <Button
            variant="outline"
            className="border-2 border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white font-semibold text-[13px] sm:text-[14px] px-3 sm:px-6 h-11 sm:h-12 rounded-xl flex items-center justify-center gap-1 sm:gap-2 transition-all flex-1 sm:flex-none sm:w-auto"
            onClick={() => setLogVisitModalOpen(true)}
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <span className="whitespace-nowrap">Log Visit</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {highlightCards.map((item: any, idx: number) => {
          return loading ? (
            <MetricCardSkeleton key={`skeleton-${idx}`} />
          ) : (
            <Card
              key={item.id}
              className="group relative overflow-hidden h-44 rounded-[2rem] border-none shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-emerald-900/20 cursor-pointer bg-[#002f37]"
            >
              <div className="absolute inset-0 z-0 opacity-100 group-hover:scale-110 transition-all duration-[2s]">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <div className="p-6 sm:p-8 h-full flex flex-col justify-between relative z-10">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 ring-1 ring-white/5">
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[12px] font-black text-white/100 uppercase tracking-[0.2em] leading-none drop-shadow-lg">{item.title}</p>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none tabular-nums font-montserrat drop-shadow-2xl">
                      <CountUp end={parseInt(String(item.value).replace(/,/g, '')) || 0} duration={1500} />
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest leading-none drop-shadow-lg">{item.subtext}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ZakatSmart Style Secondary Navigation Bar */ }
<div className="bg-white border border-gray-100 rounded-2xl mb-8 p-1.5 flex overflow-x-auto whitespace-nowrap scrollbar-hide shadow-sm gap-1 w-full">
  <button
    onClick={() => setActiveTab('overview')}
    className={`px-4 sm:px-8 py-3.5 rounded-xl text-[12px] sm:text-[14px] font-bold tracking-wider transition-all flex-1 sm:flex-none ${activeTab === 'overview' ? 'bg-[#065f46] text-white shadow-lg shadow-[#065f46]/20' : 'text-gray-500 hover:text-[#065f46] hover:bg-gray-50'}`}
  >
    OVERVIEW
  </button>
  <button
    onClick={() => setActiveTab('quick-reports')}
    className={`px-4 sm:px-8 py-3.5 rounded-xl text-[12px] sm:text-[14px] font-bold tracking-wider transition-all flex-1 sm:flex-none ${activeTab === 'quick-reports' ? 'bg-[#065f46] text-white shadow-lg shadow-[#065f46]/20' : 'text-gray-500 hover:text-[#065f46] hover:bg-gray-50'}`}
  >
    REPORTS
  </button>
  <button
    onClick={() => setActiveTab('operational-map')}
    className={`px-4 sm:px-8 py-3.5 rounded-xl text-[12px] sm:text-[14px] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none ${activeTab === 'operational-map' ? 'bg-[#065f46] text-white shadow-lg shadow-[#065f46]/20' : 'text-gray-500 hover:text-[#065f46] hover:bg-gray-50'}`}
  >
    <MapPin className="h-4 w-4" />
    <span className="hidden xs:inline">MAP</span>
    <span className="xs:hidden">MAP</span>
  </button>
</div>

{/* Tabbed Content */ }
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide bg-transparent p-0 h-auto gap-1 sm:gap-4 mb-4 sm:mb-8 border-b -mx-4 px-4 sm:mx-0 sm:px-0 ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <TabsTrigger
            value="overview"
            onClick={() => navigate('/dashboard/agent?tab=overview')}
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'overview'
              ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-2 hidden xs:block" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="farms"
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'farms'
              ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Sprout className="w-4 h-4 mr-2 hidden xs:block" />
            Farms
          </TabsTrigger>
          <TabsTrigger
            value="visits"
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'visits'
              ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Calendar className="w-4 h-4 mr-2 hidden xs:block" />
            <span className="hidden sm:inline">Visits & Reports</span>
            <span className="sm:hidden">Visits</span>
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'media'
              ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <ImageIcon className="w-4 h-4 mr-2 hidden xs:block" />
            Media
          </TabsTrigger>
          {/* Hidden triggers for secondary navigation state consistency */}
          <TabsTrigger value="quick-reports" className="hidden" />
          <TabsTrigger value="operational-map" className="hidden" />
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab
            farms={farms}
            activities={activities}
            notifications={notifications}
            stats={stats}
            darkMode={darkMode}
            agent={agent}
            handleLogVisit={handleLogVisit}
            sectionCardClass={sectionCardClass}
          />
        </TabsContent>

        {/* Farms Tab */}
        <TabsContent value="farms" className="space-y-6">
          <FarmsTab
            filteredFarms={filteredFarms}
            farmerSearch={farmerSearch}
            setFarmerSearch={setFarmerSearch}
            handleViewFarmer={handleViewFarmer}
            handleLogVisit={handleLogVisit}
          />
        </TabsContent>

        {/* Visits & Reports Tab */}
        <TabsContent value="visits" className="space-y-6">
          <VisitsTab
            activities={activities}
            stats={stats}
            setIsUploadReportModalOpen={setIsUploadReportModalOpen}
          />
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <MediaTab mediaItems={mediaItems} />
        </TabsContent>

        {/* Quick Reports Tab */}
        <TabsContent value="quick-reports" className="space-y-6">
          <ReportsTab sectionCardClass={sectionCardClass} />
        </TabsContent>

        {/* Operational Map Tab */}
        <TabsContent value="operational-map" className="space-y-6">
          <Card className={`${sectionCardClass} border-none shadow-xl rounded-2xl overflow-hidden h-[600px] flex flex-col relative`}>
            <CardHeader className="bg-white border-b border-gray-50 z-10">
              <CardTitle className="text-xl font-black text-[#002f37] flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#065f46]" /> Field Operations Map
              </CardTitle>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Geospatial overview of registered farms and active missions</p>
            </CardHeader>
            <div className="w-full flex-1 bg-gray-100 relative overflow-hidden">
              <OperationalMap farms={farms} darkMode={darkMode} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <ViewFarmerModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        farmer={selectedFarmer}
        onNewVisit={(farmer) => {
          setSelectedFarmer(farmer);
          setLogVisitModalOpen(true);
        }}
        onUploadMedia={(farmer) => {
          setSelectedFarmer(farmer);
          setIsMediaUploadModalOpen(true);
        }}
        onAddField={(farmer) => {
          setSelectedFarmer(farmer);
          setIsAddFieldModalOpen(true);
        }}
      />

      <AddFieldModal
        open={isAddFieldModalOpen}
        onOpenChange={setIsAddFieldModalOpen}
        farmer={selectedFarmer}
        onSuccess={() => {
          fetchData();
        }}
      />

      <AddFarmerModal open={isAddFarmerModalOpen} onOpenChange={setIsAddFarmerModalOpen} onSuccess={fetchData} />
      <AddFarmerModal open={editModalOpen} onOpenChange={setEditModalOpen} farmer={selectedFarmer} isEditMode={true} onSuccess={fetchData} />
      <ViewMatchModal open={viewMatchModalOpen} onOpenChange={setViewMatchModalOpen} match={selectedMatch} />
      <ReviewMatchModal
        open={reviewMatchModalOpen}
        onOpenChange={setReviewMatchModalOpen}
        match={selectedMatch}
        onApprove={handleApproveMatch}
        onReject={handleRejectMatch}
      />
      <ViewDisputeModal open={viewDisputeModalOpen} onOpenChange={setViewDisputeModalOpen} dispute={selectedDispute} />
      <ViewVisitDetailsModal open={viewVisitModalOpen} onOpenChange={setViewVisitModalOpen} visit={selectedVisit} />
      <VerificationQueueModal
        open={isVerificationQueueModalOpen}
        onOpenChange={setIsVerificationQueueModalOpen}
        pendingFarmers={pendingFarmers}
        agent={agent}
        darkMode={darkMode}
        onSuccess={fetchData}
        onView={handleViewFarmer}
        onEdit={handleEditFarmer}
      />

      <ActiveFarmsModal
        open={isActiveFarmsModalOpen}
        onOpenChange={setIsActiveFarmsModalOpen}
        farms={farms}
        onTrackJourney={handleTrackJourney}
      />

      <FarmJourneyModal
        open={isJourneyModalOpen}
        onOpenChange={setIsJourneyModalOpen}
        farmer={selectedFarmer}
      />

      <UploadReportModal
        open={isUploadReportModalOpen}
        onOpenChange={setIsUploadReportModalOpen}
        farmer={selectedFarmer}
        farmers={farmers}
        onUpload={fetchData}
      />

      <MediaUploadModal
        open={isMediaUploadModalOpen}
        onOpenChange={setIsMediaUploadModalOpen}
        farmer={selectedFarmer}
        onSuccess={fetchData}
      />

      <ScheduleVisitModal
        open={logVisitModalOpen}
        onOpenChange={setLogVisitModalOpen}
        onSuccess={fetchData}
      />
    </AgentLayout >
  );
};

export default AgentDashboard;
