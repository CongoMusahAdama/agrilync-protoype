import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
    Users,
    Activity,
    ShieldAlert,
    CheckCircle2,
    Clock,
    Search,
    MonitorPlay,
    History,
    Briefcase,
    ArrowUpRight,
    MapPin,
    Building2,
    TrendingUp,
    ShieldCheck,
    Navigation,
    Zap,
    Video,
    Mic,
    Phone,
    FileText,
    MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const AgentAccountability = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [agents, setAgents] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionModal, setActionModal] = useState<{
        isOpen: boolean;
        type: 'assign' | 'monitor' | 'history' | 'details' | null;
        data: any;
    }>({ isOpen: false, type: null, data: null });
    const [selectedZone, setSelectedZone] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const filteredAgents = agents.filter(agent =>
        agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.region?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await api.get('/super-admin/agents');
                if (res.data && res.data.length > 0) {
                    setAgents(res.data.map((a: any) => ({
                        ...a,
                        assignedFarmers: a.assignedFarmers || 0
                    })));
                    setStats({
                        activeNow: res.data.filter((a: any) => a.isLoggedIn).length,
                        totalAgents: res.data.length,
                        atRisk: res.data.filter((a: any) => a.status === 'at risk').length
                    });
                } else {
                    throw new Error('Empty');
                }
            } catch (err) {
                console.error('Failed to fetch agents:', err);
                setAgents([]);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const getStatusBadge = (agent: any) => {
        if (agent.isLoggedIn) return <Badge className="bg-[#7ede56]/10 text-[#7ede56] border-[#7ede56]/20 font-black text-[9px] tracking-tighter">LIVE OPERATIONAL</Badge>;
        if (agent.status === 'at risk') return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-black text-[9px] tracking-tighter animate-pulse">CRITICAL RISK</Badge>;
        return <Badge variant="secondary" className="font-black text-[9px] tracking-tighter opacity-50 uppercase">OFFLINE</Badge>;
    };

    const topMetrics = [
        {
            id: 'operations',
            title: 'Operations Leaders',
            value: stats?.totalAgents || 0,
            icon: Briefcase,
            color: 'bg-blue-600',
            iconColor: 'text-white',
            description: 'Total Field Personnel',
            details: 'Active in 5 zones',
            trend: [{ time: 'M', value: 10 }, { time: 'T', value: 12 }, { time: 'W', value: 15 }, { time: 'T', value: 14 }, { time: 'F', value: 18 }],
            breakdown: [{ name: 'Senior', value: 30, color: '#93c5fd' }, { name: 'Junior', value: 70, color: '#60a5fa' }]
        },
        {
            id: 'activity',
            title: 'Live Activity',
            value: stats?.activeNow || 0,
            icon: Activity,
            color: 'bg-[#7ede56]',
            iconColor: 'text-[#002f37]',
            description: 'Agents Polling Now',
            details: 'High intensity polling',
            trend: [{ time: '9am', value: 5 }, { time: '11am', value: 15 }, { time: '1pm', value: 25 }, { time: '3pm', value: 20 }, { time: '5pm', value: 10 }],
            breakdown: [{ name: 'Online', value: 85, color: '#6ee7b7' }, { name: 'Idle', value: 15, color: '#34d399' }]
        },
        {
            id: 'alerts',
            title: 'Security Alerts',
            value: stats?.atRisk || 0,
            icon: ShieldAlert,
            color: 'bg-rose-600',
            iconColor: 'text-white',
            description: 'Performance Redlines',
            details: 'Requires immediate attention',
            trend: [{ time: 'M', value: 2 }, { time: 'T', value: 1 }, { time: 'W', value: 5 }, { time: 'T', value: 3 }, { time: 'F', value: 0 }],
            breakdown: [{ name: 'Critical', value: 20, color: '#fda4af' }, { name: 'Warning', value: 80, color: '#fb7185' }]
        },
    ];

    const handleCardClick = (metric: any) => {
        setSelectedMetric(metric);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Personnel Oversight
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Agent accountability & live performance surveillance
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                        <Input
                            placeholder="Search personnel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-10 h-11 border-none ${darkMode ? 'bg-gray-900 focus:ring-1 ring-[#7ede56]/30' : 'bg-white shadow-premium'}`}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setActionModal({ isOpen: true, type: 'assign', data: null });
                            setSelectedZone('');
                        }}
                        className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium"
                    >
                        <Navigation className="w-4 h-4 mr-2" /> Assign Zones
                    </Button>
                </div>
            </div>

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {topMetrics.map((m, idx) => (
                    <Card
                        key={idx}
                        className={`${m.color} border-none shadow-premium hover:scale-[1.05] transition-all duration-500 cursor-pointer relative overflow-hidden h-36 md:h-44 group`}
                        onClick={() => handleCardClick(m)}
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                            <m.icon className={`h-32 w-32 absolute -right-4 -bottom-4 rotate-12 ${m.iconColor}`} />
                        </div>

                        <CardHeader className="p-4 pb-0 relative z-20 flex flex-row items-center justify-between space-y-0">
                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                                <m.icon className={`h-4 w-4 ${m.iconColor}`} />
                            </div>
                            <div className="flex items-center gap-1">
                                <ArrowUpRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-4 relative z-20 flex flex-col justify-end h-[calc(9rem-3rem)] md:h-[calc(11.5rem-3rem)] transition-all duration-500 group-hover:-translate-y-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 truncate text-white/80">
                                {m.title}
                            </p>
                            <h3 className="text-3xl md:text-3xl font-black text-white">
                                {stats ? (
                                    <CountUp end={m.value} duration={2000} />
                                ) : (
                                    <span className="animate-pulse">...</span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                                <TrendingUp className="h-3 w-3 text-[#7ede56]" />
                                <p className="text-[9px] font-bold line-clamp-1 uppercase tracking-tighter text-white/60">
                                    {m.description}
                                </p>
                            </div>
                        </CardContent>

                        {/* Hover Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Card>
                ))}
            </div>

            {/* Metric Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className={`w-[320px] border-none shadow-premium rounded-[32px] overflow-hidden p-0 fixed top-28 right-12 left-auto bottom-auto translate-x-0 translate-y-0 animate-in slide-in-from-top-2 duration-500 ${darkMode ? 'bg-[#002f37] text-white' : 'bg-white'}`}>
                    {selectedMetric ? (
                        <div className="relative">
                            {/* Decorative Header - Compact */}
                            <div className={`h-24 w-full ${selectedMetric.color} flex items-center justify-center relative overflow-hidden`}>
                                <selectedMetric.icon className="w-32 h-32 absolute -right-6 -bottom-6 opacity-20 rotate-12 text-white" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                                <div className="relative z-10 text-center">
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-80 mb-0.5 text-white">Live Intel</p>
                                    <DialogTitle className="text-xl font-black uppercase tracking-tighter text-white">{selectedMetric.title}</DialogTitle>
                                    <DialogDescription className="sr-only">Detailed metrics and trends for {selectedMetric.title}</DialogDescription>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'} border-l-4 border-[#7ede56] flex justify-between items-center`}>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Current</p>
                                            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                <CountUp end={selectedMetric.value} duration={1000} />
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-[#7ede56] text-[#002f37] font-black text-[8px] px-1.5 py-0 mb-1">ACTIVE</Badge>
                                            <p className={`text-[8px] font-bold block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedMetric.details}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Trend Chart - Very Condensed */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingUp className="w-3 h-3 text-[#7ede56]" />
                                            <h4 className="text-[8px] font-black uppercase tracking-widest">Momentum</h4>
                                        </div>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase">7D Trend</span>
                                    </div>
                                    <div className="h-[80px] w-full bg-gray-50/30 dark:bg-black/10 rounded-xl p-2 border border-black/5 dark:border-white/5">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={selectedMetric.trend}>
                                                <defs>
                                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={selectedMetric.id === 'logins' ? '#002f37' : '#7ede56'} stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor={selectedMetric.id === 'logins' ? '#002f37' : '#7ede56'} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke='#7ede56'
                                                    strokeWidth={2}
                                                    fillOpacity={1}
                                                    fill="url(#colorVal)"
                                                />
                                                <XAxis dataKey="time" hide />
                                                <YAxis hide />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Breakdown Icons */}
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedMetric.breakdown.map((item: any) => (
                                        <div key={item.name} className={`px-3 py-2 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'} flex items-center justify-between border border-transparent hover:border-[#7ede56]/30 transition-colors`}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-[7px] font-black uppercase tracking-tighter text-gray-400">{item.name}</span>
                                            </div>
                                            <span className={`text-[10px] font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{item.value}%</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    className="w-full h-11 bg-[#7ede56] hover:bg-[#6bcb4b] text-[#002f37] font-black uppercase text-[9px] tracking-[0.15em] rounded-xl shadow-lg transition-all"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Full Data Perspective
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 flex items-center justify-center">
                            <DialogTitle className="sr-only">Metric Details</DialogTitle>
                            <DialogDescription className="sr-only">Loading...</DialogDescription>
                            <div className="animate-spin w-6 h-6 border-2 border-[#7ede56] border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#7ede56]" /> Operational Registry
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Real-time status of all field personnel</CardDescription>
                        </div>
                        <Badge variant="outline" className="h-8 px-3 rounded-lg border-dashed font-black">
                            REFRESHING IN: <span className="text-[#7ede56] ml-2 font-mono">24s</span>
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                <th className="p-4 border-r border-[#ffffff20]">Personnel (Leader)</th>
                                <th className="p-4 border-r border-[#ffffff20]">Assigned Zone</th>
                                <th className="p-4 border-r border-[#ffffff20]">Total Farmers</th>
                                <th className="p-4 border-r border-[#ffffff20]">Current Pulse</th>
                                <th className="p-4 border-r border-[#ffffff20] text-center">Output Rating</th>
                                <th className="p-4 border-r border-[#ffffff20]">Integrity</th>
                                <th className="p-4 text-right">Observation</th>
                            </tr>
                        </thead>
                        <tbody className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {currentItems.map((agent) => (
                                <tr key={agent.agentId || agent._id} className={`border-b group transition-colors ${darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-l-4 border-l-transparent group-hover:border-l-[#7ede56]`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${darkMode ? 'bg-gray-800 text-[#7ede56]' : 'bg-[#eefcf0] text-[#002f37]'} border border-white/5`}>
                                                {agent.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-black uppercase tracking-tight text-xs ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{agent.name}</span>
                                                <span className="text-[9px] font-bold text-gray-500 tracking-tighter">{agent.agentId || 'UID-PENDING'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-[#7ede56]/60" />
                                            <span className={`text-[10px] font-black uppercase tracking-tight ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {agent.region || 'GLOBAL CORE'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3 h-3 text-[#7ede56]/60" />
                                            <span className={`text-[10px] font-black uppercase tracking-tight ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {agent.assignedFarmers || 0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(agent)}
                                            </div>
                                            <span className="text-[8px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                                                <Clock className="w-2 h-2" /> {agent.lastSync || 'POLLING SYSTEM...'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`font-black text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{agent.reports || 0}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reports</span>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="flex flex-col gap-1.5 w-24">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                                <span className="text-gray-400">Score</span>
                                                <span className={parseInt((agent.compliance || '0').replace('%', '')) > 90 ? 'text-[#7ede56]' : 'text-[#7ede56]'}>{agent.compliance || '0%'}</span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${parseInt((agent.compliance || '0').replace('%', '')) > 90 ? 'bg-[#7ede56]' : (parseInt((agent.compliance || '0').replace('%', '')) > 70 ? 'bg-[#7ede56]' : 'bg-rose-500')}`}
                                                    style={{ width: agent.compliance || '0%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                                onClick={() => setActionModal({ isOpen: true, type: 'monitor', data: agent })}
                                            >
                                                <MonitorPlay className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-[#7ede56] hover:bg-[#7ede56]/10 rounded-lg"
                                                onClick={() => setActionModal({ isOpen: true, type: 'history', data: agent })}
                                            >
                                                <History className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-400 hover:bg-gray-100 rounded-lg"
                                                onClick={() => setActionModal({ isOpen: true, type: 'details', data: agent })}
                                            >
                                                <ArrowUpRight className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>

                {/* Pagination Controls */}
                {filteredAgents.length > itemsPerPage && (
                    <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'} flex items-center justify-between`}>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAgents.length)} of {filteredAgents.length}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`h-8 w-8 p-0 rounded-lg ${darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200'}`}
                            >
                                <span className="sr-only">Previous</span>
                                ←
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Logic to show a window of pages could be complex, keeping it simple for now or just showing current
                                    // Just show current page indicator for simplicity in this complexity constraint, or small numeric buttons
                                    // Let's stick to simple Prev/Next and maybe page numbers if few
                                    let p = i + 1;
                                    if (totalPages > 5) {
                                        // Simple windowing logic adjustment if needed, but for now linear 1..5 is okay or just Prev/Next with "Page X of Y"
                                        return null; // Simplifying to just Prev/Next with text
                                    }
                                    return (
                                        <Button
                                            key={p}
                                            variant={currentPage === p ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(p)}
                                            className={`h-8 w-8 p-0 rounded-lg font-bold text-xs ${currentPage === p ? 'bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b]' : (darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200')}`}
                                        >
                                            {p}
                                        </Button>
                                    );
                                })}
                                {totalPages > 5 && (
                                    <span className={`text-xs font-bold px-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`h-8 w-8 p-0 rounded-lg ${darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200'}`}
                            >
                                <span className="sr-only">Next</span>
                                →
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-indigo-500/5 rotate-12 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 rounded-[24px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-indigo-900 dark:text-indigo-400`}>Performance Integrity Shield</h3>
                        <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-indigo-700/60 dark:text-indigo-400/60 mt-2 leading-relaxed`}>
                            Automated GPS cross-verification and facial biometric logs are enabled for all assigned zones. Discrepancy threshold: 0.5%.
                        </p>
                    </div>
                </div>
                <Button variant="default" className="font-black text-[10px] px-10 tracking-widest h-12 uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-xl relative z-10">
                    Export Compliance Audit
                </Button>
            </div>

            {/* General Action Modal */}
            <Dialog open={actionModal.isOpen} onOpenChange={(open) => !open && setActionModal(prev => ({ ...prev, isOpen: false }))}>
                <DialogContent className={`sm:max-w-[425px] border-none shadow-2xl ${darkMode ? 'bg-[#002f37] text-white' : 'bg-white'}`}>
                    <DialogTitle className="sr-only">Action Modal</DialogTitle>
                    <DialogDescription className="sr-only">Perform actions on the selected agent</DialogDescription>
                    <div className="grid gap-4 py-4">
                        {actionModal.type === 'assign' && (
                            <div className="text-center space-y-6">
                                <div className="space-y-2">
                                    <div className="mx-auto w-12 h-12 bg-[#7ede56]/20 rounded-full flex items-center justify-center text-[#7ede56]">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight">Zone Assignment</h3>
                                        <p className="text-xs opacity-70">Select an operational zone for deployment.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Ashanti', 'Eastern', 'Northern', 'Western', 'Volta', 'Greater Accra', 'Central', 'Bono'].map((zone) => (
                                        <div
                                            key={zone}
                                            onClick={() => setSelectedZone(zone)}
                                            className={`
                                                cursor-pointer p-3 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden
                                                ${selectedZone === zone
                                                    ? 'bg-[#7ede56]/10 border-[#7ede56] text-[#7ede56]'
                                                    : (darkMode ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-gray-50 border-gray-100 hover:border-gray-200')}
                                            `}
                                        >
                                            <div className="relative z-10 flex items-center justify-between">
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${selectedZone === zone ? 'text-[#7ede56]' : (darkMode ? 'text-gray-300' : 'text-gray-600')}`}>
                                                    {zone}
                                                </span>
                                                {selectedZone === zone && <CheckCircle2 className="w-3.5 h-3.5 text-[#7ede56]" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    disabled={!selectedZone}
                                    onClick={() => setActionModal(p => ({ ...p, isOpen: false }))}
                                    className={`w-full font-black uppercase tracking-widest transition-all ${!selectedZone ? 'opacity-50 cursor-not-allowed bg-gray-500' : 'bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b]'}`}
                                >
                                    Confirm Assignment
                                </Button>
                            </div>
                        )}

                        {actionModal.type === 'monitor' && (
                            <div className="text-center space-y-6">
                                <div className="relative mx-auto w-24 h-24">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'} border-4 ${darkMode ? 'border-gray-700' : 'border-white'} shadow-xl`}>
                                        {actionModal.data?.name?.charAt(0)}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#7ede56] border-4 border-white dark:border-gray-900 rounded-full"></div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-black uppercase tracking-tight">{actionModal.data?.name}</h3>
                                    <div className="flex items-center justify-center gap-2">
                                        <Badge variant="outline" className="bg-[#7ede56]/10 text-[#7ede56] border-[#7ede56]/20 px-3 py-1 font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#7ede56] mr-2 animate-pulse"></span>
                                            Ready for Call
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                                        <Mic className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                                        <Video className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        className="w-full h-12 bg-[#002f37] hover:bg-[#002f37]/90 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                                        onClick={() => window.open('https://meet.google.com/new', '_blank')}
                                    >
                                        <Video className="w-4 h-4" /> Start Video Check-In
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="mt-2 text-xs text-gray-400 hover:text-gray-600"
                                        onClick={() => setActionModal(p => ({ ...p, isOpen: false }))}
                                    >
                                        Cancel Connectivity
                                    </Button>
                                </div>
                            </div>
                        )}

                        {actionModal.type === 'history' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            {actionModal.data?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black uppercase tracking-tight">{actionModal.data?.name}</h3>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Activity Feed</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                                    {[
                                        { title: 'Field Report Submitted', time: '12 mins ago', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
                                        { title: 'Zone Check-In: Ashanti A-4', time: '45 mins ago', icon: MapPin, color: 'text-[#7ede56]', bg: 'bg-[#7ede56]/10' },
                                        { title: 'Verification Completed', time: '1 hr ago', icon: CheckCircle2, color: 'text-[#7ede56]', bg: 'bg-[#7ede56]/10 dark:bg-[#7ede56]/20' },
                                        { title: 'Shift Started', time: '4 hrs ago', icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
                                    ].map((item, i) => (
                                        <div key={i} className="relative pl-6">
                                            <div className={`absolute left-[-19px] top-1 p-1 rounded-full border-4 ${darkMode ? 'border-[#002f37] bg-gray-900' : 'border-white bg-white'}`}>
                                                <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`}></div>
                                            </div>
                                            <div className={`p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'} border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors`}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                                        <span className={`text-xs font-bold ${item.color}`}>{item.title}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                                                </div>
                                                <p className="text-xs opacity-70 leading-relaxed">
                                                    Action successfully logged and verified by system protocols.
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                    View Full History
                                </Button>
                            </div>
                        )}

                        {actionModal.type === 'details' && (
                            <div className="space-y-4 text-center">
                                <div className="mx-auto w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center text-xl font-black">
                                    {actionModal.data?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">{actionModal.data?.name}</h3>
                                    <p className="text-xs opacity-60 uppercase tracking-widest">{actionModal.data?.agentId}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="block text-[9px] opacity-50 uppercase tracking-widest">Compliance</span>
                                        <span className="text-lg font-black text-[#7ede56]">{actionModal.data?.compliance}</span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="block text-[9px] opacity-50 uppercase tracking-widest">Reports</span>
                                        <span className="text-lg font-black">{actionModal.data?.reports}</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-[#7ede56] text-[#002f37] font-black uppercase tracking-widest">View Full Profile</Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default AgentAccountability;





