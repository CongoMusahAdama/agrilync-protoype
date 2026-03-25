import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
    MapPin, Phone, MessageSquare, X,
    Sprout, Activity, ClipboardList, Image as ImageIcon,
    History, AlertTriangle, CheckCircle2, MoreHorizontal,
    Plus, Edit, Star, Camera
} from 'lucide-react';
import api from '@/utils/api';

interface ViewFarmerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
}

const ViewFarmerModal: React.FC<ViewFarmerModalProps> = ({ open, onOpenChange, farmer }) => {
    const { darkMode } = useDarkMode();
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeDetailTab, setActiveDetailTab] = useState('overview');

    const fetchFarms = useCallback(async () => {
        if (!farmer?._id) return;
        setLoading(true);
        try {
            const res = await api.get('/farms');
            const farmerFarms = res.data.filter((f: any) => f.farmer?._id === farmer._id || f.farmer === farmer._id);
            setFarms(farmerFarms);
        } catch (err) {
            console.error('Failed to fetch farms', err);
        } finally {
            setLoading(false);
        }
    }, [farmer?._id]);

    useEffect(() => {
        if (open && farmer?._id) {
            fetchFarms();
        }
    }, [open, farmer?._id, fetchFarms]);

    if (!farmer) return null;

    const farm = farms[0] || { 
        name: `${farmer.name}'s Farm`, 
        status: farmer.investmentStatus || farmer.status || 'Active', 
        health: 0, 
        size: farmer.farmSize || 'Not Recorded', 
        crop: farmer.cropsGrown || farmer.livestockType || 'Not Specified',
        lastVisit: 'Not Recorded',
        nextVisit: 'Awaiting Schedule'
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-6xl w-full h-[80vh] p-0 flex flex-col overflow-hidden border-0 ${darkMode ? 'bg-[#0b2528]' : 'bg-gray-50'}`}>
                <div className="sr-only">
                    <DialogTitle>Farm Details - {farm.name}</DialogTitle>
                </div>

                {/* Top Action Header */}
                <div className={`p-4 md:p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${darkMode ? 'bg-[#002f37] border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#065f46]/20 bg-white/10 flex items-center justify-center shrink-0">
                            {farmer.profilePicture ? (
                                <img src={farmer.profilePicture} alt={farmer.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#065f46]/10">
                                    <Sprout className="h-8 w-8 text-[#065f46]" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{farm.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                <span className="font-bold text-[#065f46] flex items-center gap-1.5 px-3 py-1 bg-[#065f46]/5 rounded-full">
                                    <Phone className="h-3.5 w-3.5" /> {farmer.name}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">{farmer.region}</span>
                                <span className="text-gray-300">•</span>
                                <Badge variant="secondary" className="text-[10px] uppercase font-black bg-[#065f46] text-white rounded-lg border-none">{farm.status}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none bg-[#065f46] text-white hover:bg-[#065f46]/90 font-bold px-6 border-none">
                            <Plus className="h-4 w-4 mr-2" /> New Visit
                        </Button>
                        <Button variant="outline" className={`flex-1 md:flex-none ${darkMode ? 'border-white/10 text-white hover:bg-white/5' : ''}`}>
                            <ImageIcon className="h-4 w-4 mr-2" /> Upload Media
                        </Button>
                        <Button variant="ghost" size="icon" className={`hidden md:flex ${darkMode ? 'text-gray-400' : ''}`}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left Panel: Health & KPIs */}
                    <div className={`w-full md:w-[300px] shrink-0 p-6 border-b md:border-b-0 md:border-r flex flex-col gap-8 overflow-y-auto ${darkMode ? 'bg-[#0b2528] border-white/5' : 'bg-white border-gray-200'}`}>
                        {/* Health Gauge */}
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Farm Health Score</h3>
                            <div className="relative h-40 w-40 flex items-center justify-center">
                                <svg className="h-full w-full -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-gray-100 dark:text-gray-800"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * (farm.health || 85)) / 100}
                                        className="text-[#065f46] transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{farm.health ?? 0}%</span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{farm.health > 80 ? 'Excellent' : farm.health > 50 ? 'Good' : 'Needs Verification'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Metrics */}
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Visit</p>
                                <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farm.lastVisit || 'Not Recorded'}</p>
                                <p className="text-[10px] text-[#065f46] font-bold mt-1">Status: {farm.status || 'Active'}</p>
                            </div>
                            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Next Scheduled</p>
                                <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farm.nextVisit || 'TBD'}</p>
                                <p className="text-[10px] text-amber-500 font-bold mt-1">Pending Field Audit</p>
                            </div>
                        </div>

                        {/* Farmer Call Card */}
                        <div className={`mt-auto p-4 rounded-xl border-2 border-dashed ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-lg border-2 border-white dark:border-white/10">
                                    {farmer.profilePicture ? (
                                        <img src={farmer.profilePicture} alt={farmer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="bg-[#065f46]/20 w-full h-full flex items-center justify-center">
                                            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black uppercase text-[#065f46] tracking-widest">Connect</p>
                                    <p className="text-sm font-bold truncate text-gray-900 dark:text-gray-100">{farmer.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 truncate tracking-tighter">{farmer.contact}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 hover:bg-[#065f46]/10 dark:hover:bg-[#065f46]/20 shrink-0">
                                    <Phone className="h-5 w-5 text-[#065f46]" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Tabs */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Tabs defaultValue="overview" className="flex-1 flex flex-col" onValueChange={setActiveDetailTab}>
                            <div className={`px-6 pt-2 border-b ${darkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-gray-200'}`}>
                                <TabsList className="bg-transparent h-12 w-full justify-start gap-8 p-0">
                                    <TabsTrigger value="overview" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#065f46] data-[state=active]:text-[#065f46] rounded-none px-0 h-12 text-sm font-bold">Overview</TabsTrigger>
                                    <TabsTrigger value="timeline" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#065f46] data-[state=active]:text-[#065f46] rounded-none px-0 h-12 text-sm font-bold">Timeline</TabsTrigger>
                                    <TabsTrigger value="visits" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#065f46] data-[state=active]:text-[#065f46] rounded-none px-0 h-12 text-sm font-bold">Visits & Reports</TabsTrigger>
                                    <TabsTrigger value="media" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#065f46] data-[state=active]:text-[#065f46] rounded-none px-0 h-12 text-sm font-bold">Media</TabsTrigger>
                                </TabsList>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-6 md:p-8">
                                    <TabsContent value="overview" className="mt-0 space-y-8">
                                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Farm Profile</h4>
                                                    <div className="grid grid-cols-2 gap-y-4">
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Size</p>
                                                            <p className="text-sm font-medium">{farm.size || farmer.farmSize || 'Not Recorded'} {farm.size && !isNaN(parseFloat(farm.size)) ? 'Hectares' : ''}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Primary Crop</p>
                                                            <p className="text-sm font-medium">{farm.crop || farmer.cropsGrown || 'Not Specified'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Experience</p>
                                                            <p className="text-sm font-medium">{farmer.yearsOfExperience || '0'} Years</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Land Status</p>
                                                            <p className="text-sm font-medium capitalize">{farmer.landOwnershipStatus || 'Not Recorded'}</p>
                                                        </div>
                                                        {(farmer.cropsGrown || farmer.livestockType) && (
                                                            <div className="col-span-2">
                                                                <p className="text-[10px] text-gray-500 uppercase font-bold">
                                                                    {farmer.farmType === 'livestock' ? 'Livestock' : 'Crops'}
                                                                </p>
                                                                <p className="text-sm font-medium">{farmer.cropsGrown || farmer.livestockType}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className={`p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2`}>
                                                    <div className="flex items-start gap-3">
                                                        <Activity className="h-5 w-5 text-[#065f46] mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-bold text-[#002f37] dark:text-gray-100 uppercase tracking-wide">Operational Integrity</p>
                                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                                Monitoring core farm logistics and soil health markers in real-time. Verify field audits twice monthly.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Bio</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                                    "{farmer.bio || `${farmer.name} is a dedicated ${farmer.farmType || 'agricultural'} operator in ${farmer.community || farmer.region}. With ${farmer.yearsOfExperience || 'several'} years of expertise ${farmer.cropsGrown ? `cultivating ${farmer.cropsGrown}` : farmer.livestockType ? `managing ${farmer.livestockType}` : 'in the field'}, they are committed to high-yield sustainable production.`}"
                                                </p>
                                                <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                    <p className="text-xs font-bold mb-2">Grower Engagement</p>
                                                    <Progress value={90} className="h-1.5" />
                                                    <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                                                        <span>Highly Responsive</span>
                                                        <span>90% Score</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </TabsContent>

                                    <TabsContent value="timeline" className="mt-0">
                                        <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
                                            <div className="relative pl-8 group">
                                                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full z-10 flex items-center justify-center border-4 ${darkMode ? 'bg-[#0b2528] border-gray-800' : 'bg-white border-gray-100'}`}>
                                                    <CheckCircle2 className="h-2.5 w-2.5 text-[#065f46]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase">{new Date(farmer.createdAt || Date.now()).toLocaleDateString()}</p>
                                                    <h5 className="font-bold text-sm mt-0.5">Farm Registration Successfully Verified</h5>
                                                    <p className="text-xs text-gray-500 mt-1">Initial boundary mapping and onboarding completed by Lync Agent.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="visits" className="mt-0 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Past Reports</h4>
                                            <Button variant="ghost" size="sm" className="text-xs text-[#065f46]">Filter by Date</Button>
                                        </div>
                                        <div className="py-20 text-center">
                                            <div className="h-16 w-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200 dark:border-white/10">
                                                <ClipboardList className="h-8 w-8 text-gray-300" />
                                            </div>
                                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No reports archived yet</p>
                                            <p className="text-[10px] text-gray-400 mt-2">Visits and diagnostic audits will appear here.</p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="media" className="mt-0">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 bg-gray-50/50 dark:bg-white/5 group hover:border-[#065f46] transition-all cursor-pointer">
                                                <Camera className="h-8 w-8 text-gray-300 group-hover:text-[#065f46] mb-2" />
                                                <p className="text-[10px] font-bold text-gray-400 group-hover:text-[#065f46] uppercase tracking-widest">Add Field Photo</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </ScrollArea>
                        </Tabs>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className={`p-4 border-t flex items-center justify-between shrink-0 ${darkMode ? 'bg-[#002f37] border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-medium">Auto-saving...</span>
                        <div className="h-1 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#065f46] w-[65%]" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs font-bold uppercase tracking-widest">Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewFarmerModal;
