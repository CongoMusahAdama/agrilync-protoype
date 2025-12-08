import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import EditFarmerModal from '@/components/agent/EditFarmerModal';
import ViewMatchModal from '@/components/agent/ViewMatchModal';
import ReviewMatchModal from '@/components/agent/ReviewMatchModal';
import ViewDisputeModal from '@/components/agent/ViewDisputeModal';
import ViewVisitDetailsModal from '@/components/agent/ViewVisitDetailsModal';
import { TrainingPerformanceContent } from './agent/TrainingPerformance';
import {
  agentProfile,
  agentFarmers,
  agentAssignedFarms,
  agentMatches,
  agentDisputes,
  agentTrainings,
  agentPerformanceTrend,
  agentNotifications,
  scheduledVisits
} from './agent/agent-data';
import { Button } from '@/components/ui/button';
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
  Info
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

const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('overview');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerStatusFilter, setFarmerStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
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

  // Notification State
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'alert' | 'update'>('all');
  const [notifications, setNotifications] = useState(agentNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleReadStatus = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const filteredNotifications = notifications.filter(n => {
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

  const handleViewFarmer = (farmer: any) => {
    setSelectedFarmer(farmer);
    setViewModalOpen(true);
  };

  const handleEditFarmer = (farmer: any) => {
    setSelectedFarmer(farmer);
    setEditModalOpen(true);
  };

  const highlightCards = [
    {
      id: 'farmers-management',
      title: 'Farmers Onboarded',
      value: agentProfile.stats.farmersOnboarded,
      subtitle: 'Total growers on your roster',
      color: 'bg-[#1db954]',
      textColor: 'text-white',
      icon: Users,
      path: '/dashboard/agent/farmers-management'
    },
    {
      id: 'farm-monitoring',
      title: 'Active Farms',
      value: agentProfile.stats.activeFarms,
      subtitle: 'Farms under monitoring',
      color: 'bg-[#f97316]',
      textColor: 'text-white',
      icon: Sprout,
      path: '/dashboard/agent/farm-monitoring'
    },
    {
      id: 'investor-farmer-matches',
      title: 'Investor Matches',
      value: agentProfile.stats.investorMatches,
      subtitle: 'Active partnerships',
      color: 'bg-[#7c3aed]',
      textColor: 'text-white',
      icon: Handshake,
      path: '/dashboard/agent/investor-farmer-matches'
    },
    {
      id: 'dispute-management',
      title: 'Pending Disputes',
      value: agentProfile.stats.pendingDisputes,
      subtitle: 'Issues to resolve',
      color: 'bg-[#ef4444]',
      textColor: 'text-white',
      icon: AlertTriangle,
      path: '/dashboard/agent/dispute-management'
    }
  ];

  const statusStyles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    pending: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    inactive: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
    verified: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    scheduled: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    'needs-attention': 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
    'Pending Funding': 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    'Pending Approval': 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300',
    'Under Review': 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
    Completed: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    Active: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
    Ongoing: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300',
    Resolved: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
  };

  const filteredFarmers = useMemo(() => {
    return agentFarmers.filter((farmer) => {
      const searchValue = farmerSearch.toLowerCase();
      const matchesSearch =
        farmer.name.toLowerCase().includes(searchValue) ||
        farmer.region.toLowerCase().includes(searchValue) ||
        farmer.community.toLowerCase().includes(searchValue);
      const matchesStatus =
        farmerStatusFilter === 'all' ? true : farmer.status === farmerStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [farmerSearch, farmerStatusFilter]);

  const filteredFarms = useMemo(() => {
    return agentAssignedFarms.filter((farm) => {
      if (farmStatusFilter === 'all') return true;
      return farm.status === farmStatusFilter;
    });
  }, [farmStatusFilter]);

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

  return (
    <AgentLayout
      activeSection="profile-overview"
      title={`${getGreeting()}, ${agentProfile.name.split(' ')[0]}!`}
      subtitle="Track your field operations and grower support pipeline."
    >
      {/* Stats Overview - Simplified to 4 cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {highlightCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => navigate(card.path)}
            className={`relative overflow-hidden rounded-xl p-4 text-left shadow-md transition-all hover:shadow-xl hover:scale-105 ${card.color} ${card.textColor}`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs opacity-80">{card.title}</p>
              </div>
            </div >
          </button>
        ))}
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`w-full justify-start overflow-x-auto whitespace-nowrap scrollbar-hide flex ${darkMode ? 'bg-[#0b2528] border border-[#124b53]' : 'bg-gray-100'}`}>
          <TabsTrigger value="overview" className={`flex-1 min-w-[100px] ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}`}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="farmers" className={`flex-1 min-w-[100px] ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}`}>
            Farmers
          </TabsTrigger>
          <TabsTrigger value="farms" className={`flex-1 min-w-[100px] ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}`}>
            Farms
          </TabsTrigger>
          <TabsTrigger value="matches" className={`flex-1 min-w-[100px] ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}`}>
            Matches
          </TabsTrigger>
          <TabsTrigger value="performance" className={`flex-1 min-w-[100px] ${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}`}>
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            {/* Notifications Hub */}
            <Card className={`${sectionCardClass} transition-colors h-[500px] flex flex-col`}>
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Bell className={`h-5 w-5 ${darkMode ? 'text-gray-100' : 'text-gray-700'}`} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <CardTitle className={darkMode ? 'text-gray-100' : ''}>Notifications</CardTitle>
                  </div>
                  {unreadCount > 0 && (
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
                  {['all', 'alert', 'update'].map((filter) => (
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
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => toggleReadStatus(notification.id)}
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
                              {notification.time}
                            </span>
                          </div>
                          <h4 className={`text-sm font-semibold mb-1 leading-snug ${darkMode
                            ? notification.read ? 'text-gray-400' : 'text-gray-100'
                            : notification.read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                            {notification.title}
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
                        <Check className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">All caught up!</p>
                      <p className="text-xs text-gray-400">No new notifications in this category</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className={`${sectionCardClass} transition-colors`}>
              <CardHeader>
                <CardTitle className={darkMode ? 'text-gray-100' : ''}>This Month</CardTitle>
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
                      {agentProfile.stats.reportsThisMonth}
                    </span>
                  </div>
                </div>
                <div className={`rounded-lg border p-4 ${darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Training Sessions
                    </span>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {agentProfile.stats.trainingsAttended}
                    </span>
                  </div>
                </div>
                <div className={`rounded-lg border p-4 ${darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Field Visits
                    </span>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                      {agentAssignedFarms.length}
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
              <CardTitle className={darkMode ? 'text-gray-100' : ''}>Farmers Management</CardTitle>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
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
                  />
                </div>
              </div>
              <div className={`rounded-lg overflow-hidden overflow-x-auto ${darkMode ? 'bg-[#0b2528]' : 'bg-white'}`}>
                <Table>
                  <TableHeader>
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
                    {filteredFarmers.map((farmer, index) => (
                      <TableRow
                        key={farmer.name}
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
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${farmer.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : farmer.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300'
                            }`}>
                            {farmer.status}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Farm Monitoring Tab */}
        <TabsContent value="farms" className="space-y-6">

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
                    {scheduledVisits.map((visit) => (
                      <TableRow key={visit.id} className={darkMode ? 'border-gray-700 hover:bg-[#0f3035]' : 'hover:bg-gray-50'}>
                        <TableCell className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{visit.farmer}</TableCell>
                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{visit.farm}</TableCell>
                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          <div className="flex flex-col">
                            <span>{visit.date}</span>
                            <span className="text-xs opacity-70">{visit.time}</span>
                          </div>
                        </TableCell>
                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{visit.purpose}</TableCell>
                        <TableCell>
                          <Badge className={visit.status === 'Confirmed'
                            ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                            : 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20'}>
                            {visit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {visit.status === 'Pending' ? (
                              <>
                                <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">Accept</Button>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">Reschedule</Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className={darkMode ? 'text-gray-300' : 'text-gray-600'}
                                onClick={() => handleViewVisit(visit)}
                              >
                                Details
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
                    Monitoring {agentAssignedFarms.length} assigned farms
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
                        {filteredFarms.map((farm: any) => (
                          <TableRow key={farm.id} className={tableBodyRowClass}>
                            <TableCell className={`${tableCellClass} font-medium`}>{farm.name}</TableCell>
                            <TableCell className={tableCellClass}>{farm.farmerName}</TableCell>
                            <TableCell className={tableCellClass}>{farm.location}</TableCell>
                            <TableCell className={tableCellClass}>
                              <Badge className={statusStyles[farm.status] ?? (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
                                {farm.status}
                              </Badge>
                            </TableCell>
                            <TableCell className={tableCellClass}>{farm.lastVisit}</TableCell>
                            <TableCell className={`${tableCellClass} text-right`}>
                              <Button variant="ghost" size="sm" className={darkMode ? 'text-emerald-300 hover:bg-[#0d3036]' : 'text-emerald-700'}>
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

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-6">

          {/* Pending Approvals Section */}
          {agentMatches.some(m => m.approvalStatus === 'pending') && (
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
                      {agentMatches.filter(m => m.approvalStatus === 'pending').map((match) => (
                        <TableRow key={match.id} className={darkMode ? 'border-purple-900/30' : 'border-purple-100'}>
                          <TableCell className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.investor}</TableCell>
                          <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{match.farmer}</TableCell>
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
                    {agentMatches.filter(m => m.approvalStatus !== 'pending').map((match) => (
                      <TableRow key={`${match.investor}-${match.farmer}`} className={tableBodyRowClass}>
                        <TableCell className={`${tableCellClass} font-medium`}>{match.investor}</TableCell>
                        <TableCell className={tableCellClass}>{match.farmer}</TableCell>
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
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <TrainingPerformanceContent />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ViewFarmerModal open={viewModalOpen} onOpenChange={setViewModalOpen} farmer={selectedFarmer} />
      <EditFarmerModal open={editModalOpen} onOpenChange={setEditModalOpen} farmer={selectedFarmer} />
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
    </AgentLayout>
  );
};

export default AgentDashboard;
