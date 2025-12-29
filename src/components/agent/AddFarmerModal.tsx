import React, { useState } from 'react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { createWorker } from 'tesseract.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import FarmMap from '@/components/FarmMap';
import {
    User,
    Sprout,
    FileText,
    Upload,
    Plus,
    X,
    MapPin,
    Camera,
    ChevronRight,
    ChevronLeft,
    UserCheck,
    CheckCircle2,
    Edit,
    Save,
    Coins
} from 'lucide-react';
import { GHANA_REGIONS, GHANA_LANGUAGES, GHANA_COMMUNITIES } from '@/data/ghanaRegions';

interface AddFarmerModalProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
    farmer?: any;
    isEditMode?: boolean;
}

const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ trigger, open, onOpenChange, onSuccess, farmer, isEditMode }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditable, setIsEditable] = useState(!isEditMode);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        gender: '',
        dob: '',
        language: '',
        otherLanguage: '',
        email: '',
        password: '',
        region: '',
        district: '',
        community: '',
        farmType: '',
        farmSize: '',
        yearsOfExperience: '',
        landOwnershipStatus: '',
        cropsGrown: '',
        livestockType: '',
        fieldNotes: '',
        investmentInterest: 'no',
        preferredInvestmentType: '',
        estimatedCapitalNeed: '',
        hasPreviousInvestment: false,
        investmentReadinessScore: 0
    });

    const [manualCommunity, setManualCommunity] = useState('');
    const [idCardFront, setIdCardFront] = useState<string>('');
    const [idCardBack, setIdCardBack] = useState<string>('');
    const [certificationChecked, setCertificationChecked] = useState(false);
    const [idVerificationChecked, setIdVerificationChecked] = useState(false);
    const [ocrProcessing, setOcrProcessing] = useState(false);
    const [ocrData, setOcrData] = useState<{ name?: string; dob?: string } | null>(null);
    const [ocrMismatch, setOcrMismatch] = useState<string[]>([]);
    const [farmLatitude, setFarmLatitude] = useState(0);
    const [farmLongitude, setFarmLongitude] = useState(0);
    const [measuredArea, setMeasuredArea] = useState(0);

    // Initialize form with farmer data if in edit mode
    React.useEffect(() => {
        if (open && farmer && isEditMode) {
            setFormData({
                name: farmer.name || '',
                contact: farmer.contact || '',
                gender: farmer.gender || '',
                dob: farmer.dob ? new Date(farmer.dob).toISOString().split('T')[0] : '',
                language: farmer.language || '',
                otherLanguage: farmer.otherLanguage || '',
                email: farmer.email || '',
                password: '', // Don't show password
                region: farmer.region || '',
                district: farmer.district || '',
                community: farmer.community || '',
                farmType: farmer.farmType || '',
                farmSize: farmer.farmSize?.toString() || '',
                yearsOfExperience: farmer.yearsOfExperience?.toString() || '',
                landOwnershipStatus: farmer.landOwnershipStatus || '',
                cropsGrown: farmer.cropsGrown || '',
                livestockType: farmer.livestockType || '',
                fieldNotes: farmer.fieldNotes || '',
                investmentInterest: farmer.investmentInterest || 'no',
                preferredInvestmentType: farmer.preferredInvestmentType || '',
                estimatedCapitalNeed: farmer.estimatedCapitalNeed?.toString() || '',
                hasPreviousInvestment: farmer.hasPreviousInvestment || false,
                investmentReadinessScore: farmer.investmentReadinessScore || 0
            });

            if (farmer.community && !GHANA_COMMUNITIES[farmer.district]?.includes(farmer.community)) {
                setManualCommunity(farmer.community);
                setFormData(prev => ({ ...prev, community: 'Other (Specify)' }));
            }

            setIdCardFront(farmer.idCardFront || '');
            setIdCardBack(farmer.idCardBack || '');
            setIdVerificationChecked(!!(farmer.idCardFront && farmer.idCardBack));
            setCertificationChecked(true); // Assume already certified if editing
            setStep(1);
            setIsEditable(false);
        } else if (open && !isEditMode) {
            // Reset for new onboarding
            setFormData({
                name: '', contact: '', gender: '', dob: '', language: '', otherLanguage: '', email: '',
                password: '', region: '', district: '', community: '', farmType: '', farmSize: '',
                yearsOfExperience: '', landOwnershipStatus: '', cropsGrown: '', livestockType: '', fieldNotes: '',
                investmentInterest: 'no', preferredInvestmentType: '', estimatedCapitalNeed: '',
                hasPreviousInvestment: false, investmentReadinessScore: 0
            });
            setManualCommunity('');
            setIdCardFront('');
            setIdCardBack('');
            setStep(1);
            setIsEditable(true);
            setIdVerificationChecked(false);
            setCertificationChecked(false);
        }
    }, [open, farmer, isEditMode]);

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            // Don't navigate if user is typing in a textarea or certain inputs
            const activeElement = document.activeElement;
            const isTyping = activeElement instanceof HTMLTextAreaElement ||
                (activeElement instanceof HTMLInputElement && activeElement.type === 'text');

            if (e.key === 'Enter' && !isTyping) {
                e.preventDefault();
                if (step < 4) {
                    setStep(prev => prev + 1);
                } else if (isEditable) {
                    handleSubmit();
                }
            } else if (e.key === 'ArrowRight' && !isTyping) {
                if (step < 4) setStep(prev => prev + 1);
            } else if (e.key === 'ArrowLeft' && !isTyping) {
                if (step > 1) setStep(prev => prev - 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, step, isEditable, formData, manualCommunity, idCardFront, idCardBack, certificationChecked, idVerificationChecked]);

    const processOCR = async (imageData: string) => {
        setOcrProcessing(true);
        setOcrMismatch([]);
        try {
            const worker = await createWorker('eng');
            const { data: { text } } = await worker.recognize(imageData);
            await worker.terminate();

            // Parse Ghana Card data (basic pattern matching)
            const nameMatch = text.match(/(?:Name|NAME)\s*:?\s*([A-Z\s]+)/i);
            const dobMatch = text.match(/(?:Date of Birth|DOB|Birth)\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i);

            const extractedData = {
                name: nameMatch ? nameMatch[1].trim() : undefined,
                dob: dobMatch ? dobMatch[1].trim() : undefined
            };

            setOcrData(extractedData);

            // Compare with form data
            const mismatches: string[] = [];
            if (extractedData.name && formData.name) {
                const similarity = extractedData.name.toLowerCase().includes(formData.name.toLowerCase()) ||
                    formData.name.toLowerCase().includes(extractedData.name.toLowerCase());
                if (!similarity) {
                    mismatches.push('name');
                }
            }

            if (extractedData.dob && formData.dob) {
                // Basic DOB comparison (would need better date parsing in production)
                if (!extractedData.dob.includes(formData.dob.split('-').reverse().join('/'))) {
                    mismatches.push('date of birth');
                }
            }

            if (mismatches.length > 0) {
                setOcrMismatch(mismatches);
                toast.warning(`ID Card mismatch detected in: ${mismatches.join(', ')}. Please verify manually.`);
            } else if (extractedData.name || extractedData.dob) {
                toast.success('ID Card information matches form data!');
                setIdVerificationChecked(true); // Auto-check verification
            }
        } catch (error) {
            console.error('OCR Error:', error);
            toast.error('Could not read ID card. Please verify manually.');
        } finally {
            setOcrProcessing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (type === 'front') {
                    setIdCardFront(base64String);
                    // Process OCR on front of card
                    processOCR(base64String);
                } else {
                    setIdCardBack(base64String);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        if (field === 'region') {
            // Reset district, community and language, and manual community when region changes
            setFormData(prev => ({ ...prev, region: value, district: '', community: '', language: '' }));
            setManualCommunity('');
        } else if (field === 'district') {
            // Reset community when district changes
            setFormData(prev => ({ ...prev, district: value, community: '' }));
            setManualCommunity('');
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        // Validation checks
        if (!certificationChecked) {
            toast.error('Please certify the verification of farmer information');
            return;
        }

        if (!idVerificationChecked) {
            toast.error('Please confirm that ID card details match the provided information');
            return;
        }

        if (!idCardFront || !idCardBack) {
            toast.error('Please upload both sides of the Ghana Card');
            return;
        }

        // Required field validation
        const requiredFields = {
            'Full Name': formData.name,
            'Phone Number': formData.contact,
            'Gender': formData.gender,
            'Date of Birth': formData.dob,
            'Region': formData.region,
            'District': formData.district,
            'Community': formData.community === 'Other (Specify)' ? manualCommunity : formData.community,
            'Farm Type': formData.farmType,
            'Password': formData.password
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            toast.error(`Missing required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Farm type specific validation
        if (formData.farmType === 'crop' && !formData.cropsGrown) {
            toast.error('Please specify the major crops grown');
            return;
        }

        if (formData.farmType === 'livestock' && !formData.livestockType) {
            toast.error('Please specify the livestock type');
            return;
        }

        setIsSubmitting(true);
        try {
            const finalCommunity = formData.community === 'Other (Specify)' ? manualCommunity : formData.community;
            const payload = {
                ...formData,
                community: finalCommunity,
                farmSize: Number(formData.farmSize),
                estimatedCapitalNeed: formData.estimatedCapitalNeed ? Number(formData.estimatedCapitalNeed) : 0,
                investmentReadinessScore: Number(formData.investmentReadinessScore),
                idCardFront,
                idCardBack,
                status: 'active'
            };

            if (isEditMode && farmer?._id) {
                await api.put(`/farmers/${farmer._id}`, payload);
                toast.success('Farmer profile updated successfully!');
            } else {
                await api.post('/farmers', payload);
                toast.success('Farmer onboarded successfully!');
            }
            onSuccess?.(); // Refresh dashboard
            onOpenChange?.(false);
            // Reset form
            setFormData({
                name: '', contact: '', gender: '', dob: '', language: '', otherLanguage: '', email: '',
                password: '', region: '', district: '', community: '', farmType: '', farmSize: '',
                yearsOfExperience: '', landOwnershipStatus: '', cropsGrown: '', livestockType: '', fieldNotes: '',
                investmentInterest: 'no', preferredInvestmentType: '', estimatedCapitalNeed: '',
                hasPreviousInvestment: false, investmentReadinessScore: 0
            });
            setManualCommunity('');
            setIdCardFront('');
            setIdCardBack('');
            setStep(1);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create farmer account');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-4xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-[#002f37] border-none overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl z-[150]">
                {/* Header with Progress Bar */}
                <div className="relative pt-6 px-6 pb-2 border-b dark:border-gray-800">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
                                <Plus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold dark:text-white">
                                    {isEditMode ? 'Edit Grower Profile' : 'Grower Onboarding'}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                                    {isEditMode ? 'Update information for an existing farmer.' : 'Directly register a new farmer into the system.'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-800'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                                <UserCheck className="h-4 w-4" />
                                Personal Details
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Full Name *</Label>
                                    <Input
                                        placeholder="Enter grower's full name"
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Phone Number *</Label>
                                    <Input
                                        placeholder="+233 XX XXX XXXX"
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        value={formData.contact}
                                        onChange={(e) => handleInputChange('contact', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Gender *</Label>
                                    <Select value={formData.gender} onValueChange={(val) => handleInputChange('gender', val)} disabled={!isEditable}>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000]">
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Date of Birth *</Label>
                                    <Input
                                        type="date"
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        value={formData.dob}
                                        onChange={(e) => handleInputChange('dob', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Email Address (Optional)</Label>
                                    <Input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Set Temporary Password *</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        disabled={!isEditable && !isEditMode}
                                    />
                                    <p className="text-[10px] text-gray-400">Farmer will be prompted to change this on first login</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Farm Information */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                                <MapPin className="h-4 w-4" />
                                Farm & Location Info
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Region *</Label>
                                    <Select value={formData.region} onValueChange={(val) => handleInputChange('region', val)} disabled={!isEditable}>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000]">
                                            {Object.keys(GHANA_REGIONS).map(region => (
                                                <SelectItem key={region} value={region}>{region}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">District *</Label>
                                    <Select
                                        value={formData.district}
                                        onValueChange={(val) => handleInputChange('district', val)}
                                        disabled={!formData.region || !isEditable}
                                    >
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 disabled:opacity-50">
                                            <SelectValue placeholder={formData.region ? "Select district" : "Select region first"} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000]">
                                            {formData.region && GHANA_REGIONS[formData.region]?.map(district => (
                                                <SelectItem key={district} value={district}>{district}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Community *</Label>
                                    <Select
                                        value={formData.community}
                                        onValueChange={(val) => handleInputChange('community', val)}
                                        disabled={!formData.district || !isEditable}
                                    >
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 disabled:opacity-50">
                                            <SelectValue placeholder={formData.district ? "Select community" : "Select district first"} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000]">
                                            {formData.district && GHANA_COMMUNITIES[formData.district]?.map(community => (
                                                <SelectItem key={community} value={community}>{community}</SelectItem>
                                            ))}
                                            {/* Fallback for districts not in the list yet, though we added them */}
                                            {formData.district && !GHANA_COMMUNITIES[formData.district] && (
                                                <SelectItem value="Other (Specify)">Other (Specify)</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formData.community === 'Other (Specify)' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label className="text-xs font-bold uppercase text-gray-500">Specify Community Name *</Label>
                                        <Input
                                            placeholder="Enter community name"
                                            className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                            value={manualCommunity}
                                            onChange={(e) => setManualCommunity(e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Preferred Language</Label>
                                    <Select
                                        value={formData.language}
                                        onValueChange={(val) => handleInputChange('language', val)}
                                        disabled={!formData.region || !isEditable}
                                    >
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 disabled:opacity-50">
                                            <SelectValue placeholder={formData.region ? "Select language" : "Select region first"} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000]">
                                            {formData.region && GHANA_LANGUAGES[formData.region]?.map(lang => (
                                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Other Languages</Label>
                                    <Input
                                        placeholder="E.g. French, Hausa"
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        value={formData.otherLanguage}
                                        onChange={(e) => handleInputChange('otherLanguage', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-gray-500">Farm Type *</Label>
                                        <Select value={formData.farmType} onValueChange={(val) => handleInputChange('farmType', val)} disabled={!isEditable}>
                                            <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                                <SelectValue placeholder="Select farm type" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[2000]">
                                                <SelectItem value="crop">Crop Farming</SelectItem>
                                                <SelectItem value="livestock">Livestock Farming</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {formData.farmType === 'crop' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label className="text-xs font-bold uppercase text-gray-500">Major Crops Grown *</Label>
                                            <Input
                                                placeholder="E.g., Maize, Cocoa, Cassava"
                                                className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                                value={formData.cropsGrown}
                                                onChange={(e) => handleInputChange('cropsGrown', e.target.value)}
                                                disabled={!isEditable}
                                            />
                                        </div>
                                    )}
                                    {formData.farmType === 'livestock' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label className="text-xs font-bold uppercase text-gray-500">Livestock Types *</Label>
                                            <Input
                                                placeholder="E.g., Poultry, Cattle, Goats"
                                                className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                                value={formData.livestockType}
                                                onChange={(e) => handleInputChange('livestockType', e.target.value)}
                                                disabled={!isEditable}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Years of Experience</Label>
                                    <Input
                                        type="number"
                                        placeholder="E.g., 5"
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        value={formData.yearsOfExperience}
                                        onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Land Ownership Status *</Label>
                                    <Select value={formData.landOwnershipStatus} onValueChange={(val) => handleInputChange('landOwnershipStatus', val)} disabled={!isEditable}>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="Select ownership status" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000]">
                                            <SelectItem value="owned">Own Land</SelectItem>
                                            <SelectItem value="leased">Leased Land</SelectItem>
                                            <SelectItem value="shared">Shared / Family Land</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Farm Size ({formData.farmType === 'livestock' ? 'N/A' : 'Acres'}) *</Label>
                                    <Input
                                        type="number"
                                        placeholder={formData.farmType === 'livestock' ? "Not applicable for livestock" : "e.g. 5"}
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 disabled:opacity-50"
                                        value={formData.farmSize}
                                        onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                        disabled={formData.farmType === 'livestock' || !isEditable}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-gray-500">Interactive Location Mapping</Label>
                                <FarmMap
                                    latitude={farmLatitude}
                                    longitude={farmLongitude}
                                    onLocationChange={(lat, lng) => {
                                        if (isEditable) {
                                            setFarmLatitude(lat);
                                            setFarmLongitude(lng);
                                        }
                                    }}
                                    onAreaChange={(area) => {
                                        if (isEditable) {
                                            setMeasuredArea(area);
                                            if (formData.farmType === 'crop') {
                                                setFormData({ ...formData, farmSize: area.toFixed(2) });
                                            }
                                        }
                                    }}
                                    farmSize={measuredArea}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Investment & Financials */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                                <Coins className="h-4 w-4" />
                                Investment & Financials
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Investment Interest *</Label>
                                    <Select value={formData.investmentInterest} onValueChange={(val) => handleInputChange('investmentInterest', val)} disabled={!isEditable}>
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="Select interest level" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000]">
                                            <SelectItem value="yes">Yes, very interested</SelectItem>
                                            <SelectItem value="maybe">Maybe / Needs more info</SelectItem>
                                            <SelectItem value="no">No, not at this time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Preferred Investment Type</Label>
                                    <Select
                                        value={formData.preferredInvestmentType}
                                        onValueChange={(val) => handleInputChange('preferredInvestmentType', val)}
                                        disabled={formData.investmentInterest === 'no' || !isEditable}
                                    >
                                        <SelectTrigger className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 disabled:opacity-50">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000]">
                                            <SelectItem value="inputs">Farm Inputs (Seeds, Fertilizer)</SelectItem>
                                            <SelectItem value="cash">Direct Cash Injection</SelectItem>
                                            <SelectItem value="equipment">Farm Equipment / Machinery</SelectItem>
                                            <SelectItem value="partnership">Joint Venture Partnership</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Estimated Capital Need (GHS)</Label>
                                    <Input
                                        type="number"
                                        placeholder="E.g., 5000"
                                        className="h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 disabled:opacity-50"
                                        value={formData.estimatedCapitalNeed}
                                        onChange={(e) => handleInputChange('estimatedCapitalNeed', e.target.value)}
                                        disabled={formData.investmentInterest === 'no' || !isEditable}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500">Investment Readiness Score (0-100)</Label>
                                    <div className="flex items-center gap-4 h-11 px-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md">
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            className="flex-1"
                                            value={formData.investmentReadinessScore}
                                            onChange={(e) => handleInputChange('investmentReadinessScore', parseInt(e.target.value))}
                                            disabled={!isEditable}
                                        />
                                        <span className="text-sm font-bold w-12 text-center text-emerald-600">
                                            {formData.investmentReadinessScore}%
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-3">
                                    <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${formData.hasPreviousInvestment ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'}`}>
                                        <Checkbox
                                            id="hasPreviousInvestment"
                                            className="mt-1"
                                            checked={formData.hasPreviousInvestment}
                                            onCheckedChange={(checked) => handleInputChange('hasPreviousInvestment', checked as boolean)}
                                            disabled={!isEditable}
                                        />
                                        <div className="space-y-1">
                                            <Label htmlFor="hasPreviousInvestment" className="text-sm font-bold cursor-pointer dark:text-gray-200">
                                                Previous Investment History
                                            </Label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Check if this farmer has previously received or successfully repaid any agricultural investment or loan.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Documents & Final Review */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                                <FileText className="h-4 w-4" />
                                Documents & Final Review
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-gray-500">Ghana Card (Front) *</Label>
                                        <label className={`block p-4 border-2 border-dashed ${idCardFront ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5'} rounded-2xl cursor-pointer transition-all`}>
                                            <div className="flex flex-col items-center justify-center text-center min-h-[140px]">
                                                {idCardFront ? (
                                                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                                        <img src={idCardFront} alt="Front Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <CheckCircle2 className="h-8 w-8 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                                        <span className="text-xs font-medium text-gray-500">Click to Upload Front Side</span>
                                                        <span className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                                                    </>
                                                )}
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, 'front')}
                                                disabled={!isEditable}
                                            />
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-gray-500">Ghana Card (Back) *</Label>
                                        <label className={`block p-4 border-2 border-dashed ${idCardBack ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5'} rounded-2xl cursor-pointer transition-all`}>
                                            <div className="flex flex-col items-center justify-center text-center min-h-[140px]">
                                                {idCardBack ? (
                                                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                                        <img src={idCardBack} alt="Back Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <CheckCircle2 className="h-8 w-8 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                                        <span className="text-xs font-medium text-gray-500">Click to Upload Back Side</span>
                                                        <span className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                                                    </>
                                                )}
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, 'back')}
                                                disabled={!isEditable}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Enter any additional notes about the farm visit..."
                                        className="min-h-[100px] bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                        value={formData.fieldNotes}
                                        onChange={(e) => handleInputChange('fieldNotes', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                                        <Checkbox
                                            id="idVerification"
                                            className="mt-1"
                                            checked={idVerificationChecked}
                                            onCheckedChange={(checked) => setIdVerificationChecked(checked as boolean)}
                                            disabled={!isEditable}
                                        />
                                        <Label htmlFor="idVerification" className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed cursor-pointer">
                                            <span className="font-bold">ID Verification:</span> I confirm that the personal information (name, date of birth) on the Ghana Card matches the details provided in this form.
                                        </Label>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                        <Checkbox
                                            id="certification"
                                            className="mt-1"
                                            checked={certificationChecked}
                                            onCheckedChange={(checked) => setCertificationChecked(checked as boolean)}
                                            disabled={!isEditable}
                                        />
                                        <Label htmlFor="certification" className="text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed cursor-pointer">
                                            <span className="font-bold">Field Certification:</span> I certify that I have verified the location and identity of this grower according to AgriLync's field protocols. All provided data is accurate to the best of my knowledge.
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="p-6 border-t dark:border-gray-800 bg-gray-50 dark:bg-[#0b2528] flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={step === 1 ? () => onOpenChange?.(false) : prevStep}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        disabled={isSubmitting}
                    >
                        {step === 1 ? <X className="h-4 w-4 mr-2" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                        {step === 1 ? 'Cancel' : 'Previous'}
                    </Button>

                    <div className="flex items-center gap-2">
                        {isEditMode && !isEditable && (
                            <Button
                                onClick={() => setIsEditable(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-blue-600/20"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Enable Editing
                            </Button>
                        )}
                        {step < 4 ? (
                            <Button
                                onClick={nextStep}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-emerald-600/20"
                            >
                                {isEditMode ? 'Continue' : 'Continue'}
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isEditable}
                                className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-emerald-600/20 ${isEditable && !isSubmitting ? 'animate-pulse' : ''} disabled:opacity-50`}
                            >
                                {isSubmitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        {isEditMode ? (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Complete Registration
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddFarmerModal;
