import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
import { createWorker } from 'tesseract.js';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import FarmMap from '@/components/FarmMap';
import FarmerIdCardModal from './FarmerIdCardModal';
import { Badge } from '@/components/ui/badge';
import {
    User, Sprout, FileText, X, MapPin, Camera,
    ChevronRight, ChevronLeft, UserCheck, Loader2,
    Leaf, CheckCircle2, Edit, Coins, ShieldCheck, Activity,
    Globe, Mail, Layers, Briefcase as FarmIcon
} from 'lucide-react';
import { GHANA_REGIONS, GHANA_LANGUAGES, GHANA_COMMUNITIES, getRegionKey } from '@/data/ghanaRegions';

const TRAINING_MODULES = [
    { id: 'soil_crop', title: 'Soil & Crop Management' },
    { id: 'financial_lit', title: 'Financial Literacy & Record Keeping' },
    { id: 'market_access', title: 'Market Access & Pricing' },
    { id: 'sustainable_farming', title: 'Sustainable Farming Practices' },
    { id: 'climate_smart', title: 'Climate Smart Agriculture' },
    { id: 'farmpartner_orientation', title: 'FarmPartner Investment Orientation' },
];

interface AddFarmerModalProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
    farmer?: any;
    isEditMode?: boolean;
}

