import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Bot
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
  const [logVisitModalOpen, setLogVisitModalOpen] = useState(false);

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
    const effectiveRegion = agent?.region || "Ashanti Region";
    return (scheduledVisitsData || []).filter((v: any) => !effectiveRegion || v.region === effectiveRegion);
  }, [scheduledVisitsData, agent?.region]);

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
    const effectiveRegion = agent?.region || "Ashanti Region";
    const regSearch = (effectiveRegion || '').toLowerCase().replace(' region', '').trim();
    return farmersRaw.filter((f: any) => {
      const fReg = (f.region || '').toLowerCase().replace(' region', '').trim();
      return !regSearch || fReg === regSearch || fReg.includes(regSearch) || regSearch.includes(fReg);
    });
  }, [farmersRaw, agent?.region]);

  const farms = useMemo(() => {
    const effectiveRegion = agent?.region || "Ashanti Region";
    const regSearch = (effectiveRegion || '').toLowerCase().replace(' region', '').trim();
    return farmsRaw.filter((f: any) => {
      const fReg = (f.region || '').toLowerCase().replace(' region', '').trim();
      return !regSearch || fReg === regSearch || fReg.includes(regSearch) || regSearch.includes(fReg);
    });
  }, [farmsRaw, agent?.region]);

  const activities = useMemo(() => {
    const effectiveRegion = agent?.region || "Ashanti Region";
    const regSearch = (effectiveRegion || '').toLowerCase().replace(' region', '').trim();
    return activitiesRaw.filter((a: any) => {
      const aReg = (a.region || '').toLowerCase().replace(' region', '').trim();
      return !regSearch || aReg === regSearch || aReg.includes(regSearch) || regSearch.includes(aReg);
    });
  }, [activitiesRaw, agent?.region]);

  const matches = useMemo(() => {
    const effectiveRegion = agent?.region || "Ashanti Region";
    const regSearch = (effectiveRegion || '').toLowerCase().replace(' region', '').trim();
    return matchesRaw.filter((m: any) => {
      const mReg = (m.region || '').toLowerCase().replace(' region', '').trim();
      return !regSearch || mReg === regSearch || mReg.includes(regSearch) || regSearch.includes(mReg);
    });
  }, [matchesRaw, agent?.region]);

  const disputes = useMemo(() => {
    const effectiveRegion = agent?.region || "Ashanti Region";
    const regSearch = (effectiveRegion || '').toLowerCase().replace(' region', '').trim();
    return disputesRaw.filter((d: any) => {
      const dReg = (d.region || '').toLowerCase().replace(' region', '').trim();
      return !regSearch || dReg === regSearch || dReg.includes(regSearch) || regSearch.includes(dReg);
    });
  }, [disputesRaw, agent?.region]);

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
    const searchValue = farmerSearch.toLowerCase();
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
  }, [farmers, farmerSearch, farmerStatusFilter]);

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
    },
    {
      id: 'active-farms',
      title: 'Verified Farms',
      value: summaryData?.stats?.activeFarms || stats.activeFarms || 0,
      subtext: 'Active deliveries',
      color: 'bg-blue-600',
      icon: CheckCircle2,
    },
    {
      id: 'farms-at-risk',
      title: 'Farms at Risk',
      value: summaryData?.stats?.pendingDisputes || stats.pendingDisputes || 0,
      subtext: 'Critical attention',
      color: 'bg-rose-600',
      icon: AlertTriangle,
    },
    {
      id: 'scheduled-visits',
      title: 'Scheduled Visits',
      value: scheduledVisits.length,
      subtext: 'Next 7 days',
      color: 'bg-purple-600',
      icon: Calendar,
    },
    {
      id: 'reports-due',
      title: 'Digital Proofs',
      value: summaryData?.stats?.reportsThisMonth || stats.reportsThisMonth || 0,
      subtext: 'Field Evidence',
      color: 'bg-orange-500',
      icon: FileText,
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

  const tableHeaderRowClass = 'bg-[#065f46] text-white border-[#065f46]';
  const tableBodyRowClass = 'border-b border-gray-100 hover:bg-gray-50';
  const tableCellClass = 'text-gray-900';

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

  // Show preloader on initial load or when fetching data
  if ((loading || isFetching) && !summaryData) {
    return <Preloader />;
  }

  return (
    <AgentLayout
      activeSection={activeTab === 'performance' ? 'performance' : 'dashboard'}
      title={activeTab === 'performance' ? 'My Performance' : 'Dashboard'}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[24px] font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {getLocalizedGreeting()}
            </h2>
          </div>
          <p className="text-[14px] font-medium text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
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

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {highlightCards.map((item: any, idx: number) => {
          const isLoading = loading;

          return isLoading ? (
            <MetricCardSkeleton key={`skeleton-${idx}`} />
          ) : (
            <Card
              key={item.id}
              className={`${item.id === 'total-farms' ? item.color : 'bg-white'} p-3 sm:p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-28 sm:h-36 flex flex-col justify-between group border-none cursor-pointer`}
            >
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <item.icon className={`h-16 sm:h-24 w-16 sm:w-24 ${item.id === 'total-farms' ? 'text-white' : item.color.replace('bg-', 'text-')} -rotate-12`} />
              </div>

              <div className="flex items-center justify-between">
                <div className={`p-2 ${item.id === 'total-farms' ? 'bg-white/10' : item.color.replace('bg-', 'bg-').concat('/10')} rounded-lg`}>
                  <item.icon className={`h-5 w-5 ${item.id === 'total-farms' ? 'text-white' : item.color.replace('bg-', 'text-')}`} />
                </div>
                <span className={`text-[10px] font-black ${item.id === 'total-farms' ? 'text-white/40' : 'text-gray-400'} uppercase tracking-widest`}>STATUS</span>
              </div>

              <div>
                <p className={`text-[8px] sm:text-[10px] font-black ${item.id === 'total-farms' ? 'text-white/60' : 'text-gray-500'} uppercase tracking-widest mb-0.5 sm:mb-1`}>{item.title}</p>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <h3 className={`text-xl sm:text-4xl font-black ${item.id === 'total-farms' ? 'text-white' : 'text-gray-900'} leading-none`}>
                    <CountUp end={parseInt(String(item.value).replace(/,/g, '')) || 0} duration={1000} />
                  </h3>
                  <span className={`text-[8px] sm:text-[10px] font-bold ${item.id === 'total-farms' ? 'text-white/80' : 'text-gray-500'} truncate`}>{item.subtext}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ZakatSmart Style Secondary Navigation Bar */}
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

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide bg-transparent p-0 h-auto gap-0 sm:gap-4 mb-4 sm:mb-8 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
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
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab
            farms={farms}
            activities={activities}
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
          handleLogVisit(farmer);
        }}
        onUploadMedia={(farmer) => {
          handleUploadReport(farmer);
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
    </AgentLayout>
  );
};

export default AgentDashboard;
