import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Handshake,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    BarChart2,
    Search,
    Filter,
    ArrowRight,
    TrendingUp,
    Zap,
    MapPin,
    Briefcase,
    Globe
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import CountUp from '@/components/CountUp';

const PartnershipsSummary = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [partnerships, setPartnerships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        ongoing: 0,
        completed: 0,
        escalated: 0
    });

    useEffect(() => {
        const fetchPartnerships = async () => {
            try {
                const res = await api.get('/super-admin/partnerships');
                if (res.data && res.data.length > 0) {
                    setPartnerships(res.data);
                    setStats({
                        total: res.data.length,
                        ongoing: res.data.filter((p: any) => p.status === 'Ongoing').length,
                        completed: res.data.filter((p: any) => p.status === 'Completed').length,
                        escalated: res.data.filter((p: any) => p.status === 'Escalated' || p.status === 'Disputed').length
                    });
                } else {
                    throw new Error('Empty data');
                }
            } catch (err) {
                console.error('Failed to fetch partnerships:', err);
                setPartnerships([]);
                setStats({ total: 0, ongoing: 0, completed: 0, escalated: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchPartnerships();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ongoing': return <Badge className="bg-blue-500/10 text-blue-500 border-none font-black text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase">ONGOING CYCLE</Badge>;
            case 'completed': return <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase">EXIT COMPLETE</Badge>;
            case 'escalated':
            case 'disputed': return <Badge className="bg-rose-500/10 text-rose-500 border-none animate-pulse font-black text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase">RISK ALERT</Badge>;
            default: return <Badge variant="secondary" className="font-black text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase">{status}</Badge>;
        }
    };

    const topMetrics = [
        { title: 'Capital Allocations', value: stats.total, icon: Handshake, path: '/dashboard/super-admin/oversight', color: 'bg-slate-950', iconColor: 'text-[#7ede56]', description: 'Live Managed Portfolios' },
        { title: 'Active Synergies', value: stats.ongoing, icon: Globe, path: '/dashboard/super-admin/regions', color: 'bg-[#002f37]', iconColor: 'text-white', description: 'Cross-Border Ops' },
        { title: 'De-risked Exits', value: stats.completed, icon: TrendingUp, path: '/dashboard/super-admin/analytics', color: 'bg-[#1e1b4b]', iconColor: 'text-white', description: 'Verified Payouts' },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56] shadow-inner">
                            <Handshake className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Partnership Intel
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Strategic oversight of farm-investor capital matching
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200 shadow-premium'}`}>
                        <Filter className="w-4 h-4 mr-2" /> Global Synergies
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
                                <CountUp end={m.value} duration={2000} />
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#7ede56]" /> Tactical Alliance Registry
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Live investment tracking and maturity flow</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                            <Input
                                placeholder="Search farm or investor entity..."
                                className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-50'}`}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5">Strategic Connection</th>
                                <th className="px-6 py-5">Integrity Phase</th>
                                <th className="px-6 py-5">Maturity Pulse</th>
                                <th className="px-6 py-5">Deployment Time</th>
                                <th className="px-6 py-5 text-right">Observation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {partnerships.map((p) => (
                                <tr key={p.id} className={`${darkMode ? 'hover:bg-[#7ede56]/5' : 'hover:bg-[#7ede56]/5'} transition-colors group`}>
                                    <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={`font-black uppercase tracking-tight text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{p.farm}</span>
                                            <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1 uppercase tracking-tighter">
                                                Locked with {p.investor} <Zap className="w-3 h-3 fill-current" />
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {getStatusBadge(p.status)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="w-full max-w-[140px]">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1.5">
                                                <span className="text-gray-400">Yield Progress</span>
                                                <span className={p.status === 'Completed' ? 'text-[#7ede56]' : 'text-blue-500'}>{p.maturity}</span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${p.status === 'Escalated' ? 'bg-rose-500 animate-pulse' : (p.status === 'Completed' ? 'bg-[#7ede56]' : 'bg-blue-500')}`}
                                                    style={{ width: p.maturity }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {p.start}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#7ede56] hover:bg-[#7ede56]/10 rounded-lg">
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

            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-indigo-500/5 rotate-12 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 rounded-[24px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
                        <BarChart2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-indigo-900 dark:text-indigo-400`}>Strategic Capital Pulse</h3>
                        <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-indigo-700/60 dark:text-indigo-400/60 mt-2 leading-relaxed`}>
                            Alliance integrity is scoring 94% this quarter. Focus on de-risking the Northern sector to maintain investor trust protocols.
                        </p>
                    </div>
                </div>
                <Button variant="outline" className={`font-black text-[10px] px-10 tracking-widest h-12 uppercase border-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-xl relative z-10`}>
                    View Strategic Audit
                </Button>
            </div>
        </div>
    );
};

export default PartnershipsSummary;
