import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarProfileCard from '@/components/SidebarProfileCard';
import { 
  ArrowLeft,
  ArrowRight,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  DollarSign,
  Calendar,
  MapPin,
  Moon,
  Sun,
  Settings,
  Bell,
  BarChart3,
  TrendingUp,
  Activity,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Percent,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  Menu,
  Copy
} from 'lucide-react';

const InvestorMatches = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'matches' | 'investments' | 'stages'>('matches');
  const [investmentStageFilter, setInvestmentStageFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'completed'>('all');
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('investor-matches');
  
  const profileMapping: Record<string, { name: string; role: string; location: string; email: string; avatarUrl?: string }> = {
    grower: {
      name: 'John Agribusiness',
      role: 'Lync Grower',
      location: 'Ejisu, Ashanti',
      email: 'john.agribusiness@email.com'
    },
    investor: {
      name: 'Maria Investment',
      role: 'Lync Investor',
      location: 'Airport City, Accra',
      email: 'maria@investment.africa'
    },
    farmer: {
      name: 'Kwame Mensah',
      role: 'Solo Farmer',
      location: 'Kumasi, Ashanti',
      email: 'kwame.mensah@agrilync.com'
    },
    agent: {
      name: 'Aisha Agent',
      role: 'Extension Agent',
      location: 'Tamale, Northern',
      email: 'aisha.agent@agrilync.com'
    }
  };

  const profileInfo = profileMapping[userType as keyof typeof profileMapping] || profileMapping['grower'];
  
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

  // Handle sidebar navigation
  const handleSidebarNavigation = (item: string) => {
    setActiveSidebarItem(item);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
    const routes: { [key: string]: string } = {
      'dashboard': `/dashboard/${userType}`,
      'settings': `/dashboard/${userType}/settings`,
      'farm-analytics': `/dashboard/${userType}/farm-analytics`,
      'investor-matches': `/dashboard/${userType}/investor-matches`,
      'training-sessions': `/dashboard/${userType}/training-sessions`,
      'farm-management': `/dashboard/${userType}/farm-management`,
      'notifications': `/dashboard/${userType}/notifications`
    };
    if (routes[item]) {
      navigate(routes[item]);
    }
  };

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

  const SidebarContent = () => (
    <>
      {/* Logo/App Name */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-200' : 'border-[#002f37] border-opacity-20'}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png" 
              alt="AgriLync Logo" 
              className="h-8 w-8"
            />
            {(!sidebarCollapsed || isMobile) && (
              <span className={`text-xl font-bold ${darkMode ? 'text-[#002f37]' : 'text-[#f4ffee]'}`}>AgriLync</span>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'} transition-colors`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" aria-label="Expand sidebar" />
              ) : (
                <ChevronLeft className="h-5 w-5" aria-label="Collapse sidebar" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className={`px-4 py-4 border-b ${darkMode ? 'border-gray-200/70' : 'border-[#f4ffee]/10'} ${sidebarCollapsed && !isMobile ? 'flex justify-center' : ''}`}>
        <div
          className={`w-full flex ${sidebarCollapsed && !isMobile ? 'flex-col items-center gap-2' : 'items-center gap-3'} ${
            darkMode ? 'bg-[#f4ffee] text-[#002f37]' : 'bg-[#01414a] text-white'
          } rounded-xl p-3 shadow-sm transition-colors`}
        >
          <SidebarProfileCard
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
            darkMode={darkMode}
            userType={userType}
          />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'dashboard' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('dashboard')}
        >
          <Activity className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Dashboard</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'settings' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('settings')}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Profile & Settings</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'farm-management' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('farm-management')}
        >
          <MapPin className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Farm Management</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'farm-analytics' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('farm-analytics')}
        >
          <BarChart3 className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Farm Analytics</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'investor-matches' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('investor-matches')}
        >
          <Users className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Investor Matches</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'training-sessions' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('training-sessions')}
        >
          <Calendar className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Training Sessions</span>}
        </div>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            activeSidebarItem === 'notifications' 
              ? 'bg-[#7ede56] text-[#002f37]' 
              : darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'
          }`}
          onClick={() => handleSidebarNavigation('notifications')}
        >
          <Bell className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Notifications</span>}
        </div>
      </nav>

      {/* Log Out - Sticky at bottom */}
      <div className={`mt-auto p-4 border-t ${darkMode ? 'border-gray-200' : 'border-[#002f37] border-opacity-20'} sticky bottom-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'}`}>
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${darkMode ? 'text-[#002f37] hover:bg-gray-100' : 'text-[#f4ffee] hover:bg-[#002f37] hover:bg-opacity-80'}`}
          onClick={() => navigate('/')}
        >
          <ArrowRight className="h-5 w-5 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Log Out</span>}
        </div>
      </div>
    </>
  );

  return (
    <div className={`h-screen overflow-hidden ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {isMobile && (
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent
              side="left"
              className={`w-[280px] p-0 ${darkMode ? 'bg-white' : 'bg-[#002f37]'} overflow-y-auto`}
            >
              <div className="flex flex-col h-full">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {!isMobile && (
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-white' : 'bg-[#002f37]'} flex-shrink-0 transition-all duration-300 border-r ${darkMode ? 'border-gray-200/60' : 'border-[#00404a]'}`}>
            <div className="flex flex-col h-full sticky top-0 overflow-hidden">
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto transition-colors ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'}`}>
          {/* Top Header */}
          <div className={`${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white border-gray-200'} border-b px-3 sm:px-6 py-3 sm:py-4 transition-colors sticky top-0 z-20`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileSidebarOpen(true)}
                    className={`p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className={`text-lg sm:text-2xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Investor Matches & Investments</h1>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Find investors and track your investments</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center gap-1 sm:gap-2 rounded-full p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={toggleDarkMode}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600" />
                  )}
                  <span className="hidden sm:inline ml-1">{darkMode ? 'Light' : 'Dark'}</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
            {/* Tabs */}
            <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'matches'
                    ? `border-b-2 ${darkMode ? 'border-[#7ede56] text-[#7ede56]' : 'border-[#7ede56] text-[#7ede56]'}`
                    : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Find Investors
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'investments'
                    ? `border-b-2 ${darkMode ? 'border-[#7ede56] text-[#7ede56]' : 'border-[#7ede56] text-[#7ede56]'}`
                    : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />
                My Investments
              </button>
              <button
                onClick={() => setActiveTab('stages')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'stages'
                    ? `border-b-2 ${darkMode ? 'border-[#7ede56] text-[#7ede56]' : 'border-[#7ede56] text-[#7ede56]'}`
                    : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                <Activity className="h-4 w-4 inline mr-2" />
                Investment Stages
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

            {/* Stats Cards - Matching Main Dashboard Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              {/* Total Matches - Green */}
              <Card className="bg-[#7ede56] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
                {/* Leaf Pattern Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                  <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                  <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                  <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-white">Total Matches</p>
                    <p className="text-2xl font-bold text-white">{mockMatches.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-white" />
                </div>
              </Card>
            {/* Active Matches - Orange */}
            <Card className="bg-[#ffa500] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
              {/* Leaf Pattern Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-white">Active Matches</p>
                  <p className="text-2xl font-bold text-white">
                    {mockMatches.filter(m => m.status === 'matched').length}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </Card>
            {/* Pending - Red/Coral */}
            <Card className="bg-[#ff6347] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
              {/* Leaf Pattern Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-white">Pending</p>
                  <p className="text-2xl font-bold text-white">
                    {mockMatches.filter(m => m.status === 'pending').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </Card>
            {/* Total Investment - Deep Magenta */}
            <Card className="bg-[#921573] rounded-lg p-4 sm:p-6 shadow-lg relative overflow-hidden">
              {/* Leaf Pattern Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-white">Total Investment</p>
                  <p className="text-2xl font-bold text-white">
                    GHS {mockMatches.reduce((sum, match) => sum + match.amount, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </Card>
            </div>

                {/* Matches List */}
                <div className="space-y-4">
                  {filteredMatches.map((match) => (
                <Card key={match.id} className={`hover:shadow-md transition-shadow ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.investorName}</h3>
                      <Badge className={getStatusColor(match.status)}>
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investment Amount</p>
                        <p className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>GHS {match.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Interest</p>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.interest}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Farm Type</p>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.farmType} - {match.category}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Region</p>
                        <p className={`text-sm flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          <MapPin className="h-3 w-3" />
                          {match.region}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Date: {new Date(match.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Contact: {match.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Email: {match.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`flex items-center gap-2 ${darkMode ? 'border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700 hover:text-white' : ''}`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      View Details
                    </Button>
                    {match.status === 'matched' && (
                      <Button 
                        size="sm"
                        className="bg-[#7ede56] hover:bg-[#6bc947] text-white"
                      >
                        Contact Now
                      </Button>
                    )}
                    {match.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={darkMode ? 'border-yellow-600 text-yellow-400 hover:bg-yellow-900/30' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'}
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
                {/* Investment Stats - Matching Find Investors Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Total Received - Green */}
                  <Card className="bg-[#7ede56] rounded-lg p-6 shadow-lg relative overflow-hidden">
                    {/* Leaf Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                      <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                      <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                      <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-medium text-white">Total Received</p>
                        <p className="text-2xl font-bold text-white">
                          GHS {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').reduce((sum, inv) => {
                            const financialAmount = (inv as any).receivedAmount || 0;
                            const equipmentValue = (inv as any).receivedEquipment?.reduce((eqSum: number, eq: any) => eqSum + (eq.value || 0), 0) || 0;
                            return sum + financialAmount + equipmentValue;
                          }, 0).toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                  </Card>
                  
                  {/* Expected Returns - Orange */}
                  <Card className="bg-[#ffa500] rounded-lg p-6 shadow-lg relative overflow-hidden">
                    {/* Leaf Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                      <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                      <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                      <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-medium text-white">Expected Returns</p>
                        <p className="text-2xl font-bold text-white">
                          GHS {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').reduce((sum, inv) => sum + inv.expectedReturns, 0).toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                  </Card>
                  
                  {/* Active Investments - Red/Coral */}
                  <Card className="bg-[#ff6347] rounded-lg p-6 shadow-lg relative overflow-hidden">
                    {/* Leaf Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                      <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                      <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                      <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-medium text-white">Active Investments</p>
                        <p className="text-2xl font-bold text-white">
                          {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-white" />
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
                <div className="space-y-4">
                  {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').map((investment) => (
                    <Card key={investment.id} className={`hover:shadow-md transition-shadow ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{investment.investorName}</h3>
                              <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                              <Badge variant="outline" className={`text-xs ${darkMode ? 'border-gray-700 text-gray-300' : ''}`}>
                                {investment.profitShare} Profit Share
                              </Badge>
                            </div>

                            {/* Progress Bar - Compact */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Project Progress
                                </span>
                                <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {investment.progress}%
                                </span>
                              </div>
                              <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                  className="h-full bg-gradient-to-r from-[#7ede56] to-[#6bc947] transition-all duration-300"
                                  style={{ width: `${investment.progress}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              <div>
                                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {(investment as any).investmentType === 'equipment' ? 'Investment Value' : (investment as any).investmentType === 'mixed' ? 'Total Investment' : 'Investment Amount'}
                                </p>
                                <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                  {(investment as any).investmentType === 'equipment' 
                                    ? `Equipment (GHS ${investment.investmentAmount.toLocaleString()})`
                                    : `GHS ${investment.investmentAmount.toLocaleString()}`
                                  }
                                </p>
                              </div>
                              <div>
                                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Received</p>
                                <p className={`text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {(investment as any).investmentType === 'financial' 
                                    ? `GHS ${(investment as any).receivedAmount?.toLocaleString() || 0}`
                                    : (investment as any).investmentType === 'equipment'
                                    ? `${(investment as any).receivedEquipment?.length || 0} Equipment`
                                    : `GHS ${(investment as any).receivedAmount?.toLocaleString() || 0} + ${(investment as any).receivedEquipment?.length || 0} Items`
                                  }
                                </p>
                              </div>
                              <div>
                                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expected Returns</p>
                                <p className={`text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  GHS {investment.expectedReturns.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start Date</p>
                                <p className={`text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {new Date(investment.startDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Investment Approval Status - Compact Collapsible */}
                            {(investment as any).approvalStatus && (investment as any).approvalStatus === 'approved' && (
                              <div className={`rounded-lg p-2 mb-3 ${darkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className={`h-4 w-4 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                  <span className={`text-xs font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                                    Approved • All Documents Signed
                                  </span>
                                  {(investment as any).extensionAgent && (
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      • Agent: {(investment as any).extensionAgent}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Payment/Investment History - Compact */}
                            <div className={`rounded-lg p-3 mb-3 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                              <h4 className={`text-xs font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {(investment as any).investmentType === 'equipment' ? 'Equipment Received' : (investment as any).investmentType === 'mixed' ? 'Investment & Equipment Received' : 'Payment History'}
                              </h4>
                              <div className="space-y-1.5">
                                {investment.payments.map((payment: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 flex-1">
                                      <CheckCircle className={`h-3 w-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        {payment.type} - {new Date(payment.date).toLocaleDateString()}
                                      </span>
                                      {payment.equipment && payment.equipment.length > 0 && (
                                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          ({payment.equipment.join(', ')})
                                        </span>
                                      )}
                                    </div>
                                    {payment.amount > 0 && (
                                      <span className={`font-semibold text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                        GHS {payment.amount.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {(investment as any).receivedEquipment && (investment as any).receivedEquipment.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      {(investment as any).receivedEquipment.map((equipment: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between">
                                          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                            {equipment.name} ({equipment.quantity} {equipment.unit || 'unit(s)'})
                                          </span>
                                          <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            GHS {equipment.value?.toLocaleString() || 'N/A'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {investment.nextPayment && (investment as any).investmentType !== 'equipment' && (
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Clock className={`h-3 w-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      Next Payment: {new Date(investment.nextPayment).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Investment Updates Timeline - Collapsible */}
                            <div className={`rounded-lg p-3 mb-3 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <button
                                  onClick={() => toggleInvestmentUpdates(investment.id)}
                                  className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                  <h4 className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Investment Updates ({investment.updates?.length || 0})
                                  </h4>
                                  {expandedInvestments[investment.id] ? (
                                    <ChevronUp className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                  ) : (
                                    <ChevronDown className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                  )}
                                </button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddUpdate(investment.id)}
                                  className="bg-[#7ede56] hover:bg-[#6bc947] text-white text-xs h-7"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Update
                                </Button>
                              </div>

                              {expandedInvestments[investment.id] && (
                                <>
                                  {investment.updates && investment.updates.length > 0 ? (
                                    <div className="space-y-2">
                                      {investment.updates.map((update: any) => (
                                        <div key={update.id} className={`border-l-2 pl-2 py-1 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                                          <div className="flex items-start justify-between mb-0.5">
                                            <h5 className={`font-semibold text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                              {update.title}
                                            </h5>
                                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                              {new Date(update.date).toLocaleDateString()}
                                            </span>
                                          </div>
                                          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {update.description}
                                          </p>
                                          {update.progress !== undefined && (
                                            <div className="flex items-center gap-1.5 mb-1">
                                              <Percent className={`h-3 w-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                              <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                Progress: {update.progress}%
                                              </span>
                                            </div>
                                          )}
                                          {update.photos && update.photos.length > 0 && (
                                            <div className="grid grid-cols-3 gap-1.5 mt-1">
                                              {update.photos.map((photo: string, idx: number) => (
                                                <img
                                                  key={idx}
                                                  src={photo}
                                                  alt={`Update ${idx + 1}`}
                                                  className="w-full h-16 object-cover rounded"
                                                />
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className={`text-xs text-center py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      No updates yet. Add your first update to share progress with your investor.
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons - Better Positioned */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedInvestmentForDetails(investment);
                                setShowDetailsDialog(true);
                              }}
                              className={`flex items-center justify-center gap-1.5 text-xs h-8 min-w-[110px] ${darkMode ? 'border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700 hover:text-white' : 'border-gray-300'}`}
                            >
                              <Eye className="h-3 w-3" />
                              View Details
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setComplaintForm({ ...complaintForm, investmentId: investment.id });
                                setShowComplaintDialog(true);
                              }}
                              className={`flex items-center justify-center gap-1.5 text-xs h-8 min-w-[110px] ${darkMode ? 'border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700 hover:text-white' : 'border-gray-300'}`}
                            >
                              <MessageCircle className="h-3 w-3" />
                              Complaint
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedInvestmentForDetails(investment);
                                setShowContactDialog(true);
                              }}
                              className={`flex items-center justify-center gap-1.5 text-xs h-8 min-w-[110px] ${darkMode ? 'border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700 hover:text-white' : 'border-gray-300'}`}
                            >
                              <Phone className="h-3 w-3" />
                              Contact
                            </Button>
                          </div>
                        </div>

                        {/* Contact Information - Compact - Moved to bottom */}
                        <div className={`flex items-center gap-3 text-xs pt-3 mt-3 border-t ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{investment.contact}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{investment.email}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {mockInvestments.length === 0 && (
                    <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                      <CardContent className="p-12 text-center">
                        <TrendingUp className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No active investments</h3>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Connect with investors to start receiving investments and track them here
                        </p>
                      </CardContent>
                    </Card>
                  )}
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

                {/* Stages Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {/* Pending Approval - Yellow/Orange */}
                  <Card className="bg-[#ffa500] rounded-lg p-6 shadow-lg relative overflow-hidden">
                    {/* Leaf Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                      <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                      <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                      <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-medium text-white">Pending Approval</p>
                        <p className="text-2xl font-bold text-white">
                          {mockInvestments.filter((inv: any) => inv.approvalStatus === 'pending').length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                  </Card>
                  
                  {/* Approved - Green */}
                  <Card className="bg-[#7ede56] rounded-lg p-6 shadow-lg relative overflow-hidden">
                    {/* Leaf Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                      <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                      <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                      <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-medium text-white">Approved</p>
                        <p className="text-2xl font-bold text-white">
                          {mockInvestments.filter((inv: any) => inv.approvalStatus === 'approved').length}
                        </p>
                      </div>
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                  </Card>
                  
                  {/* Active - Red/Coral */}
                  <Card className="bg-[#ff6347] rounded-lg p-6 shadow-lg relative overflow-hidden">
                    {/* Leaf Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                      <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                      <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                      <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-medium text-white">Active</p>
                        <p className="text-2xl font-bold text-white">
                          {mockInvestments.filter((inv: any) => inv.status === 'active').length}
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-white" />
                    </div>
                  </Card>
                  
                  {/* Total Investments - Deep Magenta */}
                  <Card className="bg-[#921573] rounded-lg p-6 shadow-lg relative overflow-hidden">
                    {/* Leaf Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <Leaf className="absolute top-2 right-2 h-16 w-16 text-white rotate-12" />
                      <Leaf className="absolute bottom-4 left-4 h-12 w-12 text-white -rotate-12" />
                      <Leaf className="absolute top-1/2 right-8 h-10 w-10 text-white rotate-45" />
                      <Leaf className="absolute bottom-8 right-4 h-8 w-8 text-white -rotate-45" />
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-sm font-medium text-white">Total Investments</p>
                        <p className="text-2xl font-bold text-white">
                          {mockInvestments.length}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-white" />
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
                      { name: 'Pending Approval', status: investment.approvalStatus === 'pending', icon: Clock, color: 'yellow' },
                      { name: 'Documents Signed', status: investment.documents?.farmerSignature && investment.documents?.investorSignature, icon: CheckCircle, color: 'blue' },
                      { name: 'Agent Approved', status: investment.approvalStatus === 'approved', icon: ShieldCheck, color: 'green' },
                      { name: 'Active Investment', status: investment.status === 'active' && investment.approvalStatus === 'approved', icon: Activity, color: 'blue' },
                      { name: 'Completed', status: investment.status === 'completed', icon: CheckCircle, color: 'green' }
                    ];
                    
                    const currentStageIndex = stages.findIndex((stage, idx) => {
                      if (idx === 0) return stage.status;
                      if (idx === 1) return stage.status && stages[0].status;
                      if (idx === 2) return stage.status;
                      if (idx === 3) return stage.status;
                      return stage.status;
                    });

                    return (
                      <Card key={investment.id} className={`hover:shadow-md transition-shadow ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
                        <CardContent className="p-6">
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {investment.investorName} - {investment.projectName}
                              </h3>
                              <Badge className={
                                investment.approvalStatus === 'approved' 
                                  ? 'bg-green-500 text-white'
                                  : investment.approvalStatus === 'pending'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-gray-500 text-white'
                              }>
                                {investment.approvalStatus === 'approved' ? 'Approved' : investment.approvalStatus === 'pending' ? 'Pending' : 'Rejected'}
                              </Badge>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Investment: GHS {investment.investmentAmount.toLocaleString()} • Started: {new Date(investment.startDate).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Stage Timeline */}
                          <div className="relative">
                            <div className="flex items-center justify-between">
                              {stages.map((stage, index) => {
                                const Icon = stage.icon;
                                const isCompleted = index <= currentStageIndex && stage.status;
                                const isCurrent = index === currentStageIndex && stage.status;
                                const isPending = index > currentStageIndex || !stage.status;

                                return (
                                  <React.Fragment key={index}>
                                    <div className="flex flex-col items-center flex-1">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                        isCompleted 
                                          ? stage.color === 'yellow' ? 'bg-yellow-500' : stage.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                                          : isCurrent
                                          ? stage.color === 'yellow' ? 'bg-yellow-500 ring-4 ring-yellow-200' : stage.color === 'blue' ? 'bg-blue-500 ring-4 ring-blue-200' : 'bg-green-500 ring-4 ring-green-200'
                                          : 'bg-gray-300 dark:bg-gray-700'
                                      }`}>
                                        <Icon className={`h-6 w-6 ${
                                          isCompleted || isCurrent ? 'text-white' : 'text-gray-500'
                                        }`} />
                                      </div>
                                      <p className={`text-xs text-center font-medium ${
                                        isCompleted || isCurrent 
                                          ? darkMode ? 'text-white' : 'text-gray-900'
                                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                                      }`}>
                                        {stage.name}
                                      </p>
                                      {(isCompleted || isCurrent) && (
                                        <p className={`text-xs mt-1 ${
                                          stage.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                                          stage.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                          'text-green-600 dark:text-green-400'
                                        }`}>
                                          {isCurrent ? 'Current' : 'Done'}
                                        </p>
                                      )}
                                    </div>
                                    {index < stages.length - 1 && (
                                      <div className={`flex-1 h-0.5 mx-2 ${
                                        index < currentStageIndex && stage.status
                                          ? stage.color === 'yellow' ? 'bg-yellow-500' : stage.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                                          : 'bg-gray-300 dark:bg-gray-700'
                                      }`} />
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>

                          {/* Stage Details */}
                          <div className={`mt-6 p-4 rounded-lg ${
                            darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                          }`}>
                            <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Current Stage Details:
                            </p>
                            {currentStageIndex >= 0 && (
                              <div className="space-y-2 text-sm">
                                {currentStageIndex === 0 && (
                                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    Waiting for extension agent approval. All documents must be signed before approval.
                                  </p>
                                )}
                                {currentStageIndex === 1 && (
                                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    Documents are signed. Awaiting extension agent verification and approval.
                                  </p>
                                )}
                                {currentStageIndex === 2 && (
                                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    Investment approved! You can now track progress and provide updates.
                                  </p>
                                )}
                                {currentStageIndex === 3 && (
                                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    Investment is active. Progress: {investment.progress || 0}%. Continue providing updates.
                                  </p>
                                )}
                                {currentStageIndex === 4 && (
                                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    Investment completed successfully! All returns have been distributed.
                                  </p>
                                )}
                              </div>
                            )}
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
        </div>
      </div>
    </div>
  );
};

export default InvestorMatches;
