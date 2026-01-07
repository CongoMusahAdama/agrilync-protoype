import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import { TrainingPerformanceContent } from './agent/TrainingPerformance';
import { Button } from '@/components/ui/button';
import ActiveFarmsModal from '@/components/agent/ActiveFarmsModal';
import FarmJourneyModal from '@/components/agent/FarmJourneyModal';
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
  NotebookPen,
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
  ClipboardCheck
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

import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import Preloader from '@/components/ui/Preloader';

const MetricCardSkeleton = () => (
  <Card className="bg-gray-800/50 border-gray-700 rounded-lg p-3 sm:p-6 shadow-lg animate-pulse">
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg bg-gray-700" />
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
  const [activeTab, setActiveTab] = useState('overview');
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
  const [verificationQueueModalOpen, setVerificationQueueModalOpen] = useState(false);
  const [activeFarmsModalOpen, setActiveFarmsModalOpen] = useState(false);
  const [journeyModalOpen, setJourneyModalOpen] = useState(false);

  // useQuery for all-in-one dashboard data
  const { data: summaryData, isLoading: loading, isFetching, refetch: refreshData } = useQuery({
    queryKey: ['agentDashboardSummary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Disabled for mobile performance - reduces unnecessary refetches
    refetchOnMount: true, // Still refetch on mount to get fresh data
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // Wait 1 second between retries
    refetchOnReconnect: true // Refetch when connection is restored
  });

  // Extract data from summary with fallbacks
  const stats = summaryData?.stats || {};
  const farmers = summaryData?.farmers || [];
  const farms = summaryData?.farms || [];
  const notifications = summaryData?.notifications || [];
  const activities = summaryData?.activities || [];
  const matches = summaryData?.matches || [];
  const disputes = summaryData?.disputes || [];
  const pendingFarmers = summaryData?.pendingQueue || [];

  const loadingStats = loading;
  const loadingFarmers = loading;
  const loadingFarms = loading;
  const loadingQueue = loading;
  const loadingNotifications = loading;
  const loadingMatches = loading;
  const loadingActivities = loading;
  const loadingDisputes = loading;

  const fetchData = () => {
    refreshData();
  };


  // fetchData is now handled by useQuery

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

  const handleApproveMatch = (matchId: string) => {
    // In a real app, this would make an API call
    console.log('Approved match:', matchId);
    // Optimistic update could happen here or refresh data
  };

  const handleRejectMatch = (matchId: string) => {
    console.log('Rejected match:', matchId);
  };

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

  const handleEditFarmer = (farmer: any) => {
    setSelectedFarmer(farmer);
    setEditModalOpen(true);
  };

  const handleTrackJourney = (farmer: any) => {
    setSelectedFarmer(farmer);
    setJourneyModalOpen(true);
  };

  const filteredFarmers = useMemo(() => {
    return farmers.map((f: any) => {
      let displayStatus = f.status;
      if (displayStatus === 'active') displayStatus = 'Completed';
      if (displayStatus === 'pending') displayStatus = 'Pending';
      return { ...f, displayStatus };
    }).filter((farmer: any) => {
      const searchValue = farmerSearch.toLowerCase();
      const matchesSearch =
        farmer.name?.toLowerCase().includes(searchValue) ||
        (farmer.region && farmer.region.toLowerCase().includes(searchValue)) ||
        (farmer.community && farmer.community.toLowerCase().includes(searchValue));
      const matchesStatus =
        farmerStatusFilter === 'all' ? true : farmer.displayStatus === farmerStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [farmers, farmerSearch, farmerStatusFilter]);

  const filteredFarms = useMemo(() => {
    return farms.filter((farm: any) => {
      if (farmStatusFilter === 'all') return true;
      return farm.status === farmStatusFilter;
    });
  }, [farms, farmStatusFilter]);

  const highlightCards = [
    {
      id: 'farmers-management',
      title: 'Farmers Onboarded',
      value: farmers.length || 0,
      color: 'bg-emerald-600',
      icon: Users,
      path: '/dashboard/agent/farmers-management'
    },
    {
      id: 'farm-monitoring',
      title: 'Active Farms',
      value: farms.length || 0,
      color: 'bg-[#ffa500]',
      icon: Sprout,
      onClick: () => setActiveFarmsModalOpen(true)
    },
    {
      id: 'investor-farmer-matches',
      title: 'Investor Matches',
      value: stats?.investorMatches || 0,
      color: 'bg-[#ff6347]',
      icon: Handshake,
      path: '/dashboard/agent/investor-farmer-matches'
    },
    {
      id: 'reports-submitted',
      title: 'Reports Filed',
      value: stats?.reportsThisMonth || 0,
      color: 'bg-[#921573]',
      icon: ClipboardCheck,
      path: '/dashboard/agent/farm-management?tab=reports'
    },
    {
      id: 'dispute-management',
      title: 'Pending Disputes',
      value: stats?.pendingDisputes || 0,
      color: 'bg-[#1d9bf0]',
      icon: AlertTriangle,
      path: '/dashboard/agent/dispute-management'
    }
  ];

  const statusStyles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    pending: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    inactive: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
    verified: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    Completed: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    scheduled: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    'needs-attention': 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
    'Pending Funding': 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    'Pending Approval': 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300',
    'Under Review': 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
    Active: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    Ongoing: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
    Resolved: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
  };


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
        className={`${darkMode
          ? 'border-[#1b5b65] text-gray-100 hover:bg-[#0d3036]'
          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
          }`}
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

  const tableHeaderRowClass = 'bg-[#1db954] border-[#1db954] text-white';
  const tableBodyRowClass = darkMode ? 'border-b border-[#124b53] hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : '';

  // Show preloader on initial load or when fetching data
  if ((loading || isFetching) && !summaryData) {
    return <Preloader />;
  }

  return (
    <AgentLayout
      activeSection="profile-overview"
      title="Dashboard"
    >
      <div className="mb-6 sm:mb-8">
        <h2 className={`dashboard-title mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {getGreeting()}, {agent?.name?.split(' ')[0] || 'Agent'}!
        </h2>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Track your field operations and grower support pipeline.
        </p>
      </div>

      {/* Key Metric Cards - 6-column Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-6 mb-8">
        {/* Verification Queue - Deep Teal */}
        {loadingQueue ? (
          <MetricCardSkeleton />
        ) : (
          <Card
            className={`bg-[#002f37] rounded-lg p-3 sm:p-6 shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 relative overflow-hidden opacity-100 translate-y-0`}
            style={{ transitionDelay: '0ms' }}
            onClick={() => setVerificationQueueModalOpen(true)}
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <UserCheck className="h-24 w-24 sm:h-32 sm:w-32 text-white rotate-12" />
              </div>
              {/* Subtle pulsating circles for "active queue" feel */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 rounded-full animate-pulse pointer-events-none" />
            </div>

            <div className="flex flex-col h-full relative z-10">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                <div className="p-1.5 sm:p-2 rounded-lg bg-white/10">
                  <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-400" />
                </div>
                <p className="text-[10px] sm:text-sm font-medium text-white uppercase tracking-wider">Verification Queue</p>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-baseline gap-1 sm:gap-2 mb-0.5 sm:mb-2 text-white">
                  <p className="big-metric">
                    <CountUp end={pendingFarmers.length} duration={1000} />
                  </p>
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-emerald-400">Backlog</span>
                </div>
                <p className="text-[10px] sm:text-sm text-white/80 line-clamp-1 italic">Growers awaiting accreditation</p>
              </div>
              <div className="mt-2 sm:mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i: number) => (
                    <div key={i} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-[#002f37] bg-gray-500 overflow-hidden`}>
                      <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Farmer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-[10px] sm:text-xs text-[#7ede56] font-bold flex items-center gap-1">
                  Process <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Other Metric Cards */}
        {highlightCards.map((card: any, index: number) => {
          const isLoading =
            (card.id === 'farmers-management' && loadingFarmers) ||
            (card.id === 'farm-monitoring' && loadingFarms) ||
            ((card.id === 'investor-farmer-matches' || card.id === 'reports-submitted' || card.id === 'dispute-management') && loadingStats);

          return isLoading ? (
            <MetricCardSkeleton key={`skeleton-${card.id}`} />
          ) : (
            <Card
              key={card.id}
              className={`${card.color} rounded-lg p-3 sm:p-6 shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 relative overflow-hidden opacity-100 translate-y-0`}
              style={{ transitionDelay: `${(index + 1) * 50}ms` }}
              onClick={() => {
                if (card.onClick) {
                  card.onClick();
                } else if (card.path) {
                  navigate(card.path as string);
                }
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <card.icon className="absolute top-1 right-1 h-12 w-12 text-white rotate-12" />
              </div>

              <div className="flex flex-col h-full relative z-10">
                <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                  <card.icon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                  <p className="text-[10px] sm:text-sm font-medium text-white">{card.title}</p>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="big-metric text-white">
                    <CountUp end={Number(card.value)} duration={1000} />
                  </p>
                </div>
                <div className="flex justify-end mt-2 sm:mt-4">
                  <div className="text-[10px] sm:text-sm font-medium text-white hover:underline flex items-center gap-1">
                    Details <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide bg-transparent p-0 h-auto gap-2 sm:gap-4 mb-4 sm:mb-8 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <TabsTrigger
            value="overview"
            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'overview'
              ? 'border-[#7ede56] text-[#7ede56] bg-[#7ede56]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="farmers"
            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'farmers'
              ? 'border-[#7ede56] text-[#7ede56] bg-[#7ede56]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Farmers
          </TabsTrigger>
          <TabsTrigger
            value="field-ops"
            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'field-ops'
              ? 'border-[#7ede56] text-[#7ede56] bg-[#7ede56]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Sprout className="w-4 h-4 mr-2" />
            Field Ops
          </TabsTrigger>
          <TabsTrigger
            value="partnerships"
            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'partnerships'
              ? 'border-[#7ede56] text-[#7ede56] bg-[#7ede56]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Handshake className="w-4 h-4 mr-2" />
            Partnerships
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'training'
              ? 'border-[#7ede56] text-[#7ede56] bg-[#7ede56]/5'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Training & Perf.
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className={`${sectionCardClass} transition-colors h-[500px] flex flex-col`}>
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-5 w-5 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
                  <CardTitle className={`section-title ${darkMode ? 'text-gray-100' : ''}`}>Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {loadingActivities ? (
                    Array(5).fill(0).map((_: any, i: number) => (
                      <div key={`activity-skeleton-${i}`} className="flex gap-4">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4 bg-gray-700" />
                          <Skeleton className="h-3 w-1/4 bg-gray-700" />
                        </div>
                      </div>
                    ))
                  ) : activities.length > 0 ? (
                    activities.map((activity: any, index: number) => (
                      <div key={activity._id || index} className="flex gap-4 relative">
                        {index !== activities.length - 1 && (
                          <div className={`absolute left-[19px] top-8 bottom-0 w-0.5 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`} />
                        )}
                        <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 ${darkMode ? 'border-[#0b2528] bg-gray-800' : 'border-white bg-gray-50'
                          }`}>
                          {activity.type === 'training' ? <Users className="h-4 w-4 text-emerald-500" /> :
                            activity.type === 'report' ? <FileText className="h-4 w-4 text-blue-500" /> :
                              activity.type === 'verification' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                                activity.type === 'dispute' ? <AlertTriangle className="h-4 w-4 text-amber-500" /> :
                                  <Info className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1 pt-1 pb-4">
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{activity.title}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                        <ClipboardCheck className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No recent activity</p>
                      <p className="text-xs text-gray-400">Your recent actions will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notifications Hub */}
            <Card className={`${sectionCardClass} transition-colors h-[500px] flex flex-col`}>
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Bell className={`h-5 w-5 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-pulse">
                          {unreadNotifications}
                        </span>
                      )}
                    </div>
                    <CardTitle className={`section-title ${darkMode ? 'text-gray-100' : ''}`}>Notifications</CardTitle>
                  </div>
                  {unreadNotifications > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#1db954] hover:text-[#17a447] hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-4">
                  {['all', 'alert', 'update'].map((filter: string) => (
                    <button
                      key={filter}
                      onClick={() => setNotificationFilter(filter as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${notificationFilter === filter
                        ? 'bg-[#1db954] text-white shadow-md'
                        : darkMode
                          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}s
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {loadingNotifications ? (
                    Array(5).fill(0).map((_: any, i: number) => (
                      <div key={`notif-skeleton-${i}`} className="flex gap-4 p-3 h-20">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4 bg-gray-700" />
                          <Skeleton className="h-3 w-1/4 bg-gray-700" />
                          <Skeleton className="h-3 w-1/2 bg-gray-700" />
                        </div>
                      </div>
                    ))
                  ) : filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification: any) => (
                      <div
                        key={notification._id}
                        onClick={() => toggleReadStatus(notification._id, notification.type)}
                        className={`group relative flex items-start gap-4 rounded-xl p-3 transition-all cursor-pointer border ${darkMode
                          ? notification.read
                            ? 'bg-transparent border-transparent hover:bg-[#0f3035]'
                            : 'bg-[#0f3035]/50 border-[#1b5b65] hover:bg-[#0f3035]'
                          : notification.read
                            ? 'bg-transparent border-transparent hover:bg-gray-50'
                            : 'bg-blue-50/50 border-blue-100 hover:bg-blue-50'
                          }`}
                      >
                        {/* Status Indicator */}
                        {!notification.read && (
                          <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#1db954]" />
                        )}

                        {/* Icon */}
                        <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.type === 'alert' || notification.priority === 'high'
                          ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                          : notification.type === 'training' || notification.type === 'verification'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                          }`}>
                          {notification.type === 'alert' ? <AlertTriangle className="h-5 w-5" /> :
                            notification.type === 'training' ? <Users className="h-5 w-5" /> :
                              notification.type === 'report' ? <FileText className="h-5 w-5" /> :
                                <Info className="h-5 w-5" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                              }`}>
                              {notification.type}
                            </span>
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className={`text-sm font-semibold mb-1 leading-snug ${darkMode
                            ? notification.read ? 'text-gray-400' : 'text-gray-100'
                            : notification.read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                            {notification.message}
                          </h4>

                          {/* Action Link (appearing on hover) */}
                          <div className="mt-2 flex items-center gap-1 text-xs text-[#1db954] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details <ArrowUpRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                        <Bell className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No notifications</p>
                      <p className="text-xs text-gray-400">We'll let you know when something happens</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className={`${sectionCardClass} transition-colors`}>
              <CardHeader>
                <CardTitle className={`section-title ${darkMode ? 'text-gray-100' : ''}`}>This Month</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                  Your monthly performance summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`rounded-lg border p-4 ${darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Reports Submitted
                    </span>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {stats?.reportsThisMonth || 0}
                    </span>
                  </div>
                </div>
                <div className={`rounded-lg border p-4 ${darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Training Sessions
                    </span>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {stats?.trainingsAttended || 0}
                    </span>
                  </div>
                </div>
                <div className={`rounded-lg border p-4 ${darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Field Visits
                    </span>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      {farms.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Farmers Tab */}
        <TabsContent value="farmers" className="space-y-6">
          <Card className={`${sectionCardClass} transition-colors`}>
            <CardHeader>
              <CardTitle className={`section-title ${darkMode ? 'text-gray-100' : ''}`}>Farmers Management</CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                Search, onboard, and verify farmers on your roster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-64">
                  <Search
                    className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${darkMode ? 'text-gray-300' : 'text-gray-400'
                      }`}
                  />
                  <Input
                    placeholder="Search farmers..."
                    value={farmerSearch}
                    onChange={(event) => setFarmerSearch(event.target.value)}
                    className={`pl-9 ${inputBaseClasses}`}
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Select value={farmerStatusFilter} onValueChange={(value) => setFarmerStatusFilter(value as typeof farmerStatusFilter)}>
                    <SelectTrigger className={`w-full sm:w-40 ${selectTriggerClasses}`}>
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Farmers</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <AddFarmerModal
                    trigger={
                      <Button className="bg-[#1db954] hover:bg-[#17a447] text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Farmer
                      </Button>
                    }
                    onSuccess={fetchData}
                  />
                </div>
              </div>
              <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-[#0b2528]' : 'bg-white'}`}>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="bg-[#1db954] border-[#1db954]">
                        <TableHead className="w-12 pl-6">
                          <div className="flex items-center justify-center w-5 h-5 rounded border-2 border-white/50"></div>
                        </TableHead>
                        <TableHead className="text-white font-medium">FARMER NAME</TableHead>
                        <TableHead className="text-white font-medium">REGION</TableHead>
                        <TableHead className="text-white font-medium">LOCATION</TableHead>
                        <TableHead className="text-white font-medium">FARM TYPE</TableHead>
                        <TableHead className="text-white font-medium">STATUS</TableHead>
                        <TableHead className="text-right text-white font-medium pr-6">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFarmers.map((farmer: any, index: number) => (
                        <TableRow
                          key={farmer._id || index}
                          className={`border-b transition-colors ${darkMode
                            ? 'border-[#124b53] hover:bg-[#0d3036]'
                            : 'border-gray-100 hover:bg-gray-50'
                            }`}
                        >
                          <TableCell className="pl-6">
                            <div className={`flex items-center justify-center w-5 h-5 rounded ${index % 3 === 0
                              ? 'bg-[#FDB022] border-2 border-[#FDB022]'
                              : 'border-2 border-gray-300'
                              }`}>
                              {index % 3 === 0 && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={`py-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                            {farmer.name}
                          </TableCell>
                          <TableCell className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {farmer.region}
                          </TableCell>
                          <TableCell className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {farmer.community}
                          </TableCell>
                          <TableCell className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {farmer.farmType}
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${farmer.displayStatus === 'Completed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                              : farmer.displayStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300'
                              }`}>
                              {farmer.displayStatus}
                            </span>
                          </TableCell>
                          <TableCell className="pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewFarmer(farmer)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode
                                  ? 'bg-cyan-600 hover:bg-cyan-500'
                                  : 'bg-cyan-600 hover:bg-cyan-700'
                                  }`}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={() => handleEditFarmer(farmer)}
                                className="w-8 h-8 rounded-full bg-[#E91E63] hover:bg-[#C2185B] flex items-center justify-center transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Field Ops Tab */}
        <TabsContent value="field-ops" className="space-y-6">

          {/* Scheduled Visits Section */}
          <Card className={`${sectionCardClass} transition-colors border-l-4 border-l-blue-500`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={darkMode ? 'text-gray-100' : ''}>Scheduled Farm Visits</CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-400' : ''}>Upcoming visits requested by farmers</CardDescription>
                </div>
                <Button variant="outline" size="sm" className={darkMode ? 'border-gray-600' : ''}>
                  <Calendar className="mr-2 h-4 w-4" /> View Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className={tableHeaderRowClass}>
                      <TableHead className="text-white font-medium">FARMER</TableHead>
                      <TableHead className="text-white font-medium">FARM</TableHead>
                      <TableHead className="text-white font-medium">DATE & TIME</TableHead>
                      <TableHead className="text-white font-medium">PURPOSE</TableHead>
                      <TableHead className="text-white font-medium">STATUS</TableHead>
                      <TableHead className="text-right text-white font-medium">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {farms.filter((f: any) => f.nextVisit).map((farm: any) => (
                      <TableRow key={farm._id} className={darkMode ? 'border-gray-700 hover:bg-[#0f3035]' : 'hover:bg-gray-50'}>
                        <TableCell className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{farm.farmer?.name || 'N/A'}</TableCell>
                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{farm.name}</TableCell>
                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          <div className="flex flex-col">
                            <span>{farm.nextVisit}</span>
                            <span className="text-xs opacity-70">09:00 AM</span>
                          </div>
                        </TableCell>
                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{farm.crop} Inspection</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
                            Scheduled
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className={darkMode ? 'text-gray-300' : 'text-gray-600'}
                              onClick={() => handleViewVisit(farm)}
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {farms.filter((f: any) => f.nextVisit).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No upcoming visits scheduled
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className={`${sectionCardClass} h-full transition-colors`}>
                <CardHeader>
                  <CardTitle className={darkMode ? 'text-gray-100' : ''}>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                    <Select value={farmStatusFilter} onValueChange={(value: any) => setFarmStatusFilter(value)}>
                      <SelectTrigger className={darkMode ? 'bg-[#0b2528] border-gray-600 text-gray-200' : ''}>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="scheduled">Visit Scheduled</SelectItem>
                        <SelectItem value="needs-attention">Needs Attention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card className={`${sectionCardClass} transition-colors`}>
                <CardHeader>
                  <CardTitle className={darkMode ? 'text-gray-100' : ''}>Active Farms</CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                    Monitoring {farms.length} assigned farms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className={tableHeaderRowClass}>
                          <TableHead className="text-white uppercase font-medium">Farm Name</TableHead>
                          <TableHead className="text-white uppercase font-medium">Farmer</TableHead>
                          <TableHead className="text-white uppercase font-medium">Location</TableHead>
                          <TableHead className="text-white uppercase font-medium">Status</TableHead>
                          <TableHead className="text-white uppercase font-medium">Last Visit</TableHead>
                          <TableHead className="text-white uppercase font-medium text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFarms.map((farm: any, index: number) => (
                          <TableRow key={farm.id || farm._id || index} className={tableBodyRowClass}>
                            <TableCell className={`${tableCellClass} font-medium`}>{farm.name}</TableCell>
                            <TableCell className={tableCellClass}>{farm.farmer?.name || 'N/A'}</TableCell>
                            <TableCell className={tableCellClass}>{farm.location || (farm.farmer ? `${farm.farmer.region}, ${farm.farmer.community}` : 'N/A')}</TableCell>
                            <TableCell className={tableCellClass}>
                              <Badge className={statusStyles[farm.status] ?? (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
                                {farm.status}
                              </Badge>
                            </TableCell>
                            <TableCell className={tableCellClass}>{farm.lastVisit || 'No visits yet'}</TableCell>
                            <TableCell className={`${tableCellClass} text-right`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={darkMode ? 'text-emerald-300 hover:bg-[#0d3036]' : 'text-emerald-700'}
                                onClick={() => handleViewFarmer(farm.farmer)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Partnerships Tab */}
        <TabsContent value="partnerships" className="space-y-6">

          {/* Pending Approvals Section */}
          {matches.some((m: any) => m.approvalStatus === 'pending') && (
            <Card className={`${sectionCardClass} border-purple-200 dark:border-purple-900/50 transition-colors mb-6`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <CardTitle className={darkMode ? 'text-purple-100' : 'text-purple-900'}>Pending Approvals</CardTitle>
                </div>
                <CardDescription className={darkMode ? 'text-purple-300/70' : 'text-purple-700/70'}>
                  These matches require your verification and approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={tableHeaderRowClass}>
                        <TableHead className="text-white font-medium">INVESTOR</TableHead>
                        <TableHead className="text-white font-medium">FARMER</TableHead>
                        <TableHead className="text-white font-medium">VALUE</TableHead>
                        <TableHead className="text-white font-medium">DOCUMENTS</TableHead>
                        <TableHead className="text-right text-white font-medium">ACTION</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matches.filter((m: any) => m.approvalStatus === 'pending').map((match: any) => (
                        <TableRow key={match.id} className={darkMode ? 'border-purple-900/30' : 'border-purple-100'}>
                          <TableCell className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.investor}</TableCell>
                          <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{match.farmer?.name || 'N/A'}</TableCell>
                          <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{match.value}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Badge variant="outline" className={`${match.documents?.farmerSignature ? 'bg-green-500/10 text-green-600 border-green-200' : 'text-gray-500'}`}>
                                Farmer
                              </Badge>
                              <Badge variant="outline" className={`${match.documents?.investorSignature ? 'bg-green-500/10 text-green-600 border-green-200' : 'text-gray-500'}`}>
                                Investor
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => handleReviewMatch(match)}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className={`${sectionCardClass} transition-colors`}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-gray-100' : ''}>Active Investments</CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                Monitor ongoing investment progress and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className={tableHeaderRowClass}>
                      <TableHead className="text-white uppercase">INVESTOR</TableHead>
                      <TableHead className="text-white uppercase">FARMER</TableHead>
                      <TableHead className="text-white uppercase">FARM TYPE</TableHead>
                      <TableHead className="text-white uppercase">MATCH DATE</TableHead>
                      <TableHead className="text-white uppercase">VALUE</TableHead>
                      <TableHead className="text-white uppercase">STATUS</TableHead>
                      <TableHead className="text-right text-white uppercase">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.filter((m: any) => m.status === 'Active Match').map((match: any) => (
                      <TableRow key={match._id} className={tableBodyRowClass}>
                        <TableCell className={`${tableCellClass} font-medium`}>{match.investor}</TableCell>
                        <TableCell className={tableCellClass}>{match.farmer?.name || 'N/A'}</TableCell>
                        <TableCell className={tableCellClass}>{match.farmType}</TableCell>
                        <TableCell className={tableCellClass}>{match.matchDate}</TableCell>
                        <TableCell className={tableCellClass}>{match.value}</TableCell>
                        <TableCell className={tableCellClass}>
                          <Badge className={statusStyles[match.status] ?? (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
                            {match.status}
                          </Badge>
                        </TableCell>
                        <TableCell className={`${tableCellClass} text-right`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={darkMode ? 'text-emerald-300 hover:bg-[#0d3036]' : 'text-emerald-700'}
                            onClick={() => handleViewMatch(match)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {matches.filter((m: any) => m.approvalStatus !== 'pending').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No active investments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Hub Tab */}
        <TabsContent value="training">
          <TrainingPerformanceContent />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ViewFarmerModal open={viewModalOpen} onOpenChange={setViewModalOpen} farmer={selectedFarmer} />
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
        open={verificationQueueModalOpen}
        onOpenChange={setVerificationQueueModalOpen}
        pendingFarmers={pendingFarmers}
        agent={agent}
        darkMode={darkMode}
        onSuccess={fetchData}
        onView={handleViewFarmer}
        onEdit={handleEditFarmer}
      />

      <ActiveFarmsModal
        open={activeFarmsModalOpen}
        onOpenChange={setActiveFarmsModalOpen}
        farms={farms}
        onTrackJourney={handleTrackJourney}
      />

      <FarmJourneyModal
        open={journeyModalOpen}
        onOpenChange={setJourneyModalOpen}
        farmer={selectedFarmer}
      />
    </AgentLayout>
  );
};

export default AgentDashboard;
