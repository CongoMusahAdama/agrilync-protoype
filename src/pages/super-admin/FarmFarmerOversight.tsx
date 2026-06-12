import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    AlertTriangle,
    MessageSquare,
    Activity,
    Map as MapIcon,
    Search,
    Filter,
    Eye,
    Download,
    ArrowUpRight,
    MapPin,
    Building2,
    Users,
    Handshake,
    CheckCircle2,
    XCircle,
    Calendar,
    ChevronRight,
    Star,
    Shield,
    Trash2,
    Clock3,
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminFarmerProfileModal from '@/components/super-admin/AdminFarmerProfileModal';

const FarmFarmerOversight = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [farmers, setFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [deepFarmerDetails, setDeepFarmerDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isOverrideOpen, setIsOverrideOpen] = useState(false);
    const [overrideData, setOverrideData] = useState({ status: '', note: '' });
    const [deletionRequests, setDeletionRequests] = useState<any[]>([]);
    const [loadingDeletionRequests, setLoadingDeletionRequests] = useState(true);

    useEffect(() => {
        fetchFarmers();
        fetchDeletionRequests();
    }, []);

    const fetchFarmers = async () => {
        try {
            const res = await api.get('/super-admin/farmers');
            if (res.data) {
                setFarmers(res.data);
            } else {
                setFarmers([]);
            }
        } catch (err) {
            console.error('Failed to fetch farmers:', err);
            setFarmers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDeletionRequests = async () => {
        try {
            const res = await api.get('/super-admin/farmer-deletion-requests?status=all');
            setDeletionRequests(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Failed to fetch deletion requests:', err);
            setDeletionRequests([]);
        } finally {
            setLoadingDeletionRequests(false);
        }
    };

    useEffect(() => {
        if (isProfileOpen && selectedFarmer) {
            fetchDeepDetails();
        }
    }, [isProfileOpen, selectedFarmer]);

    const fetchDeepDetails = async () => {
        if (!selectedFarmer) return;
        setLoadingDetails(true);
        setDeepFarmerDetails(null);
        try {
            const farmerId = selectedFarmer.id || selectedFarmer._id;
            const res = await api.get(`/super-admin/farmers/${farmerId}`);
            setDeepFarmerDetails(res.data);
        } catch (err) {
            console.error('Failed to fetch deep details', err);
            toast.error('Could not load full grower profile');
        } finally {
            setLoadingDetails(false);
        }
    };

    const openFarmerProfile = (farmer: any) => {
        setSelectedFarmer(farmer);
        setIsProfileOpen(true);
    };

    const handleProfileOpenChange = (open: boolean) => {
        setIsProfileOpen(open);
        if (!open) {
            setDeepFarmerDetails(null);
        }
    };

    const handleApprove = (farmer: any) => {
        Swal.fire({
            title: 'Verify Farmer?',
            text: `Confirm KYC verification for ${farmer.name}. This allows investor matching.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#7ede56',
            confirmButtonText: 'Approve & Verify'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`/super-admin/farmers/${farmer.id}/status`, { status: 'On Track', note: 'KYC Approval' });
                    setFarmers(prev => prev.map(f => f.id === farmer.id ? { ...f, status: 'On Track' } : f));
                    toast.success(`${farmer.name} verified successfully.`);
                } catch (err: any) {
                    console.error('Approve failed:', err);
                    toast.error(err.response?.data?.msg || 'Verification failed');
                }
            }
        });
    };

    const handleReject = (farmer: any) => {
        Swal.fire({
            title: 'Reject Submission?',
            text: 'Provide rejection reason for the agent:',
            input: 'textarea',
            inputPlaceholder: 'e.g. ID image blur, invalid phone...',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Reject'
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    await api.put(`/super-admin/farmers/${farmer.id}/status`, { status: 'Inactive', note: result.value });
                    setFarmers(prev => prev.filter(f => f.id !== farmer.id));
                    toast.error(`${farmer.name} submission rejected. Agent notified.`);
                } catch (err: any) {
                    console.error('Reject failed:', err);
                    toast.error(err.response?.data?.msg || 'Rejection failed');
                }
            }
        });
    };

    const handleOverride = async () => {
        if (!overrideData.status || !overrideData.note) {
            toast.error('Status and mandatory audit note required.');
            return;
        }
        try {
            await api.put(`/super-admin/farmers/${selectedFarmer.id}/status`, { status: overrideData.status, note: overrideData.note });
            setFarmers(prev => prev.map(f => f.id === selectedFarmer.id ? { ...f, status: overrideData.status } : f));
            setIsOverrideOpen(false);
            toast.success(`Farm status overridden to ${overrideData.status}. Logged in System Registry.`);
        } catch (err: any) {
            console.error('Override failed:', err);
            toast.error(err.response?.data?.msg || 'Override failed');
        }
    };

    const handleApproveDeletion = (request: any) => {
        const growerName = request.farmer?.name || request.farmerSnapshot?.name || 'this grower';
        Swal.fire({
            title: 'Approve Permanent Deletion?',
            html: `<p class="text-sm text-gray-600 text-left mb-3">This will <strong>permanently delete</strong> <b>${growerName}</b> and linked farm records. This cannot be undone.</p><p class="text-xs text-gray-500 text-left"><strong>Agent reason:</strong> ${request.reason}</p>`,
            input: 'textarea',
            inputLabel: 'Admin note (optional)',
            inputPlaceholder: 'e.g. Confirmed duplicate record...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Approve & Delete',
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            try {
                await api.put(`/super-admin/farmer-deletion-requests/${request._id}/review`, {
                    action: 'approve',
                    reviewNote: result.value || 'Approved by admin',
                });
                toast.success(`${growerName} has been permanently deleted.`);
                fetchDeletionRequests();
                fetchFarmers();
            } catch (err: any) {
                toast.error(err.response?.data?.msg || 'Failed to approve deletion');
            }
        });
    };

    const handleRejectDeletion = (request: any) => {
        const growerName = request.farmer?.name || request.farmerSnapshot?.name || 'this grower';
        Swal.fire({
            title: 'Reject Deletion Request?',
            text: `Keep ${growerName} in the system and notify the requesting agent.`,
            input: 'textarea',
            inputLabel: 'Rejection reason for agent',
            inputPlaceholder: 'e.g. Grower still active in region, insufficient justification...',
            inputValidator: (value) => (!value || value.trim().length < 5 ? 'Please provide a short reason.' : null),
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Reject Request',
        }).then(async (result) => {
            if (!result.isConfirmed || !result.value) return;
            try {
                await api.put(`/super-admin/farmer-deletion-requests/${request._id}/review`, {
                    action: 'reject',
                    reviewNote: result.value.trim(),
                });
                toast.success('Deletion request rejected. Agent notified.');
                fetchDeletionRequests();
            } catch (err: any) {
                toast.error(err.response?.data?.msg || 'Failed to reject request');
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'on track': return 'bg-[#7ede56]/10 text-[#7ede56] border-[#7ede56]/20';
            case 'pending verification': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'at risk': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'off track': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    const pendingFarmers = farmers.filter(f => f.status === 'Pending Verification');
    const allRegisteredFarmers = farmers.filter(f => f.status !== 'Pending Verification');
    const pendingDeletionRequests = deletionRequests.filter((r) => r.status === 'pending');

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <Users className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Farmer Verification
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Verify new farmer accounts and track seasonal performance
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        <Download className="w-4 h-4 mr-2" /> Season Export
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl h-12">
                        <TabsTrigger value="all" className="rounded-lg font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-[#002f37] dark:data-[state=active]:text-[#7ede56] shadow-sm transition-all">
                            Verified Farmers ({allRegisteredFarmers.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="rounded-lg font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-[#7ede56] data-[state=active]:text-[#002f37] transition-all relative">
                            Awaiting Review ({pendingFarmers.length})
                            {pendingFarmers.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full animate-bounce border-2 border-white dark:border-gray-900">{pendingFarmers.length}</span>}
                        </TabsTrigger>
                        <TabsTrigger value="deletions" className="rounded-lg font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all relative">
                            Deletion Requests ({pendingDeletionRequests.length})
                            {pendingDeletionRequests.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[8px] flex items-center justify-center rounded-full animate-pulse border-2 border-white dark:border-gray-900">{pendingDeletionRequests.length}</span>}
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                        <Input
                            placeholder="Search farmers..."
                            className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="all" className="mt-0">
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                        <th className="p-4">Farmer Name</th>
                                        <th className="p-4">Farm Details</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Assigned Agent</th>
                                        <th className="p-4">Match Status</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {allRegisteredFarmers.length > 0 ? (
                                        allRegisteredFarmers.map(farmer => (
                                            <tr key={farmer.id} className="hover:bg-[#7ede56]/5 transition-colors group">
                                                <td className="p-4 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                                    <div className="flex items-center gap-3">
                                                        {farmer.avatar && !farmer.avatar.includes('lovable-uploads/profile.png') ? (
                                                            <img src={farmer.avatar} alt={farmer.name} className="w-10 h-10 rounded-xl object-cover border border-[#7ede56]/20" />
                                                        ) : (
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm bg-[#7ede56]/10 text-[#7ede56] uppercase`}>
                                                                {farmer.name ? farmer.name[0] : '?'}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="font-black uppercase tracking-tight text-sm">{farmer.name}</span>
                                                            <span className="text-[10px] font-bold text-gray-400 lowercase">{farmer.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[11px] font-black uppercase tracking-tight">{farmer.crop}</span>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{farmer.acreage} AC • ID: FM-{farmer.id}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-500/60" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{farmer.region}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                                                            <Users className="w-3 h-3" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-tight">{farmer.agentName || 'Unassigned'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {farmer.hasInvestor ? (
                                                        <Badge className="bg-[#7ede56]/10 text-[#7ede56] border-none text-[8px] font-black">{farmer.investorName}</Badge>
                                                    ) : (
                                                        <span className="text-[9px] font-black text-gray-400 uppercase">UNMATCHED</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(farmer.status)}`}>
                                                        {farmer.status}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-blue-500" onClick={() => openFarmerProfile(farmer)}><Eye className="w-4 h-4" /></Button>
                                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-[#7ede56]" onClick={() => { setSelectedFarmer(farmer); setIsOverrideOpen(true); }}><Shield className="w-4 h-4" /></Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-xs font-black uppercase text-gray-400">
                                                No verified farmer records in directory.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingFarmers.map(farmer => (
                            <Card key={farmer.id} className={`border-none shadow-premium overflow-hidden hover:scale-[1.02] transition-transform ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                <CardHeader className="bg-amber-500/5 border-b border-amber-500/10 p-5">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <Badge className="bg-amber-500 text-white font-black text-[9px] tracking-widest">PENDING GATE</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center gap-4">
                                        {farmer.avatar && !farmer.avatar.includes('lovable-uploads/profile.png') ? (
                                            <img src={farmer.avatar} alt={farmer.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-lg">{farmer.name ? farmer.name[0] : '?'}</div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-black uppercase tracking-tight">{farmer.name}</h3>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{farmer.region} REGION</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-black/5">
                                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Submitting Agent</p>
                                            <p className="text-[10px] font-black uppercase tracking-tight">{farmer.agentName}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-black/5">
                                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Submission Date</p>
                                            <p className="text-[10px] font-black uppercase tracking-tight">{farmer.submissionDate}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest">KYC Completeness</span>
                                            <span className="text-[10px] font-black text-[#7ede56]">{farmer.kycScore}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#7ede56]" style={{ width: `${farmer.kycScore}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button variant="outline" className="h-11 px-4 border-blue-500/30 text-blue-600 font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => openFarmerProfile(farmer)}>
                                            <Eye className="w-4 h-4 mr-1.5" /> View
                                        </Button>
                                        <Button className="flex-1 bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 rounded-xl shadow-lg" onClick={() => handleApprove(farmer)}>
                                            Approve Data
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white font-black uppercase text-[10px] tracking-widest h-11 rounded-xl" onClick={() => handleReject(farmer)}>
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {pendingFarmers.length === 0 && (
                            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                                <div className="p-6 rounded-full bg-emerald-500/10 text-emerald-500">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">All applications verified</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="deletions" className="mt-0">
                    {loadingDeletionRequests ? (
                        <div className="py-20 text-center text-sm text-gray-400">Loading deletion requests…</div>
                    ) : pendingDeletionRequests.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {pendingDeletionRequests.map((request) => {
                                const grower = request.farmer || request.farmerSnapshot || {};
                                const agent = request.requestedBy || {};
                                return (
                                    <Card key={request._id} className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                        <CardHeader className="bg-rose-500/5 border-b border-rose-500/10 p-5">
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                                                        <Trash2 className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg font-black uppercase tracking-tight">{grower.name || 'Unknown Grower'}</CardTitle>
                                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">
                                                            {grower.id || grower.lyncId || grower.ghanaCardNumber || 'No ID'} · {grower.region || '—'}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <Badge className="bg-rose-500 text-white font-black text-[9px] tracking-widest">PENDING DELETE</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-black/5">
                                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Requesting Agent</p>
                                                    <p className="text-[10px] font-black uppercase tracking-tight">{agent.name || 'Unknown'}</p>
                                                    <p className="text-[9px] text-gray-400 font-mono mt-1">{agent.agentId || '—'}</p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-black/5">
                                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Submitted</p>
                                                    <p className="text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5">
                                                        <Clock3 className="w-3.5 h-3.5" />
                                                        {request.createdAt ? new Date(request.createdAt).toLocaleString() : '—'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Agent Deletion Reason</Label>
                                                <div className={`p-4 rounded-xl text-sm leading-relaxed ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-rose-50 text-gray-700'}`}>
                                                    {request.reason}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 pt-1">
                                                {request.farmer && (
                                                    <Button variant="outline" className="h-11 px-4 font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => openFarmerProfile({ ...grower, id: grower._id || grower.id })}>
                                                        <Eye className="w-4 h-4 mr-1.5" /> View Profile
                                                    </Button>
                                                )}
                                                <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-widest h-11 rounded-xl" onClick={() => handleApproveDeletion(request)}>
                                                    Approve & Delete
                                                </Button>
                                                <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 font-black uppercase text-[10px] tracking-widest h-11 rounded-xl" onClick={() => handleRejectDeletion(request)}>
                                                    Reject
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                            <div className="p-6 rounded-full bg-emerald-500/10 text-emerald-500">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">No pending deletion requests</p>
                        </div>
                    )}

                    {deletionRequests.filter((r) => r.status !== 'pending').length > 0 && (
                        <Card className={`mt-8 border-none shadow-premium ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Recent Review History</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b">
                                            <th className="p-4">Grower</th>
                                            <th className="p-4">Agent</th>
                                            <th className="p-4">Reason</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Reviewed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deletionRequests.filter((r) => r.status !== 'pending').slice(0, 20).map((request) => (
                                            <tr key={request._id} className="border-b border-gray-100 dark:border-gray-800">
                                                <td className="p-4 font-semibold">{request.farmerSnapshot?.name || request.farmer?.name || '—'}</td>
                                                <td className="p-4 text-gray-500">{request.requestedBy?.name || '—'}</td>
                                                <td className="p-4 text-gray-500 max-w-xs truncate">{request.reason}</td>
                                                <td className="p-4">
                                                    <Badge className={request.status === 'approved' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}>
                                                        {request.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-gray-400 text-xs">{request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            <AdminFarmerProfileModal
                open={isProfileOpen}
                onOpenChange={handleProfileOpenChange}
                summaryFarmer={selectedFarmer}
                details={deepFarmerDetails}
                loading={loadingDetails}
                onChangeStatus={() => setIsOverrideOpen(true)}
                getStatusColor={getStatusColor}
            />

            {/* Status Override Modal */}
            <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
                <DialogContent className={`w-[95vw] md:max-w-2xl md:w-full border-none shadow-2xl ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-rose-500">
                             <Shield className="w-6 h-6" /> Change Status
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Update the status of this farmer</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">New Status</Label>
                            <Select onValueChange={(val) => setOverrideData(prev => ({ ...prev, status: val }))}>
                                <SelectTrigger className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                    <SelectValue placeholder="Select New Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="On Track">MARK AS ON TRACK (STABLE)</SelectItem>
                                    <SelectItem value="At Risk">MARK AS AT RISK (WARNING)</SelectItem>
                                    <SelectItem value="Off Track">MARK AS OFF TRACK (CRITICAL)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reason for Change</Label>
                            <Textarea 
                                className={`rounded-xl text-sm border-none shadow-inner min-h-[100px] ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                                placeholder="Explain why this change is necessary for audit logs..."
                                value={overrideData.note}
                                onChange={(e) => setOverrideData(prev => ({ ...prev, note: e.target.value }))}
                            />
                        </div>
                        <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest leading-relaxed flex gap-3 ${darkMode ? 'bg-rose-500/5 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            Warning: Overriding status will be logged in the System Logs for auditing purposes.
                        </div>
                    </div>
                    <DialogFooter className="mt-8 gap-3">
                        <Button variant="ghost" className="h-12 px-8 font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => setIsOverrideOpen(false)}>Cancel</Button>
                        <Button className="h-12 px-8 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg" onClick={handleOverride}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FarmFarmerOversight;
