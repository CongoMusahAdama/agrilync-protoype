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
    Search
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ReportsAnalytics = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();

    const reports = [
        { id: 'R1', name: 'Agent Productivity Report', desc: 'Login frequency, report submission rates, and field active hours.', format: ['PDF', 'Excel'], lastGenerated: '2 hours ago' },
        { id: 'R2', name: 'Regional Performance Matrix', desc: 'Aggregated yield vs targets across all active operational zones.', format: ['PDF', 'Excel', 'CSV'], lastGenerated: '1 day ago' },
        { id: 'R3', name: 'Farm Growth & Vitality Trends', desc: 'Longitudinal data on farm health and onboarding speed.', format: ['PDF', 'CSV'], lastGenerated: '3 days ago' },
        { id: 'R4', name: 'Training Impact Summary', desc: 'Analysis of farmer training attendance vs farm performance.', format: ['PDF'], lastGenerated: '1 week ago' },
        { id: 'R5', name: 'Compliance & Audit Trail', desc: 'Critical system actions, overrides, and security events logs.', format: ['PDF', 'Excel'], lastGenerated: '12 hours ago' },
    ];

    const analyticsMetrics = [
        { title: 'Intelligence Reports', value: 1240, icon: FileText, path: '/dashboard/super-admin/oversight', color: 'bg-[#002f37]', iconColor: 'text-[#7ede56]', description: 'Data Extracts' },
        { title: 'Strategic Queries', value: 85200, icon: BarChart3, path: '/dashboard/super-admin/logs', color: 'bg-[#065f46]', iconColor: 'text-white', description: 'System Analytics' },
        { title: 'Avg Sync Time', value: 1.4, icon: Clock, path: '/dashboard/super-admin/agents', color: 'bg-[#1e1b4b]', iconColor: 'text-white', description: 'Real-time Latency', suffix: 's' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Reports & Analytics</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Decision-focused data extraction and visualization</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 font-black uppercase text-[10px] tracking-widest h-11 px-6 border-gray-100 dark:border-gray-800 shadow-premium rounded-xl">
                        <Calendar className="w-4 h-4" /> Schedule Queue
                    </Button>
                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] h-11 px-6 font-black uppercase text-[10px] tracking-widest shadow-premium rounded-xl flex gap-2">
                        <TrendingUp className="w-4 h-4" /> Live Insights
                    </Button>
                </div>
            </div>

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {analyticsMetrics.map((m, idx) => (
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
                                <CountUp end={m.value} duration={1500} />{m.suffix}
                            </h3>
                            <p className="text-[8px] md:text-[9px] font-bold mt-1 md:mt-2 line-clamp-1 uppercase tracking-tighter text-white/60">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className={`lg:col-span-2 border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-black uppercase tracking-tight">Standard Decision Reports</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Downloadable datasets for executive review</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="Find report..." className={`pl-10 h-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100 shadow-inner'}`} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {reports.map((report) => (
                                <div key={report.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <div className="flex gap-4">
                                        <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800 text-emerald-400' : 'bg-[#7ede56]/10 text-[#002f37]'}`}>
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{report.name}</h3>
                                            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 max-w-sm mt-1 leading-relaxed">{report.desc}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-[9px] uppercase tracking-widest border-none">
                                                    Updated {report.lastGenerated}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {report.format.map(f => (
                                            <Button key={f} variant="outline" size="sm" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border-gray-100 dark:border-gray-800 hover:bg-[#7ede56] hover:text-[#002f37] hover:border-[#7ede56] transition-all">
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
                    <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-blue-500" /> Intelligence Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="group h-32 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center p-4 text-center hover:border-blue-500/30 transition-colors cursor-pointer">
                                <TrendingUp className="w-8 h-8 text-gray-300 group-hover:text-blue-500 transition-colors mb-2" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Forecast Matrix</span>
                            </div>
                            <div className="group h-32 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center p-4 text-center hover:border-emerald-500/30 transition-colors cursor-pointer">
                                <PieChart className="w-8 h-8 text-gray-300 group-hover:text-emerald-500 transition-colors mb-2" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resource Allocation Flow</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`relative overflow-hidden border-none shadow-premium ${darkMode ? 'bg-gray-900' : 'bg-[#002f37]'} text-white p-8`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Layers className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <Layers className="w-10 h-10 mb-6 text-[#7ede56]" />
                            <h3 className="text-xl font-black uppercase tracking-tighter">Strategic SQL Workbench</h3>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-2 leading-relaxed">
                                Access low-level database schemas for custom query generation and forensic deep dives.
                            </p>
                            <Button className="mt-8 w-full bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] h-12 font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center gap-3 shadow-xl">
                                <TableIcon className="w-4 h-4" /> Open Tactical Console
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
