import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
    MapPin, Phone, Mail,
    Star, MessageSquare, X,
    ShieldAlert, Share2, MoreHorizontal
} from 'lucide-react';
import api from '@/utils/api';

interface ViewFarmerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
}

const ViewFarmerModal: React.FC<ViewFarmerModalProps> = ({ open, onOpenChange, farmer }) => {
    const { darkMode } = useDarkMode();

    if (!farmer) return null;
    const [farms, setFarms] = useState<any[]>([]);
    const [, setLoading] = useState(false);

    // Mock Rating (To be replaced with real data)
    const rating = farmer?.rating || 4.2;

    useEffect(() => {
        if (open && farmer?._id) {
            fetchFarms();
        }
    }, [open, farmer?._id]);

    const fetchFarms = async () => {
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
    };

    if (!farmer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-6xl h-[85vh] p-0 flex overflow-hidden border-0 ${darkMode ? 'bg-[#1e293b]' : 'bg-gray-50'}`}>

                {/* Left Sidebar - Profile & Skills */}
                <div className={`w-[320px] shrink-0 border-r p-8 flex flex-col overflow-y-auto ${darkMode ? 'bg-[#0f172a] border-gray-800' : 'bg-white border-gray-200'}`}>

                    {/* Profile Image */}
                    <div className="mb-8">
                        <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-lg mb-6 bg-gray-100 dark:bg-gray-800 relative group">
                            {farmer.profilePicture ? (
                                <img src={farmer.profilePicture} alt={farmer.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-300 dark:text-gray-600">
                                    {farmer.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                <Badge className="bg-white/20 text-white backdrop-blur-md border-0 hover:bg-white/30">Change Photo</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Farming Summary (Replacing "Work") */}
                    <div className="mb-8">
                        <h3 className={`text-xs section-title uppercase tracking-widest mb-4 pb-2 border-b ${darkMode ? 'text-gray-400 border-gray-800' : 'text-gray-400 border-gray-100'}`}>
                            Farm Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <p className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farmer.farmType} Farm</p>
                                    <Badge variant="secondary" className="text-[10px] h-5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">Primary</Badge>
                                </div>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {farmer.community}, {farmer.region}
                                </p>
                            </div>

                            {farms.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{farms[0].crop} Production</p>
                                        <Badge variant="secondary" className="text-[10px] h-5 bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">Current</Badge>
                                    </div>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {farms[0].size || 'N/A'} Acres • {farms[0].currentStage}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats / Skills */}
                    <div>
                        <h3 className={`text-xs section-title uppercase tracking-widest mb-4 pb-2 border-b ${darkMode ? 'text-gray-400 border-gray-800' : 'text-gray-400 border-gray-100'}`}>
                            Key Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Experience</span>
                                <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{farmer.experience || 1} Years</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Active Projects</span>
                                <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{farms.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Credit Score</span>
                                <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>{farmer.investmentReadinessScore || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
                            <h4 className={`text-xs section-title uppercase tracking-widest mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Products</h4>
                            <div className="flex flex-wrap gap-2">
                                {farms.map(f => f.crop).filter((v, i, a) => a.indexOf(v) === i).map(crop => (
                                    <span key={crop} className={`text-xs px-2 py-1 rounded-md ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        {crop}
                                    </span>
                                ))}
                                <span className={`text-xs px-2 py-1 rounded-md ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                    {farmer.livestockType || 'Livestock'}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0f172a]">

                    {/* Header Section */}
                    <div className={`p-8 pb-0 ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className={`dashboard-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>{farmer.name}</h1>
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-400">{farmer.region}, GH</span>
                                </div>
                                <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                    {farmer.category || 'Commercial Farmer'}
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Rating</span>
                                        <div className="flex items-center gap-1">
                                            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rating.toFixed(1)}</span>
                                            <div className="flex text-amber-400">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <Button variant="outline" size="icon" className="rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 dark:border-gray-700 dark:text-gray-400">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 dark:border-gray-700 dark:text-gray-400">
                                    <ShieldAlert className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center gap-3 mb-8">
                            <Button className="rounded-full px-6 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                                <MessageSquare className="w-4 h-4 mr-2" /> Send Message
                            </Button>
                            <Button variant="secondary" className="rounded-full px-6 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20">
                                <Phone className="w-4 h-4 mr-2" /> Contacts
                            </Button>
                            <Button variant="ghost" className="rounded-full text-gray-500 dark:text-gray-400 dark:hover:text-gray-200">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Visual Tabs (Header only) */}
                        <div className="w-full border-b border-gray-200 dark:border-gray-800 mb-0">
                            <div className="flex gap-8">
                                <div className={`pb-3 text-sm font-medium border-b-2 border-emerald-500 text-gray-900 dark:text-white`}>
                                    About
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <ScrollArea className="h-[calc(85vh-300px)] w-full">
                            <div className="p-8 pt-6">
                                <div className="space-y-10 max-w-4xl">

                                    {/* Contact Information Group */}
                                    <section>
                                        <h4 className={`text-xs section-title uppercase tracking-widest mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Contact Information</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</label>
                                                <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{farmer.contact}</p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</label>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farmer.community}, {farmer.district}, {farmer.region}</p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E-mail</label>
                                                <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{farmer.email || '—'}</p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Digital ID</label>
                                                <p className={`text-sm id-code ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{farmer._id.substring(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />

                                    {/* Basic Information Group */}
                                    <section>
                                        <h4 className={`text-xs section-title uppercase tracking-widest mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Basic Information</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                            <div className="col-span-2">
                                                <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bio</label>
                                                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {farmer.bio || `${farmer.name} is a dedicated commercial farmer focused on ${(farmer.farmType || 'sustainable').toLowerCase()} production. With ${farmer.experience || 1} years of experience in the field, they have demonstrated consistent growth and adoption of modern agricultural practices.`}
                                                </p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Birthday</label>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farmer.dob ? new Date(farmer.dob).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gender</label>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farmer.gender || '—'}</p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Language</label>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{farmer.language || 'English'}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default ViewFarmerModal;
