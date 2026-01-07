import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Briefcase,
  RefreshCw,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  X,
  User,
  Building,
  CheckCircle2,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Leaf,
  TrendingUp,
  CircleDot,
  Phone,
  Mail,
  AlertCircle,
  Plus,
  Upload,
  Flag,
  Camera
} from 'lucide-react';
import AgentLayout from './AgentLayout';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { toast } from 'sonner';

// Helper functions used in the file
const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-emerald-100 text-emerald-700';
    case 'completed': return 'bg-blue-100 text-blue-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    case 'flagged': return 'bg-rose-100 text-rose-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getSeverityBadge = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'high': return 'bg-rose-100 text-rose-700';
    case 'medium': return 'bg-amber-100 text-amber-700';
    case 'low': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const InvestorFarmerMatchesDashboard: React.FC = () => {
  const { darkMode } = useDarkMode();
  const { agent } = useAuth();
  const { data: summaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ['agentDashboardSummary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2
  });

  const { data: farmersList = [] } = useQuery({
    queryKey: ['agentFarmers'],
    queryFn: async () => {
      const response = await api.get('/farmers');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - consistent caching
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2
  });

  // Use real data from API only - no mock fallback
  const matches = summaryData?.matches || [];
  const issues = summaryData?.disputes || [];
  const loading = loadingSummary;
  const isLoaded = !loadingSummary;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [investmentTypeFilter, setInvestmentTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [activeMetricFilter, setActiveMetricFilter] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'matches' | 'issues' | 'opportunities'>('matches');
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [isSubmittingMatch, setIsSubmittingMatch] = useState(false);


  const handleSubmitMatch = async () => {
    if (!selectedFarmerId || !selectedOpportunity) return;

    setIsSubmittingMatch(true);
    try {
      await api.post('/matches', {
        farmerId: selectedFarmerId,
        investor: selectedOpportunity.investor,
        farmType: selectedOpportunity.type, // Map type to farmType roughly
        value: selectedOpportunity.valueRange,
        investmentType: selectedOpportunity.type,
        category: 'Partnership'
      });
      toast.success('Match proposal submitted successfully!');
      setShowMatchModal(false);
      // Refresh matches
      window.location.reload(); // Simple refresh for now or invalidate query if I had queryClient
    } catch (err) {
      toast.error('Failed to create match');
    } finally {
      setIsSubmittingMatch(false);
    }
  };

  // Fetch Opportunities from API only
  const { data: opportunitiesData, isLoading: loadingOpportunities } = useQuery({
    queryKey: ['agentOpportunities'],
    queryFn: async () => {
      try {
        const response = await api.get('/opportunities');
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
        return []; // Return empty array on error, no mock fallback
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - consistent with other queries
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2
  });

  const opportunities = opportunitiesData || [];

  // Calculate metrics
  const totalMatches = matches.length;
  const pendingMatches = matches.filter((m: any) => m.status === 'Pending Approval' || m.status === 'Pending Funding').length;
  const activeInvestments = matches.filter((m: any) => m.status === 'Active').length;
  const completedPartnerships = matches.filter((m: any) => m.status === 'Completed').length;
  const flaggedIssuesCount = issues.filter((i: any) => i.status !== 'Resolved').length;

  // Filter matches
  const filteredMatches = matches.filter((match: any) => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      (match.farmer?.name && match.farmer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (match.investor && match.investor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (match.category && match.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (match.farmer?.region && match.farmer.region.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'all' || match.status.toLowerCase() === statusFilter.toLowerCase();

    // Investment type filter
    const matchesInvestmentType = investmentTypeFilter === 'all' ||
      (match.investmentType && match.investmentType.toLowerCase().includes(investmentTypeFilter.toLowerCase()));

    // Region filter
    const matchesRegion = regionFilter === 'all' ||
      (match.farmer?.region && match.farmer.region.toLowerCase() === regionFilter.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === 'all' ||
      (match.farmType && match.farmType.toLowerCase() === categoryFilter.toLowerCase());

    // Metric card filter
    const matchesMetric = !activeMetricFilter ||
      (activeMetricFilter === 'total') ||
      (activeMetricFilter === 'pending' && (match.status === 'Pending Approval' || match.status === 'Pending Funding')) ||
      (activeMetricFilter === 'active' && match.status === 'Active') ||
      (activeMetricFilter === 'completed' && match.status === 'Completed');

    return matchesSearch && matchesStatus && matchesInvestmentType && matchesRegion && matchesCategory && matchesMetric;
  });

  // Sort matches
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.matchDate || b.createdAt).getTime() - new Date(a.matchDate || a.createdAt).getTime();
    }
    if (sortBy === 'value') {
      const aValue = parseInt(a.value?.replace(/[^0-9]/g, '') || '0');
      const bValue = parseInt(b.value?.replace(/[^0-9]/g, '') || '0');
      return bValue - aValue;
    }
    return 0;
  });

  const handleMetricClick = (metric: string) => {
    setActiveMetricFilter(prev => prev === metric ? null : metric);
  };

  const handleViewMatch = (match: any) => {
    setSelectedMatch(match);
    setShowMatchModal(true);
  };

  return (
    <AgentLayout
      activeSection="investor-farmer-matches"
      title="Investor Matches"
    >
      <div className="space-y-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {[
            { label: 'Total Matches', value: totalMatches, icon: Briefcase, color: 'bg-purple-600', filter: 'total' },
            { label: 'Pending Updates', value: pendingMatches, icon: RefreshCw, color: 'bg-orange-600', filter: 'pending' },
            { label: 'Active Projects', value: activeInvestments, icon: DollarSign, color: 'bg-emerald-600', filter: 'active' },
            { label: 'Completed', value: completedPartnerships, icon: CheckCircle, color: 'bg-blue-600', filter: 'completed' },
            { label: 'Flagged Issues', value: flaggedIssuesCount, icon: AlertTriangle, color: 'bg-red-600', filter: 'flagged' },
          ].map((card: any, idx: number) => (
            <Card
              key={card.label}
              className={`${card.color} border-none rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-700 relative overflow-hidden ${activeMetricFilter === card.filter ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
              onClick={() => handleMetricClick(card.filter)}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <card.icon className="absolute top-1 right-1 h-12 w-12 text-white rotate-12" />
              </div>

              <div className="p-3 sm:p-5 flex flex-col h-full relative z-10 text-left">
                <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                  <card.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  <p className="text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider">{card.label}</p>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="big-metric text-white">{card.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search, Filter & Sorting Bar */}
        <Card className={darkMode ? 'bg-[#0b2528] border-[#1b5b65]' : ''}>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <Input
                  placeholder="Search by farmer, investor, farm type, or region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 w-full">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className={`w-full sm:w-[140px] ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={investmentTypeFilter} onValueChange={setInvestmentTypeFilter}>
                  <SelectTrigger className={`w-full sm:w-[150px] ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}>
                    <SelectValue placeholder="Investment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="input">Input Support</SelectItem>
                    <SelectItem value="land">Land Prep</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="cash">Cash Support</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className={`w-full sm:w-[130px] ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="ashanti">Ashanti</SelectItem>
                    <SelectItem value="northern">Northern</SelectItem>
                    <SelectItem value="eastern">Eastern</SelectItem>
                    <SelectItem value="volta">Volta</SelectItem>
                    <SelectItem value="bono">Bono</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className={`w-full sm:w-[130px] ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="crop">Crop</SelectItem>
                    <SelectItem value="livestock">Livestock</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className={`w-full sm:w-[140px] ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-gray-100' : ''}`}>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="value">Highest Value</SelectItem>
                    <SelectItem value="urgent">Urgent/Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeMetricFilter && (
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary" className={`capitalize ${darkMode ? 'bg-[#1b5b65] text-gray-200' : ''}`}>
                  Filtering by: {activeMetricFilter}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setActiveMetricFilter(null)} className={darkMode ? 'hover:bg-[#1b5b65] text-gray-300' : ''}>
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matches and Issues Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'matches' | 'issues' | 'opportunities')} className="w-full">
          <TabsList className={`grid grid-cols-3 w-full mb-6 p-1 gap-1 rounded-xl h-auto ${darkMode ? 'bg-[#0b2528] border border-[#1b5b65]' : 'bg-gray-100 border border-gray-200 shadow-sm'}`}>
            <TabsTrigger
              value="matches"
              className={`py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider h-auto min-h-[44px] rounded-lg transition-all whitespace-normal leading-tight ${darkMode ? 'data-[state=active]:bg-[#1b5b65] data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-emerald-600'}`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <Briefcase className="h-4 w-4 sm:hidden" />
                <span>
                  <span className="sm:hidden">Matches</span>
                  <span className="hidden sm:inline">Active Partnerships</span>
                  <span className="ml-1 opacity-70">({sortedMatches.length})</span>
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              className={`py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider h-auto min-h-[44px] rounded-lg transition-all whitespace-normal leading-tight ${darkMode ? 'data-[state=active]:bg-[#1b5b65] data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-emerald-600'}`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>
                  <span className="sm:hidden">Invest</span>
                  <span className="hidden sm:inline">Opportunities</span>
                  <span className="ml-1 opacity-70">({opportunities.length})</span>
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className={`py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider h-auto min-h-[44px] rounded-lg transition-all whitespace-normal leading-tight ${darkMode ? 'data-[state=active]:bg-[#1b5b65] data-[state=active]:text-white' : 'data-[state=active]:bg-white data-[state=active]:text-emerald-600'}`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  <span className="sm:hidden">Issues</span>
                  <span className="hidden sm:inline">Resolution Center</span>
                  <span className="ml-1 opacity-70">({issues.filter((i: any) => i.status !== 'Resolved').length})</span>
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Card className={darkMode ? 'bg-[#0b2528] border-[#1b5b65]' : ''}>
              <CardContent className="pt-6">

                {/* Mobile Card List View */}
                <div className="block sm:hidden space-y-4">
                  {sortedMatches.map((match) => (
                    <div key={match.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                            <User className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          </div>
                          <div>
                            <div className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.farmer.name}</div>
                            <div className="flex items-center gap-1">
                              {match.farmer.verified && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{match.farmer.region}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusBadge(match.status)} capitalize border`}>
                          {match.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-blue-50 dark:bg-[#0b2528] border border-transparent dark:border-[#1b5b65]">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                          <Building className={`h-3 w-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <span className={`text-sm font-medium ${darkMode ? 'text-amber-400' : 'text-gray-700'}`}>{match.investor.name}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-4">
                        <div>
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Category</span>
                          <div className={darkMode ? 'text-emerald-300' : 'text-gray-900'}>{match.category}</div>
                        </div>
                        <div>
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Investment</span>
                          <div className={`font-medium ${darkMode ? 'text-emerald-400' : 'text-green-600'}`}>{match.investmentValue}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={darkMode ? 'text-gray-600' : 'text-gray-500'}>Progress</span>
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{match.progress}%</span>
                        </div>
                        <Progress value={match.progress} className="h-2" />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMatch(match)}
                        className={`w-full ${darkMode ? 'bg-[#7ede56] text-white border-[#7ede56] hover:bg-[#6bc947]' : 'border-[#7ede56] text-[#7ede56] hover:bg-[#7ede56] hover:text-white'}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
                  {sortedMatches.length === 0 && (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <p>No matches found.</p>
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  {/* ... (keeping existing desktop table for matches) ... */}
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1db954] border-[#1db954]">
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Investor</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Farmer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Investment</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Progress</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedMatches.map((match) => (
                        <tr key={match.id} className={`border-b transition-colors ${darkMode ? 'border-[#1b5b65]/50 hover:bg-[#0f3035]' : 'border-gray-100 hover:bg-gray-50'}`}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                <Building className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                              </div>
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.investor.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                <User className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                              </div>
                              <div>
                                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.farmer.name}</span>
                                {match.farmer.verified && (
                                  <CheckCircle2 className="h-3 w-3 text-blue-500 inline ml-1" />
                                )}
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{match.farmer.region}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <span className={darkMode ? 'text-white' : 'text-gray-900'}>{match.category}</span>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{match.farmType}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <span className="font-medium text-green-600">{match.investmentValue}</span>
                              <p className="text-xs text-gray-500">{match.investmentType}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-32">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{match.progress}%</span>
                              </div>
                              <Progress
                                value={match.progress}
                                className={`h-2 ${match.status === 'completed' ? '[&>div]:bg-blue-500' :
                                  match.status === 'flagged' ? '[&>div]:bg-red-500' :
                                    match.status === 'pending' ? '[&>div]:bg-orange-500' :
                                      '[&>div]:bg-green-500'
                                  }`}
                              />
                              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{match.updates?.length || 0} updates</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`${getStatusBadge(match.status)} capitalize border`}>
                              {match.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewMatch(match)}
                              className={`${darkMode ? 'bg-[#7ede56] text-white border-[#7ede56] hover:bg-[#6bc947]' : 'border-[#7ede56] text-[#7ede56] hover:bg-[#7ede56] hover:text-white'}`}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sortedMatches.length === 0 && (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <p>No matches found. Try adjusting your filters.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp: any) => (
                <Card key={opp._id} className={`${darkMode ? 'bg-[#0b2528] border-[#1b5b65]' : 'bg-white'} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                          <Building className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold">{opp.investor}</CardTitle>
                          <CardDescription className="text-xs">{opp.type}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{opp.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-bold text-lg text-emerald-600">{opp.valueRange}</h4>
                      <h5 className={`font-semibold text-sm mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{opp.title}</h5>
                      <p className={`text-xs mt-2 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {opp.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {opp.targetRegions && opp.targetRegions.length > 0 ? opp.targetRegions.map((r: string) => (
                        <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>
                      )) : <Badge variant="secondary" className="text-[10px]">All Regions</Badge>}
                    </div>

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        setSelectedOpportunity(opp);
                        setShowMatchModal(true);
                      }}
                    >
                      Match Farmer
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {opportunities.length === 0 && (
                <Card className={`col-span-full p-12 text-center border-dashed ${darkMode ? 'bg-transparent border-[#1b5b65]' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <TrendingUp className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Opportunities Yet</h3>
                    <p className="text-gray-500 max-w-sm">There are currently no open investment opportunities matching your criteria.</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Match Modal */}
          <Dialog open={showMatchModal} onOpenChange={setShowMatchModal}>
            <DialogContent className={darkMode ? 'bg-[#0b2528] border-[#1b5b65] text-white' : ''}>
              <DialogHeader>
                <DialogTitle>Match Farmer to Opportunity</DialogTitle>
                <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
                  Select a farmer from your list to apply for this {selectedOpportunity?.title} opportunity.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Farmer</Label>
                  <Select onValueChange={setSelectedFarmerId}>
                    <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65]' : ''}>
                      <SelectValue placeholder="Choose a farmer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {farmersList.map((f: any) => (
                        <SelectItem key={f._id} value={f._id}>{f.name} - {f.community}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg text-sm text-emerald-700 dark:text-emerald-400">
                  <p className="font-bold mb-1">Opportunity Details:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Investor: {selectedOpportunity?.investor}</li>
                    <li>Type: {selectedOpportunity?.type}</li>
                    <li>Value: {selectedOpportunity?.valueRange}</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowMatchModal(false)} className={darkMode ? 'border-[#1b5b65] text-gray-300 hover:bg-[#1b5b65]' : ''}>Cancel</Button>
                <Button
                  onClick={handleSubmitMatch}
                  disabled={!selectedFarmerId || isSubmittingMatch}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmittingMatch ? 'Submitting...' : 'Confirm Match'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>


          {/* Flagged Issues Tab */}
          <TabsContent value="issues" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {issues.map((issue: any) => (
                <Card
                  key={issue.id}
                  className={`relative overflow-hidden border-none shadow-lg transition-all hover:scale-[1.02] ${darkMode ? 'bg-[#0b2528]' : 'bg-white'}`}
                >
                  {/* Severity Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${issue.severity === 'High' ? 'bg-red-500' : issue.severity === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />

                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className={`text-[10px] id-code uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Case #{issue.id || issue._id?.slice(-6)}</p>
                        <h3 className={`text-lg font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{issue.type}</h3>
                      </div>
                      <Badge className={`${getSeverityBadge(issue.severity)} rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border-none shadow-sm`}>
                        {issue.severity} Priority
                      </Badge>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#0b2528] border border-gray-100 dark:border-[#1b5b65] mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="overflow-hidden">
                            <p className={`text-[10px] uppercase font-bold leading-none mb-1 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>Investor</p>
                            <p className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{issue.investor}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className={`text-[9px] uppercase font-bold leading-none mb-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Investor</p>
                            <p className={`text-sm font-bold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>{issue.investor}</p>
                          </div>
                        </div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className={`text-[9px] uppercase font-bold leading-none mb-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Farmer</p>
                            <p className={`text-sm font-bold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {issue.farmer?.name || issue.farmer || 'Unknown Farmer'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs px-1">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Logged: {issue.dateLogged || new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className={`font-bold border-none ${issue.status === 'Resolved' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                          {issue.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[10px] h-10 shadow-lg shadow-emerald-600/20"
                      >
                        Mediate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`font-bold uppercase tracking-wider text-[10px] h-10 ${darkMode ? 'border-[#1b5b65] text-gray-300 hover:bg-[#1b5b65]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {issues.length === 0 && (
              <Card className={`p-12 text-center border-dashed ${darkMode ? 'bg-transparent border-[#1b5b65]' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>All Quiet Here</h3>
                  <p className="text-gray-500 max-w-sm">No unresolved issues or disputes at the moment. Great job keeping the ecosystem running smoothly!</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Match Details Modal */}
        <Dialog open={showMatchModal} onOpenChange={setShowMatchModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Match Details
                {selectedMatch && (
                  <Badge className={`${getStatusBadge(selectedMatch.status)} capitalize ml-2`}>
                    {selectedMatch.status}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                View and manage investor-farmer partnership details
              </DialogDescription>
            </DialogHeader>

            {selectedMatch && (
              <ScrollArea className="max-h-[calc(90vh-120px)] sm:max-h-[calc(90vh-140px)]">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 h-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="farmer">Farmer</TabsTrigger>
                    <TabsTrigger value="investor">Investor</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {/* Progress Tracking Section */}
                    <Card className="border-2 border-[#7ede56]/30 bg-[#7ede56]/5">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-gray-700">Investment Progress</CardTitle>
                          <Badge className={`${selectedMatch.progress === 100 ? 'bg-blue-100 text-blue-700' :
                            selectedMatch.progress >= 50 ? 'bg-green-100 text-green-700' :
                              selectedMatch.progress > 0 ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {selectedMatch.progress}% Complete
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-bold text-gray-900">{selectedMatch.progress}%</span>
                          </div>
                          <Progress
                            value={selectedMatch.progress}
                            className={`h-3 ${selectedMatch.status === 'completed' ? '[&>div]:bg-blue-500' :
                              selectedMatch.status === 'flagged' ? '[&>div]:bg-red-500' :
                                selectedMatch.progress >= 50 ? '[&>div]:bg-green-500' :
                                  '[&>div]:bg-orange-500'
                              }`}
                          />
                        </div>

                        {/* Updates History */}
                        {selectedMatch.updates && selectedMatch.updates.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-700">Recent Updates ({selectedMatch.updates.length})</h4>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {selectedMatch.updates.slice().reverse().map((update: any, index: number) => (
                                <div key={update.id || index} className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900 text-sm">{update.title}</h5>
                                      <p className="text-xs text-gray-500 mt-1">{update.description}</p>
                                    </div>
                                    <div className="text-right ml-3">
                                      <Badge variant="outline" className="text-xs">{update.progress}%</Badge>
                                      <p className="text-xs text-gray-400 mt-1">{update.date}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(!selectedMatch.updates || selectedMatch.updates.length === 0) && (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            No updates yet. Upload a progress report to track this investment.
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Investment Details Card */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">Investment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span className="font-medium">{selectedMatch.investmentType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Value:</span>
                            <span className="font-medium text-green-600">{selectedMatch.investmentValue}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Partnership Model:</span>
                            <Badge className={`${selectedMatch.partnershipModel === 'Profit Sharing' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                              selectedMatch.partnershipModel === 'Buy-back Agreement' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                'bg-orange-100 text-orange-700 border-orange-200'
                              } border`}>
                              {selectedMatch.partnershipModel}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Match Date:</span>
                            <span className="font-medium">{selectedMatch.matchDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Start Date:</span>
                            <span className="font-medium">{selectedMatch.startDate || 'Not started'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Assigned Agent:</span>
                            <span className="font-medium">{selectedMatch.assignedAgent}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Actions Card */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button className="w-full justify-start bg-[#7ede56] hover:bg-[#6bc947] text-white" onClick={() => setShowUploadModal(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Progress Update
                          </Button>
                          <Button className="w-full justify-start" variant="outline" onClick={() => setShowUploadModal(true)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Report
                          </Button>
                          <Button className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50" variant="outline">
                            <Flag className="h-4 w-4 mr-2" />
                            Flag an Issue
                          </Button>
                          <Button className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete Match
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="farmer" className="space-y-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <User className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold">{selectedMatch.farmer.name}</h3>
                              {selectedMatch.farmer.verified && (
                                <Badge className="bg-blue-100 text-blue-700">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                {selectedMatch.farmer.region} Region
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Leaf className="h-4 w-4" />
                                {selectedMatch.farmType} - {selectedMatch.category}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <TrendingUp className="h-4 w-4" />
                                Land: {selectedMatch.farmer.landSize}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <CircleDot className="h-4 w-4" />
                                Stage: {selectedMatch.farmer.productionStage}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="investor" className="space-y-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Building className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <h3 className="text-xl font-bold">{selectedMatch.investor.name}</h3>
                            <p className="text-gray-600">{selectedMatch.investor.organization}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4" />
                                {selectedMatch.investor.contact}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="h-4 w-4" />
                                {selectedMatch.investor.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Activity Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          {(selectedMatch.timeline || []).map((item: any, index: number) => (
                            <div key={index} className="flex gap-4 pb-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'issue' ? 'bg-red-100' :
                                  item.type === 'complete' ? 'bg-green-100' :
                                    'bg-blue-100'
                                  }`}>
                                  {item.type === 'issue' ? (
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                  ) : item.type === 'complete' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <CircleDot className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>
                                {index < selectedMatch.timeline.length - 1 && (
                                  <div className="w-0.5 h-full bg-gray-200 min-h-[20px]" />
                                )}
                              </div>
                              <div className="flex-1 pb-2">
                                <p className="font-medium text-gray-900 dark:text-white">{item.action}</p>
                                <p className="text-sm text-gray-500">{item.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Update Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Progress Update</DialogTitle>
              <DialogDescription>
                Add notes, photos, or reports for this match
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Update Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter your progress update notes..."
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label>Attachments</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#7ede56] transition-colors cursor-pointer">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload photos or documents</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#7ede56] hover:bg-[#6bc947] text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


      </div>
    </AgentLayout>
  );
};

export default InvestorFarmerMatchesDashboard;
