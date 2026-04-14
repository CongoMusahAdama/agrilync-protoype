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
    ShieldCheck,
    BookOpen,
    Video,
    FileText,
    Upload,
    CheckCircle2,
    XCircle,
    ChevronRight,
    MoreVertical
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const SettingsRoles = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('permissions');

    const roles = [
        { id: '1', name: 'Super Admin', desc: 'Full system access and control.', level: 'Full Access' },
        { id: '2', name: 'Regional Lead', desc: 'Manage agents and farms in a specific region.', level: 'Regional Access' },
        { id: '3', name: 'Compliance Officer', desc: 'Review audits and verify data.', level: 'Audit Access' },
        { id: '4', name: 'Field Support', desc: 'Technical help and hardware support.', level: 'Support Access' },
    ];

    const permissions = [
        { key: 'create_agent', label: 'Add Field Agents' },
        { key: 'auth_payouts', label: 'Approve Payouts' },
        { key: 'override_policy', label: 'Override Yield Limits' },
        { key: 'export_data', label: 'Export Data' },
        { key: 'manage_training', label: 'Manage Training' },
    ];

    // Mock permissions matrix state
    const [matrix, setMatrix] = useState<any>({
        '1': ['create_agent', 'auth_payouts', 'override_policy', 'export_data', 'manage_training'],
        '2': ['create_agent', 'manage_training'],
        '3': ['export_data'],
        '4': ['manage_training'],
    });

    const trainingModules = [
        { id: 'TR-101', title: 'KYC Biometric Protocol', type: 'Video', duration: '12m', status: 'Active', updated: '2 days ago' },
        { id: 'TR-102', title: 'Input Distribution Logistics', type: 'PDF', duration: '15 Pages', status: 'Active', updated: '1 week ago' },
        { id: 'TR-103', title: 'Solar Hub Maintenance', type: 'Video', duration: '45m', status: 'Draft', updated: 'Yesterday' },
    ];

    const togglePermission = (roleId: string, permKey: string) => {
        setMatrix((prev: any) => {
            const rolePerms = prev[roleId] || [];
            if (rolePerms.includes(permKey)) {
                return { ...prev, [roleId]: rolePerms.filter((p: string) => p !== permKey) };
            } else {
                return { ...prev, [roleId]: [...rolePerms, permKey] };
            }
        });
        toast.info(`Permission matrix updated for ${roles.find(r => r.id === roleId)?.name}`);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Settings & Roles
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage user roles, permissions, and system training protocols
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200 shadow-premium'}`}>
                        <RefreshCcw className="w-4 h-4 mr-2" /> Commit Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="permissions" className="w-full" onValueChange={setActiveTab}>
                <TabsList className={`inline-flex h-14 items-center justify-center rounded-[20px] p-1.5 mb-10 shadow-2xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100/50 border border-gray-200'} backdrop-blur-xl`}>
                    {[
                        { value: 'permissions', label: 'Access Matrix', icon: Shield },
                        { value: 'training', label: 'Protocol Center', icon: BookOpen },
                        { value: 'global', label: 'System Params', icon: Cpu },
                    ].map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-xl px-8 h-11 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] transition-all data-[state=active]:shadow-lg"
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="permissions" className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <CardHeader className="p-0 border-b border-black/5 dark:border-white/5">
                            <div className="grid grid-cols-5 bg-[#002f37] text-white/40 text-[9px] font-black uppercase tracking-widest">
                                <div className="p-6 col-span-1 text-white border-r border-white/5">Task Name</div>
                                {roles.map(r => (
                                    <div key={r.id} className="p-6 text-center border-r border-white/5 last:border-0 hover:text-white transition-colors">
                                        <p className="text-white text-[10px]">{r.name}</p>
                                        <p className="text-[8px] opacity-40 mt-1">{r.level}</p>
                                    </div>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {permissions.map((perm, i) => (
                                <div key={perm.key} className={`grid grid-cols-5 border-b last:border-0 ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                                    <div className="p-6 col-span-1 border-r dark:border-white/5 border-gray-100">
                                        <span className="text-xs font-black uppercase tracking-tight leading-tight block">{perm.label}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#7ede56]"></div>
                                            <span className="text-[8px] font-bold opacity-30 uppercase tracking-[0.15em]">CORE_AUTH_{perm.key.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    {roles.map(role => {
                                        const hasPerm = matrix[role.id]?.includes(perm.key);
                                        return (
                                            <div key={`${role.id}-${perm.key}`} className="p-6 flex items-center justify-center border-r dark:border-white/5 border-gray-100 last:border-r-0">
                                                <Switch 
                                                    checked={hasPerm} 
                                                    onCheckedChange={() => togglePermission(role.id, perm.key)}
                                                    className="data-[state=checked]:bg-[#7ede56] data-[state=unchecked]:bg-gray-800"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-[#002f37]/20 border-[#7ede56]/20' : 'bg-sky-50 border-sky-200'} flex items-center justify-between group`}>
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-[24px] bg-sky-500/10 text-sky-500 border border-sky-500/20 shadow-inner">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className={`text-xl font-black uppercase tracking-tight text-sky-900 dark:text-sky-400`}>Zero-Trust Lock Activated</h3>
                                <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-sky-700/60 dark:text-sky-400/60 mt-2 leading-relaxed`}>
                                    Changes to Super Admin permissions require approval from the management board.
                                </p>
                            </div>
                        </div>
                        <Button className="font-black text-[10px] px-10 tracking-widest h-12 uppercase bg-sky-600 hover:bg-sky-700 text-white shadow-lg rounded-xl">
                            Request Override
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="training" className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className={`lg:col-span-2 border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            <CardHeader className="flex flex-row items-center justify-between border-b dark:border-white/5 border-gray-100">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-[#7ede56]" /> Training Materials
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Files and videos for agent training</CardDescription>
                                </div>
                                <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                                    <Upload className="w-4 h-4 mr-2" /> Upload Module
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y dark:divide-white/5 divide-gray-100">
                                    {trainingModules.map(module => (
                                        <div key={module.id} className="p-6 flex items-center justify-between group hover:bg-[#7ede56]/5 transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className={`p-4 rounded-xl ${module.type === 'Video' ? 'bg-blue-500/10 text-blue-500' : 'bg-[#7ede56]/10 text-[#7ede56]'} border border-white/5 shadow-inner`}>
                                                    {module.type === 'Video' ? <Video className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-black text-lg uppercase tracking-tight">{module.title}</h3>
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-[10px] font-black uppercase opacity-40">{module.duration}</span>
                                                        <span className="text-[10px] font-black uppercase opacity-40">#{module.id}</span>
                                                        <Badge variant="outline" className={`text-[8px] border-none font-black ${module.status === 'Active' ? 'bg-[#7ede56]/10 text-[#7ede56]' : 'bg-gray-400/10 text-gray-500'}`}>{module.status}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-400"><Settings className="w-4 h-4" /></Button>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-8">
                            <Card className={`border-none shadow-premium overflow-hidden bg-slate-950 text-white p-8 group`}>
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                    <Database className="w-32 h-32" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="p-3 w-content rounded-[18px] bg-sky-500/10 border border-sky-500/20 inline-block">
                                        <Globe className="w-8 h-8 text-sky-400" />
                                    </div>
                                    <p className="text-xl font-black uppercase tracking-tighter">System Sync</p>
                                    <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em]">Live Data Mirroring</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                                        All files and settings are synced across our network for fast access everywhere.
                                    </p>
                                    <div className="pt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#7ede56]">
                                        <span>Last Global Sync</span>
                                        <span className="font-mono">14:02 UTC</span>
                                    </div>
                                </div>
                            </Card>

                            <Card className={`border-dashed border-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} p-8`}>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Security Hash</h4>
                                <p className="font-mono text-[9px] opacity-30 break-all">sha256:7ede56b8f8fb4b456...a928f115</p>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="global" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            <CardHeader className="border-b dark:border-white/5 border-gray-100 p-8">
                                <div className="flex items-center gap-3">
                                    <Cpu className="w-5 h-5 text-blue-500" />
                                    <CardTitle className="text-lg font-black uppercase tracking-tight">Financial Disbursements</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase opacity-40">Agent Commission Base (GH₵)</Label>
                                    <Input defaultValue="500.00" className={`h-14 font-black text-xl border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase opacity-40">Verification Grace Period (Hours)</Label>
                                    <Input defaultValue="48" className={`h-14 font-black text-xl border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} />
                                </div>
                                <Button className="w-full bg-[#002f37] text-white hover:bg-[#001c21] h-16 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl">
                                    Update Financial Rules
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
