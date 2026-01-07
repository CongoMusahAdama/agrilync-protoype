import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { exportToPDF, exportToWord } from '@/utils/reportExport';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import AddFarmerModal from '@/components/agent/AddFarmerModal';
import ViewFarmerModal from '@/components/agent/ViewFarmerModal';
import UploadReportModal from '@/components/agent/UploadReportModal';
import FarmJourneyModal from '@/components/agent/FarmJourneyModal';
import VerificationQueueModal from '@/components/agent/VerificationQueueModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from "@/components/ui/skeleton";
import Preloader from '@/components/ui/Preloader';
import {
    Search,
    Users,
    CheckCircle,
    Clock,
    TrendingUp,
    Coins,
    Eye,
    Edit,
    Upload,
    UserCheck,
    Plus,
    X,
    MapPin,
    Calendar,
    Phone,
    Mail,
    User,
    ClipboardList,
    FileText,
    FileDown,
    Trash2,
    Timer,
    Camera,
    Download,
    FileSpreadsheet,
    Loader2,
    Leaf,
    Sprout,
    Scissors,
    Wrench,
    MoreHorizontal
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const MetricCardSkeleton = () => (
    <Card className="bg-gray-800/50 border-gray-700 rounded-lg p-3 sm:p-6 shadow-lg animate-pulse">
        <div className="flex flex-col h-full gap-4 text-left">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg bg-gray-700" />
                <Skeleton className="h-4 w-24 bg-gray-700" />
            </div>
            <div className="flex-1 flex items-center">
                <Skeleton className="h-10 w-16 bg-gray-700" />
            </div>
        </div>
    </Card>
);

const FarmManagement: React.FC = () => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const location = useLocation();
    
    // All useState hooks must be declared at the top, before any useQuery or conditional logic
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [selectedFarmType, setSelectedFarmType] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [verificationQueueModalOpen, setVerificationQueueModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('personal');
    const [activeTab, setActiveTab] = useState<'farmers' | 'visits' | 'reports'>('farmers');
    const [fieldVisitModalOpen, setFieldVisitModalOpen] = useState(false);
    const [journeyModalOpen, setJourneyModalOpen] = useState(false);
    const [selectedVisits, setSelectedVisits] = useState<Set<string>>(new Set());
    const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);
    const [visitForm, setVisitForm] = useState({
        farmerId: '',
        farmerName: '',
        lyncId: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        hoursSpent: '1',
        purpose: '',
        otherPurpose: '',
        notes: '',
        stage: '',
        observations: '',
        recommendations: '',
        photos: [] as File[],
        challenges: '',
        status: 'Completed',
        isEditing: false,
        editingId: ''
    });
    const [visitImages, setVisitImages] = useState<string[]>([]);
    const [selectedVisit, setSelectedVisit] = useState<any>(null);
    const [visitDetailModalOpen, setVisitDetailModalOpen] = useState(false);

    // Initial Tab Selection from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tabParam = params.get('tab');
        if (tabParam && ['farmers', 'visits', 'reports'].includes(tabParam)) {
            setActiveTab(tabParam as 'farmers' | 'visits' | 'reports');
        }
    }, [location.search]);

    // useQuery for dashboard data (shared with main dashboard)
    const { data: summaryData, isLoading: loadingSummary, isFetching: fetchingSummary, refetch: refetchSummary } = useQuery({
        queryKey: ['agentDashboardSummary'],
        queryFn: async () => {
            const response = await api.get('/dashboard/summary');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false, // Disabled for mobile performance
        retry: 2,
        refetchOnReconnect: true
    });

    // useQuery for field visits
    const { data: visitLogsData, isLoading: loadingVisits, isFetching: fetchingVisits, refetch: refetchVisits } = useQuery({
        queryKey: ['fieldVisits'],
        queryFn: async () => {
            const response = await api.get('/field-visits');
            return response.data;
        },
        staleTime: 3 * 60 * 1000, // 3 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 2
    });

    // useQuery for reports
    const { data: reportsData, isLoading: loadingReports, isFetching: fetchingReports, refetch: refetchReports } = useQuery({
        queryKey: ['reports'],
        queryFn: async () => {
            const response = await api.get('/reports/agent');
            return response.data;
        },
        staleTime: 3 * 60 * 1000, // 3 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 2
    });

    const farmers = summaryData?.farmers || [];
    const farms = summaryData?.farms || [];
    const pendingFarmers = summaryData?.pendingQueue || [];
    const visitLogs = visitLogsData || [];
    const reports = reportsData || [];

    const loading = loadingSummary || loadingVisits || loadingReports;
    const isFetching = fetchingSummary || fetchingVisits || fetchingReports;
    const isLoaded = !loading && !isFetching;

    const fetchData = () => {
        refetchSummary();
        refetchVisits();
        refetchReports();
    };

    const metrics = useMemo(() => {
        const total = farmers.length;
        const verified = farmers.filter((f: any) => f.status === 'active').length;
        const pending = pendingFarmers.length; // From verification queue
        const activeCount = farms.length; // Count all created farms
        const matched = farmers.filter((f: any) => f.investmentStatus === 'Matched').length;
        return { total, verified, pending, active: activeCount, matched };
    }, [farmers, farms, pendingFarmers]);

    const filteredFarmers = useMemo(() => {
        return farmers.map((f: any) => {
            let displayStatus = f.status;
            if (displayStatus === 'active') displayStatus = 'Completed';
            if (displayStatus === 'pending') displayStatus = 'Pending';
            return { ...f, displayStatus };
        }).filter((farmer: any) => {
            const matchesSearch =
                farmer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (farmer.phone && farmer.phone.includes(searchQuery));
            const matchesRegion = selectedRegion === 'all' || farmer.region === selectedRegion;
            const matchesFarmType = selectedFarmType === 'all' || farmer.farmType === selectedFarmType;
            const matchesCategory = selectedCategory === 'all' || true;
            const filterStatus = statusFilter || selectedStatus;

            const matchesStatus = filterStatus === 'all' || farmer.displayStatus === filterStatus;
            return matchesSearch && matchesRegion && matchesFarmType && matchesCategory && matchesStatus;
        });
    }, [farmers, searchQuery, selectedRegion, selectedFarmType, selectedCategory, selectedStatus, statusFilter]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedRegion('all');
        setSelectedFarmType('all');
        setSelectedCategory('all');
        setSelectedStatus('all');
        setStatusFilter(null);
    };

    const handleCardClick = (status: string | null) => {
        if (status === 'Pending') {
            setVerificationQueueModalOpen(true);
        } else {
            setStatusFilter(status);
            setSelectedStatus('all');
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return darkMode ? 'bg-emerald-500/20 text-emerald-300 border-0' : 'bg-emerald-100 text-emerald-700';
            case 'Pending':
                return darkMode ? 'bg-yellow-500/20 text-yellow-300 border-0' : 'bg-yellow-100 text-yellow-700';
            case 'Matched':
                return darkMode ? 'bg-purple-500/20 text-purple-300 border-0' : 'bg-purple-100 text-purple-700';
            case 'In Progress':
                return darkMode ? 'bg-blue-500/20 text-blue-300 border-0' : 'bg-blue-100 text-blue-700';
            default:
                return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600';
        }
    };

    const handleViewFarmer = (farmer: any, tab: string = 'personal') => {
        setSelectedFarmer(farmer);
        setSelectedTab(tab);
        setViewModalOpen(true);
    };

    const handleEditFarmer = async (farmer: any) => {
        try {
            // Fetch full farmer data including Ghana card images
            const res = await api.get(`/farmers/${farmer._id}`);
            setSelectedFarmer(res.data);
            setEditModalOpen(true);
        } catch (error: any) {
            console.error('Error fetching farmer data:', error);
            toast.error('Failed to load farmer data. Using available data.');
            // Fallback to available data if fetch fails
            setSelectedFarmer(farmer);
            setEditModalOpen(true);
        }
    };

    const generateLyncId = (farmerId: string) => {
        // Generate a consistent 7-digit number from farmer ID
        const numericId = farmerId.replace(/\D/g, '');
        const paddedId = numericId.padStart(7, '0').slice(0, 7);
        return `LYG${paddedId}`;
    };

    const handleVerifyFarmer = (farmer: any) => {
        const confirmed = window.confirm(`Verify farmer: ${farmer.name}?\n\nThis will change their status from Pending to Verified.`);
        if (confirmed) {
            alert(`Farmer ${farmer.name} has been verified successfully!`);
        }
    };

    const handleUploadReport = (farmer: any) => {
        setSelectedFarmer(farmer);
        setUploadModalOpen(true);
    };

    const handleLogVisit = (farmer?: any) => {
        setVisitImages([]);
        if (farmer) {
            setVisitForm({
                farmerId: farmer._id,
                farmerName: farmer.name,
                lyncId: generateLyncId(farmer._id),
                phone: farmer.phone || '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                hoursSpent: '1',
                purpose: '',
                otherPurpose: '',
                notes: '',
                challenges: '',
                status: 'Completed',
                isEditing: false,
                editingId: ''
            });
        } else {
            setVisitForm({
                farmerId: '',
                farmerName: '',
                lyncId: '',
                phone: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                hoursSpent: '1',
                purpose: '',
                otherPurpose: '',
                notes: '',
                challenges: '',
                status: 'Completed',
                isEditing: false,
                editingId: ''
            });
        }
        setFieldVisitModalOpen(true);
    };

    const handleEditVisit = (visit: any) => {
        const standardPurposes = [
            'Routine inspection',
            'Pest control',
            'Irrigation check',
            'Harvest assessment',
            'Soil testing',
            'Training session'
        ];

        const isOther = visit.purpose && !standardPurposes.includes(visit.purpose) && visit.purpose !== 'Other';

        setVisitForm({
            farmerId: visit.farmer?._id || visit.farmerId,
            farmerName: visit.farmer?.name || visit.farmerName,
            lyncId: visit.farmer?.lyncId || visit.lyncId,
            phone: visit.farmer?.contact || visit.phone,
            date: new Date(visit.date).toISOString().split('T')[0],
            time: visit.time,
            hoursSpent: visit.hoursSpent.toString(),
            purpose: isOther ? 'Other' : (visit.purpose || ''),
            otherPurpose: isOther ? visit.purpose : '',
            notes: visit.notes,
            challenges: visit.challenges || '',
            status: visit.status || 'Completed',
            isEditing: true,
            editingId: visit._id
        });
        setVisitImages(visit.visitImages || []);
        setFieldVisitModalOpen(true);
    };

    const fetchVisits = () => {
        refetchVisits();
    };

    const handleExportPDF = async () => {
        if (visitLogs.length === 0) {
            toast.error('No visit logs to export');
            return;
        }

        const dataToExport = selectedVisits.size > 0
            ? visitLogs.filter((v: any) => selectedVisits.has(v._id || v.id))
            : visitLogs;

        setIsExporting('pdf');
        // Add a small artificial delay for UX and to allow spinner to show
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(29, 185, 84); // AgriLync Green
            doc.text('Field Visit Logs - AgriLync', 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Agent: ${agent?.name || 'AgriLync Agent'}`, 14, 30);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 37);
            doc.text(`Type: ${selectedVisits.size > 0 ? 'Selected Records' : 'All Records'}`, 14, 44);

            const tableColumn = ["Date", "Farmer", "Lync ID", "Purpose", "Hours", "Status"];
            const tableRows = dataToExport.map((visit: any) => [
                new Date(visit.date).toLocaleDateString(),
                visit.farmer?.name || visit.farmerName,
                visit.farmer?.lyncId || visit.lyncId,
                visit.purpose,
                visit.hoursSpent,
                visit.status
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 50,
                theme: 'grid',
                headStyles: { fillColor: [29, 185, 84], halign: 'center' },
                bodyStyles: { halign: 'center' },
                alternateRowStyles: { fillColor: [240, 240, 240] }
            });

            doc.save(`AgriLync_VisitLogs_${new Date().toISOString().split('T')[0]}.pdf`);
            await Swal.fire({
                icon: 'success',
                title: 'Export Successful!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                            PDF report (${dataToExport.length} records) exported successfully
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#7ede56',
                timer: 2000,
                timerProgressBar: true
            });
        } catch (err) {
            console.error('Export error:', err);
            toast.error('Failed to export PDF');
        } finally {
            setIsExporting(null);
        }
    };

    const handleExportExcel = async () => {
        if (visitLogs.length === 0) {
            toast.error('No visit logs to export');
            return;
        }

        const dataToExport = selectedVisits.size > 0
            ? visitLogs.filter((v: any) => selectedVisits.has(v._id || v.id))
            : visitLogs;

        setIsExporting('excel');
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const exportData = dataToExport.map((visit: any) => ({
                'Date': new Date(visit.date).toLocaleDateString(),
                'Farmer Name': visit.farmer?.name || visit.farmerName,
                'Lync ID': visit.farmer?.lyncId || visit.lyncId,
                'Purpose': visit.purpose,
                'Notes': visit.notes,
                'Challenges': visit.challenges || 'None',
                'Hours Spent': visit.hoursSpent,
                'Status': visit.status
            }));

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Visit Logs");
            XLSX.writeFile(wb, `AgriLync_VisitLogs_${new Date().toISOString().split('T')[0]}.xlsx`);
            await Swal.fire({
                icon: 'success',
                title: 'Export Successful!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                            Excel spreadsheet (${dataToExport.length} records) exported successfully
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#7ede56',
                timer: 2000,
                timerProgressBar: true
            });
        } catch (err) {
            console.error('Export error:', err);
            toast.error('Failed to export Excel');
        } finally {
            setIsExporting(null);
        }
    };


    const queryClient = useQueryClient();

    const visitMutation = useMutation({
        mutationFn: async (visitData: any) => {
            if (visitForm.isEditing && visitForm.editingId) {
                return api.put(`/field-visits/${visitForm.editingId}`, visitData);
            } else {
                return api.post('/field-visits', visitData);
            }
        },
        onSuccess: async () => {
            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                            ${visitForm.isEditing ? 'Field visit updated successfully!' : 'Field visit logged successfully!'}
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#7ede56',
                timer: 2000,
                timerProgressBar: true
            });
            queryClient.invalidateQueries({ queryKey: ['fieldVisits'] });
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            setFieldVisitModalOpen(false);
            // Reset form
            setVisitForm({
                farmerId: '',
                farmerName: '',
                lyncId: '',
                phone: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                hoursSpent: '1',
                purpose: '',
                otherPurpose: '',
                notes: '',
                challenges: '',
                status: 'Completed',
                isEditing: false,
                editingId: ''
            });
            setVisitImages([]);
        },
        onError: (err) => {
            console.error('Error saving visit:', err);
            toast.error(visitForm.isEditing ? 'Failed to update field visit' : 'Failed to log field visit');
        }
    });

    // const isSaving = visitMutation.isPending; // Removed to avoid conflict with state

    const handleSubmitVisit = async () => {
        const finalPurpose = visitForm.purpose === 'Other' ? visitForm.otherPurpose : visitForm.purpose;

        if (!visitForm.farmerId || !finalPurpose || !visitForm.notes) {
            toast.error('Please fill all required fields');
            return;
        }

        const visitData = {
            farmer: visitForm.farmerId,
            date: visitForm.date,
            time: visitForm.time,
            hoursSpent: Number(visitForm.hoursSpent),
            purpose: finalPurpose,
            notes: visitForm.notes,
            visitImages: visitImages,
            challenges: visitForm.challenges,
            status: visitForm.status
        };

        visitMutation.mutate(visitData);
    };

    const sectionCardClass = darkMode
        ? 'border border-[#124b53] bg-[#0b2528] text-gray-100 shadow-lg'
        : 'border-none bg-white text-gray-900 shadow-sm';

    const inputBaseClasses = darkMode
        ? 'bg-[#10363d] border-[#1b5b65] text-gray-100 placeholder:text-gray-400'
        : '';

    return (
        <AgentLayout
            activeSection="farm-management"
            title="Farm Management"
        >
            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
                    {[
                        { label: 'Total Farmers', value: metrics.total, icon: Users, color: 'bg-emerald-600', status: null },
                        { label: 'Completed', value: metrics.verified, icon: CheckCircle, color: 'bg-blue-600', status: 'Completed' },
                        { label: 'Verification Queue', value: metrics.pending, icon: Clock, color: 'bg-orange-600', status: 'Pending' },
                        { label: 'Active Farms', value: metrics.active, icon: TrendingUp, color: 'bg-indigo-600', status: 'In Progress' },
                        { label: 'Matched', value: metrics.matched, icon: Coins, color: 'bg-purple-600', status: 'Matched' }
                    ].map((item, idx) => (
                        !isLoaded ? (
                            <MetricCardSkeleton key={`skeleton-${idx}`} />
                        ) : (
                            <Card
                                key={item.label}
                                className={`${item.color} border-none rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-200 relative overflow-hidden ${(statusFilter === item.status && item.status !== null) || (statusFilter === null && item.status === null) ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''} opacity-100 translate-y-0`}
                                style={{ transitionDelay: `${idx * 50}ms` }}
                                onClick={() => handleCardClick(item.status)}
                            >
                                {/* Background Decoration */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none">
                                    <item.icon className="absolute top-1 right-1 h-12 w-12 text-white rotate-12" />
                                </div>

                                <div className="p-3 sm:p-5 flex flex-col h-full relative z-10 text-left">
                                    <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                                        <item.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                        <p className="text-[10px] sm:text-xs font-medium text-white uppercase tracking-wider">{item.label}</p>
                                    </div>
                                    <div className="flex-1 flex items-center">
                                        <p className="text-2xl sm:text-4xl font-bold text-white">
                                            <CountUp end={Number(item.value)} duration={1000} />
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )
                    ))}
                </div>


                {/* Tabs for Farmers Directory and Field Visit Logs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'farmers' | 'visits' | 'reports')} className="w-full">
                    <TabsList className={`flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide bg-transparent p-0 h-auto gap-2 sm:gap-4 mb-4 sm:mb-8 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <TabsTrigger
                            value="farmers"
                            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'farmers'
                                ? 'border-[#1db954] text-[#1db954] bg-[#1db954]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Users className="h-4 w-4 mr-2" />
                            Farmers Directory ({filteredFarmers.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="visits"
                            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'visits'
                                ? 'border-[#1db954] text-[#1db954] bg-[#1db954]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Field Visits ({visitLogs.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="reports"
                            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'reports'
                                ? 'border-[#1db954] text-[#1db954] bg-[#1db954]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Reports ({reports.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Farmers Directory Tab */}
                    <TabsContent value="farmers" className="space-y-4">
                        {/* Improved Filter Bar - Modern Glassmorphism */}
                        <Card className={`${sectionCardClass} border-0 shadow-lg overflow-hidden`}>
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                                    <div className="relative flex-1 group">
                                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${darkMode ? 'text-gray-500 group-focus-within:text-[#1db954]' : 'text-gray-400 group-focus-within:text-[#1db954]'}`} />
                                        <Input
                                            placeholder="Search by name, phone or Lync ID..."
                                            className={`pl-10 h-11 ${inputBaseClasses} ${darkMode ? 'bg-white/5 border-white/10 focus:ring-emerald-500/50' : 'bg-gray-50'}`}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                            <SelectTrigger className={`w-full sm:w-40 h-11 ${inputBaseClasses} ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50'}`}>
                                                <SelectValue placeholder="Region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Regions</SelectItem>
                                                {['Ashanti', 'Eastern', 'Northern', 'Western'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedFarmType} onValueChange={setSelectedFarmType}>
                                            <SelectTrigger className={`w-full sm:w-40 h-11 ${inputBaseClasses} ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50'}`}>
                                                <SelectValue placeholder="Farm Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="Crop">Crop</SelectItem>
                                                <SelectItem value="Livestock">Livestock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setStatusFilter(null); }}>
                                            <SelectTrigger className={`w-full sm:w-40 h-11 ${inputBaseClasses} ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50'}`}>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Matched">Matched</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={resetFilters}
                                                className={`h-11 w-11 ${darkMode ? 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-white text-gray-500'}`}
                                                title="Reset Filters"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <Button onClick={() => setIsAddFarmerModalOpen(true)} className="h-11 flex-1 sm:flex-none px-6 bg-[#1db954] hover:bg-[#17a447] text-white shadow-lg shadow-emerald-500/20">
                                                <Plus className="h-4 w-4 mr-2" />Add Farmer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {(statusFilter || searchQuery || selectedStatus !== 'all' || selectedRegion !== 'all' || selectedFarmType !== 'all') && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Active Filters:</span>
                                        {statusFilter && <Badge className="bg-emerald-500/10 text-emerald-500 border-0 hover:bg-emerald-500/20">{statusFilter}</Badge>}
                                        {selectedRegion !== 'all' && <Badge variant="outline" className="border-gray-500/30 text-gray-500">{selectedRegion}</Badge>}
                                        {selectedFarmType !== 'all' && <Badge variant="outline" className="border-gray-500/30 text-gray-500">{selectedFarmType}</Badge>}
                                    </div>
                                )}
                            </div>
                        </Card>


                        {/* Action Benefits Legend */}
                        <div className={`mb-4 p-4 rounded-lg flex flex-wrap gap-6 items-center border ${darkMode ? 'bg-[#002f37] border-cyan-900/30' : 'bg-blue-50 border-blue-100'}`}>
                            <p className={`text-sm font-semibold mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quick Actions Guide:</p>

                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <Eye className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>View Profile</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                                    <Edit className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Edit Details</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <Leaf className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track Journey</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <Upload className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload Report</span>
                            </div>
                        </div>

                        {/* Farmers Table - Premium Interactive Style */}
                        <Card className={`${sectionCardClass} border-0 shadow-xl overflow-hidden`}>
                            <div className="overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-emerald-500/5">
                                    <div>
                                        <h3 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Grower Directory</h3>
                                        <p className={`text-xs mt-1 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Displaying {filteredFarmers.length} registered farmers
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={`${darkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'} border px-3 py-1`}>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                            Live Update
                                        </Badge>
                                    </div>
                                </div>

                                <div className="overflow-auto max-h-[65vh] relative">
                                    <Table>
                                        <TableHeader className="sticky top-0 z-20 bg-emerald-600 dark:bg-emerald-700 shadow-md">
                                            <TableRow className="border-0 hover:bg-transparent">
                                                <TableHead className="w-12 text-center text-white font-bold uppercase tracking-wider h-12">#</TableHead>
                                                <TableHead className="text-white font-bold uppercase tracking-wider h-12 whitespace-nowrap">Farmer Details</TableHead>
                                                <TableHead className="text-white font-bold uppercase tracking-wider h-12 whitespace-nowrap">Phone Number</TableHead>
                                                <TableHead className="text-white font-bold uppercase tracking-wider h-12 whitespace-nowrap">Location</TableHead>
                                                <TableHead className="text-white font-bold uppercase tracking-wider h-12 whitespace-nowrap">Farm Info</TableHead>
                                                <TableHead className="text-white font-bold uppercase tracking-wider h-12 whitespace-nowrap">Status</TableHead>
                                                <TableHead className="text-white font-bold uppercase tracking-wider h-12 whitespace-nowrap">Last Visit</TableHead>
                                                <TableHead className="text-right text-white font-bold uppercase tracking-wider h-12 pr-6 whitespace-nowrap">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredFarmers.map((farmer: any, index: number) => (
                                                <TableRow
                                                    key={farmer._id || farmer.id || `farmer-${index}`}
                                                    className={`group transition-all duration-300 border-b ${darkMode ? 'border-white/5 hover:bg-emerald-500/5' : 'hover:bg-gray-50'} ${index % 2 === 0 ? (darkMode ? 'bg-transparent' : 'bg-white') : (darkMode ? 'bg-white/2' : 'bg-gray-50/30')}`}
                                                >
                                                    <TableCell className="text-center font-mono text-xs text-gray-500">
                                                        {(index + 1).toString().padStart(2, '0')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                {farmer.profilePicture ? (
                                                                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-[#124b53] transition-transform group-hover:scale-110 group-hover:rotate-3">
                                                                        <img src={farmer.profilePicture} alt={farmer.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                ) : (
                                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${farmer.displayStatus === 'Completed' ? 'bg-emerald-500' : farmer.displayStatus === 'Pending' ? 'bg-amber-500' : 'bg-indigo-500'}`}>
                                                                        {farmer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                                                    </div>
                                                                )}
                                                                {farmer.displayStatus === 'Completed' && (
                                                                    <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5 shadow-sm border border-emerald-50">
                                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className={`font-bold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{farmer.name}</p>
                                                                <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{generateLyncId(farmer._id)}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farmer.contact || 'N/A'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farmer.region}</span>
                                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{farmer.community}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <Badge variant="outline" className={`w-fit text-[10px] uppercase font-bold tracking-wider mb-1 px-1.5 py-0 ${darkMode ? 'border-indigo-500/30 text-indigo-400' : 'border-indigo-200 text-indigo-700 bg-indigo-50'}`}>
                                                                {farmer.farmType}
                                                            </Badge>
                                                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{farmer.category}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-0 ring-1 ring-inset ${farmer.displayStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' :
                                                            farmer.displayStatus === 'Pending' ? 'bg-amber-500/10 text-amber-500 ring-amber-500/20' :
                                                                farmer.displayStatus === 'Matched' ? 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/20' :
                                                                    'bg-blue-500/10 text-blue-500 ring-blue-500/20'
                                                            }`}>
                                                            {farmer.displayStatus}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {farmer.lastVisit ? new Date(farmer.lastVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleViewFarmer(farmer)}
                                                                className={`h-8 w-8 rounded-lg ${darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleEditFarmer(farmer)}
                                                                className={`h-8 w-8 rounded-lg ${darkMode ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setSelectedFarmer(farmer);
                                                                    setJourneyModalOpen(true);
                                                                }}
                                                                className={`h-8 w-8 rounded-lg opacity-100 ${darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                                title="Track Farm Journey"
                                                            >
                                                                <Leaf className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleUploadReport(farmer)}
                                                                className={`h-8 w-8 rounded-lg ${darkMode ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                                                title="Upload Report"
                                                            >
                                                                <Upload className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {filteredFarmers.length === 0 && (
                                        <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <div className={`w-20 h-20 mx-auto mb-6 rounded-[2rem] flex items-center justify-center rotate-12 transition-transform hover:rotate-0 duration-500 ${darkMode ? 'bg-white/5 text-emerald-400' : 'bg-emerald-50 text-emerald-500'}`}>
                                                <Users className="h-10 w-10 opacity-40" />
                                            </div>
                                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>No growers discovered</h3>
                                            <p className="text-sm max-w-xs mx-auto opacity-70">We couldn't find any farmers matching your current search parameters. Try resetting your filters.</p>
                                            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-emerald-600 hover:text-emerald-700">
                                                Reset all filters</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                            Showing {filteredFarmers.length} of {farmers.length} farmers
                        </div>
                    </TabsContent>

                    {/* Field Visit Logs Tab - Journal Entry Style */}
                    <TabsContent value="visits" className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                            <div>
                                <h3 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Field Activities</h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chronological record of recent farm inspections</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    onClick={handleExportPDF}
                                    disabled={isExporting !== null}
                                    className={`bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 border-0 h-9 sm:h-10 px-3 sm:px-4 transition-all active:scale-95 text-xs sm:text-sm`}
                                >
                                    {isExporting === 'pdf' ? (
                                        <Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-1 sm:mr-2" />
                                    )}
                                    {selectedVisits.size > 0 ? `PDF (${selectedVisits.size})` : 'PDF All'}
                                </Button>
                                <Button
                                    onClick={handleExportExcel}
                                    disabled={isExporting !== null}
                                    className={`bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 border-0 h-9 sm:h-10 px-3 sm:px-4 transition-all active:scale-95 text-xs sm:text-sm`}
                                >
                                    {isExporting === 'excel' ? (
                                        <Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin" />
                                    ) : (
                                        <FileSpreadsheet className="h-4 w-4 mr-1 sm:mr-2" />
                                    )}
                                    {selectedVisits.size > 0 ? `Excel (${selectedVisits.size})` : 'Excel All'}
                                </Button>
                                <Button onClick={() => handleLogVisit()} className="bg-[#1db954] hover:bg-[#17a447] text-white shadow-lg shadow-emerald-500/20 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
                                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                                    New Journal Entry
                                </Button>
                            </div>
                        </div>

                        {visitLogs.length > 0 && (
                            <div className="flex items-center gap-4 py-2 px-8">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="selectAllVisits"
                                        checked={selectedVisits.size === visitLogs.length && visitLogs.length > 0}
                                        onCheckedChange={(checked: boolean) => {
                                            if (checked) {
                                                setSelectedVisits(new Set(visitLogs.map((v: any) => v._id || v.id)));
                                            } else {
                                                setSelectedVisits(new Set());
                                            }
                                        }}
                                    />
                                    <Label htmlFor="selectAllVisits" className={`text-xs font-bold cursor-pointer ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Select All Records
                                    </Label>
                                </div>
                                {selectedVisits.size > 0 && (
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 animate-pulse">
                                        {selectedVisits.size} records selected for export
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-500/50 before:to-transparent">
                            {loadingVisits ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading field journals...</p>
                                </div>
                            ) : (
                                <>
                                    {visitLogs.slice(0, 5).map((visit: any, index: number) => (
                                        <div key={visit._id || index} className="group relative">
                                            {/* Timeline Node */}
                                            <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-4 flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${darkMode ? 'bg-[#002f37] border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white border-emerald-500 shadow-md'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${visit.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            </div>

                                            <Card
                                                className={`${sectionCardClass} border-0 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-emerald-500/5 group-hover:translate-x-1 cursor-pointer`}
                                                onClick={() => {
                                                    setSelectedVisit(visit);
                                                    setVisitDetailModalOpen(true);
                                                }}
                                            >
                                                <div className="p-5 flex items-start gap-4">
                                                    <div className="pt-1" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                                        <Checkbox
                                                            checked={selectedVisits.has(visit._id || visit.id)}
                                                            onCheckedChange={(checked: boolean) => {
                                                                const newSelected = new Set(selectedVisits);
                                                                if (checked) {
                                                                    newSelected.add(visit._id || visit.id);
                                                                } else {
                                                                    newSelected.delete(visit._id || visit.id);
                                                                }
                                                                setSelectedVisits(newSelected);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1" onClick={() => {
                                                        setSelectedVisit(visit);
                                                        setVisitDetailModalOpen(true);
                                                    }}>
                                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                                    <span className={`text-[10px] font-bold opacity-40 font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                        #{visitLogs.length - index}
                                                                    </span>
                                                                    <Badge variant="outline" className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 ${darkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-gray-50 text-emerald-600'}`}>
                                                                        {visit.farmer?.lyncId || visit.lyncId}
                                                                    </Badge>
                                                                    <h4 className={`text-sm sm:text-base font-bold transition-colors ${darkMode ? 'text-gray-100 group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-emerald-600'}`}>
                                                                        {visit.farmer?.name || visit.farmerName}
                                                                    </h4>
                                                                    <span className={`hidden sm:inline text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                                                                    <Badge className={`text-[9px] sm:text-[10px] uppercase tracking-widest ${darkMode ? 'bg-emerald-500/10 text-emerald-400 border-0' : 'bg-emerald-50 text-emerald-700'}`}>
                                                                        {visit.purpose}
                                                                    </Badge>
                                                                </div>

                                                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                    {visit.notes}
                                                                </p>

                                                                {visit.challenges && (
                                                                    <div className={`mt-2 p-3 rounded-lg border text-sm ${darkMode ? 'bg-amber-500/5 border-amber-500/10 text-amber-200/70' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <X className="w-3.5 h-3.5" />
                                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Challenges Encountered</span>
                                                                        </div>
                                                                        {visit.challenges}
                                                                    </div>
                                                                )}

                                                                {visit.visitImages && visit.visitImages.length > 0 && (
                                                                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                                                                        {visit.visitImages.map((img: string, idx: number) => (
                                                                            <img
                                                                                key={idx}
                                                                                src={img}
                                                                                alt={`Visit ${idx}`}
                                                                                className="h-16 w-16 object-cover rounded-md border border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                                                                                onClick={() => window.open(img, '_blank')}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                                                        <span className={`text-[11px] sm:text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                            {new Date(visit.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                                                                        <span className={`text-[11px] sm:text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                            {visit.time} ({visit.hoursSpent}h)
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                                                                        <span className={`text-[11px] sm:text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                            {visit.farmer?.contact || visit.phone}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-3 min-w-full md:min-w-[120px] pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                                                                <div className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${visit.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-500 ring-amber-500/20'
                                                                    }`}>
                                                                    {visit.status}
                                                                </div>
                                                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-9 w-9 md:h-8 md:w-8 rounded-lg bg-white/5 md:bg-transparent hover:bg-white/10"
                                                                        onClick={(e: React.MouseEvent) => {
                                                                            e.stopPropagation();
                                                                            handleEditVisit(visit);
                                                                        }}
                                                                    >
                                                                        <Edit className="w-4 h-4 text-gray-400" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-9 w-9 md:h-8 md:w-8 rounded-lg bg-emerald-500/10 md:bg-transparent hover:bg-emerald-500/20"
                                                                        onClick={(e: React.MouseEvent) => {
                                                                            e.stopPropagation();
                                                                            // Logic for completing/marking done if needed
                                                                        }}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}

                                    {visitLogs.length === 0 && (
                                        <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <div className={`w-20 h-20 mx-auto mb-6 rounded-[2rem] flex items-center justify-center rotate-12 ${darkMode ? 'bg-white/5 text-emerald-400' : 'bg-emerald-50 text-emerald-500'}`}>
                                                <ClipboardList className="h-10 w-10 opacity-40" />
                                            </div>
                                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Journal is empty</h3>
                                            <p className="text-sm max-w-xs mx-auto opacity-70">No field visits have been recorded yet. Start by logging your first inspection.</p>
                                            <Button onClick={() => handleLogVisit()} className="mt-6 bg-[#1db954]">
                                                Log First Visit
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </TabsContent>

                    {/* Reports Tab */}
                    <TabsContent value="reports" className="space-y-4">
                        <Card className={`${sectionCardClass} border-0 shadow-lg overflow-hidden`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-6 pt-6">
                                <div>
                                    <CardTitle className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Submitted Field Reports
                                    </CardTitle>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        View and download documents for your field activities.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetchReports()}
                                    disabled={loadingReports}
                                    className={`h-9 ${darkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : ''}`}
                                >
                                    {loadingReports ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                                    Refresh List
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 sm:p-6 sm:pt-0">
                                <div className="overflow-x-auto relative custom-scrollbar">
                                    <Table className="min-w-[800px] lg:min-w-full">
                                        <TableHeader className={`sticky top-0 z-20 ${darkMode ? 'bg-[#002f37]' : 'bg-gray-50'} shadow-sm`}>
                                            <TableRow className="border-0 hover:bg-transparent">
                                                <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-bold`}>Farmer</TableHead>
                                                <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-bold text-center`}>Type</TableHead>
                                                <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-bold`}>Date</TableHead>
                                                <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-bold`}>Notes Summary</TableHead>
                                                <TableHead className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-bold text-right`}>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500 italic">
                                                        No reports found. Upload a report from the Farmers Directory.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                reports.map((report: any, index: number) => (
                                                    <TableRow key={report._id || report.id || `report-${index}`} className={`${darkMode ? 'border-white/5 hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex flex-col">
                                                                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{report.farmer?.name || 'Unknown Farmer'}</span>
                                                                <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>ID: {report.farmer?._id || 'N/A'}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge className={`${report.type === 'issue' ? 'bg-red-500/10 text-red-500' :
                                                                report.type === 'field-visit' ? 'bg-blue-500/10 text-blue-500' :
                                                                    report.type === 'harvest' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                        'bg-gray-500/10 text-gray-500'
                                                                } border-0 text-[10px] uppercase tracking-wider px-2 py-0.5`}>
                                                                {report.type.replace('-', ' ')}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-3.5 w-3.5 opacity-50 text-emerald-500" />
                                                                <span className="text-xs">{report.date}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={`max-w-[200px] truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                                                            {report.notes}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Download PDF"
                                                                    onClick={() => exportToPDF({
                                                                        ...report,
                                                                        farmerName: report.farmer?.name || 'Farmer',
                                                                        agentName: agent?.name || 'AgriLync Agent',
                                                                        agentId: agent?.agentId || 'N/A'
                                                                    })}
                                                                    className={`h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ${darkMode ? 'hover:bg-red-500/10' : ''}`}
                                                                >
                                                                    <FileDown className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Download Word"
                                                                    onClick={() => exportToWord({
                                                                        ...report,
                                                                        farmerName: report.farmer?.name || 'Farmer',
                                                                        agentName: agent?.name || 'AgriLync Agent',
                                                                        agentId: agent?.agentId || 'N/A'
                                                                    })}
                                                                    className={`h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 ${darkMode ? 'hover:bg-blue-500/10' : ''}`}
                                                                >
                                                                    <FileText className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs >
            </div >

            <AddFarmerModal open={isAddFarmerModalOpen} onOpenChange={setIsAddFarmerModalOpen} onSuccess={fetchData} />
            <ViewFarmerModal open={viewModalOpen} onOpenChange={setViewModalOpen} farmer={selectedFarmer} />
            <AddFarmerModal open={editModalOpen} onOpenChange={setEditModalOpen} farmer={selectedFarmer} isEditMode={true} onSuccess={fetchData} />
            <UploadReportModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} farmer={selectedFarmer} onUpload={() => refetchReports()} />
            <FarmJourneyModal open={journeyModalOpen} onOpenChange={setJourneyModalOpen} farmer={selectedFarmer} />

            {/* Field Visit Modal - Premium Style */}
            <Dialog open={fieldVisitModalOpen} onOpenChange={setFieldVisitModalOpen}>
                <DialogContent className={`max-w-2xl p-0 overflow-hidden border-0 ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
                    <div className="bg-emerald-600 p-6 text-white relative">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                <ClipboardList className="h-6 w-6" />
                                Log Field Visit
                            </DialogTitle>
                            <DialogDescription className="text-emerald-100/80 mt-1">
                                Record your findings and observations for grower oversight
                            </DialogDescription>
                        </DialogHeader>
                        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
                            <ClipboardList className="h-40 w-40 rotate-12" />
                        </div>
                    </div>

                    <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Grower Name *</Label>
                                <Select
                                    value={visitForm.farmerId}
                                    onValueChange={(val: string) => {
                                        const farmer = farmers.find((f: any) => f._id === val);
                                        if (farmer) {
                                            setVisitForm({
                                                ...visitForm,
                                                farmerId: val,
                                                farmerName: farmer.name,
                                                lyncId: generateLyncId(farmer._id),
                                                phone: farmer.contact
                                            });
                                        }
                                    }}
                                >
                                    <SelectTrigger className={`h-11 ${inputBaseClasses}`}>
                                        <SelectValue placeholder="Select a registered farmer" />
                                    </SelectTrigger>
                                    <SelectContent className={darkMode ? 'bg-gray-900 border-white/10' : ''}>
                                        {farmers.slice(0, 5).map((farmer: any, index: number) => (
                                            <SelectItem key={farmer._id || farmer.id || `select-farmer-${index}`} value={farmer._id || farmer.id} className={darkMode ? 'hover:bg-white/5' : ''}>
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{farmer.name}</span>
                                                    <span className="text-xs text-gray-500 ml-2">{farmer.contact}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lync ID Identification</Label>
                                <div className={`h-11 flex items-center px-3 rounded-lg border font-mono text-sm ${visitForm.lyncId
                                    ? (darkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
                                    : (darkMode ? 'bg-white/5 border-white/10 text-gray-500 italic' : 'bg-gray-50 border-gray-200 text-gray-400 italic')
                                    }`}>
                                    {visitForm.lyncId || 'Select a registered grower...'}
                                    {visitForm.lyncId && <CheckCircle className="w-4 h-4 ml-auto text-emerald-500" />}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visit Date *</Label>
                                <div className="relative group">
                                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${darkMode ? 'text-gray-500 group-focus-within:text-emerald-500' : 'text-gray-400 group-focus-within:text-emerald-500'}`} />
                                    <Input
                                        type="date"
                                        value={visitForm.date}
                                        onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                                        className={`pl-10 h-11 ${inputBaseClasses}`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time *</Label>
                                <div className="relative group">
                                    <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${darkMode ? 'text-gray-500 group-focus-within:text-emerald-500' : 'text-gray-400 group-focus-within:text-emerald-500'}`} />
                                    <Input
                                        type="time"
                                        value={visitForm.time}
                                        onChange={(e) => setVisitForm({ ...visitForm, time: e.target.value })}
                                        className={`pl-10 h-11 ${inputBaseClasses}`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hours Spent *</Label>
                                <div className="relative group">
                                    <Timer className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${darkMode ? 'text-gray-500 group-focus-within:text-emerald-500' : 'text-gray-400 group-focus-within:text-emerald-500'}`} />
                                    <Input
                                        type="number"
                                        min="0.1"
                                        max="24"
                                        step="0.5"
                                        value={visitForm.hoursSpent}
                                        onChange={(e) => setVisitForm({ ...visitForm, hoursSpent: e.target.value })}
                                        placeholder="e.g., 1.5"
                                        className={`pl-10 h-11 ${inputBaseClasses}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Primary Inspection Purpose *</Label>
                                <Select value={visitForm.purpose} onValueChange={(val) => setVisitForm({ ...visitForm, purpose: val })}>
                                    <SelectTrigger className={`h-11 ${inputBaseClasses}`}>
                                        <SelectValue placeholder="Select purpose of this visit" />
                                    </SelectTrigger>
                                    <SelectContent className={darkMode ? 'bg-[#002f37] border-white/10 text-white' : ''}>
                                        <SelectItem value="Routine inspection">Routine Inspection</SelectItem>
                                        <SelectItem value="Pest control">Pest Control</SelectItem>
                                        <SelectItem value="Irrigation check">Irrigation Check</SelectItem>
                                        <SelectItem value="Harvest assessment">Harvest Assessment</SelectItem>
                                        <SelectItem value="Soil testing">Soil Testing</SelectItem>
                                        <SelectItem value="Training session">Training Session</SelectItem>
                                        <SelectItem value="Other">Other (Specify)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {visitForm.purpose === 'Other' ? (
                                <div className="space-y-2">
                                    <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Specify Other Purpose *</Label>
                                    <Input
                                        value={visitForm.otherPurpose}
                                        onChange={(e) => setVisitForm({ ...visitForm, otherPurpose: e.target.value })}
                                        placeholder="e.g. Property boundary check"
                                        className={`h-11 ${inputBaseClasses}`}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visit Status *</Label>
                                    <Select value={visitForm.status} onValueChange={(val) => setVisitForm({ ...visitForm, status: val })}>
                                        <SelectTrigger className={`h-11 ${inputBaseClasses}`}>
                                            <SelectValue placeholder="Select visit status" />
                                        </SelectTrigger>
                                        <SelectContent className={darkMode ? 'bg-[#002f37] border-white/10 text-white' : ''}>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Follow-up Required">Will visit again</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {visitForm.purpose === 'Other' && (
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visit Status *</Label>
                                <Select value={visitForm.status} onValueChange={(val) => setVisitForm({ ...visitForm, status: val })}>
                                    <SelectTrigger className={`h-11 ${inputBaseClasses}`}>
                                        <SelectValue placeholder="Select visit status" />
                                    </SelectTrigger>
                                    <SelectContent className={darkMode ? 'bg-[#002f37] border-white/10 text-white' : ''}>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Follow-up Required">Will visit again</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Observation Details & Recommendations *</Label>
                            <Textarea
                                value={visitForm.notes}
                                onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                                placeholder="Log your observations, any issues identified, and recommended actions for the farmer..."
                                rows={4}
                                className={`${inputBaseClasses} resize-none pt-3`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Challenges Encountered (Optional)</Label>
                            <Textarea
                                value={visitForm.challenges}
                                onChange={(e) => setVisitForm({ ...visitForm, challenges: e.target.value })}
                                placeholder="Document any difficulties reaching the location, weather conditions, or other challenges during the visit..."
                                rows={3}
                                className={`${inputBaseClasses} resize-none pt-3`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visit Photos (Optional)</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {visitImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img} alt={`Visit ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => setVisitImages(visitImages.filter((_, i) => i !== idx))}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {visitImages.length < 6 && (
                                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
                                        <Camera className="h-6 w-6 text-gray-400" />
                                        <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setVisitImages([...visitImages, reader.result as string]);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                )}
                            </div>
                            {visitImages.length > 0 && (
                                <p className="text-xs text-gray-500">{visitImages.length}/6 photos uploaded</p>
                            )}
                        </div>

                        <div className="flex gap-4 justify-end pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setFieldVisitModalOpen(false)}
                                className={`px-6 h-11 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : ''}`}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitVisit}
                                disabled={visitMutation.isPending}
                                className="px-8 h-11 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            >
                                {visitMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Visit"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={visitDetailModalOpen} onOpenChange={setVisitDetailModalOpen}>
                <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#002f37] border-white/10 text-white' : ''}`}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <Badge variant="outline" className={`text-xs font-mono ${darkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-gray-50 text-emerald-600'}`}>
                                {selectedVisit?.farmer?.lyncId || selectedVisit?.lyncId}
                            </Badge>
                            <span className="text-xl font-bold">{selectedVisit?.farmer?.name || selectedVisit?.farmerName}</span>
                        </DialogTitle>
                        <DialogDescription className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Detailed field journal entry for farm inspection
                        </DialogDescription>
                    </DialogHeader>

                    {selectedVisit && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-white/5">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase tracking-wider text-gray-500">Date</Label>
                                    <p className="text-sm font-semibold flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                        {new Date(selectedVisit.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase tracking-wider text-gray-500">Time</Label>
                                    <p className="text-sm font-semibold flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                        {selectedVisit.time}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase tracking-wider text-gray-500">Duration</Label>
                                    <p className="text-sm font-semibold flex items-center gap-2">
                                        <Timer className="w-3.5 h-3.5 text-emerald-500" />
                                        {selectedVisit.hoursSpent} hrs
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase tracking-wider text-gray-500">Status</Label>
                                    <Badge className={`text-[10px] uppercase tracking-widest ${selectedVisit.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-0' : 'bg-amber-500/10 text-amber-500 border-0'}`}>
                                        {selectedVisit.status || 'Completed'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Inspection Purpose</Label>
                                <p className="text-sm font-medium">{selectedVisit.purpose}</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Observations & Notes</Label>
                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {selectedVisit.notes}
                                </p>
                            </div>

                            {selectedVisit.challenges && (
                                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100'}`}>
                                    <div className="flex items-center gap-2 mb-2 text-amber-500">
                                        <X className="w-4 h-4" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest">Challenges Encountered</span>
                                    </div>
                                    <p className={`text-sm ${darkMode ? 'text-amber-200/70' : 'text-amber-800'}`}>
                                        {selectedVisit.challenges}
                                    </p>
                                </div>
                            )}

                            {selectedVisit.visitImages && selectedVisit.visitImages.length > 0 && (
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Visit Gallery</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {selectedVisit.visitImages.map((img: string, idx: number) => (
                                            <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-white/10 group relative cursor-pointer" onClick={() => window.open(img, '_blank')}>
                                                <img src={img} alt={`Visit ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Eye className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="sm:justify-between gap-4 pt-4 border-t border-white/5">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setVisitDetailModalOpen(false);
                                handleEditVisit(selectedVisit);
                            }}
                            className={`flex-1 ${darkMode ? 'border-white/10 hover:bg-white/5 text-gray-400' : ''}`}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Journal Entry
                        </Button>
                        <Button
                            onClick={() => setVisitDetailModalOpen(false)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            Close Details
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <VerificationQueueModal
                open={verificationQueueModalOpen}
                onOpenChange={setVerificationQueueModalOpen}
                pendingFarmers={pendingFarmers}
                agent={agent}
                darkMode={darkMode}
                onSuccess={fetchData}
                onView={handleViewFarmer}
                onEdit={handleEditFarmer}
            />
        </AgentLayout >
    );
};

export default FarmManagement;
