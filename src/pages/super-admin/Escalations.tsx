import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    AlertTriangle,
    MessageSquare,
    User,
    ArrowRight,
    BadgeAlert,
    Clock,
    Filter,
    MoreHorizontal,
    Flag,
    ShieldAlert,
    AlertCircle,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const Escalations = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [escalations, setEscalations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEscalations = async () => {
            try {
                const res = await api.get('/super-admin/escalations');
                if (res.data && res.data.length > 0) {
                    setEscalations(res.data);
                } else {
                    throw new Error('Empty');
                }
            } catch (err) {
                // Rich Mock data for escalations
                setEscalations([
                    { _id: 'E-4012', issue: 'Yield Discrepancy (Rice)', priority: 'High', status: 'Pending', region: 'Ashanti', agent: 'Osei Tutu', date: '2026-03-10' },
                    { _id: 'E-4025', issue: 'Investor Contract Dispute', priority: 'Medium', status: 'In Review', region: 'Western North', agent: 'Kwame Mensah', date: '2026-03-09' },
                    { _id: 'E-4039', issue: 'Suspected Payout Fraud', priority: 'Critical', status: 'Immediate Action', region: 'Northern', agent: 'Ibrahim Yakubu', date: '2026-03-08' },
                    { _id: 'E-4051', issue: 'Delayed Input Distribution', priority: 'Low', status: 'Resolved', region: 'Oti', agent: 'Efua Dzifa', date: '2026-03-05' },
                    { _id: 'E-4066', issue: 'Unauthorized Farm Sub-leasing', priority: 'High', status: 'Pending', region: 'Bono East', agent: 'Kofi Appiah', date: '2026-03-04' },
                    { _id: 'E-4078', issue: 'GPS Geo-fence Breach', priority: 'Medium', status: 'Investigation', region: 'Ahafo', agent: 'Sarah Graham', date: '2026-03-02' },
                    { _id: 'E-4089', issue: 'Persistent Sync Failure', priority: 'Critical', status: 'In Review', region: 'Savannah', agent: 'Mary Addo', date: '2026-03-01' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchEscalations();
    }, []);

    const getPriorityBadge = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return <Badge className="bg-rose-500 text-white border-none shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse font-black text-[9px] tracking-widest uppercase py-1 px-2">CRITICAL AUTHORITY</Badge>;
            case 'high': return <Badge className="bg-rose-100 text-rose-700 border-rose-200 font-black text-[9px] tracking-widest uppercase py-1 px-2">HIGH PRIORITY</Badge>;
            case 'medium': return <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-black text-[9px] tracking-widest uppercase py-1 px-2">MEDIUM</Badge>;
            default: return <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-black text-[9px] tracking-widest uppercase py-1 px-2 shrink-0">ROUTINE</Badge>;
        }
    };

    const criticalCount = escalations.filter(e => e.priority === 'Critical').length;
    const pendingCount = escalations.filter(e => e.status !== 'Resolved').length;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Escalations & Alerts</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>High-impact disputes requiring Super Admin intervention</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 font-black uppercase text-[10px] tracking-widest px-6 h-10 shadow-premium border-gray-100 dark:border-gray-800">
                        <Filter className="w-4 h-4" /> Filter Alerts
                    </Button>
                </div>
            </div>

            {/* Quick Stats Blocks */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { title: 'Critical Alerts', value: criticalCount, icon: ShieldAlert, color: 'bg-[#9f1239]', textColor: 'text-rose-200' },
                    { title: 'Pending Resolution', value: pendingCount, icon: AlertCircle, color: 'bg-[#b45309]', textColor: 'text-amber-100' },
                ].map((m, idx) => (
                    <Card
                        key={idx}
                        className={`${m.color} border-none shadow-premium hover:scale-[1.05] transition-all duration-300 cursor-pointer relative overflow-hidden h-36 md:h-40 group`}
                        onClick={() => navigate('/dashboard/super-admin/escalations')}
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
                            <p className={`text-[9px] font-black ${m.textColor} uppercase tracking-[0.2em] mb-1 truncate`}>
                                {m.title}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-black text-white">
                                <CountUp end={m.value} duration={1500} />
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {escalations.map((item) => (
                    <Card key={item._id} className={`border-none shadow-premium overflow-hidden group transition-all hover:translate-x-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className={`w-2 shrink-0 ${item.priority === 'Critical' ? 'bg-rose-600' : (item.priority === 'High' ? 'bg-rose-400' : 'bg-amber-400')}`}></div>
                                <div className="p-6 flex-1 flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            {getPriorityBadge(item.priority)}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                                                <Clock className="w-3.5 h-3.5" /> {item.date}
                                            </span>
                                            <Badge variant="outline" className={`text-[10px] h-6 font-black uppercase tracking-widest truncate ${darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                                                REF-{item._id?.substring(0, 8)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{item.issue}</h3>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 rounded bg-blue-50 dark:bg-blue-900/20">
                                                        <Flag className="w-3.5 h-3.5 text-blue-500" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{item.region} Zone</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-900/20">
                                                        <User className="w-3.5 h-3.5 text-emerald-500" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Reported by: {item.agent}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800 w-full md:w-auto">
                                        <div className="text-right hidden md:block">
                                            <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 underline decoration-gray-200 underline-offset-4">Current Status</span>
                                            <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <Button className="bg-[#002f37] dark:bg-[#7ede56] dark:text-[#002f37] hover:scale-105 transition-transform font-black uppercase text-[10px] tracking-widest h-12 px-8 flex items-center gap-2.5 rounded-2xl shadow-premium">
                                            Take Action <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-none shadow-premium ${darkMode ? 'bg-indigo-950/20 border border-indigo-500/10' : 'bg-blue-50'} p-10 text-center mt-12 overflow-hidden relative`}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BadgeAlert className="w-32 h-32" />
                </div>
                <BadgeAlert className={`w-14 h-14 mx-auto mb-6 ${darkMode ? 'text-indigo-400' : 'text-blue-500'}`} />
                <h3 className={`text-2xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Emergency Broadcaster</h3>
                <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto font-bold uppercase tracking-wide opacity-70">
                    Critical alerts are pushed to your root device instantly. Authorized overrides are logged into the immutable audit trail.
                </p>
                <div className="mt-8">
                    <Button variant="link" className="text-[#7ede56] font-black uppercase text-[11px] tracking-widest underline decoration-2 underline-offset-8">Configure Push Protocols</Button>
                </div>
            </Card>
        </div>
    );
};

export default Escalations;
