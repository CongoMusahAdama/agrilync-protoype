import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    AlertTriangle,
    MessageSquare,
    Activity,
    Map as MapIcon,
    Search,
    Filter,
    MoreHorizontal,
    AlertCircle,
    ArrowRight,
    UserPlus,
    Flag,
    Eye,
    Sprout,
    Download,
    ArrowUpRight,
    MapPin,
    Zap,
    Building2,
    ShieldCheck,
    Navigation,
    Clock
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const FarmFarmerOversight = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const res = await api.get('/super-admin/farms');
                if (res.data && res.data.length > 0) {
                    setFarms(res.data);
                } else {
                    throw new Error('Empty');
                }
            } catch (err) {
                console.error('Failed to fetch farms:', err);
                setFarms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFarms();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'inactive': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            case 'needs attention': return 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    const metrics = [
        { title: 'Registered Assets', value: 1284, icon: Sprout, path: '/dashboard/super-admin/regions', color: 'bg-slate-950', iconColor: 'text-[#7ede56]', description: 'Total Live Farms' },
        { title: 'Active Yields', value: 892, icon: Activity, path: '/dashboard/super-admin/regions', color: 'bg-[#002f37]', iconColor: 'text-white', description: 'Productive Plots' },
        { title: 'Land Intensity', value: 15420, icon: MapIcon, path: '/dashboard/super-admin/regions', suffix: ' AC', color: 'bg-[#1e1b4b]', iconColor: 'text-white', description: 'Total Managed Acreage' },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Asset Oversight
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Real-time registry of farms, farmers, and yield vitality
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200 shadow-premium'}`}>
                        <Filter className="w-4 h-4 mr-2" /> Geo-Filters
                    </Button>
                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        <Download className="w-4 h-4 mr-2" /> Master Export
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
                                <CountUp end={m.value} duration={2000} />{m.suffix}
                            </h3>
                            <p className="text-[8px] font-bold mt-1 text-white/30 truncate uppercase tracking-tighter italic">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Sprout className="w-5 h-5 text-[#7ede56]" /> Global Asset Registry
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Managed farms and owner-operator status</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                            <Input
                                placeholder="Search farm, farmer, or agent..."
                                className={`pl-12 h-12 text-sm border-none shadow-inner ${darkMode ? 'bg-gray-800 focus:ring-1 ring-[#7ede56]/30' : 'bg-gray-50'}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/30 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5">Managed Asset</th>
                                <th className="px-6 py-5">Ownership Profile</th>
                                <th className="px-6 py-5">Operational Zone</th>
                                <th className="px-6 py-5">Vitality Pulse</th>
                                <th className="px-6 py-5">Authority Status</th>
                                <th className="px-6 py-5 text-right">Observation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {farms.filter(f =>
                                f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                f.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                f.agent.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((farm) => (
                                <tr key={farm.id} className={`${darkMode ? 'hover:bg-[#7ede56]/5' : 'hover:bg-[#7ede56]/5'} transition-colors group`}>
                                    <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={`font-black uppercase tracking-tight text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{farm.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Crop: <span className="text-[#7ede56]">{farm.crop}</span></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase tracking-tight ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farm.farmer}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 tracking-tighter">Verified Principal</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-[#7ede56]/60" />
                                            <Badge variant="outline" className={`font-black text-[9px] uppercase tracking-widest border-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{farm.region}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5 w-24">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                <span className="text-gray-400">Maturity</span>
                                                <span className="text-blue-500">{farm.maturity}</span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: farm.maturity }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusStyle(farm.status)} border-none`}>
                                            {farm.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#7ede56] hover:bg-[#7ede56]/10 rounded-lg">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-50 rounded-lg">
                                                <UserPlus className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                <Flag className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-amber-950/20 border-amber-500/20' : 'bg-amber-50 border-amber-200'} flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-amber-500/5 rotate-12 blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 rounded-[24px] bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-amber-900 dark:text-amber-400`}>Strategic Yield Watch</h3>
                        <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-amber-700/60 dark:text-amber-400/60 mt-2 leading-relaxed`}>
                            Automated satellite monitoring for drought and pests is active in Ashanti and Western hubs. High-risk assets are flagged for forensic audit.
                        </p>
                    </div>
                </div>
                <Button className="font-black text-[10px] px-10 tracking-widest h-12 uppercase bg-amber-600 hover:bg-amber-700 text-white shadow-lg rounded-xl relative z-10">
                    View Risk Analytics
                </Button>
            </div>
        </div>
    );
};

export default FarmFarmerOversight;
