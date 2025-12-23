import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Briefcase, RefreshCw, DollarSign, CheckCircle, AlertTriangle,
  Search, Filter, ArrowUpDown, Eye, Upload, Flag, UserCheck,
  MapPin, Leaf, Calendar, Clock, MessageSquare, FileText, Camera,
  X, ChevronRight, User, Building, Phone, Mail, TrendingUp,
  AlertCircle, CheckCircle2, CircleDot, ChevronDown, ChevronUp, Plus
} from 'lucide-react';

// Mock data for matches with progress tracking

// Mock data for matches with progress tracking
const mockMatches = [
  {
    id: 1,
    investor: { name: 'AgriFunds Ltd', organization: 'AgriFunds Ghana', contact: '+233 24 123 4567', email: 'info@agrifunds.gh', photo: null },
    farmer: { name: 'John Kwame', region: 'Ashanti', phone: '+233 24 111 2222', lyncId: 'LYG0000001', photo: null, verified: true, landSize: '5 acres', productionStage: 'Growing' },
    farmType: 'Crop',
    category: 'Maize',
    investmentType: 'Input Support',
    investmentValue: 'GHS 15,000',
    partnershipModel: 'Profit Sharing',
    status: 'active',
    progress: 65,
    matchDate: '2024-10-15',
    startDate: '2024-10-20',
    lastUpdate: '3 days ago',
    assignedAgent: 'Agent Mensah',
    updates: [
      { id: 1, title: 'Land Preparation Complete', description: 'Successfully cleared and prepared 5 acres for maize plantation.', date: '2024-10-22', progress: 20 },
      { id: 2, title: 'Seedling Planting Done', description: 'Planted improved maize variety. Irrigation system installed.', date: '2024-10-30', progress: 40 },
      { id: 3, title: 'Growth Monitoring Update', description: 'Crops showing healthy growth. First fertilizer applied.', date: '2024-11-10', progress: 65 },
    ],
    timeline: [
      { date: '2024-10-15', action: 'Match created', type: 'create' },
      { date: '2024-10-20', action: 'Investment started', type: 'start' },
      { date: '2024-10-25', action: 'Inputs delivered to farmer', type: 'delivery' },
      { date: '2024-11-01', action: 'Field visit completed', type: 'visit' },
      { date: '2024-11-15', action: 'Progress report uploaded', type: 'report' },
    ]
  },
  {
    id: 2,
    investor: { name: 'GreenCapital', organization: 'GreenCapital Investments', contact: '+233 20 987 6543', email: 'invest@greencapital.gh', photo: null },
    farmer: { name: 'Amina Fatimah', region: 'Northern', phone: '+233 20 333 4444', lyncId: 'LYG0000002', photo: null, verified: true, landSize: '2 acres', productionStage: 'Hatching' },
    farmType: 'Livestock',
    category: 'Poultry',
    investmentType: 'Equipment',
    investmentValue: 'GHS 8,500',
    partnershipModel: 'Buy-back Agreement',
    status: 'pending',
    progress: 0,
    matchDate: '2024-11-01',
    startDate: null,
    lastUpdate: '8 days ago',
    assignedAgent: 'Agent Mensah',
    updates: [],
    timeline: [
      { date: '2024-11-01', action: 'Match created', type: 'create' },
      { date: '2024-11-05', action: 'Awaiting investor confirmation', type: 'pending' },
    ]
  },
  {
    id: 3,
    investor: { name: 'FarmersFirst', organization: 'FarmersFirst Foundation', contact: '+233 27 555 1234', email: 'support@farmersfirst.org', photo: null },
    farmer: { name: 'Kofi Asante', region: 'Eastern', phone: '+233 27 555 6666', lyncId: 'LYG0000003', photo: null, verified: true, landSize: '10 acres', productionStage: 'Harvesting' },
    farmType: 'Crop',
    category: 'Cassava',
    investmentType: 'Cash Support',
    investmentValue: 'GHS 25,000',
    partnershipModel: 'Profit Sharing',
    status: 'completed',
    progress: 100,
    matchDate: '2024-06-01',
    startDate: '2024-06-10',
    lastUpdate: '1 week ago',
    assignedAgent: 'Agent Mensah',
    updates: [
      { id: 1, title: 'Project Launched', description: 'Land preparation and planting completed.', date: '2024-06-15', progress: 25 },
      { id: 2, title: 'Mid-Season Update', description: 'Crops growing well. Pest control measures in place.', date: '2024-08-01', progress: 50 },
      { id: 3, title: 'Harvest Ready', description: 'Cassava ready for harvest. Expected yield: 15 tonnes.', date: '2024-09-10', progress: 85 },
      { id: 4, title: 'Harvest Complete', description: 'Successfully harvested 16 tonnes. Returns distributed.', date: '2024-10-01', progress: 100 },
    ],
    timeline: [
      { date: '2024-06-01', action: 'Match created', type: 'create' },
      { date: '2024-06-10', action: 'Investment started', type: 'start' },
      { date: '2024-09-15', action: 'Harvest completed', type: 'harvest' },
      { date: '2024-10-01', action: 'Final report submitted', type: 'complete' },
    ]
  },
  {
    id: 4,
    investor: { name: 'AgriVest Corp', organization: 'AgriVest Corporation', contact: '+233 55 444 3333', email: 'agrivest@corp.gh', photo: null },
    farmer: { name: 'Akosua Mensah', region: 'Volta', phone: '+233 55 777 8888', lyncId: 'LYG0000004', photo: null, verified: false, landSize: '3 acres', productionStage: 'Planting' },
    farmType: 'Crop',
    category: 'Vegetables',
    investmentType: 'Land Prep',
    investmentValue: 'GHS 12,000',
    partnershipModel: 'Input Financing',
    status: 'flagged',
    progress: 30,
    matchDate: '2024-09-20',
    startDate: '2024-09-25',
    lastUpdate: '2 days ago',
    assignedAgent: 'Agent Mensah',
    updates: [
      { id: 1, title: 'Land Preparation Started', description: 'Cleared land and started soil preparation.', date: '2024-09-28', progress: 20 },
      { id: 2, title: 'Issue Detected', description: 'Low yield risk identified due to water shortage.', date: '2024-10-15', progress: 30 },
    ],
    timeline: [
      { date: '2024-09-20', action: 'Match created', type: 'create' },
      { date: '2024-09-25', action: 'Investment started', type: 'start' },
      { date: '2024-10-15', action: 'Issue reported: Low yield risk', type: 'issue' },
    ]
  },
  {
    id: 5,
    investor: { name: 'SeedFund Ghana', organization: 'SeedFund Limited', contact: '+233 24 777 8888', email: 'hello@seedfund.gh', photo: null },
    farmer: { name: 'Yaw Boateng', region: 'Bono', phone: '+233 24 999 0000', lyncId: 'LYG0000005', photo: null, verified: true, landSize: '7 acres', productionStage: 'Growing' },
    farmType: 'Crop',
    category: 'Rice',
    investmentType: 'Input Support',
    investmentValue: 'GHS 18,000',
    partnershipModel: 'Buy-back Agreement',
    status: 'active',
    progress: 45,
    matchDate: '2024-10-01',
    startDate: '2024-10-05',
    lastUpdate: '1 day ago',
    assignedAgent: 'Agent Mensah',
    updates: [
      { id: 1, title: 'Project Started', description: 'Rice paddies prepared and planting initiated.', date: '2024-10-08', progress: 15 },
      { id: 2, title: 'Planting Complete', description: 'All 7 acres planted with improved rice variety.', date: '2024-10-18', progress: 35 },
      { id: 3, title: 'Growth Update', description: 'Rice seedlings showing excellent growth.', date: '2024-11-01', progress: 45 },
    ],
    timeline: [
      { date: '2024-10-01', action: 'Match created', type: 'create' },
      { date: '2024-10-05', action: 'Investment started', type: 'start' },
      { date: '2024-10-20', action: 'Field visit completed', type: 'visit' },
    ]
  },
];

