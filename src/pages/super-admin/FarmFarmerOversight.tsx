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
    Phone,
    Mail,
    Eye,
    Sprout,
    Download,
    ArrowUpRight,
    MapPin,
    Building2,
    Users,
    Handshake,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useDarkMode } from '@/contexts/DarkModeContext';
import CountUp from '@/components/CountUp';

const FarmFarmerOversight = () => {
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [farmers, setFarmers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const res = await api.get('/super-admin/farmers');
                if (res.data && res.data.length > 0) {
                    setFarmers(res.data);
                } else {
                    throw new Error('Empty');
                }
            } catch (err) {
                console.error('Failed to fetch farmers:', err);
                setFarmers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFarmers();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-[#7ede56]/10 text-[#7ede56] border-[#7ede56]/20';
            case 'inactive': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            case 'needs attention': return 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    const handleContact = (type: 'phone' | 'email', value: string, farmerName: string) => {
        if (type === 'phone') {
            window.location.href = `tel:${value}`;
            toast.success(`Calling ${farmerName}...`);
        } else {
            window.location.href = `mailto:${value}`;
            toast.success(`Opening email to ${farmerName}...`);
        }
    };

    const totalFarmers = farmers.length;
    const activeFarmers = farmers.filter(f => f.status.toLowerCase() === 'active').length;
    const matchedFarmers = farmers.filter(f => f.hasInvestor).length;
    const totalAcreage = farmers.reduce((sum, f) => sum + (f.acreage || 0), 0);

    const metrics = [
        { title: 'Total Farmers', value: totalFarmers, icon: Users, color: 'bg-slate-950', iconColor: 'text-[#7ede56]', description: 'Registered Farmers' },
        { title: 'Active Farmers', value: activeFarmers, icon: Activity, color: 'bg-[#002f37]', iconColor: 'text-white', description: 'Currently Farming' },
        { title: 'Matched Farmers', value: matchedFarmers, icon: Handshake, color: 'bg-[#1e1b4b]', iconColor: 'text-white', description: 'With Investors' },
        { title: 'Total Acreage', value: Math.round(totalAcreage), icon: MapIcon, suffix: ' AC', color: 'bg-[#002f37]', iconColor: 'text-white', description: 'Under Cultivation' },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#7ede56]/10 text-[#7ede56]">
                            <Users className="w-6 h-6" />
                        </div>
                        <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                            Farmer Oversight
                        </h1>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ml-11 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Comprehensive farmer registry with contact details and investor matching
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200 shadow-premium'}`}>
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-black uppercase text-[10px] tracking-widest h-11 px-8 rounded-xl shadow-premium">
                        <Download className="w-4 h-4 mr-2" /> Export Data
                    </Button>
                </div>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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
                                {loading ? '...' : <CountUp end={m.value} duration={2000} />}{m.suffix}
                            </h3>
                            <p className="text-[8px] font-bold mt-1 text-white/30 truncate uppercase tracking-tighter italic">
                                {m.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Farmers Table */}
            <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <Sprout className="w-5 h-5 text-[#7ede56]" /> Farmer Registry
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest mt-1">Complete farmer profiles with contact and investor information</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#7ede56] transition-colors" />
                            <Input
                                placeholder="Search farmer, farm, or region..."
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
                            <tr className="bg-[#002f37] text-white text-[10px] font-bold uppercase tracking-widest">
                                <th className="p-4 border-r border-[#ffffff20]">Farmer Profile</th>
                                <th className="p-4 border-r border-[#ffffff20]">Farm Details</th>
                                <th className="p-4 border-r border-[#ffffff20]">Location</th>
                                <th className="p-4 border-r border-[#ffffff20]">Contact Info</th>
                                <th className="p-4 border-r border-[#ffffff20]">Investor Match</th>
                                <th className="p-4 border-r border-[#ffffff20]">Assigned Agent</th>
                                <th className="p-4 border-r border-[#ffffff20]">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="animate-spin w-6 h-6 border-2 border-[#7ede56] border-t-transparent rounded-full"></div>
                                            <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading farmers...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : farmers.filter(f =>
                                f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                f.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                f.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                f.crop.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((farmer) => (
                                <tr key={farmer.id} className={`${darkMode ? 'hover:bg-[#7ede56]/5' : 'hover:bg-[#7ede56]/5'} transition-colors group`}>
                                    <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-[#7ede56]">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${darkMode ? 'bg-[#7ede56]/10 text-[#7ede56]' : 'bg-[#7ede56]/20 text-[#002f37]'}`}>
                                                {farmer.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-black uppercase tracking-tight text-sm ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>{farmer.name}</span>
                                                <span className="text-[10px] font-bold text-gray-400 lowercase">{farmer.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className={`text-[11px] font-black uppercase tracking-tight ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farmer.farmName}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase">Crop:</span>
                                                <Badge variant="outline" className="text-[8px] font-black px-2 py-0 h-4 border-none bg-[#7ede56]/10 text-[#7ede56]">{farmer.crop}</Badge>
                                                <span className="text-[9px] font-bold text-gray-400">â€¢ {farmer.acreage} AC</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-blue-500/60" />
                                            <Badge variant="outline" className={`font-black text-[9px] uppercase tracking-widest border-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{farmer.region}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleContact('phone', farmer.phone, farmer.name)}
                                                className="flex items-center gap-2 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <Phone className="w-3 h-3" />
                                                <span>{farmer.phone}</span>
                                            </button>
                                            <button
                                                onClick={() => handleContact('email', farmer.email, farmer.name)}
                                                className="flex items-center gap-2 text-[10px] font-bold text-[#7ede56] hover:text-[#7ede56] transition-colors"
                                            >
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate max-w-[150px]">Email</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {farmer.hasInvestor ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#7ede56]" />
                                                    <span className="text-[10px] font-black text-[#7ede56] uppercase">Matched</span>
                                                </div>
                                                <span className={`text-[10px] font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{farmer.investorName}</span>
                                                <span className="text-[9px] font-bold text-gray-400">{farmer.matchDate}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase">No Match</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-full ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                <Users className="w-3 h-3" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-black uppercase tracking-tight ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farmer.agentName || 'Unassigned'}</span>
                                                <span className="text-[8px] font-bold text-gray-400">ID: AG-{Math.floor((farmer.id * 1234) % 9000) + 1000}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusStyle(farmer.status)} border-none`}>
                                            {farmer.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-[#7ede56] hover:bg-[#7ede56]/10 rounded-lg"
                                                onClick={() => toast.info(`Viewing ${farmer.name}'s profile...`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                onClick={() => handleContact('phone', farmer.phone, farmer.name)}
                                            >
                                                <Phone className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Info Banner */}
            <div className={`p-8 rounded-[32px] border border-dashed ${darkMode ? 'bg-blue-950/20 border-blue-500/20' : 'bg-blue-50 border-blue-200'} flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group`}>
                <div className="absolute top-0 right-10 h-full w-32 bg-blue-500/5 rotate-12 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 rounded-[24px] bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-inner">
                        <Handshake className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-blue-900 dark:text-blue-400`}>Investor Matching System</h3>
                        <p className={`text-xs max-w-md font-bold uppercase tracking-wide text-blue-700/60 dark:text-blue-400/60 mt-2 leading-relaxed`}>
                            {matchedFarmers} of {totalFarmers} farmers are currently matched with investors. Contact farmers directly to facilitate new partnerships.
                        </p>
                    </div>
                </div>
                <Button className="font-black text-[10px] px-10 tracking-widest h-12 uppercase bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-xl relative z-10">
                    View Matching Analytics
                </Button>
            </div>
        </div>
    );
};

export default FarmFarmerOversight;




