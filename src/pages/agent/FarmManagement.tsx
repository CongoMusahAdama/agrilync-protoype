import React, { useState, useMemo } from 'react';
import AgentLayout from './AgentLayout';
import { useDarkMode } from '@/contexts/DarkModeContext';
import AddFarmerModal from '@/components/agent/AddFarmerModal';
import ViewFarmerModal from '@/components/agent/ViewFarmerModal';
import EditFarmerModal from '@/components/agent/EditFarmerModal';
import UploadReportModal from '@/components/agent/UploadReportModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { mockFarmers, regions, farmCategories } from '@/data/mockFarmData';
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
    Phone
} from 'lucide-react';

// Mock data for field visits
const mockFieldVisits = [
    { id: 1, farmerId: 'F001', farmerName: 'Kwame Mensah', lyncId: 'LYG0000001', phone: '+233 24 123 4567', date: '2024-11-28', purpose: 'Crop Inspection', notes: 'Maize crop showing healthy growth. No pest issues detected.', status: 'Completed' },
    { id: 2, farmerId: 'F002', farmerName: 'Ama Asante', lyncId: 'LYG0000002', phone: '+233 20 987 6543', date: '2024-11-25', purpose: 'Soil Assessment', notes: 'Soil pH levels optimal. Recommended additional fertilizer application.', status: 'Completed' },
    { id: 3, farmerId: 'F003', farmerName: 'Kofi Boateng', lyncId: 'LYG0000003', phone: '+233 27 555 1234', date: '2024-11-22', purpose: 'Equipment Check', notes: 'Irrigation system functioning well. Minor repairs needed on drip lines.', status: 'Completed' },
    { id: 4, farmerId: 'F004', farmerName: 'Akosua Nyarko', lyncId: 'LYG0000004', phone: '+233 55 444 3333', date: '2024-11-20', purpose: 'Harvest Monitoring', notes: 'Cassava harvest 80% complete. Quality exceeds expectations.', status: 'Completed' },
    { id: 5, farmerId: 'F005', farmerName: 'Yaw Adjei', lyncId: 'LYG0000005', phone: '+233 24 777 8888', date: '2024-11-18', purpose: 'Training Follow-up', notes: 'Farmer successfully implementing new planting techniques from training session.', status: 'Completed' },
];