// Mock data for flagged issues
const mockIssues = [
  { id: 102, farmer: 'Amina F.', investor: 'GreenCapital', type: 'Low yield risk', date: '02 Nov', severity: 'Medium', status: 'Under Review' },
  { id: 103, farmer: 'Akosua M.', investor: 'AgriVest Corp', type: 'Input mismanagement', date: '28 Oct', severity: 'High', status: 'Open' },
  { id: 104, farmer: 'Kwesi D.', investor: 'FarmersFirst', type: 'Payment delay', date: '15 Oct', severity: 'Low', status: 'Resolved' },
];

const InvestorFarmerMatchesDashboard = () => {
  const { darkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [investmentTypeFilter, setInvestmentTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedMatch, setSelectedMatch] = useState<typeof mockMatches[0] | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [activeMetricFilter, setActiveMetricFilter] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'matches' | 'issues'>('matches');

  // Calculate metrics
  const totalMatches = mockMatches.length;
  const pendingMatches = mockMatches.filter(m => m.status === 'pending').length;
  const activeInvestments = mockMatches.filter(m => m.status === 'active').length;
  const completedPartnerships = mockMatches.filter(m => m.status === 'completed').length;
  const flaggedIssues = mockMatches.filter(m => m.status === 'flagged').length;

  // Filter matches
  const filteredMatches = mockMatches.filter(match => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      match.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.farmer.region.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || match.status === statusFilter;

    // Investment type filter
    const matchesInvestmentType = investmentTypeFilter === 'all' ||
      match.investmentType.toLowerCase().includes(investmentTypeFilter.toLowerCase());

    // Region filter
    const matchesRegion = regionFilter === 'all' ||
      match.farmer.region.toLowerCase() === regionFilter.toLowerCase();

    // Category filter
    const matchesCategory = categoryFilter === 'all' ||
      match.farmType.toLowerCase() === categoryFilter.toLowerCase();

    // Metric card filter
    const matchesMetric = !activeMetricFilter ||
      (activeMetricFilter === 'total') ||
      (activeMetricFilter === 'pending' && match.status === 'pending') ||
      (activeMetricFilter === 'active' && match.status === 'active') ||
      (activeMetricFilter === 'completed' && match.status === 'completed') ||
      (activeMetricFilter === 'flagged' && match.status === 'flagged');

    return matchesSearch && matchesStatus && matchesInvestmentType && matchesRegion && matchesCategory && matchesMetric;
  });

  // Sort matches
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
    }
    if (sortBy === 'value') {
      const aValue = parseInt(a.investmentValue.replace(/[^0-9]/g, ''));
      const bValue = parseInt(b.investmentValue.replace(/[^0-9]/g, ''));
      return bValue - aValue;
    }
    if (sortBy === 'urgent') {
      const priority = { flagged: 0, pending: 1, active: 2, completed: 3 };
      return priority[a.status as keyof typeof priority] - priority[b.status as keyof typeof priority];
    }
    return 0;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
      active: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      flagged: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const getSeverityBadge = (severity: string) => {
    const styles = {
      Low: 'bg-green-100 text-green-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      High: 'bg-red-100 text-red-700',
    };
    return styles[severity as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const handleMetricClick = (metric: string) => {
    if (activeMetricFilter === metric) {
      setActiveMetricFilter(null);
    } else {
      setActiveMetricFilter(metric);
    }
  };

  const handleViewMatch = (match: typeof mockMatches[0]) => {
    setSelectedMatch(match);
    setShowMatchModal(true);
  };

  return (
    <AgentLayout
      activeSection="investor-farmer-matches"
      title="Investor Matches"
      subtitle="Find and manage investor-farmer partnerships in your region"
    >
      <div className={`p-6 space-y-6 min-h-screen ${darkMode ? 'bg-[#081a1c]' : 'bg-gray-50'}`}>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${activeMetricFilter === 'total' ? 'ring-2 ring-white' : ''} bg-[#7c3aed]`}
            onClick={() => handleMetricClick('total')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalMatches}</p>
                  <p className="text-xs text-white/80">Total Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${activeMetricFilter === 'pending' ? 'ring-2 ring-white' : ''} bg-[#f97316]`}
            onClick={() => handleMetricClick('pending')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <RefreshCw className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{pendingMatches}</p>
                  <p className="text-xs text-white/80">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${activeMetricFilter === 'active' ? 'ring-2 ring-white' : ''} bg-[#1db954]`}
            onClick={() => handleMetricClick('active')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{activeInvestments}</p>
                  <p className="text-xs text-white/80">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${activeMetricFilter === 'completed' ? 'ring-2 ring-white' : ''} bg-[#3b82f6]`}
            onClick={() => handleMetricClick('completed')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{completedPartnerships}</p>
                  <p className="text-xs text-white/80">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${activeMetricFilter === 'flagged' ? 'ring-2 ring-white' : ''} bg-[#ef4444]`}
            onClick={() => handleMetricClick('flagged')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{flaggedIssues}</p>
                  <p className="text-xs text-white/80">Active Disputes</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'matches' | 'issues')} className="w-full">
          <TabsList className={`grid w-full grid-cols-2 mb-4 ${darkMode ? 'bg-[#0b2528]' : 'bg-gray-100'}`}>
            <TabsTrigger
              value="matches"
              className={`${darkMode ? 'data-[state=active]:bg-[#1b5b65] data-[state=active]:text-white' : ''}`}
            >
              Active Partnerships ({sortedMatches.length})
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className={`${darkMode ? 'data-[state=active]:bg-[#1b5b65] data-[state=active]:text-white' : ''}`}
            >
              <AlertTriangle className="h-4 w-4 mr-2 inline" />
              Dispute Resolution ({mockIssues.filter(i => i.status !== 'Resolved').length})
            </TabsTrigger>
          </TabsList>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Card className={darkMode ? 'bg-[#0b2528] border-[#1b5b65]' : ''}>
              <CardContent className="pt-6">

                <div className="block sm:hidden space-y-3">
                  {sortedMatches.map((match) => (
                    <div
                      key={match.id}
                      onClick={() => handleViewMatch(match)}
                      className={`p-4 rounded-xl border transition-all ${darkMode ? 'bg-[#0f3035] border-[#1b5b65]' : 'bg-white border-gray-100 shadow-sm'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.farmer.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{match.investor.name}</p>
                        </div>
                        <Badge className={`${getStatusBadge(match.status)} rounded text-[10px] px-2 py-0.5 border-none`}>
                          {match.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-3">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Progress: {match.progress}%</span>
                        <span className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{match.investmentValue}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full mt-2">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${match.progress}%` }}
                        />
                      </div>
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
                  <table className="w-full">
                    <thead>
                      <tr className="bg-emerald-600 border-emerald-600">
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
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewMatch(match)}
                                className={`${darkMode ? 'bg-[#7ede56] text-white border-[#7ede56] hover:bg-[#6bc947]' : 'border-[#7ede56] text-[#7ede56] hover:bg-[#7ede56] hover:text-white'}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSelectedMatch(match); setShowUploadModal(true); }}
                                className={darkMode ? 'border-[#1b5b65] text-gray-300 hover:bg-[#1b5b65]' : ''}
                                title="Submit Report"
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-100 hover:bg-red-50"
                                title="Flag Dispute"
                              >
                                <Flag className="h-4 w-4" />
                              </Button>
                            </div>
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

          {/* Flagged Issues Tab */}
          <TabsContent value="issues">
            <Card className={darkMode ? 'bg-[#0b2528] border-[#1b5b65]' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Conflict Management
                  </CardTitle>
                  <Badge variant="destructive">{mockIssues.filter(i => i.status !== 'Resolved').length} Open</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="block sm:hidden space-y-4">
                  {mockIssues.map((issue) => (
                    <div key={issue.id} className={`p-5 rounded-3xl border transition-all duration-300 ${darkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-white border-red-100 shadow-xl shadow-red-100/30'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <span className={`font-mono text-[10px] block opacity-50 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CASE #{issue.id}</span>
                            <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm`}>{issue.type}</span>
                          </div>
                        </div>
                        <Badge className={`${getSeverityBadge(issue.severity)} rounded-full text-[10px] font-bold`}>
                          {issue.severity}
                        </Badge>
                      </div>

                      <div className={`grid grid-cols-2 gap-3 mb-4 p-3 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Farmer</p>
                          <p className={`text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{issue.farmer}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Investor</p>
                          <p className={`text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{issue.investor}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 px-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest text-gray-400`}>Current Status</span>
                        <Badge variant="outline" className="rounded-full text-[10px] border-orange-500/20 text-orange-500 font-bold bg-orange-500/5">{issue.status}</Badge>
                      </div>

                      <Button variant="outline" size="sm" className="w-full rounded-2xl border-emerald-500 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white h-11 font-bold uppercase tracking-wider text-xs">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Initiate Mediation
                      </Button>
                    </div>
                  ))}
                  {mockIssues.length === 0 && (
                    <div className="text-center py-6 text-gray-500">No issues found</div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1db954] border-[#1db954]">
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Issue ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Farmer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Investor</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Severity</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockIssues.map((issue) => (
                        <tr key={issue.id} className={`border-b transition-colors ${darkMode ? 'border-[#1b5b65]/50 hover:bg-[#0f3035]' : 'border-gray-100 hover:bg-gray-50'}`}>
                          <td className={`py-3 px-4 font-mono text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>#{issue.id}</td>
                          <td className={`py-3 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{issue.farmer}</td>
                          <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{issue.investor}</td>
                          <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{issue.type}</td>
                          <td className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{issue.date}</td>
                          <td className="py-3 px-4">
                            <Badge className={getSeverityBadge(issue.severity)}>{issue.severity}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={issue.status === 'Resolved' ? 'secondary' : 'outline'}>
                              {issue.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-100 hover:bg-emerald-50">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mediate
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
                Detailed oversight of investor-farmer partnership transparency and accountability
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
                          <CardTitle className="text-sm font-medium text-gray-500">Monitoring Actions</CardTitle>
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
                            Verify Completion
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
                          {selectedMatch.timeline.map((item, index) => (
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
              <DialogTitle>Submit Monitoring Update</DialogTitle>
              <DialogDescription>
                Provide accountability notes, field photos, or progress reports for this partnership
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
