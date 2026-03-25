import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
    Tooltip as ReTooltip
} from 'recharts';
import {
    Map as MapIcon,
    Users,
    Globe,
    TrendingUp,
    ArrowUpRight,
    Search,
    Filter,
    ShieldCheck,
    Briefcase,
    Sprout,
    MapPin,
    Building2,
    Database,
    Layers,
    Activity,
    Package,
    Navigation,
    Cpu,
    Zap,
    BarChart3,
    PieChart,
    CheckCircle2,
    Coins,
    Wheat,
    Tractor,
    ArrowRight
} from 'lucide-react';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useToast } from "@/components/ui/use-toast";
import CountUp from '@/components/CountUp';

const RegionalPerformance = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [regions, setRegions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMetric, setSelectedMetric] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterLevel, setFilterLevel] = useState('All');
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // We've already ensured backend handles mock fallback if DB is down
                const res = await api.get('/super-admin/regions');
                if (res.data && res.data.length > 0) {
                    // Enrich real data with visual fields for dashboard aesthetics if missing
                    const enrichedData = res.data.map((r: any) => ({
                        ...r,
                        agentCount: r.agentCount || 0,
                        farmersCount: r.farmersCount || 0,
                        farmsCount: r.farmsCount || 0,
                        growth: r.growth || [0, 0, 0, 0, 0, 0],
                        whCapacity: r.whCapacity || 1000,
                        whLevel: r.whLevel || 0,
                        productivity: r.productivity || 'Medium',
                        activeInvestments: r.activeInvestments || 0,
                        dominatingCommodity: r.dominatingCommodity || 'Maize'
                    }));
                    setRegions(enrichedData);
                    const totals = enrichedData.reduce((acc: any, curr: any) => ({
                        agents: acc.agents + (curr.agentCount || 0),
                        farmers: acc.farmers + (curr.farmersCount || 0),
                        farms: acc.farms + (curr.farmsCount || 0),
                    }), { agents: 0, farmers: 0, farms: 0 });
                    setStats(totals);
                } else {
                    throw new Error('Empty');
                }
            } catch (err) {
                console.error('Failed to fetch regional data:', err);
                setRegions([]);
                setStats({ agents: 0, farmers: 0, farms: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getProductivityBadge = (level: string = 'high') => {
        switch (level.toLowerCase()) {
            case 'high': return <Badge className="bg-[#7ede56]/10 text-[#7ede56] border-[#7ede56]/20 font-black text-[9px] tracking-tighter">OPTIMAL INTENSITY</Badge>;
            case 'medium': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-black text-[9px] tracking-tighter">STEADY FLOW</Badge>;
            case 'low': return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-black text-[9px] tracking-tighter animate-pulse">CRITICAL LAG</Badge>;
            default: return <Badge variant="secondary">{level}</Badge>;
        }
    };

    const metrics = [
        {
            id: 'coverage',
            title: 'Global Coverage',
            value: regions.length,
            isString: false,
            color: 'bg-[#002f37]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: Globe,
            path: '#',
            description: 'Active Operational Nodes',
            details: '2 regions expanding coverage',
            trend: [
                { time: 'Jan', value: 2 },
                { time: 'Feb', value: 3 },
                { time: 'Mar', value: 4 },
                { time: 'Apr', value: 5 },
                { time: 'May', value: 6 },
                { time: 'Jun', value: 8 },
            ],
            breakdown: [
                { name: 'Rural', value: 60, color: '#a7f3d0' },
                { name: 'Peri-urban', value: 40, color: '#34d399' }
            ]
        },
        {
            id: 'agents',
            title: 'Operations Leaders',
            value: stats?.agents || 0,
            color: 'bg-[#0369a1]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: ShieldCheck,
            path: '/dashboard/super-admin/agents',
            description: 'Field Personnel',
            details: 'Active across 6 key regions',
            trend: [
                { time: 'Mon', value: 42 },
                { time: 'Tue', value: 45 },
                { time: 'Wed', value: 48 },
                { time: 'Thu', value: 52 },
                { time: 'Fri', value: 55 },
                { time: 'Sat', value: 54 },
            ],
            breakdown: [
                { name: 'Eastern', value: 40, color: '#bae6fd' },
                { name: 'Western', value: 30, color: '#7dd3fc' },
                { name: 'Northern', value: 30, color: '#38bdf8' }
            ]
        },
        {
            id: 'farmers',
            title: 'Farmer Network',
            value: stats?.farmers || 0,
            color: 'bg-[#7ede56]',
            textColor: 'text-[#002f37]',
            iconColor: 'text-[#002f37]',
            icon: Users,
            path: '/dashboard/super-admin/users',
            description: 'Total Registered Farmers',
            details: '12 new registrations this week',
            trend: [
                { time: 'Wk 1', value: 120 },
                { time: 'Wk 2', value: 145 },
                { time: 'Wk 3', value: 180 },
                { time: 'Wk 4', value: 210 },
                { time: 'Wk 5', value: 245 },
                { time: 'Wk 6', value: 289 },
            ],
            breakdown: [
                { name: 'Smallholder', value: 75, color: '#dcfce7' },
                { name: 'Commercial', value: 25, color: '#4ade80' }
            ]
        },
    ];

    const handleCardClick = (metric: any) => {
        setSelectedMetric(metric);
        setIsModalOpen(true);
    };

    const growthData = [
        { name: 'Jan', val: 400 },
        { name: 'Feb', val: 600 },
        { name: 'Mar', val: 800 },
        { name: 'Apr', val: 1200 },
        { name: 'May', val: 1800 },
        { name: 'Jun', val: 2400 },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Regional Command
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Geospatial Intelligence & Operational Performance
                    </p>
                </div>

            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {metrics.map((metric, index) => (
                    <Card
                        key={metric.id}
                        className={`${metric.color} border-none shadow-premium hover:scale-[1.05] transition-all duration-500 cursor-pointer relative overflow-hidden h-36 md:h-44 group`}
                        onClick={() => handleCardClick(metric)}
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                            <metric.icon className={`h-32 w-32 absolute -right-4 -bottom-4 rotate-12 ${metric.iconColor}`} />
                        </div>

                        <CardHeader className="p-4 pb-0 relative z-20 flex flex-row items-center justify-between space-y-0">
                            <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-md`}>
                                <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                            </div>
                            <div className="flex items-center gap-1">
                                <ArrowUpRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-4 relative z-20 flex flex-col justify-end h-[calc(9rem-3rem)] md:h-[calc(11.5rem-3rem)] transition-all duration-500 group-hover:-translate-y-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 truncate text-white/80">
                                {metric.title}
                            </p>
                            <h3 className={`text-2xl md:text-3xl font-black ${metric.textColor}`}>
                                {loading ? (
                                    <span className="animate-pulse">...</span>
                                ) : metric.isString ? (
                                    metric.value
                                ) : (
                                    <CountUp end={typeof metric.value === 'number' ? metric.value : 0} duration={1500} />
                                )}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <TrendingUp className="h-3 w-3 text-[#7ede56]" />
                                <p className="text-[9px] font-bold line-clamp-1 uppercase tracking-tighter text-white/60">
                                    {metric.description}
                                </p>
                            </div>
                        </CardContent>

                        {/* Hover Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Card>
                ))}
            </div>

            {/* Metric Details Modal - Condensed & Floating Top-Right Quadrant */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className={`w-[320px] border-none shadow-premium rounded-[32px] overflow-hidden p-0 fixed top-28 right-12 left-auto bottom-auto translate-x-0 translate-y-0 animate-in slide-in-from-top-2 duration-500 ${darkMode ? 'bg-[#002f37] text-white' : 'bg-white'}`}>
                    {selectedMetric && (
                        <div className="relative">
                            {/* Decorative Header - Compact */}
                            <div className={`h-24 w-full ${selectedMetric.color} flex items-center justify-center relative overflow-hidden`}>
                                <selectedMetric.icon className="w-32 h-32 absolute -right-6 -bottom-6 opacity-20 rotate-12 text-white" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                                <div className="relative z-10 text-center">
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-80 mb-0.5 text-white">Live Intel</p>
                                    <DialogTitle className={`text-xl font-black uppercase tracking-tighter ${selectedMetric.textColor}`}>{selectedMetric.title}</DialogTitle>
                                    <DialogDescription className="sr-only">Detailed metrics and momentum for {selectedMetric.title}</DialogDescription>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'} border-l-4 border-[#7ede56] flex justify-between items-center`}>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Current</p>
                                            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                {selectedMetric.isString ? selectedMetric.value : <CountUp end={selectedMetric.value} duration={1000} />}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[8px] px-1.5 py-0 mb-1">ACTIVE</Badge>
                                            <p className={`text-[8px] font-bold block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedMetric.details}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Trend Chart - Very Condensed */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingUp className="w-3 h-3 text-[#7ede56]" />
                                            <h4 className="text-[8px] font-black uppercase tracking-widest">Momentum</h4>
                                        </div>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase">7D Trend</span>
                                    </div>
                                    <div className="h-[80px] w-full bg-gray-50/30 dark:bg-black/10 rounded-xl p-2 border border-black/5 dark:border-white/5">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={selectedMetric.trend}>
                                                <defs>
                                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={selectedMetric.id === 'logins' ? '#002f37' : '#7ede56'} stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor={selectedMetric.id === 'logins' ? '#002f37' : '#7ede56'} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke='#7ede56'
                                                    strokeWidth={2}
                                                    fillOpacity={1}
                                                    fill="url(#colorVal)"
                                                />
                                                <XAxis dataKey="time" hide />
                                                <YAxis hide />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Breakdown Icons */}
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedMetric.breakdown.map((item: any) => (
                                        <div key={item.name} className={`px-3 py-2 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'} flex items-center justify-between border border-transparent hover:border-[#7ede56]/30 transition-colors`}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-[7px] font-black uppercase tracking-tighter text-gray-400">{item.name}</span>
                                            </div>
                                            <span className={`text-[10px] font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{item.value}%</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    className="w-full h-11 bg-[#7ede56] hover:bg-[#6bcb4b] text-[#002f37] font-black uppercase text-[9px] tracking-[0.15em] rounded-xl shadow-lg transition-all"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        navigate(selectedMetric.path);
                                    }}
                                >
                                    Full Data Perspective
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Region Details Modal - Redesigned Premium Interface */}
            <Dialog open={isRegionModalOpen} onOpenChange={setIsRegionModalOpen}>
                <DialogContent className={`w-full max-w-6xl h-[85vh] border-none shadow-2xl rounded-[24px] overflow-hidden p-0 flex flex-col ${darkMode ? 'bg-[#020617] text-white' : 'bg-white text-[#002f37]'}`}>
                    {selectedRegion && (
                        <>
                            {/* Modal Header Premium Redesign */}
                            <div className="relative shrink-0 overflow-hidden">
                                <div className={`absolute inset-0 ${darkMode ? 'bg-[#7ede56]/5' : 'bg-[#7ede56]/10'} z-0`}></div>
                                {/* Abstract Header Pattern */}
                                <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: `radial-gradient(${darkMode ? '#7ede56' : '#047857'} 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>

                                <div className={`relative z-10 px-8 py-8 border-b ${darkMode ? 'border-white/10' : 'border-gray-200/60'} flex items-start justify-between`}>
                                    <div className="flex gap-6 items-center">
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group ${darkMode ? 'bg-black/40 border border-white/10' : 'bg-white border border-gray-100'}`}>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#7ede56]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <MapPin className="w-10 h-10 text-[#7ede56] drop-shadow-[0_0_15px_rgba(146, 21, 115,0.5)]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <DialogTitle className={`text-4xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                    {selectedRegion._id}
                                                </DialogTitle>
                                                <DialogDescription className="sr-only">Comprehensive operational analysis for {selectedRegion._id} command unit.</DialogDescription>
                                                <Badge className="bg-[#7ede56] text-[#002f37] border-none font-black text-[10px] px-2 py-0.5 uppercase tracking-widest shadow-lg shadow-[#7ede56]/20">
                                                    Zone {String(selectedRegion._id).substring(0, 3)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider opacity-60">
                                                <span className="flex items-center gap-1.5">
                                                    <Activity className="w-3.5 h-3.5 text-[#7ede56]" /> Live Telemetry
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                                                <span className="flex items-center gap-1.5">
                                                    <Globe className="w-3.5 h-3.5 text-blue-500" /> Strategic Command Center
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className={`h-12 px-6 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl border-2 hover:scale-105 transition-transform ${darkMode ? 'border-white/20 bg-white/5 text-white hover:bg-white/10' : 'border-gray-200 text-gray-600'}`}>
                                            Export Report
                                        </Button>
                                        <Button className="h-12 px-8 bg-[#7ede56] text-[#002f37] hover:bg-[#6edc41] font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-[0_0_30px_-5px_rgba(146, 21, 115,0.4)] hover:shadow-[0_0_40px_-5px_rgba(146, 21, 115,0.6)] hover:scale-105 transition-all duration-300">
                                            <Activity className="w-4 h-4 mr-2" /> Live Action
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content Tabs */}
                            <Tabs value={activeModalTab} onValueChange={setActiveModalTab} className="flex-1 flex flex-col min-h-0 bg-transparent">
                                <div className={`px-8 border-b sticky top-0 z-20 backdrop-blur-sm ${darkMode ? 'bg-[#020617]/80 border-white/5' : 'bg-white/80 border-gray-100'}`}>
                                    <TabsList className="h-16 bg-transparent gap-10 p-0 w-full justify-start overflow-x-auto">
                                        {['overview', 'farmers', 'team', 'investments'].map((tab) => (
                                            <TabsTrigger
                                                key={tab}
                                                value={tab}
                                                className="h-full rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#7ede56] data-[state=active]:bg-transparent px-2 font-black uppercase text-[11px] tracking-[0.15em] text-gray-400 data-[state=active]:text-[#7ede56] transition-all hover:text-[#7ede56]/70 relative group"
                                            >
                                                <span className="relative z-10">{tab.replace('investments', 'Active Projects').replace('team', 'Field Agents').replace('farmers', 'Farmer Base').replace('overview', 'Overview')}</span>
                                                {/* Hover glow effect */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#7ede56]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-0 top-1/2"></div>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                                    {/* DASHBOARD TAB */}
                                    <TabsContent value="overview" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Key Metric Cards - Glassmorphic Redesign */}
                                            {[
                                                {
                                                    val: selectedRegion.agentCount,
                                                    label: 'Field Commanders',
                                                    sub: 'Deployed & Active',
                                                    icon: ShieldCheck,
                                                    color: 'text-blue-500',
                                                    bg: 'bg-blue-500/10',
                                                    trend: '+3 this week'
                                                },
                                                {
                                                    val: selectedRegion.farmersCount,
                                                    label: 'Farmer Network',
                                                    sub: 'Registered Members',
                                                    icon: Users,
                                                    color: 'text-[#7ede56]',
                                                    bg: 'bg-[#7ede56]/10',
                                                    trend: '+12% growth'
                                                },
                                                {
                                                    val: selectedRegion.activeInvestments,
                                                    label: 'Capital Injection',
                                                    sub: 'Active Projects',
                                                    icon: Activity, // Using Activity as replacement icon
                                                    color: 'text-[#7ede56]',
                                                    bg: 'bg-[#7ede56]/10',
                                                    trend: '98% on track'
                                                }
                                            ].map((item, i) => (
                                                <div key={i} className={`p-6 rounded-3xl border relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${darkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                                        <div className={`p-3 rounded-2xl ${item.bg} ${item.color} shadow-inner`}>
                                                            {i === 2 ? <Activity className="w-6 h-6" /> : <item.icon className="w-6 h-6" />}
                                                        </div>
                                                        <Badge variant="outline" className={`border-none ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'} text-[9px] font-black uppercase tracking-widest`}>
                                                            {item.trend}
                                                        </Badge>
                                                    </div>
                                                    <div className="relative z-10">
                                                        <h3 className={`text-4xl font-black mb-1 tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                            {item.val}
                                                        </h3>
                                                        <p className="text-[11px] font-black uppercase tracking-[0.1em] opacity-80 mb-0.5">{item.label}</p>
                                                        <p className="text-[10px] font-bold uppercase tracking-wide opacity-40">{item.sub}</p>
                                                    </div>
                                                    {/* Background Glow */}
                                                    <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[50px] opacity-20 transition-opacity duration-500 ${item.bg.replace('/10', '')}`}></div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Main Chart - Futuristic Container */}
                                        <div className={`p-1 rounded-[32px] bg-gradient-to-br ${darkMode ? 'from-white/10 to-transparent' : 'from-gray-200 to-transparent'}`}>
                                            <div className={`p-8 rounded-[30px] border relative overflow-hidden ${darkMode ? 'bg-[#020617] border-white/5' : 'bg-white border-gray-100 shadow-2xl'}`}>
                                                {/* Chart Header */}
                                                <div className="flex justify-between items-end mb-8 relative z-10">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-2 h-8 bg-[#7ede56] rounded-full"></div>
                                                            <h3 className={`text-2xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                                Growth Trajectory
                                                            </h3>
                                                        </div>
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">6-Month Output Velocity Analysis</p>
                                                    </div>
                                                    <div className={`flex p-1 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                        {['1M', '3M', '6M', 'YTD'].map(t => (
                                                            <button key={t} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${t === '6M' ? 'bg-[#7ede56] text-[#002f37] shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Chart */}
                                                <div className="h-[350px] w-full relative z-10">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={(selectedRegion.growth || []).map((v: number, i: number) => ({ name: `Month ${i + 1}`, value: v }))}>
                                                            <defs>
                                                                <linearGradient id="gradientFlow" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#7ede56" stopOpacity={0.5} />
                                                                    <stop offset="95%" stopColor="#7ede56" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#6b7280' : '#9ca3af', fontSize: 10, fontWeight: 700 }} dy={15} />
                                                            <YAxis hide />
                                                            <Tooltip
                                                                cursor={{ stroke: '#7ede56', strokeWidth: 2, strokeDasharray: '4 4' }}
                                                                contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#fff', border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)', padding: '12px 20px' }}
                                                                itemStyle={{ color: '#002f37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px' }}
                                                                labelStyle={{ color: darkMode ? '#94a3b8' : '#64748b', marginBottom: '8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                                            />
                                                            <Area type="monotone" dataKey="value" stroke="#7ede56" strokeWidth={4} fill="url(#gradientFlow)" activeDot={{ r: 6, strokeWidth: 0, fill: '#7ede56' }} />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>

                                                {/* Background Grid */}
                                                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${darkMode ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* FARMERS LIST TAB - UNIFIED TABLE STYLING */}
                                    <TabsContent value="farmers" className="mt-0 animate-in fade-in duration-300">
                                        <div className={`overflow-hidden rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                                        <th className="p-4 border-r border-[#ffffff20]">Farmer Profile</th>
                                                        <th className="p-4 border-r border-[#ffffff20]">Main Crop</th>
                                                        <th className="p-4 border-r border-[#ffffff20]">Yield Status</th>
                                                        <th className="p-4 text-right">Acreage</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {(selectedRegion?.farmers || []).map((farmer: any, i: number) => (
                                                        <tr key={i} className={`border-b group transition-colors ${darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                                        {farmer.name ? farmer.name.substring(0, 2).toUpperCase() : 'U'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold">{farmer.name || 'Unknown'}</p>
                                                                        <p className="text-[9px] opacity-50 uppercase tracking-wide">ID: {farmer.id || `FRM-${202400 + i}`}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <Wheat className="w-3 h-3 opacity-50" />
                                                                    {farmer.mainCrop || 'N/A'}
                                                                </div>
                                                            </td>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <Badge variant="outline" className={`border-none bg-[#7ede56]/10 text-[#7ede56] text-[8px] font-black`}>On Track</Badge>
                                                            </td>
                                                            <td className="p-4 text-right font-mono font-bold opacity-70">
                                                                {farmer.acreage || 0} ac
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </TabsContent>

                                    {/* TEAM LIST TAB - UNIFIED TABLE STYLING */}
                                    <TabsContent value="team" className="mt-0 animate-in fade-in duration-300">
                                        <div className={`overflow-hidden rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                                        <th className="p-4 border-r border-[#ffffff20]">Agent Profile</th>
                                                        <th className="p-4 border-r border-[#ffffff20]">Assigned Area</th>
                                                        <th className="p-4 border-r border-[#ffffff20]">Performance</th>
                                                        <th className="p-4 text-right">Farmers</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {(selectedRegion?.team || []).map((member: any, i: number) => (
                                                        <tr key={i} className={`border-b group transition-colors ${darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${darkMode ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-100 text-blue-600'}`}>
                                                                        {member.name ? member.name.substring(0, 2).toUpperCase() : 'U'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold">{member.name || 'Unknown'}</p>
                                                                        <p className="text-[9px] opacity-50 uppercase tracking-wide">{member.role || 'Field Officer'}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                {member.zone || `Zone ${String.fromCharCode(65 + i)}-0${i}`}
                                                            </td>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                                                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${member.performance || 0}%` }}></div>
                                                                    </div>
                                                                    <span className="text-[9px] font-bold">{member.performance || 0}%</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-right font-mono font-bold opacity-70">
                                                                {member.farmersCount || 0}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </TabsContent>

                                    {/* INVESTMENTS LIST TAB - UNIFIED TABLE STYLING */}
                                    <TabsContent value="investments" className="mt-0 animate-in fade-in duration-300">
                                        <div className={`overflow-hidden rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                                        <th className="p-4 border-r border-[#ffffff20]">Project ID</th>
                                                        <th className="p-4 border-r border-[#ffffff20]">Project Name</th>
                                                        <th className="p-4 border-r border-[#ffffff20]">Status</th>
                                                        <th className="p-4 border-r border-[#ffffff20]">Completion</th>
                                                        <th className="p-4 border-r border-[#ffffff20] text-right">Budget</th>
                                                        <th className="p-4 text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {(selectedRegion?.investmentsList || []).map((inv: any, i: number) => (
                                                        <tr key={i} className={`border-b group transition-colors ${darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <span className="font-mono opacity-70">{inv.id || `INV-${202488 + i}`}</span>
                                                            </td>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-[#7ede56]/10 text-[#7ede56]' : 'bg-[#7ede56]/10 text-[#7ede56]'}`}>
                                                                        <Coins className="w-3 h-3" />
                                                                    </div>
                                                                    <span className="font-bold">{inv.name || 'New Project'}</span>
                                                                </div>
                                                            </td>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <Badge variant="outline" className="text-[8px] font-black border-[#7ede56]/20 text-[#7ede56]">{inv.status || 'ACTIVE'}</Badge>
                                                            </td>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-1.5 w-16 bg-gray-700/20 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-gradient-to-r from-[#7ede56] to-indigo-500 rounded-full" style={{ width: `${inv.completion || 0}%` }}></div>
                                                                    </div>
                                                                    <span className="text-[9px] font-black opacity-60">{inv.completion || 0}%</span>
                                                                </div>
                                                            </td>
                                                            <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-right font-mono font-bold opacity-70`}>
                                                                GH₵ {(inv.budget || 0).toLocaleString()}
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <Button variant="ghost" size="sm" className="h-6 text-[9px] font-black uppercase tracking-wider text-[#7ede56] hover:text-[#6bcb4b] hover:bg-[#7ede56]/10">
                                                                    View Details
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Deep Intel Tabs */}
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <TabsList className={`p-1 h-12 rounded-2xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100 shadow-inner'}`}>
                        <TabsTrigger value="overview" className="rounded-xl px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-[#7ede56] data-[state=active]:text-[#002f37] gap-2 transition-all">
                            <Activity className="w-3.5 h-3.5" /> Performance Hub
                        </TabsTrigger>
                        <TabsTrigger value="gis" className="rounded-xl px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-[#7ede56] data-[state=active]:text-[#002f37] gap-2 transition-all">
                            <Layers className="w-3.5 h-3.5" /> GIS Analytics
                        </TabsTrigger>
                        <TabsTrigger value="warehouse" className="rounded-xl px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-[#7ede56] data-[state=active]:text-[#002f37] gap-2 transition-all">
                            <Package className="w-3.5 h-3.5" /> WH Monitoring
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className={`h-10 px-4 rounded-xl font-black border-2 border-dashed ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200'}`}>
                            LAST POLLING: <span className="text-[#7ede56] ml-2 font-mono">14:22:10 UTC</span>
                        </Badge>
                    </div>
                </div>

                {/* PERFORMANCE HUB */}
                <TabsContent value="overview" className="space-y-6 pt-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className={`text-lg font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Regional Command Units</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Operational Status & Yield Metrics</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`hidden md:flex font-black uppercase text-[9px] tracking-widest gap-2 bg-transparent border-dashed ${darkMode ? 'text-white border-gray-700 hover:bg-white/10' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <Filter className="w-3 h-3" /> {filterLevel === 'All' ? 'Filter Zones' : `${filterLevel} Intensity`}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={`w-48 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-500 p-2">Productivity Level</DropdownMenuLabel>
                                <DropdownMenuSeparator className={darkMode ? 'bg-gray-800' : ''} />
                                {['All', 'High', 'Medium', 'Low'].map((level) => (
                                    <DropdownMenuItem
                                        key={level}
                                        className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:bg-[#7ede56]/10 focus:text-[#7ede56] ${filterLevel === level ? 'text-[#7ede56]' : (darkMode ? 'text-white' : 'text-gray-700')}`}
                                        onClick={() => setFilterLevel(level)}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span>{level === 'All' ? 'View All Zones' : `${level} Intensity`}</span>
                                            {filterLevel === level && <CheckCircle2 className="w-3 h-3 text-[#7ede56]" />}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Regional Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {regions.filter(r => filterLevel === 'All' || r.productivity === filterLevel).map((region, index) => (
                                <Card key={index} className={`border-none shadow-premium group overflow-hidden relative ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}>
                                    {/* Decorative Top Line */}
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${region.productivity === 'High' ? 'from-[#7ede56] to-[#6bcb4b]' : 'from-blue-500 to-cyan-500'}`}></div>

                                    <CardHeader className="pb-4 relative z-10 flex flex-row items-start justify-between">
                                        <div className="flex gap-3">
                                            <div className={`p-2.5 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'} border border-white/10`}>
                                                <MapPin className={`w-5 h-5 ${region.productivity === 'High' ? 'text-[#7ede56]' : 'text-blue-500'}`} />
                                            </div>
                                            <div>
                                                <CardTitle className={`text-base font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                    {region._id}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className={`text-[8px] font-bold px-1.5 py-0 h-4 border-none ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                        {region.activeInvestments} ACTIVE INV.
                                                    </Badge>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block md:hidden">
                                                        {String(region._id).substring(0, 3)}-0{index + 1}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {getProductivityBadge(region.productivity)}
                                            <div className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 tracking-wider">
                                                {['Poultry', 'Cattle'].includes(region.dominatingCommodity) ? <Tractor className="w-3 h-3" /> : <Wheat className="w-3 h-3" />}
                                                {region.dominatingCommodity}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6 pt-2 relative z-10">
                                        {/* Core Metrics Grid - 4 Columns/Items */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {/* Agents */}
                                            <div className={`p-2 xl:p-3 rounded-2xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'} border border-transparent group-hover:border-white/5 transition-colors`}>
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <Briefcase className="w-3 h-3 text-blue-500" />
                                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Team</span>
                                                </div>
                                                <span className={`text-base xl:text-lg font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{region.agentCount || 0}</span>
                                            </div>
                                            {/* Farmers */}
                                            <div className={`p-2 xl:p-3 rounded-2xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'} border border-transparent group-hover:border-white/5 transition-colors`}>
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <Users className="w-3 h-3 text-[#7ede56]" />
                                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Farmers</span>
                                                </div>
                                                <span className={`text-base xl:text-lg font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{region.farmersCount || 0}</span>
                                            </div>
                                            {/* Active Investments */}
                                            <div className={`p-2 xl:p-3 rounded-2xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'} border border-transparent group-hover:border-white/5 transition-colors relative overflow-hidden`}>
                                                <div className={`absolute right-0 top-0 p-1 opacity-10`}>
                                                    <Coins className="w-8 h-8" />
                                                </div>
                                                <div className="flex items-center gap-1.5 mb-1.5 relative z-10">
                                                    <Coins className="w-3 h-3 text-[#7ede56]" />
                                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Invested</span>
                                                </div>
                                                <span className={`text-base xl:text-lg font-black relative z-10 ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{region.activeInvestments}</span>
                                            </div>
                                            {/* Yields */}
                                            <div className={`p-2 xl:p-3 rounded-2xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'} border border-transparent group-hover:border-white/5 transition-colors`}>
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <Sprout className="w-3 h-3 text-amber-500" />
                                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Yields</span>
                                                </div>
                                                <span className={`text-base xl:text-lg font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{region.farmsCount || 0}</span>
                                            </div>
                                        </div>

                                        {/* Mini Growth Chart */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end px-1">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Output Velocity</span>
                                                <div className="flex items-center gap-1 text-[#7ede56]">
                                                    <TrendingUp className="w-3 h-3" />
                                                    <span className="text-[9px] font-black">+12.5%</span>
                                                </div>
                                            </div>
                                            <div className={`h-12 w-full rounded-xl overflow-hidden ${darkMode ? 'bg-black/20' : 'bg-gray-50/50'}`}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={(region.growth || [0, 0, 0, 0, 0, 0]).map((v: number, i: number) => ({ v, i }))}>
                                                        <defs>
                                                            <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor={region.productivity === 'High' ? '#10b981' : '#3b82f6'} stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor={region.productivity === 'High' ? '#10b981' : '#3b82f6'} stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <Area
                                                            type="monotone"
                                                            dataKey="v"
                                                            stroke={region.productivity === 'High' ? '#10b981' : '#3b82f6'}
                                                            strokeWidth={2}
                                                            fill={`url(#grad-${index})`}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="pt-2 flex gap-2">
                                            <Button
                                                variant="ghost"
                                                className={`flex-1 h-9 text-[9px] font-black uppercase tracking-widest rounded-lg ${darkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                                                onClick={() => {
                                                    setSelectedRegion(region);
                                                    setActiveModalTab('investments');
                                                    setIsRegionModalOpen(true);
                                                    toast({
                                                        title: "Audit Log Initiated",
                                                        description: `Retrieving compliance data for ${region._id}...`,
                                                    });
                                                }}
                                            >
                                                Full Audit
                                            </Button>
                                            <Button
                                                className={`flex-1 h-9 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm gap-2 ${darkMode ? 'bg-white text-[#002f37] hover:bg-gray-200' : 'bg-[#002f37] text-white hover:bg-[#003c47]'}`}
                                                onClick={() => {
                                                    setSelectedRegion(region);
                                                    setActiveModalTab('overview');
                                                    setIsRegionModalOpen(true);
                                                }}
                                            >
                                                View Details <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>


                    </div>
                </TabsContent>

                {/* GIS INTELLIGENCE */}
                <TabsContent value="gis" className="h-[600px] relative rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
                    <div className={`absolute inset-0 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                        {/* Radar Grid Visual */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(${darkMode ? '#7ede56' : '#002f37'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

                        {/* Dynamic Markers */}
                        <div className="relative w-full h-full">
                            <div className="absolute top-1/4 left-1/3 animate-pulse">
                                <div className="h-10 w-10 border-2 border-[#7ede56] rounded-full flex items-center justify-center animate-ping absolute opacity-20"></div>
                                <div className="h-4 w-4 bg-[#7ede56] rounded-full border-2 border-white shadow-lg relative z-10"></div>
                                <div className="absolute top-6 left-6 bg-slate-900 text-white p-3 rounded-2xl border border-white/10 shadow-2xl min-w-[150px] backdrop-blur-xl">
                                    <p className="text-[8px] font-black text-[#7ede56] uppercase tracking-[0.2em] mb-1">Ashanti Core</p>
                                    <p className="text-xs font-black uppercase">Live Telemetry: 98%</p>
                                    <div className="flex gap-1 mt-2">
                                        <div className="h-1 flex-1 bg-[#7ede56] rounded-full"></div>
                                        <div className="h-1 flex-1 bg-[#7ede56] rounded-full"></div>
                                        <div className="h-1 flex-1 bg-gray-700 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* GIS Control Overlay */}
                        <div className="absolute bottom-10 left-10 p-6 rounded-[32px] bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-3xl max-w-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-2xl bg-white/5 text-[#7ede56]">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">GIS Neural Engine</h4>
                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-tighter">Status: Processing High-Res Imagery</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Latency', val: '24ms', color: 'bg-emerald-500' },
                                    { label: 'Syncing', val: '8.4 GB/s', color: 'bg-blue-500' },
                                    { label: 'Accuracy', val: '99.98%', color: 'bg-[#7ede56]' }
                                ].map((m, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{m.label}</span>
                                        <span className="text-[11px] font-black text-white">{m.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute top-10 right-10 flex flex-col gap-3">
                            {[Navigation, Layers, Search, Filter].map((Icon, i) => (
                                <Button key={i} variant="secondary" size="icon" className="h-12 w-12 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl border border-white/10 hover:bg-[#7ede56] hover:text-[#002f37] transition-all">
                                    <Icon className="w-5 h-5" />
                                </Button>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* WAREHOUSE MONITORING (WH TAB) */}
                <TabsContent value="warehouse" className="space-y-6 pt-2 animate-in slide-in-from-right-8 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className={`border-none shadow-premium ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black uppercase tracking-tight">Capacity Utilization Grid</CardTitle>
                                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Regional Warehouse Current Loads</CardDescription>
                                </div>
                                <BarChart3 className="w-8 h-8 text-[#7ede56] opacity-30" />
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={regions.map(r => ({
                                        name: r._id,
                                        level: r.whLevel || 0,
                                        cap: r.whCapacity || 1000
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#f3f4f6'} />
                                        <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 9, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: darkMode ? '#111827' : '#fff' }}
                                        />
                                        <Bar dataKey="level" fill="#7ede56" radius={[6, 6, 0, 0]} name="Used (Tons)" />
                                        <Bar dataKey="cap" fill={darkMode ? '#1f2937' : '#f3f4f6'} radius={[6, 6, 0, 0]} name="Total Capacity" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className={`border-none shadow-premium relative overflow-hidden ${darkMode ? 'bg-indigo-950/20' : 'bg-indigo-50 border border-indigo-100'}`}>
                                <div className="absolute top-0 left-0 h-full w-1 bg-indigo-500"></div>
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
                                            <Database className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter text-indigo-900 dark:text-indigo-400">Hub Integrity Protocol</h3>
                                            <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-700/60 dark:text-indigo-400/60 mt-2 leading-relaxed">
                                                Automatic stock audits enabled for Ashanti and Northern hubs. Discrepancy threshold set to 0.5% for all silos.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Outbound Flow', val: '86%', icon: Activity, color: 'text-[#7ede56]', bg: 'bg-[#7ede56]/10' },
                                    { label: 'System Uptime', val: '99.9%', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' }
                                ].map((m, i) => (
                                    <Card key={i} className={`border-none shadow-premium ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${m.bg} ${m.color}`}>
                                                <m.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{m.label}</p>
                                                <p className={`text-lg font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{m.val}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <Card className={`border-none shadow-premium ${darkMode ? 'bg-rose-950/20 border border-rose-500/10' : 'bg-rose-50 border border-rose-100'}`}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 animate-pulse">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em]">Security Alert</p>
                                            <p className="text-xs font-black uppercase text-rose-900 dark:text-rose-400 mt-1">G. Accra Hub Temp Spike (+3°C)</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-rose-500 font-black uppercase text-[10px] tracking-widest hover:bg-rose-500/10">Action</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RegionalPerformance;





