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
    ArrowUpRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import api from '@/utils/api';
import { toast } from 'sonner';
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
            toast.success('Operational account provisioned successfully');
            setFormData({ name: '', email: '', password: 'ChangeMe123!', role: 'agent', region: 'Ashanti', contact: '' });
            fetchUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.msg || 'Failed to provision account');
        }
    };

    const categories = [
        { title: 'System Nodes', count: users.length || 42, icon: Users, path: '/dashboard/super-admin/users' },
        { title: 'Supervisors', count: users.filter(u => u.role === 'supervisor').length || 8, icon: Shield, path: '/dashboard/super-admin/users' },
        { title: 'Active Agents', count: users.filter(u => u.role === 'agent').length || 34, icon: UserCheck, path: '/dashboard/super-admin/agents' },
    ];

    const regions = ["Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", "Northern", "North East", "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Settings & Roles</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>System configuration and administrative control</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="font-black uppercase text-[10px] tracking-widest h-11 px-6 border-gray-100 dark:border-gray-800 shadow-premium rounded-xl">
                        <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Sync Config
                    </Button>
                </div>
            </div>

            {/* Premium Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((c, idx) => (
                    <Card
                        key={idx}
                        className={`bg-[#002f37] border-none shadow-premium relative overflow-hidden group h-36 cursor-pointer hover:scale-[1.02] transition-transform`}
                        onClick={() => navigate(c.path)}
                    >
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            <c.icon className="h-24 w-24 absolute -right-4 -bottom-4 rotate-12 text-white" />
                        </div>
                        <CardContent className="p-6 relative z-10 flex flex-col justify-end h-full">
                            <div className="flex items-center justify-between mb-1">
                                <p className={`text-[9px] font-black text-white/70 uppercase tracking-[0.2em]`}>{c.title}</p>
                                <ArrowUpRight className="w-4 h-4 text-[#7ede56]/40" />
                            </div>
                            <h3 className="text-3xl font-black text-white">
                                <CountUp end={c.count} duration={1000} />
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className={`inline-flex h-12 items-center justify-center rounded-2xl p-1 mb-8 shadow-premium ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100 border border-gray-200'}`}>
                    <TabsTrigger value="users" className="rounded-xl px-6 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] dark:data-[state=active]:bg-[#7ede56] dark:data-[state=active]:text-[#002f37]">
                        <Users className="w-4 h-4" /> Account Registry
                    </TabsTrigger>
                    <TabsTrigger value="create" className="rounded-xl px-6 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] dark:data-[state=active]:bg-[#7ede56] dark:data-[state=active]:text-[#002f37]">
                        <UserPlus className="w-4 h-4" /> Provisioning
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="rounded-xl px-6 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] dark:data-[state=active]:bg-[#7ede56] dark:data-[state=active]:text-[#002f37]">
                        <Shield className="w-4 h-4" /> Permissions Flow
                    </TabsTrigger>
                    <TabsTrigger value="system" className="rounded-xl px-6 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] dark:data-[state=active]:bg-[#7ede56] dark:data-[state=active]:text-[#002f37]">
                        <Settings className="w-4 h-4" /> Global Config
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-6 outline-none">
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-black uppercase tracking-tight">Staff Account Registry</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Active regional controllers and field nodes</CardDescription>
                            </div>
                            <div className="relative w-64 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="Filter by name or email..." className={`pl-10 h-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100 shadow-inner'}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={`${darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                        <th className="px-6 py-5 underline decoration-gray-200 underline-offset-8">Operational Staff</th>
                                        <th className="px-6 py-5">Role Lock</th>
                                        <th className="px-6 py-5 text-center">Verification Path</th>
                                        <th className="px-6 py-5">State</th>
                                        <th className="px-6 py-5 text-right">Surveillance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user._id} className={`${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50/50'} transition-colors group`}>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#002f37] text-white'}`}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{user.name}</span>
                                                        <span className="text-[10px] font-bold text-gray-400">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge className={`font-black text-[9px] uppercase tracking-widest border-none px-3 py-1 rounded-full ${user.role === 'supervisor' ? 'bg-[#4c1d95] text-white' : 'bg-[#0369a1] text-white'}`}>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {user.isVerified ? (
                                                        <><Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] px-3 py-1 rounded-full flex gap-1 items-center"><UserCheck className="w-3 h-3" /> VERIFIED</Badge></>
                                                    ) : (
                                                        <><Badge className="bg-rose-100 text-rose-700 border-none font-black text-[9px] px-3 py-1 rounded-full animate-pulse flex gap-1 items-center"><RefreshCcw className="w-3 h-3" /> PENDING</Badge></>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-[#7ede56] shadow-[0_0_8px_#7ede56]' : 'bg-gray-400'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{user.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-50/50">
                                                        <RefreshCcw className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-500 hover:bg-rose-50/50">
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

                <TabsContent value="create" className="outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-[#7ede56]/10 text-[#002f37] dark:text-[#7ede56]">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black uppercase tracking-tight">Account Provisioning</CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Initialize staff node in the regional matrix</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <form onSubmit={handleCreateUser} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Legal Full Name</Label>
                                            <Input
                                                className={`h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-inner'}`}
                                                placeholder="e.g. John Mensah"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Operational Role</Label>
                                            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                                <SelectTrigger className={`h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-inner'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="supervisor">Regional Supervisor</SelectItem>
                                                    <SelectItem value="agent">Extension Agent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Official Email</Label>
                                        <Input
                                            type="email"
                                            className={`h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-inner'}`}
                                            placeholder="j.mensah@agrilync.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Region Allocation</Label>
                                            <Select value={formData.region} onValueChange={(val) => setFormData({ ...formData, region: val })}>
                                                <SelectTrigger className={`h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-inner'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Secure Contact</Label>
                                            <Input
                                                className={`h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-inner'}`}
                                                placeholder="+233 24 000 0000"
                                                value={formData.contact}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <Button type="submit" className="w-full bg-[#002f37] hover:bg-[#001c21] text-[#7ede56] h-14 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl transition-all hover:scale-[1.01]">
                                            Initialize Staff Provisioning
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-8">
                            <Card className={`border-none shadow-premium overflow-hidden bg-emerald-900 text-white p-8 relative`}>
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Lock className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Shield className="w-8 h-8 text-[#7ede56]" />
                                        <h4 className="text-xl font-black uppercase tracking-tighter">Security Protocol</h4>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                                <RefreshCcw className="w-5 h-5 text-[#7ede56]" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black uppercase tracking-widest text-[#7ede56]">Forced Handshake</h5>
                                                <p className="text-[10px] font-bold text-white/60 mt-1 uppercase tracking-wider leading-relaxed">System mandates password updates upon initial deployment of any staff credentials.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                                <Globe className="w-5 h-5 text-sky-400" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black uppercase tracking-widest text-sky-400">Regional Lockdown</h5>
                                                <p className="text-[10px] font-bold text-white/60 mt-1 uppercase tracking-wider leading-relaxed">Agent data access is cryptographically limited to their assigned operational cluster.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} p-8`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <Settings className="w-5 h-5 text-gray-400" />
                                    <h4 className="text-sm font-black uppercase tracking-widest">Global Watchdog</h4>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                    All administrative actions are recorded in the immutable audit trail. Overwriting logs is a critical violation of system integrity.
                                </p>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="permissions" className="outline-none">
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} py-20 text-center`}>
                        <div className="flex flex-col items-center max-w-sm mx-auto">
                            <div className="w-20 h-20 rounded-full bg-[#7ede56]/10 flex items-center justify-center mb-6">
                                <Shield className="w-10 h-10 text-[#7ede56]" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Access Control Matrix</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4 leading-relaxed">
                                Advanced RBAC configuration is currently being validated in the security sandbox. Availability expected in the next system patch.
                            </p>
                            <Button className="mt-8 bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 h-11 px-8 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] cursor-not-allowed">
                                Flow Locked
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Threat Thresholds</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Low Activity Timeout (Days)</Label>
                                    <Input type="number" defaultValue={3} className={`h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100 shadow-inner'}`} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Critical Risk Flag (Days)</Label>
                                    <Input type="number" defaultValue={7} className={`h-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-inner'}`} />
                                </div>
                                <Button className="w-full bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-12 rounded-xl shadow-lg mt-4">
                                    Update Security Policy
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsRoles;
