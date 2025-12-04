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
import {
  agentProfile,
  agentFarmers,
  agentAssignedFarms,
  agentMatches,
  agentDisputes,
  agentTrainings,
  agentPerformanceTrend,
  agentNotifications
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
  Flag,
  Plus,
  Leaf
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
    active: 'bg-emerald-500/10 text-emerald-600',
    pending: 'bg-amber-500/10 text-amber-600',
    inactive: 'bg-slate-500/10 text-slate-600',
    verified: 'bg-emerald-500/10 text-emerald-600',
    scheduled: 'bg-amber-500/10 text-amber-600',
    'needs-attention': 'bg-rose-500/10 text-rose-600',
    'Pending Funding': 'bg-amber-500/10 text-amber-600',
    'Under Review': 'bg-orange-500/10 text-orange-600',
    Completed: 'bg-emerald-500/10 text-emerald-600',
    Active: 'bg-emerald-500/10 text-emerald-600',
    Ongoing: 'bg-orange-500/10 text-orange-600',
    Resolved: 'bg-emerald-500/10 text-emerald-600'
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
      <Button
        className={`${darkMode ? 'bg-[#1db954] text-white hover:bg-[#159b46]' : 'bg-[#1db954] text-white hover:bg-[#17a447]'
          }`}
        onClick={() => navigate('/dashboard/agent/farm-monitoring')}
      >
        <Sprout className="mr-2 h-4 w-4" />
        Log Field Visit
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

  const tableHeaderRowClass = darkMode ? 'bg-[#124b53] text-gray-100' : 'bg-gray-100 text-gray-700 font-semibold';
  const tableBodyRowClass = darkMode ? 'border-b border-[#124b53] hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : '';

  return (
    <AgentLayout
      activeSection="profile-overview"
      title={`${getGreeting()}, ${agentProfile.name.split(' ')[0]}!`}
      subtitle="Track your field operations and grower support pipeline."
      headerActions={headerActions}
    >
      {/* Stats Overview - Simplified to 4 cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {highlightCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => navigate(card.path)}
            className={`relative overflow-hidden rounded-xl p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-105 ${card.color} ${card.textColor}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="rounded-lg bg-white/20 p-3">
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium opacity-90">{card.title}</p>
              <p className="text-4xl font-bold">{card.value}</p>
              <p className="text-xs opacity-80">{card.subtitle}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full grid-cols-5 ${darkMode ? 'bg-[#0b2528] border border-[#124b53]' : 'bg-gray-100'}`}>
          <TabsTrigger value="overview" className={darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="farmers" className={darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}>
            Farmers
          </TabsTrigger>
          <TabsTrigger value="farms" className={darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}>
            Farms
          </TabsTrigger>
          <TabsTrigger value="matches" className={darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}>
            Matches
          </TabsTrigger>
          <TabsTrigger value="performance" className={darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : ''}>
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className={`${sectionCardClass} transition-colors`}>
              <CardHeader>
                <CardTitle className={darkMode ? 'text-gray-100' : ''}>Recent Activity</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                  Your latest updates and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {agentNotifications.slice(0, 5).map((notification) => (
                    <li
                      key={notification.id}
                      className={`flex items-start gap-3 rounded-lg border p-3 ${darkMode
                        ? 'border-[#1b5b65] bg-[#0f3035]'
                        : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                      <span
                        className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg ${notification.type === 'alert'
                          ? 'bg-rose-500/10 text-rose-600'
                          : notification.type === 'action'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                          }`}
                      >
                        {notification.type === 'alert' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : notification.type === 'action' ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notification.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
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
              <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-[#0b2528]' : 'bg-white'}`}>
                <Table>
                  <TableHeader>
                    <TableRow className={`border-b ${darkMode ? 'border-[#124b53] bg-[#0d3036]' : 'border-gray-200 bg-gray-50'}`}>
                      <TableHead className="w-12 pl-6">
                        <div className="flex items-center justify-center w-5 h-5 rounded border-2 border-gray-300"></div>
                      </TableHead>
                      <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>FARMER NAME</TableHead>
                      <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>REGION</TableHead>
                      <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>LOCATION</TableHead>
                      <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>FARM TYPE</TableHead>
                      <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>STATUS</TableHead>
                      <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium pr-6`}></TableHead>
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
                              ? 'bg-emerald-100 text-emerald-700'
                              : farmer.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                            {farmer.status}
                          </span>
                        </TableCell>
                        <TableCell className="pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="w-8 h-8 rounded-full bg-[#E91E63] hover:bg-[#C2185B] flex items-center justify-center transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode
                                  ? 'bg-gray-700 hover:bg-gray-600'
                                  : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                              title="Details"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button
                              className="w-8 h-8 rounded-full bg-[#FDB022] hover:bg-[#F59E0B] flex items-center justify-center transition-colors"
                              title="More"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
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

        {/* Farms Tab */}
        <TabsContent value="farms" className="space-y-6">
          <Card className={`${sectionCardClass} transition-colors`}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-gray-100' : ''}>Farm Monitoring</CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                Plan visits, upload reports, and verify farm status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Select value={farmStatusFilter} onValueChange={(value) => setFarmStatusFilter(value as typeof farmStatusFilter)}>
                  <SelectTrigger className={`w-full sm:w-40 ${selectTriggerClasses}`}>
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Farms</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="needs-attention">Needs Attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className={tableHeaderRowClass}>
                      <TableHead className={tableCellClass}>Farm ID</TableHead>
                      <TableHead className={tableCellClass}>Farmer</TableHead>
                      <TableHead className={tableCellClass}>Crop</TableHead>
                      <TableHead className={tableCellClass}>Status</TableHead>
                      <TableHead className={tableCellClass}>Last Visit</TableHead>
                      <TableHead className={tableCellClass}>Next Visit</TableHead>
                      <TableHead className={`${tableCellClass} text-right`}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFarms.map((farm) => (
                      <TableRow key={farm.id} className={tableBodyRowClass}>
                        <TableCell className={`${tableCellClass} font-medium`}>{farm.id}</TableCell>
                        <TableCell className={tableCellClass}>{farm.farmer}</TableCell>
                        <TableCell className={tableCellClass}>{farm.crop}</TableCell>
                        <TableCell className={tableCellClass}>
                          <Badge className={`capitalize ${statusStyles[farm.status]}`}>
                            {farm.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className={tableCellClass}>{farm.lastVisit}</TableCell>
                        <TableCell className={tableCellClass}>{farm.nextVisit}</TableCell>
                        <TableCell className={`${tableCellClass} text-right`}>
                          <Button variant="ghost" size="sm" className={darkMode ? 'text-emerald-300 hover:bg-[#0d3036]' : 'text-emerald-700'}>
                            Report
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

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-6">
          <Card className={`${sectionCardClass} transition-colors`}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-gray-100' : ''}>Investor-Farmer Matches</CardTitle>
              <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                Monitor investment progress and accountability updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className={tableHeaderRowClass}>
                      <TableHead className={tableCellClass}>Investor</TableHead>
                      <TableHead className={tableCellClass}>Farmer</TableHead>
                      <TableHead className={tableCellClass}>Farm Type</TableHead>
                      <TableHead className={tableCellClass}>Match Date</TableHead>
                      <TableHead className={tableCellClass}>Value</TableHead>
                      <TableHead className={tableCellClass}>Status</TableHead>
                      <TableHead className={`${tableCellClass} text-right`}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentMatches.map((match) => (
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
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Training */}
            <Card className={`${sectionCardClass} transition-colors`}>
              <CardHeader>
                <CardTitle className={darkMode ? 'text-gray-100' : ''}>Training & Development</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                  Upcoming sessions and skill development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`rounded-lg border p-4 ${darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-emerald-100 bg-emerald-50'}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>Upcoming Trainings</p>
                    <Badge className={darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-700'}>
                      {agentTrainings.upcoming.length}
                    </Badge>
                  </div>
                  <ul className="space-y-3">
                    {agentTrainings.upcoming.map((session) => (
                      <li key={session.title} className={`rounded-lg p-3 text-sm ${darkMode ? 'bg-[#0b2528] text-gray-200' : 'bg-white text-gray-600'}`}>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.title}</p>
                        <p>{session.date} · {session.time}</p>
                        <p className={`text-xs uppercase ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{session.mode}</p>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-4 w-full bg-[#1db954] hover:bg-[#17a447] text-white">
                    Join Training
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className={`${sectionCardClass} transition-colors`}>
              <CardHeader>
                <CardTitle className={darkMode ? 'text-gray-100' : ''}>Performance Trends</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                  Your monthly activity overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={agentPerformanceTrend} barSize={20}>
                    <XAxis dataKey="month" stroke={darkMode ? '#a3b3c7' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)' }} />
                    <Bar dataKey="farmers" stackId="a" fill="#1db954" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="reports" stackId="a" fill="#f97316" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="disputes" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-3">
                  {agentTrainings.summary.map((item) => (
                    <div key={item.label}>
                      <div className={`flex items-center justify-between text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                        <span>{item.label}</span>
                        <span>{item.value}/{item.goal}</span>
                      </div>
                      <Progress value={(item.value / item.goal) * 100} className="h-2 mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disputes */}
            <Card className={`${sectionCardClass} transition-colors lg:col-span-2`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={darkMode ? 'text-gray-100' : ''}>Dispute Management</CardTitle>
                    <CardDescription className={darkMode ? 'text-gray-400' : ''}>
                      Track and resolve farmer-investor issues
                    </CardDescription>
                  </div>
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={() => navigate('/dashboard/agent/dispute-management')}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Dispute
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={tableHeaderRowClass}>
                        <TableHead className={tableCellClass}>ID</TableHead>
                        <TableHead className={tableCellClass}>Parties</TableHead>
                        <TableHead className={tableCellClass}>Type</TableHead>
                        <TableHead className={tableCellClass}>Date</TableHead>
                        <TableHead className={tableCellClass}>Status</TableHead>
                        <TableHead className={`${tableCellClass} text-right`}>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentDisputes.map((dispute) => (
                        <TableRow key={dispute.id} className={tableBodyRowClass}>
                          <TableCell className={`${tableCellClass} font-medium`}>{dispute.id}</TableCell>
                          <TableCell className={tableCellClass}>{dispute.parties}</TableCell>
                          <TableCell className={tableCellClass}>{dispute.type}</TableCell>
                          <TableCell className={tableCellClass}>{dispute.logged}</TableCell>
                          <TableCell className={tableCellClass}>
                            <Badge className={statusStyles[dispute.status] ?? (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
                              {dispute.status}
                            </Badge>
                          </TableCell>
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
        </TabsContent>
      </Tabs>
    </AgentLayout>
  );
};

export default AgentDashboard;
