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
    ArrowUpRight
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
                    // No agents found - show empty state
                    setAgents([]);
                    setStats({ activeNow: 0, totalAgents: 0, atRisk: 0 });
                }
            } catch (err) {
                console.error('Failed to fetch agents:', err);
                // On error, show empty state rather than mock data
                setAgents([]);
                setStats({ activeNow: 0, totalAgents: 0, atRisk: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const getStatusColor = (status: string = 'online', isLoggedIn: boolean = false) => {
        if (isLoggedIn) return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
        switch (status.toLowerCase()) {
            case 'online': return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
            case 'offline': return 'bg-gray-400';
            case 'at risk': return 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse';
            default: return 'bg-blue-500';
        }
    };

    const topMetrics = [
        { title: 'Total Agents', value: stats?.totalAgents || 0, icon: Briefcase, color: 'bg-[#4c1d95]', path: '/dashboard/super-admin/agents' },
        { title: 'Active Now', value: stats?.activeNow || 0, icon: Activity, color: 'bg-[#065f46]', path: '/dashboard/super-admin/logs' },
        { title: 'At Risk', value: stats?.atRisk || 0, icon: ShieldAlert, color: 'bg-[#9f1239]', path: '/dashboard/super-admin/escalations' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Agent Accountability</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Field agent activity monitoring and performance tracking</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search agent name or ID..." className={`pl-10 h-10 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white shadow-premium border-gray-100'}`} />
                    </div>
                </div>
            </div>

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {topMetrics.map((m, idx) => (
                    <Card
                        key={idx}
                        className={`${m.color} border-none shadow-premium hover:scale-[1.05] transition-all duration-300 cursor-pointer relative overflow-hidden h-36 md:h-40 group`}
                        onClick={() => navigate(m.path)}
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                            <m.icon className="h-24 w-24 absolute -right-4 -bottom-4 rotate-12 text-white" />
                        </div>

                        <CardHeader className="p-4 pb-0 relative z-10 flex flex-row items-center justify-between space-y-0">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                                <m.icon className="h-4 w-4 text-white" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-white/40" />
                        </CardHeader>

                        <CardContent className="p-4 pt-4 relative z-10 flex flex-col justify-end h-[calc(9rem-3rem)]">
                            <p className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em] mb-1 truncate">
                                {m.title}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-black text-white">
                                <CountUp end={m.value} duration={1500} />
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-4">Field Agent</th>
                                <th className="px-6 py-4">Operation Zone</th>
                                <th className="px-6 py-4">Live Status</th>
                                <th className="px-6 py-4">Productivity</th>
                                <th className="px-6 py-4">Compliance</th>
                                <th className="px-6 py-4 text-right">Surveillance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {agents.map((agent) => (
                                <tr key={agent.agentId || agent._id} className={`${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50/50'} transition-colors group`}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#eefcf0] text-[#002f37]'} border border-transparent group-hover:border-[#7ede56]/30 transition-all`}>
                                                {agent.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-black uppercase tracking-tight text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{agent.name}</span>
                                                <span className="text-[10px] font-bold text-gray-500">{agent.agentId || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className={`font-black tracking-widest text-[10px] uppercase ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                                            {agent.region || 'TBD'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(agent.status, agent.isLoggedIn)}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-200' : 'text-[#002f37]'}`}>
                                                    {agent.isLoggedIn ? 'ONLINE NOW' : (agent.status || 'OFFLINE')}
                                                </span>
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                                                <Clock className="w-2.5 h-2.5" /> {agent.lastSync || 'Last active: Today'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-[#7ede56]/10">
                                                <Activity className="w-3.5 h-3.5 text-[#7ede56]" />
                                            </div>
                                            <div>
                                                <span className={`font-black block text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{agent.reports || 0}</span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Reports</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5 w-28">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                <span className="text-gray-400">Trust Rating</span>
                                                <span className={parseInt(agent.compliance || '0') > 90 ? 'text-[#7ede56]' : 'text-amber-500'}>{agent.compliance || '0%'}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${parseInt(agent.compliance || '0') > 90 ? 'bg-[#7ede56]' : (parseInt(agent.compliance || '0') > 70 ? 'bg-amber-400' : 'bg-rose-500')}`}
                                                    style={{ width: agent.compliance || '0%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Live Observation">
                                                <MonitorPlay className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" title="View Audit Trail">
                                                <History className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className={`p-8 rounded-3xl border-2 border-dashed ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} flex flex-col md:flex-row items-center justify-between gap-6`}>
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Performance Integrity</h3>
                        <p className={`text-sm max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Agent activity is cross-verified via GPS geofencing and farmer confirmation calls. Discrepancies trigger automatic escalations.</p>
                    </div>
                </div>
                <Button variant="default" className={`font-black text-[10px] px-8 tracking-widest h-12 uppercase bg-[#002f37] dark:bg-emerald-500 dark:text-[#002f37] shadow-premium`}>
                    Export Integrity Report
                </Button>
            </div>
        </div>
    );
};

export default AgentAccountability;
