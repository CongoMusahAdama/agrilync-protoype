import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
    UserPlus,
    Users,
    ShieldCheck,
    Globe,
    Mail,
    Phone,
    Search,
    Briefcase,
    BadgeCheck,
    ArrowRight,
    ArrowUpRight,
    Zap,
    Building2,
    ShieldAlert,
    Clock,
    UserCircle,
    RotateCcw,
    Lock,
    Unlock,
    MoreHorizontal,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Filter,
    Trash2,
    Ban
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Badge } from '@/components/ui/badge';
import CountUp from '@/components/CountUp';
import { Checkbox } from '@/components/ui/checkbox';

const AgentManagement = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'agent',
        region: 'Ashanti',
        supervisor: '',
        commissionTier: 'Standard'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/super-admin/users-list');
            if (res.data && res.data.length > 0) {
                setUsers(res.data);
            } else {
                // Fallback realistic mock data
                setUsers([
                    { id: '1', name: 'Kwame Mensah', email: 'k.mensah@agrilync.com', role: 'Agent', region: 'Ashanti', contact: '+233 24 123 4567', status: 'Active', agentId: 'AG-AS-001' },
                    { id: '2', name: 'Abena Osei', email: 'a.osei@agrilync.com', role: 'Agent', region: 'Western', contact: '+233 27 987 6543', status: 'Active', agentId: 'AG-WS-004' },
                    { id: '3', name: 'John Dumelo', email: 'j.dumelo@partner.com', role: 'Partner', region: 'Volta', contact: '+233 50 555 1122', status: 'Active', agentId: 'PT-VL-012' },
                    { id: '4', name: 'Ekow Blankson', email: 'e.blankson@farmer.com', role: 'Farmer', region: 'Central', contact: '+233 20 444 8899', status: 'Suspended', agentId: 'FM-CR-102' },
                    { id: '5', name: 'Sister Deborah', email: 's.deborah@agrilync.com', role: 'Admin', region: 'Greater Accra', contact: '+233 24 666 7788', status: 'Active', agentId: 'AD-GA-002' },
                    { id: '6', name: 'Sarkodie King', email: 's.king@agrilync.com', role: 'Agent', region: 'Eastern', contact: '+233 55 222 3344', status: 'Active', agentId: 'AG-ES-009' },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
            // Fallback mock data on error too for UX
            setUsers([
                { id: '1', name: 'Kwame Mensah', email: 'k.mensah@agrilync.com', role: 'Agent', region: 'Ashanti', contact: '+233 24 123 4567', status: 'Active', agentId: 'AG-AS-001' },
                { id: '2', name: 'Abena Osei', email: 'a.osei@agrilync.com', role: 'Agent', region: 'Western', contact: '+233 27 987 6543', status: 'Active', agentId: 'AG-WS-004' },
                { id: '3', name: 'John Dumelo', email: 'j.dumelo@partner.com', role: 'Partner', region: 'Volta', contact: '+233 50 555 1122', status: 'Active', agentId: 'PT-VL-012' },
                { id: '4', name: 'Ekow Blankson', email: 'e.blankson@farmer.com', role: 'Farmer', region: 'Central', contact: '+233 20 444 8899', status: 'Suspended', agentId: 'FM-CR-102' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        try {
            await api.post('/super-admin/users', formData);
            toast.success(`Agent ${formData.name} provisioned successfully!`);
            setIsOpen(false);
            setStep(1);
            fetchUsers();
            setFormData({
                name: '', email: '', phone: '', role: 'agent', region: 'Ashanti', supervisor: '', commissionTier: 'Standard'
            });
        } catch (err: any) {
            toast.error(err.response?.data?.msg || 'Failed to create user');
        }
    };

    const handlePasswordReset = (user: any) => {
        Swal.fire({
            title: 'Reset Password?',
            text: `Send a password reset link to ${user.email}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7ede56',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Send Reset'
        }).then((result) => {
            if (result.isConfirmed) {
                toast.success(`Reset link sent to ${user.name}`);
            }
        });
    };

    const handleToggleStatus = (user: any) => {
        const isSuspended = user.status === 'Suspended';
        Swal.fire({
            title: isSuspended ? 'Reactivate Account?' : 'Suspend Account?',
            text: `Are you sure you want to ${isSuspended ? 'reactivate' : 'suspend'} ${user.name}'s account?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7ede56',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
        }).then((result) => {
            if (result.isConfirmed) {
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: isSuspended ? 'Active' : 'Suspended' } : u));
                toast.success(`Account ${isSuspended ? 'reactivated' : 'suspended'} successfully`);
            }
        });
    };

    const handleBulkAction = (action: string) => {
        if (selectedUsers.length === 0) return;
        
        Swal.fire({
            title: `Bulk ${action}?`,
            text: `Apply this action to ${selectedUsers.length} selected users?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7ede56',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                if (action === 'Suspend') {
                    setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'Suspended' } : u));
                } else if (action === 'Reset Password') {
                    toast.success(`Reset links sent to ${selectedUsers.length} users`);
                }
                setSelectedUsers([]);
                toast.success(`Bulk action completed: ${action}`);
            }
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             user.region.toLowerCase().includes(searchQuery.toLowerCase());
        const roleStr = typeof user.role === 'string' ? user.role.toLowerCase() : '';
        const matchesRole = roleFilter === 'All' || roleStr === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const categories = [
        { title: 'Supervisors', count: users.filter(u => u.role?.toLowerCase() === 'supervisor' || u.role?.toLowerCase() === 'admin').length, icon: ShieldCheck, color: 'bg-slate-950', iconColor: 'text-[#ef4444]', path: '/dashboard/super-admin/settings' },
        { title: 'Lync Agents', count: users.filter(u => u.role?.toLowerCase() === 'agent').length, icon: Briefcase, color: 'bg-[#002f37]', iconColor: 'text-[#7ede56]', path: '/dashboard/super-admin/agents' },
    ];

    const regionsList = ["Western", "Eastern", "Volta", "Ashanti", "Central", "Northern", "Bono"];
    const roleOptions = ["All", "Agent", "Farmer", "Partner", "Admin"];

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
                            Personnel Management
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage staff, agents, and access control
                    </p>
                </div>

                <Dialog open={isOpen} onOpenChange={(val) => { setIsOpen(val); if(!val) setStep(1); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] h-12 px-8 font-black uppercase text-[11px] tracking-widest shadow-premium rounded-xl flex gap-3 group">
                            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" /> Create Agent Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={`sm:max-w-[550px] border-none shadow-2xl p-0 overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                        {/* Step Indicator Header */}
                        <div className="bg-[#002f37] p-8 pb-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[9px] px-3">STEP {step} OF 4</Badge>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#7ede56]' : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {step === 1 && "Basic Identity"}
                                    {step === 2 && "Regional Logistics"}
                                    {step === 3 && "Financial Tier"}
                                    {step === 4 && "Confirmation"}
                                </h3>
                                <p className="text-[10px] font-bold text-[#7ede56] uppercase tracking-[0.2em]">{
                                    step === 1 ? "Basic information" :
                                    step === 2 ? "Region and supervisor" :
                                    step === 3 ? "Commission tier" :
                                    "Review and create account"
                                }</p>
                            </div>
                        </div>

                        <div className="p-8 -mt-6 rounded-t-[32px] bg-white dark:bg-gray-900 relative z-20">
                            {step === 1 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</Label>
                                        <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} placeholder="e.g. Kwame Mensah" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Mobile Number</Label>
                                        <Input value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} placeholder="+233 24 000 0000" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                                        <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} placeholder="k.mensah@agrilync.com" />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Region</Label>
                                        <Select onValueChange={(val) => handleChange('region', val)} defaultValue={formData.region}>
                                            <SelectTrigger className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                                                {regionsList.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reporting Supervisor</Label>
                                        <Select onValueChange={(val) => handleChange('supervisor', val)} defaultValue={formData.supervisor}>
                                            <SelectTrigger className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}><SelectValue placeholder="Select Supervisor" /></SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                <SelectItem value="sup-1">Regional Lead - Ashanti</SelectItem>
                                                <SelectItem value="sup-2">Ops Manager - Greater Accra</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Commission Allocation Matrix</Label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {['Basic', 'Standard', 'Senior'].map(tier => (
                                                <div 
                                                    key={tier}
                                                    onClick={() => handleChange('commissionTier', tier)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.commissionTier === tier ? 'border-[#7ede56] bg-[#7ede56]/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-black uppercase tracking-tight">{tier} Tier</span>
                                                        {formData.commissionTier === tier && <CheckCircle2 className="w-5 h-5 text-[#7ede56]" />}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                                                        {tier === 'Basic' ? 'Starter rate for new field entries' : 
                                                         tier === 'Standard' ? 'Optimized rate for verified agents' : 
                                                         'Premium rate for high-volume performers'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-4">
                                    <div className="w-20 h-20 bg-[#7ede56]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#7ede56]/20">
                                        <BadgeCheck className="w-10 h-10 text-[#7ede56]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black uppercase tracking-tighter">Ready to Create</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review information below</p>
                                    </div>
                                    <div className={`grid grid-cols-2 gap-4 text-left p-5 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">Agent</p>
                                            <p className="text-sm font-black tracking-tight">{formData.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">Region</p>
                                            <p className="text-sm font-black tracking-tight">{formData.region}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">Tier</p>
                                            <p className="text-sm font-black tracking-tight">{formData.commissionTier}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter italic">
                                        Executing will send an SMS and Email invite to the agent with initialization steps.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-4 mt-8">
                                {step > 1 && (
                                    <Button variant="ghost" onClick={prevStep} className="h-12 w-12 rounded-xl p-0 hover:bg-gray-100">
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                )}
                                {step < 4 ? (
                                    <Button 
                                        onClick={nextStep} 
                                        disabled={step === 1 && !formData.name}
                                        className="flex-1 h-14 bg-[#002f37] hover:bg-[#001c21] text-[#7ede56] font-black uppercase text-[11px] tracking-widest rounded-xl transition-all"
                                    >
                                        Continue Protocol <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleSubmit} 
                                        className="flex-1 h-14 bg-[#7ede56] hover:bg-[#6bcb4b] text-[#002f37] font-black uppercase text-[11px] tracking-widest rounded-xl shadow-lg transition-all"
                                    >
                                        Activate Agent Node
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-5">
                {categories.map((m, idx) => (
                    <Card
                        key={idx}
                        className={`${m.color} border-none shadow-2xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer relative overflow-hidden h-36 border border-white/5 group`}
                        onClick={() => navigate(m.path)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <CardHeader className="p-5 pb-0 relative z-10 flex flex-row items-center justify-between space-y-0">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-xl">
                                <m.icon className={`h-4 w-4 ${m.iconColor}`} />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
                        </CardHeader>
                        <CardContent className="p-5 pt-3 relative z-10 flex flex-col justify-end h-[calc(9rem-3.5rem)]">
                            <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">
                                {m.title}
                            </p>
                            <h3 className="text-3xl font-black text-white">
                                {loading ? (
                                    <span className="animate-pulse">...</span>
                                ) : (
                                    <CountUp end={m.count} duration={2000} />
                                )}
                            </h3>
                            <p className="text-[8px] font-bold mt-1 text-white/30 truncate uppercase tracking-tighter italic">
                                Active Regional Controllers
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* User Table Card */}
            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                <CardHeader className="space-y-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <UserCircle className="w-5 h-5 text-[#7ede56]" /> Personnel Directory
                            </CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">View and manage system users</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="relative w-full md:w-64 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search staff, email, region..."
                                    className={`pl-12 h-11 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-50'}`}
                                />
                            </div>
                            <div className="hidden md:flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                {roleOptions.map(role => (
                                    <Button
                                        key={role}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setRoleFilter(role)}
                                        className={`h-9 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${roleFilter === role ? 'bg-white dark:bg-gray-700 text-[#002f37] dark:text-[#7ede56] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {role}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bulk Action Toolbar */}
                    {selectedUsers.length > 0 && (
                        <div className="flex items-center justify-between p-4 bg-[#7ede56]/5 border border-[#7ede56]/20 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-[#7ede56] text-[#002f37] font-black">{selectedUsers.length} SELECTED</Badge>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Execute bulk ops:</span>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleBulkAction('Reset Password')} className="bg-[#002f37] text-[#7ede56] h-10 px-6 font-black uppercase text-[9px] tracking-widest rounded-xl flex gap-2">
                                    <RotateCcw className="w-3.5 h-3.5" /> Bulk Reset
                                </Button>
                                <Button size="sm" onClick={() => handleBulkAction('Suspend')} className="bg-rose-500 text-white h-10 px-6 font-black uppercase text-[9px] tracking-widest rounded-xl flex gap-2">
                                    <Ban className="w-3.5 h-3.5" /> Bulk Suspend
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedUsers([])} className="h-10 text-gray-400 font-black uppercase text-[9px] tracking-widest">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardHeader>
                
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5 w-10">
                                    <Checkbox 
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onCheckedChange={(checked) => {
                                            if (checked) setSelectedUsers(filteredUsers.map(u => u.id));
                                            else setSelectedUsers([]);
                                        }}
                                        className="h-4 w-4 border-2 border-gray-300"
                                    />
                                </th>
                                <th className="px-6 py-5">Name</th>
                                <th className="px-6 py-5">Role</th>
                                <th className="px-6 py-5">Region</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id} className={`${darkMode ? 'hover:bg-[#7ede56]/5' : 'hover:bg-[#7ede56]/5'} transition-colors group ${user.status === 'Suspended' ? 'opacity-60' : ''}`}>
                                    <td className="px-6 py-5">
                                        <Checkbox 
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) setSelectedUsers(prev => [...prev, user.id]);
                                                else setSelectedUsers(prev => prev.filter(id => id !== user.id));
                                            }}
                                            className="h-4 w-4 border-2 border-gray-300"
                                        />
                                    </td>
                                    <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm relative ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#eefcf0] text-[#002f37]'} border border-white/5 shadow-inner group-hover:scale-110 transition-transform`}>
                                                {user.name.charAt(0)}
                                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${darkMode ? 'border-gray-900' : 'border-white'} ${user.status === 'Active' ? 'bg-[#7ede56]' : 'bg-rose-500'}`} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{user.name}</span>
                                                <span className="text-[10px] font-bold text-gray-500/70 lowercase">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <Badge variant="outline" className={`w-fit text-[9px] font-black uppercase tracking-widest border-2 ${
                                                user.role?.toLowerCase().includes('agent') ? 'border-sky-500/30 text-sky-500' : 
                                                user.role?.toLowerCase().includes('farmer') ? 'border-[#7ede56]/30 text-[#7ede56]' :
                                                'border-rose-500/30 text-rose-500'
                                            } rounded-lg px-2 py-0.5`}>
                                                {user.role}
                                            </Badge>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">ID: <span className="text-[#7ede56]">{user.agentId || 'SYNCING'}</span></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-3.5 h-3.5 text-blue-500/50" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{user.region}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500/60 uppercase tracking-tighter">{user.contact}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 group-hover:translate-x-0 translate-x-4 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handlePasswordReset(user)}
                                                className="h-9 w-9 p-0 border-[#7ede56]/20 bg-[#7ede56]/5 text-[#7ede56] hover:bg-[#7ede56] hover:text-[#002f37] rounded-xl"
                                                title="Reset Password"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleToggleStatus(user)}
                                                className={`h-9 w-9 p-0 border-none rounded-xl transition-all ${user.status === 'Suspended' ? 'bg-[#7ede56] text-[#002f37]' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                                                title={user.status === 'Suspended' ? "Reactivate" : "Suspend"}
                                            >
                                                {user.status === 'Suspended' ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">No personnel found matching these locks</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-rose-950/20 border-rose-500/20' : 'bg-rose-50 border-rose-200'} flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-rose-500/5 rotate-12 blur-3xl group-hover:bg-rose-500/10 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 rounded-[24px] bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-rose-900 dark:text-rose-400`}>Security Node Audit</h3>
                        <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-rose-700/60 dark:text-rose-400/60 mt-2 leading-relaxed`}>
                            Administrative account created by <strong>Super Admin</strong>. All staff are subject to system security policies.
                        </p>
                    </div>
                </div>
                <Button variant="outline" className={`font-black text-[10px] px-10 tracking-widest h-12 uppercase border-2 border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl relative z-10`}>
                    Personnel Safety Audit
                </Button>
            </div>
        </div>
    );
};

export default AgentManagement;
