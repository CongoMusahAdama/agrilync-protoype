import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    BarChart3,
    PieChart,
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
    ArrowRight
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ReportsAnalytics = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();

    const reports = [
        { id: 'R1', name: 'Operational Pulse Report', desc: 'Real-time agent productivity, login telemetry, and field active thresholds.', format: ['PDF', 'Excel'], lastGenerated: '2 hours ago' },
        { id: 'R2', name: 'Regional Yield Matrix', desc: 'Deep dive into target fulfillment vs actual yields across all core hubs.', format: ['PDF', 'Excel', 'CSV'], lastGenerated: '1 day ago' },
        { id: 'R3', name: 'Asset Vitality Audit', desc: 'Longitudinal health forensics for all registered farm plots and cattle herds.', format: ['PDF', 'CSV'], lastGenerated: '3 days ago' },
        { id: 'R4', name: 'Strategic Compliance Ledger', desc: 'Full audit logs of policy overrides, security triggers, and system resets.', format: ['PDF', 'Excel'], lastGenerated: '12 hours ago' },
    ];

    const analyticsMetrics = [
        { title: 'Intelligence Extracts', value: 0, icon: FileText, path: '/dashboard/super-admin/oversight', color: 'bg-slate-950', iconColor: 'text-[#7ede56]', description: 'Total Data Nodes Exported' },
        { title: 'Neural Queries', value: 0, icon: Cpu, path: '/dashboard/super-admin/logs', color: 'bg-[#002f37]', iconColor: 'text-white', description: 'Real-time Engine Pulsations' },
        { title: 'Network Latency', value: 0, icon: Globe, path: '/dashboard/super-admin/agents', color: 'bg-[#1e1b4b]', iconColor: 'text-white', description: 'System Response (mS)', suffix: 'ms' },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56] shadow-inner">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Intelligence Hub
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Advanced forensics, predictive analytics, and data extraction
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200 shadow-premium'}`}>
                        <Calendar className="w-4 h-4 mr-2" /> Schedule Protocols
                    </Button>
                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        <TrendingUp className="w-4 h-4 mr-2" /> Live Insights
                    </Button>
                </div>
            </div>

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {analyticsMetrics.map((m, idx) => (
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
                                <CountUp end={m.value} duration={2000} />{m.suffix}
                            </h3>
                            <p className="text-[8px] font-bold mt-1 text-white/30 truncate uppercase tracking-tighter italic">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className={`lg:col-span-2 border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#7ede56]" /> Tactical Extract Registry
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Authorized decision-support datasets</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                                <Input placeholder="Find intelligence node..." className={`pl-10 h-10 border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-50'}`} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {reports.map((report) => (
                                <div key={report.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-[#7ede56]/5 transition-colors group border-l-4 border-transparent hover:border-[#7ede56]">
                                    <div className="flex gap-5 flex-1">
                                        <div className={`p-4 rounded-[20px] h-fit ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#eefcf0] text-[#002f37]'} border border-white/5 shadow-inner`}>
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className={`text-lg font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{report.name}</h3>
                                            <p className="text-[11px] font-bold text-gray-400 max-w-sm leading-relaxed uppercase tracking-wide">{report.desc}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="border-dashed text-[9px] font-black uppercase tracking-[0.2em] opacity-50">
                                                    SYNCHRONIZED {report.lastGenerated}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        {report.format.map(f => (
                                            <Button key={f} className="h-10 px-6 text-[10px] font-black uppercase tracking-widest bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-[#7ede56] hover:text-[#002f37] transition-all rounded-xl border border-white/5">
                                                <Download className="w-3.5 h-3.5 mr-2" /> {f}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-gray-500">
                                <Zap className="w-4 h-4 text-[#7ede56]" /> Neural Presets
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            {[
                                { name: 'Growth Forecast Matrix', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { name: 'Asset Allocation Flow', icon: PieChart, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                { name: 'Satellite Yield Drift', icon: Globe, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                            ].map((preset, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'} border border-transparent hover:border-[#7ede56]/30 cursor-pointer group transition-all`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${preset.bg} ${preset.color}`}>
                                            <preset.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{preset.name}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className={`relative overflow-hidden border-none shadow-premium ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-slate-950'} p-8 group`}>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                            <Terminal className="w-32 h-32 text-white" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="p-3 w-content rounded-[18px] bg-[#7ede56]/10 border border-[#7ede56]/20 inline-block">
                                <Terminal className="w-8 h-8 text-[#7ede56]" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Tactical Query Sandbox</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-relaxed max-w-[200px]">
                                    Execute low-level SQL protocols for forensic data deep-dives.
                                </p>
                            </div>
                            <Button className="w-full bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] h-12 font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-2 shadow-2xl">
                                Initiate Console <Zap className="w-4 h-4 fill-current" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
