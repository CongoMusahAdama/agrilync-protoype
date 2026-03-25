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
    ArrowRight,
    TrendingUp,
    Zap,
    MapPin,
    Briefcase,
    Globe,
    FileText,
    Phone,
    Mail,
    User,
    Activity,
    Users,
    Eye
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const fetchPartnerships = async () => {
            try {
                const res = await api.get('/super-admin/partnerships');
                const data = Array.isArray(res.data) ? res.data : [];
                setPartnerships(data);
                setStats({
                    total: data.length,
                    ongoing: data.filter((p: any) => p.status === 'Ongoing' || p.status === 'active').length,
                    completed: data.filter((p: any) => p.status === 'Completed' || p.status === 'approved').length,
                    escalated: data.filter((p: any) => p.status === 'Escalated' || p.status === 'Disputed').length
                });
            } catch (err) {
                console.error('Failed to fetch partnerships:', err);
                setPartnerships([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPartnerships();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ongoing': return <Badge className="bg-blue-500/10 text-blue-500 border-none font-black text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase">ONGOING CYCLE</Badge>;
            case 'completed': return <Badge className="bg-[#7ede56]/10 text-[#7ede56] border-none font-black text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase">EXIT COMPLETE</Badge>;
            case 'escalated':
            case 'disputed': return <Badge className="bg-rose-500/10 text-rose-500 border-none animate-pulse font-black text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase">RISK ALERT</Badge>;
            default: return <Badge variant="secondary" className="font-black text-[9px] tracking-widest px-3 py-1 rounded-lg uppercase">{status}</Badge>;
        }
    };

    const [selectedMetric, setSelectedMetric] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPartnership, setSelectedPartnership] = useState<any>(null);
    const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);

    const handleCardClick = (metric: any) => {
        setSelectedMetric(metric);
        setIsModalOpen(true);
    };

    const handlePartnershipClick = (partnership: any) => {
        setSelectedPartnership(partnership);
        setIsPartnershipModalOpen(true);
    };

    const topMetrics = [
        {
            id: 'allocations',
            title: 'Capital Allocations',
            value: stats.total,
            icon: Handshake,
            path: '/dashboard/super-admin/oversight',
            color: 'bg-slate-950',
            iconColor: 'text-[#7ede56]',
            description: 'Live Managed Portfolios',
            details: 'Active across 4 continents',
            textColor: 'text-white',
            trend: [{ time: 'Mon', value: 10 }, { time: 'Tue', value: 15 }, { time: 'Wed', value: 8 }, { time: 'Thu', value: 12 }, { time: 'Fri', value: 20 }],
            breakdown: [{ name: 'Corporate', value: 60, color: '#94a3b8' }, { name: 'SME', value: 40, color: '#cbd5e1' }]
        },
        {
            id: 'synergies',
            title: 'Active Synergies',
            value: stats.ongoing,
            icon: Globe,
            path: '/dashboard/super-admin/regions',
            color: 'bg-[#002f37]',
            iconColor: 'text-white',
            description: 'Cross-Border Ops',
            details: 'Expanding in East Africa',
            textColor: 'text-white',
            trend: [{ time: 'Wk1', value: 5 }, { time: 'Wk2', value: 8 }, { time: 'Wk3', value: 12 }, { time: 'Wk4', value: 15 }],
            breakdown: [{ name: 'Regional', value: 70, color: '#2dd4bf' }, { name: 'Intl', value: 30, color: '#99f6e4' }]
        },
        {
            id: 'exits',
            title: 'De-risked Exits',
            value: stats.completed,
            icon: TrendingUp,
            path: '/dashboard/super-admin/analytics',
            color: 'bg-[#1e1b4b]',
            iconColor: 'text-white',
            description: 'Verified Payouts',
            details: '100% success rate this month',
            textColor: 'text-white',
            trend: [{ time: 'Q1', value: 20 }, { time: 'Q2', value: 25 }, { time: 'Q3', value: 22 }, { time: 'Q4', value: 30 }],
            breakdown: [{ name: 'Early', value: 20, color: '#818cf8' }, { name: 'Matured', value: 80, color: '#c7d2fe' }]
        },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56] shadow-inner">
                            <Handshake className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Partnership Intel
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Strategic oversight of farm-investor capital matching
                    </p>
                </div>
            </div>
            <div className="relative">
                <Button
                    variant="outline"
                    className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800 hover:bg-white/5' : 'border-gray-200 shadow-premium'} ${selectedRegion !== 'All' ? 'border-[#7ede56] text-[#7ede56]' : ''}`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <Filter className="w-4 h-4 mr-2" /> {selectedRegion === 'All' ? 'Filter Regions' : selectedRegion}
                </Button>

                {isFilterOpen && (
                    <div className={`absolute right-0 top-14 w-48 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 ${darkMode ? 'bg-[#002f37] border border-gray-700' : 'bg-white border border-gray-100'}`}>
                        <div className="p-2 space-y-1">
                            {['All', 'Northern', 'Ashanti', 'Volta', 'Eastern', 'Western', 'Oti'].map((region) => (
                                <button
                                    key={region}
                                    onClick={() => {
                                        setSelectedRegion(region);
                                        setIsFilterOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${selectedRegion === region ? 'bg-[#7ede56] text-[#002f37]' : (darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50')}`}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            {/* Premium Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
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
                                {loading ? (
                                    <span className="animate-pulse">...</span>
                                ) : (
                                    <CountUp end={m.value} duration={2000} />
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
                                                        <stop offset="5%" stopColor="#7ede56" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#7ede56" stopOpacity={0} />
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#7ede56]" /> Active Partnerships Registry
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Real-time tracking of investments and progress</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                            <Input
                                placeholder="Search farm, investor, or agent..."
                                className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-50'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                <th className="p-4 border-r border-[#ffffff20]">Partnership Entity</th>
                                <th className="p-4 border-r border-[#ffffff20]">Assigned Agent</th>
                                <th className="p-4 border-r border-[#ffffff20]">Current Status</th>
                                <th className="p-4 border-r border-[#ffffff20]">Yield Progress</th>
                                <th className="p-4 border-r border-[#ffffff20]">Start Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>

                            {partnerships.filter(p => {
                                const matchesSearch = p.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    p.investor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (p.agent && p.agent.toLowerCase().includes(searchQuery.toLowerCase()));
                                const matchesRegion = selectedRegion === 'All' || p.region === selectedRegion;
                                return matchesSearch && matchesRegion;
                            }).map((p) => (
                                <tr key={p.id} className={`border-b group transition-colors ${darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-l-4 border-l-transparent group-hover:border-l-[#7ede56]`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-100'} text-gray-500`}>
                                                <Handshake className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`font-black uppercase tracking-tight text-xs ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{p.farm}</span>
                                                <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                                                    Linked: {p.investor}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${darkMode ? 'bg-white/10 text-white' : 'bg-[#7ede56]/20 text-[#002f37]'}`}>
                                                {p.agent ? p.agent.charAt(0) : 'U'}
                                            </div>
                                            <span className={`text-[11px] font-bold uppercase tracking-tight ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {p.agent || 'Unassigned'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        {getStatusBadge(p.status)}
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="w-full max-w-[140px]">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1.5">
                                                <span className="text-gray-400">Progress</span>
                                                <span className={p.status === 'Completed' ? 'text-[#7ede56]' : 'text-blue-500'}>{p.maturity}</span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${p.status === 'Escalated' ? 'bg-rose-500 animate-pulse' : (p.status === 'Completed' ? 'bg-[#7ede56]' : 'bg-blue-500')}`}
                                                    style={{ width: p.maturity }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`p-4 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {p.start}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-[#7ede56] hover:bg-[#7ede56]/10 rounded-lg"
                                                onClick={() => handlePartnershipClick(p)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Partnership Details Modal */}
            <Dialog open={isPartnershipModalOpen} onOpenChange={setIsPartnershipModalOpen}>
                <DialogContent className={`max-w-5xl w-full border-none shadow-premium rounded-[32px] overflow-hidden p-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-300 ${darkMode ? 'bg-[#002f37] text-white' : 'bg-white'}`}>
                    {selectedPartnership ? (
                        <div className="flex flex-col md:flex-row h-[85vh]">
                            {/* Sidebar / Left Panel - Core Identity */}
                            <div className={`w-full md:w-80 ${darkMode ? 'bg-black/20' : 'bg-gray-50/80'} border-r ${darkMode ? 'border-white/5' : 'border-gray-100'} p-8 flex flex-col items-center text-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-[#7ede56]/5 pointer-events-none"></div>

                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#002f37] to-[#011a1e] flex items-center justify-center mb-6 shadow-xl ring-4 ring-white/10 relative group">
                                    <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow"></div>
                                    <Handshake className="w-10 h-10 text-[#7ede56]" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#002f37] rounded-full border-2 border-[#7ede56] flex items-center justify-center text-[10px] font-black text-white">AP</div>
                                </div>

                                <DialogTitle className="text-2xl font-black uppercase tracking-tight leading-none mb-2">
                                    {selectedPartnership.farm}
                                </DialogTitle>
                                <DialogDescription className="sr-only">In-depth partnership profile for {selectedPartnership.farm}, including yield progress and stakeholder data.</DialogDescription>
                                <div className="flex items-center gap-2 mb-6">
                                    <Badge variant="outline" className={`border-dashed ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'} text-[10px] uppercase tracking-widest px-3 py-1`}>
                                        {selectedPartnership.region || 'Unknown Region'}
                                    </Badge>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white shadow-sm'} text-left`}>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Investor Identity</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">
                                                {selectedPartnership.investor.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm leading-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{selectedPartnership.investor}</p>
                                                <p className="text-[10px] text-gray-400">Strategic Capital Partner</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white shadow-sm'} text-left`}>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Status</p>
                                        <div className="flex items-center justify-between">
                                            {getStatusBadge(selectedPartnership.status)}
                                            <div className="flex items-center gap-1.5 text-[#7ede56] text-[10px] font-bold uppercase tracking-wider">
                                                <Activity className="w-3 h-3" /> Live
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto w-full pt-8">
                                    <Button className="w-full bg-[#7ede56] hover:bg-[#6bcb4b] text-[#002f37] font-black uppercase text-[10px] tracking-widest h-12 shadow-lg hover:shadow-xl transition-all">
                                        Initiate Contact
                                    </Button>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                {/* Header */}
                                <div className={`h-20 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'} px-8 flex items-center justify-between shrink-0`}>
                                    <div>
                                        <h3 className={`text-lg font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Mission Command Center</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time partnership oversight and audit logs</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className={`h-9 px-4 rounded-lg font-bold uppercase text-[9px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200'}`}>
                                            <FileText className="w-3.5 h-3.5 mr-2" /> Export PDF
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg opacity-50 hover:opacity-100" onClick={() => setIsPartnershipModalOpen(false)}>
                                            <span className="sr-only">Close</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-8">

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800/30 border-white/5' : 'bg-gray-50 border-gray-100'} relative overflow-hidden group`}>
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Investment</span>
                                            </div>
                                            <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>$125,000</p>
                                            <div className="flex items-center gap-2 mt-2 text-[#7ede56] text-[10px] font-bold">
                                                <TrendingUp className="w-3 h-3" /> +12% vs Projection
                                            </div>
                                        </div>

                                        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800/30 border-white/5' : 'bg-gray-50 border-gray-100'} relative overflow-hidden group`}>
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7ede56]/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-[#7ede56]/10 text-[#7ede56] rounded-lg">
                                                    <BarChart2 className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Yield Maturity</span>
                                            </div>
                                            <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{selectedPartnership.maturity}</p>
                                            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
                                                <div className="h-full bg-[#7ede56]" style={{ width: selectedPartnership.maturity }}></div>
                                            </div>
                                        </div>

                                        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800/30 border-white/5' : 'bg-gray-50 border-gray-100'} relative overflow-hidden group`}>
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7ede56]/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-[#7ede56]/10 text-[#7ede56] rounded-lg">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deployment Time</span>
                                            </div>
                                            <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>45 Days</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Since {selectedPartnership.start}</p>
                                        </div>
                                    </div>

                                    {/* Detailed Sections */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className={`text-sm font-black uppercase tracking-tight flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                <MapPin className="w-4 h-4 text-[#7ede56]" /> Operational Zone
                                            </h4>
                                            <div className={`h-48 rounded-2xl border ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'} relative overflow-hidden group`}>
                                                {/* Abstract Map Pattern */}
                                                <div className="absolute inset-0 opacity-30">
                                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(146, 21, 115,0.1),transparent_70%)]"></div>
                                                    <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                                                        {[...Array(36)].map((_, i) => (
                                                            <div key={i} className={`border-[0.5px] ${darkMode ? 'border-white/5' : 'border-black/5'}`}></div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Active Zone Indicator */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                    <div className="relative">
                                                        <div className="w-4 h-4 bg-[#7ede56] rounded-full animate-ping absolute inset-0 opacity-75"></div>
                                                        <div className="w-4 h-4 bg-[#7ede56] rounded-full border-2 border-white dark:border-gray-900 relative z-10 shadow-[0_0_20px_rgba(146, 21, 115,0.6)]"></div>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <div className={`p-3 rounded-xl backdrop-blur-md border ${darkMode ? 'bg-black/40 border-white/10' : 'bg-white/60 border-black/5'} flex items-center justify-between`}>
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black text-[#7ede56] uppercase tracking-widest">Live Signal</span>
                                                            <span className={`text-[10px] font-bold ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                                {selectedPartnership.region} Region, GH
                                                            </span>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg bg-[#7ede56]/20 text-[#7ede56] hover:bg-[#7ede56] hover:text-[#002f37]">
                                                            <MapPin className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="space-y-4">
                                                <h4 className={`text-sm font-black uppercase tracking-tight flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                    <Users className="w-4 h-4 text-[#7ede56]" /> Key Stakeholders
                                                </h4>
                                                <div className="space-y-3">
                                                    {/* Farm Manager (Mock) */}
                                                    <div className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'border-gray-800 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-xs">
                                                                FM
                                                            </div>
                                                            <div>
                                                                <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                                    Site Lead (Farm Manager)
                                                                </p>
                                                                <p className="text-[9px] text-gray-500">+233 24 123 4567</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-gray-400 hover:bg-[#7ede56]/20 hover:text-[#7ede56]">
                                                                <Phone className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-gray-400 hover:bg-blue-500/20 hover:text-blue-500">
                                                                <Mail className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Assigned Agent (Dynamic) */}
                                                    <div className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'border-gray-800 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#7ede56]/20 text-[#7ede56] flex items-center justify-center font-bold text-xs">
                                                                {selectedPartnership.agent ? selectedPartnership.agent.charAt(0) : 'U'}
                                                            </div>
                                                            <div>
                                                                <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                                                    {selectedPartnership.agent || 'Unassigned'}
                                                                </p>
                                                                <p className="text-[9px] text-gray-500">Field Operations Agent</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-gray-400 hover:bg-[#7ede56]/20 hover:text-[#7ede56]">
                                                                <Phone className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-gray-400 hover:bg-blue-500/20 hover:text-blue-500">
                                                                <Mail className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 flex items-center justify-center h-full">
                            <div className="animate-spin w-8 h-8 border-4 border-[#7ede56] border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-indigo-500/5 rotate-12 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 rounded-[24px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
                        <BarChart2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-indigo-900 dark:text-indigo-400`}>Strategic Capital Pulse</h3>
                        <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-indigo-700/60 dark:text-indigo-400/60 mt-2 leading-relaxed`}>
                            Alliance integrity is scoring 94% this quarter. Focus on de-risking the Northern sector to maintain investor trust protocols.
                        </p>
                    </div>
                </div>
                <Button variant="outline" className={`font-black text-[10px] px-10 tracking-widest h-12 uppercase border-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-xl relative z-10`}>
                    View Strategic Audit
                </Button>
            </div>
        </div >
    );
};

export default PartnershipsSummary;





