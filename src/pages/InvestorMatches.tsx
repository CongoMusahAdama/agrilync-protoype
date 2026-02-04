import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  Search,
  Filter,
  ArrowUpRight,
  DollarSign,
  Calendar,
  MapPin,
  TrendingUp,
  Activity,
  Plus,
  Percent,
  AlertCircle,
  Leaf,
  CheckCircle,
  Clock,
  X,
  FileCheck,
  Eye,
  Mail,
  Upload,
  Phone,
  MessageCircle,
  Copy,
  UserCheck
} from 'lucide-react';

const InvestorMatches = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'matches' | 'investments' | 'stages'>('matches');
  const [investmentStageFilter, setInvestmentStageFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'completed'>('all');
  const { darkMode } = useDarkMode();

  // Handle tab from URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'investments' || tabParam === 'matches' || tabParam === 'stages') {
      setActiveTab(tabParam as 'matches' | 'investments' | 'stages');
    }
  }, [location]);

  // Investment update states
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<number | null>(null);
  const [expandedInvestments, setExpandedInvestments] = useState<{ [key: number]: boolean }>({});
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedInvestmentForDetails, setSelectedInvestmentForDetails] = useState<any>(null);
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    message: '',
    investmentId: null as number | null,
    photos: [] as File[],
    photoPreviews: [] as string[]
  });
  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    progress: 0,
    photos: [] as File[],
    photoPreviews: [] as string[]
  });

  // Toggle investment updates expansion
  const toggleInvestmentUpdates = (investmentId: number) => {
    setExpandedInvestments({
      ...expandedInvestments,
      [investmentId]: !expandedInvestments[investmentId]
    });
  };

  // Calculate progress based on updates (each update adds ~10% progress)
  const calculateProgress = (updates: any[]) => {
    if (!updates || updates.length === 0) return 0;
    // Start at 10%, each update adds 10%, max at 100%
    return Math.min(10 + (updates.length * 10), 100);
  };

  // Initialize progress on component mount based on existing updates
  useEffect(() => {
    setMockInvestments(prevInvestments =>
      prevInvestments.map(inv => ({
        ...inv,
        progress: calculateProgress(inv.updates || [])
      }))
    );
  }, []); // Only run on mount


  // Mock data for investor matches (potential investors to connect with)
  const mockMatches = [
    {
      id: 1,
      investorName: 'AgriInvest Ghana Ltd',
      amount: 50000,
      interest: 'Cocoa farming with 20% profit share',
      date: '2024-01-15',
      status: 'matched',
      region: 'Ashanti',
      farmType: 'Crop',
      category: 'Cocoa',
      contact: '+233 24 123 4567',
      email: 'contact@agriinvest.gh'
    },
    {
      id: 2,
      investorName: 'Green Future Capital',
      amount: 30000,
      interest: 'Poultry farming with equipment support',
      date: '2024-01-10',
      status: 'pending',
      region: 'Eastern',
      farmType: 'Livestock',
      category: 'Poultry',
      contact: '+233 20 987 6543',
      email: 'info@greenfuture.gh'
    },
    {
      id: 3,
      investorName: 'FarmTech Solutions',
      amount: 75000,
      interest: 'Mixed farming with technology integration',
      date: '2024-01-05',
      status: 'matched',
      region: 'Central',
      farmType: 'Mixed',
      category: 'Maize & Poultry',
      contact: '+233 26 555 1234',
      email: 'hello@farmtech.gh'
    },
    {
      id: 4,
      investorName: 'Sustainable Agriculture Fund',
      amount: 40000,
      interest: 'Rice farming with irrigation support',
      date: '2024-01-01',
      status: 'rejected',
      region: 'Northern',
      farmType: 'Crop',
      category: 'Rice',
      contact: '+233 24 777 8888',
      email: 'fund@sustainable.gh'
    }
  ];

  // Mock data for active investments (investments received and being tracked)
  const [mockInvestments, setMockInvestments] = useState([
    {
      id: 1,
      investorName: 'AgriInvest Ghana Ltd',
      investmentType: 'mixed', // 'financial', 'equipment', 'mixed'
      investmentAmount: 50000,
      receivedAmount: 35000,
      receivedEquipment: [
        { name: 'Irrigation System', quantity: 1, value: 10000 },
        { name: 'Fertilizer (NPK)', quantity: 50, unit: 'bags', value: 5000 }
      ],
      projectName: 'Cocoa Plantation 2024',
      startDate: '2024-01-15',
      expectedReturns: 60000,
      actualReturns: 0,
      status: 'active',
      progress: 45, // Auto-calculated based on updates (3 updates = ~45%)
      approvalStatus: 'approved', // 'pending', 'approved', 'rejected'
      extensionAgent: 'Kwame Mensah',
      extensionAgentContact: '+233 20 123 4567',
      documents: {
        investmentAgreement: { signed: true, signedBy: ['Farmer', 'Investor'] as string[] },
        farmerSignature: true,
        investorSignature: true,
        extensionAgentApproval: true
      },
      payments: [
        { date: '2024-01-15', amount: 35000, type: 'Initial Payment', status: 'completed' },
        { date: '2024-01-20', amount: 0, type: 'Equipment Received', equipment: ['Irrigation System', 'Fertilizer'], status: 'completed' }
      ],
      nextPayment: '2024-09-15',
      profitShare: '20%',
      contact: '+233 24 123 4567',
      email: 'contact@agriinvest.gh',
      updates: [
        {
          id: 1,
          title: 'Land Preparation Complete',
          description: 'Successfully cleared and prepared 2.5 acres of land for cocoa plantation. Soil testing completed and pH levels are optimal.',
          date: '2024-01-20',
          progress: 20,
          photos: [] as string[]
        },
        {
          id: 2,
          title: 'Seedling Planting Progress',
          description: 'Planted 500 cocoa seedlings. Using improved Amelonado variety. Irrigation system installation in progress.',
          date: '2024-02-15',
          progress: 35,
          photos: [] as string[]
        },
        {
          id: 3,
          title: 'Growth Monitoring',
          description: 'Regular monitoring shows healthy growth. 98% survival rate. First round of fertilizers applied. Pest control measures in place.',
          date: '2024-03-10',
          progress: 45,
          photos: [] as string[]
        }
      ]
    },
    {
      id: 2,
      investorName: 'FarmTech Solutions',
      investmentType: 'equipment', // 'financial', 'equipment', 'mixed'
      investmentAmount: 75000,
      receivedAmount: 0,
      receivedEquipment: [
        { name: 'Automated Feeding System', quantity: 1, value: 30000 },
        { name: 'Poultry House Equipment', quantity: 1, value: 25000 },
        { name: 'Watering System', quantity: 1, value: 10000 },
        { name: 'Temperature Control System', quantity: 1, value: 10000 }
      ],
      projectName: 'Mixed Farming Project',
      startDate: '2024-01-05',
      expectedReturns: 90000,
      actualReturns: 0,
      status: 'active',
      progress: 60, // Will be auto-calculated
      approvalStatus: 'approved', // 'pending', 'approved', 'rejected'
      extensionAgent: 'Ama Asante',
      extensionAgentContact: '+233 24 789 0123',
      documents: {
        investmentAgreement: { signed: true, signedBy: ['Farmer', 'Investor'] as string[] },
        farmerSignature: true,
        investorSignature: true,
        extensionAgentApproval: true
      },
      payments: [
        { date: '2024-01-05', amount: 0, type: 'Equipment Received', equipment: ['Automated Feeding System', 'Poultry House Equipment'], status: 'completed' },
        { date: '2024-01-10', amount: 0, type: 'Equipment Received', equipment: ['Watering System', 'Temperature Control System'], status: 'completed' }
      ],
      nextPayment: '2024-06-05',
      profitShare: '25%',
      contact: '+233 26 555 1234',
      email: 'hello@farmtech.gh',
      updates: [
        {
          id: 1,
          title: 'Project Launch',
          description: 'Started mixed farming project with maize and poultry. Infrastructure setup complete.',
          date: '2024-01-10',
          progress: 15,
          photos: [] as string[]
        },
        {
          id: 2,
          title: 'Poultry House Completed',
          description: 'Modern poultry house with automated feeding system operational. 200 broiler chicks received.',
          date: '2024-01-25',
          progress: 35,
          photos: [] as string[]
        },
        {
          id: 3,
          title: 'Maize Planting Done',
          description: 'Completed planting of 1 acre maize field with improved Obatanpa seeds. First harvest expected in April.',
          date: '2024-02-05',
          progress: 50,
          photos: [] as string[]
        },
        {
          id: 4,
          title: 'Excellent Progress',
          description: 'Poultry growing well, expected to reach market weight soon. Maize field showing strong growth.',
          date: '2024-03-01',
          progress: 60,
          photos: [] as string[]
        }
      ]
    }
  ]);

  const filteredMatches = mockMatches.filter(match => {
    const matchesSearch = match.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.interest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (darkMode) {
      switch (status) {
        case 'matched': return 'bg-green-900/30 text-green-300';
        case 'pending': return 'bg-yellow-900/30 text-yellow-300';
        case 'rejected': return 'bg-red-900/30 text-red-300';
        default: return 'bg-gray-800 text-gray-300';
      }
    } else {
      switch (status) {
        case 'matched': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  // Handle opening update dialog
  const handleAddUpdate = (investmentId: number) => {
    const investment = mockInvestments.find(inv => inv.id === investmentId);
    setSelectedInvestment(investmentId);
    setUpdateForm({
      title: '',
      description: '',
      progress: investment?.progress || calculateProgress(investment?.updates || []),
      photos: [],
      photoPreviews: []
    });
    setShowUpdateDialog(true);
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [...updateForm.photos, ...files];
    const newPreviews = newPhotos.map(file => URL.createObjectURL(file));

    setUpdateForm({
      ...updateForm,
      photos: newPhotos,
      photoPreviews: newPreviews
    });
  };

  // Remove photo
  const removePhoto = (index: number) => {
    const newPhotos = updateForm.photos.filter((_, i) => i !== index);
    const newPreviews = updateForm.photoPreviews.filter((_, i) => i !== index);
    setUpdateForm({
      ...updateForm,
      photos: newPhotos,
      photoPreviews: newPreviews
    });
  };

  // Submit investment update
  const handleSubmitUpdate = () => {
    if (!selectedInvestment || !updateForm.title || !updateForm.description) return;

    const investment = mockInvestments.find(inv => inv.id === selectedInvestment);
    if (!investment) return;

    const newUpdate = {
      id: Date.now(),
      title: updateForm.title,
      description: updateForm.description,
      date: new Date().toISOString().split('T')[0],
      progress: updateForm.progress,
      photos: updateForm.photoPreviews // In real app, these would be uploaded to server
    };

    const updatedInvestment = {
      ...investment,
      updates: [newUpdate, ...investment.updates]
    };

    // Auto-calculate progress based on number of updates
    const newProgress = calculateProgress(updatedInvestment.updates);

    setMockInvestments(investments =>
      investments.map(inv =>
        inv.id === selectedInvestment
          ? {
            ...updatedInvestment,
            progress: newProgress
          }
          : inv
      )
    );

    setShowUpdateDialog(false);
    setUpdateForm({
      title: '',
      description: '',
      progress: newProgress,
      photos: [],
      photoPreviews: []
    });
    setSelectedInvestment(null);
  };

  // Handle complaint photo upload
  const handleComplaintPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = [...complaintForm.photos, ...files];
    const newPreviews = newPhotos.map(file => URL.createObjectURL(file));

    setComplaintForm({
      ...complaintForm,
      photos: newPhotos,
      photoPreviews: newPreviews
    });
  };

  // Remove complaint photo
  const removeComplaintPhoto = (index: number) => {
    const newPhotos = complaintForm.photos.filter((_, i) => i !== index);
    const newPreviews = complaintForm.photoPreviews.filter((_, i) => i !== index);
    setComplaintForm({
      ...complaintForm,
      photos: newPhotos,
      photoPreviews: newPreviews
    });
  };

  // Handle complaint submission
  const handleSubmitComplaint = () => {
    if (!complaintForm.subject || !complaintForm.message) return;
    // In real app, submit to backend with photos
    console.log('Complaint submitted:', complaintForm);
    setShowComplaintDialog(false);
    setComplaintForm({
      subject: '',
      message: '',
      investmentId: null,
      photos: [],
      photoPreviews: []
    });
  };


  return (
    <DashboardLayout activeSidebarItem="investor-matches" title="Investor Matches" description="Find and manage your financial partners">

      <div className="w-full p-3 sm:p-4 md:p-6">
        {/* Investor Risk Notice */}
        <div className={`mb-6 p-4 rounded-xl border flex gap-3 ${darkMode ? 'bg-amber-900/20 border-amber-800 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm leading-relaxed">
            <strong>Investor Risk Notice:</strong> Agriculture involves natural and market risks. Returns are not guaranteed. AgriLync does not provide financial advice. Users are responsible for their participation decisions.
          </p>
        </div>

        {/* Tabs */}
        {/* Tabs - Scrollable on mobile */}
        <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar snap-x">
          <button
            type="button"
            onClick={() => setActiveTab('matches')}
            className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap snap-start ${activeTab === 'matches'
              ? `border-b-2 ${darkMode ? 'border-[#7ede56] text-[#7ede56]' : 'border-[#7ede56] text-[#7ede56]'}`
              : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Find Investors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stages')}
            className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap snap-start ${activeTab === 'stages'
              ? `border-b-2 ${darkMode ? 'border-[#7ede56] text-[#7ede56]' : 'border-[#7ede56] text-[#7ede56]'}`
              : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Investment Stages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('investments')}
            className={`px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap snap-start ${activeTab === 'investments'
              ? `border-b-2 ${darkMode ? 'border-[#7ede56] text-[#7ede56]' : 'border-[#7ede56] text-[#7ede56]'}`
              : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            My Investments
          </button>
        </div>

        {/* Find Investors Tab */}
        {activeTab === 'matches' && (
          <>
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    placeholder="Search investors or interests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}`}
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className={darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                    <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Status</SelectItem>
                    <SelectItem value="matched" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Matched</SelectItem>
                    <SelectItem value="pending" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Pending</SelectItem>
                    <SelectItem value="rejected" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Matches List */}
            <div className="space-y-4">
              {filteredMatches.map((match) => (
                <Card key={match.id} className={`hover:shadow-md transition-shadow ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.investorName}</h3>
                          <Badge className={getStatusColor(match.status)}>
                            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div>
                            <p className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount</p>
                            <p className={`text-base sm:text-lg font-bold ${darkMode ? 'text-[#7ede56]' : 'text-[#0b8a62]'}`}>₵{match.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Region</p>
                            <p className={`text-sm flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              <MapPin className="h-3 w-3 text-[#7ede56]" />
                              {match.region}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className={`text-[10px] sm:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interest</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{match.interest}</p>
                          </div>
                        </div>

                        <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{match.farmType} - {match.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 ${darkMode ? 'border-gray-600 bg-gray-800/50 text-white' : ''}`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                          Details
                        </Button>
                        {match.status === 'matched' && (
                          <Button
                            size="sm"
                            className="flex-1 sm:flex-initial bg-[#7ede56] hover:bg-[#6bc947] text-white font-bold"
                          >
                            Connect
                          </Button>
                        )}
                        {match.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`flex-1 sm:flex-initial ${darkMode ? 'border-yellow-600 text-yellow-400' : 'border-yellow-300 text-yellow-700'}`}
                          >
                            Respond
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredMatches.length === 0 && mockInvestments.filter((inv: any) => inv.approvalStatus === 'pending').length === 0 && (
                <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                  <CardContent className="p-12 text-center">
                    <Users className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No matches found</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search or filter criteria'
                        : 'Complete your farm profile to get better investor matches'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Pending Approval Investments */}
              {mockInvestments.filter((inv: any) => inv.approvalStatus === 'pending').length > 0 && (
                <>
                  <div className="mt-8 mb-4">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Pending Approval Investments
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      These investments are awaiting extension agent approval
                    </p>
                  </div>
                  {mockInvestments.filter((inv: any) => inv.approvalStatus === 'pending').map((investment: any) => (
                    <Card key={investment.id} className={`hover:shadow-md transition-shadow ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {investment.investorName}
                              </h3>
                              <Badge className="bg-yellow-500 text-white">
                                Pending Approval
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {investment.investmentType === 'equipment' ? 'Investment Value' : investment.investmentType === 'mixed' ? 'Total Investment' : 'Investment Amount'}
                                </p>
                                <p className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                  {investment.investmentType === 'equipment'
                                    ? `Equipment (GHS ${investment.investmentAmount.toLocaleString()})`
                                    : `GHS ${investment.investmentAmount.toLocaleString()}`
                                  }
                                </p>
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Project</p>
                                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{investment.projectName}</p>
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Extension Agent</p>
                                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{investment.extensionAgent}</p>
                              </div>
                            </div>

                            {/* Approval Status Box */}
                            <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                              <div className="flex items-start gap-3">
                                <Clock className={`h-5 w-5 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                <div className="flex-1">
                                  <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Waiting for Extension Agent Approval
                                  </p>
                                  <div className="space-y-1.5 text-xs">
                                    <div className="flex items-center gap-2">
                                      {investment.documents?.farmerSignature ? (
                                        <CheckCircle className={`h-3 w-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                      ) : (
                                        <X className={`h-3 w-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                      )}
                                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        Farmer Signature {investment.documents?.farmerSignature ? '(Signed)' : '(Pending)'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {investment.documents?.investorSignature ? (
                                        <CheckCircle className={`h-3 w-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                      ) : (
                                        <X className={`h-3 w-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                      )}
                                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        Investor Signature {investment.documents?.investorSignature ? '(Signed)' : '(Pending)'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {investment.documents?.extensionAgentApproval ? (
                                        <CheckCircle className={`h-3 w-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                      ) : (
                                        <X className={`h-3 w-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                      )}
                                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        Extension Agent Approval {investment.documents?.extensionAgentApproval ? '(Approved)' : '(Pending)'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </>
        )}

        {/* My Investments Tab */}
        {activeTab === 'investments' && (
          <>
            {/* Investment Stats - 2 Columns on Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6">
              {/* Total Received - Green */}
              <Card className="bg-[#7ede56] rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute -top-2 -right-2 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
                  <Leaf className="absolute -bottom-2 -left-2 h-10 w-10 sm:h-12 sm:w-12 text-white -rotate-12" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-1">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-sm font-medium text-white/90 uppercase">Total Received</p>
                    <p className="text-lg sm:text-2xl font-bold text-white truncate">
                      ₵{mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').reduce((sum, inv) => {
                        const financialAmount = (inv as any).receivedAmount || 0;
                        const equipmentValue = (inv as any).receivedEquipment?.reduce((eqSum: number, eq: any) => eqSum + (eq.value || 0), 0) || 0;
                        return sum + financialAmount + equipmentValue;
                      }, 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-5 w-5 sm:h-8 sm:w-8 text-white shrink-0 self-end sm:self-auto" />
                </div>
              </Card>

              {/* Expected Returns - Orange */}
              <Card className="bg-[#ffa500] rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute -top-2 -right-2 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
                  <Leaf className="absolute -bottom-2 -left-2 h-10 w-10 sm:h-12 sm:w-12 text-white -rotate-12" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-1">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-sm font-medium text-white/90 uppercase">Expected</p>
                    <p className="text-lg sm:text-2xl font-bold text-white truncate">
                      ₵{mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').reduce((sum, inv) => sum + inv.expectedReturns, 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-white shrink-0 self-end sm:self-auto" />
                </div>
              </Card>

              {/* Active Investments - Coral */}
              <Card className="col-span-2 md:col-span-1 bg-[#ff6347] rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute -top-2 -right-2 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[10px] sm:text-sm font-medium text-white/90 uppercase">Active</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').length} Projects
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </Card>
            </div>

            {/* Add Update Dialog */}
            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
              <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
                <DialogHeader>
                  <DialogTitle className={darkMode ? 'text-white' : ''}>Add Investment Update</DialogTitle>
                  <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
                    Share progress and photos with your investor
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="update-title" className={darkMode ? 'text-white' : ''}>
                      Update Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="update-title"
                      placeholder="e.g., Planting Complete"
                      value={updateForm.title}
                      onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                      className={`mt-1 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="update-description" className={darkMode ? 'text-white' : ''}>
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="update-description"
                      placeholder="Describe what has been accomplished..."
                      value={updateForm.description}
                      onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                      rows={4}
                      className={`mt-1 ${darkMode ? 'bg-[#002f37] border-gray-600 text-white placeholder:text-gray-500' : ''}`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="update-progress" className={darkMode ? 'text-white' : ''}>
                      Project Progress (Auto-updates based on number of updates)
                    </Label>
                    <div className="mt-2">
                      <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Current Progress: <span className="font-bold text-[#7ede56]">{updateForm.progress}%</span>
                        </p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Progress increases automatically with each update you post
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className={darkMode ? 'text-white' : ''}>Upload Photos</Label>
                    <div className={`mt-2 border-2 border-dashed rounded-lg p-6 ${darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'}`}>
                      <div className="text-center">
                        <Upload className={`h-12 w-12 mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <label
                          htmlFor="photo-upload"
                          className={`cursor-pointer ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}
                        >
                          Click to upload photos
                        </label>
                        <input
                          id="photo-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          PNG, JPG up to 10MB each
                        </p>
                      </div>

                      {updateForm.photoPreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {updateForm.photoPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowUpdateDialog(false)}
                    className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitUpdate}
                    disabled={!updateForm.title || !updateForm.description}
                    className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                  >
                    Post Update
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Complaint Dialog */}
            <Dialog open={showComplaintDialog} onOpenChange={setShowComplaintDialog}>
              <DialogContent className={`w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-xl ${darkMode ? 'bg-[#01343c] border border-[#0b4f58]' : 'bg-white'}`}>
                <DialogHeader className="pb-3">
                  <DialogTitle className={darkMode ? 'text-white' : ''}>Submit Complaint to Extension Agent</DialogTitle>
                  <DialogDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Report issues or concerns about your investment
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="complaint-subject" className={darkMode ? 'text-gray-100' : ''}>
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="complaint-subject"
                        placeholder="e.g., Payment delay, Project concerns"
                        value={complaintForm.subject}
                        onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                        className={`mt-1 rounded-lg ${darkMode ? 'bg-[#072d33] border-[#0f4a53] text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#7ede56]' : ''}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="complaint-message" className={darkMode ? 'text-gray-100' : ''}>
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="complaint-message"
                        placeholder="Describe your complaint or concern in detail..."
                        value={complaintForm.message}
                        onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                        rows={6}
                        className={`mt-1 rounded-lg ${darkMode ? 'bg-[#072d33] border-[#0f4a53] text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#7ede56]' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Label className={darkMode ? 'text-gray-100' : ''}>Upload Photos (Optional)</Label>
                      <div className={`mt-2 border-2 border-dashed rounded-xl p-4 transition-colors ${darkMode ? 'border-[#155864] bg-[#072d33]' : 'border-gray-300 bg-gray-50'}`}>
                        <div className="text-center">
                          <Upload className={`h-10 w-10 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                          <label
                            htmlFor="complaint-photo-upload"
                            className={`cursor-pointer text-sm font-medium ${darkMode ? 'text-[#7ede56] hover:text-[#6bc947]' : 'text-blue-600 hover:text-blue-700'}`}
                          >
                            Click to upload photos
                          </label>
                          <input
                            id="complaint-photo-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleComplaintPhotoUpload}
                            className="hidden"
                          />
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            PNG, JPG up to 10MB each
                          </p>
                        </div>

                        {complaintForm.photoPreviews.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {complaintForm.photoPreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Complaint photo ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removeComplaintPhoto(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`rounded-xl p-3 ${darkMode ? 'bg-[#0b3a42] border border-[#155864]' : 'bg-blue-50 border border-blue-200'}`}>
                      <div className="flex items-start gap-2">
                        <AlertCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${darkMode ? 'text-[#7ede56]' : 'text-blue-600'}`} />
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-100' : 'text-blue-900'}`}>
                            Extension Agent
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                            Your complaint will be forwarded to the assigned extension agent. Response within 48 hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className={`mt-4 pt-4 ${darkMode ? 'border-t border-[#0f4a53]' : 'border-t border-gray-200'}`}>
                  <Button
                    variant="outline"
                    onClick={() => setShowComplaintDialog(false)}
                    className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-[#072d33]' : ''}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitComplaint}
                    disabled={!complaintForm.subject || !complaintForm.message}
                    className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                  >
                    Submit Complaint
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Investment Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
              <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
                <DialogHeader>
                  <DialogTitle className={darkMode ? 'text-white' : ''}>
                    Investment Details - {selectedInvestmentForDetails?.investorName}
                  </DialogTitle>
                  <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
                    Complete information about your investment
                  </DialogDescription>
                </DialogHeader>

                {selectedInvestmentForDetails && (
                  <div className="space-y-6 mt-4">
                    {/* Investment Overview */}
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Investment Overview
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Project Name</p>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedInvestmentForDetails.projectName}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investment Type</p>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {(selectedInvestmentForDetails as any).investmentType === 'financial' ? 'Financial' :
                              (selectedInvestmentForDetails as any).investmentType === 'equipment' ? 'Equipment' : 'Mixed'}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Investment</p>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            GHS {selectedInvestmentForDetails.investmentAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expected Returns</p>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            GHS {selectedInvestmentForDetails.expectedReturns.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profit Share</p>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedInvestmentForDetails.profitShare}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start Date</p>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(selectedInvestmentForDetails.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Progress</p>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedInvestmentForDetails.progress || calculateProgress(selectedInvestmentForDetails.updates || [])}%
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                          <Badge className={selectedInvestmentForDetails.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                            {selectedInvestmentForDetails.status.charAt(0).toUpperCase() + selectedInvestmentForDetails.status.slice(1)}
                          </Badge>
                        </div>
                        {(selectedInvestmentForDetails as any).approvalStatus && (
                          <div>
                            <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Approval Status</p>
                            <Badge className={
                              (selectedInvestmentForDetails as any).approvalStatus === 'approved'
                                ? 'bg-green-500 text-white'
                                : (selectedInvestmentForDetails as any).approvalStatus === 'pending'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-red-500 text-white'
                            }>
                              {(selectedInvestmentForDetails as any).approvalStatus === 'approved' ? 'Approved' :
                                (selectedInvestmentForDetails as any).approvalStatus === 'pending' ? 'Pending' : 'Rejected'}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Received Amount/Equipment */}
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Received Investment
                      </h3>
                      {(selectedInvestmentForDetails as any).investmentType === 'financial' && (
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Financial Amount: <span className="font-semibold text-green-600">GHS {((selectedInvestmentForDetails as any).receivedAmount || 0).toLocaleString()}</span>
                          </p>
                        </div>
                      )}
                      {(selectedInvestmentForDetails as any).investmentType === 'equipment' && (selectedInvestmentForDetails as any).receivedEquipment && (
                        <div className="space-y-2">
                          <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Equipment Received: {(selectedInvestmentForDetails as any).receivedEquipment.length} items
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(selectedInvestmentForDetails as any).receivedEquipment.map((equipment: any, idx: number) => (
                              <div key={idx} className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
                                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {equipment.name}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Quantity: {equipment.quantity} {equipment.unit || 'unit(s)'}
                                </p>
                                <p className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                  Value: GHS {equipment.value?.toLocaleString() || 'N/A'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {(selectedInvestmentForDetails as any).investmentType === 'mixed' && (
                        <div className="space-y-3">
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Financial Amount: <span className="font-semibold text-green-600">GHS {((selectedInvestmentForDetails as any).receivedAmount || 0).toLocaleString()}</span>
                            </p>
                          </div>
                          {(selectedInvestmentForDetails as any).receivedEquipment && (selectedInvestmentForDetails as any).receivedEquipment.length > 0 && (
                            <div>
                              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Equipment Received: {(selectedInvestmentForDetails as any).receivedEquipment.length} items
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(selectedInvestmentForDetails as any).receivedEquipment.map((equipment: any, idx: number) => (
                                  <div key={idx} className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
                                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {equipment.name}
                                    </p>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Quantity: {equipment.quantity} {equipment.unit || 'unit(s)'}
                                    </p>
                                    <p className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                      Value: GHS {equipment.value?.toLocaleString() || 'N/A'}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Payment History */}
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Payment & Transaction History
                      </h3>
                      <div className="space-y-3">
                        {selectedInvestmentForDetails.payments.map((payment: any, idx: number) => (
                          <div key={idx} className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-white'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {payment.type}
                                </span>
                              </div>
                              {payment.amount > 0 && (
                                <span className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                  GHS {payment.amount.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Date: {new Date(payment.date).toLocaleDateString()} • Status: <span className="capitalize">{payment.status}</span>
                            </p>
                            {payment.equipment && payment.equipment.length > 0 && (
                              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Equipment: {payment.equipment.join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                        {selectedInvestmentForDetails.nextPayment && (selectedInvestmentForDetails as any).investmentType !== 'equipment' && (
                          <div className={`p-3 rounded border-2 ${darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
                            <div className="flex items-center gap-2">
                              <Clock className={`h-4 w-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                              <div>
                                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Next Payment Expected
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {new Date(selectedInvestmentForDetails.nextPayment).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Extension Agent Information */}
                    {(selectedInvestmentForDetails as any).extensionAgent && (
                      <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Extension Agent Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <UserCheck className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {(selectedInvestmentForDetails as any).extensionAgent}
                            </span>
                          </div>
                          {(selectedInvestmentForDetails as any).extensionAgentContact && (
                            <div className="flex items-center gap-2">
                              <Phone className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                              <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {(selectedInvestmentForDetails as any).extensionAgentContact}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Document Status */}
                    {(selectedInvestmentForDetails as any).documents && (
                      <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Document Status
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {(selectedInvestmentForDetails as any).documents.farmerSignature ? (
                              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                            ) : (
                              <X className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            )}
                            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Farmer Signature {(selectedInvestmentForDetails as any).documents.farmerSignature ? '(Signed)' : '(Pending)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {(selectedInvestmentForDetails as any).documents.investorSignature ? (
                              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                            ) : (
                              <X className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            )}
                            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Investor Signature {(selectedInvestmentForDetails as any).documents.investorSignature ? '(Signed)' : '(Pending)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {(selectedInvestmentForDetails as any).documents.extensionAgentApproval ? (
                              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                            ) : (
                              <X className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            )}
                            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Extension Agent Approval {(selectedInvestmentForDetails as any).documents.extensionAgentApproval ? '(Approved)' : '(Pending)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {(selectedInvestmentForDetails as any).documents.investmentAgreement?.signed ? (
                              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                            ) : (
                              <X className={`h-4 w-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            )}
                            <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Investment Agreement {(selectedInvestmentForDetails as any).documents.investmentAgreement?.signed ? '(Signed)' : '(Pending)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailsDialog(false)}
                    className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Contact Investor Dialog */}
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
              <DialogContent className={`w-full max-w-3xl max-h-[75vh] overflow-y-auto rounded-2xl shadow-xl ${darkMode ? 'bg-[#01343c] border border-[#0b4f58]' : 'bg-white'}`}>
                <DialogHeader>
                  <DialogTitle className={darkMode ? 'text-white' : ''}>
                    Contact Investor - {selectedInvestmentForDetails?.investorName}
                  </DialogTitle>
                  <DialogDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Get in touch with your investor
                  </DialogDescription>
                </DialogHeader>

                {selectedInvestmentForDetails && (
                  <div className="space-y-5 mt-4">
                    <div className="grid gap-5 md:grid-cols-2">
                      {/* Contact Information */}
                      <div className={`rounded-xl p-4 ${darkMode ? 'bg-[#072d33] border border-[#0f4a53]' : 'bg-gray-50 border border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-[#0b3a42]' : 'bg-white'}`}>
                              <Phone className={`h-5 w-5 ${darkMode ? 'text-[#7ede56]' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                              <a
                                href={`tel:${selectedInvestmentForDetails.contact}`}
                                className={`text-sm font-semibold ${darkMode ? 'text-[#7ede56] hover:text-[#6bc947]' : 'text-blue-600 hover:text-blue-700'}`}
                              >
                                {selectedInvestmentForDetails.contact}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-[#0b3a42]' : 'bg-white'}`}>
                              <Mail className={`h-5 w-5 ${darkMode ? 'text-[#7ede56]' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                              <a
                                href={`mailto:${selectedInvestmentForDetails.email}`}
                                className={`text-sm font-semibold ${darkMode ? 'text-[#7ede56] hover:text-[#6bc947]' : 'text-blue-600 hover:text-blue-700'}`}
                              >
                                {selectedInvestmentForDetails.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className={`rounded-xl p-4 ${darkMode ? 'bg-[#072d33] border border-[#0f4a53]' : 'bg-gray-50 border border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              window.open(`tel:${selectedInvestmentForDetails.contact}`, '_self');
                            }}
                            className={`${darkMode ? 'border-[#0f4a53] bg-[#0b3a42] text-white hover:bg-[#0d505a]' : ''}`}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              window.open(`mailto:${selectedInvestmentForDetails.email}`, '_self');
                            }}
                            className={`${darkMode ? 'border-[#0f4a53] bg-[#0b3a42] text-white hover:bg-[#0d505a]' : ''}`}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const phoneNumber = selectedInvestmentForDetails.contact.replace(/[^0-9]/g, '');
                              window.open(`https://wa.me/${phoneNumber}`, '_blank');
                            }}
                            className={`${darkMode ? 'border-[#0f4a53] bg-[#0b3a42] text-white hover:bg-[#0d505a]' : ''}`}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedInvestmentForDetails.contact);
                            }}
                            className={`${darkMode ? 'border-[#0f4a53] bg-[#0b3a42] text-white hover:bg-[#0d505a]' : ''}`}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Number
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Investment Summary */}
                    <div className={`rounded-xl p-4 ${darkMode ? 'bg-[#072d33] border border-[#0f4a53]' : 'bg-gray-50 border border-gray-200'}`}>
                      <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Investment Summary
                      </h3>
                      <div className="grid gap-3 md:grid-cols-3 text-xs">
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Project: <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedInvestmentForDetails.projectName}</span>
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Investment: <span className={`font-semibold ${darkMode ? 'text-green-300' : 'text-gray-900'}`}>GHS {selectedInvestmentForDetails.investmentAmount.toLocaleString()}</span>
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Profit Share: <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedInvestmentForDetails.profitShare}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className={`mt-6 pt-4 ${darkMode ? 'border-t border-[#0f4a53]' : 'border-t border-gray-200'}`}>
                  <Button
                    variant="outline"
                    onClick={() => setShowContactDialog(false)}
                    className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-[#072d33]' : ''}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Empty State for My Investments */}
            {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').length === 0 && (
              <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <CardContent className="p-12 text-center">
                  <TrendingUp className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Approved Investments</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Your approved investments will appear here. Pending investments are shown in the "Find Investors" tab.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Investments List - Only Approved Investments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').map((investment) => {
                const totalReceived = (investment as any).receivedAmount || 0;
                const equipmentValue = (investment as any).receivedEquipment?.reduce((sum: number, eq: any) => sum + (eq.value || 0), 0) || 0;
                const totalInvestmentValue = totalReceived + equipmentValue;
                const performanceRatio = (investment.progress / 100) * 1.1; // Mock performance calculation

                return (
                  <Card key={investment.id} className={`overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-[#002f37] border-gray-700' : 'bg-white border-gray-100'}`}>
                    {/* Status Stripe */}
                    <div className={`h-1.5 w-full ${investment.status === 'active' ? 'bg-[#7ede56]' : 'bg-blue-500'}`} />

                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#01414a]'}`}>
                            {investment.projectName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1.5 mt-1">
                            <Users className="h-3.5 w-3.5" />
                            {investment.investorName}
                          </CardDescription>
                        </div>
                        <Badge className={`${investment.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'} border-none rounded-full px-3`}>
                          {investment.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-6">
                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Investment Value</p>
                          <p className={`text-lg font-black mt-1 ${darkMode ? 'text-white' : 'text-[#01414a]'}`}>GHS {investment.investmentAmount.toLocaleString()}</p>
                          <p className="text-[10px] text-[#7ede56] font-medium flex items-center gap-1 mt-1">
                            <CheckCircle className="h-2.5 w-2.5" />
                            Fully Committed
                          </p>
                        </div>
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Expected Returns</p>
                          <p className={`text-lg font-black mt-1 ${darkMode ? 'text-[#7ede56]' : 'text-green-600'}`}>GHS {investment.expectedReturns.toLocaleString()}</p>
                          <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1 mt-1`}>
                            <TrendingUp className="h-2.5 w-2.5" />
                            +{Math.round(((investment.expectedReturns - investment.investmentAmount) / investment.investmentAmount) * 100)}% ROI
                          </p>
                        </div>
                      </div>

                      {/* Progress & Performance Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Execution Progress</span>
                          <span className={`text-xs font-black ${darkMode ? 'text-[#7ede56]' : 'text-[#01414a]'}`}>{investment.progress}%</span>
                        </div>
                        <div className={`h-2.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <div
                            className="h-full bg-gradient-to-r from-[#7ede56] to-[#01414a] transition-all duration-1000 shadow-[0_0_10px_rgba(126,222,86,0.2)]"
                            style={{ width: `${investment.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-4 text-[10px]">
                          <div className="flex items-center gap-1">
                            <Activity className={`h-3 w-3 ${performanceRatio > 1 ? 'text-green-500' : 'text-orange-500'}`} />
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Performance Index:</span>
                            <span className={`font-bold ${performanceRatio > 1 ? 'text-green-500' : 'text-orange-500'}`}>{(performanceRatio).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-blue-500" />
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Next Checkpoint:</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{new Date(investment.nextPayment).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats list */}
                      <div className="space-y-2 pt-2 border-t border-dashed dark:border-gray-800">
                        <div className="flex justify-between text-xs">
                          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Profit Share Agreement</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>{investment.profitShare}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Current Valuation</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>GHS {(investment.investmentAmount * (1 + (investment.progress / 200))).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className={`p-4 mt-auto gap-2 ${darkMode ? 'bg-gray-800/20' : 'bg-gray-50/50'}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 rounded-lg border-gray-300 dark:border-gray-700 font-bold text-xs"
                        onClick={() => {
                          setSelectedInvestmentForDetails(investment);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        DETAILS
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 rounded-lg border-gray-300 dark:border-gray-700 font-bold text-xs"
                        onClick={() => {
                          setSelectedInvestmentForDetails(investment);
                          setShowContactDialog(true);
                        }}
                      >
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        CONTACT
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-9 rounded-lg bg-[#01414a] hover:bg-[#002f37] text-white font-bold text-xs"
                        onClick={() => handleAddUpdate(investment.id)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        UPDATE
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Investment Stages Tab */}
        {activeTab === 'stages' && (
          <>
            {/* Stage Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <Select value={investmentStageFilter} onValueChange={(value: any) => setInvestmentStageFilter(value)}>
                  <SelectTrigger className={darkMode ? 'bg-[#002f37] border-gray-600 text-white' : ''}>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                    <SelectItem value="all" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>All Stages</SelectItem>
                    <SelectItem value="pending" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Pending Approval</SelectItem>
                    <SelectItem value="approved" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Approved</SelectItem>
                    <SelectItem value="active" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Active</SelectItem>
                    <SelectItem value="completed" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stages Overview - 2 columns on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
              {/* Pending Approval - Yellow/Orange */}
              <Card className="bg-[#ffa500] rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute -top-2 -right-2 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-white/90 uppercase">Pending</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {mockInvestments.filter((inv: any) => inv.approvalStatus === 'pending').length}
                    </p>
                  </div>
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </Card>

              {/* Approved - Green */}
              <Card className="bg-[#7ede56] rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute -top-2 -right-2 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-white/90 uppercase">Approved</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').length}
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </Card>

              {/* Active - Blue */}
              <Card className="bg-[#3b82f6] rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute -top-2 -right-2 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-white/90 uppercase">Active</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {mockInvestments.filter((inv: any) => inv.status === 'active').length}
                    </p>
                  </div>
                  <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </Card>

              {/* Completed - Indigo */}
              <Card className="bg-[#6366f1] rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute -top-2 -right-2 h-12 w-12 sm:h-16 sm:w-16 text-white rotate-12" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-white/90 uppercase">Done</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {mockInvestments.filter((inv: any) => inv.status === 'completed').length}
                    </p>
                  </div>
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </Card>
            </div>

            {/* Investment Stages Timeline */}
            <div className="space-y-6">
              {(investmentStageFilter === 'all'
                ? mockInvestments
                : investmentStageFilter === 'pending'
                  ? mockInvestments.filter((inv: any) => inv.approvalStatus === 'pending')
                  : investmentStageFilter === 'approved'
                    ? mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved')
                    : investmentStageFilter === 'active'
                      ? mockInvestments.filter((inv: any) => inv.status === 'active')
                      : mockInvestments.filter((inv: any) => inv.status === 'completed')
              ).map((investment: any) => {
                const stages = [
                  { name: 'Idea', description: 'Pitching & concept', icon: Leaf, color: 'blue' },
                  { name: 'Due Diligence', description: 'Verification & vetting', icon: FileCheck, color: 'yellow' },
                  { name: 'Funding', description: 'Investment secured', icon: DollarSign, color: 'green' },
                  { name: 'Growth', description: 'Execution & scaling', icon: TrendingUp, color: 'blue' },
                  { name: 'Exit', description: 'Returns & completion', icon: CheckCircle, color: 'magenta' }
                ];

                // Determine current stage based on investment status
                let currentStageIndex = 0;
                if (investment.status === 'completed') {
                  currentStageIndex = 4;
                } else if (investment.status === 'active' && investment.approvalStatus === 'approved') {
                  currentStageIndex = 3;
                } else if (investment.approvalStatus === 'approved') {
                  currentStageIndex = 2;
                } else if (investment.approvalStatus === 'pending') {
                  currentStageIndex = 1;
                }

                return (
                  <Card key={investment.id} className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-[#002f37] border-gray-700' : 'bg-white border-gray-100'}`}>
                    <CardHeader className={`pb-4 ${darkMode ? 'bg-gray-800/20' : 'bg-gray-50/50'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <CardTitle className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {investment.projectName}
                          </CardTitle>
                          <CardDescription className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Investor: <span className="font-medium">{investment.investorName}</span> • Started: {new Date(investment.startDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-[10px] uppercase tracking-wider font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Investment</p>
                            <p className={`text-sm sm:text-lg font-bold ${darkMode ? 'text-[#7ede56]' : 'text-[#01414a]'}`}>₵{investment.investmentAmount.toLocaleString()}</p>
                          </div>
                          <Badge className={`px-3 py-1 text-xs font-semibold rounded-full ${investment.approvalStatus === 'approved'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : investment.approvalStatus === 'pending'
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {investment.approvalStatus === 'approved' ? 'Approved' : investment.approvalStatus === 'pending' ? 'Pending' : 'Rejected'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Lifecycle Timeline */}
                      <div className="relative mt-4 mb-10">
                        {/* Connection Line Background */}
                        <div className={`absolute top-6 left-0 w-full h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />

                        {/* Active Connection Line */}
                        <div
                          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#7ede56] to-[#01414a] transition-all duration-700 ease-in-out"
                          style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                        />

                        <div className="relative flex justify-between">
                          {stages.map((stage, index) => {
                            const Icon = stage.icon;
                            const isCompleted = index < currentStageIndex;
                            const isCurrent = index === currentStageIndex;
                            const isPending = index > currentStageIndex;

                            return (
                              <div key={index} className="flex flex-col items-center group relative" style={{ width: '20%' }}>
                                {/* Icon Circle */}
                                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isCompleted
                                  ? 'bg-[#7ede56] text-white shadow-md'
                                  : isCurrent
                                    ? 'bg-[#01414a] text-white ring-2 sm:ring-4 ring-[#7ede56]/30 scale-110 shadow-lg'
                                    : 'bg-white border-2 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
                                  }`}>
                                  {isCompleted ? <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6" /> : <Icon className="h-4 w-4 sm:h-6 sm:w-6" />}
                                </div>

                                {/* Label */}
                                <div className="mt-2 sm:mt-4 text-center">
                                  <p className={`text-[10px] sm:text-sm font-bold transition-colors duration-300 ${isCurrent ? (darkMode ? 'text-[#7ede56]' : 'text-[#01414a]') : isCompleted ? (darkMode ? 'text-gray-300' : 'text-gray-700') : (darkMode ? 'text-gray-500' : 'text-gray-400')
                                    }`}>
                                    {stage.name}
                                  </p>
                                  <p className={`text-[10px] mt-0.5 max-w-[80px] mx-auto leading-tight hidden md:block ${isCurrent || isCompleted ? (darkMode ? 'text-gray-400' : 'text-gray-600') : (darkMode ? 'text-gray-600' : 'text-gray-400')
                                    }`}>
                                    {stage.description}
                                  </p>
                                </div>

                                {/* Current Indicator */}
                                {isCurrent && (
                                  <div className="absolute -top-8 bg-[#01414a] dark:bg-[#7ede56] text-white dark:text-[#01414a] text-[10px] font-bold px-2 py-0.5 rounded-sm animate-bounce">
                                    CURRENT
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stage Details Summary Card */}
                      <div className={`rounded-xl p-4 sm:p-5 border ${darkMode ? 'bg-[#003c47] border-[#0a4f59]' : 'bg-[#f4ffee] border-[#e0f2d8]'
                        }`}>
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                          <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-[#01414a]' : 'bg-white'}`}>
                            <Activity className={`h-5 w-5 sm:h-6 sm:w-6 ${darkMode ? 'text-[#7ede56]' : 'text-[#01414a]'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-[#01414a]'}`}>
                                Currently in {stages[currentStageIndex].name} Phase
                              </h4>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600'}`}>
                                {Math.round((currentStageIndex / (stages.length - 1)) * 100)}% Complete
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              {currentStageIndex === 0 && (
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-700'}>
                                  The investment idea is being finalized. Next step involves documentation and agent verification.
                                </p>
                              )}
                              {currentStageIndex === 1 && (
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-700'}>
                                  Due diligence in progress. Your extension agent is verifying farm details and legal documents.
                                </p>
                              )}
                              {currentStageIndex === 2 && (
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-700'}>
                                  Funding stage: Investor has committed funds. Initial disbursement is scheduled soon.
                                </p>
                              )}
                              {currentStageIndex === 3 && (
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-700'}>
                                  Growth stage: The project is fully operational. Focus on execution, regular updates, and monitoring.
                                </p>
                              )}
                              {currentStageIndex === 4 && (
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-700'}>
                                  Investment completed. Returns have been processed and distributed. Looking for the next opportunity!
                                </p>
                              )}
                            </div>

                            <div className="mt-4 flex gap-3">
                              <Button size="sm" variant="outline" className={`h-8 text-xs ${darkMode ? 'border-white/10 hover:bg-white/5' : 'bg-white'}`}>
                                Full History
                              </Button>
                              <Button size="sm" className="h-8 text-xs bg-[#7ede56] hover:bg-[#6bc947] text-white">
                                Next Milestone
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {mockInvestments.length === 0 && (
              <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <CardContent className="p-12 text-center">
                  <Activity className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No investments to track</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Connect with investors to start tracking investment stages
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout >
  );
};

export default InvestorMatches;
