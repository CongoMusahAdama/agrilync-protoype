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
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'matches' | 'investments' | 'stages'>('matches');
  const [investmentStageFilter, setInvestmentStageFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'completed'>('all');
  const { darkMode, toggleDarkMode } = useDarkMode();
  const sidebarDarkMode = !darkMode;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [activeSidebarItem, setActiveSidebarItem] = useState('investor-matches');

  // Handle tab from URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'investments' || tabParam === 'matches' || tabParam === 'stages') {
      setActiveTab(tabParam as 'matches' | 'investments' | 'stages');
    }
  }, [location]);

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
      <div className={`p-4 border-b flex-shrink-0 ${sidebarDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
              alt="AgriLync Logo"
              className="h-8 w-8"
            />
            {(!sidebarCollapsed || isMobile) && (
              <span className={`text-xl font-bold ${sidebarDarkMode ? 'text-[#f4ffee]' : 'text-[#002f37]'}`}>AgriLync</span>
            )}
          </div>
          {/* Collapse button hidden for grower dashboard - sidebar is static */}
          {!isMobile && userType !== 'grower' && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg ${sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10' : 'text-[#002f37] hover:bg-gray-100'} transition-colors`}
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

      <div className={`px-4 py-4 border-b ${sidebarDarkMode ? 'border-gray-200/70' : 'border-gray-200'} ${sidebarCollapsed && !isMobile ? 'flex justify-center' : ''}`}>
        <div
          className={`w-full flex ${sidebarCollapsed && !isMobile ? 'flex-col items-center gap-2' : 'items-center gap-3'} ${sidebarDarkMode ? 'bg-[#f4ffee] text-[#002f37]' : 'bg-[#01414a] text-white'
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

      {/* Navigation - static layout with no shifting on click */}
      <nav className="flex-1 p-4 space-y-2">
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${activeSidebarItem === 'dashboard'
            ? 'bg-[#7ede56] text-[#002f37] border-l-4 border-[#002f37]'
            : sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10 border-l-4 border-transparent' : 'text-[#002f37] hover:bg-gray-100 border-l-4 border-transparent'
            }`}
          onClick={() => handleSidebarNavigation('dashboard')}
        >
          <Activity className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Dashboard</span>}
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${activeSidebarItem === 'farm-management'
            ? 'bg-[#7ede56] text-[#002f37] border-l-4 border-[#002f37]'
            : sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10 border-l-4 border-transparent' : 'text-[#002f37] hover:bg-gray-100 border-l-4 border-transparent'
            }`}
          onClick={() => handleSidebarNavigation('farm-management')}
        >
          <MapPin className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Farm Management</span>}
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${activeSidebarItem === 'farm-analytics'
            ? 'bg-[#7ede56] text-[#002f37] border-l-4 border-[#002f37]'
            : sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10 border-l-4 border-transparent' : 'text-[#002f37] hover:bg-gray-100 border-l-4 border-transparent'
            }`}
          onClick={() => handleSidebarNavigation('farm-analytics')}
        >
          <BarChart3 className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Farm Analytics</span>}
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${activeSidebarItem === 'investor-matches'
            ? 'bg-[#7ede56] text-[#002f37] border-l-4 border-[#002f37]'
            : sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10 border-l-4 border-transparent' : 'text-[#002f37] hover:bg-gray-100 border-l-4 border-transparent'
            }`}
          onClick={() => handleSidebarNavigation('investor-matches')}
        >
          <Users className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Investor Matches</span>}
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${activeSidebarItem === 'training-sessions'
            ? 'bg-[#7ede56] text-[#002f37] border-l-4 border-[#002f37]'
            : sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10 border-l-4 border-transparent' : 'text-[#002f37] hover:bg-gray-100 border-l-4 border-transparent'
            }`}
          onClick={() => handleSidebarNavigation('training-sessions')}
        >
          <Calendar className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Training Sessions</span>}
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${activeSidebarItem === 'notifications'
            ? 'bg-[#7ede56] text-[#002f37] border-l-4 border-[#002f37]'
            : sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10 border-l-4 border-transparent' : 'text-[#002f37] hover:bg-gray-100 border-l-4 border-transparent'
            }`}
          onClick={() => handleSidebarNavigation('notifications')}
        >
          <Bell className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Notifications</span>}
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm ${activeSidebarItem === 'settings'
            ? 'bg-[#7ede56] text-[#002f37] border-l-4 border-[#002f37]'
            : sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10 border-l-4 border-transparent' : 'text-[#002f37] hover:bg-gray-100 border-l-4 border-transparent'
            }`}
          onClick={() => handleSidebarNavigation('settings')}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">Profile & Settings</span>}
        </div>
      </nav>

      {/* Log Out - Sticky at bottom */}
      <div className={`mt-auto p-4 border-t space-y-2 ${sidebarDarkMode ? 'border-gray-800' : 'border-gray-200'} sticky bottom-0 ${sidebarDarkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm ${sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10' : 'text-[#002f37] hover:bg-gray-100'}`}
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="h-4 w-4 flex-shrink-0 text-yellow-500" /> : <Moon className="h-4 w-4 flex-shrink-0 text-gray-400" />}
          {(!sidebarCollapsed || isMobile) && <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </div>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-sm ${sidebarDarkMode ? 'text-[#f4ffee] hover:bg-white/10' : 'text-[#002f37] hover:bg-gray-100'}`}
          onClick={() => navigate('/')}
        >
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
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
              className={`w-[280px] p-0 ${sidebarDarkMode ? 'bg-[#002f37]' : 'bg-white'} overflow-y-auto`}
            >
              <div className="flex flex-col h-full">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Sidebar - Static for grower (no transitions), collapsible for others */}
        {!isMobile && (
          <div className={`${userType === 'grower' ? 'w-64' : (sidebarCollapsed ? 'w-16' : 'w-64')} ${sidebarDarkMode ? 'bg-[#002f37]' : 'bg-white'} flex-shrink-0 ${userType !== 'grower' ? 'transition-all duration-300' : ''} border-r ${sidebarDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
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

          <div className="w-full p-3 sm:p-4 md:p-6">
            {/* Tabs */}
            <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setActiveTab('matches')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'matches'
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
                className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'stages'
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
                className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'investments'
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
                              <div className="text-right hidden sm:block">
                                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Investment</p>
                                <p className={`text-lg font-bold ${darkMode ? 'text-[#7ede56]' : 'text-[#01414a]'}`}>GHS {investment.investmentAmount.toLocaleString()}</p>
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
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isCompleted
                                      ? 'bg-[#7ede56] text-white shadow-md'
                                      : isCurrent
                                        ? 'bg-[#01414a] text-white ring-4 ring-[#7ede56]/30 scale-110 shadow-lg'
                                        : 'bg-white border-2 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
                                      }`}>
                                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                                    </div>

                                    {/* Label */}
                                    <div className="mt-4 text-center">
                                      <p className={`text-sm font-bold transition-colors duration-300 ${isCurrent ? (darkMode ? 'text-[#7ede56]' : 'text-[#01414a]') : isCompleted ? (darkMode ? 'text-gray-300' : 'text-gray-700') : (darkMode ? 'text-gray-500' : 'text-gray-400')
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
                          <div className={`rounded-xl p-5 border ${darkMode ? 'bg-[#003c47] border-[#0a4f59]' : 'bg-[#f4ffee] border-[#e0f2d8]'
                            }`}>
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-lg ${darkMode ? 'bg-[#01414a]' : 'bg-white'}`}>
                                <Activity className={`h-6 w-6 ${darkMode ? 'text-[#7ede56]' : 'text-[#01414a]'}`} />
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
        </div>
      </div>
    </div>
  );
};

export default InvestorMatches;
