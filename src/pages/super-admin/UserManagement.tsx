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
    ArrowUpRight
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
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

    const categories = [
        { title: 'Supervisors', count: users.filter(u => u.role === 'supervisor').length, icon: ShieldCheck, color: 'bg-[#4c1d95]', path: '/dashboard/super-admin/settings' },
        { title: 'Lync Agents', count: users.filter(u => u.role === 'agent').length, icon: Briefcase, color: 'bg-[#0369a1]', path: '/dashboard/super-admin/agents' },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/super-admin/users-list');
            if (res.data && res.data.length > 0) {
                setUsers(res.data);
            } else {
                // No users found - show empty state
                setUsers([]);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
            // On error, show empty state rather than mock data
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
            toast.success(`Successfully created new ${formData.role}`);
            setIsOpen(false);
            fetchUsers();
            setFormData({
                name: '', email: '', password: '', role: 'agent', region: 'Ashanti', contact: ''
            });
        } catch (err: any) {
            toast.error(err.response?.data?.msg || 'Failed to create user');
        }
    };

    const regions = ["Ashanti", "Greater Accra", "Western", "Northern", "Volta", "Central", "Bono", "Eastern"];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>User Management</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Security Provisioning for Regional Clusters</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] h-12 px-8 font-black uppercase text-[11px] tracking-widest shadow-premium rounded-2xl flex gap-3">
                            <UserPlus className="w-4 h-4" /> Provision New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={`sm:max-w-[500px] border-none ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                        <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">New User Protocol</DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-gray-400">Assign credentials and operational regional locks</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Legal Name</Label>
                                    <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role Designation</Label>
                                    <Select onValueChange={(val) => handleChange('role', val)} defaultValue={formData.role}>
                                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="supervisor">Regional Supervisor</SelectItem>
                                            <SelectItem value="agent">Lync Extension Agent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                                <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required className="h-12 rounded-xl" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Region Lock</Label>
                                    <Select onValueChange={(val) => handleChange('region', val)} defaultValue={formData.region}>
                                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Direct Contact</Label>
                                    <Input value={formData.contact} onChange={(e) => handleChange('contact', e.target.value)} required className="h-12 rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Master Password</Label>
                                <Input type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required className="h-12 rounded-xl" />
                            </div>

                            <Button type="submit" className="w-full h-14 bg-[#002f37] hover:bg-[#001c21] text-[#7ede56] font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl mt-4">Execute Provisioning</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Premium Categories */}
            <div className="grid grid-cols-2 gap-4">
                {categories.map((c, idx) => (
                    <Card
                        key={idx}
                        className={`${c.color} border-none shadow-premium hover:scale-[1.05] transition-all duration-300 cursor-pointer relative overflow-hidden h-36 md:h-40 group`}
                        onClick={() => navigate(c.path)}
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                            <c.icon className="h-24 w-24 absolute -right-4 -bottom-4 rotate-12 text-white" />
                        </div>

                        <CardHeader className="p-4 pb-0 relative z-10 flex flex-row items-center justify-between space-y-0">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                                <c.icon className="h-4 w-4 text-white" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-white/40" />
                        </CardHeader>

                        <CardContent className="p-4 pt-4 relative z-10 flex flex-col justify-end h-[calc(9rem-3rem)]">
                            <p className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em] mb-1 truncate">
                                Total {c.title}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-black text-white">
                                <CountUp end={c.count} duration={1500} />
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-black uppercase tracking-tight">Active User Registry</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Master list of operational personnel</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5">Personnel</th>
                                <th className="px-6 py-5">Role/Identity</th>
                                <th className="px-6 py-5">Region Lock</th>
                                <th className="px-6 py-5">Contact Node</th>
                                <th className="px-6 py-5 text-right">State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users.map((user) => (
                                <tr key={user.email} className={`${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50/50'} transition-colors group`}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{user.name}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <Badge className={`w-fit text-[9px] font-black uppercase tracking-widest border-none ${user.role === 'supervisor' ? 'bg-[#4c1d95] text-white' : 'bg-[#0369a1] text-white'}`}>
                                                {user.role}
                                            </Badge>
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">ID: {user.agentId || 'WAITING'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 grayscale opacity-70">
                                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">{user.region}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                <Phone className="w-3 h-3" /> {user.contact}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Badge className={`text-[9px] font-black uppercase tracking-widest h-6 rounded-full px-3 ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {user.status || 'Active'}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserManagement;
