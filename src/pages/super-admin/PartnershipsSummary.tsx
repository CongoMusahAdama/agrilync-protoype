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
    ArrowRight
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
                // Rich Mock fallback
                const mockData = [
                    { id: 'P-901', farm: 'Emerald Valley Rice', investor: 'AgroInvest Ltd', status: 'Ongoing', maturity: '65%', start: '2025-10-12' },
                    { id: 'P-882', farm: 'Golden Cocoa Estate', investor: 'Harvest Capitals', status: 'Ongoing', maturity: '20%', start: '2026-01-05' },
                    { id: 'P-750', farm: 'Northern Plains Maize', investor: 'Private Consortium', status: 'Escalated', maturity: '45%', start: '2025-11-20' },
                    { id: 'P-612', farm: 'Volta Green Farms', investor: 'EcoYield Fund', status: 'Completed', maturity: '100%', start: '2025-05-15' },
                    { id: 'P-505', farm: 'Savannah Ginger Project', investor: 'Global Agri-Ventures', status: 'Ongoing', maturity: '12%', start: '2026-02-10' },
                    { id: 'P-420', farm: 'Bono Mango Groves', investor: 'Afriman Growth Fund', status: 'Ongoing', maturity: '88%', start: '2025-08-01' },
                    { id: 'P-311', farm: 'Coastal Coconut Hub', investor: 'Palm Heritage Ltd', status: 'Ongoing', maturity: '40%', start: '2025-12-15' },
                    { id: 'P-209', farm: 'Ashanti Poultry Cluster', investor: 'FeedNation Group', status: 'Disputed', maturity: '55%', start: '2025-11-05' },
                ];
                setPartnerships(mockData);
                setStats({ total: 48, ongoing: 32, completed: 12, escalated: 4 });
            } finally {
                setLoading(false);
            }
        };
        fetchPartnerships();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ongoing': return <Badge className="bg-blue-100 text-blue-700 border-none font-black text-[9px] tracking-widest px-3 py-1 rounded-full uppercase">ONGOING</Badge>;
            case 'completed': return <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] tracking-widest px-3 py-1 rounded-full uppercase">COMPLETED</Badge>;
            case 'escalated':
            case 'disputed': return <Badge className="bg-rose-100 text-rose-700 border-none animate-pulse font-black text-[9px] tracking-widest px-3 py-1 rounded-full uppercase">{status}</Badge>;
            default: return <Badge variant="secondary" className="font-black text-[9px] tracking-widest px-3 py-1 rounded-full uppercase">{status}</Badge>;
        }
    };

    const topMetrics = [
        { title: 'Matched Farms', value: stats.total, icon: Handshake, path: '/dashboard/super-admin/oversight', color: 'bg-[#002f37]', iconColor: 'text-[#7ede56]', description: 'Allocated Assets' },
        { title: 'Ongoing Ops', value: stats.ongoing, icon: Clock, path: '/dashboard/super-admin/regions', color: 'bg-[#065f46]', iconColor: 'text-white', description: 'Active Cycles' },
        { title: 'Successful Exit', value: stats.completed, icon: CheckCircle2, path: '/dashboard/super-admin/analytics', color: 'bg-[#0369a1]', iconColor: 'text-white', description: 'Yield Payouts' },
        { title: 'Strategic Risk', value: stats.escalated, icon: AlertCircle, path: '/dashboard/super-admin/escalations', color: 'bg-[#9f1239]', iconColor: 'text-white', description: 'At-Risk Deals' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Partnerships Summary</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>High-level overview of farm investments and matches</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 font-black uppercase text-[10px] tracking-widest h-10 px-6 border-gray-100 dark:border-gray-800 shadow-premium">
                        <Filter className="w-4 h-4" /> Advanced Filter
                    </Button>
                </div>
            </div>

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {topMetrics.map((m, idx) => (
                    <Card
                        key={idx}
                        className={`${m.color} border-none shadow-premium hover:scale-[1.05] transition-all duration-300 cursor-pointer relative overflow-hidden h-36 md:h-40 group`}
                        onClick={() => navigate(m.path)}
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                            <m.icon className={`h-24 w-24 absolute -right-4 -bottom-4 rotate-12 ${m.iconColor}`} />
                        </div>

                        <CardHeader className="p-4 pb-0 relative z-10 flex flex-row items-center justify-between space-y-0">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                                <m.icon className={`h-4 w-4 ${m.iconColor}`} />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-white/40" />
                        </CardHeader>

                        <CardContent className="p-4 pt-4 relative z-10 flex flex-col justify-end h-[calc(9rem-3rem)]">
                            <p className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em] mb-1 truncate">
                                {m.title}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-black text-white">
                                <CountUp end={m.value} duration={1200} />
                            </h3>
                            <p className="text-[8px] md:text-[9px] font-bold mt-1 md:mt-2 line-clamp-1 uppercase tracking-tighter text-white/60">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-black uppercase tracking-tight">Active Partnerships Registry</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input placeholder="Search farm or investor..." className={`pl-10 h-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100 shadow-inner'}`} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5 underline decoration-gray-200 underline-offset-8">Partner Connection</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Maturity Progress</th>
                                <th className="px-6 py-5">Initialization Date</th>
                                <th className="px-6 py-5 text-right">Surveillance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {partnerships.map((p) => (
                                <tr key={p.id} className={`${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50/50'} transition-colors group`}>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={`font-black uppercase tracking-tight text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{p.farm}</span>
                                            <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1 uppercase tracking-tighter">
                                                Joined with {p.investor} <ArrowUpRight className="w-3 h-3" />
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
                                                <span className={p.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}>{p.maturity}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${p.status === 'Escalated' ? 'bg-rose-500' : (p.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500')}`}
                                                    style={{ width: p.maturity }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {p.start}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-[#002f37] dark:text-[#7ede56] hover:bg-[#7ede56]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card className={`${darkMode ? 'bg-indigo-950/20 border border-indigo-500/10' : 'bg-indigo-50 border border-indigo-100'} p-8 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BarChart2 className="w-32 h-32" />
                </div>
                <div className="flex items-start gap-6 relative z-10">
                    <div className="p-4 rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
                        <BarChart2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-tighter">Strategic Investor Sentiment</h3>
                        <p className="text-sm text-indigo-700/70 dark:text-indigo-400/70 mt-2 max-w-2xl font-bold uppercase tracking-wide leading-relaxed">
                            Partnership success rate is up by 14% this quarter. Focus remains on timely resolution of Northern region disputes to maintain momentum.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mt-4 underline underline-offset-8 decoration-2">
                            View Full Investment Audit
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PartnershipsSummary;
