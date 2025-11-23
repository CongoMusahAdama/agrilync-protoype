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
import AgentLayout from './agent/AgentLayout';
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
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerStatusFilter, setFarmerStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [farmStatusFilter, setFarmStatusFilter] = useState<'all' | 'verified' | 'scheduled' | 'needs-attention'>('all');

  const highlightCards = [
    {
      id: 'farmers-management',
      title: 'Farmers Onboarded',
      value: agentProfile.stats.farmersOnboarded,
      subtitle: 'Manage growers on your roster',
      color: 'bg-[#7ede56]',
      textColor: 'text-[#002f37]',
      icon: Users,
      path: '/dashboard/agent/farmers-management'
    },
    {
      id: 'farm-monitoring',
      title: 'Active Farms',
      value: agentProfile.stats.activeFarms,
      subtitle: 'Track field visits & reports',
      color: 'bg-[#1db954]',
      textColor: 'text-white',
      icon: Sprout,
      path: '/dashboard/agent/farm-monitoring'
    },
    {
      id: 'investor-farmer-matches',
      title: 'Investor Matches',
      value: agentProfile.stats.investorMatches,
      subtitle: 'Facilitate accountability updates',
      color: 'bg-[#f97316]',
      textColor: 'text-white',
      icon: Handshake,
      path: '/dashboard/agent/investor-farmer-matches'
    },
    {
      id: 'training-performance',
      title: 'Training Sessions',
      value: agentProfile.stats.trainingsAttended,
      subtitle: 'Agents skill development',
      color: 'bg-[#f25f5c]',
      textColor: 'text-white',
      icon: Calendar,
      path: '/dashboard/agent/training-performance'
    },
    {
      id: 'farm-monitoring-reports',
      title: 'Reports Submitted',
      value: agentProfile.stats.reportsThisMonth,
      subtitle: 'Monthly field reports',
      color: 'bg-[#7c3aed]',
      textColor: 'text-white',
      icon: FileText,
      path: '/dashboard/agent/farm-monitoring'
    },
    {
      id: 'dispute-management',
      title: 'Pending Disputes',
      value: agentProfile.stats.pendingDisputes,
      subtitle: 'Resolve farmer-investor issues',
      color: 'bg-[#2563eb]',
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
        className={`${
          darkMode
            ? 'border-[#1b5b65] text-gray-100 hover:bg-[#0d3036]'
            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
        }`}
        onClick={() => navigate('/dashboard/agent/farmers-management')}
      >
        <Users className="mr-2 h-4 w-4" />
        Manage Farmers
      </Button>
      <Button
        className={`${
          darkMode ? 'bg-[#1db954] text-white hover:bg-[#159b46]' : 'bg-[#1db954] text-white hover:bg-[#17a447]'
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

  const tableHeaderRowClass = darkMode ? 'bg-[#0f3a41] text-gray-100' : 'bg-gray-50';
  const tableBodyRowClass = darkMode ? 'border-b border-[#124b53] hover:bg-[#0d3036]' : '';
  const tableCellClass = darkMode ? 'text-gray-100' : '';

  return (
    <AgentLayout
      activeSection="profile-overview"
      title={`${getGreeting()}, ${agentProfile.name.split(' ')[0]}!`}
      subtitle="Track your field operations and grower support pipeline."
      headerActions={headerActions}
    >
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {highlightCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => navigate(card.path)}
            className={`relative overflow-hidden rounded-2xl p-5 text-left shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg ${card.color} ${card.textColor}`}
          >
                <div className="absolute inset-0 opacity-15 pointer-events-none">
              <Leaf className="absolute top-0 right-2 h-16 w-16 rotate-12" />
              <Leaf className="absolute bottom-2 left-3 h-12 w-12 -rotate-12" />
            </div>
            <div className="relative flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold opacity-90">{card.title}</p>
                <span className="rounded-full bg-white/15 p-2">
                  <card.icon className="h-5 w-5" />
                </span>
              </div>
              <p className="text-3xl font-semibold">{card.value}</p>
              <span className="text-xs font-semibold uppercase opacity-80">{card.subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      <Card id="farmers-management" className={`${sectionCardClass} transition-colors`}>
        <CardContent className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f2f31] via-[#123a44] to-[#194f63] p-5 text-white shadow-md">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <Leaf className="absolute -top-6 -right-4 h-20 w-20 rotate-12" />
              <Leaf className="absolute bottom-0 left-2 h-16 w-16 -rotate-12" />
            </div>
            <div className="relative">
              <h3 className="text-xl font-semibold">Farmers Management</h3>
              <p className="mt-1 text-sm text-white/90">
                Search, onboard, and verify farmers on your roster.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Search
                className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-400'
                }`}
              />
              <Input
                placeholder="Search by name, region, or community"
                value={farmerSearch}
                onChange={(event) => setFarmerSearch(event.target.value)}
                className={`pl-9 ${inputBaseClasses}`}
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={farmerStatusFilter} onValueChange={(value) => setFarmerStatusFilter(value as typeof farmerStatusFilter)}>
                <SelectTrigger className={`w-full sm:w-56 ${selectTriggerClasses}`}>
                  <Filter
                    className={`mr-2 h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}
                  />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Farmers</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Verification</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-[#1db954] hover:bg-[#17a447] text-white"
                onClick={() => navigate('/dashboard/agent/farmers-management')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Farmer
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={tableHeaderRowClass}>
                  <TableHead className={tableCellClass}>Farmer</TableHead>
                  <TableHead className={tableCellClass}>Region</TableHead>
                  <TableHead className={tableCellClass}>Farm Type</TableHead>
                  <TableHead className={tableCellClass}>Status</TableHead>
                  <TableHead className={tableCellClass}>Investment Status</TableHead>
                  <TableHead className={tableCellClass}>Last Updated</TableHead>
                  <TableHead className={`${tableCellClass} text-right`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.map((farmer) => (
                  <TableRow key={farmer.name} className={tableBodyRowClass}>
                    <TableCell className={tableCellClass}>
                      <div className="flex flex-col">
                        <span className="font-medium">{farmer.name}</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{farmer.community}</span>
                      </div>
                    </TableCell>
                    <TableCell className={tableCellClass}>{farmer.region}</TableCell>
                    <TableCell className={tableCellClass}>{farmer.farmType}</TableCell>
                    <TableCell className={tableCellClass}>
                      <Badge className={`capitalize ${statusStyles[farmer.status]}`}>
                        {farmer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={tableCellClass}>
                      <Badge className={`capitalize ${statusStyles[farmer.investmentStatus] ?? (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}>
                        {farmer.investmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className={tableCellClass}>{farmer.lastUpdated}</TableCell>
                    <TableCell className={`${tableCellClass} text-right`}>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className={darkMode ? 'border-gray-600 text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}>
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Verify
                        </Button>
                        <Button variant="ghost" size="sm" className={darkMode ? 'text-gray-300 hover:bg-[#0d3036] hover:text-white' : 'text-gray-600 hover:text-emerald-700'}>
                          <NotebookPen className="mr-1 h-4 w-4" />
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card id="farm-monitoring" className={`${sectionCardClass} transition-colors`}>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1db954] via-[#1aa347] to-[#157a35] p-5 text-white shadow-md">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Leaf className="absolute -top-6 -right-4 h-20 w-20 rotate-12" />
                <Leaf className="absolute bottom-0 left-2 h-16 w-16 -rotate-12" />
              </div>
              <div className="relative">
                <h3 className="text-xl font-semibold">Farm Monitoring & Reporting</h3>
                <p className="mt-1 text-sm text-white/90">
                  Plan visits, upload field reports, and verify farm status.
                </p>
              </div>
            </div>
            <Select value={farmStatusFilter} onValueChange={(value) => setFarmStatusFilter(value as typeof farmStatusFilter)}>
              <SelectTrigger className={`w-full sm:w-56 ${selectTriggerClasses}`}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Farms</SelectItem>
                <SelectItem value="verified" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Verified</SelectItem>
                <SelectItem value="scheduled" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Scheduled Visits</SelectItem>
                <SelectItem value="needs-attention" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Needs Attention</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={tableHeaderRowClass}>
                  <TableHead className={tableCellClass}>Farm ID</TableHead>
                  <TableHead className={tableCellClass}>Farmer</TableHead>
                  <TableHead className={tableCellClass}>Crop / Livestock</TableHead>
                  <TableHead className={tableCellClass}>Status</TableHead>
                  <TableHead className={tableCellClass}>Last Visit</TableHead>
                  <TableHead className={tableCellClass}>Next Visit</TableHead>
                  <TableHead className={tableCellClass}>Report</TableHead>
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
                    <TableCell className={tableCellClass}>
                      <Badge className={darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-700'}>
                        {farm.reportStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className={`${tableCellClass} text-right`}>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className={darkMode ? 'border-gray-600 text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}>
                          <FileText className="mr-1 h-4 w-4" />
                          Upload Report
                        </Button>
                        <Button variant="ghost" size="sm" className={darkMode ? 'text-gray-300 hover:bg-[#0d3036] hover:text-white' : 'text-gray-600 hover:text-emerald-700'}>
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Mark Verified
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card id="investor-farmer-matches" className={`${sectionCardClass} transition-colors`}>
        <CardContent className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f97316] via-[#f25d0a] to-[#d13b00] p-5 text-white shadow-md">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <Leaf className="absolute -top-6 -right-4 h-20 w-20 rotate-12" />
              <Leaf className="absolute bottom-0 left-2 h-16 w-16 -rotate-12" />
            </div>
            <div className="relative">
              <h3 className="text-xl font-semibold">Investor-Farmer Matches</h3>
              <p className="mt-1 text-sm text-white/90">
                Monitor investment progress and escalate accountability updates.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={tableHeaderRowClass}>
                  <TableHead className={tableCellClass}>Investor</TableHead>
                  <TableHead className={tableCellClass}>Farmer</TableHead>
                  <TableHead className={tableCellClass}>Farm Type</TableHead>
                  <TableHead className={tableCellClass}>Match Date</TableHead>
                  <TableHead className={tableCellClass}>Investment Value</TableHead>
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
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className={darkMode ? 'border-gray-600 text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}>
                          <FileText className="mr-1 h-4 w-4" />
                          Send Update
                        </Button>
                        <Button variant="ghost" size="sm" className={darkMode ? 'text-rose-400 hover:bg-[#0d3036] hover:text-rose-300' : 'text-rose-600 hover:text-rose-700'}>
                          <Flag className="mr-1 h-4 w-4" />
                          Flag Issue
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card id="dispute-management" className={`${sectionCardClass} transition-colors`}>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#c026d3] via-[#9d1cb4] to-[#6b0f75] p-5 text-white shadow-md">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute -top-6 -right-4 h-20 w-20 rotate-12" />
                  <Leaf className="absolute bottom-0 left-2 h-16 w-16 -rotate-12" />
                </div>
                <div className="relative">
                  <h3 className="text-xl font-semibold">Dispute Management</h3>
                  <p className="mt-1 text-sm text-white/90">
                    Log new disputes, coordinate resolutions, and track status.
                  </p>
                </div>
              </div>
              <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={() => navigate('/dashboard/agent/dispute-management')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Dispute
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={tableHeaderRowClass}>
                    <TableHead className={tableCellClass}>ID</TableHead>
                    <TableHead className={tableCellClass}>Parties</TableHead>
                    <TableHead className={tableCellClass}>Type</TableHead>
                    <TableHead className={tableCellClass}>Date Logged</TableHead>
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
                        <Button variant="ghost" size="sm" className={darkMode ? 'text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'text-emerald-700 hover:text-emerald-800'}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card id="training-performance" className={`${sectionCardClass} transition-colors`}>
          <CardContent className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#2f55d6] to-[#3b3fb5] p-5 text-white shadow-md">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Leaf className="absolute -top-6 -right-4 h-20 w-20 rotate-12" />
                <Leaf className="absolute bottom-0 left-2 h-16 w-16 -rotate-12" />
              </div>
              <div className="relative">
                <h3 className="text-xl font-semibold">Training & Performance</h3>
                <p className="mt-1 text-sm text-white/90">
                  Stay on top of agent development goals and monthly targets.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={`rounded-2xl border p-4 ${darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-emerald-100 bg-emerald-50'}`}>
                <div className="mb-3 flex items-center justify-between">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>Upcoming Trainings</p>
                  <Badge className={darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-700'}>
                    {agentTrainings.upcoming.length}
                  </Badge>
                </div>
                <ul className="space-y-3">
                  {agentTrainings.upcoming.map((session) => (
                    <li key={session.title} className={`rounded-lg p-3 text-sm shadow-sm ${darkMode ? 'bg-[#0b2528] text-gray-200' : 'bg-white text-gray-600'}`}>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.title}</p>
                      <p>{session.date} · {session.time}</p>
                      <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{session.mode}</p>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4 w-full bg-[#1db954] hover:bg-[#17a447] text-white">
                  Join Training
                </Button>
              </div>
               <div className={`rounded-2xl border p-4 shadow-sm ${darkMode ? 'border-[#1b5b65] bg-[#0f3035]' : 'border-gray-200 bg-white'}`}>
                 <p className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>Performance Summary</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={agentPerformanceTrend} barSize={18}>
                    <XAxis dataKey="month" stroke={darkMode ? '#a3b3c7' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)' }} />
                    <Bar dataKey="farmers" stackId="a" fill="#047857" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="reports" stackId="a" fill="#f97316" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="disputes" stackId="a" fill="#fb7185" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-3">
                  {agentTrainings.summary.map((item) => (
                    <div key={item.label}>
                      <div className={`flex items-center justify-between text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                        <span>{item.label}</span>
                        <span>{item.value}/{item.goal}</span>
                      </div>
                      <Progress value={(item.value / item.goal) * 100} className="h-2 bg-emerald-100" aria-label={item.label} />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className={darkMode ? 'mt-4 w-full border-gray-600 text-emerald-300 hover:bg-[#0d3036] hover:text-emerald-200' : 'mt-4 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50'}>
                  Download Certificate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card id="notifications" className={`${sectionCardClass} transition-colors`}>
        <CardContent className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7c3aed] via-[#6b2ed5] to-[#5120ad] p-5 text-white shadow-md">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <Leaf className="absolute -top-6 -right-4 h-20 w-20 rotate-12" />
              <Leaf className="absolute bottom-0 left-2 h-16 w-16 -rotate-12" />
            </div>
            <div className="relative">
              <h3 className="text-xl font-semibold">Notifications & Updates</h3>
              <p className="mt-1 text-sm text-white/90">
                Action new assignments, investor requests, and system alerts.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {agentNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`flex items-start gap-4 rounded-2xl border p-4 shadow-sm transition-colors ${
                  darkMode
                    ? 'border-[#1b5b65] bg-[#0f3035] text-gray-100'
                    : 'border-gray-200 bg-white text-gray-900'
                }`}
              >
                <span
                  className={`mt-1 flex h-10 w-10 items-center justify-center rounded-xl ${
                    notification.type === 'alert'
                      ? 'bg-rose-500/10 text-rose-600'
                      : notification.type === 'action'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-emerald-500/10 text-emerald-600'
                  }`}
                >
                  {notification.type === 'alert' ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : notification.type === 'action' ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className={`mt-1 text-xs uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {notification.time}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    darkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  View
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AgentLayout>
  );
};

export default AgentDashboard;

