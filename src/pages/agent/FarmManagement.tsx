import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import AddFarmerModal from '@/components/agent/AddFarmerModal';
import ViewFarmerModal from '@/components/agent/ViewFarmerModal';
import UploadReportModal from '@/components/agent/UploadReportModal';
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
    FileText,
    ClipboardList,
    Phone,
    Timer,
    Camera,
    Download,
    FileSpreadsheet,
    Loader2
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const FarmManagement: React.FC = () => {
    const { darkMode } = useDarkMode();
    const { agent } = useAuth();
    const [farmers, setFarmers] = useState<any[]>([]);
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
    const [pendingFarmers, setPendingFarmers] = useState<any[]>([]);
    const [verificationQueueModalOpen, setVerificationQueueModalOpen] = useState(false);

    // Field visit logging state
    const [activeTab, setActiveTab] = useState<'farmers' | 'visits'>('farmers');
    const [fieldVisitModalOpen, setFieldVisitModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [farmersRes, farmsRes, pendingRes] = await Promise.all([
                api.get('/farmers'),
                api.get('/farms'),
                api.get('/farmers/queue/pending')
            ]);
            setFarmers(farmersRes.data);
            setFarms(farmsRes.data);
            setPendingFarmers(pendingRes.data);
            setIsLoaded(true);
        } catch (err) {
            toast.error('Failed to load farm management data');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const [visitLogs, setVisitLogs] = useState<any[]>([]);
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
        notes: '',
        challenges: '',
        status: 'Completed',
        isEditing: false,
        editingId: ''
    });
    const [visitImages, setVisitImages] = useState<string[]>([]);
    const [selectedVisit, setSelectedVisit] = useState<any>(null);
    const [visitDetailModalOpen, setVisitDetailModalOpen] = useState(false);

    const metrics = useMemo(() => {
        const total = farmers.length;
        const verified = farmers.filter(f => f.status === 'active').length;
        const pending = pendingFarmers.length; // From verification queue
        const activeCount = farms.filter(f => f.status === 'verified').length;
        const matched = farmers.filter(f => f.investmentStatus === 'Matched').length;
        return { total, verified, pending, active: activeCount, matched };
    }, [farmers, farms, pendingFarmers]);

    const filteredFarmers = useMemo(() => {
        return farmers.map(f => {
            let displayStatus = f.status;
            if (displayStatus === 'active') displayStatus = 'Completed';
            if (displayStatus === 'pending') displayStatus = 'Pending';
            return { ...f, displayStatus };
        }).filter(farmer => {
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

    const handleViewFarmer = (farmer: any) => {
        setSelectedFarmer(farmer);
        setViewModalOpen(true);
    };

    const handleEditFarmer = (farmer: any) => {
        setSelectedFarmer(farmer);
        setEditModalOpen(true);
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
        setVisitForm({
            farmerId: visit.farmer?._id || visit.farmerId,
            farmerName: visit.farmer?.name || visit.farmerName,
            lyncId: visit.farmer?.lyncId || visit.lyncId,
            phone: visit.farmer?.contact || visit.phone,
            date: new Date(visit.date).toISOString().split('T')[0],
            time: visit.time,
            hoursSpent: visit.hoursSpent.toString(),
            purpose: visit.purpose,
            notes: visit.notes,
            challenges: visit.challenges || '',
            status: visit.status || 'Completed',
            isEditing: true,
            editingId: visit._id
        });
        setVisitImages(visit.visitImages || []);
        setFieldVisitModalOpen(true);
    };

    // Fetch field visits
    const fetchVisits = async () => {
        try {
            const res = await api.get('/field-visits');
            setVisitLogs(res.data);
        } catch (err) {
            console.error('Error fetching field visits:', err);
        }
    };

    const handleExportPDF = async () => {
        if (visitLogs.length === 0) {
            toast.error('No visit logs to export');
            return;
        }

        const dataToExport = selectedVisits.size > 0
            ? visitLogs.filter(v => selectedVisits.has(v._id || v.id))
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
            const tableRows = dataToExport.map(visit => [
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
            toast.success(`PDF report (${dataToExport.length} records) exported successfully`);
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
            ? visitLogs.filter(v => selectedVisits.has(v._id || v.id))
            : visitLogs;

        setIsExporting('excel');
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const exportData = dataToExport.map(visit => ({
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
            toast.success(`Excel spreadsheet (${dataToExport.length} records) exported successfully`);
        } catch (err) {
            console.error('Export error:', err);
            toast.error('Failed to export Excel');
        } finally {
            setIsExporting(null);
        }
    };

    React.useEffect(() => {
        if (isLoaded) {
            fetchVisits();
        }
    }, [isLoaded]);

    const handleSubmitVisit = async () => {
        if (!visitForm.farmerId || !visitForm.purpose || !visitForm.notes) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const visitData = {
                farmerId: visitForm.farmerId,
                date: visitForm.date,
                time: visitForm.time,
                hoursSpent: parseFloat(visitForm.hoursSpent),
                purpose: visitForm.purpose,
                notes: visitForm.notes,
                visitImages: visitImages,
                challenges: visitForm.challenges,
                status: visitForm.status
            };

            if (visitForm.isEditing) {
                await api.put(`/field-visits/${visitForm.editingId}`, visitData);
                toast.success('Field visit updated successfully!');
            } else {
                await api.post('/field-visits', visitData);
                toast.success('Field visit logged successfully!');
            }

            fetchVisits(); // Refresh the list
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
                notes: '',
                challenges: '',
                status: 'Completed',
                isEditing: false,
                editingId: ''
            });
            setVisitImages([]);
        } catch (err) {
            console.error('Error saving visit:', err);
            toast.error(visitForm.isEditing ? 'Failed to update field visit' : 'Failed to log field visit');
        }
    };

    const sectionCardClass = darkMode
        ? 'border border-[#124b53] bg-[#0b2528] text-gray-100 shadow-lg'
        : 'border-none bg-white text-gray-900 shadow-sm';

    const inputBaseClasses = darkMode
        ? 'bg-[#10363d] border-[#1b5b65] text-gray-100 placeholder:text-gray-400'
        : '';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

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
                        <Card
                            key={item.label}
                            className={`${item.color} border-none rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-700 relative overflow-hidden ${(statusFilter === item.status && item.status !== null) || (statusFilter === null && item.status === null) ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
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
                                    <p className="text-2xl sm:text-4xl font-bold text-white">{item.value}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Tabs for Farmers Directory and Field Visit Logs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'farmers' | 'visits')} className="w-full">
                    <TabsList className={`grid w-full grid-cols-2 mb-4 ${darkMode ? 'bg-[#0b2528]' : 'bg-gray-100'}`}>
                        <TabsTrigger
                            value="farmers"
                            className={`${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white'}`}
                        >
                            <Users className="h-4 w-4 mr-2" />
                            Farmers Directory ({filteredFarmers.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="visits"
                            className={`${darkMode ? 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white' : 'data-[state=active]:bg-[#1db954] data-[state=active]:text-white'}`}
                        >
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Field Visit Logs ({visitLogs.length})
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

                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-emerald-600 dark:bg-emerald-700">
                                            <TableRow className="border-0 hover:bg-transparent">
                                                <TableHead className="w-12 text-center text-white font-bold h-12">#</TableHead>
                                                <TableHead className="text-white font-bold h-12">Farmer Details</TableHead>
                                                <TableHead className="text-white font-bold h-12">Location</TableHead>
                                                <TableHead className="text-white font-bold h-12">Farm Info</TableHead>
                                                <TableHead className="text-white font-bold h-12">Status</TableHead>
                                                <TableHead className="text-white font-bold h-12">Last Visit</TableHead>
                                                <TableHead className="text-right text-white font-bold h-12 pr-6">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredFarmers.map((farmer, index) => (
                                                <TableRow
                                                    key={farmer._id}
                                                    className={`group transition-all duration-300 border-b ${darkMode ? 'border-white/5 hover:bg-emerald-500/5' : 'hover:bg-gray-50'} ${index % 2 === 0 ? (darkMode ? 'bg-transparent' : 'bg-white') : (darkMode ? 'bg-white/2' : 'bg-gray-50/30')}`}
                                                >
                                                    <TableCell className="text-center font-mono text-xs text-gray-500">
                                                        {(index + 1).toString().padStart(2, '0')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${farmer.displayStatus === 'Completed' ? 'bg-emerald-500' : farmer.displayStatus === 'Pending' ? 'bg-amber-500' : 'bg-indigo-500'}`}>
                                                                    {farmer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                                                </div>
                                                                {farmer.displayStatus === 'Completed' && (
                                                                    <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5 shadow-sm">
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
                                                                {farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleViewFarmer(farmer)}
                                                                className={`h-8 w-8 rounded-lg ${darkMode ? 'hover:bg-emerald-500/20 hover:text-emerald-400' : 'hover:bg-emerald-50 hover:text-emerald-600'}`}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleEditFarmer(farmer)}
                                                                className={`h-8 w-8 rounded-lg ${darkMode ? 'hover:bg-amber-500/20 hover:text-amber-400' : 'hover:bg-amber-50 hover:text-amber-600'}`}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleUploadReport(farmer)}
                                                                className={`h-8 w-8 rounded-lg ${darkMode ? 'hover:bg-indigo-500/20 hover:text-indigo-400' : 'hover:bg-indigo-50 hover:text-indigo-600'}`}
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
                                            <Button variant="link" onClick={resetFilters} className="mt-4 text-[#1db954]">Reset all filters</Button>
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
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Field Activities</h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chronological record of recent farm inspections</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleExportPDF}
                                    disabled={isExporting !== null}
                                    className={`bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 border-0 h-10 px-4 transition-all active:scale-95`}
                                >
                                    {isExporting === 'pdf' ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    {selectedVisits.size > 0 ? `PDF (${selectedVisits.size})` : 'PDF All'}
                                </Button>
                                <Button
                                    onClick={handleExportExcel}
                                    disabled={isExporting !== null}
                                    className={`bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 border-0 h-10 px-4 transition-all active:scale-95`}
                                >
                                    {isExporting === 'excel' ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                                    )}
                                    {selectedVisits.size > 0 ? `Excel (${selectedVisits.size})` : 'Excel All'}
                                </Button>
                                <Button onClick={() => handleLogVisit()} className="bg-[#1db954] hover:bg-[#17a447] text-white shadow-lg shadow-emerald-500/20 h-10 px-4">
                                    <Plus className="h-4 w-4 mr-2" />
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
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedVisits(new Set(visitLogs.map(v => v._id || v.id)));
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

                        <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-500/50 before:to-transparent">
                            {visitLogs.map((visit, index) => (
                                <div key={visit.id} className="relative group">
                                    {/* Timeline Node */}
                                    <div className={`absolute -left-8 top-1.5 w-7 h-7 rounded-full border-4 flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${darkMode ? 'bg-[#002f37] border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white border-emerald-500 shadow-md'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${visit.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    </div>

                                    <Card
                                        className={`${sectionCardClass} border-0 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-emerald-500/5 group-hover:translate-x-1 cursor-pointer`}
                                    >
                                        <div className="p-5 flex items-start gap-4">
                                            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedVisits.has(visit._id || visit.id)}
                                                    onCheckedChange={(checked) => {
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
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-xs font-bold opacity-40 font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                #{visitLogs.length - index}
                                                            </span>
                                                            <Badge variant="outline" className={`text-[10px] font-mono px-2 py-0.5 ${darkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-gray-50 text-emerald-600'}`}>
                                                                {visit.farmer?.lyncId || visit.lyncId}
                                                            </Badge>
                                                            <h4 className={`font-bold transition-colors ${darkMode ? 'text-gray-100 group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-emerald-600'}`}>
                                                                {visit.farmer?.name || visit.farmerName}
                                                            </h4>
                                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                                                            <Badge className={`text-[10px] uppercase tracking-widest ${darkMode ? 'bg-emerald-500/10 text-emerald-400 border-0' : 'bg-emerald-50 text-emerald-700'}`}>
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

                                                        <div className="flex flex-wrap items-center gap-4 pt-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                                                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    {new Date(visit.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5 text-gray-500" />
                                                                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    {visit.time} ({visit.hoursSpent} hrs)
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Phone className="w-3.5 h-3.5 text-gray-500" />
                                                                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    {visit.farmer?.contact || visit.phone}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset ${visit.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' : 'bg-amber-500/10 text-amber-500 ring-amber-500/20'
                                                            }`}>
                                                            {visit.status}
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-lg hover:bg-white/10"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditVisit(visit);
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4 text-gray-400" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-lg hover:bg-emerald-500/20"
                                                                onClick={(e) => {
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
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <AddFarmerModal open={isAddFarmerModalOpen} onOpenChange={setIsAddFarmerModalOpen} onSuccess={fetchData} />
            <ViewFarmerModal open={viewModalOpen} onOpenChange={setViewModalOpen} farmer={selectedFarmer} />
            <AddFarmerModal open={editModalOpen} onOpenChange={setEditModalOpen} farmer={selectedFarmer} isEditMode={true} onSuccess={fetchData} />
            <UploadReportModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} farmer={selectedFarmer} />

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
                                    onValueChange={(val) => {
                                        const farmer = farmers.find(f => f._id === val);
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
                                        {farmers.map(farmer => (
                                            <SelectItem key={farmer._id} value={farmer._id} className={darkMode ? 'hover:bg-white/5' : ''}>
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
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                        </div>

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
                                className="px-8 h-11 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            >
                                {visitForm.isEditing ? (
                                    <>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Update Journal Entry
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Archive Journal Entry
                                    </>
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
        </AgentLayout>
    );
};

export default FarmManagement;
