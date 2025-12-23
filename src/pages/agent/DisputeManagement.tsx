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
  AlertCircle
} from 'lucide-react';
import { agentDisputes } from './agent-data';
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
  const totalDisputes = agentDisputes.length;
  const pendingDisputes = agentDisputes.filter(d => d.status === 'Pending').length;
  const underReviewDisputes = agentDisputes.filter(d => d.status === 'Under Review').length;
  const resolvedDisputes = agentDisputes.filter(d => d.status === 'Resolved').length;
  const escalatedDisputes = agentDisputes.filter(d => d.status === 'Escalated').length;

  // Filter disputes
  const filteredDisputes = agentDisputes.filter(dispute => {
    const matchesSearch =
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.parties?.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.parties?.investor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.type.toLowerCase().includes(searchTerm.toLowerCase());

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

  const handleSubmitDispute = () => {
    console.log('New dispute submitted:', newDispute);
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
  };

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(statusFilter === status ? 'all' : status);
  };

  const summaryCards = [
    { title: 'Total Disputes Logged', value: totalDisputes, icon: AlertTriangle, status: 'all', color: 'text-gray-600', bg: 'bg-gray-50' },
    { title: 'Pending Disputes', value: pendingDisputes, icon: Clock, status: 'Pending', color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Under Investigation', value: underReviewDisputes, icon: Search, status: 'Under Review', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Resolved Disputes', value: resolvedDisputes, icon: CheckCircle, status: 'Resolved', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Escalated Disputes', value: escalatedDisputes, icon: TrendingUp, status: 'Escalated', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <AgentLayout
      activeSection="dispute-management"
      title="Dispute Management"
      subtitle="Track, manage, and resolve ecosystem disputes with transparency."
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {summaryCards.map((card, idx) => (
            <Card
              key={idx}
              className={`cursor-pointer transition-all hover:shadow-md border-none shadow-sm ${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white'} ${statusFilter === card.status ? 'ring-2 ring-emerald-500' : ''}`}
              onClick={() => handleFilterByStatus(card.status)}
            >
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl mb-3 ${card.bg} ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900 font-outfit'}`}>{card.value}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 2. Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-white dark:bg-gray-900/40 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Search Dispute</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ID, Name, Type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 text-sm border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 text-sm border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <SelectValue placeholder="Dispute Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Payment Delay">Payment Delay</SelectItem>
                  <SelectItem value="Poor Farm Performance">Poor Farm Performance</SelectItem>
                  <SelectItem value="Breach of Agreement">Breach of Agreement</SelectItem>
                  <SelectItem value="Input Misuse">Input Misuse</SelectItem>
                  <SelectItem value="Miscommunication">Miscommunication</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Location</Label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="h-10 text-sm border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Ashanti">Ashanti</SelectItem>
                  <SelectItem value="Northern">Northern</SelectItem>
                  <SelectItem value="Eastern">Eastern</SelectItem>
                  <SelectItem value="Savannah">Savannah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Urgency</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="h-10 text-sm border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="High">🔴 High</SelectItem>
                  <SelectItem value="Medium">🟡 Medium</SelectItem>
                  <SelectItem value="Low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
            onClick={() => setShowNewDisputeDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Log New Dispute
          </Button>
        </div>

        {/* 3. Disputes Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900 font-outfit'}`}>Case Files</h2>
            <Badge variant="outline" className="text-[10px] uppercase font-black px-3 py-1 border-gray-200 text-gray-400">
              {filteredDisputes.length} Cases Found
            </Badge>
          </div>

          <Card className={`overflow-hidden border-none shadow-sm ${darkMode ? 'bg-gray-900/40' : 'bg-white'}`}>
            <Table>
              <TableHeader>
                <TableRow className={darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-100'}>
                  <TableHead className={`font-bold uppercase text-[10px] tracking-widest p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ID</TableHead>
                  <TableHead className={`font-bold uppercase text-[10px] tracking-widest p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Parties Involved</TableHead>
                  <TableHead className={`font-bold uppercase text-[10px] tracking-widest p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Issue Type</TableHead>
                  <TableHead className={`font-bold uppercase text-[10px] tracking-widest p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Severity</TableHead>
                  <TableHead className={`font-bold uppercase text-[10px] tracking-widest p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Logged On</TableHead>
                  <TableHead className={`font-bold uppercase text-[10px] tracking-widest p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</TableHead>
                  <TableHead className={`text-right font-bold uppercase text-[10px] tracking-widest p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisputes.map((dispute) => (
                  <TableRow
                    key={dispute.id}
                    className={`border-b transition-colors cursor-pointer ${darkMode ? 'border-gray-800 hover:bg-white/5' : 'hover:bg-emerald-50/50 border-gray-100'}`}
                    onClick={() => handleViewDetails(dispute)}
                  >
                    <TableCell className={`font-bold text-xs p-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {dispute.id}
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{dispute.parties?.farmer}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">vs {dispute.parties?.investor}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-xs p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {dispute.type}
                    </TableCell>
                    <TableCell className="p-4">
                      <Badge variant="outline" className={`text-[10px] font-bold border-none px-0 ${getSeverityColor(dispute.severity)}`}>
                        {dispute.severity === 'High' ? '🔴' : dispute.severity === 'Medium' ? '🟡' : '🟢'} {dispute.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-xs p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {dispute.dateLogged}
                    </TableCell>
                    <TableCell className="p-4">
                      <Badge className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-sm shadow-none ${dispute.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                          dispute.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                            dispute.status === 'Escalated' ? 'bg-rose-100 text-rose-700' :
                              'bg-orange-100 text-orange-700'
                        }`}>
                        {dispute.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(dispute);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDisputes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                        <AlertCircle className="h-12 w-12" />
                        <p className="font-bold uppercase tracking-widest text-sm text-gray-500">No Case Files Found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

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
            <Button className="bg-[#7ede56] hover:bg-[#6bc947] text-white" onClick={handleSubmitDispute}>
              Register Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AgentLayout>
  );
};

export default DisputeManagement;