const FarmManagement: React.FC = () => {
    const { darkMode } = useDarkMode();
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

    // Field visit logging state
    const [activeTab, setActiveTab] = useState<'farmers' | 'visits'>('farmers');
    const [fieldVisitModalOpen, setFieldVisitModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);
    const [visitLogs, setVisitLogs] = useState(mockFieldVisits);
    const [visitForm, setVisitForm] = useState({
        farmerId: '',
        farmerName: '',
        lyncId: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        purpose: '',
        notes: ''
    });

    const metrics = useMemo(() => {
        const total = mockFarmers.length;
        const verified = mockFarmers.filter(f => f.status === 'Verified').length;
        const pending = mockFarmers.filter(f => f.status === 'Pending').length;
        const active = mockFarmers.filter(f => f.status === 'In Progress').length;
        const matched = mockFarmers.filter(f => f.investmentMatched).length;
        return { total, verified, pending, active, matched };
    }, []);

    const filteredFarmers = useMemo(() => {
        return mockFarmers.filter(farmer => {
            const matchesSearch =
                farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                farmer.phone.includes(searchQuery);
            const matchesRegion = selectedRegion === 'all' || farmer.region === selectedRegion;
            const matchesFarmType = selectedFarmType === 'all' || farmer.farmType === selectedFarmType;
            const matchesCategory = selectedCategory === 'all' || farmer.category === selectedCategory;
            const filterStatus = statusFilter || selectedStatus;
            const matchesStatus = filterStatus === 'all' || farmer.status === filterStatus;
            return matchesSearch && matchesRegion && matchesFarmType && matchesCategory && matchesStatus;
        });
    }, [searchQuery, selectedRegion, selectedFarmType, selectedCategory, selectedStatus, statusFilter]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedRegion('all');
        setSelectedFarmType('all');
        setSelectedCategory('all');
        setSelectedStatus('all');
        setStatusFilter(null);
    };

    const handleCardClick = (status: string | null) => {
        setStatusFilter(status);
        setSelectedStatus('all');
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Verified':
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
            // In a real app, you would update the farmer status here
        }
    };

    const handleUploadReport = (farmer: any) => {
        setSelectedFarmer(farmer);
        setUploadModalOpen(true);
    };

    // Field visit handlers
    const handleLogVisit = (farmer?: any) => {
        if (farmer) {
            setVisitForm({
                farmerId: farmer.id,
                farmerName: farmer.name,
                lyncId: generateLyncId(farmer.id),
                phone: farmer.phone,
                date: new Date().toISOString().split('T')[0],
                purpose: '',
                notes: ''
            });
        } else {
            setVisitForm({
                farmerId: '',
                farmerName: '',
                lyncId: '',
                phone: '',
                date: new Date().toISOString().split('T')[0],
                purpose: '',
                notes: ''
            });
        }
        setFieldVisitModalOpen(true);
    };

    const handleSubmitVisit = () => {
        if (!visitForm.farmerName || !visitForm.purpose || !visitForm.notes) {
            alert('Please fill in all required fields');
            return;
        }
        const newVisit = {
            id: visitLogs.length + 1,
            farmerId: visitForm.farmerId || `F00${visitLogs.length + 1}`,
            farmerName: visitForm.farmerName,
            lyncId: visitForm.lyncId || `LYG000000${visitLogs.length + 1}`,
            phone: visitForm.phone,
            date: visitForm.date,
            purpose: visitForm.purpose,
            notes: visitForm.notes,
            status: 'Completed'
        };
        setVisitLogs([newVisit, ...visitLogs]);
        setFieldVisitModalOpen(false);
        alert('Field visit logged successfully!');
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
                        { label: 'Verified', value: metrics.verified, icon: CheckCircle, color: 'bg-blue-600', status: 'Verified' },
                        { label: 'Pending', value: metrics.pending, icon: Clock, color: 'bg-orange-600', status: 'Pending' },
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
                                                {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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
                                                <SelectItem value="Verified">Verified</SelectItem>
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
                                                    key={farmer.id}
                                                    className={`group transition-all duration-300 border-b ${darkMode ? 'border-white/5 hover:bg-emerald-500/5' : 'hover:bg-gray-50'} ${index % 2 === 0 ? (darkMode ? 'bg-transparent' : 'bg-white') : (darkMode ? 'bg-white/2' : 'bg-gray-50/30')}`}
                                                >
                                                    <TableCell className="text-center font-mono text-xs text-gray-500">
                                                        {(index + 1).toString().padStart(2, '0')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${farmer.status === 'Verified' ? 'bg-emerald-500' : farmer.status === 'Pending' ? 'bg-amber-500' : 'bg-indigo-500'}`}>
                                                                    {farmer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                                </div>
                                                                {farmer.status === 'Verified' && (
                                                                    <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5 shadow-sm">
                                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className={`font-bold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{farmer.name}</p>
                                                                <p className={`text-xs font-mono mt-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{generateLyncId(farmer.id)}</p>
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
                                                        <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-0 ring-1 ring-inset ${farmer.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' :
                                                            farmer.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 ring-amber-500/20' :
                                                                farmer.status === 'Matched' ? 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/20' :
                                                                    'bg-blue-500/10 text-blue-500 ring-blue-500/20'
                                                            }`}>
                                                            {farmer.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {new Date(farmer.lastVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
                            Showing {filteredFarmers.length} of {mockFarmers.length} farmers
                        </div>
                    </TabsContent>

                    {/* Field Visit Logs Tab - Journal Entry Style */}
                    <TabsContent value="visits" className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Field Activities</h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chronological record of recent farm inspections</p>
                            </div>
                            <Button onClick={() => handleLogVisit()} className="bg-[#1db954] hover:bg-[#17a447] text-white shadow-lg shadow-emerald-500/20">
                                <Plus className="h-4 w-4 mr-2" />
                                New Journal Entry
                            </Button>
                        </div>

                        <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-500/50 before:to-transparent">
                            {visitLogs.map((visit, index) => (
                                <div key={visit.id} className="relative group">
                                    {/* Timeline Node */}
                                    <div className={`absolute -left-8 top-1.5 w-7 h-7 rounded-full border-4 flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${darkMode ? 'bg-[#002f37] border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white border-emerald-500 shadow-md'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${visit.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    </div>

                                    <Card className={`${sectionCardClass} border-0 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-emerald-500/5 group-hover:translate-x-1`}>
                                        <div className="p-5">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline" className={`text-[10px] font-mono px-2 py-0.5 ${darkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-gray-50 text-emerald-600'}`}>
                                                            {visit.lyncId}
                                                        </Badge>
                                                        <h4 className={`font-bold transition-colors ${darkMode ? 'text-gray-100 group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-emerald-600'}`}>
                                                            {visit.farmerName}
                                                        </h4>
                                                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                                                        <Badge className={`text-[10px] uppercase tracking-widest ${darkMode ? 'bg-emerald-500/10 text-emerald-400 border-0' : 'bg-emerald-50 text-emerald-700'}`}>
                                                            {visit.purpose}
                                                        </Badge>
                                                    </div>
                                                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {visit.notes}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                                            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {new Date(visit.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                                                            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {visit.phone}
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
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10">
                                                            <Edit className="w-4 h-4 text-gray-400" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-500/20">
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        </Button>
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

            <AddFarmerModal open={isAddFarmerModalOpen} onOpenChange={setIsAddFarmerModalOpen} />
            <ViewFarmerModal open={viewModalOpen} onOpenChange={setViewModalOpen} farmer={selectedFarmer} />
            <EditFarmerModal open={editModalOpen} onOpenChange={setEditModalOpen} farmer={selectedFarmer} />
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
                                <Input
                                    value={visitForm.farmerName}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        const matchedFarmer = mockFarmers.find(f =>
                                            f.name.toLowerCase() === newName.toLowerCase() &&
                                            (visitForm.phone === '' || f.phone === visitForm.phone)
                                        );
                                        setVisitForm({
                                            ...visitForm,
                                            farmerName: newName,
                                            lyncId: matchedFarmer ? generateLyncId(matchedFarmer.id) : '',
                                            farmerId: matchedFarmer?.id || ''
                                        });
                                    }}
                                    placeholder="Enter farmer name"
                                    className={`h-11 ${inputBaseClasses}`}
                                />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact Number</Label>
                                <div className="relative group">
                                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${darkMode ? 'text-gray-500 group-focus-within:text-emerald-500' : 'text-gray-400 group-focus-within:text-emerald-500'}`} />
                                    <Input
                                        value={visitForm.phone}
                                        onChange={(e) => {
                                            const newPhone = e.target.value;
                                            const matchedFarmer = mockFarmers.find(f =>
                                                f.phone === newPhone &&
                                                (visitForm.farmerName === '' || f.name.toLowerCase() === visitForm.farmerName.toLowerCase())
                                            );
                                            setVisitForm({
                                                ...visitForm,
                                                phone: newPhone,
                                                lyncId: matchedFarmer ? generateLyncId(matchedFarmer.id) : visitForm.lyncId,
                                                farmerId: matchedFarmer?.id || visitForm.farmerId,
                                                farmerName: matchedFarmer?.name || visitForm.farmerName
                                            });
                                        }}
                                        placeholder="+233 XX XXX XXXX"
                                        className={`pl-10 h-11 ${inputBaseClasses}`}
                                    />
                                </div>
                            </div>
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
                        </div>

                        <div className="space-y-2">
                            <Label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Primary Inspection Purpose *</Label>
                            <Select value={visitForm.purpose} onValueChange={(val) => setVisitForm({ ...visitForm, purpose: val })}>
                                <SelectTrigger className={`h-11 ${inputBaseClasses}`}>
                                    <SelectValue placeholder="Select purpose of this visit" />
                                </SelectTrigger>
                                <SelectContent className={darkMode ? 'bg-[#002f37] border-white/10 text-white' : ''}>
                                    <SelectItem value="Crop Inspection">Crop Inspection</SelectItem>
                                    <SelectItem value="Soil Assessment">Soil Assessment</SelectItem>
                                    <SelectItem value="Equipment Check">Equipment Check</SelectItem>
                                    <SelectItem value="Harvest Monitoring">Harvest Monitoring</SelectItem>
                                    <SelectItem value="Training Follow-up">Training Follow-up</SelectItem>
                                    <SelectItem value="Pest Control">Pest Control</SelectItem>
                                    <SelectItem value="General Check-in">General Check-in</SelectItem>
                                    <SelectItem value="Investment Review">Investment Review</SelectItem>
                                </SelectContent>
                            </Select>
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
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Archive Journal Entry
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AgentLayout>
    );
};

export default FarmManagement;
