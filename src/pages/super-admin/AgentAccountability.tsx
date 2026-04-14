import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';
import {
    Users,
    Activity,
    ShieldAlert,
    CheckCircle2,
    Clock,
    Search,
    MonitorPlay,
    History,
    Briefcase,
    ArrowUpRight,
    MapPin,
    Building2,
    TrendingUp,
    ShieldCheck,
    Navigation,
    Zap,
    Video,
    Mic,
    Phone,
    FileText,
    MoreHorizontal,
    Flag,
    AlertTriangle,
    Wallet,
    Percent,
    ClipboardCheck,
    RotateCcw,
    Calculator
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

const AgentAccountability = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
    const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [flagReason, setFlagReason] = useState('');

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const res = await api.get('/super-admin/agents');
            if (res.data && res.data.length > 0) {
                setAgents(res.data);
            } else {
                // Realistic Mock Data for Accountability
                setAgents([
                    { id: '1', name: 'Kwame Mensah', agentId: 'AG-AS-001', region: 'Ashanti', lastSync: '2026-04-05T14:30:00Z', dataQuality: 98, visitCompliance: 95, corrections: 2, commission: 1250.50, farmers: 45, status: 'Active' },
                    { id: '2', name: 'Abena Osei', agentId: 'AG-WS-004', region: 'Western', lastSync: '2026-04-03T10:15:00Z', dataQuality: 82, visitCompliance: 70, corrections: 12, commission: 840.00, farmers: 28, status: 'Active' },
                    { id: '3', name: 'Sarkodie King', agentId: 'AG-ES-009', region: 'Eastern', lastSync: '2026-04-05T16:45:00Z', dataQuality: 94, visitCompliance: 88, corrections: 5, commission: 1100.25, farmers: 32, status: 'Active' },
                    { id: '4', name: 'Ekow Blankson', agentId: 'AG-CR-102', region: 'Central', lastSync: '2026-04-04T08:20:00Z', dataQuality: 75, visitCompliance: 60, corrections: 18, commission: 450.75, farmers: 15, status: 'At Risk' },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch agents:', err);
            setAgents([]);
        } finally {
            setLoading(false);
        }
    };

    const getSyncStatus = (lastSync: string) => {
        const syncDate = new Date(lastSync);
        const hoursDiff = (new Date().getTime() - syncDate.getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 48) return { label: 'CRITICAL', color: 'bg-rose-500/10 text-rose-500', icon: AlertTriangle };
        if (hoursDiff > 24) return { label: 'DELAYED', color: 'bg-amber-500/10 text-amber-500', icon: Clock };
        return { label: 'LIVE', color: 'bg-[#7ede56]/10 text-[#7ede56]', icon: Activity };
    };

    const handleFlag = () => {
        if (!flagReason) {
            toast.error('Rejection reason required for audit trails.');
            return;
        }
        toast.warning(`Agent ${selectedAgent.name} flagged for supervision. Reason: ${flagReason}`);
        setIsFlagModalOpen(false);
        setFlagReason('');
    };

    const filteredAgents = agents.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.agentId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(val);
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
                            Agent Performance
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Review agent work and monthly payouts
                    </p>
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                    <Input
                        placeholder="Search agent ID or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                    />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {[
                    { label: 'Avg Quality', value: '88%', icon: ClipboardCheck, color: 'text-[#7ede56]' },
                    { label: 'Late Syncs', value: '5 Agents', icon: Clock, color: 'text-amber-500' },
                    { label: 'Total Payout', value: 'GH¢14.2k', icon: Wallet, color: 'text-blue-500' },
                    { label: 'At Risk', value: '3 Nodes', icon: ShieldAlert, color: 'text-rose-500' },
                ].map((stat, i) => (
                    <Card key={i} className={`border-none shadow-premium ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-xl font-black">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Accountability Table */}
            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                <th className="p-4">Agent Name</th>
                                <th className="p-4">Last Sync</th>
                                <th className="p-4 text-center">Data Quality</th>
                                <th className="p-4 text-center">Corrections</th>
                                <th className="p-4 text-right">Commission (MTD)</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredAgents.map(agent => {
                                const sync = getSyncStatus(agent.lastSync);
                                const SyncIcon = sync.icon;
                                return (
                                    <tr key={agent.id} className="hover:bg-[#7ede56]/5 transition-colors group">
                                        <td className="p-4 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm bg-gray-100 dark:bg-gray-800 uppercase`}>
                                                    {agent.name[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black uppercase tracking-tight text-sm">{agent.name}</span>
                                                    <span className="text-[9px] font-bold text-[#7ede56] uppercase tracking-widest">{agent.agentId} â€¢ {agent.region}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${sync.color}`}>
                                                <SyncIcon className="w-3 h-3" />
                                                {sync.label}
                                            </div>
                                            <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Last: {new Date(agent.lastSync).toLocaleString()}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-[11px] font-black ${agent.dataQuality > 90 ? 'text-[#7ede56]' : 'text-amber-500'}`}>{agent.dataQuality}%</span>
                                                <div className="w-16 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${agent.dataQuality > 90 ? 'bg-[#7ede56]' : 'bg-amber-500'}`} style={{ width: `${agent.dataQuality}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Badge variant="outline" className={`border-none font-black text-[10px] ${agent.corrections > 10 ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {agent.corrections} REJECTS
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-black text-sm">{formatCurrency(agent.commission)}</span>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Approved Submissions</p>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Button size="icon" variant="ghost" className="h-9 w-9 text-blue-500 hover:bg-blue-50" onClick={() => { setSelectedAgent(agent); setIsCommissionModalOpen(true); }}><Calculator className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className={`h-9 w-9 text-rose-500 hover:bg-rose-50`} onClick={() => { setSelectedAgent(agent); setIsFlagModalOpen(true); }}><Flag className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-400"><History className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Flag Modal */}
            <Dialog open={isFlagModalOpen} onOpenChange={setIsFlagModalOpen}>
                <DialogContent className={`sm:max-w-[450px] border-none shadow-2xl ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-rose-500">
                             <ShieldAlert className="w-6 h-6" /> Flag Agent
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Flag agent for critical performance review</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reason for Flagging</Label>
                            <Textarea 
                                className={`rounded-xl text-sm border-none shadow-inner min-h-[100px] ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                                placeholder="Detail the integrity or performance concern..."
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                            />
                        </div>
                        <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest leading-relaxed flex gap-3 ${darkMode ? 'bg-rose-500/5 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            Flagging an agent triggers a mandatory review session by regional supervisors and suspends their next commission payout pending resolution.
                        </div>
                    </div>
                    <DialogFooter className="mt-8 gap-3">
                        <Button variant="ghost" className="h-12 px-8 font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => setIsFlagModalOpen(false)}>Cancel</Button>
                        <Button className="h-12 px-8 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg" onClick={handleFlag}>Confirm Flag</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Commission Calculator Modal */}
            <Dialog open={isCommissionModalOpen} onOpenChange={setIsCommissionModalOpen}>
                <DialogContent className={`sm:max-w-[550px] border-none shadow-2xl p-0 overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                    {selectedAgent && (
                        <div>
                            <div className="bg-[#002f37] p-8 text-white">
                                <div className="flex justify-between items-center mb-6">
                                    <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[9px]">THIS MONTH</Badge>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase">April 2026</span>
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedAgent.name}</h2>
                                <p className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.2em]">{selectedAgent.agentId}</p>
                            </div>
                            
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { label: 'Verified Farmer Onboardings', count: 12, rate: 50, total: 600, icon: Sprout },
                                        { label: 'Training Sessions Facilitated', count: 5, rate: 30, total: 150, icon: BookOpen },
                                        { label: 'Funded Project Milestones', count: 4, rate: 125.12, total: 500.48, icon: Zap },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                    <item.icon className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase">{item.label}</p>
                                                    <p className="text-[10px] font-black uppercase">{item.count} Units @ {formatCurrency(item.rate)}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-black">{formatCurrency(item.total)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center md:text-left">Projected Net Payout</p>
                                        <p className="text-4xl font-black text-[#7ede56] tracking-tighter">{formatCurrency(selectedAgent.commission)}</p>
                                    </div>
                                    <Button className="h-14 px-10 bg-[#002f37] text-white hover:bg-[#001c21] rounded-xl font-black uppercase text-[11px] tracking-widest shadow-2xl">
                                        Approve Payout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Generic placeholder icons not imported
const Sprout = (props: any) => <Activity {...props} />;
const BookOpen = (props: any) => <FileText {...props} />;

export default AgentAccountability;
