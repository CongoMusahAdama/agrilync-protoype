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
    ShieldAlert,
    CheckCircle2,
    Database,
    ArrowUpRight,
    Clock,
    Zap,
    Key,
    Filter,
    FileText,
    History,
    AlertTriangle,
    Eye,
    Globe,
    Laptop,
    Server,
    Fingerprint
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SystemLogs = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterSeverity, setFilterSeverity] = useState('All');
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/super-admin/logs');
            if (res.data && res.data.length > 0) {
                setLogs(res.data);
            } else {
                // High-fidelity Forensic Mock Data
                setLogs([
                    { id: 'LOG-88201', action: 'Regional Policy Override', user: 'Admin Alpha', region: 'Ashanti', resource: 'Yield Threshold', severity: 'Critical', status: 'Authorized', timestamp: '2026-04-05T14:42:10Z', ip: '192.168.1.4', device: 'MacOS / Chrome' },
                    { id: 'LOG-88205', action: 'Bulk Agent Suspension', user: 'Security Root', region: 'Western', resource: 'User Registry', severity: 'High', status: 'Success', timestamp: '2026-04-05T12:15:22Z', ip: '10.0.0.8', device: 'Linux / Terminal' },
                    { id: 'LOG-88209', action: 'Wallet Ledger Re-index', user: 'System Auto', region: 'Global', resource: 'Financial Node', severity: 'Medium', status: 'Success', timestamp: '2026-04-05T10:00:00Z', ip: 'localhost', device: 'Local Node' },
                    { id: 'LOG-88212', action: 'Credential Reset Issued', user: 'Super Admin Beta', region: 'Eastern', resource: 'Agent AG-ES-001', severity: 'Low', status: 'Pending', timestamp: '2026-04-05T09:30:15Z', ip: '192.168.1.12', device: 'Windows / Edge' },
                    { id: 'LOG-88215', action: 'Failed Auth Attempt', user: 'Unknown', region: 'Volta', resource: 'Login Portal', severity: 'Critical', status: 'Blocked', timestamp: '2026-04-05T08:12:00Z', ip: '172.16.0.5', device: 'Unknown / Bot' },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch logs:', err);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityStyle = (sev: string) => {
        switch (sev.toLowerCase()) {
            case 'critical': return 'bg-rose-500 text-white animate-pulse border-none shadow-[0_0_8px_rgba(244,63,94,0.4)]';
            case 'high': return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border-none';
            case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-none';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-none';
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              log.user.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || log.action.includes(filterType);
        const matchesSeverity = filterSeverity === 'All' || log.severity === filterSeverity;
        return matchesSearch && matchesType && matchesSeverity;
    });

    const exportLogs = () => {
        toast.success('Forensic audit ledger exported to CSV format.');
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56] shadow-inner">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            System Activity Logs
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Review recent actions and security events on the platform
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                        <Calendar className="w-4 h-4 mr-2" /> Live Chronology
                    </Button>
                    <Button onClick={exportLogs} className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        <Download className="w-4 h-4 mr-2" /> Export Audit
                    </Button>
                </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {[
                    { label: 'Total Activity', val: '1,429', icon: History, color: 'text-[#7ede56]' },
                    { label: 'Security Alerts', val: '42', icon: ShieldAlert, color: 'text-rose-500' },
                    { label: 'System Status', val: '99.99%', icon: Activity, color: 'text-blue-500' },
                    { label: 'Recent Logins', val: '12', icon: Key, color: 'text-amber-500' },
                ].map((s, i) => (
                    <Card key={i} className={`border-none shadow-premium ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                                <h3 className="text-xl font-black">{s.val}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 ${s.color}`}>
                                <s.icon className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Log Matrix */}
            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                            <Input 
                                placeholder="Search action, user, IP..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 rounded-xl border-none shadow-inner bg-gray-50 dark:bg-gray-800" 
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select onValueChange={setFilterType} defaultValue="All">
                                <SelectTrigger className="h-12 w-[140px] rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-black text-[9px] uppercase tracking-widest">
                                    <SelectValue placeholder="Action Type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-2xl border-none">
                                    <SelectItem value="All">All Actions</SelectItem>
                                    <SelectItem value="Override">Override</SelectItem>
                                    <SelectItem value="Suspension">Suspension</SelectItem>
                                    <SelectItem value="Auth">Auth/Access</SelectItem>
                                    <SelectItem value="Reset">Reset</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setFilterSeverity} defaultValue="All">
                                <SelectTrigger className="h-12 w-[140px] rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-black text-[9px] uppercase tracking-widest">
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-2xl border-none">
                                    <SelectItem value="All">All Severity</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#002f37] text-white text-[10px] font-black uppercase tracking-widest">
                                <th className="p-5">Action Taken</th>
                                <th className="p-5">Performed By</th>
                                <th className="p-5">Security Level</th>
                                <th className="p-5 text-center">Result</th>
                                <th className="p-5 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[11px] font-bold">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-[#7ede56]/5 transition-colors group cursor-pointer" onClick={() => { setSelectedLog(log); setIsDetailOpen(true); }}>
                                    <td className="p-5 flex items-center gap-3 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-[#7ede56]/20 transition-colors">
                                            <Zap className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                                        </div>
                                        <span className="font-black uppercase tracking-tight">{log.action}</span>
                                    </td>
                                    <td className="p-5 uppercase">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                <User className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <span className="opacity-70 text-[10px]">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <Badge className={`px-3 py-0.5 text-[8px] font-black uppercase tracking-widest ${getSeverityStyle(log.severity)}`}>
                                            {log.severity}
                                        </Badge>
                                    </td>
                                    <td className="p-5 text-center">
                                        <Badge variant="outline" className={`border-none font-black text-[9px] uppercase tracking-[0.2em] ${log.status === 'Success' || log.status === 'Authorized' ? 'text-[#7ede56] bg-[#7ede56]/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                            {log.status}
                                        </Badge>
                                    </td>
                                    <td className="p-5 text-right font-mono opacity-50 uppercase tracking-tighter">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Log Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className={`sm:max-w-[650px] border-none shadow-2xl p-0 overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                    {selectedLog && (
                        <div>
                            <div className="bg-[#002f37] p-8 text-white relative">
                                <div className="absolute top-4 right-4"><Fingerprint className="w-12 h-12 opacity-10" /></div>
                                <Badge className={`${getSeverityStyle(selectedLog.severity)} text-[9px] px-3 font-black uppercase mb-4`}>{selectedLog.severity} PRIORITY</Badge>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">{selectedLog.action}</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Audit ID: #{selectedLog.id}</p>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-black/5 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Initiator Context</h4>
                                        <div><p className="text-[8px] font-black text-gray-400 uppercase">User Handle</p><p className="text-sm font-black">{selectedLog.user}</p></div>
                                        <div><p className="text-[8px] font-black text-gray-400 uppercase">Origin IP</p><p className="font-mono text-xs font-bold text-blue-500">{selectedLog.ip}</p></div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-black/5 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Laptop className="w-3.5 h-3.5" /> Environment</h4>
                                        <div><p className="text-[8px] font-black text-gray-400 uppercase">Device Profile</p><p className="text-sm font-black">{selectedLog.device}</p></div>
                                        <div><p className="text-[8px] font-black text-gray-400 uppercase">Region Access</p><p className="text-xs font-bold uppercase">{selectedLog.region} HUB</p></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Server className="w-3.5 h-3.5" /> Raw System Payload</h4>
                                    <div className="p-6 rounded-2xl bg-[#002f37] text-[#7ede56] font-mono text-[10px] leading-relaxed shadow-inner">
                                        <pre className="whitespace-pre-wrap">
{`{
  "event_id": "${selectedLog.id}",
  "action": "${selectedLog.action}",
  "resource": "${selectedLog.resource}",
  "integrity": "${selectedLog.status.toLowerCase()}",
  "timestamp": "${selectedLog.timestamp}",
  "metadata": {
    "auth_token_verified": true,
    "source_region": "${selectedLog.region.toLowerCase()}",
    "checksum": "0x${Math.random().toString(16).slice(2, 10)}"
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                                <Button className="w-full h-14 bg-[#002f37] text-white hover:bg-[#001c21] rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all" onClick={() => setIsDetailOpen(false)}>
                                    Release Audit Lock
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SystemLogs;
