import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { User, Sprout, MapPin, Phone, Mail, Calendar, Eye, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

interface ViewFarmerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
}

const ViewFarmerModal: React.FC<ViewFarmerModalProps> = ({ open, onOpenChange, farmer }) => {
    const { darkMode } = useDarkMode();
    const [activeTab, setActiveTab] = useState('personal');

    if (!farmer) return null;

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Verified':
                return darkMode ? 'bg-emerald-500/20 text-emerald-300 border-0' : 'bg-emerald-100 text-emerald-700';
            case 'Pending':
                return darkMode ? 'bg-yellow-500/20 text-yellow-300 border-0' : 'bg-yellow-100 text-yellow-700';
            case 'Matched':
                return darkMode ? 'bg-purple-500/20 text-purple-300 border-0' : 'bg-purple-100 text-purple-700';
            case 'In Progress':
                return darkMode ? 'bg-blue-500/20 text-blue-300 border-0' : 'bg-blue-100 text-blue-700';
            default:
                return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600';
        }
    };

    const InfoCard = ({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) => (
        <Card className={`${darkMode ? 'bg-[#124b53]/20 border-[#124b53]' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'}`}>
            <CardContent className="p-4">
                <div className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {Icon && <Icon className="w-4 h-4 text-[#7ede56]" />}
                    <span>{label}</span>
                </div>
                <p className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {value || 'Not provided'}
                </p>
            </CardContent>
        </Card>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-6xl h-[85vh] flex flex-col p-0 gap-0 ${darkMode ? 'bg-[#002f37] border-[#124b53]' : 'bg-white border-none shadow-2xl'}`}>
                <DialogHeader className={`p-6 border-b ${darkMode ? 'border-gray-800 bg-gradient-to-r from-[#002f37] to-[#0b2528]' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-white'} flex-shrink-0`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Enhanced Avatar */}
                            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg ${farmer.status === 'Verified' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                                    farmer.status === 'Pending' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                                        farmer.status === 'Matched' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                                            'bg-gradient-to-br from-blue-500 to-blue-600'
                                }`}>
                                {farmer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                {farmer.status === 'Verified' && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <DialogTitle className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {farmer.name}
                                </DialogTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <Eye className="h-4 w-4 text-[#7ede56]" />
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Farmer Profile Details
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`${getStatusBadgeColor(farmer.status)} text-sm font-medium px-4 py-2`}>
                                {farmer.status}
                            </Badge>
                            {farmer.investmentMatched && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 px-4 py-2">
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    Investment Matched
                                </Badge>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 pt-4 flex-shrink-0">
                            <TabsList className={`grid w-full grid-cols-3 h-auto p-1.5 rounded-xl ${darkMode ? 'bg-[#0b2528]' : 'bg-gray-100'}`}>
                                <TabsTrigger
                                    value="personal"
                                    className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all ${darkMode ? 'data-[state=active]:bg-[#124b53]' : 'data-[state=active]:bg-white data-[state=active]:shadow-md'}`}
                                >
                                    <User className="h-4 w-4" />
                                    <span className="font-semibold">Personal Info</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="location"
                                    className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all ${darkMode ? 'data-[state=active]:bg-[#124b53]' : 'data-[state=active]:bg-white data-[state=active]:shadow-md'}`}
                                >
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-semibold">Location</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="farm"
                                    className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all ${darkMode ? 'data-[state=active]:bg-[#124b53]' : 'data-[state=active]:bg-white data-[state=active]:shadow-md'}`}
                                >
                                    <Sprout className="h-4 w-4" />
                                    <span className="font-semibold">Farm Details</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 px-6 py-6">
                            {/* Personal Information Tab */}
                            <TabsContent value="personal" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoCard label="Full Name" value={farmer.name} icon={User} />
                                    <InfoCard label="Phone Number" value={farmer.phone} icon={Phone} />
                                    <InfoCard label="Email Address" value={farmer.email || 'Not provided'} icon={Mail} />
                                    <InfoCard label="Gender" value={farmer.gender || 'Not specified'} icon={User} />
                                    <InfoCard
                                        label="Date of Birth"
                                        value={farmer.dob ? new Date(farmer.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}
                                        icon={Calendar}
                                    />
                                    <InfoCard label="Preferred Language" value={farmer.language || 'English'} />
                                </div>

                                {/* Quick Stats */}
                                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-xl ${darkMode ? 'bg-[#0b2528] border border-[#124b53]' : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'}`}>
                                    <div className="text-center">
                                        <Sprout className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-[#7ede56]' : 'text-blue-600'}`} />
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {farmer.farmType || 'N/A'}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Farm Type</p>
                                    </div>
                                    <div className="text-center">
                                        <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-[#7ede56]' : 'text-purple-600'}`} />
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {farmer.experience || '0'} yrs
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Experience</p>
                                    </div>
                                    <div className="text-center">
                                        <MapPin className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-[#7ede56]' : 'text-green-600'}`} />
                                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {farmer.region || 'N/A'}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Region</p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Location Tab */}
                            <TabsContent value="location" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoCard label="Region" value={farmer.region} icon={MapPin} />
                                    <InfoCard label="District/Community" value={farmer.community} icon={MapPin} />
                                </div>

                                <Card className={`p-6 ${darkMode ? 'bg-[#124b53]/20 border-[#124b53]' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
                                    <div className="flex items-start gap-3">
                                        <MapPin className={`w-6 h-6 mt-1 ${darkMode ? 'text-[#7ede56]' : 'text-green-600'}`} />
                                        <div>
                                            <h4 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                Complete Address
                                            </h4>
                                            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {farmer.community}, {farmer.region}
                                            </p>
                                            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                This is the primary farm location for {farmer.name}
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Map Placeholder */}
                                <div className={`h-64 rounded-xl ${darkMode ? 'bg-[#0b2528] border border-[#124b53]' : 'bg-gray-100 border border-gray-200'} flex items-center justify-center`}>
                                    <div className="text-center">
                                        <MapPin className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Map integration coming soon
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Farm Information Tab */}
                            <TabsContent value="farm" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoCard label="Farm Type" value={farmer.farmType} icon={Sprout} />
                                    <InfoCard label="Category" value={farmer.category} />
                                    <InfoCard label="Farm Size" value={farmer.farmSize ? `${farmer.farmSize} acres` : 'Not specified'} />
                                    <InfoCard label="Experience" value={farmer.experience ? `${farmer.experience} years` : 'Not specified'} />
                                    <InfoCard label="Farming Method" value={farmer.method || 'Traditional'} />
                                    <InfoCard label="Land Ownership" value={farmer.landOwnership || 'Not specified'} />
                                    <InfoCard label="Production Stage" value={farmer.productionStage || 'Active'} />
                                    <InfoCard
                                        label="Last Visit"
                                        value={new Date(farmer.lastVisit).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        icon={Calendar}
                                    />
                                </div>

                                {/* Additional Info Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {farmer.irrigation && (
                                        <Card className={`p-4 ${darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                                    <Sprout className={`w-5 h-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                                        Irrigation Available
                                                    </p>
                                                    <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                        Farm has irrigation access
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    )}

                                    {farmer.investmentMatched && (
                                        <Card className={`p-4 ${darkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                                    <Sparkles className={`w-5 h-5 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                                        Investment Matched
                                                    </p>
                                                    <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                                        Connected with an investor
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewFarmerModal;
