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
    ClipboardList
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
            subtitle="Manage farmers, verify registrations, and monitor farm activities"
        >
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                    <button type="button" onClick={() => handleCardClick(null)} className={`relative overflow-hidden rounded-xl p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-105 bg-[#1db954] text-white ${statusFilter === null ? 'ring-2 ring-white ring-offset-2' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-lg bg-white/20 p-3">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium opacity-90">Total Farmers</p>
                            <p className="text-4xl font-bold">{metrics.total}</p>
                            <p className="text-xs opacity-80">All farmers in system</p>
                        </div>
                    </button>
                    <button type="button" onClick={() => handleCardClick('Verified')} className={`relative overflow-hidden rounded-xl p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-105 bg-emerald-600 text-white ${statusFilter === 'Verified' ? 'ring-2 ring-white ring-offset-2' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-lg bg-white/20 p-3">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium opacity-90">Verified</p>
                            <p className="text-4xl font-bold">{metrics.verified}</p>
                            <p className="text-xs opacity-80">Fully verified farmers</p>
                        </div>
                    </button>
                    <button type="button" onClick={() => handleCardClick('Pending')} className={`relative overflow-hidden rounded-xl p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-105 bg-yellow-500 text-white ${statusFilter === 'Pending' ? 'ring-2 ring-white ring-offset-2' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-lg bg-white/20 p-3">
                                <Clock className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium opacity-90">Pending</p>
                            <p className="text-4xl font-bold">{metrics.pending}</p>
                            <p className="text-xs opacity-80">Awaiting verification</p>
                        </div>
                    </button>
                    <button type="button" onClick={() => handleCardClick('In Progress')} className={`relative overflow-hidden rounded-xl p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-105 bg-blue-600 text-white ${statusFilter === 'In Progress' ? 'ring-2 ring-white ring-offset-2' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-lg bg-white/20 p-3">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium opacity-90">Active Farms</p>
                            <p className="text-4xl font-bold">{metrics.active}</p>
                            <p className="text-xs opacity-80">Currently in progress</p>
                        </div>
                    </button>
                    <button type="button" onClick={() => handleCardClick('Matched')} className={`relative overflow-hidden rounded-xl p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-105 bg-purple-600 text-white ${statusFilter === 'Matched' ? 'ring-2 ring-white ring-offset-2' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="rounded-lg bg-white/20 p-3">
                                <Coins className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium opacity-90">Matched</p>
                            <p className="text-4xl font-bold">{metrics.matched}</p>
                            <p className="text-xs opacity-80">With investors</p>
                        </div>
                    </button>
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
                        {/* Search & Filter Bar */}
                        <Card className={sectionCardClass}>
                            <div className="p-4">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <Input placeholder="Search by farmer name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`pl-10 ${inputBaseClasses}`} />
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                            <SelectTrigger className={`w-40 ${inputBaseClasses}`}><SelectValue placeholder="Region" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Regions</SelectItem>
                                                {regions.map(region => (<SelectItem key={region} value={region}>{region}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedFarmType} onValueChange={setSelectedFarmType}>
                                            <SelectTrigger className={`w-40 ${inputBaseClasses}`}><SelectValue placeholder="Farm Type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="Crop">Crop</SelectItem>
                                                <SelectItem value="Livestock">Livestock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className={`w-40 ${inputBaseClasses}`}><SelectValue placeholder="Category" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {Object.entries(farmCategories).map(([type, categories]) => categories.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>)))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setStatusFilter(null); }}>
                                            <SelectTrigger className={`w-40 ${inputBaseClasses}`}><SelectValue placeholder="Status" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Verified">Verified</SelectItem>
                                                <SelectItem value="Matched">Matched</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" size="sm" onClick={resetFilters} className={darkMode ? 'border-[#1b5b65] hover:bg-[#0d3036]' : ''}>
                                            <X className="h-4 w-4 mr-2" />Reset
                                        </Button>
                                        <Button size="sm" onClick={() => setIsAddFarmerModalOpen(true)} className="bg-[#1db954] hover:bg-[#17a447] text-white">
                                            <Plus className="h-4 w-4 mr-2" />Add Farmer
                                        </Button>
                                    </div>
                                </div>
                                {statusFilter && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filtering by:</span>
                                        <Badge className={getStatusBadgeColor(statusFilter)}>{statusFilter}</Badge>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Farmers Table */}
                        <Card className={sectionCardClass}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Farmers Directory</h3>
                                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{filteredFarmers.length} {filteredFarmers.length === 1 ? 'farmer' : 'farmers'} found</p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`border-b-2 ${darkMode ? 'border-[#1b5b65]' : 'border-gray-200'}`}>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>#</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lync ID</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Farmer</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Farm Details</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Visit</th>
                                                <th className={`text-right py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredFarmers.map((farmer, index) => (
                                                <tr key={farmer.id} className={`border-b transition-colors ${darkMode ? 'border-[#1b5b65]/50 hover:bg-[#0f3035]' : 'border-gray-100 hover:bg-gray-50'} ${index % 2 === 0 ? (darkMode ? 'bg-[#0b2528]' : 'bg-white') : (darkMode ? 'bg-[#0d2d31]' : 'bg-gray-50/50')}`}>
                                                    <td className={`py-4 px-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {index + 1}
                                                    </td>
                                                    <td className={`py-4 px-4 text-sm font-mono ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                        {generateLyncId(farmer.id)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${farmer.status === 'Verified' ? 'bg-emerald-500' : farmer.status === 'Pending' ? 'bg-yellow-500' : farmer.status === 'Matched' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                                                                {farmer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                            </div>
                                                            <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farmer.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {farmer.phone}
                                                    </td>
                                                    <td className={`py-4 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        <div className="text-sm">
                                                            <div className="font-medium">{farmer.region}</div>
                                                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{farmer.community}</div>
                                                        </div>
                                                    </td>
                                                    <td className={`py-4 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        <div className="text-sm">
                                                            <div className="font-medium">{farmer.farmType}</div>
                                                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{farmer.category}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Badge variant="outline" className={`${getStatusBadgeColor(farmer.status)} text-xs font-medium`}>{farmer.status}</Badge>
                                                    </td>
                                                    <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {new Date(farmer.lastVisit).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleViewFarmer(farmer)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300' : 'text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700'}`} title="View Profile">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleEditFarmer(farmer)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-orange-400 hover:bg-orange-500/20 hover:text-orange-300' : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'}`} title="Edit">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleUploadReport(farmer)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-purple-400 hover:bg-purple-500/20 hover:text-purple-300' : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'}`} title="Upload Report">
                                                                <Upload className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {filteredFarmers.length === 0 && (
                                        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                <Users className="h-10 w-10 opacity-50" />
                                            </div>
                                            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No farmers found</h3>
                                            <p className="text-sm">Try adjusting your search criteria or filters</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                            Showing {filteredFarmers.length} of {mockFarmers.length} farmers
                        </div>
                    </TabsContent>

                    {/* Field Visit Logs Tab */}
                    <TabsContent value="visits">
                        <Card className={sectionCardClass}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                            <ClipboardList className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Field Visit Logs</h3>
                                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{visitLogs.length} visits logged</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleLogVisit()} className="bg-[#1db954] hover:bg-[#17a447] text-white">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Log Field Visit
                                    </Button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`border-b-2 ${darkMode ? 'border-[#1b5b65]' : 'border-gray-200'}`}>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>#</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lync ID</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Farmer</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Purpose</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notes</th>
                                                <th className={`text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visitLogs.map((visit, index) => (
                                                <tr key={visit.id} className={`border-b transition-colors ${darkMode ? 'border-[#1b5b65]/50 hover:bg-[#0f3035]' : 'border-gray-100 hover:bg-gray-50'} ${index % 2 === 0 ? (darkMode ? 'bg-[#0b2528]' : 'bg-white') : (darkMode ? 'bg-[#0d2d31]' : 'bg-gray-50/50')}`}>
                                                    <td className={`py-4 px-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {index + 1}
                                                    </td>
                                                    <td className={`py-4 px-4 text-sm font-mono ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                        {visit.lyncId}
                                                    </td>
                                                    <td className={`py-4 px-4 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        {visit.farmerName}
                                                    </td>
                                                    <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {visit.phone}
                                                    </td>
                                                    <td className={`py-4 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {new Date(visit.date).toLocaleDateString()}
                                                    </td>
                                                    <td className={`py-4 px-4`}>
                                                        <Badge variant="outline" className={darkMode ? 'border-[#1b5b65] text-cyan-400' : 'border-cyan-200 text-cyan-700 bg-cyan-50'}>
                                                            {visit.purpose}
                                                        </Badge>
                                                    </td>
                                                    <td className={`py-4 px-4 text-sm max-w-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} title={visit.notes}>
                                                        {visit.notes}
                                                    </td>
                                                    <td className={`py-4 px-4`}>
                                                        <Badge className={darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}>
                                                            {visit.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {visitLogs.length === 0 && (
                                        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                <ClipboardList className="h-10 w-10 opacity-50" />
                                            </div>
                                            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No visits logged yet</h3>
                                            <p className="text-sm">Log your first field visit to get started</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <AddFarmerModal open={isAddFarmerModalOpen} onOpenChange={setIsAddFarmerModalOpen} />
            <ViewFarmerModal open={viewModalOpen} onOpenChange={setViewModalOpen} farmer={selectedFarmer} />
            <EditFarmerModal open={editModalOpen} onOpenChange={setEditModalOpen} farmer={selectedFarmer} />
            <UploadReportModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} farmer={selectedFarmer} />

            {/* Field Visit Modal */}
            <Dialog open={fieldVisitModalOpen} onOpenChange={setFieldVisitModalOpen}>
                <DialogContent className={`max-w-lg ${darkMode ? 'bg-[#0b2528] border-[#1b5b65]' : ''}`}>
                    <DialogHeader>
                        <DialogTitle className={darkMode ? 'text-white' : ''}>Log Field Visit</DialogTitle>
                        <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
                            Record details of your farm visit
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className={darkMode ? 'text-gray-300' : ''}>Farmer Name *</Label>
                                <Input
                                    value={visitForm.farmerName}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        // Auto-match farmer by name and phone
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
                                    className={inputBaseClasses}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={darkMode ? 'text-gray-300' : ''}>Lync ID (Auto-generated)</Label>
                                <Input
                                    value={visitForm.lyncId}
                                    disabled
                                    placeholder="Auto-filled when farmer matches"
                                    className={`${inputBaseClasses} ${darkMode ? 'bg-[#0a2225] text-gray-400' : 'bg-gray-100 text-gray-500'} cursor-not-allowed`}
                                />
                                {visitForm.lyncId && (
                                    <p className={`text-xs ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>✓ Farmer matched</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className={darkMode ? 'text-gray-300' : ''}>Phone Number</Label>
                                <Input
                                    value={visitForm.phone}
                                    onChange={(e) => {
                                        const newPhone = e.target.value;
                                        // Auto-match farmer by phone and name
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
                                    className={inputBaseClasses}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={darkMode ? 'text-gray-300' : ''}>Visit Date *</Label>
                                <Input
                                    type="date"
                                    value={visitForm.date}
                                    onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                                    className={inputBaseClasses}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className={darkMode ? 'text-gray-300' : ''}>Purpose of Visit *</Label>
                            <Select value={visitForm.purpose} onValueChange={(val) => setVisitForm({ ...visitForm, purpose: val })}>
                                <SelectTrigger className={inputBaseClasses}>
                                    <SelectValue placeholder="Select purpose" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Label className={darkMode ? 'text-gray-300' : ''}>Visit Notes / Report *</Label>
                            <Textarea
                                value={visitForm.notes}
                                onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                                placeholder="Describe your observations, findings, and any recommendations..."
                                rows={4}
                                className={inputBaseClasses}
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button variant="outline" onClick={() => setFieldVisitModalOpen(false)} className={darkMode ? 'border-[#1b5b65] hover:bg-[#0d3036]' : ''}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitVisit} className="bg-[#1db954] hover:bg-[#17a447] text-white">
                                <FileText className="h-4 w-4 mr-2" />
                                Submit Visit Log
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AgentLayout>
    );
};

export default FarmManagement;
