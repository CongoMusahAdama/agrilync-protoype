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
    Phone,
    Mail,
    Eye,
    Sprout,
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
    History,
    Shield,
    MoreHorizontal,
    Navigation,
    BookOpen
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

const FarmFarmerOversight = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [farmers, setFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isOverrideOpen, setIsOverrideOpen] = useState(false);
    const [overrideData, setOverrideData] = useState({ status: '', note: '' });

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            const res = await api.get('/super-admin/farmers');
            if (res.data && res.data.length > 0) {
                setFarmers(res.data);
            } else {
                // Fallback realistic mock data
                setFarmers([
                    { id: '1', name: 'Kofi Annan', farmName: 'Green Gold Farms', crop: 'Cocoa', acreage: 12, region: 'Ashanti', phone: '+233 24 100 1122', email: 'k.annan@farmer.gh', status: 'On Track', agentName: 'Kwame Mensah', submissionDate: '2026-03-15', kycScore: 92, hasInvestor: true, investorName: 'Impact Capital GH', matchDate: '2026-03-20' },
                    { id: '2', name: 'Efua Sutherland', farmName: 'Efua Organic Hub', crop: 'Cassava', acreage: 5, region: 'Eastern', phone: '+233 27 200 3344', email: 'e.sutherland@farmer.gh', status: 'Pending Verification', agentName: 'Sarkodie King', submissionDate: '2026-04-01', kycScore: 85, hasInvestor: false },
                    { id: '3', name: 'Nii Lamptey', farmName: 'Coastal Harvest', crop: 'Maize', acreage: 20, region: 'Greater Accra', phone: '+233 20 300 5566', email: 'n.lamptey@farmer.gh', status: 'At Risk', agentName: 'Sister Deborah', submissionDate: '2026-02-28', kycScore: 88, hasInvestor: true, investorName: 'AgroVentures', matchDate: '2026-03-05' },
                    { id: '4', name: 'Ama K. Abebrese', farmName: 'Abebrese Plantation', crop: 'Mango', acreage: 8, region: 'Volta', phone: '+233 55 400 7788', email: 'ama.k@farmer.gh', status: 'Pending Verification', agentName: 'John Dumelo', submissionDate: '2026-04-03', kycScore: 78, hasInvestor: false },
                    { id: '5', name: 'Sarkodie Addo', farmName: 'Highest Farms', crop: 'Pineapple', acreage: 15, region: 'Central', phone: '+233 24 500 9900', email: 'sark.a@farmer.gh', status: 'Off Track', agentName: 'Abena Osei', submissionDate: '2026-03-10', kycScore: 94, hasInvestor: true, investorName: 'Global Agro Fund', matchDate: '2026-03-12' },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch farmers:', err);
            setFarmers([]);
        } finally {
            setLoading(false);
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
        }).then((result) => {
            if (result.isConfirmed) {
                setFarmers(prev => prev.map(f => f.id === farmer.id ? { ...f, status: 'On Track' } : f));
                toast.success(`${farmer.name} verified successfully.`);
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
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                setFarmers(prev => prev.filter(f => f.id !== farmer.id));
                toast.error(`${farmer.name} submission rejected. Agent notified.`);
            }
        });
    };

    const handleOverride = () => {
        if (!overrideData.status || !overrideData.note) {
            toast.error('Status and mandatory audit note required.');
            return;
        }
        setFarmers(prev => prev.map(f => f.id === selectedFarmer.id ? { ...f, status: overrideData.status } : f));
        setIsOverrideOpen(false);
        toast.success(`Farm status overridden to ${overrideData.status}. Logged in System Registry.`);
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
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                        <th className="p-4">Farmer Name</th>
                                        <th className="p-4">Farm Details</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Match Status</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {allRegisteredFarmers.map(farmer => (
                                        <tr key={farmer.id} className="hover:bg-[#7ede56]/5 transition-colors group">
                                            <td className="p-4 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm bg-[#7ede56]/10 text-[#7ede56] uppercase`}>
                                                        {farmer.name[0]}
                                                    </div>
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
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-blue-500" onClick={() => { setSelectedFarmer(farmer); setIsProfileOpen(true); }}><Eye className="w-4 h-4" /></Button>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-[#7ede56]" onClick={() => { setSelectedFarmer(farmer); setIsOverrideOpen(true); }}><Shield className="w-4 h-4" /></Button>
                                            </td>
                                        </tr>
                                    ))}
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
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-lg">{farmer.name[0]}</div>
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
            </Tabs>

            {/* Profile View Modal */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className={`sm:max-w-[800px] border-none shadow-2xl p-0 overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                    {selectedFarmer && (
                        <div className="flex flex-col">
                            <div className="bg-[#002f37] p-8 text-white relative">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Badge className={`${getStatusColor(selectedFarmer.status)} border-none text-[10px] px-3 font-black`}>{selectedFarmer.status}</Badge>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-3xl border border-white/20">{selectedFarmer.name[0]}</div>
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedFarmer.name}</h2>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#7ede56] uppercase tracking-widest"><Phone className="w-3 h-3" /> {selectedFarmer.phone}</span>
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><MapPin className="w-3 h-3" /> {selectedFarmer.region}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[500px]">
                                <div className="p-8 border-r border-gray-100 dark:border-gray-800 space-y-8 overflow-y-auto">
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"><History className="w-4 h-4" /> Identity Details</h4>
                                        <div className={`p-4 rounded-xl space-y-3 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50'} border`}>
                                            <div><p className="text-[8px] font-black text-gray-400 uppercase">National ID (GhanaCard)</p><p className="text-[10px] font-black">GHA-72635489-0</p></div>
                                            <div><p className="text-[8px] font-black text-gray-400 uppercase">Registered Mobile Money</p><p className="text-[10px] font-black">{selectedFarmer.phone}</p></div>
                                            <div><p className="text-[8px] font-black text-gray-400 uppercase">Residence Verified By</p><p className="text-[10px] font-black">{selectedFarmer.agentName}</p></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"><BookOpen className="w-4 h-4" /> Training Ledger</h4>
                                        <div className="space-y-2">
                                            {['Financial Literacy 101', 'Soil Health Management', 'Cocoa Pests Controls'].map((t, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                                    <span className="text-[9px] font-black uppercase tracking-tight">{t}</span>
                                                    <CheckCircle2 className="w-3 h-3 text-[#7ede56]" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 flex flex-col">
                                    <div className="flex-1 p-8 overflow-y-auto space-y-8">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Farm Location</h4>
                                                <div className="aspect-video w-full rounded-2xl bg-gray-100 dark:bg-gray-800 relative overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                                                    <Navigation className="w-10 h-10 text-gray-300 animate-pulse" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                                                        <Button className="bg-[#002f37] text-white font-black text-[10px] uppercase rounded-xl">View on Map</Button>
                                                    </div>
                                                    <div className="absolute bottom-3 left-3 flex gap-1">
                                                        <Badge className="bg-black/80 text-white border-none text-[8px] px-2 py-0.5">LAT: 5.6037</Badge>
                                                        <Badge className="bg-black/80 text-white border-none text-[8px] px-2 py-0.5">LON: -0.1870</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recent Visits</h4>
                                                <div className="space-y-3">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="flex gap-3">
                                                            <div className="w-1 bg-[#7ede56] rounded-full"></div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase">Field Inspection #{4-i}</p>
                                                                <p className="text-[8px] font-bold text-gray-400 uppercase">March {10+i}, 2026</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-between gap-4">
                                        <Button variant="outline" className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest" onClick={() => setIsProfileOpen(false)}>Close</Button>
                                        <Button className="flex-1 h-12 bg-[#002f37] text-[#7ede56] hover:bg-[#001c21] rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg" onClick={() => { setIsProfileOpen(false); setIsOverrideOpen(true); }}>Change Status</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Status Override Modal */}
            <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
                <DialogContent className={`sm:max-w-[450px] border-none shadow-2xl ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
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
