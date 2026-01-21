import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Settings,
    UserPlus,
    Users,
    Shield,
    RefreshCcw,
    Trash2,
    Lock,
    Search,
    UserCheck,
    Ban,
    Globe,
    Phone,
    ArrowRight,
    ArrowUpRight,
    Zap,
    Cpu,
    Fingerprint,
    Database,
    ShieldCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const SettingsRoles = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'ChangeMe123!',
        role: 'agent',
        region: 'Ashanti',
        contact: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/super-admin/users-list');
            setUsers(res.data);
        } catch (err) {
            toast.error('Failed to load user registry');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/super-admin/users', formData);
            await Swal.fire({
                icon: 'success',
                title: 'Account Provisioned!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                            Operational account provisioned successfully
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#7ede56',
                timer: 2000,
                timerProgressBar: true
            });
            setFormData({ name: '', email: '', password: 'ChangeMe123!', role: 'agent', region: 'Ashanti', contact: '' });
            fetchUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.msg || 'Failed to provision account');
        }
    };

    const categories = [
        { title: 'Security Nodes', count: users.length, icon: Fingerprint, path: '/dashboard/super-admin/users', color: 'bg-slate-950', iconColor: 'text-[#ef4444]' },
        { title: 'Authorized Alpha', count: users.filter(u => u.role === 'supervisor').length, icon: ShieldCheck, path: '/dashboard/super-admin/users', color: 'bg-[#002f37]', iconColor: 'text-[#7ede56]' },
        { title: 'Operational Base', count: users.filter(u => u.role === 'agent').length, icon: Database, path: '/dashboard/super-admin/agents', color: 'bg-[#1e1b4b]', iconColor: 'text-sky-400' },
    ];

    const regions = ["Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", "Northern", "North East", "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56] shadow-inner">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            System Configuration
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Administrative control, RBAC protocols, and global platform parameters
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200 shadow-premium'}`}>
                        <RefreshCcw className="w-4 h-4 mr-2" /> Sync Protocols
                    </Button>
                </div>
            </div>

            {/* Premium Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                                <CountUp end={m.count} duration={2000} />
                            </h3>
                            <p className="text-[8px] font-bold mt-1 text-white/30 truncate uppercase tracking-tighter italic">
                                Active System Node Counts
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className={`inline-flex h-14 items-center justify-center rounded-[20px] p-1.5 mb-10 shadow-2xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100/50 border border-gray-200'} backdrop-blur-xl`}>
                    {[
                        { value: 'users', label: 'Account Registry', icon: Users },
                        { value: 'create', label: 'Provisioning', icon: UserPlus },
                        { value: 'permissions', label: 'Permissions Flow', icon: Shield },
                        { value: 'system', label: 'Global Config', icon: Settings },
                    ].map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-xl px-8 h-11 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] dark:data-[state=active]:bg-[#7ede56] dark:data-[state=active]:text-[#002f37] transition-all data-[state=active]:shadow-lg"
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="users" className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[#7ede56]" /> Staff Account Registry
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Active regional controllers and field nodes</CardDescription>
                            </div>
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                                <Input placeholder="Filter by name or email node..." className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-50'}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={`${darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                        <th className="px-6 py-5">Operational Staff</th>
                                        <th className="px-6 py-5 text-center">Identity Lock</th>
                                        <th className="px-6 py-5 text-center">Verification</th>
                                        <th className="px-6 py-5">Integrity</th>
                                        <th className="px-6 py-5 text-right">Observation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user._id} className={`${darkMode ? 'hover:bg-[#7ede56]/5' : 'hover:bg-[#7ede56]/5'} transition-colors group`}>
                                            <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#eefcf0] text-[#002f37]'} border border-white/5 shadow-inner`}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{user.name}</span>
                                                        <span className="text-[10px] font-bold text-gray-400 lowercase">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Badge variant="outline" className={`font-black text-[9px] uppercase tracking-widest border-2 ${user.role === 'supervisor' ? 'border-purple-500/30 text-purple-500' : 'border-sky-500/30 text-sky-500'} rounded-lg px-2.5 py-1`}>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center">
                                                    {user.isVerified ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] px-3 py-1 rounded-lg flex gap-1.5 items-center italic tracking-widest"><UserCheck className="w-3.5 h-3.5" /> VERIFIED</Badge>
                                                    ) : (
                                                        <Badge className="bg-rose-500/10 text-rose-500 border-none font-black text-[9px] px-3 py-1 rounded-lg animate-pulse flex gap-1.5 items-center tracking-widest"><RefreshCcw className="w-3.5 h-3.5" /> PENDING</Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-[#7ede56] shadow-[0_0_10px_#7ede56]' : 'bg-gray-400'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">{user.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-50/50 rounded-lg">
                                                        <RefreshCcw className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-500 hover:bg-rose-50/50 rounded-lg">
                                                        <Ban className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="create" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-[#7ede56]/10 text-[#002f37] dark:text-[#7ede56] shadow-inner">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black uppercase tracking-tight">Staff Account Provisioning</CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Initialize authorized personnel in the regional matrix</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <form onSubmit={handleCreateUser} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Legal Full Name</Label>
                                            <Input
                                                className={`h-12 rounded-xl border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                                                placeholder="e.g. John Mensah"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Operational Role Identity</Label>
                                            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                                <SelectTrigger className={`h-12 rounded-xl border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                                    <SelectItem value="supervisor">Regional Supervisor</SelectItem>
                                                    <SelectItem value="agent">Extension Agent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Corporate Email node</Label>
                                        <Input
                                            type="email"
                                            className={`h-12 rounded-xl border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                                            placeholder="j.mensah@agrilync.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Region Allocation Protocol</Label>
                                            <Select value={formData.region} onValueChange={(val) => setFormData({ ...formData, region: val })}>
                                                <SelectTrigger className={`h-12 rounded-xl border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                                                    {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Secure Contact Number</Label>
                                            <Input
                                                className={`h-12 rounded-xl border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                                                placeholder="+233 24 000 0000"
                                                value={formData.contact}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <Button type="submit" className="w-full bg-[#002f37] hover:bg-[#001c21] text-[#7ede56] h-14 font-black uppercase tracking-widest text-[11px] rounded-[18px] shadow-2xl transition-all hover:scale-[1.01]">
                                            Initialize Staff Provisioning Securely
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-8">
                            <Card className={`border-none shadow-premium overflow-hidden bg-slate-950 text-white p-10 relative group`}>
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                                    <Lock className="w-48 h-48 rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500 border border-orange-500/20">
                                            <Shield className="w-8 h-8" />
                                        </div>
                                        <h4 className="text-xl font-black uppercase tracking-tighter">Security Protocol Lvl 4</h4>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="flex gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                                <RefreshCcw className="w-6 h-6 text-[#7ede56]" />
                                            </div>
                                            <div>
                                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#7ede56]">Forced Handshake</h5>
                                                <p className="text-[10px] font-bold text-white/50 mt-1 uppercase tracking-wider leading-relaxed">System mandates password updates upon initial deployment of any staff credentials to ensure zero-trust integrity.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                                <Globe className="w-6 h-6 text-sky-400" />
                                            </div>
                                            <div>
                                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-400">Regional Cluster isolate</h5>
                                                <p className="text-[10px] font-bold text-white/50 mt-1 uppercase tracking-wider leading-relaxed">Agent data access is cryptographically limited to their assigned operational cluster. Non-assigned hubs remain obscured.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-[#eefcf0] border-[#7ede56]/20'} p-8 border-2 border-dashed`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap className="w-5 h-5 text-[#7ede56]" />
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[#7ede56]">Watcher Pulse</h4>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tighter italic">
                                    All administrative actions are recorded in the immutable audit trail. Overwriting or purging logs is a critical violation of system integrity protocols.
                                </p>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="permissions" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'} py-24 text-center border-2 border-dashed border-gray-200 dark:border-gray-800`}>
                        <div className="flex flex-col items-center max-w-sm mx-auto">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 rounded-full bg-[#7ede56]/10 flex items-center justify-center animate-pulse">
                                    <Shield className="w-12 h-12 text-[#7ede56]" />
                                </div>
                                <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg">LOCKED</div>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Access Control Matrix</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4 leading-relaxed italic">
                                Advanced RBAC configuration is currently being validated in the security sandbox. Availability expected in the next tactical system patch (v2.8.4).
                            </p>
                            <Button className="mt-10 bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 h-12 px-10 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] cursor-not-allowed border border-white/5">
                                Authorization Sequence Offline
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <Cpu className="w-5 h-5 text-blue-500" />
                                    <CardTitle className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Strategic Thresholds</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-10 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Idle Node Lifecycle (Days)</Label>
                                        <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-500 border-none font-bold">DEFAULT: 3</Badge>
                                    </div>
                                    <Input type="number" defaultValue={3} className={`h-14 rounded-xl border-none shadow-inner text-lg font-black ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Risk Flag Latency (Days)</Label>
                                        <Badge className="bg-rose-500/10 text-rose-500 border-none font-bold">URGENT: 7</Badge>
                                    </div>
                                    <Input type="number" defaultValue={7} className={`h-14 rounded-xl border-none shadow-inner text-lg font-black ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} />
                                </div>
                                <Button className="w-full bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[11px] tracking-widest h-14 rounded-[18px] shadow-2xl mt-4 transition-all hover:scale-[1.01]">
                                    Update Global Security Policies
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className={`border-none shadow-premium overflow-hidden bg-[#002f37] text-white p-10 relative group h-fit self-start`}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                <Database className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <h4 className="text-xl font-black uppercase tracking-tighter">System Health</h4>
                                <div className="space-y-6 pt-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#7ede56]">Database Latency</span>
                                        <span className="text-sm font-black text-white italic">1.4ms</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#7ede56] w-[14%] rounded-full shadow-[0_0_8px_#7ede56]"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed pt-2">
                                    Regional clusters are synchronized at 99.9% uptime. Master nodes are operating within optimal thermal and logic parameters.
                                </p>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsRoles;
