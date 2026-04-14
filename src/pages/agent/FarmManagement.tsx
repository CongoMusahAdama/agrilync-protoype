import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { exportToPDF, exportToWord } from '@/utils/reportExport';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { playSuccessSound } from '@/utils/audio';
import AddFarmerModal from '@/components/agent/AddFarmerModal';
import ViewFarmerModal from '@/components/agent/ViewFarmerModal';
import UploadReportModal from '@/components/agent/UploadReportModal';
import MediaUploadModal from '@/components/agent/MediaUploadModal';
import FarmJourneyModal from '@/components/agent/FarmJourneyModal';
import VerificationQueueModal from '@/components/agent/VerificationQueueModal';
import ViewMatchModal from '@/components/agent/ViewMatchModal';
import ReviewMatchModal from '@/components/agent/ReviewMatchModal';
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
import { GHANA_REGIONS, GHANA_COMMUNITIES, getRegionKey } from '@/data/ghanaRegions';
import { Checkbox } from '@/components/ui/checkbox';

const MetricCardSkeleton = () => (
    <Card className="bg-gray-800/50 border-gray-700 rounded-none p-3 sm:p-6 shadow-lg animate-pulse">
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-none bg-gray-700" />
                <Skeleton className="h-4 w-24 bg-gray-700" />
            </div>
            <div className="flex-1 flex items-center">
                <Skeleton className="h-10 w-16 bg-gray-700" />
            </div>
            <div className="flex justify-end mt-4">
                <Skeleton className="h-3 w-12 bg-gray-700" />
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
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
    const [selectedFarmType, setSelectedFarmType] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [uploadReportModalOpen, setUploadReportModalOpen] = useState(false);
    const [uploadMediaModalOpen, setUploadMediaModalOpen] = useState(false);
    const [verificationQueueModalOpen, setVerificationQueueModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('personal');
    const [activeTab, setActiveTab] = useState<'farmers' | 'farms' | 'visits' | 'reports' | 'matches'>('farmers');
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
    const [selectedMatch, setSelectedMatch] = useState<any>(null);
    const [viewMatchModalOpen, setViewMatchModalOpen] = useState(false);
    const [reviewMatchModalOpen, setReviewMatchModalOpen] = useState(false);

    // Initial Settings from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const tabParam = params.get('tab');
        if (tabParam && ['farmers', 'farms', 'visits', 'reports'].includes(tabParam)) {
            setActiveTab(tabParam as 'farmers' | 'farms' | 'visits' | 'reports');
        }

        const searchParam = params.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
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
    const matchesRaw = summaryData?.matches || [];
    const pendingFarmers = summaryData?.pendingQueue || [];
    const visitLogs = Array.isArray(visitLogsData) ? visitLogsData : (visitLogsData?.data || []);
    const reports = Array.isArray(reportsData) ? reportsData : (reportsData?.data || []);

    const matches = useMemo(() => {
        const effectiveRegion = agent?.region || "Ashanti Region";
        const regSearch = (effectiveRegion || '').toLowerCase().replace(' region', '').trim();
        return matchesRaw.filter((m: any) => {
            const mReg = (m.region || '').toLowerCase().replace(' region', '').trim();
            return !regSearch || mReg === regSearch || mReg.includes(regSearch) || regSearch.includes(mReg);
        });
    }, [matchesRaw, agent?.region]);

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
        const matched = matches.length;
        return { total, verified, pending, active: activeCount, matched };
    }, [farmers, farms, matches, pendingFarmers]);

    const filteredFarmers = useMemo(() => {
        return farmers.map((f: any) => {
            let displayStatus = f.status;
            if (displayStatus === 'active') displayStatus = 'Completed';
            if (displayStatus === 'pending') displayStatus = 'Pending';
            return { ...f, displayStatus };
        }).filter((farmer: any) => {
            const searchValue = searchQuery.toLowerCase();
            const matchesSearch =
                farmer.name?.toLowerCase().includes(searchValue) ||
                (farmer.contact && farmer.contact.includes(searchQuery));
            
            const effectiveRegion = agent?.region || "Ashanti Region";
            // Normalizing for flexible regional matching (allows "Ashanti" to match "Ashanti Region")
            const regSearch = (effectiveRegion || '').toLowerCase().replace(' region', '').trim();
            const fReg = (farmer.region || '').toLowerCase().replace(' region', '').trim();
            const matchesRegion = !regSearch || fReg === regSearch || fReg.includes(regSearch) || regSearch.includes(fReg);

            const matchesDistrict = selectedDistrict === 'all' || farmer.district === selectedDistrict;
            const matchesCommunity = selectedCommunity === 'all' || farmer.community === selectedCommunity;
            const matchesFarmType = selectedFarmType === 'all' || farmer.farmType === selectedFarmType;
            const matchesCategory = selectedCategory === 'all' || true;
            const filterStatus = statusFilter || selectedStatus;

            const matchesStatus = filterStatus === 'all' || farmer.displayStatus === filterStatus;
            return matchesSearch && matchesRegion && matchesDistrict && matchesCommunity && matchesFarmType && matchesCategory && matchesStatus;
        });
    }, [farmers, searchQuery, selectedDistrict, selectedCommunity, selectedFarmType, selectedCategory, selectedStatus, statusFilter, agent?.region]);

    const filteredFarms = useMemo(() => {
        return farms.filter((farm: any) => {
            const searchValue = searchQuery.toLowerCase();
            const matchesSearch =
                farm.name?.toLowerCase().includes(searchValue) ||
                farm.farmer?.name?.toLowerCase().includes(searchValue);

            const matchesDistrict = selectedDistrict === 'all' || farm.farmer?.district === selectedDistrict;
            return matchesSearch && matchesDistrict;
        });
    }, [farms, searchQuery, selectedDistrict]);

    const filteredMatches = useMemo(() => {
        return matches.filter((match: any) => {
            const searchValue = searchQuery.toLowerCase();
            return (
                match.investor?.toLowerCase().includes(searchValue) ||
                match.farmer?.toLowerCase().includes(searchValue) ||
                match.status?.toLowerCase().includes(searchValue)
            );
        });
    }, [matches, searchQuery]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedDistrict('all');
        setSelectedCommunity('all');
        setSelectedFarmType('all');
        setSelectedCategory('all');
        setSelectedStatus('all');
        setStatusFilter(null);
    };

    const handleCardClick = (id: string, status: string | null) => {
        if (id === 'active-farms') {
            setActiveTab('farms');
            setStatusFilter(null);
            return;
        }

        if (id === 'matched') {
            setActiveTab('matches');
            setStatusFilter(null);
            return;
        }

        if (status === 'Pending') {
            setVerificationQueueModalOpen(true);
        } else {
            setActiveTab('farmers');
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
                return darkMode ? 'bg-[#7ede56]/20 text-[#7ede56] border-0' : 'bg-[#7ede56]/10 text-[#7ede56]';
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
            Swal.fire({
                icon: 'error',
                title: 'Data Load Error',
                text: 'Failed to load full farmer data. Using available cached data.',
                confirmButtonColor: '#065f46'
            });
            // Fallback to available data if fetch fails
            setSelectedFarmer(farmer);
            setEditModalOpen(true);
        }
    };

    const handleViewMatch = (match: any) => {
        setSelectedMatch(match);
        setViewMatchModalOpen(true);
    };

    const handleReviewMatch = (match: any) => {
        setSelectedMatch(match);
        setReviewMatchModalOpen(true);
    };

    const handleApproveMatch = async (matchId: string) => {
        try {
            await api.post(`/matches/${matchId}/approve`);
            refetchSummary();
            playSuccessSound();
            await Swal.fire({
                icon: 'success',
                title: 'Match Approved!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                            Partnership agreement verified successfully
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#065f46',
                timer: 2000,
                timerProgressBar: true
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: 'Failed to approve the match Request.',
                confirmButtonColor: '#065f46'
            });
        }
    };

    const handleRejectMatch = async (matchId: string) => {
        try {
            await api.post(`/matches/${matchId}/reject`);
            refetchSummary();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: 'Failed to reject the match request.',
                confirmButtonColor: '#065f46'
            });
        }
    };

    const getDisplayId = (farmer: any) => {
        if (farmer.id) return farmer.id;
        const baseId = farmer.ghanaCardNumber || String(farmer._id).replace(/\D/g, '').padEnd(7, '0').slice(0, 7);
        return `LYG-${baseId}`;
    };

    const handleVerifyFarmer = async (farmer: any) => {
        const result = await Swal.fire({
            title: 'Verify Farmer?',
            text: `Verify farmer: ${farmer.name}? This will change their status from Pending to Verified.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Verify',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#065f46',
            cancelButtonColor: '#6b7280'
        });

        if (result.isConfirmed) {
            playSuccessSound();
            Swal.fire({
                icon: 'success',
                title: 'Farmer Verified',
                text: `Farmer ${farmer.name} has been verified successfully!`,
                confirmButtonColor: '#065f46'
            });
        }
    };

    const handleUploadReport = (farmer: any) => {
        setSelectedFarmer(farmer);
        setUploadMediaModalOpen(true);
    };

    const handleLogVisit = (farmer?: any) => {
        setVisitImages([]);
        if (farmer) {
            setVisitForm({
                farmerId: farmer._id,
                farmerName: farmer.name,
                lyncId: getDisplayId(farmer),
                phone: farmer.phone || '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                hoursSpent: '1',
                purpose: '',
                otherPurpose: '',
                notes: '',
                stage: '',
                observations: '',
                recommendations: '',
                photos: [],
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
                stage: '',
                observations: '',
                recommendations: '',
                photos: [],
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
            stage: visit.stage || '',
            observations: visit.observations || '',
            recommendations: visit.recommendations || '',
            photos: visit.photos || [],
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
            Swal.fire({
                icon: 'info',
                title: 'No Data',
                text: 'There are no visit logs available for export.',
                confirmButtonColor: '#065f46'
            });
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
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const logoUrl = '/lovable-uploads/favicorn.jpeg';

            // Professional Geometric Header
            doc.setFillColor(0, 47, 55); // Brand Teal
            doc.triangle(0, 0, 80, 0, 0, 45, 'F');
            doc.setFillColor(126, 222, 86); // Brand Green
            doc.triangle(30, 0, 60, 0, 45, 15, 'F');
            doc.setFillColor(0, 47, 55);
            doc.triangle(pageWidth, 0, pageWidth - 40, 0, pageWidth, 25, 'F');

            // Centered Title Section
            doc.setTextColor(0, 47, 55);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('FIELD VISIT LOGS', pageWidth / 2, 55, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100);
            doc.text(`REPORTING PERIOD: ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, 63, { align: 'center' });
            doc.text(`AUTHORIZED BY: ${(agent?.name || 'AgriLync Agent').toUpperCase()}`, pageWidth / 2, 68, { align: 'center' });

            // Branding Line
            doc.setDrawColor(126, 222, 86);
            doc.setLineWidth(0.5);
            doc.line(pageWidth / 2 - 30, 72, pageWidth / 2 + 30, 72);

            const tableColumn = ["Date", "Time", "Farmer", "Purpose", "Observations", "Challenges", "Status"];
            const tableRows = dataToExport.map((visit: any) => [
                new Date(visit.date).toLocaleDateString(),
                visit.time || 'N/A',
                visit.farmer?.name || visit.farmerName,
                visit.purpose,
                visit.notes || visit.observations || 'N/A',
                visit.challenges || 'None',
                visit.status
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 85,
                theme: 'grid',
                styles: { fontSize: 7, font: 'helvetica', overflow: 'linebreak' },
                headStyles: { fillColor: [0, 47, 55], halign: 'center' },
                columnStyles: {
                    4: { cellWidth: 40 }, // Observations
                    5: { cellWidth: 35 }  // Challenges
                },
                alternateRowStyles: { fillColor: [250, 252, 250] },
                didDrawPage: (data) => {
                    // Footer on every page
                    doc.setDrawColor(240);
                    doc.setLineWidth(0.1);
                    doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);

                    // Logo in footer with white background to handle transparency
                    try {
                        doc.setFillColor(255, 255, 255);
                        doc.rect(15, pageHeight - 22, 10, 10, 'F');
                        doc.addImage(logoUrl, 'PNG', 15, pageHeight - 22, 10, 10);
                    } catch (e) {}

                    doc.setFontSize(7);
                    doc.setTextColor(150);
                    doc.setFont('helvetica', 'bold');
                    doc.text('AGRILYNC NEXUS', 28, pageHeight - 18);
                    
                    doc.setFont('helvetica', 'normal');
                    doc.text(`Report for: ${agent?.name || 'Agent'}  |  Exported: ${new Date().toLocaleString()}`, 28, pageHeight - 13);
                    
                    doc.setFont('helvetica', 'bold');
                    doc.text(`Page ${doc.internal.pages.length - 1}`, pageWidth - 15, pageHeight - 15, { align: 'right' });
                    doc.setFont('helvetica', 'normal');
                    doc.text('OFFICIAL FIELD LOG RECORD', pageWidth - 15, pageHeight - 11, { align: 'right' });
                }
            });

            doc.save(`AgriLync_VisitLogs_${new Date().toISOString().split('T')[0]}.pdf`);
            await Swal.fire({
                icon: 'success',
                title: 'Export Successful!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                            PDF report (${dataToExport.length} records) exported successfully
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#065f46',
                timer: 2000,
                timerProgressBar: true
            });
        } catch (err) {
            console.error('Export error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Export Failed',
                text: 'Could not generate the PDF report.',
                confirmButtonColor: '#065f46'
            });
        } finally {
            setIsExporting(null);
        }
    };

    const handleExportExcel = async () => {
        if (visitLogs.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No Data',
                text: 'There are no visit logs available for export.',
                confirmButtonColor: '#065f46'
            });
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
                        <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                            Excel spreadsheet (${dataToExport.length} records) exported successfully
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#065f46',
                timer: 2000,
                timerProgressBar: true
            });
        } catch (err) {
            console.error('Export error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Export Failed',
                text: 'Could not generate the Excel spreadsheet.',
                confirmButtonColor: '#065f46'
            });
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
                        <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                            ${visitForm.isEditing ? 'Field visit updated successfully!' : 'Field visit logged successfully!'}
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#065f46',
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
                stage: '',
                observations: '',
                recommendations: '',
                photos: [],
                challenges: '',
                status: 'Completed',
                isEditing: false,
                editingId: ''
            });
            setVisitImages([]);
        },
        onError: (err) => {
            console.error('Error saving visit:', err);
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: visitForm.isEditing ? 'Failed to update field visit record.' : 'Failed to log the new field visit.',
                confirmButtonColor: '#065f46'
            });
        }
    });

    // const isSaving = visitMutation.isPending; // Removed to avoid conflict with state

    const handleSubmitVisit = async () => {
        const finalPurpose = visitForm.purpose === 'Other' ? visitForm.otherPurpose : visitForm.purpose;

        if (!visitForm.farmerId || !finalPurpose || !visitForm.notes) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Please ensure all required fields are filled correctly.',
                confirmButtonColor: '#065f46'
            });
            return;
        }

        const visitData = {
            farmerId: visitForm.farmerId,
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
            title="Manage Farm"
        >
            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
                    {[
                        { id: 'total-farmers', title: 'Total Farmers', value: metrics.total, icon: Users, color: 'bg-emerald-800', status: null, subtext: 'Lifetime' },
                        { id: 'completed', title: 'Completed', value: metrics.verified, icon: CheckCircle, color: 'bg-blue-600', status: 'Completed', subtext: 'Verified' },
                        { id: 'queue', title: 'Verification Queue', value: metrics.pending, icon: Clock, color: 'bg-emerald-600', status: 'Pending', subtext: 'In Progress' },
                        { id: 'active-farms', title: 'Active Farms', value: metrics.active, icon: TrendingUp, color: 'bg-indigo-600', status: 'In Progress', subtext: 'On-going' },
                        { id: 'matched', title: 'Matched', value: metrics.matched, icon: Coins, color: 'bg-emerald-600', status: 'Matched', subtext: 'Investor Matches' }
                    ].map((item, idx) => (
                        !isLoaded ? (
                            <MetricCardSkeleton key={`skeleton-${idx}`} />
                        ) : (
                            <Card
                                key={item.id}
                                className={`${item.title === 'Total Farmers' ? item.color : 'bg-white'} rounded-none p-3 sm:p-6 shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden h-28 sm:h-36 flex flex-col justify-between group border-none cursor-pointer ${(statusFilter === item.status && item.status !== null) || (statusFilter === null && item.status === null && activeTab === 'farmers') || (item.id === 'active-farms' && activeTab === 'farms') || (item.id === 'matched' && activeTab === 'matches') ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
                                onClick={() => handleCardClick(item.id, item.status)}
                            >
                                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <item.icon className={`h-20 w-20 sm:h-24 sm:w-24 ${item.title === 'Total Farmers' ? 'text-white' : item.color.replace('bg-', 'text-')} -rotate-12`} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className={`p-1.5 sm:p-2 ${item.title === 'Total Farmers' ? 'bg-white/10' : item.color.replace('bg-', 'bg-').concat('/10')} rounded-lg`}>
                                        <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.title === 'Total Farmers' ? 'text-white' : item.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <span className={`text-[8px] sm:text-[10px] font-black ${item.title === 'Total Farmers' ? 'text-white/40' : 'text-gray-400'} uppercase tracking-widest`}>STATUS</span>
                                </div>

                                <div>
                                    <p className={`text-[8px] sm:text-[10px] font-black ${item.title === 'Total Farmers' ? 'text-white/60' : 'text-gray-500'} uppercase tracking-widest mb-0.5 sm:mb-1`}>{item.title}</p>
                                    <div className="flex items-baseline gap-1 sm:gap-2">
                                        <h3 className={`text-xl sm:text-4xl font-black ${item.title === 'Total Farmers' ? 'text-white' : 'text-gray-900'} leading-none`}>
                                            <CountUp end={Number(item.value)} duration={1000} />
                                        </h3>
                                        <span className={`text-[8px] sm:text-[10px] font-bold ${item.title === 'Total Farmers' ? 'text-white/80' : 'text-gray-500'}`}>{item.subtext}</span>
                                    </div>
                                </div>
                            </Card>
                        )
                    ))}
                </div>


                {/* Tabs for Farmers Directory and Field Visit Logs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'farmers' | 'farms' | 'visits' | 'reports' | 'matches')} className="w-full">
                    <TabsList className={`flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide bg-transparent p-0 h-auto gap-2 sm:gap-4 mb-4 sm:mb-8 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <TabsTrigger
                            value="farmers"
                            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'farmers'
                                ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Users className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Grower Directory</span>
                            <span className="sm:hidden">Growers</span>
                            <span className="ml-1">({filteredFarmers.length})</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="farms"
                            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'farms'
                                ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <TrendingUp className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Active Farms</span>
                            <span className="sm:hidden">Farms</span>
                            <span className="ml-1">({farms.length})</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="visits"
                            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'visits'
                                ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ClipboardList className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Field Visits</span>
                            <span className="sm:hidden">Visits</span>
                            <span className="ml-1">({visitLogs.length})</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="reports"
                            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'reports'
                                ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                            <span>Reports</span>
                            <span className="ml-1">({reports.length})</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="matches"
                            className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all ${activeTab === 'matches'
                                ? 'border-[#065f46] text-[#065f46] bg-[#065f46]/5'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Coins className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Investor Matches</span>
                            <span className="sm:hidden">Matches</span>
                            <span className="ml-1">({matches.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Farmers Directory Tab */}
                    <TabsContent value="farmers" className="space-y-4">
                        {/* Improved Filter Bar - Modern Glassmorphism */}
                        <Card className={`${sectionCardClass} border-0 shadow-lg overflow-hidden`}>
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                                    <div className="relative flex-1 group">
                                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${darkMode ? 'text-gray-500 group-focus-within:text-[#065f46]' : 'text-gray-400 group-focus-within:text-[#065f46]'}`} />
                                        <Input
                                            placeholder="Search by name, phone or Lync ID..."
                                            className={`pl-10 h-11 ${inputBaseClasses} ${darkMode ? 'bg-white/5 border-white/10 focus:ring-emerald-500/50' : 'bg-gray-50'}`}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); setSelectedCommunity('all'); }}>
                                            <SelectTrigger className={`w-full sm:w-40 h-11 ${inputBaseClasses} ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50'}`}>
                                                <SelectValue placeholder="District" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                                <SelectItem value="all">All Districts</SelectItem>
                                                {GHANA_REGIONS[getRegionKey(agent?.region)]?.map(d => (
                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                                            <SelectTrigger className={`w-full sm:w-40 h-11 ${inputBaseClasses} ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50'}`}>
                                                <SelectValue placeholder="Community" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                                <SelectItem value="all">All Communities</SelectItem>
                                                {selectedDistrict !== 'all' && GHANA_COMMUNITIES[selectedDistrict]?.map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
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
                                            <Button onClick={() => setIsAddFarmerModalOpen(true)} className="h-11 flex-1 sm:flex-none px-6 bg-[#065f46] hover:bg-[#065f46]/90 text-white shadow-lg shadow-emerald-500/20 border-none">
                                                <Plus className="h-4 w-4 mr-2" />Add Farmer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {(statusFilter || searchQuery || selectedStatus !== 'all' || selectedDistrict !== 'all' || selectedCommunity !== 'all' || selectedFarmType !== 'all') && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Active Filters:</span>
                                        {statusFilter && <Badge className="bg-emerald-500/10 text-emerald-500 border-0 hover:bg-emerald-500/20">{statusFilter}</Badge>}
                                        {selectedDistrict !== 'all' && <Badge variant="outline" className="border-gray-500/30 text-gray-500">{selectedDistrict}</Badge>}
                                        {selectedCommunity !== 'all' && <Badge variant="outline" className="border-gray-500/30 text-gray-500">{selectedCommunity}</Badge>}
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
                                <div className={`p-1.5 rounded-md ${darkMode ? 'bg-[#7ede56]/20 text-[#7ede56]' : 'bg-[#7ede56]/10 text-[#7ede56]'}`}>
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
                                    <FileText className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Field Audit</span>
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
                                        <TableHeader className="sticky top-0 z-20 bg-[#065f46] shadow-md">
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">#</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Farmer Details</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Phone Number</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Location</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Farm Info</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Status</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Last Visit</TableHead>
                                                <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Actions</TableHead>
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
                                                                {farmer.profilePicture || farmer.avatar || farmer.photo || farmer.picture || farmer.image || farmer.profile_picture ? (
                                                                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-[#124b53] transition-transform group-hover:scale-110 group-hover:rotate-3">
                                                                        <img src={farmer.profilePicture || farmer.avatar || farmer.photo || farmer.picture || farmer.image || farmer.profile_picture} alt={farmer.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                ) : (
                                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${farmer.displayStatus === 'Completed' ? 'bg-emerald-500' : farmer.displayStatus === 'Pending' ? 'bg-amber-500' : 'bg-indigo-500'}`}>
                                                                        {farmer.name?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()}
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
                                                                <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{getDisplayId(farmer)}</p>
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
                                                        <div className="flex items-center justify-end gap-2 flex-wrap min-w-[320px]">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleViewFarmer(farmer)}
                                                                className={`h-8 px-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">View</span>
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleEditFarmer(farmer)}
                                                                className={`h-8 px-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setSelectedFarmer(farmer);
                                                                    setJourneyModalOpen(true);
                                                                }}
                                                                className={`h-8 px-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                                title="Track Farm Journey"
                                                            >
                                                                <Leaf className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Track</span>
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setSelectedFarmer(farmer);
                                                                    setUploadReportModalOpen(true);
                                                                }}
                                                                className={`h-8 px-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                                                title="Perform Field Audit"
                                                            >
                                                                <FileText className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Report</span>
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
                                <Button onClick={() => handleLogVisit()} className="bg-[#065f46] hover:bg-[#065f46]/90 text-white shadow-lg shadow-emerald-500/20 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm border-none">
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
                                                                <div className="flex flex-wrap items-center gap-2 opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className={`h-9 md:h-8 px-3 rounded-lg flex items-center gap-2 transition-all ${darkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300' : 'bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-600'}`}
                                                                        onClick={(e: React.MouseEvent) => {
                                                                            e.stopPropagation();
                                                                            handleEditVisit(visit);
                                                                        }}
                                                                        title="Edit this visit entry"
                                                                    >
                                                                        <Edit className="w-3.5 h-3.5 text-gray-400" />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className={`h-9 md:h-8 px-3 rounded-lg flex items-center gap-2 transition-all ${darkMode ? 'bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600'}`}
                                                                        onClick={(e: React.MouseEvent) => {
                                                                            e.stopPropagation();
                                                                            // Logic for completing/marking done if needed
                                                                        }}
                                                                        title="Mark this visit as verified"
                                                                    >
                                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest">Mark Complete</span>
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
                                            <Button onClick={() => handleLogVisit()} className="mt-6 bg-[#065f46] border-none">
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
                                <div className="hidden sm:block">
                                    <CardTitle className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Submitted Field Reports
                                    </CardTitle>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        View and download documents for your field activities.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetchReports()}
                                        disabled={loadingReports}
                                        className={`h-9 border-none bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-bold px-4 rounded-xl transition-all flex items-center gap-2`}
                                    >
                                        {loadingReports ? <Clock className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
                                        <span className="hidden sm:inline">Refresh List</span>
                                    </Button>
                                    <Button 
                                        onClick={() => {
                                            setSelectedFarmer(null);
                                            setUploadReportModalOpen(true);
                                        }}
                                        className="h-9 bg-[#065f46] hover:bg-[#065f46]/90 text-white font-black text-[10px] uppercase tracking-widest px-5 rounded-xl flex items-center gap-2 shadow-xl shadow-emerald-500/20 border-none transition-transform active:scale-95"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Log Report</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 sm:p-6 sm:pt-0">
                                <div className="overflow-x-auto relative custom-scrollbar">
                                    <Table className="min-w-[800px] lg:min-w-full">
                                        <TableHeader className="sticky top-0 z-20 bg-[#065f46] shadow-md">
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Farmer</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 text-center">Type</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Date</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Notes Summary</TableHead>
                                                <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Actions</TableHead>
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
                                                            <div className="flex justify-end gap-3 px-4">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => exportToPDF({
                                                                        ...report,
                                                                        farmerName: report.farmer?.name || 'Farmer',
                                                                        agentName: agent?.name || 'AgriLync Agent',
                                                                        agentId: agent?.agentId || 'N/A'
                                                                    })}
                                                                    className={`h-8 px-3 text-[10px] font-black uppercase tracking-widest border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all rounded-lg gap-2`}
                                                                >
                                                                    <FileDown className="h-3.5 w-3.5" />
                                                                    <span>PDF</span>
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => exportToWord({
                                                                        ...report,
                                                                        farmerName: report.farmer?.name || 'Farmer',
                                                                        agentName: agent?.name || 'AgriLync Agent',
                                                                        agentId: agent?.agentId || 'N/A'
                                                                    })}
                                                                    className={`h-8 px-3 text-[10px] font-black uppercase tracking-widest border-blue-500/20 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600 transition-all rounded-lg gap-2`}
                                                                >
                                                                    <FileText className="h-3.5 w-3.5" />
                                                                    <span>Word</span>
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

                    {/* Farms Tab */}
                    <TabsContent value="farms" className="space-y-4">
                        <Card className={`${sectionCardClass} border-0 shadow-xl overflow-hidden`}>
                            <div className="overflow-hidden">
                                <div className="hidden md:flex p-6 border-b border-white/5 items-center justify-between bg-indigo-500/5">
                                    <div>
                                        <h3 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Active Field Missions</h3>
                                        <p className={`text-xs mt-1 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Monitoring {filteredFarms.length} ongoing agricultural operations
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={`${darkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'} border px-3 py-1`}>
                                        <TrendingUp className="w-3 h-3 mr-2" />
                                        Operational Oversight
                                    </Badge>
                                </div>

                                <div className="overflow-auto max-h-[65vh]">
                                    <Table className={`border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                        <TableHeader className="sticky top-0 z-20 bg-[#065f46] shadow-md">
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 border-r border-white/10">Farm Information</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 text-center border-r border-white/10">Health Status</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 border-r border-white/10">Next Visit</TableHead>
                                                <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredFarms.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-64 text-center">
                                                        <div className="flex flex-col items-center justify-center space-y-3">
                                                            <div className="h-16 w-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-2">
                                                                <Sprout className="h-8 w-8 text-gray-200" />
                                                            </div>
                                                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No active farms discovered</p>
                                                            <p className="text-[10px] text-gray-400">Registered farms with ongoing missions will appear here.</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredFarms.map((farm: any) => (
                                                    <TableRow key={farm._id} className={`${darkMode ? 'border-white/5 hover:bg-emerald-500/5' : 'hover:bg-gray-50'} transition-all duration-300 group ring-inset`}>
                                                        <TableCell className={`py-4 px-6 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-14 w-14 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-lg border-2 border-white dark:border-white/10 group-hover:scale-110 transition-transform">
                                                                    <img src={farm.farmer?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${farm.name}`} alt={farm.name} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-black tracking-tight ${darkMode ? 'text-gray-100' : 'text-[#002f37]'}`}>{farm.name}</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{farm.farmer?.name || 'Assigned Grower'}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={`py-4 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                            <div className="flex flex-col items-center gap-1.5 px-4 w-32 mx-auto">
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className={`text-xs font-black ${darkMode ? 'text-[#7ede56]' : 'text-[#065f46]'}`}>{farm.health || 0}%</span>
                                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Health</span>
                                                                </div>
                                                                <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${darkMode ? 'bg-[#7ede56]' : 'bg-[#065f46]'}`} style={{ width: `${farm.health || 0}%` }}></div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={`py-4 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-3.5 h-3.5 text-[#065f46]" />
                                                                <div className="flex flex-col">
                                                                    <p className={`text-xs font-black ${darkMode ? 'text-gray-200' : 'text-[#002f37]'}`}>{farm.nextVisit || 'Awaiting Schedule'}</p>
                                                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Scheduled</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right py-4 px-6">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className={`h-9 w-9 rounded-xl ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-400 hover:bg-gray-100'}`}
                                                                    onClick={() => handleViewFarmer(farm.farmer)}
                                                                >
                                                                    <Users className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    className="bg-[#065f46] hover:bg-indigo-900 text-white h-9 text-[10px] font-black rounded-xl px-5 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest border-none"
                                                                    onClick={() => handleLogVisit(farm.farmer)}
                                                                >
                                                                    Start Visit
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Matches Tab */}
                    <TabsContent value="matches" className="space-y-4">
                        <Card className={`${sectionCardClass} border-0 shadow-xl overflow-hidden`}>
                            <div className="overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-emerald-500/5">
                                    <div>
                                        <h3 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Partnership Opportunities</h3>
                                        <p className={`text-xs mt-1 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Managing {filteredMatches.length} investor-grower relationships
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={`${darkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'} border px-3 py-1`}>
                                        <div className="w-2 h-2 rounded-full bg-[#7ede56] mr-2 animate-pulse" />
                                        Matching Engine Active
                                    </Badge>
                                </div>

                                <div className="overflow-x-auto relative custom-scrollbar">
                                    <Table className={`border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                        <TableHeader className="bg-[#065f46] shadow-md">
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 border-r border-white/10">Match Date</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 border-r border-white/10">Investor</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 border-r border-white/10">Grower</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 text-center border-r border-white/10">Value</TableHead>
                                                <TableHead className="text-white font-black text-[10px] uppercase tracking-widest py-4 px-6 border-r border-white/10">Status</TableHead>
                                                <TableHead className="text-right text-white font-black text-[10px] uppercase tracking-widest py-4 px-6">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredMatches.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-48 text-center">
                                                        <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                                                <Coins className="h-6 w-6 text-gray-300" />
                                                            </div>
                                                            <p className="font-bold text-sm uppercase tracking-widest">No matching activities found</p>
                                                            <p className="text-xs">Try adjusting your search query</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredMatches.map((match: any) => (
                                                    <TableRow key={match.id || match._id} className={`${darkMode ? 'border-white/5 hover:bg-emerald-500/5' : 'hover:bg-gray-50'} border-b`}>
                                                        <TableCell className={`py-4 px-6 font-medium text-[11px] border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>{match.matchDate}</TableCell>
                                                        <TableCell className={`py-4 px-6 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                                                    <User className="h-4 w-4" />
                                                                </div>
                                                                <span className="font-bold text-[12px]">{match.investor}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={`py-4 px-6 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                                    <Sprout className="h-4 w-4" />
                                                                </div>
                                                                <span className="font-bold text-[12px]">{match.farmer}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className={`py-4 text-center border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                            <span className="font-black text-[13px] text-emerald-600">{match.value}</span>
                                                        </TableCell>
                                                        <TableCell className={`py-4 px-6 border-r ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                                                            <Badge className={
                                                                match.status === 'Under Review' ? (darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700') :
                                                                match.status === 'Pending Funding' ? (darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700') :
                                                                (darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                                                            }>
                                                                {match.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right py-4 px-6">
                                                            <div className="flex justify-end gap-2">
                                                                {match.status === 'Under Review' ? (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleReviewMatch(match)}
                                                                        className="h-8 px-3 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 text-[10px] font-black uppercase tracking-widest"
                                                                    >
                                                                        Review Match
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleViewMatch(match)}
                                                                        className="h-8 w-8 rounded-lg hover:bg-blue-500/10 hover:text-blue-600 transition-all shadow-sm"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs >
            </div >
            
            <ViewMatchModal
                open={viewMatchModalOpen}
                onOpenChange={setViewMatchModalOpen}
                match={selectedMatch}
            />

            <ReviewMatchModal
                open={reviewMatchModalOpen}
                onOpenChange={setReviewMatchModalOpen}
                match={selectedMatch}
                onApprove={handleApproveMatch}
                onReject={handleRejectMatch}
            />

            <AddFarmerModal open={isAddFarmerModalOpen} onOpenChange={setIsAddFarmerModalOpen} onSuccess={fetchData} />
            <ViewFarmerModal 
                open={viewModalOpen} 
                onOpenChange={setViewModalOpen} 
                farmer={selectedFarmer} 
                onNewVisit={(farmer) => {
                    handleLogVisit(farmer);
                }}
                onUploadMedia={(farmer) => {
                    handleUploadReport(farmer);
                }}
            />
            <AddFarmerModal open={editModalOpen} onOpenChange={setEditModalOpen} farmer={selectedFarmer} isEditMode={true} onSuccess={fetchData} />
            <UploadReportModal open={uploadReportModalOpen} onOpenChange={setUploadReportModalOpen} farmer={selectedFarmer} farmers={filteredFarmers} onUpload={() => refetchReports()} />
            <MediaUploadModal open={uploadMediaModalOpen} onOpenChange={setUploadMediaModalOpen} farmer={selectedFarmer} onSuccess={fetchData} />
            <FarmJourneyModal open={journeyModalOpen} onOpenChange={setJourneyModalOpen} farmer={selectedFarmer} />

            {/* Field Visit Modal - Premium Style */}
            <Dialog open={fieldVisitModalOpen} onOpenChange={setFieldVisitModalOpen}>
                <DialogContent className={`max-w-2xl p-0 overflow-hidden border-0 ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
                    <div className="bg-[#065f46] p-6 text-white relative">
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
                                                lyncId: getDisplayId(farmer),
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




