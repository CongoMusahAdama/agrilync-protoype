import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Map,
    Activity,
    AlertTriangle,
    TrendingUp,
    UserCheck,
    Globe,
    Handshake,
    Sprout,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Calendar,
    Briefcase,
    ShieldAlert,
    Clock,
    Zap,
    BarChart,
    PieChart,
    Info,
    CheckCircle2
} from 'lucide-react';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ReTooltip, BarChart as ReBarChart, Bar, Cell } from 'recharts';

const Overview = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/super-admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const metrics = [
        {
            id: 'logins',
            title: "Today's Logins",
            value: stats?.todayLogins || 0,
            color: 'bg-[#7ede56]',
            textColor: 'text-[#002f37]',
            iconColor: 'text-[#002f37]',
            icon: Zap,
            description: 'Unique agent sessions',
            details: '8% increase from yesterday',
            path: '/dashboard/super-admin/agents',
            trend: [
                { time: '08:00', value: 12 },
                { time: '10:00', value: 45 },
                { time: '12:00', value: 78 },
                { time: '14:00', value: 62 },
                { time: '16:00', value: 89 },
                { time: '18:00', value: 34 },
            ],
            breakdown: [
                { name: 'Mobile', value: 65, color: '#002f37' },
                { name: 'Desktop', value: 35, color: '#7ede56' }
            ]
        },
        {
            id: 'duration',
            title: 'Avg Session',
            value: stats?.avgSessionDuration || '0m',
            isString: true,
            color: 'bg-[#002f37]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: Clock,
            description: 'Connectivity span',
            details: 'Steady connectivity flow',
            path: '/dashboard/super-admin/agents',
            trend: [
                { time: '08:00', value: 2.5 },
                { time: '10:00', value: 3.1 },
                { time: '12:00', value: 4.2 },
                { time: '14:00', value: 3.8 },
                { time: '16:00', value: 5.1 },
                { time: '18:00', value: 4.5 },
            ],
            breakdown: [
                { name: 'Productive', value: 80, color: '#7ede56' },
                { name: 'Idle', value: 20, color: '#f43f5e' }
            ]
        },
        {
            id: 'agents',
            title: 'Total Agents',
            value: stats?.totalAgents || 0,
            color: 'bg-[#0369a1]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: Users,
            description: 'Field Personnel',
            details: 'Active across 6 key regions',
            path: '/dashboard/super-admin/agents',
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
            title: 'Total Farmers',
            value: stats?.totalFarmers || 0,
            color: 'bg-[#4c1d95]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: Sprout,
            description: 'Verified Producers',
            details: '12 new registrations this week',
            path: '/dashboard/super-admin/farms',
            trend: [
                { time: 'Wk 1', value: 120 },
                { time: 'Wk 2', value: 145 },
                { time: 'Wk 3', value: 180 },
                { time: 'Wk 4', value: 210 },
                { time: 'Wk 5', value: 245 },
                { time: 'Wk 6', value: 289 },
            ],
            breakdown: [
                { name: 'Smallholder', value: 75, color: '#ddd6fe' },
                { name: 'Commercial', value: 25, color: '#a78bfa' }
            ]
        },
        {
            id: 'regions',
            title: 'Active Regions',
            value: stats?.totalRegions || 0,
            color: 'bg-[#002f37]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: Globe,
            description: 'Operational Zones',
            details: '2 regions expanding coverage',
            path: '/dashboard/super-admin/regions',
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
            id: 'partnerships',
            title: 'Partnerships',
            value: stats?.activePartnerships || 0,
            color: 'bg-[#9f1239]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: Handshake,
            description: 'Investor Matches',
            details: '4 new capital injections pending',
            path: '/dashboard/super-admin/partnerships',
            trend: [
                { time: 'Q1', value: 15 },
                { time: 'Q2', value: 28 },
                { time: 'Q3', value: 42 },
                { time: 'Q4', value: 56 },
            ],
            breakdown: [
                { name: 'Equity', value: 40, color: '#fecdd3' },
                { name: 'Loan', value: 60, color: '#fb7185' }
            ]
        },
        {
            id: 'investors',
            title: 'Total Investors',
            value: stats?.totalInvestors || 0,
            color: 'bg-[#713f12]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: Briefcase,
            description: 'Active Capital Partners',
            details: 'Funding agricultural growth',
            path: '/dashboard/super-admin/partnerships',
            trend: [
                { time: 'Jan', value: 8 },
                { time: 'Feb', value: 12 },
                { time: 'Mar', value: 15 },
                { time: 'Apr', value: 18 },
                { time: 'May', value: 22 },
                { time: 'Jun', value: 25 },
            ],
            breakdown: [
                { name: 'Institutional', value: 55, color: '#fef3c7' },
                { name: 'Individual', value: 45, color: '#fbbf24' }
            ]
        },
    ];

    const handleCardClick = (metric: any) => {
        setSelectedMetric(metric);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Executive Oversight Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                        Executive Oversight
                    </h1>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-[#7ede56] text-[#002f37] border-none font-black text-[10px] px-2 shadow-sm">LIVE COMMAND CENTER</Badge>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-3 h-3 text-[#7ede56] animate-pulse" /> Platform Pulse: {stats?.systemUptime || 'Stable'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-[#002f37] dark:bg-[#7ede56] dark:text-[#002f37] hover:opacity-90 font-black uppercase text-[10px] tracking-widest h-11 px-8 shadow-premium rounded-xl">
                        Generate System Report
                    </Button>
                </div>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                            <div className={`p-2 rounded-lg ${metric.id === 'logins' ? 'bg-[#002f37]/10' : 'bg-white/10'} backdrop-blur-md`}>
                                <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                            </div>
                            <div className="flex items-center gap-1">
                                <ArrowUpRight className={`h-4 w-4 ${metric.id === 'logins' ? 'text-[#002f37]/40' : 'text-white/40'} transition-transform group-hover:translate-x-1 group-hover:-translate-y-1`} />
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-4 relative z-20 flex flex-col justify-end h-[calc(9rem-3rem)] md:h-[calc(11.5rem-3rem)] transition-all duration-500 group-hover:-translate-y-4">
                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 truncate ${metric.id === 'logins' ? 'text-[#002f37]/70' : 'text-white/80'}`}>
                                {metric.title}
                            </p>
                            <h3 className={`text-2xl md:text-3xl font-black ${metric.textColor}`}>
                                {loading ? (
                                    <span className="animate-pulse">...</span>
                                ) : metric.isString ? (
                                    stats?.[metric.id] || metric.value
                                ) : (
                                    <CountUp end={typeof metric.value === 'number' ? metric.value : 0} duration={1500} />
                                )}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <TrendingUp className={`h-3 w-3 ${metric.id === 'logins' ? 'text-[#002f37]' : 'text-[#7ede56]'}`} />
                                <p className={`text-[9px] font-bold line-clamp-1 uppercase tracking-tighter ${metric.id === 'logins' ? 'text-[#002f37]/50' : 'text-white/60'}`}>
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
                                    <DialogDescription className="sr-only">Detailed statistics and velocity for {selectedMetric.title}.</DialogDescription>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'} border-l-4 ${selectedMetric.id === 'logins' ? 'border-[#002f37]' : 'border-[#7ede56]'} flex justify-between items-center`}>
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
                                                    stroke={selectedMetric.id === 'logins' ? '#002f37' : '#7ede56'}
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

            {/* Secondary Section - Charts & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className={`col-span-1 lg:col-span-2 border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                    <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-[#7ede56]" />
                                <CardTitle className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Regional Performance Registry</CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="font-black text-[9px] uppercase tracking-widest px-2 py-1 rounded-lg">National Distribution</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8 px-8">
                        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            {stats?.regionalDistribution?.map((item: any, idx: number) => (
                                <div key={item.name} className="group flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#7ede56] transition-colors">{item.name}</span>
                                        <span className={`text-[11px] font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{item.value} UNITS</span>
                                    </div>
                                    <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center relative shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#002f37] via-[#7ede56]/80 to-[#7ede56] rounded-lg transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(126,222,86,0.4)]"
                                            style={{ width: `${Math.min((item.value / 1000) * 100, 100)}%` }}
                                        >
                                            <div className="h-full w-full flex opacity-30">
                                                <div className="h-full flex-1 border-r border-white/20"></div>
                                                <div className="h-full flex-1 border-r border-white/20"></div>
                                                <div className="h-full flex-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className={`border-none shadow-premium h-full ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-blue-500" />
                                <CardTitle className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Platform Intelligence</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-10 space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between items-end mb-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agent Utility Rate</p>
                                    <span className="text-sm font-black text-[#002f37] dark:text-[#7ede56] italic">92.4%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-[#7ede56] w-[92.4%] rounded-full shadow-[0_0_10px_rgba(126,222,86,0.3)]"></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end mb-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Integrity Score</p>
                                    <span className="text-sm font-black text-[#002f37] dark:text-[#7ede56] italic">98.1%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-[#7ede56]/50 to-[#7ede56] w-[98.1%] rounded-full shadow-[0_0_10px_rgba(126,222,86,0.3)]"></div>
                                </div>
                            </div>

                            <div className={`p-6 rounded-[24px] ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'} border-2 border-dashed`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#7ede56] shadow-[0_0_12px_#7ede56] animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Guardian Sentinel</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tighter italic">
                                    Today's login frequency increased by 14% compared to session average. No critical latency gaps detected.
                                </p>
                            </div>

                            <Button className="w-full h-14 bg-[#002f37] hover:bg-[#001c21] text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-xl shadow-2xl transition-all hover:scale-[1.02]">
                                Open Operational View
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default Overview;





