import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Plus,
  Search,
  Eye,
  Upload,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import ViewDisputeModal from '@/components/agent/ViewDisputeModal';
import { useAuth } from '@/contexts/AuthContext';
import { GHANA_REGIONS, GHANA_COMMUNITIES, getRegionKey } from '@/data/ghanaRegions';

const DisputeManagement: React.FC = () => {
  const { darkMode } = useDarkMode();
  const { agent } = useAuth();
  const queryClient = useQueryClient();

  // All useState hooks must be declared at the top, before any useQuery
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showNewDisputeDialog, setShowNewDisputeDialog] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [newDispute, setNewDispute] = useState({
    farmerName: '',
    farmerId: '',
    investorName: '',
    type: '',
    severity: '',
    region: agent?.region || 'Ashanti Region',
    description: '',
    evidence: [] as File[]
  });

  const { data: summaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ['agentDashboardSummary'],
    queryFn: async () => {
      const response = await api.get('/dashboard/summary');
      return response.data.data;
    }
  });

  const disputes = summaryData?.disputes || [];
  const loading = loadingSummary;
  const isLoaded = !loadingSummary;

  const selectedDispute = disputes.find((d: any) =>
    (d._id && String(d._id) === selectedDisputeId) ||
    (d.id && String(d.id) === selectedDisputeId)
  );

  const { data: farmersResult } = useQuery({
    queryKey: ['agentFarmers'],
    queryFn: async () => {
      const response = await api.get('/farmers');
      return response.data;
    },
  });

  const farmersList = Array.isArray(farmersResult) ? farmersResult : (farmersResult?.data || []);

  const totalDisputes = disputes.length;
  const pendingDisputes = disputes.filter((d: any) => d.status === 'Pending').length;
  const underReviewDisputes = disputes.filter((d: any) => d.status === 'Under Review').length;
  const resolvedDisputes = disputes.filter((d: any) => d.status === 'Resolved').length;
  const escalatedDisputes = disputes.filter((d: any) => d.status === 'Escalated').length;

  const filteredDisputes = disputes.filter((dispute: any) => {
    const matchesSearch =
      (dispute.id?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (dispute.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (dispute.investor?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (dispute.type?.toLowerCase().includes(searchTerm.toLowerCase()) || '');

    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesType = typeFilter === 'all' || dispute.type === typeFilter;
    
    const effectiveRegion = agent?.region || "Ashanti Region";
    const matchesRegion = !effectiveRegion || dispute.region === effectiveRegion;
    const matchesDistrict = selectedDistrict === 'all' || dispute.district === selectedDistrict;
    const matchesCommunity = selectedCommunity === 'all' || dispute.community === selectedCommunity;
    
    const matchesSeverity = severityFilter === 'all' || dispute.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesRegion && matchesDistrict && matchesCommunity && matchesSeverity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return darkMode ? 'bg-[#065f46]/20 text-[#065f46] border-[#065f46]/50' : 'bg-[#065f46]/10 text-[#065f46] border-[#065f46]/30';
      case 'Under Review':
        return darkMode ? 'bg-blue-900/40 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Resolved':
        return darkMode ? 'bg-green-900/40 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-300';
      case 'Escalated':
        return darkMode ? 'bg-red-900/40 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-300';
      default:
        return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return darkMode ? 'text-red-400' : 'text-red-600';
      case 'Medium': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'Low': return darkMode ? 'text-green-400' : 'text-green-600';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const handleViewDetails = (dispute: any) => {
    setSelectedDisputeId(dispute._id || dispute.id);
    setShowDetailsDialog(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewDispute({ ...newDispute, evidence: [...newDispute.evidence, ...files] });
  };

  const disputeMutation = useMutation({
    mutationFn: async (disputeData: any) => {
      return api.post('/disputes', disputeData);
    },
    onSuccess: async () => {
      await Swal.fire({
        icon: 'success',
        title: 'Dispute Logged!',
        html: `
          <div style="text-align: center; padding: 10px 0;">
            <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
              Dispute logged successfully
            </p>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#065f46',
        timer: 2000,
        timerProgressBar: true
      });
      queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
      setShowNewDisputeDialog(false);
      setNewDispute({
        farmerName: '',
        farmerId: '',
        investorName: '',
        type: '',
        severity: '',
        region: agent?.region || '',
        description: '',
        evidence: []
      });
    },
    onError: (err: any) => {
      console.error('Error submitting dispute:', err);
      toast.error(err.response?.data?.msg || 'Failed to log dispute');
    }
  });

  useEffect(() => {
    if (agent?.region) {
      setNewDispute(prev => ({ ...prev, region: agent.region || '' }));
    }
  }, [agent?.region]);

  const isSubmitting = disputeMutation.isPending;

  const handleSubmitDispute = async () => {
    if (!newDispute.farmerId || !newDispute.investorName || !newDispute.type || !newDispute.severity || !newDispute.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const disputeData = {
      id: `DIST-${Date.now().toString().slice(-6)}`,
      farmerId: newDispute.farmerId,
      investor: newDispute.investorName,
      type: newDispute.type,
      severity: newDispute.severity,
      region: newDispute.region,
      description: newDispute.description
    };

    disputeMutation.mutate(disputeData);
  };

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(statusFilter === status ? 'all' : status);
  };

  const summaryCards = [
    { title: 'Total Disputes', value: totalDisputes, icon: AlertTriangle, status: 'all', color: 'bg-slate-600' },
    { title: 'Pending', value: pendingDisputes, icon: Clock, status: 'Pending', color: 'bg-[#065f46]' },
    { title: 'Under Review', value: underReviewDisputes, icon: Search, status: 'Under Review', color: 'bg-blue-600' },
    { title: 'Resolved', value: resolvedDisputes, icon: CheckCircle, status: 'Resolved', color: 'bg-emerald-600' },
    { title: 'Escalated', value: escalatedDisputes, icon: TrendingUp, status: 'Escalated', color: 'bg-red-600' },
  ];

  return (
    <AgentLayout
      activeSection="dispute-management"
      title="Dispute Management"
    >
      <div className="space-y-8">
        {/* 1. Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          {summaryCards.map((card, idx) => (
            <Card
              key={idx}
              className={`${card.color} border-none rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-700 relative overflow-hidden h-28 sm:h-36 ${statusFilter === card.status ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
              onClick={() => handleFilterByStatus(card.status)}
            >
              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <card.icon className="absolute top-1 right-1 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
              </div>

              <div className="p-3 sm:p-5 flex flex-col h-full relative z-10">
                <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                  <card.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  <p className="text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider">{card.title}</p>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-2xl sm:text-4xl font-bold text-white">{card.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 2. Search & Filter Bar */}
        <Card className={`mb-6 ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}`}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    placeholder="Search by ID, farmer, investor, type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white placeholder:text-gray-500' : ''}`}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                  <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Status</SelectItem>
                  <SelectItem value="Pending" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Pending</SelectItem>
                  <SelectItem value="Under Review" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Under Review</SelectItem>
                  <SelectItem value="Resolved" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Resolved</SelectItem>
                  <SelectItem value="Escalated" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Escalated</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
                  <SelectValue placeholder="Dispute Type" />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                  <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Types</SelectItem>
                  <SelectItem value="Payment Delay" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Payment Delay</SelectItem>
                  <SelectItem value="Poor Farm Performance" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Poor Farm Performance</SelectItem>
                  <SelectItem value="Breach of Agreement" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Breach of Agreement</SelectItem>
                  <SelectItem value="Input Misuse" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Input Misuse</SelectItem>
                  <SelectItem value="Miscommunication" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Miscommunication</SelectItem>
                </SelectContent>
              </Select>

              {/* District Filter */}
              <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setSelectedCommunity('all'); }}>
                <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                  <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Districts</SelectItem>
                  {GHANA_REGIONS[getRegionKey(agent?.region)]?.map(d => (
                    <SelectItem key={d} value={d} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Community Filter */}
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
                  <SelectValue placeholder="Community" />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                  <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Communities</SelectItem>
                  {selectedDistrict !== 'all' && GHANA_COMMUNITIES[selectedDistrict]?.map(c => (
                    <SelectItem key={c} value={c} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Severity Filter */}
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                  <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Severity</SelectItem>
                  <SelectItem value="High" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>High</SelectItem>
                  <SelectItem value="Medium" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Medium</SelectItem>
                  <SelectItem value="Low" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 3. Helper Header & Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>All Disputes</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Showing {filteredDisputes.length} of {disputes.length} disputes</p>
          </div>
          <Button
            className={`w-full sm:w-auto shadow-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 transition-all transform hover:scale-105 active:scale-95 py-6 sm:py-2 text-base sm:text-sm`}
            onClick={() => setShowNewDisputeDialog(true)}
          >
            <div className="flex items-center justify-center">
              <div className="bg-white/20 p-1 rounded-full mr-2">
                <Plus className="h-5 w-5 text-white" />
              </div>
              Log New Dispute
            </div>
          </Button>
        </div>

        {/* 4. Disputes Table */}
        <Card className={`transition-colors ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}`}>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#065f46]">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Dispute ID</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Parties Involved</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Type</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Severity</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Date Logged</TableHead>
                  <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Status</TableHead>
                  <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisputes.map((dispute: any) => (
                  <TableRow
                    key={dispute.id}
                    className={`border-b cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-[#0d3036]' : 'hover:bg-gray-50'}`}
                    onClick={() => handleViewDetails(dispute)}
                  >
                    <TableCell className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {dispute.id}
                    </TableCell>
                    <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <div className="flex flex-col">
                        <span className="font-medium">{dispute.farmer?.name || 'Unknown Farmer'}</span>
                        <span className="text-xs opacity-70">vs {dispute.investor || 'Unknown Investor'}</span>
                      </div>
                    </TableCell>
                    <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {dispute.type}
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${getSeverityColor(dispute.severity)}`}>
                        {dispute.severity}
                      </span>
                    </TableCell>
                    <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {dispute.dateLogged}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border ${getStatusColor(dispute.status)}`}>
                        {dispute.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 px-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(dispute);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">View</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDisputes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className={`h-48 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
                        <p>No disputes found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ViewDisputeModal
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          dispute={selectedDispute}
        />

        {/* Log New Dispute Dialog */}
        <Dialog open={showNewDisputeDialog} onOpenChange={setShowNewDisputeDialog}>
          <DialogContent className={`max-w-2xl ${darkMode ? 'bg-[#002f37] border-gray-600 text-white' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Log New Dispute
              </DialogTitle>
              <DialogDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Register a new dispute case between parties
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-200' : ''}>Affected Farmer</Label>
                <Select
                  value={newDispute.farmerId}
                  onValueChange={(val) => {
                    const farmer = farmersList.find((f: any) => f._id === val);
                    setNewDispute({
                      ...newDispute,
                      farmerId: val,
                      farmerName: farmer?.name || '',
                      region: farmer?.region || newDispute.region // Auto-select region
                    });
                  }}
                >
                  <SelectTrigger className={`h-12 ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}`}>
                    <SelectValue placeholder="Select farmer..." />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                    {farmersList.map((f: any) => (
                      <SelectItem key={f._id} value={f._id} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>
                        {f.name} - {f.community}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={darkMode ? 'text-gray-200' : ''}>Investor / Party Involved</Label>
                <Input
                  value={newDispute.investorName}
                  onChange={(e) => setNewDispute({ ...newDispute, investorName: e.target.value })}
                  placeholder="Enter investor name"
                  className={`h-12 ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-200' : ''}>Dispute Type</Label>
                  <Select value={newDispute.type} onValueChange={(val) => setNewDispute({ ...newDispute, type: val })}>
                    <SelectTrigger className={`h-12 ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                      <SelectItem value="Payment Delay" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Payment Delay</SelectItem>
                      <SelectItem value="Poor Farm Performance" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Poor Farm Performance</SelectItem>
                      <SelectItem value="Breach of Agreement" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Breach of Agreement</SelectItem>
                      <SelectItem value="Input Misuse" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Input Misuse</SelectItem>
                      <SelectItem value="Miscommunication" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Miscommunication</SelectItem>
                      <SelectItem value="Others" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-200' : ''}>Severity</Label>
                  <Select value={newDispute.severity} onValueChange={(val) => setNewDispute({ ...newDispute, severity: val })}>
                    <SelectTrigger className={`h-12 ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}`}>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                      <SelectItem value="High" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>High</SelectItem>
                      <SelectItem value="Medium" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Medium</SelectItem>
                      <SelectItem value="Low" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={darkMode ? 'text-gray-200' : ''}>Region</Label>
                  <Select value={newDispute.region} onValueChange={(val) => setNewDispute({ ...newDispute, region: val })} disabled={true}>
                    <SelectTrigger className={`h-12 ${darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}`}>
                      <SelectValue placeholder={agent?.region || "Select region"} />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                      {agent?.region && <SelectItem value={agent.region} className={darkMode ? 'text-white hover:bg-gray-800' : ''}>{agent.region}</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className={darkMode ? 'text-gray-200' : ''}>Description *</Label>
                <Textarea
                  value={newDispute.description}
                  onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                  placeholder="Provide detailed description of the dispute..."
                  rows={4}
                  className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}
                />
              </div>

              <div>
                <Label className={darkMode ? 'text-gray-200' : ''}>Upload Evidence (Optional)</Label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-gray-700 bg-[#0d3036]' : 'border-gray-300'}`}>
                  <input
                    type="file"
                    id="evidence-upload"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </label>
                  {newDispute.evidence.length > 0 && (
                    <div className="mt-4 text-left">
                      <p className="text-sm font-medium mb-1">Selected files:</p>
                      <ul className="text-xs text-blue-500">
                        {newDispute.evidence.map((file, idx) => (
                          <li key={idx}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowNewDisputeDialog(false)} className={darkMode ? 'border-gray-600 text-white hover:bg-gray-800' : ''}>
                Cancel
              </Button>
              <Button
                className="bg-[#065f46] hover:bg-[#065f46]/90 text-white border-none"
                onClick={handleSubmitDispute}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Dispute'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AgentLayout>
  );
};

export default DisputeManagement;




