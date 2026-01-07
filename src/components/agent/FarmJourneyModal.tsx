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
    Plus, Edit, Activity, Upload, X, Video, Clock, Heart, TrendingUp, ShoppingCart, Users
} from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
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
        additionalField1?: string;
        additionalField2?: string;
        media: Array<{ type: 'image' | 'video'; url: string; name: string }>;
    }>({
        date: new Date().toISOString().split('T')[0],
        activity: '',
        description: '',
        resources: '',
        additionalField1: '',
        additionalField2: '',
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

    // Determine farm type from farmer's farmType field
    const farmType = farmer?.farmType?.toLowerCase() || 'crop';
    const isLivestock = farmType === 'livestock';

    // Define stages based on farm type
    const cropStages = ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'];
    const livestockStages = ['planning', 'acquisition', 'rearing', 'health', 'production', 'marketing', 'maintenance', 'other'];
    const stages = isLivestock ? livestockStages : cropStages;

    // Get stage-specific form configuration
    const getStageFormConfig = (stage: string) => {
        if (isLivestock) {
            switch (stage) {
                case 'planning':
                    return {
                        activityLabel: 'Activity Type',
                        activityPlaceholder: 'e.g., Infrastructure Setup, Equipment Purchase',
                        descriptionPlaceholder: 'Describe the farm setup, infrastructure plans, and equipment requirements...',
                        resourcesLabel: 'Resources/Equipment',
                        resourcesPlaceholder: 'e.g., Building materials, feeders, water systems',
                        additionalFields: [
                            { label: 'Infrastructure Type', placeholder: 'e.g., Housing, Fencing, Storage', key: 'additionalField1' },
                            { label: 'Estimated Cost', placeholder: 'e.g., GHS 5,000', key: 'additionalField2' }
                        ]
                    };
                case 'acquisition':
                    return {
                        activityLabel: 'Acquisition Activity',
                        activityPlaceholder: 'e.g., Animal Purchase, Breeding Stock Selection',
                        descriptionPlaceholder: 'Describe the animals acquired, source, quantity, and health status...',
                        resourcesLabel: 'Resources Used',
                        resourcesPlaceholder: 'e.g., Transportation, Health certificates, Purchase documents',
                        additionalFields: [
                            { label: 'Animal Count', placeholder: 'e.g., 50 birds, 10 goats', key: 'additionalField1' },
                            { label: 'Source/Supplier', placeholder: 'e.g., Farm XYZ, Market ABC', key: 'additionalField2' }
                        ]
                    };
                case 'rearing':
                    return {
                        activityLabel: 'Rearing Activity',
                        activityPlaceholder: 'e.g., Feeding, Growth Monitoring, Housing Management',
                        descriptionPlaceholder: 'Describe feeding schedules, growth progress, housing conditions...',
                        resourcesLabel: 'Feeds/Supplies',
                        resourcesPlaceholder: 'e.g., 50kg feed, supplements, bedding materials',
                        additionalFields: [
                            { label: 'Feed Type & Quantity', placeholder: 'e.g., Starter feed 25kg, Water 100L', key: 'additionalField1' },
                            { label: 'Growth Metrics', placeholder: 'e.g., Average weight, Health status', key: 'additionalField2' }
                        ]
                    };
                case 'health':
                    return {
                        activityLabel: 'Health Activity',
                        activityPlaceholder: 'e.g., Vaccination, Treatment, Veterinary Visit',
                        descriptionPlaceholder: 'Describe health interventions, treatments, and veterinary consultations...',
                        resourcesLabel: 'Medications/Supplies',
                        resourcesPlaceholder: 'e.g., Vaccines, Medicines, Veterinary services',
                        additionalFields: [
                            { label: 'Health Issue/Treatment', placeholder: 'e.g., Disease prevention, Wound care', key: 'additionalField1' },
                            { label: 'Animals Treated', placeholder: 'e.g., 25 birds vaccinated, 5 goats treated', key: 'additionalField2' }
                        ]
                    };
                case 'production':
                    return {
                        activityLabel: 'Production Activity',
                        activityPlaceholder: 'e.g., Milk Collection, Egg Collection, Breeding Record',
                        descriptionPlaceholder: 'Describe production activities, yields, and breeding records...',
                        resourcesLabel: 'Equipment/Tools',
                        resourcesPlaceholder: 'e.g., Milking machines, Collection trays, Breeding records',
                        additionalFields: [
                            { label: 'Production Quantity', placeholder: 'e.g., 50 liters milk, 120 eggs', key: 'additionalField1' },
                            { label: 'Quality Notes', placeholder: 'e.g., Grade A, Fresh, Good quality', key: 'additionalField2' }
                        ]
                    };
                case 'marketing':
                    return {
                        activityLabel: 'Marketing Activity',
                        activityPlaceholder: 'e.g., Sale Transaction, Customer Visit, Market Analysis',
                        descriptionPlaceholder: 'Describe sales activities, customer interactions, and market trends...',
                        resourcesLabel: 'Sales Resources',
                        resourcesPlaceholder: 'e.g., Transportation, Packaging, Marketing materials',
                        additionalFields: [
                            { label: 'Sales Quantity & Price', placeholder: 'e.g., 30 birds @ GHS 25 each', key: 'additionalField1' },
                            { label: 'Customer/Market', placeholder: 'e.g., Local market, Retailer XYZ', key: 'additionalField2' }
                        ]
                    };
                case 'maintenance':
                    return {
                        activityLabel: 'Maintenance Activity',
                        activityPlaceholder: 'e.g., Equipment Repair, Facility Maintenance, Infrastructure Upgrade',
                        descriptionPlaceholder: 'Describe maintenance work, repairs, and facility improvements...',
                        resourcesLabel: 'Materials/Tools',
                        resourcesPlaceholder: 'e.g., Repair materials, Tools, Replacement parts',
                        additionalFields: [
                            { label: 'Maintenance Type', placeholder: 'e.g., Preventive, Corrective, Upgrade', key: 'additionalField1' },
                            { label: 'Equipment/Facility', placeholder: 'e.g., Housing structure, Feeding equipment', key: 'additionalField2' }
                        ]
                    };
                default: // other
                    return {
                        activityLabel: 'Activity Type',
                        activityPlaceholder: 'e.g., Special Activity',
                        descriptionPlaceholder: 'Describe the activity in detail...',
                        resourcesLabel: 'Resources Used',
                        resourcesPlaceholder: 'e.g., Materials, Tools, Supplies',
                        additionalFields: []
                    };
            }
        } else {
            // Crop farming
            switch (stage) {
                case 'planning':
                    return {
                        activityLabel: 'Planning Activity',
                        activityPlaceholder: 'e.g., Farm Setup, Equipment Purchase, Land Preparation Planning',
                        descriptionPlaceholder: 'Describe your farm planning activities, equipment needs, and preparation steps...',
                        resourcesLabel: 'Resources/Equipment',
                        resourcesPlaceholder: 'e.g., Tools, Equipment, Planning materials',
                        additionalFields: [
                            { label: 'Equipment Type', placeholder: 'e.g., Plow, Tractor, Irrigation system', key: 'additionalField1' },
                            { label: 'Land Area', placeholder: 'e.g., 5 acres, 2 hectares', key: 'additionalField2' }
                        ]
                    };
                case 'planting':
                    return {
                        activityLabel: 'Planting Activity',
                        activityPlaceholder: 'e.g., Seed Sowing, Transplanting, Spacing Setup',
                        descriptionPlaceholder: 'Describe planting methods, seed varieties, spacing, and planting techniques...',
                        resourcesLabel: 'Seeds/Inputs',
                        resourcesPlaceholder: 'e.g., 50kg seeds, Planting tools, Fertilizer',
                        additionalFields: [
                            { label: 'Seed Type & Quantity', placeholder: 'e.g., Maize seeds 50kg, Tomato seeds 200g', key: 'additionalField1' },
                            { label: 'Planting Method', placeholder: 'e.g., Direct sowing, Transplanting, Spacing', key: 'additionalField2' }
                        ]
                    };
                case 'growing':
                    return {
                        activityLabel: 'Growing Activity',
                        activityPlaceholder: 'e.g., Fertilizer Application, Irrigation, Pest Control, Weeding',
                        descriptionPlaceholder: 'Describe crop care activities, growth progress, and management practices...',
                        resourcesLabel: 'Inputs Used',
                        resourcesPlaceholder: 'e.g., NPK fertilizer 20kg, Pesticides, Water',
                        additionalFields: [
                            { label: 'Input Type & Quantity', placeholder: 'e.g., NPK 20kg, Organic pesticide 5L', key: 'additionalField1' },
                            { label: 'Growth Stage', placeholder: 'e.g., Seedling, Vegetative, Flowering', key: 'additionalField2' }
                        ]
                    };
                case 'harvesting':
                    return {
                        activityLabel: 'Harvesting Activity',
                        activityPlaceholder: 'e.g., Crop Harvest, Post-Harvest Handling, Storage',
                        descriptionPlaceholder: 'Describe harvesting methods, yield, post-harvest processing, and storage...',
                        resourcesLabel: 'Harvest Tools/Storage',
                        resourcesPlaceholder: 'e.g., Harvesting tools, Storage bags, Processing equipment',
                        additionalFields: [
                            { label: 'Harvest Quantity', placeholder: 'e.g., 500kg maize, 200kg tomatoes', key: 'additionalField1' },
                            { label: 'Harvest Method', placeholder: 'e.g., Manual, Mechanical, Quality grade', key: 'additionalField2' }
                        ]
                    };
                case 'maintenance':
                    return {
                        activityLabel: 'Maintenance Activity',
                        activityPlaceholder: 'e.g., Equipment Repair, Infrastructure Maintenance, Soil Management',
                        descriptionPlaceholder: 'Describe maintenance work, repairs, and farm improvements...',
                        resourcesLabel: 'Materials/Tools',
                        resourcesPlaceholder: 'e.g., Repair materials, Tools, Maintenance supplies',
                        additionalFields: [
                            { label: 'Maintenance Type', placeholder: 'e.g., Equipment repair, Soil treatment', key: 'additionalField1' },
                            { label: 'Area/Equipment', placeholder: 'e.g., Irrigation system, Farm infrastructure', key: 'additionalField2' }
                        ]
                    };
                default: // other
                    return {
                        activityLabel: 'Activity Type',
                        activityPlaceholder: 'e.g., Special Activity',
                        descriptionPlaceholder: 'Describe the activity in detail...',
                        resourcesLabel: 'Resources Used',
                        resourcesPlaceholder: 'e.g., Materials, Tools, Supplies',
                        additionalFields: []
                    };
            }
        }
    };

    const stageConfig = getStageFormConfig(activeStageTab);

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
            await Swal.fire({
                icon: 'success',
                title: 'Stage Updated!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                            Farm stage updated to <strong>${newStage.charAt(0).toUpperCase() + newStage.slice(1)}</strong>
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#7ede56',
                timer: 2000,
                timerProgressBar: true
            });
        } catch (error) {
            console.error("Failed to update stage:", error);
            toast.error("Failed to update farm stage.");
        }
    };

    const handleCloseActivityDialog = () => {
        setNewActivity({ 
            date: new Date().toISOString().split('T')[0], 
            activity: '', 
            description: '', 
            resources: '', 
            additionalField1: '',
            additionalField2: '',
            media: [] 
        });
        setShowActivityDialog(false);
    };

    const handleSaveActivity = async () => {
        if (!newActivity.date || !newActivity.activity || !farm) return;

        setSavingActivity(true);
        try {
            const activityId = Date.now().toString();
            const activity: any = {
                id: activityId,
                date: newActivity.date,
                activity: newActivity.activity,
                description: newActivity.description,
                resources: newActivity.resources,
                media: newActivity.media
            };
            
            // Add additional fields if they exist
            if (newActivity.additionalField1) {
                activity.additionalField1 = newActivity.additionalField1;
            }
            if (newActivity.additionalField2) {
                activity.additionalField2 = newActivity.additionalField2;
            }

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
            await Swal.fire({
                icon: 'success',
                title: 'Activity Logged!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                            Activity logged successfully!
                        </p>
                    </div>
                `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#7ede56',
                timer: 2000,
                timerProgressBar: true
            });
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
            // Initialize stage details based on farm type
            const farmerFarmType = farmer?.farmType?.toLowerCase() || 'crop';
            const isFarmerLivestock = farmerFarmType === 'livestock';
            const defaultStages = isFarmerLivestock 
                ? ['planning', 'acquisition', 'rearing', 'health', 'production', 'marketing', 'maintenance', 'other']
                : ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'];
            
            const initialStageDetails: any = {};
            defaultStages.forEach(stage => {
                initialStageDetails[stage] = { date: '', notes: '', status: 'pending', activities: [] };
            });

            const farmData = {
                name: addFarmForm.name,
                location: addFarmForm.location,
                crop: addFarmForm.crop,
                farmer: farmer?._id || farmer?.id,
                status: 'verified',
                currentStage: 'planning',
                stageDetails: initialStageDetails
            };

            const res = await api.post('/farms', farmData);
            setFarm(res.data);
            setCurrentStage('planning');
            setActiveStageTab('planning');
            await Swal.fire({
                icon: 'success',
                title: 'Farm Registered!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                            Farm registered successfully! You can now track the journey.
                        </p>
                    </div>
                `,
                confirmButtonText: 'Start Tracking',
                confirmButtonColor: '#7ede56',
                timer: 2500,
                timerProgressBar: true
            });
        } catch (error) {
            console.error("Failed to add farm:", error);
            toast.error("Failed to register farm. Please try again.");
        } finally {
            setAddingFarm(false);
        }
    };

    const openActivityDialog = () => {
        setNewActivity({ 
            date: new Date().toISOString().split('T')[0], 
            activity: '', 
            description: '', 
            resources: '', 
            additionalField1: '',
            additionalField2: '',
            media: [] 
        });
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
        if (isLivestock) {
            switch (stage) {
                case 'planning': return { bg: '#7ede56', textOnLight: '#0f5132', textOnDark: '#ffffff' };
                case 'acquisition': return { bg: '#3b82f6', textOnLight: '#1e40af', textOnDark: '#ffffff' };
                case 'rearing': return { bg: '#8b5cf6', textOnLight: '#5b21b6', textOnDark: '#ffffff' };
                case 'health': return { bg: '#ef4444', textOnLight: '#991b1b', textOnDark: '#ffffff' };
                case 'production': return { bg: '#10b981', textOnLight: '#065f46', textOnDark: '#ffffff' };
                case 'marketing': return { bg: '#f59e0b', textOnLight: '#92400e', textOnDark: '#ffffff' };
                case 'maintenance': return { bg: '#5fd646', textOnLight: '#0f5132', textOnDark: '#ffffff' };
                case 'other': return { bg: '#ffb547', textOnLight: '#8a4a00', textOnDark: '#ffffff' };
                default: return { bg: '#6b7280', textOnLight: '#374151', textOnDark: '#ffffff' };
            }
        } else {
            switch (stage) {
                case 'planning': return { bg: '#7ede56', textOnLight: '#0f5132', textOnDark: '#ffffff' };
                case 'planting': return { bg: '#ffa500', textOnLight: '#8a4a00', textOnDark: '#ffffff' };
                case 'growing': return { bg: '#ff6347', textOnLight: '#7c1f0a', textOnDark: '#ffffff' };
                case 'harvesting': return { bg: '#921573', textOnLight: '#5e0e4a', textOnDark: '#ffffff' };
                case 'maintenance': return { bg: '#5fd646', textOnLight: '#0f5132', textOnDark: '#ffffff' };
                case 'other': return { bg: '#ffb547', textOnLight: '#8a4a00', textOnDark: '#ffffff' };
                default: return { bg: '#6b7280', textOnLight: '#374151', textOnDark: '#ffffff' };
            }
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
            <DialogContent className={`max-w-6xl w-[95vw] sm:w-full max-h-[95vh] overflow-y-auto ${darkMode ? 'bg-[#002f37] border-white/10' : 'bg-white'}`}>
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
                                                    {stages.map((stage) => (
                                                        <SelectItem key={stage} value={stage}>
                                                            {stage === 'acquisition' ? 'Acquisition' :
                                                             stage === 'rearing' ? 'Rearing' :
                                                             stage === 'health' ? 'Health Management' :
                                                             stage === 'production' ? 'Production' :
                                                             stage === 'marketing' ? 'Marketing/Sales' :
                                                             stage === 'planting' ? 'Planting' :
                                                             stage === 'growing' ? 'Growing' :
                                                             stage === 'harvesting' ? 'Harvesting' :
                                                             stage.charAt(0).toUpperCase() + stage.slice(1)}
                                                        </SelectItem>
                                                    ))}
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
                                                width: `${((stages.indexOf(currentStage) + 0.5) / stages.length) * 100}%`
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
                                                if (isLivestock) {
                                                    switch (stage) {
                                                        case 'planning': return <FileText className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'acquisition': return <Users className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'rearing': return <Leaf className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'health': return <Heart className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'production': return <TrendingUp className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'marketing': return <ShoppingCart className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'maintenance': return <Wrench className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'other': return <MoreHorizontal className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        default: return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
                                                    }
                                                } else {
                                                    switch (stage) {
                                                        case 'planning': return <FileText className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'planting': return <Sprout className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'growing': return <Leaf className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'harvesting': return <Scissors className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'maintenance': return <Wrench className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        case 'other': return <MoreHorizontal className="h-5 w-5 sm:h-7 sm:w-7 text-white" />;
                                                        default: return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
                                                    }
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
                                                            {stage === 'acquisition' ? 'Acquisition' :
                                                             stage === 'rearing' ? 'Rearing' :
                                                             stage === 'health' ? 'Health' :
                                                             stage === 'production' ? 'Production' :
                                                             stage === 'marketing' ? 'Marketing' :
                                                             stage.charAt(0).toUpperCase() + stage.slice(1)}
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
                                                    {stage === 'acquisition' ? 'Acquisition' :
                                                     stage === 'rearing' ? 'Rearing' :
                                                     stage === 'health' ? 'Health' :
                                                     stage === 'production' ? 'Production' :
                                                     stage === 'marketing' ? 'Marketing' :
                                                     stage.charAt(0).toUpperCase() + stage.slice(1)}
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
                            <DialogContent className={`max-w-5xl w-[95vw] sm:w-full p-0 overflow-hidden flex flex-col lg:flex-row rounded-2xl sm:rounded-3xl border-none ${darkMode ? 'bg-[#002f37] text-white' : 'bg-white shadow-2xl'}`}>
                                <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[85vh]">
                                    <DialogHeader className="mb-2 sm:mb-4">
                                        <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter">Log Stage Activity</DialogTitle>
                                        <DialogDescription className={`text-sm sm:text-base lg:text-lg font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                            Recording history for the <span className="uppercase font-bold">{activeStageTab}</span> phase
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
                                        {/* Date and Activity Type */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="date" className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70">Operation Date</Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={newActivity.date}
                                                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                                                    className={`h-10 sm:h-12 text-sm sm:text-base lg:text-lg font-medium border-2 ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500' : 'bg-gray-50 border-gray-100'}`}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="activity" className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70">{stageConfig.activityLabel}</Label>
                                                <Input
                                                    id="activity"
                                                    placeholder={stageConfig.activityPlaceholder}
                                                    value={newActivity.activity}
                                                    onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
                                                    className={`h-10 sm:h-12 text-sm sm:text-base lg:text-lg border-2 ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-100'}`}
                                                />
                                            </div>
                                        </div>

                                        {/* Additional Fields based on stage */}
                                        {stageConfig.additionalFields && stageConfig.additionalFields.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                {stageConfig.additionalFields.map((field: { label: string; placeholder: string; key: string }, index: number) => (
                                                    <div key={index} className="space-y-2">
                                                        <Label htmlFor={field.key} className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70">{field.label}</Label>
                                                        <Input
                                                            id={field.key}
                                                            placeholder={field.placeholder}
                                                            value={(newActivity[field.key as keyof typeof newActivity] as string) || ''}
                                                            onChange={(e) => setNewActivity({ ...newActivity, [field.key]: e.target.value })}
                                                            className={`h-10 sm:h-12 text-sm sm:text-base lg:text-lg border-2 ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-100'}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70">Activity Narrative</Label>
                                            <Textarea
                                                id="description"
                                                placeholder={stageConfig.descriptionPlaceholder}
                                                value={newActivity.description}
                                                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                                className={`min-h-[100px] sm:min-h-[120px] text-sm sm:text-base lg:text-lg border-2 leading-relaxed ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-100'}`}
                                            />
                                        </div>

                                        {/* Resources */}
                                        <div className="space-y-2">
                                            <Label htmlFor="resources" className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-70">{stageConfig.resourcesLabel}</Label>
                                            <Input
                                                id="resources"
                                                placeholder={stageConfig.resourcesPlaceholder}
                                                value={newActivity.resources}
                                                onChange={(e) => setNewActivity({ ...newActivity, resources: e.target.value })}
                                                className={`h-10 sm:h-12 text-sm sm:text-base lg:text-lg border-2 ${darkMode ? 'bg-black/20 border-white/10 focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-100'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-full lg:w-[380px] p-4 sm:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l flex flex-col ${darkMode ? 'border-white/5 bg-black/20' : 'border-gray-50 bg-gray-50/30'}`}>
                                    <div className="mb-4 sm:mb-6">
                                        <h4 className={`text-lg sm:text-xl font-black mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Media Evidence</h4>
                                        <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload visual proof of the field activity</p>
                                    </div>

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                                        flex-1 border-4 border-dashed rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 cursor-pointer transition-all hover:scale-[1.02] min-h-[150px] sm:min-h-[180px]
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
                                        <div className={`p-3 sm:p-4 rounded-full mb-3 sm:mb-4 ${darkMode ? 'bg-white/10 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
                                        </div>
                                        <p className={`text-sm sm:text-base font-bold text-center ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                                            Select Media
                                        </p>
                                        <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 text-center opacity-60`}>Supports JPG, PNG, MP4</p>
                                    </div>

                                    {newActivity.media.length > 0 && (
                                        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 max-h-[150px] sm:max-h-[180px] overflow-y-auto custom-scrollbar px-1 sm:px-2">
                                            {newActivity.media.map((item, index) => (
                                                <div key={index} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm ${darkMode ? 'bg-white/10' : 'bg-white'}`}>
                                                    <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-lg sm:rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
                                                        {item.type === 'image' ? (
                                                            <img src={item.url} alt="Preview" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Video className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs sm:text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
                                                        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.type}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeMedia(index)}
                                                        className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors hover:bg-red-500/10 hover:text-red-500 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}
                                                    >
                                                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex flex-col gap-2 sm:gap-3">
                                        <Button
                                            onClick={handleSaveActivity}
                                            className="w-full bg-[#7ede56] hover:bg-[#6bc947] text-white font-black h-12 sm:h-14 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg shadow-lg shadow-emerald-500/20"
                                            disabled={!newActivity.date || !newActivity.activity || savingActivity}
                                        >
                                            {savingActivity ? (
                                                <>
                                                    <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                    Syncing...
                                                </>
                                            ) : (
                                                'Commit Activity'
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowActivityDialog(false)}
                                            className={`h-10 sm:h-12 font-bold rounded-xl sm:rounded-2xl text-sm sm:text-base ${darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500'}`}
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
