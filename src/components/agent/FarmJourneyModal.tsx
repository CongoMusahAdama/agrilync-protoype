import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Leaf, FileText, Sprout, Scissors, Wrench, MoreHorizontal, CheckCircle,
    Plus, Edit, Activity, Upload, X, Video, Clock
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import { GHANA_REGIONS, GHANA_COMMUNITIES } from '@/data/ghanaRegions';

interface FarmJourneyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    farmer: any;
}

const FarmJourneyModal: React.FC<FarmJourneyModalProps> = ({ open, onOpenChange, farmer }) => {
    const { darkMode } = useDarkMode();

    if (!farmer) return null;

    // Data State
    const [farm, setFarm] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Global current stage of the farm
    const [currentStage, setCurrentStage] = useState('planning');
    // Currently viewed tab in the activities section
    const [activeStageTab, setActiveStageTab] = useState('planning');

    // State for managing activities
    const [showActivityDialog, setShowActivityDialog] = useState(false);
    const [savingActivity, setSavingActivity] = useState(false);
    const [newActivity, setNewActivity] = useState<{
        date: string;
        activity: string;
        description: string;
        resources: string;
        media: Array<{ type: 'image' | 'video'; url: string; name: string }>;
    }>({
        date: new Date().toISOString().split('T')[0],
        activity: '',
        description: '',
        resources: '',
        media: []
    });

    // Add Farm Form State
    const [addFarmForm, setAddFarmForm] = useState({
        name: '',
        location: '',
        crop: ''
    });
    const [addingFarm, setAddingFarm] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const stages = ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'];

    // Memoized communities based on farmer's region
    const availableCommunities = useMemo(() => {
        if (!farmer?.region) return [];

        // Find districts for the region (handle both "Ashanti" and "Ashanti Region" naming)
        const regionKey = Object.keys(GHANA_REGIONS).find(
            key => key.toLowerCase().includes(farmer.region.toLowerCase())
        );

        if (!regionKey) return ["Other (Specify)"];

        const districts = GHANA_REGIONS[regionKey] || [];
        const communitiesSet = new Set<string>();

        districts.forEach(district => {
            const districtComms = GHANA_COMMUNITIES[district] || [];
            districtComms.forEach(c => communitiesSet.add(c));
        });

        const sortedComms = Array.from(communitiesSet).sort();
        // Ensure "Other (Specify)" is at the end if it exists
        const filteredResult = sortedComms.filter(c => c !== "Other (Specify)");
        return [...filteredResult, "Other (Specify)"];
    }, [farmer?.region]);

    const fetchFarmDetails = async () => {
        setLoading(true);
        try {
            const res = await api.get('/farms');
            const farmerId = farmer?._id || farmer?.id;
            const farmerFarm = res.data.find((f: any) => {
                const farmFarmerId = f.farmer?._id || f.farmer?.id || f.farmer;
                return farmFarmerId === farmerId;
            });

            if (farmerFarm) {
                setFarm(farmerFarm);
                setCurrentStage(farmerFarm.currentStage || 'planning');
                setActiveStageTab(farmerFarm.currentStage || 'planning');
            } else {
                setFarm(null);
            }
        } catch (error) {
            console.error("Failed to fetch farm details:", error);
            toast.error("Could not load farm details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && farmer) {
            fetchFarmDetails();
        }
    }, [open, farmer?.id, farmer?._id]);

    const handleUpdateStage = async (newStage: string) => {
        if (!farm) return;
        try {
            await api.put(`/farms/${farm._id}`, { currentStage: newStage });
            setFarm({ ...farm, currentStage: newStage });
            setCurrentStage(newStage);
            toast.success(`Farm stage updated to ${newStage}`);
        } catch (error) {
            console.error("Failed to update stage:", error);
            toast.error("Failed to update farm stage.");
        }
    };

    const handleCloseActivityDialog = () => {
        setNewActivity({ date: new Date().toISOString().split('T')[0], activity: '', description: '', resources: '', media: [] });
        setShowActivityDialog(false);
    };

    const handleSaveActivity = async () => {
        if (!newActivity.date || !newActivity.activity || !farm) return;

        setSavingActivity(true);
        try {
            const activityId = Date.now().toString();
            const activity = {
                id: activityId,
                date: newActivity.date,
                activity: newActivity.activity,
                description: newActivity.description,
                resources: newActivity.resources,
                media: newActivity.media
            };

            const updatedStageDetails = JSON.parse(JSON.stringify(farm.stageDetails || {}));
            if (!updatedStageDetails[activeStageTab]) {
                updatedStageDetails[activeStageTab] = { activities: [], status: 'pending', date: '', notes: '' };
            }
            if (!updatedStageDetails[activeStageTab].activities) {
                updatedStageDetails[activeStageTab].activities = [];
            }

            updatedStageDetails[activeStageTab].activities.push(activity);
            if (updatedStageDetails[activeStageTab].status === 'pending') {
                updatedStageDetails[activeStageTab].status = 'in-progress';
            }

            await api.put(`/farms/${farm._id}`, { stageDetails: updatedStageDetails });
            setFarm({ ...farm, stageDetails: updatedStageDetails });
            toast.success("Activity logged successfully!");
            handleCloseActivityDialog();
        } catch (error) {
            console.error("Failed to save activity:", error);
            toast.error("Failed to save activity.");
        } finally {
            setSavingActivity(false);
        }
    };

    const handleAddFarm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addFarmForm.name || !addFarmForm.location || !addFarmForm.crop || !farmer) return;

        setAddingFarm(true);
        try {
            const farmData = {
                name: addFarmForm.name,
                location: addFarmForm.location,
                crop: addFarmForm.crop,
                farmer: farmer?._id || farmer?.id,
                status: 'verified',
                currentStage: 'planning'
            };

            const res = await api.post('/farms', farmData);
            setFarm(res.data);
            setCurrentStage('planning');
            setActiveStageTab('planning');
            toast.success("Farm registered successfully! You can now track the journey.");
        } catch (error) {
            console.error("Failed to add farm:", error);
            toast.error("Failed to register farm. Please try again.");
        } finally {
            setAddingFarm(false);
        }
    };

    const openActivityDialog = () => {
        setNewActivity({ date: new Date().toISOString().split('T')[0], activity: '', description: '', resources: '', media: [] });
        setShowActivityDialog(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    const type = file.type.startsWith('image') ? 'image' : 'video';

                    setNewActivity((prev: any) => ({
                        ...prev,
                        media: [...prev.media, { type, url: base64String, name: file.name }]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeMedia = (index: number) => {
        setNewActivity((prev: any) => ({
            ...prev,
            media: prev.media.filter((_: any, i: number) => i !== index)
        }));
    };

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'planning': return { bg: '#7ede56', textOnLight: '#0f5132', textOnDark: '#ffffff' };
            case 'planting': return { bg: '#ffa500', textOnLight: '#8a4a00', textOnDark: '#ffffff' };
            case 'growing': return { bg: '#ff6347', textOnLight: '#7c1f0a', textOnDark: '#ffffff' };
            case 'harvesting': return { bg: '#921573', textOnLight: '#5e0e4a', textOnDark: '#ffffff' };
            case 'maintenance': return { bg: '#5fd646', textOnLight: '#0f5132', textOnDark: '#ffffff' };
            case 'other': return { bg: '#ffb547', textOnLight: '#8a4a00', textOnDark: '#ffffff' };
            default: return { bg: '#6b7280', textOnLight: '#374151', textOnDark: '#ffffff' };
        }
    };

    if (!farmer) return null;

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className={`max-w-6xl w-full h-[60vh] flex items-center justify-center ${darkMode ? 'bg-[#002f37] border-white/10 text-white' : 'bg-white'}`}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <p className={darkMode ? 'text-gray-200' : 'text-gray-500'}>Loading farm details...</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-6xl w-full max-h-[95vh] overflow-y-auto ${darkMode ? 'bg-[#002f37] border-white/10' : 'bg-white'}`}>
                <DialogHeader className="mb-4">
                    <DialogTitle className={`flex items-center gap-3 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                            <Leaf className="h-6 w-6" />
                        </div>
                        Farm Journey Tracker
                    </DialogTitle>
                    <DialogDescription className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Manage and track the agricultural lifecycle for <span className="font-semibold text-emerald-500">{farmer?.name}</span>
                    </DialogDescription>
                </DialogHeader>

                {!farm ? (
                    <div className="py-12 max-w-2xl mx-auto w-full">
                        <Card className={`${darkMode ? 'bg-[#003d47] border-white/10' : 'bg-gray-50 border-gray-200'} shadow-2xl overflow-hidden`}>
                            <div className={`h-2 bg-emerald-500`} />
                            <CardHeader className="text-center pb-2">
                                <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                    <Sprout className="w-10 h-10" />
                                </div>
                                <CardTitle className={`text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>Register a Farm</CardTitle>
                                <CardDescription className={`max-w-md mx-auto text-base ${darkMode ? 'text-gray-300' : ''}`}>
                                    This farmer does not have a registered farm yet. Add a farm to start tracking their agricultural journey.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleAddFarm} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="farmName" className={darkMode ? 'text-white text-base' : 'text-base'}>Farm Name</Label>
                                        <Input
                                            id="farmName"
                                            placeholder="e.g., Sunrise Maize Plantation"
                                            value={addFarmForm.name}
                                            onChange={(e) => setAddFarmForm({ ...addFarmForm, name: e.target.value })}
                                            className={`${darkMode ? 'bg-[#002f37] border-white/20 text-white placeholder:text-gray-500' : ''} h-12 text-lg`}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="farmLocation" className={darkMode ? 'text-white text-base' : 'text-base'}>Location / Community</Label>
                                            <Select
                                                value={addFarmForm.location}
                                                onValueChange={(val) => setAddFarmForm({ ...addFarmForm, location: val })}
                                            >
                                                <SelectTrigger className={`${darkMode ? 'bg-[#002f37] border-white/20 text-white' : ''} h-12 text-lg`}>
                                                    <SelectValue placeholder="Select community" />
                                                </SelectTrigger>
                                                <SelectContent className={darkMode ? 'bg-[#002f37] border-white/20 text-white' : ''}>
                                                    {availableCommunities.map((comm) => (
                                                        <SelectItem key={comm} value={comm} className={darkMode ? 'focus:bg-emerald-500/20 focus:text-white' : ''}>
                                                            {comm}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mainCrop" className={darkMode ? 'text-white text-base' : 'text-base'}>Main Crop / Livestock</Label>
                                            <Input
                                                id="mainCrop"
                                                placeholder="e.g., Yellow Maize"
                                                value={addFarmForm.crop}
                                                onChange={(e) => setAddFarmForm({ ...addFarmForm, crop: e.target.value })}
                                                className={`${darkMode ? 'bg-[#002f37] border-white/20 text-white placeholder:text-gray-500' : ''} h-12 text-lg`}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={addingFarm}
                                        className="w-full bg-[#7ede56] hover:bg-[#6bc947] text-white h-14 text-xl font-bold mt-4 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]"
                                    >
                                        {addingFarm ? (
                                            <>
                                                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                                Registering...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-6 w-6 mr-2" /> Register Farm
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-8 py-4">
                        <Card className={`mb-8 shadow-lg transition-colors ${darkMode ? 'bg-[#002f37] border-white/10' : 'bg-white border-gray-200'}`}>
                            <CardHeader className="pb-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className={`flex items-center gap-2 text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            <Leaf className="h-6 w-6 text-[#7ede56]" />
                                            Farm: <span className="text-[#7ede56]">{farm.name}</span>
                                        </CardTitle>
                                        <CardDescription className={`mt-2 text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Agricultural cycle tracking in <span className="font-semibold">{farm.location}</span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update Current Stage</span>
                                            <Select value={currentStage} onValueChange={(val) => handleUpdateStage(val)}>
                                                <SelectTrigger className={`h-12 w-full sm:w-56 border-2 border-[#7ede56] ${darkMode ? 'bg-[#002f37] text-white' : 'bg-white'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className={darkMode ? 'bg-[#002f37] border-white/20 text-white' : ''}>
                                                    <SelectItem value="planning">Planning</SelectItem>
                                                    <SelectItem value="planting">Planting</SelectItem>
                                                    <SelectItem value="growing">Growing</SelectItem>
                                                    <SelectItem value="harvesting">Harvesting</SelectItem>
                                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="overflow-x-auto pb-10 pt-4 custom-scrollbar">
                                <div className="relative mt-10 min-w-[700px] px-8">
                                    {/* Connection Line */}
                                    <div className={`absolute top-6 sm:top-7 left-8 right-8 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                        <div
                                            className="h-full bg-gradient-to-r from-[#7ede56] to-[#6bc947] rounded-full transition-all duration-700 ease-in-out"
                                            style={{
                                                width: `${((stages.indexOf(currentStage) + 0.5) / 6) * 100}%`
                                            }}
                                        ></div>
                                    </div>

                                    <div className="relative flex justify-between items-start">
                                        {stages.map((stage, index) => {
                                            const currentIndex = stages.indexOf(currentStage);
                                            const isCompleted = index < currentIndex;
                                            const isCurrent = index === currentIndex;
                                            const isUpcoming = index > currentIndex;

                                            const getStageIcon = () => {
                                                if (isCompleted) {
                                                    return <CheckCircle className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                }
                                                switch (stage) {
                                                    case 'planning': return <FileText className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                    case 'planting': return <Sprout className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                    case 'growing': return <Leaf className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                    case 'harvesting': return <Scissors className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                    case 'maintenance': return <Wrench className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                    case 'other': return <MoreHorizontal className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                    default: return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
                                                }
                                            };

                                            return (
                                                <div key={stage} className="flex flex-col items-center flex-1">
                                                    <div className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-500 scale-100 hover:scale-110 cursor-pointer ${isCompleted
                                                        ? 'bg-[#7ede56] shadow-xl shadow-emerald-500/30'
                                                        : isCurrent
                                                            ? 'bg-[#7ede56] ring-4 ring-emerald-500/20 shadow-xl shadow-emerald-500/40'
                                                            : darkMode ? 'bg-gray-800 border-2 border-white/10' : 'bg-white border-2 border-gray-200'
                                                        }`}>
                                                        {isUpcoming ? (
                                                            <div className={`w-4 h-4 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                                                        ) : (
                                                            getStageIcon()
                                                        )}
                                                    </div>

                                                    <div className="mt-4 text-center">
                                                        <p className={`text-sm sm:text-base font-bold transition-colors ${isCurrent ? 'text-[#7ede56] scale-105' : isCompleted ? (darkMode ? 'text-white' : 'text-gray-800') : (darkMode ? 'text-gray-500' : 'text-gray-400')
                                                            }`}>
                                                            {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                                        </p>
                                                        {isCurrent && (
                                                            <Badge className="bg-[#7ede56] text-white font-bold mt-1 animate-pulse">Active</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`mb-8 transition-all border-none shadow-xl ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
                            <CardHeader className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-100'} pb-0 px-4 sm:px-6`}>
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className={`flex items-center gap-2 text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                <Activity className={`h-6 w-6 sm:h-7 sm:w-7 ${darkMode ? 'text-[#7ede56]' : 'text-emerald-600'}`} />
                                                Activity Log
                                            </CardTitle>
                                            <CardDescription className={`text-sm sm:text-base mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Tracking <span className="font-bold text-emerald-500 uppercase">{activeStageTab}</span> phase
                                            </CardDescription>
                                        </div>
                                        <Button
                                            onClick={openActivityDialog}
                                            size="sm"
                                            className="sm:hidden bg-[#7ede56] hover:bg-[#6bc947] text-white font-bold h-10 px-4 rounded-lg shadow-lg shadow-emerald-500/20"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={openActivityDialog}
                                        className="hidden sm:flex self-end bg-[#7ede56] hover:bg-[#6bc947] text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-emerald-500/20"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Log New Activity
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0 -mb-px">
                                    {stages.map((stage) => {
                                        const isActive = activeStageTab === stage;
                                        const isCurrentStage = currentStage === stage;

                                        return (
                                            <button
                                                key={stage}
                                                onClick={() => setActiveStageTab(stage)}
                                                className={`
                                                relative px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold whitespace-nowrap transition-all rounded-t-xl
                                                ${isActive
                                                        ? `bg-[#7ede56]/10 text-[#7ede56] border-b-4 border-[#7ede56]`
                                                        : `text-gray-400 hover:text-gray-600 dark:hover:text-white border-b-4 border-transparent`
                                                    }
                                            `}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                                    {isCurrentStage && (
                                                        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-ping"></div>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 sm:pt-8 min-h-[400px] px-4 sm:px-6">
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-white/5">
                                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                            <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {activeStageTab.charAt(0).toUpperCase() + activeStageTab.slice(1)} Feed
                                            </h3>
                                            {currentStage === activeStageTab ? (
                                                <Badge className="bg-[#7ede56] text-white px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-sm font-bold uppercase tracking-wider">In Progress</Badge>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateStage(activeStageTab)}
                                                    className={`h-8 px-3 text-xs sm:text-sm font-bold border-2 ${darkMode ? 'border-[#7ede56] text-[#7ede56] hover:bg-[#7ede56]/10' : 'border-[#7ede56] text-[#0b8a62] hover:bg-[#7ede56]/10'}`}
                                                >
                                                    Set Current
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {farm.stageDetails && farm.stageDetails[activeStageTab]?.activities && farm.stageDetails[activeStageTab].activities.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                            {farm.stageDetails[activeStageTab].activities.map((activity: any, index: number) => {
                                                const activityId = activity.id || index;
                                                const activityDate = activity.date ? new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
                                                const activityDescription = activity.description;
                                                const label = typeof activity === 'string' ? activity : (activity.activity || activity.description || 'Activity logged');

                                                return (
                                                    <div
                                                        key={activityId}
                                                        className={`p-4 sm:p-6 rounded-2xl border-l-[6px] transition-all hover:translate-x-1 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}
                                                        style={{ borderLeftColor: getStageColor(activeStageTab).bg }}
                                                    >
                                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-6">
                                                            <div className="flex-1 space-y-3">
                                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                                                    <Badge
                                                                        className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold shadow-md whitespace-normal"
                                                                        style={{ backgroundColor: getStageColor(activeStageTab).bg, color: 'white' }}
                                                                    >
                                                                        {label}
                                                                    </Badge>
                                                                    {activityDate && (
                                                                        <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                                            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                            {activityDate}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {activityDescription && (
                                                                    <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                                        {activityDescription}
                                                                    </p>
                                                                )}
                                                                {activity.resources && (
                                                                    <div className={`flex items-start gap-2 p-3 rounded-xl ${darkMode ? 'bg-black/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                                                                        <Wrench className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 shrink-0" />
                                                                        <p className="text-xs sm:text-sm">
                                                                            <span className="font-bold uppercase text-[10px] block opacity-70">Resources</span>
                                                                            {activity.resources}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {activity.media && activity.media.length > 0 && (
                                                                <div className="flex gap-2 sm:gap-3 flex-wrap lg:max-w-[280px]">
                                                                    {activity.media.map((item: any, i: number) => (
                                                                        <div key={i} className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white/10">
                                                                            {item.type === 'image' ? (
                                                                                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-125" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center bg-gray-900 group-hover:bg-emerald-900 transition-colors">
                                                                                    <Video className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className={`text-center py-12 sm:py-20 border-3 border-dashed rounded-3xl ${darkMode ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-gray-50'}`}>
                                            <Activity className={`h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 opacity-10 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                                            <h4 className={`text-xl sm:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No activity footprint found</h4>
                                            <p className={`text-base sm:text-lg max-w-md mx-auto mb-6 sm:mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Every cycle starts with a single log. Start tracking the <span className="text-emerald-500 font-bold">{activeStageTab}</span> stage progress now.
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={openActivityDialog}
                                                className={`h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-2xl border-2 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all ${darkMode ? 'border-white/20 text-white' : 'border-emerald-500 text-emerald-600'}`}
                                            >
                                                Log First Activity
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Add Activity Dialog Content */}
                        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
                            <DialogContent className={`max-w-4xl w-full p-0 overflow-hidden flex flex-col md:flex-row rounded-3xl border-none ${darkMode ? 'bg-[#002f37] text-white' : 'bg-white shadow-2xl'}`}>
                                <div className="flex-1 p-8 space-y-6 overflow-y-auto max-h-[85vh]">
                                    <DialogHeader className="mb-4">
                                        <DialogTitle className="text-3xl font-black tracking-tighter">Log Stage Activity</DialogTitle>
                                        <DialogDescription className={`text-lg font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                            Recording history for the <span className="uppercase">{activeStageTab}</span> phase
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-6 mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="date" className="text-sm font-bold uppercase tracking-widest opacity-70">Operation Date</Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={newActivity.date}
                                                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                                                    className={`h-12 text-lg font-medium border-2 ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500' : 'bg-gray-50 border-gray-100'}`}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="activity" className="text-sm font-bold uppercase tracking-widest opacity-70">Activity Milestone</Label>
                                                <Input
                                                    id="activity"
                                                    placeholder="e.g., Fertilizer Influx"
                                                    value={newActivity.activity}
                                                    onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
                                                    className={`h-12 text-lg border-2 ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-100'}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest opacity-70">Activity Narrative</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Describe the field work in detail..."
                                                value={newActivity.description}
                                                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                                className={`min-h-[120px] text-lg border-2 leading-relaxed ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-100'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="resources" className="text-sm font-bold uppercase tracking-widest opacity-70">Inputs Used</Label>
                                            <Input
                                                id="resources"
                                                placeholder="e.g., 20kg NPK + 4 Man-hours"
                                                value={newActivity.resources}
                                                onChange={(e) => setNewActivity({ ...newActivity, resources: e.target.value })}
                                                className={`h-12 text-lg border-2 ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-100'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-full md:w-[380px] p-8 border-l flex flex-col ${darkMode ? 'border-white/5 bg-black/20' : 'border-gray-50 bg-gray-50/30'}`}>
                                    <div className="mb-6">
                                        <h4 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Media Evidence</h4>
                                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload visual proof of the field activity</p>
                                    </div>

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                                        flex-1 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all hover:scale-[1.02]
                                        ${darkMode
                                                ? 'border-white/10 bg-white/5 hover:border-emerald-500/50 hover:bg-emerald-50/5'
                                                : 'border-gray-200 bg-white hover:border-emerald-500/50 hover:bg-emerald-50'}
                                    `}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            multiple
                                            accept="image/*,video/*"
                                            className="hidden"
                                        />
                                        <div className={`p-4 rounded-full mb-4 ${darkMode ? 'bg-white/10 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Upload className="h-8 w-8" />
                                        </div>
                                        <p className={`text-base font-bold text-center ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                                            Select Media
                                        </p>
                                        <p className={`text-xs mt-2 text-center opacity-60`}>Supports JPG, PNG, MP4</p>
                                    </div>

                                    <div className="mt-6 space-y-3 h-[180px] overflow-y-auto custom-scrollbar px-2">
                                        {newActivity.media.map((item, index) => (
                                            <div key={index} className={`flex items-center gap-4 p-3 rounded-2xl shadow-sm ${darkMode ? 'bg-white/10' : 'bg-white'}`}>
                                                <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
                                                    {item.type === 'image' ? (
                                                        <img src={item.url} alt="Preview" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Video className="h-6 w-6 text-emerald-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
                                                    <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.type}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeMedia(index)}
                                                    className={`p-2 rounded-xl transition-colors hover:bg-red-500/10 hover:text-red-500 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                                        <Button
                                            onClick={handleSaveActivity}
                                            className="w-full bg-[#7ede56] hover:bg-[#6bc947] text-white font-black h-14 rounded-2xl text-lg shadow-lg shadow-emerald-500/20"
                                            disabled={!newActivity.date || !newActivity.activity || savingActivity}
                                        >
                                            {savingActivity ? 'Syncing...' : 'Commit Activity'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowActivityDialog(false)}
                                            className={`h-12 font-bold rounded-2xl ${darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500'}`}
                                        >
                                            Discard Changes
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FarmJourneyModal;
