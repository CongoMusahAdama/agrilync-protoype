import React, { useState } from 'react';
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
import ViewDisputeModal from '@/components/agent/ViewDisputeModal';

const DisputeManagement: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showNewDisputeDialog, setShowNewDisputeDialog] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await api.get('/disputes');
        setDisputes(res.data);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error fetching disputes:', err);
        toast.error('Failed to load disputes');
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  // New dispute form state
  const [newDispute, setNewDispute] = useState({
    farmerName: '',
    investorName: '',
    type: '',
    severity: '',
    region: '',
    description: '',
    evidence: [] as File[]
  });

  // Calculate stats
  // Calculate stats
  const totalDisputes = disputes.length;
  const pendingDisputes = disputes.filter(d => d.status === 'Pending').length;
  const underReviewDisputes = disputes.filter(d => d.status === 'Under Review').length;
  const resolvedDisputes = disputes.filter(d => d.status === 'Resolved').length;
  const escalatedDisputes = disputes.filter(d => d.status === 'Escalated').length;

  // Filter disputes
  // Filter disputes
  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch =
      (dispute.id?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (dispute.parties?.farmer?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (dispute.parties?.investor?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (dispute.type?.toLowerCase().includes(searchTerm.toLowerCase()) || '');

    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesType = typeFilter === 'all' || dispute.type === typeFilter;
    const matchesRegion = regionFilter === 'all' || dispute.region === regionFilter;
    const matchesSeverity = severityFilter === 'all' || dispute.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesRegion && matchesSeverity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return darkMode ? 'bg-orange-900/40 text-orange-300 border-orange-700' : 'bg-orange-100 text-orange-800 border-orange-300';
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
    setSelectedDispute(dispute);
    setShowDetailsDialog(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewDispute({ ...newDispute, evidence: [...newDispute.evidence, ...files] });
  };

  const handleSubmitDispute = async () => {
    if (!newDispute.farmerName || !newDispute.investorName || !newDispute.type || !newDispute.severity || !newDispute.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/disputes', {
        id: `DIST-${Date.now().toString().slice(-6)}`,
        parties: {
          farmer: newDispute.farmerName,
          investor: newDispute.investorName
        },
        type: newDispute.type,
        severity: newDispute.severity,
        region: newDispute.region,
        description: newDispute.description
      });

      setDisputes([res.data, ...disputes]);
      toast.success('Dispute logged successfully');
      setShowNewDisputeDialog(false);
      setNewDispute({
        farmerName: '',
        investorName: '',
        type: '',
        severity: '',
        region: '',
        description: '',
        evidence: []
      });
    } catch (err) {
      console.error('Error submitting dispute:', err);
      toast.error('Failed to log dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(statusFilter === status ? 'all' : status);
  };

  const summaryCards = [
    { title: 'Total Disputes', value: totalDisputes, icon: AlertTriangle, status: 'all', color: 'bg-slate-600' },
    { title: 'Pending', value: pendingDisputes, icon: Clock, status: 'Pending', color: 'bg-orange-600' },
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
              className={`${card.color} border-none rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-700 relative overflow-hidden ${statusFilter === card.status ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
              onClick={() => handleFilterByStatus(card.status)}
            >
              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <card.icon className="absolute top-1 right-1 h-12 w-12 text-white rotate-12" />
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

              {/* Region Filter */}
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                  <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Regions</SelectItem>
                  <SelectItem value="Ashanti" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Ashanti</SelectItem>
                  <SelectItem value="Northern" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Northern</SelectItem>
                  <SelectItem value="Eastern" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Eastern</SelectItem>
                  <SelectItem value="Savannah" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Savannah</SelectItem>
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>All Disputes</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Showing {filteredDisputes.length} of {disputes.length} disputes</p>
          </div>
          <Button
            className="bg-[#7ede56] hover:bg-[#6bc947] text-white px-6 py-2 shadow-md hover:shadow-lg transition-all"
            onClick={() => setShowNewDisputeDialog(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Log New Dispute
          </Button>
        </div>

        {/* 4. Disputes Table */}
        <Card className={`transition-colors ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'}`}>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1db954] border-[#1db954] hover:bg-[#1db954]">
                  <TableHead className="text-white font-semibold">Dispute ID</TableHead>
                  <TableHead className="text-white font-semibold">Parties Involved</TableHead>
                  <TableHead className="text-white font-semibold">Type</TableHead>
                  <TableHead className="text-white font-semibold">Severity</TableHead>
                  <TableHead className="text-white font-semibold">Date Logged</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-right text-white font-semibold pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisputes.map((dispute) => (
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
                        <span className="font-medium">{dispute.parties?.farmer}</span>
                        <span className="text-xs opacity-70">vs {dispute.parties?.investor}</span>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#1db954] hover:text-[#17a447] hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(dispute);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
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

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={darkMode ? 'text-gray-200' : ''}>Farmer Name *</Label>
                  <Input
                    value={newDispute.farmerName}
                    onChange={(e) => setNewDispute({ ...newDispute, farmerName: e.target.value })}
                    placeholder="Enter farmer name"
                    className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}
                  />
                </div>
                <div>
                  <Label className={darkMode ? 'text-gray-200' : ''}>Investor Name *</Label>
                  <Input
                    value={newDispute.investorName}
                    onChange={(e) => setNewDispute({ ...newDispute, investorName: e.target.value })}
                    placeholder="Enter investor name"
                    className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className={darkMode ? 'text-gray-200' : ''}>Dispute Type *</Label>
                  <Select value={newDispute.type} onValueChange={(val) => setNewDispute({ ...newDispute, type: val })}>
                    <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
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
                <div>
                  <Label className={darkMode ? 'text-gray-200' : ''}>Severity *</Label>
                  <Select value={newDispute.severity} onValueChange={(val) => setNewDispute({ ...newDispute, severity: val })}>
                    <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                      <SelectItem value="High" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>High</SelectItem>
                      <SelectItem value="Medium" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Medium</SelectItem>
                      <SelectItem value="Low" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className={darkMode ? 'text-gray-200' : ''}>Region *</Label>
                  <Select value={newDispute.region} onValueChange={(val) => setNewDispute({ ...newDispute, region: val })}>
                    <SelectTrigger className={darkMode ? 'bg-[#10363d] border-[#1b5b65] text-white' : ''}>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                      <SelectItem value="Ashanti" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Ashanti</SelectItem>
                      <SelectItem value="Northern" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Northern</SelectItem>
                      <SelectItem value="Eastern" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Eastern</SelectItem>
                      <SelectItem value="Savannah" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Savannah</SelectItem>
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
                className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
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
