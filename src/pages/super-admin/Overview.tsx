import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Activity,
    AlertTriangle,
    TrendingUp,
    UserCheck,
    Globe,
    Handshake,
    Sprout,
    ArrowUpRight,
    CheckCircle2,
    Briefcase,
    ShieldAlert,
    Clock,
    Zap,
    PieChart as PieChartIcon,
    ChevronRight,
    Wallet,
    Wifi,
    X,
    MoreHorizontal,
    Search,
    ShieldCheck,
    AlertCircle,
    UserPlus,
    Lock,
    ExternalLink,
    Filter,
    ArrowRight,
    Smartphone,
    MapPin,
    BookOpen
} from 'lucide-react';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ReTooltip } from 'recharts';
import { toast } from 'sonner';

const Overview = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [drawerType, setDrawerType] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/super-admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
                // Fallback mock data
                setStats({
                    totalAgents: 58,
                    totalFarmers: 3240,
                    totalRegions: 12,
                    activePartnerships: 24,
                    farmersVerifiedThisWeek: 156,
                    regionalDistribution: [
                        { name: 'Greater Accra', value: 850, activeAgents: 12, status: 'on-track' },
                        { name: 'Ashanti', value: 720, activeAgents: 15, status: 'at-risk' },
                        { name: 'Western', value: 540, activeAgents: 8, status: 'on-track' },
                        { name: 'Eastern', value: 480, activeAgents: 9, status: 'off-track' },
                        { name: 'Northern', value: 390, activeAgents: 6, status: 'on-track' },
                        { name: 'Volta', value: 260, activeAgents: 4, status: 'on-track' },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const alerts = [
        {
            type: 'verifications',
            title: 'Pending Verifications',
            count: 24,
            icon: UserCheck,
            color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            pulseColor: 'shadow-amber-500/20',
            description: 'Farmers awaiting KYC approval'
        },
        {
            type: 'inactive-agents',
            title: 'Inactive Agents',
            count: 5,
            icon: Wifi,
            color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
            pulseColor: 'shadow-orange-500/20',
            description: 'No sync activity > 48hrs'
        },
        {
            type: 'escalations',
            title: 'Critical Escalations',
            count: 12,
            icon: ShieldAlert,
            color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
            description: 'Immediate resolution required'
        }
    ];

    const healthStats = [
        { label: 'Active Logins', value: '428', icon: Users, color: 'text-[#7ede56]' },
        { label: 'Failed Logins', value: '12', icon: ShieldAlert, color: 'text-rose-500' },
        { label: 'Primary Workstation', value: 'Android / Mobile', icon: Smartphone, color: 'text-blue-500' },
        { label: 'System Concurrency', value: '94%', icon: Activity, color: 'text-purple-500' },
    ];

    const statCards = [
        { title: 'Total Agents', value: '58', subtitle: 'Field Staff', icon: Users, color: 'bg-blue-600', path: '/dashboard/super-admin/agents' },
        { title: 'Total Farmers', value: '3,240', subtitle: 'Active Producers', icon: Sprout, color: 'bg-[#4f46e5]', path: '/dashboard/super-admin/oversight' },
        { title: 'Active Regions', value: '12', subtitle: 'Regions Covered', icon: Globe, color: 'bg-teal-600', path: '/dashboard/super-admin/regions' },
        { title: 'Pending Approvals', value: '35', subtitle: 'Across verifications & escalations', icon: Clock, color: 'bg-amber-500', path: '/dashboard/super-admin/escalations' },
        { title: 'At-Risk Farms', value: '23', subtitle: 'Require immediate follow-up', icon: AlertTriangle, color: 'bg-red-600', path: '/dashboard/super-admin/oversight' },
        { title: 'Scheduled Training', value: '47', subtitle: 'Agent-led field sessions', icon: BookOpen, color: 'bg-[#002f37]', path: '/dashboard/super-admin/agents' },
    ];

    const farmHealthData = [
        { name: 'On Track', value: 47, color: '#7ede56' },
        { name: 'At Risk', value: 23, color: '#f59e0b' },
        { name: 'Off Track', value: 8, color: '#f43f5e' },
    ];

    const handleQuickAction = (type: string) => {
        setDrawerType(type);
    };

    const renderDrawerContent = () => {
        switch (drawerType) {
            case 'verifications':
                return (
                    <div className="space-y-6 pt-6">
                        {[
                            { name: 'Kwesi Appiah', region: 'Western', agent: 'Sarkodie', kyc: 85 },
                            { name: 'Amba Osei', region: 'Ashanti', agent: 'Mensah', kyc: 92 },
                            { name: 'Ekow Botchwey', region: 'Central', agent: 'Ekow', kyc: 70 },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight">{f.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">{f.region} • Agent: {f.agent}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden w-24">
                                            <div className="h-full bg-[#7ede56]" style={{ width: `${f.kyc}%` }}></div>
                                        </div>
                                        <span className="text-[8px] font-black">{f.kyc}% KYC</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button size="sm" className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black text-[9px] h-8 px-4 rounded-xl">APPROVE</Button>
                                    <Button size="sm" variant="outline" className="text-rose-500 border-rose-500/20 hover:bg-rose-50 font-black text-[9px] h-8 px-4 rounded-xl">REJECT</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'disbursements':
                return (
                    <div className="space-y-6 pt-6">
                        {[
                            { farm: 'Green Valley', amount: '12,500', partner: 'AgroCorp', reason: 'Missing Invoice' },
                            { farm: 'Obour Farms', amount: '8,200', partner: 'LyncInvest', reason: 'Pending Visit' },
                        ].map((d, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-tight">{d.farm}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{d.partner}</p>
                                    </div>
                                    <span className="text-sm font-black text-[#002f37] dark:text-[#7ede56]">GH₵ {d.amount}</span>
                                </div>
                                <div className="flex items-center justify-between bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                                    <p className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">BLOCK REASON: {d.reason}</p>
                                    <Button size="sm" className="bg-rose-500 text-white hover:bg-rose-600 font-black text-[9px] h-7 px-3 rounded-lg">UNBLOCK</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'inactive-agents':
                return (
                    <div className="space-y-6 pt-6">
                        {[
                            { name: 'Francis Kojo', region: 'Northern', lastSync: '3 days ago' },
                            { name: 'Janet Adama', region: 'Eastern', lastSync: '52 hours ago' },
                        ].map((a, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight">{a.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{a.region}</p>
                                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1 block">LAST SYNC: {a.lastSync}</span>
                                </div>
                                <Button size="sm" className="bg-[#002f37] text-white hover:bg-black font-black text-[9px] h-9 px-4 rounded-xl flex gap-2">
                                    <Zap className="w-3 h-3 text-[#7ede56]" /> SEND REMINDER
                                </Button>
                            </div>
                        ))}
                    </div>
                );
            case 'escalations':
                return (
                    <div className="space-y-6 pt-6">
                        {[
                            { title: 'Payment Delay - Ashanti', category: 'Financial', by: 'Agent Sarkodie' },
                            { title: 'Pest Outbreak Alert', category: 'Operational', by: 'Supervisor Mensah' },
                        ].map((e, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge className="bg-red-500/10 text-red-500 font-black text-[8px] mb-2">CRITICAL</Badge>
                                        <h4 className="text-sm font-black uppercase tracking-tight leading-tight">{e.title}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Submitted by {e.by}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 group-hover:bg-[#7ede56]/20 transition-colors">
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-[#002f37] text-white font-black text-[9px] h-9 rounded-xl">ASSIGN</Button>
                                    <Button variant="outline" className="flex-1 font-black text-[9px] h-9 rounded-xl">VIEW DETAILS</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Action-First Alert Strip */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.map((alert) => (
                    <Card 
                        key={alert.type} 
                        className={`group cursor-pointer border-none shadow-premium transition-all duration-300 relative overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'} ${alert.count > 0 ? `ring-2 ring-transparent hover:ring-[${alert.color.split(' ')[2]}]/20 animate-subtle-glow` : ''}`}
                        onClick={() => handleQuickAction(alert.type)}
                    >
                        {alert.count > 0 && (
                            <div className={`absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity ${alert.pulseColor} blur-2xl`}></div>
                        )}
                        <CardContent className="p-5 flex items-center gap-4 relative z-10">
                            <div className={`p-4 rounded-2xl ${alert.color} group-hover:scale-110 transition-transform`}>
                                <alert.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-4xl font-black tracking-tighter leading-none">{alert.count}</span>
                                    <div className="flex flex-col">
                                        <h4 className={`text-[11px] font-black uppercase tracking-widest truncate ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{alert.title}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{alert.description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#7ede56]/20 transition-colors">
                                <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#002f37]" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Action Drawer */}
            <Sheet open={!!drawerType} onOpenChange={(val) => !val && setDrawerType(null)}>
                <SheetContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-gray-950">
                    <div className="bg-[#002f37] p-8 text-white relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
                        <SheetHeader className="relative z-10 text-left">
                            <div className="flex justify-between items-center mb-6">
                                <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[9px] uppercase px-3">QUICK ACTION HUB</Badge>
                                <Button variant="ghost" onClick={() => setDrawerType(null)} className="h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <SheetTitle className="text-3xl font-black text-white uppercase tracking-tighter">
                                {alerts.find(a => a.type === drawerType)?.title}
                            </SheetTitle>
                            <SheetDescription className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.2em] mt-1 italic">
                                Action required for {drawerType?.replace('-', ' ')} protocol
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    <div className="p-8 pb-32 max-h-screen overflow-y-auto custom-scrollbar">
                        {renderDrawerContent()}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white dark:from-gray-950 via-white/90 dark:via-gray-950/90 to-transparent">
                        <Button 
                            className="w-full h-14 bg-[#002f37] hover:bg-black text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl flex gap-3 group"
                            onClick={() => {
                                const path = alerts.find(a => a.type === drawerType)?.title.toLowerCase().includes('agent') ? '/dashboard/super-admin/agents' : '/dashboard/super-admin/oversight';
                                navigate(path);
                                setDrawerType(null);
                            }}
                        >
                            View Full Resolution Center <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Compact Platform Health Bar - Slim Heartbeat Strip */}
            <Card className={`border-none ${darkMode ? 'bg-gray-900 border border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.4)]' : 'bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'} overflow-hidden relative group rounded-2xl mb-8 transition-colors duration-300`}>
                {darkMode && <div className="absolute inset-0 bg-gradient-to-r from-[#7ede56]/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>}
                
                <CardContent className="p-0">
                    <div className={`flex flex-col md:flex-row items-center divide-x ${darkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 flex-1">
                            {healthStats.map((stat, idx) => (
                                <div key={idx} className={`px-6 py-4 flex flex-col justify-center border-r ${darkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-gray-50 hover:bg-gray-50/50'} last:border-r-0 group/item transition-colors relative h-20`}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <stat.icon className={`w-3 h-3 ${stat.color} opacity-80 group-hover/item:opacity-100 transition-opacity`} />
                                        <span className="text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] leading-none">{stat.label}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'} tracking-tighter tabular-nums`}>{stat.value}</span>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-2.5 h-2.5 text-[#7ede56] opacity-60" />
                                            <span className="text-[7.5px] font-black text-[#7ede56] uppercase tracking-wider">+ {Math.floor(Math.random() * 5) + 1}%</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-[#7ede56]/0 group-hover/item:bg-[#7ede56]/40 transition-all duration-500" />
                                </div>
                            ))}
                        </div>
                        
                        {/* Integrated Status Area */}
                        <div className={`${darkMode ? 'bg-black/40' : 'bg-gray-50/80'} backdrop-blur-sm self-stretch flex items-center px-8 gap-10`}>
                            <div className="flex items-center gap-3">
                                <div className="relative h-1.5 w-1.5">
                                    <div className="absolute inset-0 rounded-full bg-[#7ede56] animate-ping opacity-75"></div>
                                    <div className="relative h-1.5 w-1.5 rounded-full bg-[#7ede56]"></div>
                                </div>
                                <span className={`text-[9px] font-black ${darkMode ? 'text-white/40' : 'text-gray-400'} uppercase tracking-[0.3em] whitespace-nowrap`}>Node 01 Sync</span>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                                <span className={`text-[8px] font-bold ${darkMode ? 'text-white/20' : 'text-gray-400'} uppercase tracking-widest whitespace-nowrap`}>Lat: <span className="text-[#7ede56]">14ms</span></span>
                                <span className={`text-[8px] font-bold ${darkMode ? 'text-white/20' : 'text-gray-400'} uppercase tracking-widest whitespace-nowrap`}>Enc: <span className="text-blue-500">AES</span></span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stat Cards - Decision Drivers */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((card, index) => (
                    <Card
                        key={index}
                        className={`${card.color} border-none shadow-premium hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden h-40 group`}
                        onClick={() => navigate(card.path)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardHeader className="p-5 pb-0 relative z-20 flex flex-row items-center justify-between space-y-0">
                            <div className={`p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10`}>
                                <card.icon className={`h-4 w-4 text-white`} />
                            </div>
                            <div className="bg-white/10 p-1.5 rounded-lg opacity-40 group-hover:opacity-100 group-hover:bg-white text-white group-hover:text-[#002f37] transition-all">
                                <ArrowRight className="h-3 w-3" />
                            </div>
                        </CardHeader>

                        <CardContent className="p-5 pt-4 relative z-20 flex flex-col justify-end h-[calc(10rem-3rem)]">
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">
                                {card.title}
                            </p>
                            <h3 className="text-3xl font-black text-white tracking-tighter">
                                {card.value}
                            </h3>
                            <p className="text-[8px] font-bold mt-1 text-white/50 uppercase tracking-wide truncate italic">
                                {card.subtitle}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Operations Control Center - Tabbed Interface */}
            <Tabs defaultValue="ops" className="w-full">
                <TabsList className="bg-gray-100 dark:bg-black/20 p-1 rounded-2xl h-14 mb-8">
                    <TabsTrigger value="ops" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-full data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] shadow-sm transition-all flex gap-3">
                        <Globe className="w-4 h-4" /> Regional Distribution
                    </TabsTrigger>
                    <TabsTrigger value="queue" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-full data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] shadow-sm transition-all flex gap-3">
                        <Zap className="w-4 h-4" /> Workflow Queue
                    </TabsTrigger>
                    <TabsTrigger value="intelligence" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-full data-[state=active]:bg-[#002f37] data-[state=active]:text-[#7ede56] shadow-sm transition-all flex gap-3">
                        <Activity className="w-4 h-4" /> Platform Intelligence
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="ops" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                        <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-[#7ede56]" /> Regional Distribution
                                </CardTitle>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live coverage analytics across Ghana</p>
                            </div>
                            <Badge variant="outline" className="text-[8px] font-black uppercase border-2 border-slate-100 px-3">NATIONAL VIEW</Badge>
                        </CardHeader>
                        <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                {stats?.regionalDistribution?.slice(0, 3).map((region: any, idx: number) => (
                                    <div key={idx} className="space-y-2 group">
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${region.status === 'on-track' ? 'bg-[#7ede56]' : region.status === 'at-risk' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
                                                <span className="text-[11px] font-black uppercase tracking-widest text-[#002f37] dark:text-white group-hover:text-[#7ede56] transition-colors">{region.name}</span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter ml-2">({region.activeAgents} Agents Active)</span>
                                            </div>
                                            <span className="text-[11px] font-black text-[#002f37] dark:text-white">{region.value} UNITS</span>
                                        </div>
                                        <div className="h-4 w-full bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden shadow-inner flex items-center p-0.5">
                                            <div 
                                                className={`h-full rounded-full bg-gradient-to-r from-[#002f37] to-[#7ede56] transition-all duration-1000`}
                                                style={{ width: `${Math.min((region.value / 1000) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-6">
                                {stats?.regionalDistribution?.slice(3, 6).map((region: any, idx: number) => (
                                    <div key={idx} className="space-y-2 group">
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${region.status === 'on-track' ? 'bg-[#7ede56]' : region.status === 'at-risk' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
                                                <span className="text-[11px] font-black uppercase tracking-widest text-[#002f37] dark:text-white group-hover:text-[#7ede56] transition-colors">{region.name}</span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter ml-2">({region.activeAgents} Agents Active)</span>
                                            </div>
                                            <span className="text-[11px] font-black text-[#002f37] dark:text-white">{region.value} UNITS</span>
                                        </div>
                                        <div className="h-4 w-full bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden shadow-inner flex items-center p-0.5">
                                            <div 
                                                className={`h-full rounded-full bg-gradient-to-r from-[#002f37] to-[#7ede56] transition-all duration-1000`}
                                                style={{ width: `${Math.min((region.value / 1000) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                            <Button variant="ghost" onClick={() => navigate('/dashboard/super-admin/regions')} className="w-full text-[#002f37] dark:text-[#7ede56] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-white/5 h-14 rounded-xl group">
                                View Full Coverage Analysis Report <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="queue" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                        <Card className={`lg:col-span-10 border-none shadow-premium overflow-hidden ${darkMode ? 'bg-[#f8fafc] border border-gray-200' : 'bg-gray-50 border border-gray-100'} ring-4 ring-black/5`}>
                            <CardHeader className="pb-6 border-b border-gray-200/50 bg-white dark:bg-gray-900/10 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-amber-500" /> Operational Workflow Queue
                                    </CardTitle>
                                    <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mt-1 italic">High priority verifications and field escalations</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-amber-500 text-white font-black text-[10px] h-6 px-2.5 tracking-widest">11 ITEMS PENDING</Badge>
                                    <Button variant="outline" className="h-8 rounded-lg text-[9px] font-black uppercase" onClick={() => navigate('/dashboard/super-admin/escalations')}>Full Queue</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8 p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 pb-10">
                                    {/* Verifications Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div> Farmer KYC (5)
                                        </h4>
                                        {[
                                            { name: 'Kofi Owusu', region: 'Western', agent: 'Sarkodie', time: '2h ago' },
                                            { name: 'Efua Mensah', region: 'Central', agent: 'Ekow', time: '5h ago' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4 group hover:border-amber-500/30 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h5 className="text-sm font-black uppercase">{item.name}</h5>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase">{item.region} • Field Agent: {item.agent}</p>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.time}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="flex-1 bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black text-[9px] h-10 rounded-xl" onClick={() => toast.success(`Farmer ${item.name} verified.`)}>Approve ✓</Button>
                                                    <Button variant="outline" size="sm" className="flex-1 text-rose-500 border-rose-100 font-black text-[9px] h-10 rounded-xl">Reject ✗</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Escalations Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div> Critical Alerts (3)
                                        </h4>
                                        {[
                                            { title: 'Payment Delay - Ashanti', priority: 'Critical', by: 'Agent Sarkodie' },
                                            { title: 'Data Missing - Western', priority: 'High', by: 'Agent Janet' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4 group">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <Badge className={`${item.priority === 'Critical' ? 'bg-red-500' : 'bg-amber-500'} text-white font-black text-[7.5px] mb-2 leading-none h-4 tracking-widest`}>{item.priority.toUpperCase()}</Badge>
                                                        <h5 className="text-sm font-black uppercase leading-tight">{item.title}</h5>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Logged by {item.by}</p>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-[#002f37] dark:text-[#7ede56] border border-gray-100 dark:border-gray-800 rounded-xl"><ArrowUpRight className="w-5 h-5" /></Button>
                                                </div>
                                                <Button size="sm" className="w-full bg-[#002f37] text-white font-black text-[10px] h-11 rounded-xl shadow-lg">Assign Resolution</Button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* System Tasks Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> Audit Tasks (3)
                                        </h4>
                                        <Card className="bg-[#002f37] text-white p-6 rounded-2xl border-none">
                                            <h4 className="text-xs font-black uppercase tracking-widest mb-4">Pending Audit Pool</h4>
                                            <p className="text-[10px] font-medium text-white/60 mb-6 leading-relaxed uppercase">3 agents have not synced missions in the last 48 hours. Batch audit recommended.</p>
                                            <Button className="w-full bg-[#7ede56] text-[#002f37] font-black text-[10px] uppercase h-12 rounded-xl">Initialize Audit</Button>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="intelligence" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Farm Health Summary (Column 1) */}
                        <Card className={`lg:col-span-4 border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                    <PieChartIcon className="w-5 h-5 text-[#7ede56]" /> Farm Health Matrix
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2 pb-8 space-y-8">
                                <div className="h-[180px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={farmHealthData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {farmHealthData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <ReTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-3xl font-black tracking-tighter">78</span>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ECOSYSTEM</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 px-6 border-y border-gray-50 dark:border-white/5 py-6">
                                    {farmHealthData.map(item => (
                                        <div key={item.name} className="flex flex-col items-center">
                                            <span className="text-xl font-black" style={{ color: item.color }}>{item.value}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4 px-2 pt-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Critical Follow-up Points</p>
                                    {[
                                        { farm: 'Obour Farms', region: 'Western', status: 'At Risk' },
                                        { farm: 'Greater Green', region: 'Eastern', status: 'Off Track' },
                                    ].map((farm, i) => (
                                        <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-[#7ede56]/20">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${farm.status === 'At Risk' ? 'bg-amber-500' : 'bg-red-600'} animate-pulse`} />
                                                <span className="text-xs font-black uppercase tracking-tight">{farm.farm}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <span className="text-[9px] font-bold uppercase">{farm.region}</span>
                                                <ExternalLink className="w-3.5 h-3.5 group-hover:text-[#7ede56]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Agency Metrics (Column 2) */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Widget 2: Agent Performance */}
                                <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} relative`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16" /></div>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-blue-500" /> Agency Efficiency
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 pb-8 space-y-8">
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <p className="text-[10px] font-black text-[#7ede56] uppercase tracking-[0.3em] flex items-center gap-2">
                                                    <div className="h-1 w-3 bg-[#7ede56] rounded-full"></div> Top Perforners
                                                </p>
                                                {[
                                                    { name: 'Sarkodie King', val: '98%', rank: 'ELITE' },
                                                    { name: 'Janet Osei', val: '94%', rank: 'ELITE' },
                                                ].map((a, i) => (
                                                    <div key={i} className="flex justify-between items-end border-b border-gray-50 dark:border-white/5 pb-2">
                                                        <div>
                                                            <p className="text-xs font-black uppercase leading-none">{a.name}</p>
                                                            <p className="text-[8px] font-bold text-[#7ede56] uppercase mt-1 tracking-widest">{a.rank}</p>
                                                        </div>
                                                        <p className="text-lg font-black tracking-tighter text-[#7ede56]">{a.val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-6">
                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                                    <div className="h-1 w-3 bg-rose-500 rounded-full"></div> Low Engagement
                                                </p>
                                                {[
                                                    { name: 'Francis Lamptey', val: '40%', status: 'INACTIVE' },
                                                    { name: 'Adama Musah', val: '52%', status: 'LAGGING' },
                                                ].map((a, i) => (
                                                    <div key={i} className="flex justify-between items-end border-b border-gray-50 dark:border-white/5 pb-2">
                                                        <div>
                                                            <p className="text-xs font-black uppercase leading-none">{a.name}</p>
                                                            <p className="text-[8px] font-bold text-rose-400 uppercase mt-1 tracking-widest">{a.status}</p>
                                                        </div>
                                                        <p className="text-lg font-black tracking-tighter text-rose-500">{a.val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button variant="ghost" onClick={() => navigate('/dashboard/super-admin/agents')} className="flex-1 h-14 border border-gray-100 dark:border-gray-800 font-black text-[10px] uppercase tracking-widest rounded-2xl group">
                                                Staff Directory <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </Button>
                                            <Button variant="ghost" onClick={() => navigate('/dashboard/super-admin/audit')} className="flex-1 h-14 border border-[#7ede56]/20 font-black text-[10px] uppercase tracking-widest rounded-2xl bg-[#7ede56]/5 text-[#7ede56] hover:bg-[#7ede56]/10">
                                                Verify Records
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Widget 3: Data Integrity (Compact) */}
                                <Card className={`border-none shadow-premium overflow-hidden bg-[#002f37] text-white p-2`}>
                                    <CardContent className="p-8 space-y-10">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                                                <span className="flex items-center gap-2 underline underline-offset-8 decoration-[#7ede56] decoration-2">Global Data Integrity</span>
                                                <span className="text-[#7ede56] text-xl tracking-tighter">98.1%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                                                <div className="h-full bg-gradient-to-r from-blue-500 to-[#7ede56] w-[98%] rounded-full" />
                                            </div>
                                            <p className="text-[8px] font-medium text-white/40 uppercase tracking-widest text-right italic">Satellite Sync Active</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                                                <span className="flex items-center gap-2 underline underline-offset-8 decoration-blue-400 decoration-2">Training Performance</span>
                                                <span className="text-blue-400 text-xl tracking-tighter">60.6%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                                                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 w-[60%] rounded-full" />
                                            </div>
                                            <p className="text-[8px] font-medium text-white/40 uppercase tracking-widest text-right italic">Grower Modules Complete</p>
                                        </div>
                                        <Button className="w-full h-14 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl">
                                            System Intelligence Center
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Bottom Row - Full Width Network Integrity Map / Pulse */}
            <Card className={`border-none shadow-premium overflow-hidden bg-gradient-to-r from-[#002f37] to-[#004d5a] relative group`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-full bg-[#7ede56]/10 flex items-center justify-center border-2 border-[#7ede56]/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#7ede56] animate-ping opacity-20"></div>
                            <Globe className="w-8 h-8 text-[#7ede56] relative z-10" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Global Operation Network</h3>
                            <p className="text-[10px] font-bold text-[#7ede56] uppercase tracking-[0.3em] mt-1 italic">Synchronization with satellite nodes active</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-12 text-center">
                        <div>
                            <p className="text-2xl font-black text-white tracking-tighter">1,248</p>
                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Daily Logins</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white tracking-tighter">42ms</p>
                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Query Latency</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white tracking-tighter">99.9%</p>
                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Data Uptime</p>
                        </div>
                    </div>

                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-white font-black uppercase text-[10px] tracking-widest h-14 px-10 rounded-2xl shadow-xl transition-all hover:scale-105">
                        Open Full Interactive Map
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Overview;
