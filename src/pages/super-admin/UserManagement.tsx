import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
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
    UserCircle
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Badge } from '@/components/ui/badge';
import CountUp from '@/components/CountUp';

const UserManagement = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
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
            if (res.data && res.data.length > 0) {
                setUsers(res.data);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/super-admin/users', formData);
            await Swal.fire({
                icon: 'success',
                title: 'Staff Member Provisioned!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                            Successfully added <strong>${formData.name}</strong> to the regional matrix.
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#7ede56',
                timer: 2000,
                timerProgressBar: true
            });
            setIsOpen(false);
            fetchUsers();
            setFormData({
                name: '', email: '', password: '', role: 'agent', region: 'Ashanti', contact: ''
            });
        } catch (err: any) {
            toast.error(err.response?.data?.msg || 'Failed to create user');
        }
    };

    const categories = [
        { title: 'Supervisors', count: users.filter(u => u.role === 'supervisor').length, icon: ShieldCheck, color: 'bg-slate-950', iconColor: 'text-[#ef4444]', path: '/dashboard/super-admin/settings' },
        { title: 'Lync Agents', count: users.filter(u => u.role === 'agent').length, icon: Briefcase, color: 'bg-[#002f37]', iconColor: 'text-[#7ede56]', path: '/dashboard/super-admin/agents' },
    ];

    const regions = ["Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", "Northern", "North East", "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <Users className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Personnel Hub
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        System configuration and regional administrative node control
                    </p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] h-12 px-8 font-black uppercase text-[11px] tracking-widest shadow-premium rounded-xl flex gap-3">
                            <UserPlus className="w-4 h-4" /> Provision Personnel
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={`sm:max-w-[550px] border-none shadow-2xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                <Zap className="w-6 h-6 text-[#7ede56]" /> New User Protocol
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mt-1">Assign credentials and regional operational locks</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Legal Full Name</Label>
                                    <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} placeholder="e.g. Ama Boateng" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role Designation</Label>
                                    <Select onValueChange={(val) => handleChange('role', val)} defaultValue={formData.role}>
                                        <SelectTrigger className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-2xl">
                                            <SelectItem value="supervisor">Regional Supervisor</SelectItem>
                                            <SelectItem value="agent">Lync Extension Agent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Corporate Email Address</Label>
                                <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} placeholder="a.boateng@agrilync.com" />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Regional Cluster Lock</Label>
                                    <Select onValueChange={(val) => handleChange('region', val)} defaultValue={formData.region}>
                                        <SelectTrigger className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                                            {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Emergency Contact</Label>
                                    <Input value={formData.contact} onChange={(e) => handleChange('contact', e.target.value)} required className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} placeholder="+233 24 555 1234" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Initialization Password</Label>
                                <Input type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required className={`h-12 rounded-xl text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} placeholder="Min 8 characters" />
                            </div>

                            <Button type="submit" className="w-full h-14 bg-[#002f37] hover:bg-[#001c21] text-[#7ede56] font-black uppercase tracking-widest text-[11px] rounded-xl shadow-2xl mt-4 transition-all hover:scale-[1.01]">
                                Execute Account Provisioning
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <UserCircle className="w-5 h-5 text-[#7ede56]" /> Master User Registry
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Live staff node surveillance</CardDescription>
                    </div>
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                        <Input
                            placeholder="Search staff, email, or region..."
                            className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-50'}`}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5">Personnel Alpha</th>
                                <th className="px-6 py-5">Role Identity</th>
                                <th className="px-6 py-5">Operational Zone</th>
                                <th className="px-6 py-5">Connectivity</th>
                                <th className="px-6 py-5 text-right">Observation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users.map((user) => (
                                <tr key={user.email} className={`${darkMode ? 'hover:bg-[#7ede56]/5' : 'hover:bg-[#7ede56]/5'} transition-colors group`}>
                                    <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#eefcf0] text-[#002f37]'} border border-white/5 shadow-inner`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{user.name}</span>
                                                <span className="text-[10px] font-bold text-gray-500/70 lowercase">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <Badge variant="outline" className={`w-fit text-[9px] font-black uppercase tracking-widest border-2 ${user.role === 'supervisor' ? 'border-[#4c1d95]/30 text-[#4c1d95] dark:text-purple-400' : 'border-[#0369a1]/30 text-[#0369a1] dark:text-sky-400'} rounded-lg px-2 py-0.5`}>
                                                {user.role}
                                            </Badge>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">ID: <span className="text-[#7ede56]">{user.agentId || 'SYNCING'}</span></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-blue-500/50" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{user.region}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500/80 uppercase tracking-tighter">
                                                <Phone className="w-3 h-3" /> {user.contact}
                                            </div>
                                            <div className="flex items-center gap-1.5 grayscale opacity-50 text-[9px] font-bold uppercase tracking-widest">
                                                <Mail className="w-3 h-3" /> COMMS ACTIVE
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#7ede56] hover:bg-[#7ede56]/10 rounded-lg">
                                                <BadgeCheck className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                <ShieldAlert className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-50 rounded-lg">
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                            Administrative account provisioned by <strong>Super Admin</strong>. All personnel are subject to high-frequency surveillance protocols.
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

export default UserManagement;
