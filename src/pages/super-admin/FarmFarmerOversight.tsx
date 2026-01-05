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
    ArrowUpRight
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
                // Rich Mock fallback
                setFarms([
                    { id: 'F-1029', name: 'Emerald Valley Rice', farmer: 'Kofi Annan', region: 'Ashanti', agent: 'Agent Osei', status: 'Active', compliance: 'High', crop: 'Rice', maturity: '85%' },
                    { id: 'F-1052', name: 'Golden Cocoa Estate', farmer: 'Ama Serwaa', region: 'Western', agent: 'Agent Mensah', status: 'Inactive', compliance: 'Low', crop: 'Cocoa', maturity: '20%' },
                    { id: 'F-1094', name: 'Northern Plains Maize', farmer: 'Ibrahim Musah', region: 'Northern', agent: 'Agent Yakubu', status: 'Needs Attention', compliance: 'Medium', crop: 'Maize', maturity: '45%' },
                    { id: 'F-1121', name: 'Volta Green Farms', farmer: 'Efua Dzifa', region: 'Volta', agent: 'Agent Gbeho', status: 'Active', compliance: 'High', crop: 'Vegetables', maturity: '90%' },
                    { id: 'F-1155', name: 'Bono Ginger Hub', farmer: 'Kwame Boateng', region: 'Bono', agent: 'Agent Appiah', status: 'Active', compliance: 'High', crop: 'Ginger', maturity: '60%' },
                    { id: 'F-1189', name: 'Greater Accra Hydro', farmer: 'Sarah Mensah', region: 'Greater Accra', agent: 'Agent Tetteh', status: 'Needs Attention', compliance: 'Low', crop: 'Tomato', maturity: '15%' },
                    { id: 'F-1202', name: 'Central Pineapple Hub', farmer: 'John Owusu', region: 'Central', agent: 'Agent Baah', status: 'Active', compliance: 'Medium', crop: 'Pineapple', maturity: '75%' },
                    { id: 'F-1345', name: 'Eastern Plateau Coffee', farmer: 'Mary Addo', region: 'Eastern', agent: 'Agent Dankwa', status: 'Active', compliance: 'High', crop: 'Coffee', maturity: '40%' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchFarms();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'needs attention': return 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Farm & Farmer Oversight</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Platform-wide registry of agricultural assets</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 font-black uppercase text-[10px] tracking-widest px-6 h-11 shadow-sm border-gray-100 dark:border-gray-800 rounded-xl">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Button size="sm" className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4a] gap-2 font-black uppercase text-[10px] tracking-widest px-6 h-11 shadow-premium rounded-xl">
                        <Download className="w-4 h-4" /> Master Export
                    </Button>
                </div>
            </div>

            {/* Metric Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { title: 'Total Farms', value: 1284, icon: Sprout, path: '/dashboard/super-admin/regions', suffix: '', color: 'bg-[#002f37]', iconColor: 'text-[#7ede56]', description: 'Registered Assets' },
                    { title: 'Active Cultivation', value: 892, icon: Activity, path: '/dashboard/super-admin/regions', suffix: '', color: 'bg-[#065f46]', iconColor: 'text-white', description: 'Productive Plots' },
                    { title: 'Total Acreage', value: 15420, icon: MapIcon, path: '/dashboard/super-admin/regions', suffix: ' AC', color: 'bg-[#1e1b4b]', iconColor: 'text-white', description: 'Land Utilization' },
                    { title: 'High Risk Entities', value: 14, icon: AlertTriangle, path: '/dashboard/super-admin/escalations', suffix: '', color: 'bg-[#9f1239]', iconColor: 'text-white', description: 'Needs Attention' },
                ].map((m, idx) => (
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
                                <CountUp end={m.value} duration={1500} />
                                {m.suffix && <span className="text-[10px] opacity-60 ml-1">{m.suffix}</span>}
                            </h3>
                            <p className="text-[8px] md:text-[9px] font-bold mt-1 md:mt-2 line-clamp-1 uppercase tracking-tighter text-white/60">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by Farm, Farmer, or Agent..."
                            className={`pl-12 h-12 text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100 shadow-inner'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'} text-[10px] font-black uppercase tracking-widest`}>
                                <th className="px-6 py-5 underline decoration-gray-200 underline-offset-8">Farm Structure</th>
                                <th className="px-6 py-5">Ownership</th>
                                <th className="px-6 py-5">Operational Zone</th>
                                <th className="px-6 py-5">Field Authority</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Surveillance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {farms.filter(f =>
                                f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                f.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                f.agent.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((farm) => (
                                <tr key={farm.id} className={`${darkMode ? 'hover:bg-[#002f37]/30' : 'hover:bg-emerald-50/20'} transition-colors group`}>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={`font-black uppercase tracking-tight text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{farm.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Crop: {farm.crop}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase tracking-tight ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farm.farmer}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Verified Principal</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest px-2 py-0.5 border-gray-200 dark:border-gray-800 text-gray-500">{farm.region} Region</Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className={`text-[11px] font-black uppercase tracking-tight ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{farm.agent}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusStyle(farm.status)} border-none shadow-sm`}>
                                            {farm.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Reassign Agent">
                                                <UserPlus className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20" title="Flag for Audit">
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
        </div>
    );
};

export default FarmFarmerOversight;
