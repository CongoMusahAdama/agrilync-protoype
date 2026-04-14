import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    Layers,
    Table as TableIcon,
    Clock,
    Calendar,
    ArrowUpRight,
    Search,
    Zap,
    Cpu,
    Globe,
    Terminal,
    ArrowRight,
    SearchCode,
    FileSpreadsheet,
    FilePieChart,
    ChevronRight,
    Filter,
    Activity,
    LineChart as LineChartIcon,
    Box
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { toast } from 'sonner';

const ReportsAnalytics = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [generating, setGenerating] = useState(false);

    const reports = [
        { id: 'R1', name: 'Operational Pulse Report', desc: 'Real-time agent productivity and field active thresholds.', format: ['PDF', 'Excel'], lastGenerated: '2 hours ago', data: [{ date: '04/01', val: 450 }, { date: '04/02', val: 520 }, { date: '04/03', val: 480 }, { date: '04/04', val: 610 }] },
        { id: 'R2', name: 'Regional Yield Matrix', desc: 'Deep dive into target fulfillment vs actual yields across all core hubs.', format: ['PDF', 'Excel', 'CSV'], lastGenerated: '1 day ago', data: [{ name: 'Ashanti', val: 850 }, { name: 'Western', val: 920 }, { name: 'Volta', val: 410 }, { name: 'Northern', val: 680 }] },
        { id: 'R3', name: 'Asset Vitality Audit', desc: 'Longitudinal health forensics for all registered farm plots.', format: ['PDF', 'CSV'], lastGenerated: '3 days ago' },
        { id: 'R4', name: 'Strategic Compliance Ledger', desc: 'Full audit logs of policy overrides and security triggers.', format: ['PDF', 'Excel'], lastGenerated: '12 hours ago' },
    ];

    const sysActivityData = [
        { time: '00:00', load: 20 }, { time: '04:00', load: 15 }, { time: '08:00', load: 65 },
        { time: '12:00', load: 85 }, { time: '16:00', load: 95 }, { time: '20:00', load: 55 },
    ];

    const handleGenerate = (report: any) => {
        setSelectedReport(report);
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setIsPreviewOpen(true);
        }, 1500);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shadow-inner">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Reports & Analytics
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        View and download system reports and data
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                        <Calendar className="w-4 h-4 mr-2" /> Global Schedule
                    </Button>
                    <Button className="bg-[#002f37] dark:bg-[#7ede56] dark:text-[#002f37] hover:scale-105 transition-all font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        Create Custom Extract
                    </Button>
                </div>
            </div>

            {/* Live Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <CardHeader className="p-6 pb-2">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#7ede56]" /> System Pulse (24h)
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase opacity-50">Authorized requests & core latency</CardDescription>
                            </div>
                            <Badge className="bg-[#7ede56]/10 text-[#7ede56] border-none font-black text-[9px]">LIVE TELEMETRY</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sysActivityData}>
                                <defs>
                                    <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7ede56" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7ede56" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#ffffff10' : '#00000010'} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, opacity: 0.5 }} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 900 }} />
                                <Area type="monotone" dataKey="load" stroke="#7ede56" strokeWidth={3} fill="url(#pulseGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                    <div className="p-6 grid grid-cols-2 gap-6 h-full">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Neural Analytics</h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Data Integrity', val: '99.98%', icon: ShieldCheck, color: 'text-[#7ede56]' },
                                        { label: 'Predictive Sync', val: 'Active', icon: Zap, color: 'text-blue-500' },
                                        { label: 'Network Latency', val: '42ms', icon: Globe, color: 'text-amber-500' },
                                    ].map((n, i) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-2">
                                                <n.icon className={`w-3.5 h-3.5 ${n.color}`} />
                                                <span className="text-[10px] font-black uppercase tracking-tight opacity-60">{n.label}</span>
                                            </div>
                                            <span className="text-[11px] font-black">{n.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button className="w-full bg-[#002f37] text-white hover:bg-[#001c21] h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Access Database Console
                            </Button>
                        </div>
                        <div className={`rounded-2xl flex flex-col items-center justify-center gap-2 relative overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-50 border border-black/5'}`}>
                            <PieChartIcon className="w-12 h-12 opacity-10 absolute -bottom-2 -right-2 rotate-12" />
                            <h5 className="text-4xl font-black tracking-tighter">8.4k</h5>
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-50 px-4 text-center leading-tight">Total Strategic Intelligence Points</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Reports Registry */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className={`lg:col-span-2 border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Available Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {reports.map((report) => (
                                <div key={report.id} className="p-6 flex items-center justify-between group hover:bg-[#7ede56]/5 transition-all border-l-4 border-transparent hover:border-[#7ede56]">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#eefcf0] text-[#002f37]'} border border-white/5 shadow-inner`}>
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-black text-lg uppercase tracking-tight">{report.name}</h3>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase leading-none">{report.desc}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-[8px] font-black opacity-30 border-dashed">LAST: {report.lastGenerated}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {report.format.map(f => (
                                            <Button 
                                                key={f} 
                                                onClick={() => handleGenerate(report)}
                                                disabled={generating}
                                                className="h-10 px-6 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-[#7ede56] hover:text-[#002f37] rounded-xl border border-white/5 shadow-premium"
                                            >
                                                {generating && selectedReport?.id === report.id ? 'COMPUTING...' : f}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Report Builder Utility */}
                <Card className={`border-none shadow-premium overflow-hidden p-8 flex flex-col justify-between relative ${darkMode ? 'bg-[#002f37] text-white' : 'bg-[#002f37] text-white'}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Box className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 w-content rounded-[18px] bg-[#7ede56]/10 border border-[#7ede56]/20 inline-block">
                                <Terminal className="w-8 h-8 text-[#7ede56]" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Custom Report<br/>Builder</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-relaxed max-w-[200px]">
                                Create your own reports using custom filters.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest opacity-60">
                                <span>SOURCE: GEO-CORE</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest opacity-60">
                                <span>RANGE: 90D MATRIX</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                    <Button className="relative z-10 w-full bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl mt-8">
                        Initiate Neural Extraction
                    </Button>
                </Card>
            </div>

            {/* Report Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className={`sm:max-w-[750px] border-none shadow-2xl p-0 overflow-hidden ${darkMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
                    {selectedReport && (
                        <div>
                            <div className="bg-[#002f37] p-8 text-white relative">
                                <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[9px] tracking-widest mb-4">TACTICAL PREVIEW MODE</Badge>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">Report Preview</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previewing data before download</p>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#7ede56]">Dataset Mockup (Top 4 Nodes)</h4>
                                    <div className={`overflow-hidden rounded-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                                        <table className="w-full text-left text-[10px] font-bold uppercase tracking-tight">
                                            <thead>
                                                <tr className={`${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                                                    <th className="p-4">Reference Node</th>
                                                    <th className="p-4">Production Metric</th>
                                                    <th className="p-4">Variance (%)</th>
                                                    <th className="p-4 text-right">Integrity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {(selectedReport.data || [{name: 'Ashanti-4', val: 890}, {name: 'Volta-A1', val: 450}]).map((d: any, i: number) => (
                                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                        <td className="p-4 font-black">{d.name || d.date}</td>
                                                        <td className="p-4">{d.val} UNITS</td>
                                                        <td className="p-4 text-blue-500">+1.2%</td>
                                                        <td className="p-4 text-right"><CheckCircle2 className="w-4 h-4 text-[#7ede56] ml-auto" /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="p-6 bg-[#7ede56]/5 rounded-2xl border border-dashed border-[#7ede56]/20 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-[#7ede56]/10 text-[#7ede56]"><Download className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-[#7ede56]">Extraction Protocol Ready</p>
                                            <p className="text-[9px] font-bold uppercase text-gray-500 italic">Checksum validated by root authority.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest border-2">PDF EXPORT</Button>
                                        <Button className="h-10 px-8 bg-[#002f37] text-white hover:bg-[#001c21] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">FINAL DOWNLOAD</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Generic placeholder icons not imported correctly
const ShieldCheck = (props: any) => <Activity {...props} />;
const CheckCircle2 = (props: any) => <Activity {...props} />;

export default ReportsAnalytics;
