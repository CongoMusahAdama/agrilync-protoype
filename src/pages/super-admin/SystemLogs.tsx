import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Activity,
    Lock,
    User,
    ShieldCheck,
    RefreshCcw,
    Terminal,
    Search,
    Download,
    Calendar,
    ChevronRight,
    Search as SearchIcon,
    ShieldAlert,
    CheckCircle2,
    Database,
    ArrowUpRight,
    Clock,
    Zap,
    Key,
    UserSecret
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { useNavigate } from 'react-router-dom';

const SystemLogs = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/super-admin/logs');
                if (res.data && res.data.length > 0) {
                    setLogs(res.data);
                } else {
                    throw new Error('Empty');
                }
            } catch (err) {
                console.error('Failed to fetch logs:', err);
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success':
            case 'authorized':
                return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'blocked':
                return 'text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse';
            case 'pending review':
                return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default:
                return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    const categories = [
        { title: 'Security Nodes', count: 124, icon: ShieldAlert, color: 'bg-rose-950', iconColor: 'text-rose-400', description: 'Immediate Threat Alerts' },
        { title: 'Authorized Events', count: 852, icon: CheckCircle2, color: 'bg-slate-950', iconColor: 'text-[#7ede56]', description: 'Validated Admin Actions' },
        { title: 'System Pulse', count: 42, icon: Database, color: 'bg-[#002f37]', iconColor: 'text-white', description: 'Internal Service Logs' },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Forensic Audit Trail
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Immutable ledger of platform-wide administration and security events
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200 shadow-premium'}`}>
                        <Calendar className="w-4 h-4 mr-2" /> Live Chronology
                    </Button>
                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        <Download className="w-4 h-4 mr-2" /> Export Audit
                    </Button>
                </div>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {categories.map((m, idx) => (
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
                                <CountUp end={m.count} duration={2000} />
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
                                <Database className="w-5 h-5 text-[#7ede56]" /> Master Registry Flow
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Real-time system event stream</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                            <Input
                                placeholder="Filter by action, user, or resource..."
                                className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-50'}`}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5">System Action</th>
                                <th className="px-6 py-5">Initiator Alpha</th>
                                <th className="px-6 py-5">Observed Resource</th>
                                <th className="px-6 py-5">Integrity</th>
                                <th className="px-6 py-5">Event Time (UTC)</th>
                                <th className="px-6 py-5 text-right">Observation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {logs.map((log) => (
                                <tr key={log._id} className={`${darkMode ? 'hover:bg-[#7ede56]/5' : 'hover:bg-[#7ede56]/5'} transition-colors group`}>
                                    <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-[#002f37]'}`}>
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <span className={`text-sm font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                {log.action}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                <User className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <span className="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className="bg-gray-500/5 text-gray-500 dark:text-gray-400 font-black border-dashed text-[9px] uppercase tracking-widest px-2 py-0.5">
                                            {log.Resource}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusStyle(log.status)}`}>
                                            {log.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{log.timestamp}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#7ede56] hover:bg-[#7ede56]/10 rounded-lg">
                                                <ShieldCheck className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-50 rounded-lg">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-[#002f37]/20 border-[#7ede56]/20' : 'bg-[#eefcf0] border-[#7ede56]/20'} flex items-center justify-center transition-all bg-transparent group`}>
                <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest text-[#7ede56] group-hover:bg-[#7ede56] group-hover:text-[#002f37] transition-all gap-3 h-12 px-12 rounded-xl">
                    Synchronize Tactical archives <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                </Button>
            </div>
        </div>
    );
};

export default SystemLogs;
