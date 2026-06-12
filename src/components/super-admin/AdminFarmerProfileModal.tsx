import React, { useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDarkMode } from '@/contexts/DarkModeContext';
import {
    Phone,
    Mail,
    MapPin,
    User,
    Sprout,
    History,
    Download,
    FileText,
    Shield,
    Navigation,
    CheckCircle2,
    Loader2,
    Calendar,
    Tractor,
} from 'lucide-react';
import { toast } from 'sonner';
import { exportFarmerProfilePdf, downloadFarmerProfileJson } from '@/utils/farmerProfileExport';

interface AdminFarmerProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    summaryFarmer: any;
    details: any;
    loading: boolean;
    onChangeStatus: () => void;
    getStatusColor: (status: string) => string;
}

const DetailField = ({
    label,
    value,
    darkMode,
}: {
    label: string;
    value?: React.ReactNode;
    darkMode: boolean;
}) => (
    <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p className={`text-base font-medium mt-1.5 leading-snug break-words ${darkMode ? 'text-gray-100' : 'text-[#002f37]'}`}>
            {value ?? '—'}
        </p>
    </div>
);

const AdminFarmerProfileModal: React.FC<AdminFarmerProfileModalProps> = ({
    open,
    onOpenChange,
    summaryFarmer,
    details,
    loading,
    onChangeStatus,
    getStatusColor,
}) => {
    const { darkMode } = useDarkMode();
    const farmer = details?.farmer || summaryFarmer;
    const farms = details?.farms || [];
    const fieldVisits = details?.fieldVisits || [];
    const scheduledVisits = details?.scheduledVisits || [];

    const avatarSrc =
        farmer?.profilePicture ||
        farmer?.avatar ||
        summaryFarmer?.avatar;

    const showAvatar =
        avatarSrc && !String(avatarSrc).includes('lovable-uploads/profile.png');

    const cropStages = ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'];
    const livestockStages = ['planning', 'acquisition', 'rearing', 'health', 'production', 'marketing', 'maintenance', 'other'];
    const journeyStages = (farmer?.farmType || '').toLowerCase() === 'livestock' ? livestockStages : cropStages;

    const stageDetails = useMemo(() => {
        const raw = farmer?.stageDetails;
        if (!raw || typeof raw !== 'object') return {};
        return raw as Record<string, { status?: string; date?: string; notes?: string; activities?: unknown[] }>;
    }, [farmer?.stageDetails]);

    const gps = farmer?.gpsLocation || farmer?.farmLocation;
    const lat = gps?.lat;
    const lng = gps?.lng;

    const handleExportJson = () => {
        if (!farmer) return;
        downloadFarmerProfileJson(
            details || { farmer: summaryFarmer },
            `AgriLync_Grower_${farmer.name || 'profile'}_${new Date().toISOString().split('T')[0]}.json`
        );
        toast.success('Grower profile exported as JSON');
    };

    const handleExportPdf = () => {
        if (!farmer) return;
        try {
            exportFarmerProfilePdf(details || { farmer: summaryFarmer });
            toast.success('Grower profile PDF downloaded');
        } catch (err) {
            console.error(err);
            toast.error('Could not generate PDF export');
        }
    };

    if (!summaryFarmer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`admin-modal-mobile admin-farmer-profile-modal w-[95vw] md:!max-w-[min(98vw,1420px)] lg:!max-w-[min(96vw,1520px)] xl:!max-w-[1600px] md:!w-[min(98vw,1420px)] lg:!w-[min(96vw,1520px)] h-[min(92vh,920px)] p-0 flex flex-col overflow-hidden border-none shadow-2xl ${
                    darkMode ? 'bg-gray-950 text-white' : 'bg-white'
                }`}
            >
                <DialogTitle className="sr-only">Grower profile — {farmer?.name}</DialogTitle>

                {/* Header */}
                <div className="bg-[#002f37] px-6 py-5 text-white shrink-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            {showAvatar ? (
                                <img
                                    src={avatarSrc}
                                    alt={farmer?.name}
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg shrink-0"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center font-black text-2xl border border-white/20 shrink-0">
                                    {farmer?.name?.[0] || '?'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-xl font-black uppercase tracking-tight truncate">
                                        {farmer?.name || summaryFarmer.name}
                                    </h2>
                                    <Badge className={`${getStatusColor(summaryFarmer.status)} border-none text-xs font-semibold`}>
                                        {summaryFarmer.status}
                                    </Badge>
                                </div>
                                <p className="text-sm font-mono text-[#7ede56] mt-1">
                                    {farmer?.id || `ID ${String(summaryFarmer.id).slice(-8)}`}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-sm text-white/80">
                                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 shrink-0" />{farmer?.contact || summaryFarmer.phone}</span>
                                    {(farmer?.email || summaryFarmer.email) && (
                                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 shrink-0" />{farmer?.email || summaryFarmer.email}</span>
                                    )}
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 shrink-0" />{farmer?.region || summaryFarmer.region}</span>
                                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 shrink-0" />{farmer?.agent?.name || summaryFarmer.agentName || 'Unassigned'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 bg-white/5 text-white hover:bg-white/10 font-semibold text-sm h-10"
                                onClick={handleExportJson}
                                disabled={loading}
                            >
                                <FileText className="w-3.5 h-3.5 mr-1.5" /> Export JSON
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[#7ede56] text-[#002f37] hover:bg-[#6bcb4b] font-semibold text-sm h-10"
                                onClick={handleExportPdf}
                                disabled={loading}
                            >
                                <Download className="w-3.5 h-3.5 mr-1.5" /> Export PDF
                            </Button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-[#7ede56]" />
                        <p className="text-sm font-medium text-gray-500">Loading grower details…</p>
                    </div>
                ) : (
                    <Tabs defaultValue="profile" className="flex-1 flex flex-col min-h-0">
                        <div className={`px-4 sm:px-6 py-3 border-b shrink-0 ${darkMode ? 'border-gray-800 bg-gray-900/40' : 'border-gray-100 bg-gray-50/80'}`}>
                            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto gap-2 p-1.5 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800">
                                {[
                                    { id: 'profile', label: 'Profile' },
                                    { id: 'farm', label: 'Farm & Map' },
                                    { id: 'journey', label: 'Farm Journey' },
                                    { id: 'activity', label: 'Visits' },
                                ].map((tab) => (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-400 data-[state=active]:bg-[#002f37] data-[state=active]:text-white data-[state=active]:shadow-sm whitespace-normal leading-tight text-center"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4 sm:p-6">
                                <TabsContent value="profile" className="mt-0 space-y-6">
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Personal & Identity
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                            <DetailField darkMode={darkMode} label="Ghana Card" value={farmer?.ghanaCardNumber} />
                                            <DetailField darkMode={darkMode} label="Gender" value={farmer?.gender} />
                                            <DetailField darkMode={darkMode} label="Date of Birth" value={farmer?.dob} />
                                            <DetailField darkMode={darkMode} label="Language" value={farmer?.language} />
                                            <DetailField darkMode={darkMode} label="District" value={farmer?.district} />
                                            <DetailField darkMode={darkMode} label="Community" value={farmer?.community} />
                                            <DetailField darkMode={darkMode} label="Onboarding Agent ID" value={farmer?.onboardingAgentId || farmer?.agent?.agentId} />
                                            <DetailField darkMode={darkMode} label="Profile Completeness" value={farmer?.profileCompleteness != null ? `${farmer.profileCompleteness}%` : undefined} />
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                                            <Tractor className="w-4 h-4" /> Production Profile
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                            <DetailField darkMode={darkMode} label="Farm Type" value={farmer?.farmType} />
                                            <DetailField darkMode={darkMode} label="Farm Size" value={farmer?.farmSize != null ? `${farmer.farmSize} acres` : undefined} />
                                            <DetailField darkMode={darkMode} label="Experience" value={farmer?.yearsOfExperience != null ? `${farmer.yearsOfExperience} years` : undefined} />
                                            <DetailField darkMode={darkMode} label="Land Ownership" value={farmer?.landOwnershipStatus} />
                                            <DetailField darkMode={darkMode} label="Crops" value={(farmer?.cropList || []).filter((c: string) => c && c !== 'Other').join(', ') || farmer?.cropsGrown} />
                                            <DetailField darkMode={darkMode} label="Livestock" value={farmer?.livestockType} />
                                            <DetailField darkMode={darkMode} label="Investment Interest" value={farmer?.investmentInterest} />
                                            <DetailField darkMode={darkMode} label="System Status" value={farmer?.status} />
                                        </div>
                                    </section>

                                    {(farmer?.trainingModules?.length > 0) && (
                                        <section>
                                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">Training Modules</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {farmer.trainingModules.map((m: string) => (
                                                    <Badge key={m} className="bg-[#7ede56]/10 text-[#065f46] border-[#7ede56]/20 text-xs font-medium">{m}</Badge>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {(farmer?.idCardFront || farmer?.idCardBack) && (
                                        <section>
                                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">KYC Documents</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {farmer.idCardFront && (
                                                    <a href={farmer.idCardFront} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:opacity-90">
                                                        <img src={farmer.idCardFront} alt="ID front" className="w-full h-40 object-cover" />
                                                        <p className="text-xs font-medium p-2 text-center text-gray-500">Ghana Card — Front</p>
                                                    </a>
                                                )}
                                                {farmer.idCardBack && (
                                                    <a href={farmer.idCardBack} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:opacity-90">
                                                        <img src={farmer.idCardBack} alt="ID back" className="w-full h-40 object-cover" />
                                                        <p className="text-xs font-medium p-2 text-center text-gray-500">Ghana Card — Back</p>
                                                    </a>
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </TabsContent>

                                <TabsContent value="farm" className="mt-0 space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">Registered Farms</h3>
                                            {farms.length === 0 ? (
                                                <p className="text-sm text-gray-400 font-medium">No farm parcels linked yet.</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {farms.map((farm: any) => (
                                                        <div key={farm._id} className={`p-4 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
                                                            <p className="font-semibold text-base">{farm.name || `${farmer?.name}'s Farm`}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {farm.crop || farm.crops || summaryFarmer.crop} · {farm.size || farm.acreage || farmer?.farmSize || '—'} acres
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">{farm.location || farm.community || farmer?.community}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                <Navigation className="w-4 h-4" /> GPS Location
                                            </h3>
                                            <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 relative">
                                                {lat != null && lng != null ? (
                                                    <>
                                                        <iframe
                                                            title="Farm map"
                                                            className="absolute inset-0 w-full h-full border-0"
                                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${lat - 0.008}%2C${lng + 0.008}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`}
                                                        />
                                                        <div className="absolute bottom-2 left-2 flex gap-1 z-10">
                                                            <Badge className="bg-black/80 text-white text-[8px]">LAT {Number(lat).toFixed(5)}</Badge>
                                                            <Badge className="bg-black/80 text-white text-[8px]">LNG {Number(lng).toFixed(5)}</Badge>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-bold uppercase">No GPS pinned</div>
                                                )}
                                            </div>
                                            {lat != null && lng != null && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-3 w-full font-semibold text-sm"
                                                    onClick={() => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')}
                                                >
                                                    Open in Google Maps
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="journey" className="mt-0">
                                    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex flex-wrap items-center gap-2">
                                        <Sprout className="w-4 h-4" /> Seasonal Farm Journey
                                        {farmer?.currentStage && (
                                            <Badge className="bg-amber-500/10 text-amber-600 border-none text-xs">Current: {farmer.currentStage}</Badge>
                                        )}
                                    </h3>
                                    <div className="relative">
                                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 hidden md:block" />
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                                            {journeyStages.map((stage) => {
                                                const data = stageDetails[stage];
                                                const isCompleted = data?.status === 'completed';
                                                const isCurrent = farmer?.currentStage === stage;
                                                return (
                                                    <div key={stage} className={`p-4 rounded-xl border text-center ${darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                                                        <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${isCompleted ? 'bg-[#7ede56] text-[#002f37]' : isCurrent ? 'bg-amber-400 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                                        </div>
                                                        <p className={`text-sm font-semibold capitalize ${isCompleted ? 'text-[#7ede56]' : isCurrent ? 'text-amber-500' : 'text-gray-500'}`}>{stage}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {data?.date ? new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending'}
                                                        </p>
                                                        {data?.notes && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-4">{data.notes}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="activity" className="mt-0 space-y-6">
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                                            <History className="w-4 h-4" /> Field Visits ({fieldVisits.length})
                                        </h3>
                                        {fieldVisits.length === 0 ? (
                                            <p className="text-sm text-gray-400">No field visits logged.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {fieldVisits.map((v: any) => (
                                                    <div key={v._id} className={`flex gap-3 p-3 rounded-xl border ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                                                        <div className="w-1 bg-[#7ede56] rounded-full shrink-0" />
                                                        <div>
                                                            <p className="text-base font-semibold">{v.purpose || 'Field inspection'}</p>
                                                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                                                <Calendar className="w-4 h-4 shrink-0" />
                                                                {v.date ? new Date(v.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                                                                {v.status && ` · ${v.status}`}
                                                            </p>
                                                            {v.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">{v.notes}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    {scheduledVisits.length > 0 && (
                                        <section>
                                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">Scheduled Visits</h3>
                                            <div className="space-y-2">
                                                {scheduledVisits.map((v: any) => (
                                                    <div key={v._id} className={`p-4 rounded-xl border text-sm ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                                                        <span className="font-semibold text-base">{v.purpose}</span>
                                                        <span className="text-gray-500 text-sm ml-2">
                                                            {v.scheduledDate ? new Date(v.scheduledDate).toLocaleDateString('en-GB') : ''} {v.scheduledTime}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </TabsContent>
                            </div>
                        </ScrollArea>
                    </Tabs>
                )}

                <div className={`px-4 sm:px-6 py-4 border-t flex flex-col-reverse sm:flex-row justify-between gap-3 shrink-0 ${darkMode ? 'border-gray-800 bg-gray-900/60' : 'border-gray-100 bg-gray-50'}`}>
                    <Button variant="outline" className="font-semibold text-sm h-11 w-full sm:w-auto" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button
                        className="bg-[#002f37] text-[#7ede56] hover:bg-[#001c21] font-semibold text-sm h-11 w-full sm:w-auto"
                        onClick={() => { onOpenChange(false); onChangeStatus(); }}
                    >
                        <Shield className="w-4 h-4 mr-2" /> Change Status
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AdminFarmerProfileModal;
