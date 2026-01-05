import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Map as MapIcon,
    Users,
    Globe,
    TrendingUp,
    ArrowUpRight,
    Search,
    Filter,
    ShieldCheck,
    Briefcase,
    Sprout,
    MapPin
} from 'lucide-react';
import api from '@/utils/api';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const RegionalPerformance = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [regions, setRegions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/super-admin/regions');
                if (res.data && res.data.length > 0) {
                    setRegions(res.data);
                    const totals = res.data.reduce((acc: any, curr: any) => ({
                        agents: acc.agents + curr.agentCount,
                        farmers: acc.farmers + curr.farmersCount,
                        farms: acc.farms + curr.farmsCount,
                    }), { agents: 0, farmers: 0, farms: 0 });
                    setStats(totals);
                } else {
                    throw new Error('Empty');
                }
            } catch (err) {
                // Rich Mock data for all 8 regions
                const mockRegions = [
                    { _id: 'Ahafo', agentCount: 8, farmersCount: 210, farmsCount: 245, productivity: 'Medium' },
                    { _id: 'Ashanti', agentCount: 24, farmersCount: 850, farmsCount: 920, productivity: 'High' },
                    { _id: 'Bono', agentCount: 16, farmersCount: 510, farmsCount: 540, productivity: 'Medium' },
                    { _id: 'Bono East', agentCount: 12, farmersCount: 380, farmsCount: 410, productivity: 'High' },
                    { _id: 'Central', agentCount: 12, farmersCount: 290, farmsCount: 310, productivity: 'High' },
                    { _id: 'Eastern', agentCount: 18, farmersCount: 550, farmsCount: 610, productivity: 'High' },
                    { _id: 'Greater Accra', agentCount: 18, farmersCount: 620, farmsCount: 580, productivity: 'High' },
                    { _id: 'Northern', agentCount: 32, farmersCount: 920, farmsCount: 1150, productivity: 'Low' },
                    { _id: 'North East', agentCount: 10, farmersCount: 310, farmsCount: 340, productivity: 'Medium' },
                    { _id: 'Oti', agentCount: 9, farmersCount: 240, farmsCount: 275, productivity: 'Medium' },
                    { _id: 'Savannah', agentCount: 7, farmersCount: 180, farmsCount: 210, productivity: 'Low' },
                    { _id: 'Upper East', agentCount: 14, farmersCount: 420, farmsCount: 460, productivity: 'Medium' },
                    { _id: 'Upper West', agentCount: 13, farmersCount: 390, farmsCount: 430, productivity: 'Medium' },
                    { _id: 'Volta', agentCount: 14, farmersCount: 340, farmsCount: 380, productivity: 'Medium' },
                    { _id: 'Western', agentCount: 20, farmersCount: 480, farmsCount: 512, productivity: 'High' },
                    { _id: 'Western North', agentCount: 9, farmersCount: 260, farmsCount: 295, productivity: 'Medium' },
                ];
                setRegions(mockRegions);
                const totals = mockRegions.reduce((acc: any, curr: any) => ({
                    agents: acc.agents + curr.agentCount,
                    farmers: acc.farmers + curr.farmersCount,
                    farms: acc.farms + curr.farmsCount,
                }), { agents: 0, farmers: 0, farms: 0 });
                setStats(totals);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getProductivityBadge = (level: string = 'high') => {
        switch (level.toLowerCase()) {
            case 'high': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">OPTIMAL</Badge>;
            case 'medium': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">STEADY</Badge>;
            case 'low': return <Badge className="bg-amber-100 text-amber-700 border-amber-200 animate-pulse">UNDERPERFORMING</Badge>;
            default: return <Badge variant="secondary">{level}</Badge>;
        }
    };

    const metrics = [
        { title: 'Total Regions', value: regions.length, icon: Globe, path: '/dashboard/super-admin/regions', color: 'bg-[#002f37]', iconColor: 'text-[#7ede56]', description: 'Operational Nodes' },
        { title: 'Operations Leaders', value: stats?.agents || 0, icon: ShieldCheck, path: '/dashboard/super-admin/agents', color: 'bg-[#065f46]', iconColor: 'text-white', description: 'Agent Management' },
        { title: 'Extension Personnel', value: stats?.farmers || 0, icon: Users, path: '/dashboard/super-admin/farmers', color: 'bg-[#1e1b4b]', iconColor: 'text-white', description: 'Field Network' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>Regional Performance</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Operational intensity across geographical nodes</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search region..." className={`pl-10 h-10 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white shadow-premium border-gray-100'}`} />
                    </div>
                    <Button variant="outline" className="font-black uppercase text-[10px] tracking-widest h-11 px-6 border-gray-100 dark:border-gray-800 shadow-premium">
                        <MapIcon className="w-4 h-4 mr-2" /> GIS Overlay
                    </Button>
                </div>
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {metrics.map((m, idx) => (
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
                            </h3>
                            <p className="text-[8px] md:text-[9px] font-bold mt-1 md:mt-2 line-clamp-1 uppercase tracking-tighter text-white/60">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regions.map((region, index) => (
                    <Card key={index} className={`border-none shadow-premium group overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-[#7ede56]/10 text-[#7ede56]">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <CardTitle className={`text-xl font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                                            {region._id}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Active Operational Zone</CardDescription>
                                </div>
                                {getProductivityBadge(region.productivity)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center border border-transparent hover:border-[#7ede56]/20 transition-colors">
                                    <Briefcase className="w-5 h-5 text-blue-500 mb-2" />
                                    <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{region.agentCount}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Agents</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center border border-transparent hover:border-[#7ede56]/20 transition-colors">
                                    <Users className="w-5 h-5 text-emerald-500 mb-2" />
                                    <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{region.farmersCount}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Farmers</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center border border-transparent hover:border-[#7ede56]/20 transition-colors">
                                    <Sprout className="w-5 h-5 text-amber-500 mb-2" />
                                    <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{region.farmsCount}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Farms</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest underline decoration-[#7ede56]/30 decoration-2 underline-offset-4">Yield Potential</span>
                                    <div className="flex items-center gap-1 text-[#7ede56] font-black text-xs">
                                        <TrendingUp className="w-3.5 h-3.5" /> +12% VS Q3
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RegionalPerformance;
