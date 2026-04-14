import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    Users, TrendingUp, AlertTriangle, Briefcase, ChevronDown, LayoutGrid, LayoutList,
    Download, TrendingDown, MapPin, Activity, Sprout, Coins, X, CheckCircle2, Navigation
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

// Mock Data
const SUMMARY_STATS = [
    { label: 'Total Farmers', value: '4,500', trend: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Capital Deployed', value: 'GH₵ 2.4M', trend: '+5%', icon: Coins, color: 'text-amber-500' },
    { label: 'Avg On-Track Rate', value: '84%', trend: '+2%', icon: Activity, color: 'text-[#7ede56]' },
    { label: 'Active Agents', value: '120', trend: 'Steady', icon: Briefcase, color: 'text-purple-500' }
];

const REGIONS_MOCK = [
    {
        id: '1', name: 'Ashanti', onTrackRate: 92, farmersOnboarded: 1250, target: 1500,
        capitalDeployed: 850000, agents: 45, atRiskFarms: 0, seasonTrend: 'up', lastUpdated: '2 hrs ago',
        farmers: [{ name: 'Kofi Asare', status: 'On Track' }, { name: 'Adwoa Mensah', status: 'On Track' }],
        agentsList: [{ name: 'Sarkodie', lastSync: '10 mins ago', kpi: '98%' }, { name: 'Ekow', lastSync: '1 hour ago', kpi: '92%' }],
        fundedFarms: { onTrack: 120, atRisk: 0, offTrack: 0 },
        capitalFlow: { disbursed: 850000, pending: 150000, settled: 400000 }
    },
    {
        id: '2', name: 'Western', onTrackRate: 88, farmersOnboarded: 950, target: 1000,
        capitalDeployed: 620000, agents: 28, atRiskFarms: 2, seasonTrend: 'up', lastUpdated: '5 hrs ago',
        farmers: [{ name: 'Kwesi Appiah', status: 'At Risk' }, { name: 'Ama Osei', status: 'On Track' }],
        agentsList: [{ name: 'Janet', lastSync: '30 mins ago', kpi: '95%' }, { name: 'Francis', lastSync: '2 days ago', kpi: '60%' }],
        fundedFarms: { onTrack: 85, atRisk: 2, offTrack: 0 },
        capitalFlow: { disbursed: 620000, pending: 80000, settled: 300000 }
    },
    {
        id: '3', name: 'Volta', onTrackRate: 55, farmersOnboarded: 600, target: 1200,
        capitalDeployed: 250000, agents: 18, atRiskFarms: 15, seasonTrend: 'down', lastUpdated: '1 day ago',
        farmers: [{ name: 'Efo Kodjo', status: 'Off Track' }, { name: 'Abla', status: 'At Risk' }],
        agentsList: [{ name: 'Godwin', lastSync: '5 hours ago', kpi: '70%' }],
        fundedFarms: { onTrack: 40, atRisk: 10, offTrack: 5 },
        capitalFlow: { disbursed: 250000, pending: 300000, settled: 50000 }
    },
    {
        id: '4', name: 'Northern', onTrackRate: 75, farmersOnboarded: 2100, target: 2500,
        capitalDeployed: 1100000, agents: 85, atRiskFarms: 5, seasonTrend: 'up', lastUpdated: '10 mins ago',
        farmers: [{ name: 'Iddrisu', status: 'On Track' }],
        agentsList: [{ name: 'Musah', lastSync: 'Just now', kpi: '88%' }],
        fundedFarms: { onTrack: 200, atRisk: 5, offTrack: 1 },
        capitalFlow: { disbursed: 1100000, pending: 200000, settled: 800000 }
    },
    {
        id: '5', name: 'Bono', onTrackRate: 40, farmersOnboarded: 300, target: 800,
        capitalDeployed: 0, agents: 12, atRiskFarms: 20, seasonTrend: 'down', lastUpdated: '2 days ago',
        farmers: [{ name: 'Agya Koo', status: 'Off Track' }],
        agentsList: [{ name: 'Kwame', lastSync: '3 days ago', kpi: '45%' }],
        fundedFarms: { onTrack: 10, atRisk: 15, offTrack: 5 },
        capitalFlow: { disbursed: 0, pending: 500000, settled: 0 }
    }
];

const ALERTS_MOCK = [
    { region: 'Northern Region', text: '3 agents inactive for over 48 hours', severity: 'amber', action: '/dashboard/super-admin/agents' },
    { region: 'Volta Region', text: '2 farms Off Track for 7+ days', severity: 'red', action: '/dashboard/super-admin/oversight' },
    { region: 'Bono Region', text: 'Capital deployment 0% this active season', severity: 'red', action: '/dashboard/super-admin/capital' }
];

export default function RegionalPerformance() {
    const { darkMode } = useDarkMode();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterTab, setFilterTab] = useState<'all' | 'on-track' | 'at-risk' | 'underperforming'>('all');
    const [season, setSeason] = useState('Current Season');
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

    const getStatusInfo = (rate: number, atRiskCount: number) => {
        if (rate >= 80 && atRiskCount === 0) return { color: 'bg-[#7ede56]', text: 'text-[#002f37]', borderColor: 'border-l-4 border-l-[#7ede56]', label: 'On Track' };
        if (rate < 60 || atRiskCount > 10) return { color: 'bg-red-500', text: 'text-white', borderColor: 'border-l-4 border-l-red-500', label: 'Underperforming' };
        return { color: 'bg-amber-500', text: 'text-[#002f37]', borderColor: 'border-l-4 border-l-amber-500', label: 'At Risk' };
    };

    const filteredRegions = REGIONS_MOCK.filter(r => {
        if (filterTab === 'all') return true;
        const status = getStatusInfo(r.onTrackRate, r.atRiskFarms).label;
        if (filterTab === 'on-track' && status === 'On Track') return true;
        if (filterTab === 'at-risk' && status === 'At Risk') return true;
        if (filterTab === 'underperforming' && status === 'Underperforming') return true;
        return false;
    });

    const chartData = [...REGIONS_MOCK].sort((a, b) => b.onTrackRate - a.onTrackRate).map(r => ({
        name: r.name,
        rate: r.onTrackRate,
        fill: r.onTrackRate >= 80 ? '#7ede56' : r.onTrackRate >= 60 ? '#f59e0b' : '#ef4444'
    }));

    const selectedRegion = REGIONS_MOCK.find(r => r.id === selectedRegionId);

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Top Summary Health Bar */}
            <Card className={`border-none ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-[#002f37]'} shadow-premium overflow-hidden relative rounded-2xl`}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7ede56]/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                <CardContent className="p-0">
                    <div className={`grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x ${darkMode ? 'divide-white/5' : 'divide-white/10'}`}>
                        {SUMMARY_STATS.map((stat, idx) => (
                            <div key={idx} className={`p-6 flex flex-col justify-center relative group/item transition-colors ${darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-white/5'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-1.5 rounded-lg bg-white/5`}>
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>{stat.label}</span>
                                </div>
                                <div className="flex items-baseline justify-between mt-1">
                                    <span className="text-2xl font-black text-white tracking-tighter tabular-nums">{stat.value}</span>
                                    <div className={`flex items-center gap-1 ${stat.trend.includes('-') ? 'text-rose-500' : (stat.trend === 'Steady' ? 'text-blue-400' : 'text-[#7ede56]')}`}>
                                        {stat.trend.includes('-') ? <TrendingDown className="w-3 h-3" /> : (stat.trend === 'Steady' ? <Activity className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />)}
                                        <span className="text-[9px] font-black uppercase tracking-wider">{stat.trend}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Controls Row */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="overflow-x-auto pb-2 w-full lg:w-auto hide-scrollbar">
                    <Tabs value={filterTab} onValueChange={(val: any) => setFilterTab(val)} className="w-full">
                        <TabsList className="bg-gray-100 dark:bg-black/20 p-1 rounded-2xl h-12">
                            <TabsTrigger value="all" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-6 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-sm transition-all">All Regions</TabsTrigger>
                            <TabsTrigger value="on-track" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-6 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-sm transition-all text-[#7ede56] data-[state=active]:text-[#7ede56]">On Track</TabsTrigger>
                            <TabsTrigger value="at-risk" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-6 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-sm transition-all text-amber-500 data-[state=active]:text-amber-500">At Risk</TabsTrigger>
                            <TabsTrigger value="underperforming" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-6 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-sm transition-all text-red-500 data-[state=active]:text-red-500">Underperforming</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                    <div className="relative">
                        <select 
                            className={`appearance-none h-12 pl-4 pr-10 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer border-none shadow-sm ${darkMode ? 'bg-gray-900 border border-gray-800 text-white' : 'bg-white border border-gray-100 text-[#002f37]'}`}
                            value={season}
                            onChange={(e) => setSeason(e.target.value)}
                        >
                            <option value="Current Season">Current Season</option>
                            <option value="Last Season">Last Season</option>
                            <option value="All Time">All Time</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                    
                    <div className={`p-1 rounded-2xl flex gap-1 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100'}`}>
                        <Button variant="ghost" size="sm" onClick={() => setViewMode('grid')} className={`h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-400'}`}>
                            <LayoutGrid className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setViewMode('list')} className={`h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-400'}`}>
                            <LayoutList className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Deep Dive Section (Expandable) */}
            {selectedRegionId && selectedRegion && (
                <Card className={`border-none shadow-2xl animate-in slide-in-from-top-4 duration-500 overflow-hidden ring-2 ring-[#7ede56] ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <div className="bg-[#002f37] p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-[#7ede56]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedRegion.name} REGION</h3>
                                <p className="text-[10px] font-bold text-[#7ede56] uppercase tracking-widest">Regional Detail Deep Dive</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 p-0" onClick={() => setSelectedRegionId(null)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Active Field Agents</h4>
                                {selectedRegion.agentsList.map((ag, i) => (
                                    <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                                        <div>
                                            <p className="text-xs font-black uppercase">{ag.name}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">Sync: {ag.lastSync}</p>
                                        </div>
                                        <Badge variant="outline" className="text-[9px] font-black">{ag.kpi} KPI</Badge>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Funded Farms Matrix</h4>
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#7ede56]"></div>On Track</span><span className="font-black text-sm">{selectedRegion.fundedFarms.onTrack}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>At Risk</span><span className="font-black text-sm">{selectedRegion.fundedFarms.atRisk}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div>Off Track</span><span className="font-black text-sm">{selectedRegion.fundedFarms.offTrack}</span></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Capital Deployment Flow</h4>
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase">Disbursed</span><span className="font-black text-sm text-[#7ede56]">GH₵ {(selectedRegion.capitalFlow.disbursed / 1000).toFixed(0)}k</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase">Pending</span><span className="font-black text-sm text-amber-500">GH₵ {(selectedRegion.capitalFlow.pending / 1000).toFixed(0)}k</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase">Settled</span><span className="font-black text-sm text-blue-500">GH₵ {(selectedRegion.capitalFlow.settled / 1000).toFixed(0)}k</span></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Recent Farmer Updates</h4>
                                {selectedRegion.farmers.slice(0, 3).map((f, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <p className="text-xs font-black uppercase">{f.name}</p>
                                        <Badge className={`text-[8px] font-black uppercase ${f.status === 'On Track' ? 'bg-[#7ede56]/20 text-[#7ede56]' : f.status === 'At Risk' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'} border-none`}>{f.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                             <Button onClick={() => setSelectedRegionId(null)} className="h-10 px-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-[#002f37] hover:bg-[#7ede56] font-black uppercase text-[10px] tracking-widest transition-colors">Close Deep Dive</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Region View Mode: Grid or List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRegions.map(region => {
                        const status = getStatusInfo(region.onTrackRate, region.atRiskFarms);
                        const progressPercent = Math.min((region.farmersOnboarded / region.target) * 100, 100);
                        return (
                            <Card key={region.id} className={`border-none shadow-premium ${status.borderColor} overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}>
                                <CardHeader className="p-5 pb-4 border-b border-black/5 dark:border-white/5 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${status.color} shadow-sm animate-pulse`}></div>
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight">{region.name}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 flex-1 flex flex-col gap-6">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Farmers Onboarded</span>
                                            <span className="text-xs font-black">{region.farmersOnboarded} <span className="text-[9px] text-gray-400">/ {region.target}</span></span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-[#7ede56]/30 transition-colors">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Coins className="w-3.5 h-3.5 text-amber-500 opacity-60" />
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Capital (GH₵)</p>
                                            </div>
                                            <p className="text-sm font-black tracking-tight">{(region.capitalDeployed / 1000).toFixed(0)}k</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-[#7ede56]/30 transition-colors">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Activity className="w-3.5 h-3.5 text-[#7ede56] opacity-60" />
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">On-Track</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-black tracking-tight">{region.onTrackRate}%</p>
                                                {region.seasonTrend === 'up' ? <TrendingUp className="w-3 h-3 text-[#7ede56]" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-blue-400" /> {region.agents} Active Agents</span>
                                            {region.atRiskFarms > 0 ? (
                                                <span className="text-[9px] font-black text-amber-500 uppercase flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> {region.atRiskFarms} At-Risk Farms</span>
                                            ) : (
                                                <span className="text-[9px] font-black text-[#7ede56] uppercase flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> 0 At-Risk Farms</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="p-4 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
                                    <Button 
                                        variant="outline" 
                                        className="w-full font-black text-[10px] uppercase tracking-widest h-10 rounded-xl"
                                        onClick={() => {
                                            setSelectedRegionId(region.id);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#002f37] text-white text-[9px] font-black uppercase tracking-widest">
                                    <th className="p-5">Region</th>
                                    <th className="p-5">Onboarding (vs Target)</th>
                                    <th className="p-5">Capital Deployed</th>
                                    <th className="p-5">On-Track Rate</th>
                                    <th className="p-5">Ops Status</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                                {filteredRegions.map(region => (
                                    <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${getStatusInfo(region.onTrackRate, region.atRiskFarms).color}`}></div>
                                                <span className="font-black uppercase">{region.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold">{region.farmersOnboarded}</span>
                                                    <span className="text-[10px] text-gray-400">/ {region.target}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((region.farmersOnboarded / region.target) * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-black text-amber-500">
                                            GH₵ {(region.capitalDeployed / 1000).toFixed(0)}k
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 font-black">
                                                {region.onTrackRate}%
                                                {region.seasonTrend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-[#7ede56]" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-bold text-gray-500 uppercase">{region.agents} Agents</span>
                                                {region.atRiskFarms > 0 ? (
                                                    <span className="text-[9px] font-black text-amber-500 uppercase">{region.atRiskFarms} At Risk</span>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right space-x-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10" onClick={() => { setSelectedRegionId(region.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                                <Navigation className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Bottom Two-Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* Regional Comparison Chart */}
                <Card className={`border-none shadow-premium ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" /> Regional Comparison Matrix
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">On-Track Rate Comparison</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: darkMode ? '#9ca3af' : '#4b5563' }} width={80} />
                                <Tooltip cursor={{ fill: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', background: darkMode ? '#111827' : '#fff', color: darkMode ? '#fff' : '#000' }} />
                                <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={24}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Regional Alerts */}
                <Card className={`border-none shadow-premium overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                    <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" /> Executive Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {ALERTS_MOCK.map((alert, idx) => (
                                <div key={idx} className="p-5 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <div className={`mt-0.5 p-2 rounded-xl ${alert.severity === 'red' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h4 className="text-sm font-black uppercase leading-tight">{alert.region}</h4>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">{alert.text}</p>
                                        <button className={`text-[9px] font-black uppercase tracking-widest ${alert.severity === 'red' ? 'text-red-500' : 'text-amber-500'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:underline`}>
                                            Take Action <ChevronUp className="w-3 h-3 rotate-90" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
