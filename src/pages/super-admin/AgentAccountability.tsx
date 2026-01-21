import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const AgentAccountability = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [agents, setAgents] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await api.get('/super-admin/agents');
                if (res.data && res.data.length > 0) {
                    setAgents(res.data);
                    setStats({
                        activeNow: res.data.filter((a: any) => a.isLoggedIn).length,
                        totalAgents: res.data.length,
                        atRisk: res.data.filter((a: any) => a.status === 'at risk').length
                    });
                } else {
                    throw new Error('Empty');
                }
            } catch (err) {
                console.error('Failed to fetch agents:', err);
                setAgents([]);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const getStatusBadge = (agent: any) => {
        if (agent.isLoggedIn) return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black text-[9px] tracking-tighter">LIVE OPERATIONAL</Badge>;
        if (agent.status === 'at risk') return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-black text-[9px] tracking-tighter animate-pulse">CRITICAL RISK</Badge>;
        return <Badge variant="secondary" className="font-black text-[9px] tracking-tighter opacity-50 uppercase">OFFLINE</Badge>;
    };

    const topMetrics = [
        { title: 'Operations Leaders', value: stats?.totalAgents || 0, icon: Briefcase, color: 'bg-slate-950', iconColor: 'text-[#7ede56]', description: 'Total Field Personnel' },
        { title: 'Live Activity', value: stats?.activeNow || 0, icon: Activity, color: 'bg-[#002f37]', iconColor: 'text-white', description: 'Agents Polling Now' },
        { title: 'Security Alerts', value: stats?.atRisk || 0, icon: ShieldAlert, color: 'bg-rose-950', iconColor: 'text-rose-400', description: 'Performance Redlines' },
    ];

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
                            Personnel Oversight
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Agent accountability & live performance surveillance
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                        <Input placeholder="Search personnel..." className={`pl-10 h-11 border-none ${darkMode ? 'bg-gray-900 focus:ring-1 ring-[#7ede56]/30' : 'bg-white shadow-premium'}`} />
                    </div>
                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        <Navigation className="w-4 h-4 mr-2" /> Assign Zones
                    </Button>
                </div>
            </div>

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {topMetrics.map((m, idx) => (
                    <Card
                        key={idx}
                        className={`${m.color} border-none shadow-2xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer relative overflow-hidden h-36 border border-white/5 group`}
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
                                {stats ? (
                                    <CountUp end={m.value} duration={2000} />
                                ) : (
                                    <span className="animate-pulse">...</span>
                                )}
                            </h3>
                            <p className="text-[8px] font-bold mt-1 text-white/30 truncate uppercase tracking-tighter italic">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#7ede56]" /> Operational Registry
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Real-time status of all field personnel</CardDescription>
                        </div>
                        <Badge variant="outline" className="h-8 px-3 rounded-lg border-dashed font-black">
                            REFRESHING IN: <span className="text-[#7ede56] ml-2 font-mono">24s</span>
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5">Personnel (Leader)</th>
                                <th className="px-6 py-5">Assigned Zone</th>
                                <th className="px-6 py-5">Current Pulse</th>
                                <th className="px-6 py-5 text-center">Output Rating</th>
                                <th className="px-6 py-5">Integrity</th>
                                <th className="px-6 py-5 text-right">Observation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {agents.map((agent) => (
                                <tr key={agent.agentId || agent._id} className={`${darkMode ? 'hover:bg-[#7ede56]/5' : 'hover:bg-[#7ede56]/5'} transition-colors group`}>
                                    <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#eefcf0] text-[#002f37]'} border border-white/5`}>
                                                {agent.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-black uppercase tracking-tight text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{agent.name}</span>
                                                <span className="text-[10px] font-bold text-gray-500 tracking-tighter">{agent.agentId || 'UID-PENDING'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-[#7ede56]/60" />
                                            <span className={`text-xs font-black uppercase tracking-tight ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {agent.region || 'GLOBAL CORE'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(agent)}
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                                                <Clock className="w-2.5 h-2.5" /> {agent.lastSync || 'POLLING SYSTEM...'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`font-black text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{agent.reports || 0}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reports</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5 w-24">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                <span className="text-gray-400">Score</span>
                                                <span className={parseInt((agent.compliance || '0').replace('%', '')) > 90 ? 'text-[#7ede56]' : 'text-amber-500'}>{agent.compliance || '0%'}</span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${parseInt((agent.compliance || '0').replace('%', '')) > 90 ? 'bg-[#7ede56]' : (parseInt((agent.compliance || '0').replace('%', '')) > 70 ? 'bg-amber-400' : 'bg-rose-500')}`}
                                                    style={{ width: agent.compliance || '0%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                                <MonitorPlay className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#7ede56] hover:bg-[#7ede56]/10 rounded-lg">
                                                <History className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:bg-gray-100 rounded-lg">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-indigo-500/5 rotate-12 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 rounded-[24px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-indigo-900 dark:text-indigo-400`}>Performance Integrity Shield</h3>
                        <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-indigo-700/60 dark:text-indigo-400/60 mt-2 leading-relaxed`}>
                            Automated GPS cross-verification and facial biometric logs are enabled for all assigned zones. Discrepancy threshold: 0.5%.
                        </p>
                    </div>
                </div>
                <Button variant="default" className="font-black text-[10px] px-10 tracking-widest h-12 uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-xl relative z-10">
                    Export Compliance Audit
                </Button>
            </div>
        </div>
    );
};

export default AgentAccountability;

