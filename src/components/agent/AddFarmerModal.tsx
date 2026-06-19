import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { getRecordId } from '@/utils/recordIds';
import { useAuth } from '@/contexts/AuthContext';
import { useOfflineOptional } from '@/contexts/OfflineContext';
import { submitOrQueue, isBrowserOnline } from '@/lib/offline';
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
    Globe, Mail, Layers, Briefcase as FarmIcon, CreditCard
} from 'lucide-react';
import { GHANA_REGIONS, GHANA_LANGUAGES, GHANA_COMMUNITIES, getRegionKey } from '@/data/ghanaRegions';
import { GHANA_CROPS, GHANA_LIVESTOCK, type LivestockEntry } from '@/data/ghanaCrops';
import ProfileImageCropDialog from '@/components/ProfileImageCropDialog';
import { resolveInitialMapView } from '@/utils/mapLocation';
import {
    showAutoErrorAlert,
    showAutoSuccessAlert,
    showAutoWarningAlert,
    showValidationAlert,
} from '@/utils/validationAlert';
import { validateGhanaCardOcr, type GhanaCardExtracted } from '@/utils/ghanaCardOcr';
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
    const offline = useOfflineOptional();
    const refreshOfflineState = offline?.refreshOfflineState ?? (async () => undefined);
    const isOnline = offline?.isOnline ?? isBrowserOnline();

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
    const [ocrData, setOcrData] = useState<GhanaCardExtracted | null>(null);
    const [ocrRawText, setOcrRawText] = useState('');
    const [ocrErrors, setOcrErrors] = useState<string[]>([]);
    const [ocrMismatch, setOcrMismatch] = useState<string[]>([]);
    const [farmLatitude, setFarmLatitude] = useState(0);
    const [farmLongitude, setFarmLongitude] = useState(0);
    const [measuredArea, setMeasuredArea] = useState(0);
    const [farmBoundary, setFarmBoundary] = useState<[number, number][]>([]);
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
    const [cocoaFarmerId, setCocoaFarmerId] = useState('');
    const [cocoaCardPhoto, setCocoaCardPhoto] = useState('');
    const [cocoaCardConsent, setCocoaCardConsent] = useState(false);

    const isCocoaGrower = selectedCrops.some((crop) => crop.toLowerCase() === 'cocoa');

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

    const handleMeasuredArea = (acres: number) => {
        if (!isEditable) return;
        setMeasuredArea(acres);
        setFormData((fd) => ({
            ...fd,
            farmSize: acres > 0 ? acres.toFixed(2) : '',
        }));
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
        setFarmBoundary([]);
        setMapViewCenter(undefined);
        setMapViewZoom(14);
        setTrainingModules(TRAINING_MODULES.map((m) => ({ ...m, completed: false })));
        setIdVerificationChecked(false);
        setOcrData(null);
        setOcrRawText('');
        setOcrErrors([]);
        setOcrMismatch([]);
        setCocoaFarmerId('');
        setCocoaCardPhoto('');
        setCocoaCardConsent(false);
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
        setCocoaFarmerId(editFarmer.cocoaFarmerId || '');
        setCocoaCardPhoto(editFarmer.cocoaCardPhoto || '');
        setCocoaCardConsent(Boolean(editFarmer.cocoaCardConsentAt));
        if (editFarmer.farmLocation?.lat != null) {
            setFarmLatitude(editFarmer.farmLocation.lat);
            setFarmLongitude(editFarmer.farmLocation.lng);
            setMeasuredArea(editFarmer.farmLocation.measuredAcres || editFarmer.farmSize || 0);
            if (Array.isArray(editFarmer.farmLocation.boundary)) {
                setFarmBoundary(editFarmer.farmLocation.boundary);
            }
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
                    showValidationAlert(
                        'Load Failed',
                        'Error loading farmer profile for editing. Refined data might be missing.'
                    );
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

    const applyOcrValidation = React.useCallback(
        (text: string) => {
            const result = validateGhanaCardOcr(text, {
                name: formData.name,
                dob: formData.dob,
                ghanaCardNumber: formData.ghanaCardNumber,
            });
            setOcrData(result.extracted);
            setOcrErrors(result.errors);
            if (result.valid) {
                setOcrMismatch([]);
                setIdVerificationChecked(true);
                return true;
            }
            setOcrMismatch(result.errors);
            setIdVerificationChecked(false);
            return false;
        },
        [formData.name, formData.dob, formData.ghanaCardNumber]
    );

    React.useEffect(() => {
        if (!ocrRawText || ocrProcessing) return;
        applyOcrValidation(ocrRawText);
    }, [ocrRawText, ocrProcessing, applyOcrValidation]);

    const processOCR = async (imageData: string) => {
        setOcrProcessing(true);
        setOcrMismatch([]);
        setOcrErrors([]);
        setIdVerificationChecked(false);
        try {
            const worker = await createWorker('eng');
            const {
                data: { text },
            } = await worker.recognize(imageData);
            await worker.terminate();

            setOcrRawText(text);
            const valid = applyOcrValidation(text);

            if (valid) {
                showAutoSuccessAlert(
                    'Ghana Card verified',
                    '<p style="font-size:15px;color:#065f46;font-weight:700;">Card number, name, and date of birth match your entries.</p>',
                    3500
                );
            } else {
                const result = validateGhanaCardOcr(text, {
                    name: formData.name,
                    dob: formData.dob,
                    ghanaCardNumber: formData.ghanaCardNumber,
                });
                showAutoErrorAlert(
                    'Ghana Card verification failed',
                    `<ul style="text-align:left;font-size:13px;color:#374151;margin:0;padding-left:1.1rem;">${result.errors
                        .map((e) => `<li style="margin-bottom:6px;">${e}</li>`)
                        .join('')}</ul>`,
                    5000,
                    true
                );
            }
        } catch (error) {
            setOcrRawText('');
            setOcrData(null);
            setIdVerificationChecked(false);
            showAutoErrorAlert(
                'Could not scan Ghana Card',
                'Upload a clear, well-lit photo of the front of the Ghana Card. Random or unrelated images cannot be used.'
            );
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'profile' | 'cocoaCard') => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        if (file.size > 5 * 1024 * 1024) { 
            showValidationAlert('File Too Large', 'Maximum upload size is 5MB. Please choose a smaller image.');
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
                if (type === 'front') {
                    setIdCardFront(compressed);
                    setOcrRawText('');
                    setOcrData(null);
                    setOcrErrors([]);
                    setOcrMismatch([]);
                    setIdVerificationChecked(false);
                    void processOCR(compressed);
                }
                else if (type === 'back') setIdCardBack(compressed);
                else if (type === 'cocoaCard') setCocoaCardPhoto(compressed);
            } catch { 
                showValidationAlert('Processing Error', 'Failed to optimize image for upload.');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFarmerProfileCrop = async (dataUrl: string) => {
        try {
            const compressed = await compressImage(dataUrl, 512, 512, 0.88);
            setProfilePicture(compressed);
        } catch {
            showValidationAlert('Processing Error', 'Failed to optimize profile photo.');
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
        mutationFn: async (payload: Record<string, unknown>) => {
            if (isEditMode && farmer?._id) {
                const res = await api.put(`/farmers/${getRecordId(farmer)}`, payload);
                return { kind: 'online' as const, data: res.data };
            }

            const result = await submitOrQueue({
                type: 'farmer',
                method: 'POST',
                url: '/farmers',
                payload,
                label: `Grower onboarding — ${String(payload.name || 'New grower')}`,
            });

            if (result.status === 'queued') {
                return { kind: 'queued' as const, name: String(payload.name || 'Grower') };
            }

            return { kind: 'online' as const, data: result.data };
        },
        retry: false,
        onSuccess: async (result: { kind: 'online' | 'queued'; data?: unknown; name?: string }) => {
            submitLockRef.current = false;
            onOpenChange?.(false);
            resetNewFarmerForm();
            // Let the full-screen onboarding dialog unmount so it cannot block the alert on mobile
            await new Promise((resolve) => window.setTimeout(resolve, 200));

            if (result.kind === 'queued') {
                await refreshOfflineState();
                await showAutoSuccessAlert(
                    'Saved on Device',
                    `<p style="font-size:18px;color:#065f46;font-weight:800;">Grower profile saved offline.</p>
                        <p style="font-size:14px;color:#374151;margin-top:12px;"><b>${result.name}</b> will be registered when you have signal.</p>
                        <p style="font-size:12px;color:#6b7280;margin-top:10px;">Lync ID, welcome SMS, and ID card will be available after sync.</p>`,
                    4000
                );
                onSuccess?.();
                return;
            }

            const savedFarmer = result.data as {
                id?: string;
                sms?: { sent?: boolean; recipientCount?: number; message?: string };
            };
            const lyncId = savedFarmer?.id || 'Pending';
            const sms = savedFarmer?.sms;
            const smsSent = Boolean(sms?.sent && (sms?.recipientCount ?? 0) > 0);
            const smsLine = !isEditMode && sms
                ? smsSent
                    ? `<p style="font-size:13px;color:#065f46;margin-top:10px;">Welcome SMS queued for the grower via mNotify.</p>`
                    : `<p style="font-size:13px;color:#b45309;margin-top:10px;">Grower saved, but welcome SMS was not sent${sms?.message ? `: ${sms.message}` : ''}. Check the phone number and try Bulk SMS.</p>`
                : '';
            await showAutoSuccessAlert(
                'Onboarding Finalized',
                `<p style="font-size:18px;color:#065f46;font-weight:800;">${isEditMode ? 'Farmer profile updated!' : 'Farmer onboarded successfully!'}</p><p style="font-family:monospace;font-size:22px;font-weight:900;color:#064e3b;">Lync ID: ${lyncId}</p>${smsLine}`,
                smsSent ? 3500 : 4500
            );
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            queryClient.invalidateQueries({ queryKey: ['agentFarmers'] });
            queryClient.invalidateQueries({ queryKey: ['farmers'] });
            queryClient.invalidateQueries({ queryKey: ['agentFarmersDirectory'] });
            setFinalizedFarmer(savedFarmer);
            setIsIdCardModalOpen(true);
        },
        onError: (error: unknown) => {
            submitLockRef.current = false;
            console.error('Add/Edit Farmer Error:', error);
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            queryClient.invalidateQueries({ queryKey: ['agentFarmers'] });
            queryClient.invalidateQueries({ queryKey: ['farmers'] });
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

        if (isEditMode && !isOnline) {
            showAutoWarningAlert(
                'Offline',
                'Editing a grower profile requires internet. You can onboard new growers offline and sync later.'
            );
            return;
        }

        if (!agent?.id && !agent?.agentId) {
            showValidationAlert(
                'Session Error',
                'Your agent session could not be verified. Please log out and sign in again.'
            );
            return;
        }
        if (!agent?.agentId) {
            showValidationAlert(
                'Profile Incomplete',
                'Your Field Agent ID is missing from your profile. Contact an administrator before onboarding growers.'
            );
            return;
        }
        if (!idCardFront || !idCardBack) {
            showValidationAlert('Missing Documentation', 'Please upload both sides of the Ghana Card');
            return;
        }
        if (!isEditMode && (!idVerificationChecked || !ocrData?.idNumber || ocrErrors.length > 0)) {
            showAutoErrorAlert(
                'Ghana Card not verified',
                ocrErrors.length
                    ? `<ul style="text-align:left;font-size:13px;margin:0;padding-left:1.1rem;">${ocrErrors
                          .map((e) => `<li style="margin-bottom:6px;">${e}</li>`)
                          .join('')}</ul>`
                    : '<p>Upload a clear front photo of the Ghana Card. The card number, name, and date of birth must match step 1.</p>',
                5000,
                true
            );
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
            showValidationAlert('Incomplete Data', `Please fill required fields: ${missingFields.join(', ')}`);
            return;
        }

        const ghanaCardRegex = /^GHA-\d{9}-\d$/;
        if (!ghanaCardRegex.test(formData.ghanaCardNumber)) {
            showValidationAlert('Identity Format Error', 'Invalid Ghana Card format. Expected: GHA-XXXXXXXXX-X');
            return;
        }

        const trimmedCocoaId = cocoaFarmerId.trim();
        const hasCocoaData = Boolean(trimmedCocoaId || cocoaCardPhoto);
        if (isCocoaGrower && hasCocoaData) {
            if (!cocoaCardConsent) {
                showValidationAlert(
                    'Consent Required',
                    'Please confirm grower consent before saving COCOBOD cocoa card details.'
                );
                return;
            }
            if (trimmedCocoaId && !/^\d{6,12}$/.test(trimmedCocoaId)) {
                showValidationAlert(
                    'Invalid COCOBOD ID',
                    'Farmer ID should be the numeric ID printed on the cocoa card (e.g. 303220037).'
                );
                return;
            }
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
            verificationConfirmed: isEditMode ? true : idVerificationChecked,
            ghanaCardOcr:
                !isEditMode && ocrData?.idNumber && ocrData?.name && ocrData?.dob
                    ? {
                          idNumber: ocrData.idNumber,
                          name: ocrData.name,
                          dob: ocrData.dob,
                          verifiedAt: new Date().toISOString(),
                      }
                    : undefined,
            profilePicture, idCardFront, idCardBack, status: 'active',
            trainingModules: trainingModules.filter(m => m.completed).map(m => m.id),
            cropList: selectedCrops,
            cropsGrownOther: selectedCrops.includes('Other') ? cropsGrownOther : '',
            livestockInventory,
            farmLocation: farmLatitude && farmLongitude ? {
                lat: farmLatitude,
                lng: farmLongitude,
                measuredAcres: measuredArea || Number(formData.farmSize) || 0,
                boundary: farmBoundary.length >= 3 ? farmBoundary : undefined,
            } : gpsLocation ? {
                lat: gpsLocation.lat,
                lng: gpsLocation.lng,
                measuredAcres: Number(formData.farmSize) || measuredArea || 0,
            } : undefined,
            ...(isCocoaGrower || (isEditMode && (trimmedCocoaId || cocoaCardPhoto || farmer?.cocoaFarmerId || farmer?.cocoaCardPhoto))
                ? {
                      cocoaFarmerId: trimmedCocoaId,
                      cocoaCardPhoto: cocoaCardPhoto || '',
                      cocoaCardConsent: hasCocoaData ? cocoaCardConsent : undefined,
                  }
                : {}),
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
            <DialogContent
                hideCloseButton
                className="grower-onboarding-modal max-w-[100vw] w-full h-[100dvh] sm:h-[92dvh] lg:h-[88vh] p-0 overflow-hidden border-none bg-[#f4f7f6] shadow-2xl z-[150] rounded-none sm:rounded-2xl"
            >
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
                                {!isEditMode && !isOnline && (
                                    <p className="text-[10px] font-black uppercase tracking-wide text-amber-700 mt-1.5">
                                        Offline mode — will sync when online
                                    </p>
                                )}
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
                                                    <div className="space-y-2 sm:col-span-2 lg:col-span-3">
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
                                                    <div className="space-y-2 sm:col-span-2">
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

                                                <div className="space-y-3 border-t border-gray-100 pt-6">
                                                    <OnboardingFieldLabel hint="Tap Measure boundary → tap each corner → tap Done. Size saves automatically below.">
                                                        Farm location & size on map
                                                    </OnboardingFieldLabel>
                                                <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-[320px] sm:h-[360px] lg:h-[400px]">
                                                    <FarmMap
                                                        embedded
                                                        areaUnit="acres"
                                                        latitude={farmLatitude}
                                                        longitude={farmLongitude}
                                                        viewCenter={mapViewCenter}
                                                        viewZoom={mapViewZoom}
                                                        onLocationChange={(lat, lng) => { if (isEditable) { setFarmLatitude(lat); setFarmLongitude(lng); } }}
                                                        onAreaChange={handleMeasuredArea}
                                                        onBoundaryChange={(points) => { if (isEditable) setFarmBoundary(points); }}
                                                        farmSize={measuredArea}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel hint="Auto-filled when you finish measuring on the map">
                                                            Farm size (acres)
                                                        </OnboardingFieldLabel>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min={0}
                                                            placeholder="Tap Done on map after drawing boundary"
                                                            className={`${ONBOARDING_INPUT} ${
                                                                measuredArea > 0
                                                                    ? 'bg-[#7ede56]/10 border-[#065f46]/40 font-bold text-[#002f37]'
                                                                    : ''
                                                            }`}
                                                            value={formData.farmSize}
                                                            onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                                            disabled={!isEditable}
                                                            readOnly={measuredArea > 0}
                                                        />
                                                        {measuredArea > 0 && (
                                                            <p className="text-[11px] font-semibold text-[#065f46]">
                                                                ✓ {measuredArea.toFixed(2)} acres from GPS map — saved for onboarding
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <OnboardingFieldLabel>GPS pin location</OnboardingFieldLabel>
                                                        <Input
                                                            readOnly
                                                            className={`${ONBOARDING_INPUT} bg-gray-50 text-gray-600 font-mono text-sm`}
                                                            value={
                                                                farmLatitude && farmLongitude
                                                                    ? `${farmLatitude.toFixed(6)}, ${farmLongitude.toFixed(6)}`
                                                                    : ''
                                                            }
                                                            placeholder="Tap map or use My Location"
                                                        />
                                                    </div>
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
                                            description="Upload Ghana Card photos. Cocoa growers may optionally add a COCOBOD card."
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

                                                {isCocoaGrower && (
                                                    <div className="space-y-5 pt-2 border-t border-dashed border-amber-200/80">
                                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-100">
                                                            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                                                <CreditCard className="h-5 w-5" />
                                                            </div>
                                                            <div className="min-w-0 space-y-1">
                                                                <p className="text-sm font-semibold text-[#002f37]">
                                                                    COCOBOD Cocoa Card <span className="text-gray-400 font-normal">(optional)</span>
                                                                </p>
                                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                                    If this grower has a Ghana Cocoa Board farmer card, you may upload a photo
                                                                    or enter their COCOBOD Farmer ID. The physical card remains property of COCOBOD.
                                                                    This is used for AgriLync verification only — not shared with investors.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                                            <div className="space-y-3">
                                                                <OnboardingFieldLabel hint="Numeric ID on the card, e.g. 303220037">
                                                                    COCOBOD Farmer ID
                                                                </OnboardingFieldLabel>
                                                                <Input
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    placeholder="303220037"
                                                                    className={ONBOARDING_INPUT}
                                                                    value={cocoaFarmerId}
                                                                    onChange={(e) => setCocoaFarmerId(e.target.value.replace(/\D/g, ''))}
                                                                    disabled={!isEditable}
                                                                />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <OnboardingFieldLabel>Cocoa card photo</OnboardingFieldLabel>
                                                                <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-amber-200 h-[200px] sm:h-[220px] flex flex-col items-center justify-center transition-all hover:border-amber-400">
                                                                    {cocoaCardPhoto
                                                                        ? <img src={cocoaCardPhoto} alt="COCOBOD Cocoa Card" className="w-full h-full object-cover" />
                                                                        : <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-amber-600 transition-colors">
                                                                            <Camera className="h-10 w-10" />
                                                                            <span className="text-[9px] font-black uppercase">Upload or Snap</span>
                                                                          </div>
                                                                    }
                                                                    <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-[#002f37]/80 flex flex-col items-center justify-center text-white gap-2 transition-all backdrop-blur-sm" title="Upload cocoa card photo">
                                                                        <span className="text-[10px] font-black uppercase tracking-widest">Upload or Capture</span>
                                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'cocoaCard')} disabled={!isEditable} />
                                                                    </label>
                                                                    {cocoaCardPhoto && isEditable && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setCocoaCardPhoto('')}
                                                                            className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                                                                            aria-label="Remove cocoa card photo"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {(cocoaFarmerId.trim() || cocoaCardPhoto) && (
                                                            <button
                                                                type="button"
                                                                onClick={() => isEditable && setCocoaCardConsent((prev) => !prev)}
                                                                disabled={!isEditable}
                                                                className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-left ${
                                                                    cocoaCardConsent
                                                                        ? 'bg-amber-50 border-amber-500'
                                                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                                                }`}
                                                            >
                                                                <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                                                    cocoaCardConsent
                                                                        ? 'border-amber-600 bg-amber-600 text-white'
                                                                        : 'border-gray-300 bg-white'
                                                                }`}>
                                                                    {cocoaCardConsent && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                                </div>
                                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                                    The grower agrees to share their COCOBOD cocoa card details with AgriLync
                                                                    for verification purposes only.
                                                                </p>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

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
                                                    <div
                                                        role="status"
                                                        aria-live="polite"
                                                        className={`p-4 rounded-xl border-2 flex items-center gap-3 text-left select-none pointer-events-none ${
                                                            idVerificationChecked
                                                                ? 'bg-emerald-50 border-emerald-500'
                                                                : ocrErrors.length
                                                                  ? 'bg-rose-50 border-rose-300'
                                                                  : 'bg-white border-gray-200'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                                idVerificationChecked
                                                                    ? 'bg-emerald-500 text-white'
                                                                    : ocrErrors.length
                                                                      ? 'bg-rose-500 text-white'
                                                                      : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                        >
                                                            <UserCheck className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-[#002f37]">
                                                                {ocrProcessing
                                                                    ? 'Scanning Ghana Card…'
                                                                    : idVerificationChecked
                                                                      ? 'ID verified'
                                                                      : 'ID not verified yet'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                                {idVerificationChecked
                                                                    ? 'Card number, name, and date of birth match automatically.'
                                                                    : 'Automatic only — upload the front of the Ghana Card. It must match name, DOB, and card number from step 1.'}
                                                            </p>
                                                            {ocrErrors.length > 0 && !ocrProcessing && (
                                                                <ul className="mt-2 space-y-1">
                                                                    {ocrErrors.slice(0, 3).map((err) => (
                                                                        <li key={err} className="text-[11px] text-rose-700 leading-snug">
                                                                            {err}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
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
                                            {step < 4 ? 'Continue' : isEditMode ? 'Save' : isOnline ? 'Complete onboarding' : 'Save offline'}
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
