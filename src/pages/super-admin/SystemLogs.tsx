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
    ArrowUpRight
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
                // Rich Mock data for audit logs
                setLogs([
                    { _id: 'LOG-1029', user: 'Super Admin', action: 'System Provisioning', Resource: 'New Supervisor: Sarah G.', status: 'Success', timestamp: '2026-03-12 14:22:10' },
                    { _id: 'LOG-1028', user: 'System', action: 'Weekly Backup', Resource: 'Regional DB Cluster', status: 'Success', timestamp: '2026-03-12 04:00:00' },
                    { _id: 'LOG-1027', user: '192.168.1.105', action: 'Failed Auth Attempt', Resource: 'Root Login Gateway', status: 'Blocked', timestamp: '2026-03-11 23:45:12' },
                    { _id: 'LOG-1026', user: 'Super Admin', action: 'Policy Override', Resource: 'Agent Sync Frequency', status: 'Authorized', timestamp: '2026-03-11 16:10:30' },
                    { _id: 'LOG-1025', user: 'Agent Osei', action: 'Report Finalization', Resource: 'Farm ID: F-1029', status: 'Authorized', timestamp: '2026-03-11 11:05:01' },
                    { _id: 'LOG-1024', user: 'Supervisor Mensah', action: 'Audit Initiation', Resource: 'Western North Hub', status: 'Success', timestamp: '2026-03-11 09:12:45' },
                    { _id: 'LOG-1023', user: 'System', action: 'API Token Rotation', Resource: 'External GIS Service', status: 'Success', timestamp: '2026-03-10 00:00:01' },
                    { _id: 'LOG-1022', user: 'Supervisor Amponsah', action: 'Regional Reset', Resource: 'Bono East Hub', status: 'Authorized', timestamp: '2026-03-09 18:30:15' },
                ]);
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
                return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 border-transparent';
            case 'blocked':
                return 'text-rose-500 bg-rose-100 dark:bg-rose-500/10 border-transparent';
            case 'pending review':
                return 'text-amber-500 bg-amber-100 dark:bg-amber-500/10 border-transparent';
            default:
                return 'text-blue-500 bg-blue-100 dark:bg-blue-500/10 border-transparent';
        }
    };

    const categories = [
        { title: 'Security Events', count: 124, icon: ShieldAlert, color: 'bg-rose-900', textColor: 'text-rose-200', description: 'Risk Alerts' },
        { title: 'Authorized Actions', count: 852, icon: CheckCircle2, color: 'bg-emerald-900', textColor: 'text-emerald-200', description: 'Valid Ops' },
        { title: 'System Ops', count: 42, icon: Database, color: 'bg-[#002f37]', textColor: 'text-[#7ede56]/70', description: 'Internal Logs' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>System Logs & Audit Trail</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Immutable record of platform-wide administrative actions</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] h-11 px-8 font-black uppercase text-[11px] tracking-widest shadow-premium rounded-2xl flex gap-3">
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((c, idx) => (
                    <Card
                        key={idx}
                        className={`${c.color} border-none shadow-premium hover:scale-[1.05] transition-all duration-300 cursor-pointer relative overflow-hidden h-36 md:h-40 group`}
                        onClick={() => navigate('/dashboard/super-admin/logs')}
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                            <c.icon className="h-24 w-24 absolute -right-4 -bottom-4 rotate-12 text-white" />
                        </div>

                        <CardHeader className="p-4 pb-0 relative z-10 flex flex-row items-center justify-between space-y-0">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                                <c.icon className="h-4 w-4 text-white" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-white/40" />
                        </CardHeader>

                        <CardContent className="p-4 pt-4 relative z-10 flex flex-col justify-end h-[calc(9rem-3rem)]">
                            <p className={`text-[9px] font-black ${c.textColor} uppercase tracking-[0.2em] mb-1 truncate`}>
                                {c.title}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-black text-white">
                                <CountUp end={c.count} duration={1000} />
                            </h3>
                            <p className="text-[8px] md:text-[9px] font-bold mt-1 md:mt-2 line-clamp-1 uppercase tracking-tighter text-white/40">
                                {c.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-[#7ede56]" />
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Master Audit Registry</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-72">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="Filter audit trail..." className={`pl-10 h-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100 shadow-inner'}`} />
                            </div>
                            <Button size="icon" variant="ghost" className="h-10 w-10 border border-gray-100 dark:border-gray-800">
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5 underline decoration-gray-200 underline-offset-8">Event Context</th>
                                <th className="px-6 py-5">Action Authority</th>
                                <th className="px-6 py-5">Target Resource</th>
                                <th className="px-6 py-5 text-center">Integrity Status</th>
                                <th className="px-6 py-5">Timestamp (UTC)</th>
                                <th className="px-6 py-5 text-right">Surveillance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {logs.map((log) => (
                                <tr key={log._id} className={`${darkMode ? 'hover:bg-[#002f37]/30' : 'hover:bg-emerald-50/20'} transition-colors group`}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-[#002f37]'}`}>
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <span className={`text-sm font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                {log.action}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <User className="w-3.5 h-3.5 text-blue-600" />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold border-none text-[9px] uppercase tracking-widest px-2 py-0.5">
                                            {log.Resource}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusStyle(log.status)}`}>
                                            {log.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{log.timestamp}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-[#002f37] dark:text-[#7ede56] hover:bg-[#7ede56]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ShieldCheck className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className={`p-8 rounded-2xl border-2 border-dashed ${darkMode ? 'border-gray-800 hover:border-[#7ede56]/30' : 'border-gray-100 hover:border-[#002f37]/10'} flex items-center justify-center transition-all bg-transparent group`}>
                <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#7ede56] transition-colors gap-3">
                    Synchronize Historical Archives <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                </Button>
            </div>
        </div>
    );
};

export default SystemLogs;
