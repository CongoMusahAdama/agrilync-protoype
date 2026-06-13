import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
    MapPin, Phone, Plus, Edit, Camera, Video, IdCard, Map,
    Activity, ClipboardList, CheckCircle2,
} from 'lucide-react';
import api from '@/utils/api';
import FarmerIdCardModal from '@/components/agent/FarmerIdCardModal';
import { getGrowerDisplayId } from '@/utils/growerId';

interface ViewFarmerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
    onNewVisit?: (farmer: any) => void;
    onUploadMedia?: (farmer: any) => void;
    onAddField?: (farmer: any) => void;
}

const tabTriggerClass =
    'shrink-0 bg-transparent border-b-2 border-transparent data-[state=active]:border-[#065f46] data-[state=active]:text-[#065f46] rounded-none px-3 md:px-0 h-11 md:h-12 text-[10px] md:text-sm font-bold uppercase tracking-widest';

function DetailRow({
    label,
    value,
    darkMode,
    className = '',
}: {
    label: string;
    value?: React.ReactNode;
    darkMode: boolean;
    className?: string;
}) {
    return (
        <div
            className={`p-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} ${className}`}
        >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-semibold break-words ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {value ?? '—'}
            </p>
        </div>
    );
}

const ViewFarmerModal: React.FC<ViewFarmerModalProps> = ({
    open,
    onOpenChange,
    farmer,
    onNewVisit,
    onUploadMedia,
    onAddField,
}) => {
    const { darkMode } = useDarkMode();
    const [farms, setFarms] = useState<any[]>([]);
    const [media, setMedia] = useState<any[]>([]);
    const [activeDetailTab, setActiveDetailTab] = useState('summary');
    const [idCardOpen, setIdCardOpen] = useState(false);

    const isActiveGrower =
        farmer?.status === 'active' || String(farmer?.status || '').toLowerCase() === 'active';

    const fetchFarms = useCallback(async () => {
        if (!farmer?._id) return;
        try {
            const res = await api.get('/farms');
            const farmerFarms = res.data.filter(
                (f: any) => f.farmer?._id === farmer._id || f.farmer === farmer._id
            );
            setFarms(farmerFarms);
        } catch (err) {
            console.error('Failed to fetch farms', err);
        }
    }, [farmer?._id]);

    const fetchMedia = useCallback(async () => {
        if (!farmer?._id) return;
        try {
            const res = await api.get('/media');
            const farmerMedia = res.data.filter(
                (m: any) =>
                    m.farm === farmer._id ||
                    (farmer.community && m.community === farmer.community)
            );
            setMedia(farmerMedia);
        } catch (err) {
            console.error('Failed to fetch media', err);
        }
    }, [farmer?._id, farmer?.community]);

    useEffect(() => {
        if (open && farmer?._id) {
            fetchFarms();
            fetchMedia();
        }
    }, [open, farmer?._id, fetchFarms, fetchMedia]);

    useEffect(() => {
        if (!open) return;
        setActiveDetailTab(window.innerWidth < 768 ? 'summary' : 'overview');
    }, [open, farmer?._id]);

    if (!farmer) return null;

    const farm = farms[0] || {
        name: `${farmer.name}'s Farm`,
        status: farmer.investmentStatus || farmer.status || 'Active',
        health: 0,
        size: farmer.farmSize || farmer.estimatedAcreage || 'Not Recorded',
        crop:
            farmer.cropList?.filter((c: string) => c !== 'Other').join(', ') ||
            farmer.cropsGrown ||
            farmer.livestockType ||
            'Not Specified',
        lastVisit: 'Not Recorded',
        nextVisit: 'Awaiting Schedule',
    };

    const cropLabel = farmer.farmType === 'livestock' ? 'Livestock' : 'Crops';
    const cropValue = farmer.cropsGrown || farmer.livestockType || farm.crop;
    const healthLabel =
        (farm.health ?? 0) > 80 ? 'Excellent' : (farm.health ?? 0) > 50 ? 'Good' : 'Needs Verification';

    const summaryPanel = (
        <>
            <div className="flex flex-col items-center text-center py-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Farm Health Score
                </h3>
                <div className="relative h-32 w-32 md:h-40 md:w-40 flex items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
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
                            strokeDashoffset={440 - (440 * (farm.health || 0)) / 100}
                            className="text-[#065f46] transition-all duration-1000"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className={`text-3xl md:text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {farm.health ?? 0}%
                        </span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                            {healthLabel}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
                <div className={`p-3 md:p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Visit</p>
                    <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {farm.lastVisit || 'Not Recorded'}
                    </p>
                    <p className="text-[10px] text-[#065f46] font-bold mt-1 uppercase tracking-widest">
                        Status: {farm.status || 'Active'}
                    </p>
                </div>
                <div className={`p-3 md:p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Next Scheduled</p>
                    <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {farm.nextVisit || 'TBD'}
                    </p>
                    <p className="text-[10px] text-amber-500 font-bold mt-1 uppercase tracking-widest">
                        Pending Field Audit
                    </p>
                </div>
            </div>

            <div className={`p-4 rounded-xl border-2 border-dashed ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center justify-center shrink-0 shadow-lg border-2 border-white dark:border-white/10">
                        {farmer.profilePicture || farmer.avatar ? (
                            <img
                                src={farmer.profilePicture || farmer.avatar}
                                alt={farmer.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-[#065f46]/20 w-full h-full flex items-center justify-center text-[#065f46] font-black text-[10px]">
                                {farmer.name
                                    ?.split(' ')
                                    .slice(0, 2)
                                    .map((n: string) => n[0])
                                    .join('')
                                    .toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase text-[#065f46] tracking-widest">Connect</p>
                        <p className="text-sm font-bold truncate text-gray-900 dark:text-gray-100">{farmer.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 truncate tracking-tighter">
                            {farmer.contact || farmer.phone || 'No phone'}
                        </p>
                    </div>
                    {farmer.contact && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full h-10 w-10 hover:bg-[#065f46]/10 dark:hover:bg-[#065f46]/20 shrink-0"
                            asChild
                        >
                            <a href={`tel:${farmer.contact}`}>
                                <Phone className="h-5 w-5 text-[#065f46]" />
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </>
    );

    const profileFields = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailRow darkMode={darkMode} label="Full name" value={farmer.name} />
            <DetailRow darkMode={darkMode} label="Lync ID" value={getGrowerDisplayId(farmer)} />
            <DetailRow darkMode={darkMode} label="Phone" value={farmer.contact || farmer.phone} />
            <DetailRow darkMode={darkMode} label="Email" value={farmer.email} />
            <DetailRow darkMode={darkMode} label="Gender" value={farmer.gender} />
            <DetailRow
                darkMode={darkMode}
                label="Date of birth"
                value={
                    farmer.dateOfBirth
                        ? new Date(farmer.dateOfBirth).toLocaleDateString()
                        : farmer.age
                          ? `${farmer.age} years`
                          : undefined
                }
            />
            <DetailRow darkMode={darkMode} label="Ghana Card" value={farmer.ghanaCardNumber || farmer.digitalCardNumber} />
            <DetailRow darkMode={darkMode} label="Preferred language" value={farmer.preferredLanguage} />
            <DetailRow darkMode={darkMode} label="Region" value={farmer.region} />
            <DetailRow darkMode={darkMode} label="District" value={farmer.district} />
            <DetailRow darkMode={darkMode} label="Community" value={farmer.community} />
            <DetailRow darkMode={darkMode} label="Verification status" value={farmer.verificationStatus || farmer.status} />
            <DetailRow darkMode={darkMode} label="Onboarding agent" value={farmer.onboardingAgentId} />
            <DetailRow
                darkMode={darkMode}
                label="Registered"
                value={
                    farmer.createdAt
                        ? new Date(farmer.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                          })
                        : undefined
                }
                className="sm:col-span-2"
            />
            {farmer.fieldNotes && (
                <DetailRow darkMode={darkMode} label="Field notes" value={farmer.fieldNotes} className="sm:col-span-2" />
            )}
        </div>
    );

    const farmFields = (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailRow darkMode={darkMode} label="Farm type" value={farmer.farmType} />
                <DetailRow
                    darkMode={darkMode}
                    label="Farm size"
                    value={
                        farm.size && farm.size !== 'Not Recorded'
                            ? `${farm.size}${!isNaN(parseFloat(String(farm.size))) ? ' hectares' : ''}`
                            : farm.size
                    }
                />
                <DetailRow darkMode={darkMode} label={cropLabel} value={cropValue} />
                <DetailRow darkMode={darkMode} label="Experience" value={farmer.yearsOfExperience ? `${farmer.yearsOfExperience} years` : undefined} />
                <DetailRow darkMode={darkMode} label="Land ownership" value={farmer.landOwnershipStatus} />
                <DetailRow darkMode={darkMode} label="Investment interest" value={farmer.investmentInterest} />
                <DetailRow darkMode={darkMode} label="Capital required (GHS)" value={farmer.capitalRequirement} />
                <DetailRow darkMode={darkMode} label="Investment objective" value={farmer.investmentObjective} />
                <DetailRow darkMode={darkMode} label="Investment status" value={farmer.investmentStatus} />
                <DetailRow darkMode={darkMode} label="Training progress" value={farmer.trainingProgress} />
            </div>

            {farms.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Registered fields</h4>
                    <div className="space-y-2">
                        {farms.map((f: any) => (
                            <div
                                key={f._id || f.id}
                                className={`p-3 rounded-xl border flex items-center gap-3 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}
                            >
                                <Map className="h-4 w-4 text-[#065f46] shrink-0" />
                                <div className="min-w-0">
                                    <p className={`text-sm font-bold truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                        {f.name || 'Field asset'}
                                    </p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                        {f.size || f.area || 'Size not recorded'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={`p-4 rounded-xl border ${darkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-[#065f46] mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-[#002f37] dark:text-gray-100 uppercase tracking-wide">
                            Quick bio
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed italic">
                            {farmer.bio ||
                                `${farmer.name || 'This grower'} is a dedicated ${farmer.farmType || 'agricultural'} operator in ${farmer.community || farmer.region || 'their community'}.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`agent-modal-mobile w-[95vw] md:max-w-7xl md:w-[min(96vw,1280px)] max-md:h-full max-md:max-h-[100dvh] md:h-[88vh] md:max-h-[920px] p-0 flex flex-col overflow-hidden border-0 max-md:rounded-none md:rounded-lg ${darkMode ? 'bg-[#0b2528]' : 'bg-gray-50'}`}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>Grower profile — {farmer.name}</DialogTitle>
                    <DialogDescription>Full details for grower {farmer.name}</DialogDescription>
                </DialogHeader>

                {/* Header */}
                <div
                    className={`p-3 md:p-6 pr-11 md:pr-14 border-b shrink-0 flex flex-col gap-3 md:gap-4 ${darkMode ? 'bg-[#002f37] border-white/10' : 'bg-white border-gray-200'}`}
                >
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl overflow-hidden shadow-xl border-2 border-[#065f46]/20 bg-white/10 flex items-center justify-center shrink-0">
                            {farmer.profilePicture || farmer.avatar ? (
                                <img
                                    src={farmer.profilePicture || farmer.avatar}
                                    alt={farmer.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#065f46]/10 text-[#065f46] font-black text-xs">
                                    {farmer.name
                                        ?.split(' ')
                                        .slice(0, 2)
                                        .map((n: string) => n[0])
                                        .join('')
                                        .toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1
                                className={`text-lg md:text-2xl font-black tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
                            >
                                {farmer.name}
                            </h1>
                            <p className={`text-xs md:text-sm font-bold text-[#065f46] mt-0.5 ${darkMode ? 'text-[#7ede56]' : ''}`}>
                                {getGrowerDisplayId(farmer)}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    {farmer.region || '—'}
                                    {farmer.district ? ` · ${farmer.district}` : ''}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="text-[9px] uppercase font-black bg-[#065f46] text-white rounded-lg border-none"
                                >
                                    {farm.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full md:flex md:flex-wrap md:items-center md:justify-end md:gap-2">
                        <Button
                            className="w-full md:w-auto md:flex-none bg-[#065f46] text-white hover:bg-[#065f46]/90 font-black h-10 md:h-11 px-3 md:px-6 rounded-xl border-none shadow-lg shadow-[#065f46]/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shrink-0"
                            onClick={() => onNewVisit?.(farmer)}
                        >
                            <Plus className="h-4 w-4" /> New Visit
                        </Button>
                        <Button
                            variant="outline"
                            className={`w-full md:w-auto md:flex-none h-10 md:h-11 px-3 md:px-6 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shrink-0 ${darkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-[#002f37] hover:bg-gray-50'}`}
                            onClick={() => onUploadMedia?.(farmer)}
                        >
                            <Camera className="h-4 w-4 shrink-0" />
                            Upload
                        </Button>
                        <Button
                            variant="outline"
                            className={`w-full md:w-auto md:flex-none h-10 md:h-11 px-3 md:px-6 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shrink-0 ${darkMode ? 'border-[#7ede56]/30 text-[#7ede56] hover:bg-[#7ede56]/5' : 'border-[#065f46]/30 text-[#065f46] hover:bg-[#065f46]/5'}`}
                            onClick={() => onAddField?.(farmer)}
                        >
                            <Map className="h-4 w-4 shrink-0" /> Add Field
                        </Button>
                        {isActiveGrower && (
                            <Button
                                variant="outline"
                                className={`w-full md:w-auto md:flex-none h-10 md:h-11 px-3 md:px-6 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shrink-0 ${darkMode ? 'border-white/15 text-white hover:bg-white/5' : 'border-[#002f37]/20 text-[#002f37] hover:bg-gray-50'}`}
                                onClick={() => setIdCardOpen(true)}
                            >
                                <IdCard className="h-4 w-4" /> ID Card
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className={`hidden md:flex ${darkMode ? 'text-gray-400' : ''}`}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
                    {/* Desktop sidebar */}
                    <div
                        className={`hidden md:flex md:w-[280px] lg:w-[300px] shrink-0 p-6 border-r flex-col gap-5 overflow-y-auto min-h-0 ${darkMode ? 'bg-[#0b2528] border-white/5' : 'bg-white border-gray-200'}`}
                    >
                        {summaryPanel}
                    </div>

                    {/* Tabbed content */}
                    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                        <Tabs
                            value={activeDetailTab}
                            onValueChange={setActiveDetailTab}
                            className="flex-1 min-h-0 flex flex-col"
                        >
                            <div
                                className={`px-2 md:px-6 pt-1 border-b shrink-0 ${darkMode ? 'bg-[#002f37] border-white/5' : 'bg-white border-gray-200'}`}
                            >
                                <TabsList className="bg-transparent h-11 md:h-12 w-full justify-start gap-1 md:gap-8 p-0 overflow-x-auto no-scrollbar flex-nowrap">
                                    <TabsTrigger value="summary" className={`md:hidden ${tabTriggerClass}`}>
                                        Summary
                                    </TabsTrigger>
                                    <TabsTrigger value="profile" className={`md:hidden ${tabTriggerClass}`}>
                                        Profile
                                    </TabsTrigger>
                                    <TabsTrigger value="overview" className={tabTriggerClass}>
                                        <span className="md:hidden">Farm</span>
                                        <span className="hidden md:inline">Overview</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="timeline" className={tabTriggerClass}>
                                        Timeline
                                    </TabsTrigger>
                                    <TabsTrigger value="visits" className={tabTriggerClass}>
                                        Visits
                                    </TabsTrigger>
                                    <TabsTrigger value="media" className={tabTriggerClass}>
                                        Media ({media.length})
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                                <div className="p-4 md:p-8 pb-8">
                                    <TabsContent value="summary" className="mt-0 md:hidden space-y-4">
                                        {summaryPanel}
                                    </TabsContent>

                                    <TabsContent value="profile" className="mt-0 md:hidden space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            Grower identity & location
                                        </h4>
                                        {profileFields}
                                    </TabsContent>

                                    <TabsContent value="overview" className="mt-0 space-y-6">
                                        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                                                        Farm profile
                                                    </h4>
                                                    {farmFields}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                                                    Grower profile
                                                </h4>
                                                {profileFields}
                                                <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                    <p className="text-xs font-bold mb-2">Grower engagement</p>
                                                    <Progress value={90} className="h-1.5" />
                                                    <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                                                        <span>Highly responsive</span>
                                                        <span>90% score</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:hidden space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                                Farm & production
                                            </h4>
                                            {farmFields}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="timeline" className="mt-0">
                                        <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
                                            <div className="relative pl-8 group">
                                                <div
                                                    className={`absolute left-0 top-1.5 w-6 h-6 rounded-full z-10 flex items-center justify-center border-4 ${darkMode ? 'bg-[#0b2528] border-gray-800' : 'bg-white border-gray-100'}`}
                                                >
                                                    <CheckCircle2 className="h-2.5 w-2.5 text-[#065f46]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase">
                                                        {new Date(farmer.createdAt || Date.now()).toLocaleDateString()}
                                                    </p>
                                                    <h5 className="font-bold text-sm mt-0.5">
                                                        Farm registration successfully verified
                                                    </h5>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Initial boundary mapping and onboarding completed by field agent.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="visits" className="mt-0 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                                Past reports
                                            </h4>
                                        </div>
                                        <div className="py-16 text-center">
                                            <div className="h-16 w-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200 dark:border-white/10">
                                                <ClipboardList className="h-8 w-8 text-gray-300" />
                                            </div>
                                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                                No reports archived yet
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                Visits and diagnostic audits will appear here.
                                            </p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="media" className="mt-0">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            <div
                                                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-4 bg-gray-50/50 dark:bg-white/5 group hover:border-[#065f46] transition-all cursor-pointer"
                                                onClick={() => onUploadMedia?.(farmer)}
                                            >
                                                <Camera className="h-10 w-10 text-gray-300 group-hover:text-[#065f46] mb-3" />
                                                <p className="text-[11px] font-black text-gray-400 group-hover:text-[#065f46] uppercase tracking-widest text-center leading-tight">
                                                    Add evidence
                                                </p>
                                            </div>

                                            {media.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="relative aspect-square rounded-3xl overflow-hidden group shadow-xl border border-white/5 bg-gray-950"
                                                >
                                                    {item.thumbnail || (item.type === 'Photo' && item.url) ? (
                                                        <img
                                                            src={item.thumbnail || item.url}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            alt={item.name}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                                                            <Video className="h-12 w-12" />
                                                            <p className="text-[10px] mt-2 font-black uppercase tracking-widest">
                                                                Video
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                        <div>
                                                            <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-[8px] text-white/60 font-bold uppercase tracking-tight">
                                                                {item.category}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>

                <div
                    className={`p-3 md:p-4 border-t flex items-center justify-end shrink-0 safe-area-bottom ${darkMode ? 'bg-[#002f37] border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="text-xs font-bold uppercase tracking-widest transition-all hover:bg-rose-500/10 hover:text-rose-500 min-h-[44px] px-4"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>

            <FarmerIdCardModal
                open={idCardOpen}
                onOpenChange={setIdCardOpen}
                farmer={farmer}
                fetchSavedCard
            />
        </Dialog>
    );
};

export default ViewFarmerModal;
