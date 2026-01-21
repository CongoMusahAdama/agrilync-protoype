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
    ArrowUpRight,
    MapPin,
    Zap,
    Building2,
    Activity,
    Bell
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
                console.error('Failed to fetch escalations:', err);
                setEscalations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEscalations();
    }, []);

    const getPriorityBadge = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return <Badge className="bg-rose-500 text-white border-none shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse font-black text-[9px] tracking-widest uppercase py-1 px-3">CRITICAL</Badge>;
            case 'high': return <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border-none font-black text-[9px] tracking-widest uppercase py-1 px-3">HIGH PRIORITY</Badge>;
            case 'medium': return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-none font-black text-[9px] tracking-widest uppercase py-1 px-3">MODERATE</Badge>;
            default: return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-none font-black text-[9px] tracking-widest uppercase py-1 px-3">ROUTINE</Badge>;
        }
    };

    const criticalCount = escalations.filter(e => e.priority === 'Critical').length;
    const pendingCount = escalations.filter(e => e.status !== 'Resolved').length;

    const metrics = [
        { title: 'Critical Threats', value: criticalCount, icon: ShieldAlert, color: 'bg-rose-950', iconColor: 'text-rose-400', description: 'Immediate Action Required' },
        { title: 'Active Disputes', value: pendingCount, icon: Bell, color: 'bg-slate-950', iconColor: 'text-[#7ede56]', description: 'Pending Reconciliation' },
        { title: 'System Health', value: 99.8, icon: Activity, color: 'bg-[#002f37]', iconColor: 'text-white', description: 'Node Integrity Pulse', isPercent: true },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 shadow-inner">
                            <BadgeAlert className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Incident Intelligence
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        High-priority escalations and platform security redlines
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200 shadow-premium'}`}>
                        <Filter className="w-4 h-4 mr-2" /> Global Filter
                    </Button>
                    <Button className="bg-[#002f37] dark:bg-[#7ede56] dark:text-[#002f37] hover:scale-105 transition-all font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        Protocol Override
                    </Button>
                </div>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {metrics.map((m, idx) => (
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
                                <CountUp end={m.value} duration={2000} />{m.isPercent && '%'}
                            </h3>
                            <p className="text-[8px] font-bold mt-1 text-white/30 truncate uppercase tracking-tighter italic">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Alert List Feed */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2 px-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Live Incident Stream</h2>
                    <Badge variant="outline" className="text-[9px] font-black opacity-50 border-none">POLLING ACTIVE</Badge>
                </div>
                {escalations.map((item) => (
                    <Card key={item._id} className={`border-none shadow-premium overflow-hidden group transition-all duration-300 hover:translate-x-2 relative ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                        <div className={`absolute top-0 left-0 h-full w-1.5 ${item.priority === 'Critical' ? 'bg-rose-600 animate-pulse' : (item.priority === 'High' ? 'bg-rose-400' : 'bg-amber-400')}`}></div>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getPriorityBadge(item.priority)}
                                            <Badge variant="outline" className={`text-[10px] h-6 font-black border-dashed ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-400'}`}>
                                                SEC-REF: {item._id}
                                            </Badge>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> {item.date}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className={`text-xl font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{item.issue}</h3>
                                        <div className="flex flex-wrap items-center gap-6 pt-1">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.region} CORE</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">OWNER: {item.agent}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-8 w-full md:w-auto pt-4 md:pt-0 border-t md:border-transparent">
                                    <div className="hidden lg:block text-right">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Current State</p>
                                        <Badge className={`font-black text-[9px] uppercase border-none rounded-lg px-3 ${item.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <Button className="bg-[#002f37] dark:bg-[#7ede56] dark:text-[#002f37] hover:scale-105 transition-all font-black uppercase text-[10px] tracking-widest h-14 px-10 rounded-2xl shadow-premium flex items-center gap-3">
                                        Resolve Node <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Footer Incident Protocol */}
            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-indigo-500/5 rotate-12 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 rounded-[24px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
                        <Zap className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-indigo-900 dark:text-indigo-400`}>Emergency Override Relay</h3>
                        <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-indigo-700/60 dark:text-indigo-400/60 mt-2 leading-relaxed`}>
                            Critical alerts are pushed via satellite to the duty officer's root device. Immutable audit logs are generated for every resolution action taken.
                        </p>
                    </div>
                </div>
                <Button variant="outline" className={`font-black text-[10px] px-10 tracking-widest h-12 uppercase border-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-xl relative z-10`}>
                    Configure Push Protocols
                </Button>
            </div>
        </div>
    );
};

export default Escalations;
