import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
import { createWorker } from 'tesseract.js';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { GHANA_CROPS, GHANA_LIVESTOCK, type LivestockEntry } from '@/data/ghanaCrops';
import ProfileImageCropDialog from '@/components/ProfileImageCropDialog';
import { resolveInitialMapView } from '@/utils/mapLocation';
import { showValidationAlert } from '@/utils/validationAlert';
import {
    ONBOARDING_INPUT,
    ONBOARDING_SELECT,
    ONBOARDING_TEXTAREA,
    OnboardingFieldLabel,
    OnboardingFormCard,
    OnboardingMobileProgress,
    OnboardingSidebar,
    OnboardingStepSection,
    ONBOARDING_CONTENT_WIDTH,
} from '@/components/agent/onboarding/OnboardingFormUI';

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

    const buildEmptyForm = React.useCallback(() => ({
        name: '', contact: '', gender: '', dob: '', language: '', otherLanguage: '',
        email: '', password: '', region: getRegionKey(agent?.region), district: '',
        community: '', farmType: '', farmSize: '', yearsOfExperience: '',
        landOwnershipStatus: '', fieldNotes: '',
        investmentInterest: 'no', preferredInvestmentType: '', estimatedCapitalNeed: '',
        hasPreviousInvestment: false, investmentReadinessScore: 0,
        otherGender: '', otherDistrict: '', ghanaCardNumber: ''
    }), [agent?.region]);

    const [formData, setFormData] = useState(buildEmptyForm);
    const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [manualCommunity, setManualCommunity] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [idCardFront, setIdCardFront] = useState('');
    const [idCardBack, setIdCardBack] = useState('');
    const [idVerificationChecked, setIdVerificationChecked] = useState(false);
    const [ocrProcessing, setOcrProcessing] = useState(false);
    const [ocrData, setOcrData] = useState<{ name?: string; dob?: string } | null>(null);
    const [ocrMismatch, setOcrMismatch] = useState<string[]>([]);
    const [farmLatitude, setFarmLatitude] = useState(0);
    const [farmLongitude, setFarmLongitude] = useState(0);
    const [measuredArea, setMeasuredArea] = useState(0);
    const [mapViewCenter, setMapViewCenter] = useState<[number, number] | undefined>();
    const [mapViewZoom, setMapViewZoom] = useState(14);
    const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
    const [finalizedFarmer, setFinalizedFarmer] = useState<any>(null);
    const [trainingModules, setTrainingModules] = useState(
        TRAINING_MODULES.map(m => ({ ...m, completed: false }))
    );
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
    const [cropsGrownOther, setCropsGrownOther] = useState('');
    const [livestockInventory, setLivestockInventory] = useState<LivestockEntry[]>([]);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

    const toggleModule = (id: string) => {
        if (!isEditable) return;
        setTrainingModules(prev => prev.map(m => 
            m.id === id ? { ...m, completed: !m.completed } : m
        ));
    };

    const toggleCrop = (crop: string) => {
        if (!isEditable) return;
        setSelectedCrops((prev) =>
            prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
        );
    };

    const addLivestockEntry = () => {
        if (!isEditable) return;
        setLivestockInventory((prev) => [...prev, { type: 'Poultry', count: 0 }]);
    };

    const updateLivestockEntry = (index: number, field: keyof LivestockEntry, value: string | number) => {
        if (!isEditable) return;
        setLivestockInventory((prev) =>
            prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
        );
    };

    const removeLivestockEntry = (index: number) => {
        if (!isEditable) return;
        setLivestockInventory((prev) => prev.filter((_, i) => i !== index));
    };

    const prevOpenRef = React.useRef(false);
    const loadedEditFarmerIdRef = React.useRef<string | null>(null);

    const resetNewFarmerForm = React.useCallback(() => {
        setFormData(buildEmptyForm());
        setManualCommunity('');
        setProfilePicture('');
        setIdCardFront('');
        setIdCardBack('');
        setCropImageSrc(null);
        setCropDialogOpen(false);
        setOcrMismatch([]);
        setOcrData(null);
        setStep(1);
        setIsEditable(true);
        setIdVerificationChecked(false);
        setSelectedCrops([]);
        setCropsGrownOther('');
        setLivestockInventory([]);
        setFarmLatitude(0);
        setFarmLongitude(0);
        setMeasuredArea(0);
        setMapViewCenter(undefined);
        setMapViewZoom(14);
        setTrainingModules(TRAINING_MODULES.map((m) => ({ ...m, completed: false })));
    }, [buildEmptyForm]);

    const loadFarmerForEdit = React.useCallback((editFarmer: NonNullable<typeof farmer>) => {
        setFormData({
            name: editFarmer.name || '', contact: editFarmer.contact || '', gender: editFarmer.gender || '',
            dob: editFarmer.dob ? (editFarmer.dob.includes('T') ? new Date(editFarmer.dob).toISOString().split('T')[0] : editFarmer.dob.split('T')[0]) : '',
            language: editFarmer.language || '', otherLanguage: editFarmer.otherLanguage || '',
            email: editFarmer.email || '', password: '',
            region: getRegionKey(editFarmer.region || agent?.region),
            district: editFarmer.district || '', community: editFarmer.community || '',
            farmType: editFarmer.farmType || '', farmSize: editFarmer.farmSize?.toString() || '',
            yearsOfExperience: editFarmer.yearsOfExperience?.toString() || '',
            landOwnershipStatus: editFarmer.landOwnershipStatus || '', fieldNotes: editFarmer.fieldNotes || '',
            investmentInterest: editFarmer.investmentInterest || 'no',
            preferredInvestmentType: editFarmer.preferredInvestmentType || '',
            estimatedCapitalNeed: editFarmer.estimatedCapitalNeed?.toString() || '',
            hasPreviousInvestment: editFarmer.hasPreviousInvestment || false,
            investmentReadinessScore: editFarmer.investmentReadinessScore || 0,
            otherGender: editFarmer.otherGender || '', otherDistrict: editFarmer.otherDistrict || '',
            ghanaCardNumber: editFarmer.ghanaCardNumber || ''
        });
        if (editFarmer.community && !GHANA_COMMUNITIES[editFarmer.district]?.includes(editFarmer.community)) {
            setManualCommunity(editFarmer.community);
            setFormData(prev => ({ ...prev, community: 'Other (Specify)' }));
        } else {
            setManualCommunity('');
        }
        setProfilePicture(editFarmer.profilePicture || '');
        setIdCardFront(editFarmer.idCardFront || '');
        setIdCardBack(editFarmer.idCardBack || '');
        setIdVerificationChecked(!!(editFarmer.idCardFront && editFarmer.idCardBack));
        setSelectedCrops(
            editFarmer.cropList?.length
                ? editFarmer.cropList
                : (editFarmer.cropsGrown ? String(editFarmer.cropsGrown).split(',').map((s: string) => s.trim()).filter(Boolean) : [])
        );
        setCropsGrownOther(editFarmer.cropsGrownOther || '');
        setLivestockInventory(editFarmer.livestockInventory?.length ? editFarmer.livestockInventory : []);
        if (editFarmer.farmLocation?.lat != null) {
            setFarmLatitude(editFarmer.farmLocation.lat);
            setFarmLongitude(editFarmer.farmLocation.lng);
            setMeasuredArea(editFarmer.farmLocation.measuredAcres || editFarmer.farmSize || 0);
        }
        setTrainingModules(
            TRAINING_MODULES.map((m) => ({
                ...m,
                completed: (editFarmer.trainingModules || []).includes(m.id),
            }))
        );
        setOcrMismatch([]);
        setOcrData(null);
        setStep(1);
        setIsEditable(false);
    }, [agent?.region]);

    // Only reset/load when the modal opens — not when agent/profile refreshes in the background
    React.useEffect(() => {
        const wasOpen = prevOpenRef.current;
        const isOpen = Boolean(open);
        prevOpenRef.current = isOpen;

        if (!isOpen) {
            loadedEditFarmerIdRef.current = null;
            return;
        }

        const justOpened = !wasOpen;

        if (isEditMode && farmer) {
            const farmerId = String(farmer._id || farmer.id || '');
            if (justOpened || loadedEditFarmerIdRef.current !== farmerId) {
                loadedEditFarmerIdRef.current = farmerId;
                try {
                    loadFarmerForEdit(farmer);
                } catch {
                    Swal.fire({
                        icon: 'error',
                        title: 'Load Failed',
                        text: 'Error loading farmer profile for editing. Refined data might be missing.',
                        confirmButtonColor: '#002f37'
                    });
                }
            }
            return;
        }

        if (!isEditMode && justOpened) {
            resetNewFarmerForm();
        }
    }, [open, farmer, isEditMode, loadFarmerForEdit, resetNewFarmerForm]);

    // If the modal opened before agent profile finished loading, fill region without wiping other fields
    React.useEffect(() => {
        if (!open || isEditMode || !agent?.region) return;
        setFormData((prev) => {
            if (prev.region) return prev;
            return { ...prev, region: getRegionKey(agent.region) };
        });
    }, [open, isEditMode, agent?.region]);

    const mapInitRef = React.useRef(false);
    const submitLockRef = React.useRef(false);

    // Auto-locate map on open: phone GPS → geocode agent region (no hardcoded coords)
    React.useEffect(() => {
        if (!open) {
            mapInitRef.current = false;
            return;
        }
        if (mapInitRef.current) return;
        mapInitRef.current = true;

        if (isEditMode && farmer?.farmLocation?.lat != null) {
            setMapViewCenter([farmer.farmLocation.lat, farmer.farmLocation.lng]);
            setMapViewZoom(15);
            return;
        }

        let cancelled = false;
        (async () => {
            const view = await resolveInitialMapView({
                region: getRegionKey(agent?.region || formData.region),
                setPinFromGps: !isEditMode,
                gpsZoom: 15,
                geocodeZoom: 13,
            });
            if (cancelled) return;
            setMapViewCenter(view.center);
            setMapViewZoom(view.zoom);
            if (view.pinCoords) {
                setFarmLatitude((prev) => (prev !== 0 ? prev : view.pinCoords!.lat));
                setFarmLongitude((prev) => (prev !== 0 ? prev : view.pinCoords!.lng));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [open, isEditMode, farmer, agent?.region, formData.region]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;
            const activeEl = document.activeElement;
            const isTyping = activeEl instanceof HTMLTextAreaElement ||
                (activeEl instanceof HTMLInputElement && activeEl.type === 'text');
            if (e.key === 'Enter' && !isTyping) {
                e.preventDefault();
                if (step < 4) setStep(prev => prev + 1);
                else if (isEditable && !submitLockRef.current && !addFarmerMutation.isPending) handleSubmit();
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
        e.target.value = '';
        if (file.size > 5 * 1024 * 1024) { 
            Swal.fire({ icon: 'error', title: 'File Too Large', text: 'Maximum upload size is 5MB. Please choose a smaller image.', confirmButtonColor: '#002f37' });
            return; 
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                if (type === 'profile') {
                    setCropImageSrc(reader.result as string);
                    setCropDialogOpen(true);
                    return;
                }
                const compressed = await compressImage(reader.result as string);
                if (type === 'front') { setIdCardFront(compressed); processOCR(compressed); }
                else if (type === 'back') setIdCardBack(compressed);
            } catch { 
                Swal.fire({ icon: 'error', title: 'Processing Error', text: 'Failed to optimize image for upload.', confirmButtonColor: '#002f37' });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFarmerProfileCrop = async (dataUrl: string) => {
        try {
            const compressed = await compressImage(dataUrl, 512, 512, 0.88);
            setProfilePicture(compressed);
        } catch {
            Swal.fire({ icon: 'error', title: 'Processing Error', text: 'Failed to optimize profile photo.', confirmButtonColor: '#002f37' });
        }
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
        retry: false,
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
            resetNewFarmerForm();
        },
        onError: (error: unknown) => {
            submitLockRef.current = false;
            console.error('Add/Edit Farmer Error:', error);
            showValidationAlert(
                'Verification Failed',
                error,
                'Could not verify and complete grower registration. Please check the details and try again.'
            );
        }
    });

    const isSubmitting = addFarmerMutation.isPending;

    const handleSubmit = async () => {
        if (submitLockRef.current || addFarmerMutation.isPending) return;

        if (!agent?.agentId) {
            Swal.fire({ icon: 'error', title: 'Session Error', text: 'Your agent ID could not be verified. Please log out and sign in again.', confirmButtonColor: '#002f37' });
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
            ghanaCardNumber: formData.ghanaCardNumber.trim().toUpperCase(),
            gender: formData.gender === 'other' ? formData.otherGender : formData.gender,
            district: formData.district === 'other' ? formData.otherDistrict : formData.district,
            password: !isEditMode ? tempPassword : undefined,
            community: finalCommunity,
            preferredInvestmentType:
                formData.investmentInterest === 'yes' ? formData.preferredInvestmentType : undefined,
            farmSize: Number(formData.farmSize),
            yearsOfExperience: Number(formData.yearsOfExperience),
            estimatedCapitalNeed: formData.estimatedCapitalNeed ? Number(formData.estimatedCapitalNeed) : 0,
            investmentReadinessScore: Number(formData.investmentReadinessScore),
            onboardingAgentId: agent.agentId,
            verificationConfirmed: true,
            profilePicture, idCardFront, idCardBack, status: 'active',
            trainingModules: trainingModules.filter(m => m.completed).map(m => m.id),
            cropList: selectedCrops,
            cropsGrownOther: selectedCrops.includes('Other') ? cropsGrownOther : '',
            livestockInventory,
            farmLocation: farmLatitude && farmLongitude ? {
                lat: farmLatitude,
                lng: farmLongitude,
                measuredAcres: measuredArea || Number(formData.farmSize) || 0,
            } : gpsLocation ? {
                lat: gpsLocation.lat,
                lng: gpsLocation.lng,
                measuredAcres: Number(formData.farmSize) || measuredArea || 0,
            } : undefined,
        };
        if (isEditMode) delete payload.password;

        submitLockRef.current = true;
        addFarmerMutation.mutate(payload, {
            onSuccess: () => {
                submitLockRef.current = false;
            },
        });
    };

    const steps = [
        { id: 1, label: 'Identity', sub: 'Name, phone & ID', icon: User },
        { id: 2, label: 'Farm', sub: 'Location & crops', icon: Sprout },
        { id: 3, label: 'Investment', sub: 'Optional funding info', icon: Coins },
        { id: 4, label: 'Verify', sub: 'Photos & finish', icon: FileText },
    ];

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-[100vw] sm:max-w-[96vw] lg:max-w-[min(1280px,94vw)] xl:max-w-[min(1360px,92vw)] w-full h-[100dvh] sm:h-[92dvh] lg:h-[88vh] p-0 overflow-hidden border-none bg-[#f4f7f6] shadow-2xl z-[150] rounded-none sm:rounded-2xl [&>button]:hidden">
                <div className="sr-only">
                    <DialogTitle>{isEditMode ? 'Grower Profile Update' : 'New Grower Registration'}</DialogTitle>
                    <DialogDescription>{isEditMode ? 'Editing existing grower profile' : 'Form for onboarding a new grower'}</DialogDescription>
                </div>

                <div className="flex h-full w-full overflow-hidden">
                    <OnboardingSidebar steps={steps} currentStep={step} onStepClick={setStep} />

                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-8 lg:px-10 py-4 lg:py-5 flex items-center justify-between shrink-0 safe-area-top">
                            <div className="min-w-0 pr-3">
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#002f37] truncate">
                                    {isEditMode ? 'Edit farmer' : 'Add new farmer'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    <span className="text-[#065f46] font-medium">{steps[step - 1].label}</span>
                                    <span className="hidden sm:inline text-gray-400"> · {steps[step - 1].sub}</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onOpenChange?.(false)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <OnboardingMobileProgress steps={steps} currentStep={step} onStepClick={setStep} />

                        {/* Scrollable content */}
                        <ScrollArea className="flex-1 bg-gradient-to-b from-[#f4f7f6] to-[#eef3f1]">
                            <div className={`p-4 sm:p-6 lg:p-8 xl:p-10 mx-auto space-y-6 lg:space-y-8 pb-10 ${ONBOARDING_CONTENT_WIDTH}`}>

                                {/* ── STEP 1: IDENTITY ── */}
                                {step === 1 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-5">
                                        <OnboardingStepSection
                                            step={1}
                                            icon={User}
                                            title="Who is this farmer?"
                                            description="Basic details as they appear on the Ghana Card."
                                        />
                                        <OnboardingFormCard>
                                            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr] gap-6 lg:gap-10 pb-6 lg:pb-8 border-b border-gray-100">
                                                <div className="flex flex-col items-center lg:items-start">
                                                    <OnboardingFieldLabel hint="Optional">Profile photo</OnboardingFieldLabel>
                                                    <label className={`relative cursor-pointer group mt-4 ${!isEditable ? 'pointer-events-none' : ''}`}>
                                                        <div className="h-28 w-28 lg:h-32 lg:w-32 rounded-2xl border-2 border-dashed border-[#065f46]/20 group-hover:border-[#7ede56] transition-all overflow-hidden bg-gradient-to-br from-gray-50 to-[#7ede56]/5 flex items-center justify-center shadow-inner">
                                                            {profilePicture
                                                                ? <img src={profilePicture} alt="Profile" className="w-full h-full object-cover object-center" />
                                                                : <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#065f46]">
                                                                    <Camera className="h-8 w-8" />
                                                                    <span className="text-xs font-medium">Tap to add</span>
                                                                  </div>
                                                            }
                                                        </div>
                                                        {isEditable && (
                                                            <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-xl bg-[#065f46] border-2 border-white flex items-center justify-center shadow-md">
                                                                <Camera className="h-4 w-4 text-white" />
                                                            </div>
                                                        )}
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'profile')} disabled={!isEditable} />
                                                    </label>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 content-start">
                                                    <div className="space-y-2 sm:col-span-2">
                                                        <OnboardingFieldLabel>Full name</OnboardingFieldLabel>
                                                        <Input placeholder="As on Ghana Card" className={ONBOARDING_INPUT} value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Phone number</OnboardingFieldLabel>
                                                        <Input placeholder="024 000 0000" className={ONBOARDING_INPUT} value={formData.contact} onChange={(e) => handleInputChange('contact', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel hint="Optional">Email</OnboardingFieldLabel>
                                                        <Input placeholder="farmer@email.com" type="email" className={ONBOARDING_INPUT} value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                </div>
                                            </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Preferred language</OnboardingFieldLabel>
                                                        <Select value={formData.language} onValueChange={(v) => handleInputChange('language', v)} disabled={!isEditable}>
                                                            <SelectTrigger className={ONBOARDING_SELECT}><SelectValue placeholder="Choose language" /></SelectTrigger>
                                                            <SelectContent className="max-h-[300px] rounded-2xl border-none shadow-2xl">
                                                                {getLanguagesForRegion(formData.region).map(lang => (
                                                                    <SelectItem key={lang} value={lang} className="py-3 font-bold">{lang}</SelectItem>
                                                                ))}
                                                                <SelectItem value="Other" className="py-3 font-bold text-[#065f46]">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Gender</OnboardingFieldLabel>
                                                        <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)} disabled={!isEditable}>
                                                            <SelectTrigger className={ONBOARDING_SELECT}><SelectValue placeholder="Select" /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                                <SelectItem value="male" className="py-3 font-bold">Male</SelectItem>
                                                                <SelectItem value="female" className="py-3 font-bold">Female</SelectItem>
                                                                <SelectItem value="other" className="py-3 font-bold">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Date of birth</OnboardingFieldLabel>
                                                        <Input type="date" className={ONBOARDING_INPUT} value={formData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                    <div className="space-y-2 sm:col-span-1">
                                                        <OnboardingFieldLabel>Ghana Card number</OnboardingFieldLabel>
                                                        <Input placeholder="GHA-000000000-0" className={`${ONBOARDING_INPUT} font-mono`} value={formData.ghanaCardNumber} onChange={(e) => handleInputChange('ghanaCardNumber', e.target.value.toUpperCase())} disabled={!isEditable} onPaste={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()} />
                                                    </div>
                                                </div>
                                        </OnboardingFormCard>
                                    </div>
                                )}

                                {/* ── STEP 2: OPERATION ── */}
                                {step === 2 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-5">
                                        <OnboardingStepSection
                                            step={2}
                                            icon={Sprout}
                                            title="Farm & location"
                                            description="Where they farm, what they grow, and pin the farm on the map."
                                        />
                                        <OnboardingFormCard className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Region</OnboardingFieldLabel>
                                                        <Input disabled className={`${ONBOARDING_INPUT} bg-gray-50`} value={formData.region} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>District</OnboardingFieldLabel>
                                                        <Select value={formData.district} onValueChange={(v) => handleInputChange('district', v)} disabled={!isEditable}>
                                                            <SelectTrigger className={ONBOARDING_SELECT}><SelectValue placeholder="District" /></SelectTrigger>
                                                            <SelectContent className="max-h-[300px] rounded-2xl border-none shadow-2xl">
                                                                {formData.region && GHANA_REGIONS[formData.region]?.map(d => (
                                                                    <SelectItem key={d} value={d} className="py-3 font-bold">{d}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Community</OnboardingFieldLabel>
                                                        <Select value={formData.community} onValueChange={(v) => handleInputChange('community', v)} disabled={!isEditable}>
                                                            <SelectTrigger className={ONBOARDING_SELECT}><SelectValue placeholder="Community" /></SelectTrigger>
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
                                                        <OnboardingFieldLabel>Specify community</OnboardingFieldLabel>
                                                        <Input placeholder="Enter community name" className={ONBOARDING_INPUT} value={manualCommunity} onChange={(e) => setManualCommunity(e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 border-t border-gray-100 pt-6">
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Experience (years)</OnboardingFieldLabel>
                                                        <Input type="number" placeholder="Years of farming" className={ONBOARDING_INPUT} value={formData.yearsOfExperience} onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Primary farm type</OnboardingFieldLabel>
                                                        <Select value={formData.farmType} onValueChange={(v) => handleInputChange('farmType', v)} disabled={!isEditable}>
                                                            <SelectTrigger className={ONBOARDING_SELECT}><SelectValue placeholder="Farm Focus" /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                                <SelectItem value="crop" className="py-3 font-bold">Crop Only</SelectItem>
                                                                <SelectItem value="livestock" className="py-3 font-bold">Livestock Only</SelectItem>
                                                                <SelectItem value="mixed" className="py-3 font-bold">Mixed Farming</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Land ownership</OnboardingFieldLabel>
                                                        <Select value={formData.landOwnershipStatus} onValueChange={(v) => handleInputChange('landOwnershipStatus', v)} disabled={!isEditable}>
                                                            <SelectTrigger className={ONBOARDING_SELECT}><SelectValue placeholder="Ownership Status" /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                                <SelectItem value="owned" className="py-3 font-bold">Personal / Family Owned</SelectItem>
                                                                <SelectItem value="leased" className="py-3 font-bold">Leased / Rented</SelectItem>
                                                                <SelectItem value="sharecropped" className="py-3 font-bold">Sharecropped</SelectItem>
                                                                <SelectItem value="communal" className="py-3 font-bold">Communal Title</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Estimated acreage</OnboardingFieldLabel>
                                                        <Input type="number" step="0.1" placeholder="Farm size in acres" className={ONBOARDING_INPUT} value={formData.farmSize} onChange={(e) => handleInputChange('farmSize', e.target.value)} disabled={!isEditable} />
                                                    </div>
                                                </div>

                                                {(formData.farmType === 'crop' || formData.farmType === 'mixed') && (
                                                    <div className="space-y-3">
                                                        <OnboardingFieldLabel>Crops under production</OnboardingFieldLabel>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                            {GHANA_CROPS.map((crop) => (
                                                                <button
                                                                    key={crop}
                                                                    type="button"
                                                                    onClick={() => toggleCrop(crop)}
                                                                    className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${selectedCrops.includes(crop) ? 'bg-[#7ede56]/15 border-[#065f46] text-[#002f37]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                                                >
                                                                    {crop}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {selectedCrops.includes('Other') && (
                                                            <Input
                                                                placeholder="Specify other crop(s)"
                                                                className="h-12 bg-gray-50 border-none rounded-xl font-bold"
                                                                value={cropsGrownOther}
                                                                onChange={(e) => setCropsGrownOther(e.target.value)}
                                                                disabled={!isEditable}
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                                {(formData.farmType === 'livestock' || formData.farmType === 'mixed') && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <OnboardingFieldLabel>Livestock inventory</OnboardingFieldLabel>
                                                            {isEditable && (
                                                                <Button type="button" variant="outline" size="sm" onClick={addLivestockEntry} className="text-[10px] font-bold uppercase">
                                                                    Add Entry
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {livestockInventory.length === 0 && (
                                                            <p className="text-xs text-gray-400 font-medium">No livestock entries yet. Add poultry, cattle, goats, etc.</p>
                                                        )}
                                                        <div className="space-y-2">
                                                            {livestockInventory.map((entry, index) => (
                                                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                                                    <div className="col-span-5">
                                                                        <Select value={entry.type} onValueChange={(v) => updateLivestockEntry(index, 'type', v)} disabled={!isEditable}>
                                                                            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                                                                            <SelectContent>
                                                                                {GHANA_LIVESTOCK.map((type) => (
                                                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="col-span-3">
                                                                        <Input type="number" min={0} placeholder="Count" className="h-12 bg-gray-50 border-none rounded-xl font-bold" value={entry.count || ''} onChange={(e) => updateLivestockEntry(index, 'count', Number(e.target.value))} disabled={!isEditable} />
                                                                    </div>
                                                                    <div className="col-span-3">
                                                                        {entry.type === 'Other' && (
                                                                            <Input placeholder="Specify" className="h-12 bg-gray-50 border-none rounded-xl font-bold" value={entry.otherLabel || ''} onChange={(e) => updateLivestockEntry(index, 'otherLabel', e.target.value)} disabled={!isEditable} />
                                                                        )}
                                                                    </div>
                                                                    {isEditable && (
                                                                        <button type="button" onClick={() => removeLivestockEntry(index)} className="col-span-1 text-red-400 hover:text-red-600">
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <OnboardingFieldLabel hint="Tap the map or use your location to mark the farm">Farm location on map</OnboardingFieldLabel>
                                                <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-[280px] sm:h-[360px] lg:h-[400px]">
                                                    <div className="absolute top-3 left-3 z-10 px-3 py-2 bg-white/95 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-[#065f46]" />
                                                        <p className="text-xs font-medium text-gray-600">Pin farm location</p>
                                                    </div>
                                                    <FarmMap
                                                        latitude={farmLatitude}
                                                        longitude={farmLongitude}
                                                        viewCenter={mapViewCenter}
                                                        viewZoom={mapViewZoom}
                                                        onLocationChange={(lat, lng) => { if (isEditable) { setFarmLatitude(lat); setFarmLongitude(lng); } }}
                                                        onAreaChange={(area) => { if (isEditable) { setMeasuredArea(area); if (formData.farmType === 'crop') setFormData(fd => ({ ...fd, farmSize: area.toFixed(2) })); } }}
                                                        farmSize={measuredArea}
                                                    />
                                                    {measuredArea > 0 && (
                                                        <div className="absolute bottom-3 right-3 z-10 bg-[#065f46] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md">
                                                            {measuredArea.toFixed(2)} ha measured
                                                        </div>
                                                    )}
                                                </div>
                                                </div>
                                        </OnboardingFormCard>
                                    </div>
                                )}

                                {/* ── STEP 3: CAPITAL ── */}
                                {step === 3 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-5">
                                        <OnboardingStepSection
                                            step={3}
                                            icon={Coins}
                                            title="Investment interest"
                                            description="Optional — skip anything the farmer is not sure about yet."
                                        />
                                        <OnboardingFormCard className="space-y-8">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                                                    <div className="space-y-4">
                                                        <OnboardingFieldLabel>Investment interest</OnboardingFieldLabel>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {['yes', 'maybe', 'no'].map(opt => (
                                                                <button
                                                                    key={opt}
                                                                    onClick={() => isEditable && handleInputChange('investmentInterest', opt)}
                                                                    className={`h-11 rounded-xl border text-sm font-semibold capitalize transition-all ${formData.investmentInterest === opt ? 'bg-[#065f46] border-[#065f46] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                                                >
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Capital requirement (GHS)</OnboardingFieldLabel>
                                                        <div className="relative group">
                                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">₵</div>
                                                            <Input type="number" placeholder="0.00" className={`${ONBOARDING_INPUT} pl-10 text-lg`} value={formData.estimatedCapitalNeed} onChange={(e) => handleInputChange('estimatedCapitalNeed', e.target.value)} disabled={formData.investmentInterest === 'no' || !isEditable} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>Primary investment objective</OnboardingFieldLabel>
                                                        <Select 
                                                            value={formData.preferredInvestmentType} 
                                                            onValueChange={(v) => handleInputChange('preferredInvestmentType', v)} 
                                                            disabled={formData.investmentInterest === 'no' || !isEditable}
                                                        >
                                                            <SelectTrigger className={ONBOARDING_SELECT}><SelectValue placeholder="Select Purpose" /></SelectTrigger>
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

                                                <div className="p-5 sm:p-6 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-[#002f37]">Readiness score</h4>
                                                            <p className="text-xs text-gray-500">Your assessment of investment readiness</p>
                                                        </div>
                                                        <span className="text-2xl font-bold text-[#065f46]">{formData.investmentReadinessScore}%</span>
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
                                                        <OnboardingFieldLabel>Training progress</OnboardingFieldLabel>
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
                                                    type="button"
                                                    onClick={() => isEditable && handleInputChange('hasPreviousInvestment', !formData.hasPreviousInvestment)}
                                                    className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${formData.hasPreviousInvestment ? 'bg-[#065f46]/5 border-[#065f46]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                                >
                                                    <div className="flex items-center gap-3 text-left">
                                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${formData.hasPreviousInvestment ? 'bg-[#065f46] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                            <ShieldCheck className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-[#002f37]">Previous investment or credit</h4>
                                                            <p className="text-xs text-gray-500">Has this farmer received loans before?</p>
                                                        </div>
                                                    </div>
                                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.hasPreviousInvestment ? 'border-[#065f46] bg-[#065f46] text-white' : 'border-gray-300'}`}>
                                                        {formData.hasPreviousInvestment && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                    </div>
                                                </button>
                                        </OnboardingFormCard>
                                    </div>
                                )}

                                {/* ── STEP 4: VALIDATE ── */}
                                {step === 4 && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-5">
                                        <OnboardingStepSection
                                            step={4}
                                            icon={FileText}
                                            title="Documents & finish"
                                            description="Upload Ghana Card photos, then complete onboarding."
                                        />
                                        <OnboardingFormCard className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                                    <div className="space-y-3">
                                                        <OnboardingFieldLabel>Ghana Card — front</OnboardingFieldLabel>
                                                        <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 h-[200px] sm:h-[220px] flex flex-col items-center justify-center transition-all hover:border-[#7ede56]">
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
                                                        <OnboardingFieldLabel>Ghana Card — back</OnboardingFieldLabel>
                                                        <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 h-[200px] sm:h-[220px] flex flex-col items-center justify-center transition-all hover:border-[#7ede56]">
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

                                                <div className="space-y-2">
                                                    <OnboardingFieldLabel hint="Optional notes from your field visit">Field notes</OnboardingFieldLabel>
                                                    <Textarea
                                                        placeholder="Anything useful for the next visit..."
                                                        className={ONBOARDING_TEXTAREA}
                                                        value={formData.fieldNotes}
                                                        onChange={(e) => handleInputChange('fieldNotes', e.target.value)}
                                                        disabled={!isEditable}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => isEditable && setIdVerificationChecked(!idVerificationChecked)}
                                                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${idVerificationChecked ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                                    >
                                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${idVerificationChecked ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                            <UserCheck className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#002f37]">ID verified</p>
                                                            <p className="text-xs text-gray-500">Details match Ghana Card</p>
                                                        </div>
                                                    </button>
                                                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-[#065f46] text-white">
                                                            <ShieldCheck className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-medium text-gray-500">Onboarding agent</p>
                                                            <p className="text-sm font-bold text-[#002f37] font-mono truncate">
                                                                {(isEditMode && farmer?.onboardingAgentId) ? farmer.onboardingAgentId : (agent?.agentId || '—')}
                                                            </p>
                                                            <p className="text-xs text-gray-400 truncate">{agent?.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                        </OnboardingFormCard>
                                    </div>
                                )}

                            </div>
                        </ScrollArea>

                        {/* Footer Navigation */}
                        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 sm:px-8 lg:px-10 py-4 flex items-center justify-between gap-3 shrink-0 safe-area-bottom shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)]">
                            <Button
                                variant="ghost"
                                onClick={step === 1 ? () => onOpenChange?.(false) : prevStep}
                                className="h-11 sm:h-12 px-3 sm:px-5 rounded-xl text-sm font-semibold text-gray-500 hover:text-[#002f37]"
                            >
                                <ChevronLeft className="h-4 w-4 sm:mr-1.5" />
                                <span className="hidden sm:inline">{step === 1 ? 'Cancel' : 'Back'}</span>
                            </Button>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {isEditMode && !isEditable && (
                                    <Button
                                        onClick={() => setIsEditable(true)}
                                        variant="outline"
                                        className="h-11 sm:h-12 px-4 rounded-xl text-sm font-semibold border-[#065f46] text-[#065f46]"
                                    >
                                        <Edit className="h-4 w-4 mr-1.5" />
                                        Edit
                                    </Button>
                                )}
                                <Button
                                    onClick={step < 4 ? nextStep : handleSubmit}
                                    disabled={isSubmitting || (step === 4 && !isEditable)}
                                    className={`h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-sm font-semibold shadow-md transition-all active:scale-[0.98] ${
                                        step < 4
                                            ? 'bg-[#065f46] text-white hover:bg-[#065f46]/90'
                                            : 'bg-[#7ede56] text-[#002f37] hover:bg-[#6bc947]'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            {step < 4 ? 'Continue' : isEditMode ? 'Save' : 'Complete onboarding'}
                                            {step < 4 && <ChevronRight className="h-4 w-4 ml-1.5" />}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <ProfileImageCropDialog
            open={cropDialogOpen}
            imageSrc={cropImageSrc}
            title="Crop grower profile photo"
            onOpenChange={setCropDialogOpen}
            onCropComplete={handleFarmerProfileCrop}
        />

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
        </>
    );
};

export default AddFarmerModal;
