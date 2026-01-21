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
    Zap
} from 'lucide-react';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { Badge } from '@/components/ui/badge';

const Overview = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            path: '/dashboard/super-admin/agents'
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
            path: '/dashboard/super-admin/agents'
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
            path: '/dashboard/super-admin/agents'
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
            path: '/dashboard/super-admin/farms'
        },
        {
            id: 'regions',
            title: 'Active Regions',
            value: stats?.totalRegions || 0,
            color: 'bg-[#065f46]',
            textColor: 'text-white',
            iconColor: 'text-white',
            icon: Globe,
            description: 'Operational Zones',
            path: '/dashboard/super-admin/regions'
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
            path: '/dashboard/super-admin/partnerships'
        },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Executive Oversight Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                        Executive Oversight
                    </h1>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-[#7ede56] text-[#002f37] border-none font-black text-[10px] px-2 shadow-sm">LIVE COMMAND CENTER</Badge>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" /> Platform Pulse: {stats?.systemUptime || 'Stable'}
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
                        className={`${metric.color} border-none shadow-premium hover:scale-[1.05] transition-all duration-300 cursor-pointer relative overflow-hidden h-36 md:h-44 group`}
                        onClick={() => navigate(metric.path)}
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                            <metric.icon className={`h-32 w-32 absolute -right-4 -bottom-4 rotate-12 ${metric.iconColor}`} />
                        </div>

                        <CardHeader className="p-4 pb-0 relative z-10 flex flex-row items-center justify-between space-y-0">
                            <div className={`p-2 rounded-lg ${metric.id === 'logins' ? 'bg-[#002f37]/10' : 'bg-white/10'} backdrop-blur-md`}>
                                <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                            </div>
                            <ArrowUpRight className={`h-4 w-4 ${metric.id === 'logins' ? 'text-[#002f37]/40' : 'text-white/40'}`} />
                        </CardHeader>

                        <CardContent className="p-4 pt-4 relative z-10 flex flex-col justify-end h-[calc(9rem-3rem)] md:h-[calc(11.5rem-3rem)]">
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
                            <p className={`text-[9px] font-bold mt-2 line-clamp-1 uppercase tracking-tighter ${metric.id === 'logins' ? 'text-[#002f37]/50' : 'text-white/60'}`}>
                                {metric.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

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
                                            className="h-full bg-gradient-to-r from-[#002f37] via-[#065f46] to-[#7ede56] rounded-lg transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(126,222,86,0.4)]"
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
                                    <span className="text-sm font-black text-[#002f37] dark:text-emerald-400 italic">92.4%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-[92.4%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end mb-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Integrity Score</p>
                                    <span className="text-sm font-black text-[#002f37] dark:text-emerald-400 italic">98.1%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-[#7ede56] w-[98.1%] rounded-full shadow-[0_0_10px_rgba(126,222,86,0.3)]"></div>
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