const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ trigger, open, onOpenChange, onSuccess, farmer, isEditMode }) => {
    const { agent } = useAuth();

    // Pre-compute a flat, unique, sorted list of languages for the language selector
    const getLanguagesForRegion = (region: string): string[] => {
        const regionLangs = GHANA_LANGUAGES[region];
        if (Array.isArray(regionLangs)) return [...new Set(regionLangs)].sort();
        const all = Object.values(GHANA_LANGUAGES).flat();
        return [...new Set(all)].sort();
    };
    const [step, setStep] = useState(1);
    const [isEditable, setIsEditable] = useState(true);

    const emptyForm = {
        name: '', contact: '', gender: '', dob: '', language: '', otherLanguage: '',
        email: '', password: '', region: getRegionKey(agent?.region), district: '',
        community: '', farmType: '', farmSize: '', yearsOfExperience: '',
        landOwnershipStatus: '', cropsGrown: '', livestockType: '', fieldNotes: '',
        investmentInterest: 'no', preferredInvestmentType: '', estimatedCapitalNeed: '',
        hasPreviousInvestment: false, investmentReadinessScore: 0,
        otherGender: '', otherDistrict: '', ghanaCardNumber: ''
    };

    const [formData, setFormData] = useState(emptyForm);
    const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [manualCommunity, setManualCommunity] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [idCardFront, setIdCardFront] = useState('');
    const [idCardBack, setIdCardBack] = useState('');
    const [certificationChecked, setCertificationChecked] = useState(false);
    const [idVerificationChecked, setIdVerificationChecked] = useState(false);
    const [ocrProcessing, setOcrProcessing] = useState(false);
    const [ocrData, setOcrData] = useState<{ name?: string; dob?: string } | null>(null);
    const [ocrMismatch, setOcrMismatch] = useState<string[]>([]);
    const [farmLatitude, setFarmLatitude] = useState(0);
    const [farmLongitude, setFarmLongitude] = useState(0);
    const [measuredArea, setMeasuredArea] = useState(0);
    const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
    const [finalizedFarmer, setFinalizedFarmer] = useState<any>(null);
    const [trainingModules, setTrainingModules] = useState(
        TRAINING_MODULES.map(m => ({ ...m, completed: false }))
    );

    const toggleModule = (id: string) => {
        if (!isEditable) return;
        setTrainingModules(prev => prev.map(m => 
            m.id === id ? { ...m, completed: !m.completed } : m
        ));
    };

    React.useEffect(() => {
        if (certificationChecked && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setGpsLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
                () => console.log('Location not granted')
            );
        }
    }, [certificationChecked]);

    React.useEffect(() => {
        if (open && farmer && isEditMode) {
            try {
                setFormData({
                    name: farmer.name || '', contact: farmer.contact || '', gender: farmer.gender || '',
                    dob: farmer.dob ? (farmer.dob.includes('T') ? new Date(farmer.dob).toISOString().split('T')[0] : farmer.dob.split('T')[0]) : '',
                    language: farmer.language || '', otherLanguage: farmer.otherLanguage || '',
                    email: farmer.email || '', password: '',
                    region: getRegionKey(farmer.region || agent?.region),
                    district: farmer.district || '', community: farmer.community || '',
                    farmType: farmer.farmType || '', farmSize: farmer.farmSize?.toString() || '',
                    yearsOfExperience: farmer.yearsOfExperience?.toString() || '',
                    landOwnershipStatus: farmer.landOwnershipStatus || '', cropsGrown: farmer.cropsGrown || '',
                    livestockType: farmer.livestockType || '', fieldNotes: farmer.fieldNotes || '',
                    investmentInterest: farmer.investmentInterest || 'no',
                    preferredInvestmentType: farmer.preferredInvestmentType || '',
                    estimatedCapitalNeed: farmer.estimatedCapitalNeed?.toString() || '',
                    hasPreviousInvestment: farmer.hasPreviousInvestment || false,
                    investmentReadinessScore: farmer.investmentReadinessScore || 0,
                    otherGender: farmer.otherGender || '', otherDistrict: farmer.otherDistrict || '',
                    ghanaCardNumber: farmer.ghanaCardNumber || ''
                });
                if (farmer.community && !GHANA_COMMUNITIES[farmer.district]?.includes(farmer.community)) {
                    setManualCommunity(farmer.community);
                    setFormData(prev => ({ ...prev, community: 'Other (Specify)' }));
                } else {
                    setManualCommunity('');
                }
                setProfilePicture(farmer.profilePicture || '');
                setIdCardFront(farmer.idCardFront || '');
                setIdCardBack(farmer.idCardBack || '');
                setIdVerificationChecked(!!(farmer.idCardFront && farmer.idCardBack));
                setCertificationChecked(true);
                setOcrMismatch([]);
                setOcrData(null);
                setStep(1);
                setIsEditable(false);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Load Failed',
                    text: 'Error loading farmer profile for editing. Refined data might be missing.',
                    confirmButtonColor: '#002f37'
                });
            }
        } else if ((open || !trigger) && !isEditMode) {
            setFormData({ ...emptyForm, region: getRegionKey(agent?.region) });
            setManualCommunity('');
            setProfilePicture('');
            setIdCardFront('');
            setIdCardBack('');
            setOcrMismatch([]);
            setOcrData(null);
            setStep(1);
            setIsEditable(true);
            setIdVerificationChecked(false);
            setCertificationChecked(false);
        }
    }, [open, farmer, isEditMode, agent, trigger]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;
            const activeEl = document.activeElement;
            const isTyping = activeEl instanceof HTMLTextAreaElement ||
                (activeEl instanceof HTMLInputElement && activeEl.type === 'text');
            if (e.key === 'Enter' && !isTyping) {
                e.preventDefault();
                if (step < 4) setStep(prev => prev + 1);
                else if (isEditable) handleSubmit();
            } else if (e.key === 'ArrowRight' && !isTyping) {
                if (step < 4) setStep(prev => prev + 1);
            } else if (e.key === 'ArrowLeft' && !isTyping) {
                if (step > 1) setStep(prev => prev - 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, step, isEditable]);

    const processOCR = async (imageData: string) => {
        setOcrProcessing(true);
        setOcrMismatch([]);
        try {
            const worker = await createWorker('eng');
            const { data: { text } } = await worker.recognize(imageData);
            await worker.terminate();

            const nameMatch = text.match(/(?:Name|NAME)\s*:?\s*([A-Z\s]+)/i);
            const dobMatch = text.match(/(?:Date of Birth|DOB|Birth)\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i);
            const idNumberMatch = text.match(/(?:GHA-\d{9}-\d)/);

            const extractedData = {
                name: nameMatch ? nameMatch[1].trim() : undefined,
                dob: dobMatch ? dobMatch[1].trim() : undefined,
                idNumber: idNumberMatch ? idNumberMatch[0] : undefined
            };
            setOcrData(extractedData as any);

            const mismatches: string[] = [];
            const normalizeName = (n: string) => n.toLowerCase().trim().replace(/\s+/g, ' ');

            if (extractedData.name && formData.name) {
                const extractedWords = normalizeName(extractedData.name).split(' ');
                const formWords = normalizeName(formData.name).split(' ');
                const matchingWords = extractedWords.filter(w => formWords.some(fw => fw.includes(w) || w.includes(fw)));
                if (matchingWords.length / Math.max(extractedWords.length, formWords.length) < 0.7) {
                    mismatches.push('name');
                }
            }
            if (extractedData.idNumber && formData.ghanaCardNumber && extractedData.idNumber !== formData.ghanaCardNumber) {
                mismatches.push('ID number');
            }

            if (mismatches.length > 0) {
                setOcrMismatch(mismatches);
                setIdVerificationChecked(false);
                Swal.fire({ icon: 'error', title: 'Ghana Card Validation Failed', text: `Mismatch in: ${mismatches.join(', ')}`, confirmButtonColor: '#ef4444' });
            } else if (extractedData.name || extractedData.dob) {
                setOcrMismatch([]);
                setIdVerificationChecked(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Ghana card OCR verification completed successfully!',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'warning',
                title: 'OCR Scan Failed',
                text: 'Could not read card data. Manual verification will be required.',
                confirmButtonColor: '#002f37'
            });
        } finally {
            setOcrProcessing(false);
        }
    };

    const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } }
                else { if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; } }
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'profile') => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { 
            Swal.fire({ icon: 'error', title: 'File Too Large', text: 'Maximum upload size is 5MB. Please choose a smaller image.', confirmButtonColor: '#002f37' });
            return; 
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const compressed = await compressImage(reader.result as string);
                if (type === 'front') { setIdCardFront(compressed); processOCR(compressed); }
                else if (type === 'back') setIdCardBack(compressed);
                else setProfilePicture(compressed);
            } catch { 
                Swal.fire({ icon: 'error', title: 'Processing Error', text: 'Failed to optimize image for upload.', confirmButtonColor: '#002f37' });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (field: string, value: any) => {
        if (field === 'region') {
            setFormData(prev => ({ ...prev, region: value, district: '', community: '', language: '' }));
            setManualCommunity('');
        } else if (field === 'district') {
            setFormData(prev => ({ ...prev, district: value, community: '' }));
            setManualCommunity('');
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const queryClient = useQueryClient();

    const addFarmerMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (isEditMode && farmer?._id) return api.put(`/farmers/${farmer._id}`, payload);
            return api.post('/farmers', payload);
        },
        onSuccess: async (response: any) => {
            const savedFarmer = response.data;
            const lyncId = savedFarmer?.id || savedFarmer?.ghanaCardNumber || 'N/A';
            await Swal.fire({
                icon: 'success', title: 'Onboarding Finalized',
                html: `<p style="font-size:18px;color:#065f46;font-weight:800;">${isEditMode ? 'Farmer profile updated!' : 'Farmer onboarded successfully!'}</p><p style="font-family:monospace;font-size:22px;font-weight:900;color:#064e3b;">Lync ID: ${lyncId}</p>`,
                confirmButtonText: 'Continue', confirmButtonColor: '#065f46', timer: 3000, timerProgressBar: true
            });
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            queryClient.invalidateQueries({ queryKey: ['agentFarmers'] });
            queryClient.invalidateQueries({ queryKey: ['farmers'] });
            setFinalizedFarmer(savedFarmer);
            setIsIdCardModalOpen(true);
            onOpenChange?.(false);
            setFormData({ ...emptyForm, region: getRegionKey(agent?.region) });
            setManualCommunity(''); setIdCardFront(''); setIdCardBack(''); setStep(1);
        },
        onError: (error: any) => {
            console.error('Add/Edit Farmer Error:', error.response?.data);
            Swal.fire({
                icon: 'error',
                title: 'Transaction Failed',
                text: error.response?.data?.msg || error.response?.data?.message || 'Failed to complete grower registration',
                confirmButtonColor: '#002f37'
            });
        }
    });

    const isSubmitting = addFarmerMutation.isPending;

    const handleSubmit = async () => {
        if (!certificationChecked) {
            Swal.fire({ icon: 'error', title: 'Action Required', text: 'Please certify the verification of farmer information', confirmButtonColor: '#002f37' });
            return;
        }
        if (!idCardFront || !idCardBack) {
            Swal.fire({ icon: 'error', title: 'Missing Documentation', text: 'Please upload both sides of the Ghana Card', confirmButtonColor: '#002f37' });
            return;
        }
        if (!isEditMode && ocrMismatch.length > 0) {
            Swal.fire({ icon: 'error', title: 'Cannot Proceed', text: `Mismatch in: ${ocrMismatch.join(', ')}. Please correct before submitting.`, confirmButtonColor: '#ef4444' });
            return;
        }
        if (!idVerificationChecked) {
            Swal.fire({ icon: 'error', title: 'Validation Pending', text: 'Please confirm the ID verification checkbox', confirmButtonColor: '#002f37' });
            return;
        }

        const requiredFields: Record<string, any> = {
            'Full Name': formData.name, 'Phone Number': formData.contact,
            'Gender': formData.gender === 'other' ? formData.otherGender : formData.gender,
            'Date of Birth': formData.dob, 'Ghana Card Number': formData.ghanaCardNumber,
            'Region': formData.region, 'District': formData.district === 'other' ? formData.otherDistrict : formData.district,
            'Community': formData.community === 'Other (Specify)' ? manualCommunity : formData.community,
            'Farm Type': formData.farmType, 'Experience Portfolio': formData.yearsOfExperience,
        };
        const missingFields = Object.entries(requiredFields).filter(([_, v]) => !v).map(([k]) => k);
        if (missingFields.length > 0) {
            Swal.fire({ icon: 'error', title: 'Incomplete Data', text: `Please fill required fields: ${missingFields.join(', ')}`, confirmButtonColor: '#002f37' });
            return;
        }

        const ghanaCardRegex = /^GHA-\d{9}-\d$/;
        if (!ghanaCardRegex.test(formData.ghanaCardNumber)) {
            Swal.fire({ icon: 'error', title: 'Identity Format Error', text: 'Invalid Ghana Card format. Expected: GHA-XXXXXXXXX-X', confirmButtonColor: '#002f37' });
            return;
        }

        let tempPassword = formData.password;
        if (!isEditMode && !tempPassword) {
            tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        }

        const finalCommunity = formData.community === 'Other (Specify)' ? manualCommunity : formData.community;
        const payload: any = {
            ...formData,
            gender: formData.gender === 'other' ? formData.otherGender : formData.gender,
            district: formData.district === 'other' ? formData.otherDistrict : formData.district,
            password: !isEditMode ? tempPassword : undefined,
            community: finalCommunity,
            farmSize: Number(formData.farmSize),
            yearsOfExperience: Number(formData.yearsOfExperience),
            estimatedCapitalNeed: formData.estimatedCapitalNeed ? Number(formData.estimatedCapitalNeed) : 0,
            investmentReadinessScore: Number(formData.investmentReadinessScore),
            verificationConfirmed: certificationChecked,
            gpsLocation, profilePicture, idCardFront, idCardBack, status: 'active',
            trainingModules: trainingModules.filter(m => m.completed).map(m => m.id)
        };
        if (isEditMode) delete payload.password;
        addFarmerMutation.mutate(payload);
    };

    const steps = [
        { id: 1, label: 'Identify', sub: 'Bio & personal info', icon: User },
        { id: 2, label: 'Operation', sub: 'Farm location details', icon: Sprout },
        { id: 3, label: 'Capital', sub: 'Investment & financials', icon: Coins },
        { id: 4, label: 'Validate', sub: 'Documents & review', icon: FileText }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-[1400px] w-[98vw] md:w-[95vw] h-[95vh] md:h-[85vh] p-0 overflow-hidden border-none bg-[#f4f7f9] shadow-2xl z-[150] [&>button]:hidden">
                <div className="sr-only">
                    <DialogTitle>{isEditMode ? 'Grower Profile Update' : 'New Grower Registration'}</DialogTitle>
                    <DialogDescription>{isEditMode ? 'Editing existing grower profile' : 'Form for onboarding a new grower'}</DialogDescription>
                </div>

                <div className="flex h-full w-full overflow-hidden">
                    {/* ── LEFT SIDEBAR ── */}
                    <div className="hidden lg:flex w-72 shrink-0 bg-white border-r border-gray-200 flex-col pt-8">
                        <div className="px-8 pb-8 border-b border-gray-100 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-[#002f37] flex items-center justify-center text-[#7ede56] shadow-lg">
                                    <Leaf className="h-6 w-6" />
                                </div>
                                <span className="font-extrabold text-[15px] text-[#002f37] tracking-tight">AgriLync Ops</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Command Center</p>
                        </div>

                        <div className="flex-1 px-4 space-y-2">
                            {steps.map((s) => {
                                const isActive = step === s.id;
                                const isDone = step > s.id;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setStep(s.id)}
                                        className={`w-full flex items-center gap-4 py-4 px-6 rounded-2xl transition-all ${isActive ? 'bg-[#002f37]/5 text-[#002f37]' : 'text-gray-400 hover:bg-gray-50'}`}
                                    >
                                        <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-black text-sm transition-colors ${isActive ? 'bg-[#002f37] text-white shadow-md' : isDone ? 'bg-[#7ede56] text-[#002f37]' : 'bg-gray-100 text-gray-400'}`}>
                                            {isDone ? <CheckCircle2 className="h-5 w-5" /> : s.id}
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[13px] font-black tracking-tight ${isActive ? 'text-[#002f37]' : 'text-gray-500'}`}>{s.label}</p>
                                            <p className="text-[10px] font-bold text-gray-400 leading-none">{s.sub}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-8 bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-[#7ede56] animate-pulse" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Active</span>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT CONTENT ── */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
                        {/* Top bar */}
                        <div className="bg-[#002f37] text-white py-4 px-4 md:px-10 flex items-center justify-between shadow-md shrink-0">
                            <div className="flex items-center gap-6">
                                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                                    {isEditMode ? 'Edit Grower Profile' : 'New Grower Onboarding'}
                                </h2>
                                <div className="hidden md:flex items-center gap-2">
                                    {steps.map((s, idx) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setStep(s.id)}
                                            className={`px-4 py-1.5 rounded-full text-[10.5px] font-black uppercase tracking-widest transition-all ${step === s.id ? 'bg-[#7ede56] text-[#002f37] shadow-lg scale-105' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => onOpenChange?.(false)}
                                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all text-white/60"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Step breadcrumb */}
                        <div className="bg-white border-b border-gray-200 px-4 md:px-10 py-4 flex items-center gap-2 flex-wrap shrink-0">
                            <span className="text-[10px] font-black text-[#002f37]/40 uppercase tracking-widest leading-none mt-1 hidden sm:inline">Operational Phase</span>
                            <ChevronRight className="h-3 w-3 text-gray-300 hidden sm:inline" />
                            <span className="text-[10px] font-black text-[#065f46] uppercase tracking-widest leading-none mt-1 hidden sm:inline">{steps[step - 1].label}</span>
                            <div className="w-full sm:w-auto sm:ml-auto">
                                <h3 className="text-lg md:text-xl font-black text-[#002f37] tracking-tight">{steps[step - 1].label}: <span className="text-gray-400 font-bold">{steps[step - 1].sub}</span></h3>
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <ScrollArea className="flex-1">
                            <div className="p-4 md:p-10 max-w-[1050px] mx-auto space-y-8">

                                {/* ── STEP 1: IDENTITY ── */}
                                {step === 1 && (
                                    <div className="step-wrapper">
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                                            <div className="bg-[#002f37] text-white px-6 py-4 rounded-t-3xl flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                                                    <User className="h-5 w-5 text-[#7ede56]" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black uppercase tracking-widest block">Step 01 / Identity</span>
                                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Bio & Personal Identification</p>
                                                </div>
                                            </div>
                                            <div className="bg-white border border-gray-200 border-t-0 p-6 md:p-10 rounded-b-3xl shadow-sm">
                                                <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
                                                    <Label className="text-[11px] font-black uppercase text-[#002f37]/60 tracking-widest mb-4">Profile Photo</Label>
                                                    <label className={`relative cursor-pointer group ${!isEditable ? 'pointer-events-none' : ''}`}>
                                                        <div className="h-28 w-28 rounded-full border-4 border-dashed border-gray-200 group-hover:border-[#7ede56] transition-colors overflow-hidden bg-gray-50 flex items-center justify-center shadow-inner">
                                                            {profilePicture
                                                                ? <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                                : <div className="flex flex-col items-center gap-1 text-gray-300 group-hover:text-[#7ede56] transition-colors">
                                                                    <Camera className="h-8 w-8" />
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-center">Upload or<br/>Snap</span>
                                                                  </div>
                                                            }
                                                        </div>
                                                        {isEditable && (
                                                            <div className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#002f37] border-2 border-white flex items-center justify-center shadow-lg group-hover:bg-[#7ede56] transition-colors" title="Select File or Take Photo">
                                                                <Camera className="h-4 w-4 text-white group-hover:text-[#002f37] transition-colors" />
                                                            </div>
                                                        )}
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'profile')} disabled={!isEditable} />
                                                    </label>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37]/60 tracking-widest">Grower Full Name</Label>
                                                        <Input placeholder="Legal name" className="h-14 bg-gray-50 border-none rounded-xl font-bold" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37]/60 tracking-widest">Phone Number</Label>
                                                        <Input placeholder="+233 XX XXX XXX" className="h-14 bg-gray-50 border-none rounded-xl font-bold" value={formData.contact} onChange={(e) => handleInputChange('contact', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37]/60 tracking-widest">Preferred Language</Label>
                                                        <Select value={formData.language} onValueChange={(v) => handleInputChange('language', v)} disabled={!isEditable}>
                                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/20"><SelectValue placeholder="Select Language" /></SelectTrigger>
                                                            <SelectContent className="max-h-[300px] rounded-2xl border-none shadow-2xl">
                                                                {getLanguagesForRegion(formData.region).map(lang => (
                                                                    <SelectItem key={lang} value={lang} className="py-3 font-bold">{lang}</SelectItem>
                                                                ))}
                                                                <SelectItem value="Other" className="py-3 font-bold text-[#065f46]">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37]/60 tracking-widest">Email Address (Optional)</Label>
                                                        <Input placeholder="farmer@example.com" type="email" className="h-14 bg-gray-50 border-none rounded-xl font-bold" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-8 border-t border-gray-100">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Gender</Label>
                                                        <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)} disabled={!isEditable}>
                                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/20"><SelectValue placeholder="Gender" /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                                <SelectItem value="male" className="py-3 font-bold">Male</SelectItem>
                                                                <SelectItem value="female" className="py-3 font-bold">Female</SelectItem>
                                                                <SelectItem value="other" className="py-3 font-bold">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Birth Date</Label>
                                                        <Input type="date" className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/20" value={formData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest font-mono">Ghana Card *</Label>
                                                        <Input placeholder="GHA-XXXX-X" className="h-14 bg-gray-50 border-none rounded-xl font-mono tracking-widest text-[#002f37] font-black placeholder:text-gray-300 transition-all focus:ring-2 focus:ring-emerald-500/20" value={formData.ghanaCardNumber} onChange={(e) => handleInputChange('ghanaCardNumber', e.target.value.toUpperCase())} disabled={!isEditable} onPaste={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 2: OPERATION ── */}
                                {step === 2 && (
                                    <div className="step-wrapper">
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                                            <div className="bg-[#002f37] text-white px-6 py-4 rounded-t-3xl flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                                                    <Sprout className="h-5 w-5 text-[#7ede56]" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black uppercase tracking-widest block">Step 02 / Operation</span>
                                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Asset & Farm Location Details</p>
                                                </div>
                                            </div>
                                            <div className="bg-white border border-gray-200 border-t-0 p-6 md:p-10 rounded-b-3xl shadow-sm space-y-8">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Region</Label>
                                                        <Input disabled className="h-14 bg-gray-50 border-none rounded-xl font-black text-gray-700" value={formData.region} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">District</Label>
                                                        <Select value={formData.district} onValueChange={(v) => handleInputChange('district', v)} disabled={!isEditable}>
                                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/20"><SelectValue placeholder="District" /></SelectTrigger>
                                                            <SelectContent className="max-h-[300px] rounded-2xl border-none shadow-2xl">
                                                                {formData.region && GHANA_REGIONS[formData.region]?.map(d => (
                                                                    <SelectItem key={d} value={d} className="py-3 font-bold">{d}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Community</Label>
                                                        <Select value={formData.community} onValueChange={(v) => handleInputChange('community', v)} disabled={!isEditable}>
                                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/20"><SelectValue placeholder="Community" /></SelectTrigger>
                                                            <SelectContent className="max-h-[300px] rounded-2xl border-none shadow-2xl">
                                                                {formData.district && GHANA_COMMUNITIES[formData.district]?.map(c => (
                                                                    <SelectItem key={c} value={c} className="py-3 font-bold">{c}</SelectItem>
                                                                ))}
                                                                <SelectItem value="Other (Specify)" className="py-3 font-bold text-[#065f46]">Other (Specify)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {formData.community === 'Other (Specify)' && (
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Specify Community</Label>
                                                        <Input placeholder="Enter community name" className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 placeholder:text-gray-400" value={manualCommunity} onChange={(e) => setManualCommunity(e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 border-t border-gray-100 pt-8">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Experience (Years)</Label>
                                                        <Input type="number" placeholder="Years of farming" className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 placeholder:text-gray-400" value={formData.yearsOfExperience} onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Primary Farm Type</Label>
                                                        <Select value={formData.farmType} onValueChange={(v) => handleInputChange('farmType', v)} disabled={!isEditable}>
                                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/20"><SelectValue placeholder="Farm Focus" /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                                <SelectItem value="crop" className="py-3 font-bold">Crop Only</SelectItem>
                                                                <SelectItem value="livestock" className="py-3 font-bold">Livestock Only</SelectItem>
                                                                <SelectItem value="mixed" className="py-3 font-bold">Mixed Farming</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 border-gray-100">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Land Ownership Status</Label>
                                                        <Select value={formData.landOwnershipStatus} onValueChange={(v) => handleInputChange('landOwnershipStatus', v)} disabled={!isEditable}>
                                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/20"><SelectValue placeholder="Ownership Status" /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                                <SelectItem value="owned" className="py-3 font-bold">Personal / Family Owned</SelectItem>
                                                                <SelectItem value="leased" className="py-3 font-bold">Leased / Rented</SelectItem>
                                                                <SelectItem value="sharecropped" className="py-3 font-bold">Sharecropped</SelectItem>
                                                                <SelectItem value="communal" className="py-3 font-bold">Communal Title</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Estimated Acreage</Label>
                                                        <Input type="number" step="0.1" placeholder="Farm size in acres" className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 placeholder:text-gray-400" value={formData.farmSize} onChange={(e) => handleInputChange('farmSize', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                </div>

                                                {(formData.farmType === 'crop' || formData.farmType === 'mixed') && (
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest font-inter">Crops Currently Under Production</Label>
                                                        <Input placeholder="e.g. Maize, Cocoa, Yam, Rice..." className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 placeholder:text-gray-400" value={formData.cropsGrown} onChange={(e) => handleInputChange('cropsGrown', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                )}

                                                {(formData.farmType === 'livestock' || formData.farmType === 'mixed') && (
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest font-inter">Livestock Inventory</Label>
                                                        <Input placeholder="e.g. Poultry (50), Pigs (10), Cattle (5)..." className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 placeholder:text-gray-400" value={formData.livestockType} onChange={(e) => handleInputChange('livestockType', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                )}

                                                <div className="relative rounded-3xl overflow-hidden border-2 border-gray-100 h-[380px]">
                                                    <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 flex items-center gap-3">
                                                        <div className="h-7 w-7 rounded-lg bg-[#002f37] flex items-center justify-center text-[#7ede56]">
                                                            <MapPin className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Geo-Capture Active</p>
                                                            <p className="text-xs font-black text-[#002f37]">Verified Perimeter</p>
                                                        </div>
                                                    </div>
                                                    <FarmMap
                                                        latitude={farmLatitude}
                                                        longitude={farmLongitude}
                                                        onLocationChange={(lat, lng) => { if (isEditable) { setFarmLatitude(lat); setFarmLongitude(lng); } }}
                                                        onAreaChange={(area) => { if (isEditable) { setMeasuredArea(area); if (formData.farmType === 'crop') setFormData(fd => ({ ...fd, farmSize: area.toFixed(2) })); } }}
                                                        farmSize={measuredArea}
                                                    />
                                                    <div className="absolute bottom-4 right-4 z-10 bg-[#002f37] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4">
                                                        <div className="text-right border-r border-white/10 pr-4">
                                                            <p className="text-[8px] font-black text-[#7ede56] uppercase tracking-widest">Captured Area</p>
                                                            <p className="text-xl font-black">{measuredArea.toFixed(2)} <span className="text-[10px] opacity-40 font-bold">acres</span></p>
                                                        </div>
                                                        <Activity className="h-5 w-5 text-[#7ede56]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 3: CAPITAL ── */}
                                {step === 3 && (
                                    <div className="step-wrapper">
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                                            <div className="bg-[#002f37] text-white px-6 py-4 rounded-t-3xl flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                                                    <Coins className="h-5 w-5 text-[#7ede56]" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black uppercase tracking-widest block">Step 03 / Capital</span>
                                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Financial & Strategic Analysis</p>
                                                </div>
                                            </div>
                                            <div className="bg-white border border-gray-200 border-t-0 p-6 md:p-10 rounded-b-3xl shadow-sm space-y-10">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                                                    <div className="space-y-4">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Investment Interest</Label>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {['yes', 'maybe', 'no'].map(opt => (
                                                                <button
                                                                    key={opt}
                                                                    onClick={() => isEditable && handleInputChange('investmentInterest', opt)}
                                                                    className={`h-14 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${formData.investmentInterest === opt ? 'bg-[#002f37] border-[#002f37] text-white shadow-xl' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'}`}
                                                                >
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1 text-[#002f37]">Capital Requirement (GHS)</Label>
                                                        <div className="relative group">
                                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">₵</div>
                                                            <Input type="number" placeholder="0.00" className="h-14 pl-12 bg-gray-50 border-none rounded-xl font-black text-xl text-gray-900 placeholder:text-gray-300 transition-all focus:ring-2 focus:ring-emerald-500/20" value={formData.estimatedCapitalNeed} onChange={(e) => handleInputChange('estimatedCapitalNeed', e.target.value)} disabled={formData.investmentInterest === 'no' || !isEditable} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Primary Investment Objective</Label>
                                                        <Select 
                                                            value={formData.preferredInvestmentType} 
                                                            onValueChange={(v) => handleInputChange('preferredInvestmentType', v)} 
                                                            disabled={formData.investmentInterest === 'no' || !isEditable}
                                                        >
                                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-xl font-bold text-gray-900 transition-all focus:ring-2 focus:ring-emerald-500/20"><SelectValue placeholder="Select Purpose" /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                                <SelectItem value="inputs" className="py-3 font-bold">Farm Inputs (Seeds, Fertilizer, Agro-chem)</SelectItem>
                                                                <SelectItem value="mechanization" className="py-3 font-bold">Mechanization & Equipment</SelectItem>
                                                                <SelectItem value="irrigation" className="py-3 font-bold">Irrigation Systems</SelectItem>
                                                                <SelectItem value="infrastructure" className="py-3 font-bold">Storage & Processing Infrastructure</SelectItem>
                                                                <SelectItem value="working_capital" className="py-3 font-bold">General Working Capital</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <h4 className="text-sm font-black text-[#002f37] uppercase tracking-tight">Market Readiness Index</h4>
                                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Risk evaluation score</p>
                                                        </div>
                                                        <span className="text-3xl font-black text-[#065f46]">{formData.investmentReadinessScore}%</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0" max="100" step="5"
                                                        className="w-full h-2 bg-gray-200 rounded-full appearance-none accent-[#7ede56] cursor-pointer"
                                                        value={formData.investmentReadinessScore}
                                                        onChange={(e) => isEditable && handleInputChange('investmentReadinessScore', parseInt(e.target.value))}
                                                        disabled={!isEditable}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between px-2">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Training Progress & Certification</Label>
                                                        <span className="text-[10px] font-bold text-[#065f46] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                                            {trainingModules.filter(m => m.completed).length} / {trainingModules.length} Modules
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {trainingModules.map((module) => (
                                                            <button
                                                                key={module.id}
                                                                type="button"
                                                                onClick={() => toggleModule(module.id)}
                                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${module.completed ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                                            >
                                                                <span className={`text-[11px] font-bold uppercase leading-tight ${module.completed ? 'text-emerald-900' : 'text-gray-500'}`}>
                                                                    {module.title}
                                                                </span>
                                                                <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${module.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 bg-gray-50 text-transparent'}`}>
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => isEditable && handleInputChange('hasPreviousInvestment', !formData.hasPreviousInvestment)}
                                                    className={`w-full p-8 rounded-3xl border-2 transition-all flex items-center justify-between ${formData.hasPreviousInvestment ? 'bg-[#002f37] border-[#002f37] text-white shadow-2xl' : 'bg-white border-gray-200 text-gray-800 hover:border-[#7ede56]'}`}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`h-14 w-14 rounded-3xl flex items-center justify-center ${formData.hasPreviousInvestment ? 'bg-[#7ede56] text-[#002f37]' : 'bg-gray-100 text-gray-600'}`}>
                                                            <ShieldCheck className="h-7 w-7" />
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="text-base font-black uppercase tracking-tight">Verified Credit Profile</h4>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${formData.hasPreviousInvestment ? 'text-white/70' : 'text-gray-500'}`}>Previous repayment history</p>
                                                        </div>
                                                    </div>
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-4 ${formData.hasPreviousInvestment ? 'border-[#7ede56] bg-white text-[#002f37]' : 'border-gray-200'}`}>
                                                        {formData.hasPreviousInvestment && <CheckCircle2 className="h-4 w-4" />}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 4: VALIDATE ── */}
                                {step === 4 && (
                                    <div className="step-wrapper">
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
                                            <div className="bg-[#002f37] text-white px-6 py-4 rounded-t-3xl flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                                                    <FileText className="h-5 w-5 text-[#7ede56]" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black uppercase tracking-widest block">Step 04 / Validate</span>
                                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Document Vault & Compliance Registry</p>
                                                </div>
                                            </div>
                                            <div className="bg-white border border-gray-200 border-t-0 p-6 md:p-10 rounded-b-3xl shadow-sm space-y-8">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                                    <div className="space-y-3">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Ghana Card — Front Face</Label>
                                                        <div className="relative group rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 h-[240px] flex flex-col items-center justify-center transition-all hover:border-[#7ede56]">
                                                            {idCardFront
                                                                ? <img src={idCardFront} alt="ID Front" className="w-full h-full object-cover" />
                                                                : <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-[#7ede56] transition-colors">
                                                                    <Camera className="h-10 w-10" />
                                                                    <span className="text-[9px] font-black uppercase">Upload or Snap</span>
                                                                  </div>
                                                            }
                                                            <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-[#002f37]/80 flex flex-col items-center justify-center text-white gap-2 transition-all backdrop-blur-sm" title="Upload ID Front or Snap Photo">
                                                                <span className="text-[10px] font-black uppercase tracking-widest">{ocrProcessing ? 'Scanning...' : 'Upload or Capture'}</span>
                                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'front')} disabled={!isEditable} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest pl-1">Ghana Card — Back Face</Label>
                                                        <div className="relative group rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 h-[240px] flex flex-col items-center justify-center transition-all hover:border-[#7ede56]">
                                                            {idCardBack
                                                                ? <img src={idCardBack} alt="ID Back" className="w-full h-full object-cover" />
                                                                : <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-[#7ede56] transition-colors">
                                                                    <Camera className="h-10 w-10" />
                                                                    <span className="text-[9px] font-black uppercase">Upload or Snap</span>
                                                                  </div>
                                                            }
                                                            <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-[#002f37]/80 flex flex-col items-center justify-center text-white gap-2 transition-all backdrop-blur-sm" title="Upload ID Back or Snap Photo">
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Upload or Capture</span>
                                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'back')} disabled={!isEditable} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="text-[11px] font-black uppercase text-[#002f37] tracking-widest">Field Notes</Label>
                                                    <Textarea
                                                        placeholder="Log behavioral markers or infrastructure observations..."
                                                        className="min-h-[120px] bg-gray-50 border-none rounded-2xl p-6 font-bold placeholder:opacity-30"
                                                        value={formData.fieldNotes}
                                                        onChange={(e) => handleInputChange('fieldNotes', e.target.value)}
                                                        disabled={!isEditable}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-6 border-t border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => isEditable && setIdVerificationChecked(!idVerificationChecked)}
                                                        className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${idVerificationChecked ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xl shadow-emerald-500/5' : 'bg-white border-gray-100 text-gray-800 hover:border-gray-200'}`}
                                                    >
                                                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${idVerificationChecked ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                            <UserCheck className="h-5 w-5" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-[11px] font-black uppercase tracking-tight">Identity Match Locked</p>
                                                            <p className={`text-[9px] font-bold uppercase tracking-widest opacity-60`}>Verified NiA biometric data</p>
                                                        </div>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => isEditable && setCertificationChecked(!certificationChecked)}
                                                        className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${certificationChecked ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xl shadow-emerald-500/5' : 'bg-white border-gray-100 text-gray-800 hover:border-gray-200'}`}
                                                    >
                                                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${certificationChecked ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                            <ShieldCheck className="h-5 w-5" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-[11px] font-black uppercase tracking-tight">Compliance Seal</p>
                                                            <p className={`text-[9px] font-bold uppercase tracking-widest opacity-60`}>Protocol integrity passed</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </ScrollArea>

                        {/* Footer Navigation */}
                        <div className="bg-white border-t border-gray-200 px-4 md:px-10 py-4 md:py-6 flex items-center justify-between shrink-0">
                            <Button
                                variant="ghost"
                                onClick={step === 1 ? () => onOpenChange?.(false) : prevStep}
                                className="h-14 px-4 md:px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] text-gray-400 hover:text-red-500"
                            >
                                {step === 1 ? <X className="h-5 w-5 mr-2" /> : <ChevronLeft className="h-5 w-5 mr-2" />}
                                {step === 1 ? 'Discard' : 'Back'}
                            </Button>

                            <div className="flex items-center gap-4">
                                {isEditMode && !isEditable && (
                                    <Button
                                        onClick={() => setIsEditable(true)}
                                        className="bg-[#002f37] text-white font-black h-14 px-8 rounded-2xl shadow-xl uppercase tracking-widest text-[11px]"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Unlock
                                    </Button>
                                )}
                                <Button
                                    onClick={step < 4 ? nextStep : handleSubmit}
                                    disabled={isSubmitting || (step === 4 && !isEditable)}
                                    className={`h-14 px-12 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all active:scale-95 ${step < 4 ? 'bg-[#002f37] text-white hover:bg-[#002f37]/90' : 'bg-[#7ede56] text-[#002f37] hover:bg-[#7ede56]/90'}`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            {step < 4 ? 'Next' : isEditMode ? 'Save Changes' : 'Finalize'}
                                            {step < 4 && <ChevronRight className="h-5 w-5 ml-2" />}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>

            {/* Print/Download Auto ID Card Modal triggered on Success */}
            <FarmerIdCardModal 
                open={isIdCardModalOpen} 
                onOpenChange={(val) => {
                    setIsIdCardModalOpen(val);
                    if (!val) {
                        onSuccess?.();
                    }
                }} 
                farmer={finalizedFarmer} 
            />
        </Dialog>
    );
};

export default AddFarmerModal;
