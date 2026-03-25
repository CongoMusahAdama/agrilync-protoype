import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
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
    Download,
    FileSpreadsheet,
    Loader2,
    Leaf,
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

const normalizeRegion = (regionString?: string) => {
    if (!regionString) return 'Ashanti Region';
    if (GHANA_REGIONS[regionString]) return regionString;
    const capitalized = regionString.charAt(0).toUpperCase() + regionString.slice(1).toLowerCase();
    const withSuffix = `${capitalized} Region`;
    if (GHANA_REGIONS[withSuffix]) return withSuffix;
    const matchedKey = Object.keys(GHANA_REGIONS).find(k => k.toLowerCase().includes(regionString.toLowerCase()));
    return matchedKey || 'Ashanti Region';
};

const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ trigger, open, onOpenChange, onSuccess, farmer, isEditMode }) => {
    const { agent } = useAuth();
    const [step, setStep] = useState(1);
    const [isEditable, setIsEditable] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        gender: '',
        dob: '',
        language: '',
        otherLanguage: '',
        email: '',
        password: '',
        region: normalizeRegion(agent?.region),
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
        investmentReadinessScore: 0,
        otherGender: '',
        otherDistrict: '',
        ghanaCardNumber: ''
    });

    const [gpsLocation, setGpsLocation] = useState<{lat: number, lng: number} | null>(null);

    const [manualCommunity, setManualCommunity] = useState('');
    const [profilePicture, setProfilePicture] = useState<string>('');
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

    // Auto-capture GPS when agent checks the certification checkbox
    React.useEffect(() => {
        if (certificationChecked && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGpsLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    console.log('Location not granted');
                }
            );
        }
    }, [certificationChecked]);

    // Initialize form with farmer data if in edit mode
    React.useEffect(() => {
        if (open && farmer && isEditMode) {
            try {
                setFormData({
                    name: farmer.name || '',
                    contact: farmer.contact || '',
                    gender: farmer.gender || '',
                    dob: farmer.dob ? (farmer.dob.includes('T') ? new Date(farmer.dob).toISOString().split('T')[0] : farmer.dob.split('T')[0]) : '',
                    language: farmer.language || '',
                    otherLanguage: farmer.otherLanguage || '',
                    email: farmer.email || '',
                    password: '', // Don't show password
                    region: normalizeRegion(farmer.region || agent?.region),
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
                    investmentReadinessScore: farmer.investmentReadinessScore || 0,
                    otherGender: farmer.otherGender || '',
                    otherDistrict: farmer.otherDistrict || '',
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
                setCertificationChecked(true); // Assume already certified if editing
                setOcrMismatch([]); // Reset mismatch for edit mode
                setOcrData(null); // Reset OCR data
                setStep(1);
                setIsEditable(false);
            } catch (error) {
                console.error('Error initializing edit mode:', error);
                toast.error('Error loading farmer data. Please try again.');
            }
        } else if ((open || !trigger) && !isEditMode) {
            // Reset for new onboarding when opened via controlled prop OR if mounted without a trigger (legacy)
            // Note: If using trigger, we rely on the initial state or manual reset if needed
            setFormData({
                name: '', contact: '', gender: '', dob: '', language: '', otherLanguage: '', email: '',
                password: '', region: normalizeRegion(agent?.region), district: '', community: '', farmType: '', farmSize: '',
                yearsOfExperience: '', landOwnershipStatus: '', cropsGrown: '', livestockType: '', fieldNotes: '',
                investmentInterest: 'no', preferredInvestmentType: '', estimatedCapitalNeed: '',
                hasPreviousInvestment: false, investmentReadinessScore: 0, otherGender: '', otherDistrict: '',
                ghanaCardNumber: ''
            });
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
            const idNumberMatch = text.match(/(?:GHA-\d{9}-\d)/);

            const extractedData = {
                name: nameMatch ? nameMatch[1].trim() : undefined,
                dob: dobMatch ? dobMatch[1].trim() : undefined,
                idNumber: idNumberMatch ? idNumberMatch[0] : undefined
            };

            setOcrData(extractedData as any);

            // Compare with form data - strict validation
            const mismatches: string[] = [];
            
            // Normalize names for comparison (remove extra spaces, convert to lowercase)
            const normalizeName = (name: string) => name.toLowerCase().trim().replace(/\s+/g, ' ');
            
            if (extractedData.name && formData.name) {
                const extractedNormalized = normalizeName(extractedData.name);
                const formNormalized = normalizeName(formData.name);
                
                // Check if names match (exact match or one contains the other with at least 80% similarity)
                const extractedWords = extractedNormalized.split(' ');
                const formWords = formNormalized.split(' ');
                const matchingWords = extractedWords.filter(word => 
                    formWords.some(fw => fw.includes(word) || word.includes(fw))
                );
                
                const similarity = matchingWords.length / Math.max(extractedWords.length, formWords.length);
                
                if (similarity < 0.7) { // Require at least 70% word match
                    mismatches.push('name');
                }
            }

            if (extractedData.dob && formData.dob) {
                // Normalize date formats for comparison
                const formDate = formData.dob.split('-'); // YYYY-MM-DD
                const dobFormats = [
                    `${formDate[2]}/${formDate[1]}/${formDate[0]}`, // DD/MM/YYYY
                    `${formDate[2]}/${formDate[1]}/${formDate[0].slice(2)}`, // DD/MM/YY
                    `${formDate[1]}/${formDate[2]}/${formDate[0]}`, // MM/DD/YYYY
                    `${formDate[1]}/${formDate[2]}/${formDate[0].slice(2)}`, // MM/DD/YY
                ];
                
                const dobMatches = dobFormats.some(format => 
                    extractedData.dob?.replace(/[-\s]/g, '/').includes(format.replace(/\//g, '')) ||
                    extractedData.dob?.includes(format)
                );
                
                if (!dobMatches) {
                    mismatches.push('date of birth');
                }
            }

            if (extractedData.idNumber && formData.ghanaCardNumber) {
                if (extractedData.idNumber !== formData.ghanaCardNumber) {
                    mismatches.push('ID number');
                }
            }

            if (mismatches.length > 0) {
                setOcrMismatch(mismatches);
                setIdVerificationChecked(false); // Uncheck if mismatch detected
                
                // Show sweet alert for mismatch
                const mismatchFields = mismatches.map(field => field.charAt(0).toUpperCase() + field.slice(1)).join(', ');
                Swal.fire({
                    icon: 'error',
                    title: 'Ghana Card Validation Failed',
                    html: `
                        <div style="text-align: left; padding: 10px 0;">
                            <p style="margin-bottom: 15px; font-size: 16px; color: #1f2937;">
                                <strong>The Ghana Card information does not match the credentials you provided.</strong>
                            </p>
                            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 15px 0;">
                                <p style="margin: 0; color: #991b1b; font-weight: 600;">
                                    Mismatch detected in: <span style="color: #dc2626;">${mismatchFields}</span>
                                </p>
                                ${extractedData.idNumber ? `<p style="margin: 10px 0 0 0; font-size: 13px; color: #991b1b;">Card Number: ${extractedData.idNumber}</p>` : ''}
                            </div>
                            <p style="margin-top: 15px; color: #4b5563; font-size: 14px;">
                                Please ensure the information on the Ghana Card matches exactly with what you entered in the form. 
                                Verify the name, DOB, and ID number carefully before proceeding.
                            </p>
                        </div>
                    `,
                    confirmButtonText: 'I Understand',
                    confirmButtonColor: '#ef4444',
                    width: '600px',
                    customClass: {
                        popup: 'swal2-popup-custom',
                        title: 'swal2-title-custom',
                        htmlContainer: 'swal2-html-container-custom'
                    }
                });
            } else if (extractedData.name || extractedData.dob) {
                setOcrMismatch([]);
                await Swal.fire({
                    icon: 'success',
                    title: 'ID Card Verified!',
                    html: `
                        <div style="text-align: center; padding: 10px 0;">
                            <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                                ✅ ID Card information matches form data!
                            </p>
                        </div>
                    `,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#065f46',
                    timer: 2000,
                    timerProgressBar: true
                });
                setIdVerificationChecked(true); // Auto-check verification
            }
        } catch (error) {
            console.error('OCR Error:', error);
            toast.error('Could not read ID card. Please verify manually.');
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
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'profile') => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (limit to 5MB before compression)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File is too large. Please select an image under 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const originalBase64 = reader.result as string;

                // Show "processing" toast for large images
                const processingToast = file.size > 1 * 1024 * 1024 ? toast.loading('Optimizing image...') : null;

                try {
                    const compressedBase64 = await compressImage(originalBase64);

                    if (processingToast) toast.dismiss(processingToast);

                    if (type === 'front') {
                        setIdCardFront(compressedBase64);
                        // Process OCR on front of card
                        processOCR(compressedBase64);
                    } else if (type === 'back') {
                        setIdCardBack(compressedBase64);
                    } else if (type === 'profile') {
                        setProfilePicture(compressedBase64);
                    }
                } catch (err) {
                    console.error('Compression failed', err);
                    if (processingToast) toast.dismiss(processingToast);
                    toast.error('Failed to process image');
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

    const queryClient = useQueryClient();

    const addFarmerMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (isEditMode && farmer?._id) {
                return api.put(`/farmers/${farmer._id}`, payload);
            } else {
                return api.post('/farmers', payload);
            }
        },
        onSuccess: async () => {
            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #065f46; margin: 15px 0;">
                            ${isEditMode ? 'Farmer profile updated successfully!' : 'Farmer onboarded successfully!'}
                        </p>
                    </div>
                `,
                confirmButtonText: 'Continue',
                confirmButtonColor: '#065f46',
                timer: 2000,
                timerProgressBar: true
            });
            queryClient.invalidateQueries({ queryKey: ['agentDashboardSummary'] });
            queryClient.invalidateQueries({ queryKey: ['agentFarmers'] });
            queryClient.invalidateQueries({ queryKey: ['farmers'] });
            onSuccess?.();
            onOpenChange?.(false);
            // Reset form
            setFormData({
                name: '', contact: '', gender: '', dob: '', language: '', otherLanguage: '', email: '',
                password: '', region: '', district: '', community: '', farmType: '', farmSize: '',
                yearsOfExperience: '', landOwnershipStatus: '', cropsGrown: '', livestockType: '', fieldNotes: '',
                investmentInterest: 'no', preferredInvestmentType: '', estimatedCapitalNeed: '',
                hasPreviousInvestment: false, investmentReadinessScore: 0, otherGender: '', otherDistrict: '',
                ghanaCardNumber: ''
            });
            setManualCommunity('');
            setIdCardFront('');
            setIdCardBack('');
            setStep(1);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create farmer account');
        }
    });

    const isSubmitting = addFarmerMutation.isPending;

    const handleSubmit = async () => {
        // Validation checks
        if (!certificationChecked) {
            toast.error('Please certify the verification of farmer information');
            return;
        }

        if (!idCardFront || !idCardBack) {
            toast.error('Please upload both sides of the Ghana Card');
            return;
        }

        // Strict Ghana Card validation - prevent saving if mismatch detected
        if (!isEditMode && ocrMismatch.length > 0) {
            const mismatchFields = ocrMismatch.map(field => field.charAt(0).toUpperCase() + field.slice(1)).join(' and ');
            Swal.fire({
                icon: 'error',
                title: 'Cannot Proceed with Onboarding',
                html: `
                    <div style="text-align: left; padding: 10px 0;">
                        <p style="margin-bottom: 15px; font-size: 16px; color: #1f2937;">
                            <strong>The Ghana Card credentials do not match the information you provided.</strong>
                        </p>
                        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 15px 0;">
                            <p style="margin: 0; color: #991b1b; font-weight: 600;">
                                Verification failed for: <span style="color: #dc2626;">${mismatchFields}</span>
                            </p>
                        </div>
                        <p style="margin-top: 15px; color: #4b5563; font-size: 14px;">
                            Please verify that the information on the Ghana Card matches exactly with the form data. 
                            You cannot proceed with onboarding until the credentials match.
                        </p>
                        <ul style="margin-top: 15px; padding-left: 20px; color: #6b7280; font-size: 14px;">
                            <li>Check the name on the Ghana Card</li>
                            <li>Verify the date of birth</li>
                            <li>Ensure all information is correctly entered</li>
                        </ul>
                    </div>
                `,
                confirmButtonText: 'I Understand',
                confirmButtonColor: '#ef4444',
                width: '650px'
            });
            return;
        }

        if (!idVerificationChecked) {
            Swal.fire({
                icon: 'warning',
                title: 'Verification Required',
                html: `
                    <div style="text-align: left; padding: 10px 0;">
                        <p style="margin-bottom: 15px; font-size: 16px; color: #1f2937;">
                            <strong>Please verify your Ghana Card information.</strong>
                        </p>
                        <p style="color: #4b5563; font-size: 14px; margin-bottom: 15px;">
                            You must confirm that the personal information (name, date of birth) on the Ghana Card matches 
                            the details you provided in this form by checking the verification checkbox.
                        </p>
                        <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 15px 0;">
                            <p style="margin: 0; color: #92400e; font-weight: 600;">
                                ✓ Check the "ID Verification" checkbox to confirm the information matches
                            </p>
                        </div>
                    </div>
                `,
                confirmButtonText: 'I Understand',
                confirmButtonColor: '#f59e0b',
                width: '600px'
            });
            return;
        }

        // Additional validation: If OCR data exists, ensure it matches
        if (!isEditMode && ocrData && formData.name && ocrData.name) {
            const normalizeName = (name: string) => name.toLowerCase().trim().replace(/\s+/g, ' ');
            const extractedNormalized = normalizeName(ocrData.name);
            const formNormalized = normalizeName(formData.name);
            
            const extractedWords = extractedNormalized.split(' ');
            const formWords = formNormalized.split(' ');
            const matchingWords = extractedWords.filter(word => 
                formWords.some(fw => fw.includes(word) || word.includes(fw))
            );
            
            const similarity = matchingWords.length / Math.max(extractedWords.length, formWords.length);
            
            if (similarity < 0.7) {
                setIdVerificationChecked(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Name Mismatch Detected',
                    html: `
                        <div style="text-align: left; padding: 10px 0;">
                            <p style="margin-bottom: 15px; font-size: 16px; color: #1f2937;">
                                <strong>The name on the Ghana Card does not match the name you provided.</strong>
                            </p>
                            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 15px 0;">
                                <p style="margin: 5px 0; color: #991b1b;">
                                    <strong>Card Name:</strong> <span style="color: #dc2626;">${ocrData.name}</span>
                                </p>
                                <p style="margin: 5px 0; color: #991b1b;">
                                    <strong>Form Name:</strong> <span style="color: #dc2626;">${formData.name}</span>
                                </p>
                            </div>
                            <p style="margin-top: 15px; color: #4b5563; font-size: 14px;">
                                Please verify the name on your Ghana Card and ensure it matches exactly with the name entered in the form. 
                                Names must match to proceed with onboarding.
                            </p>
                        </div>
                    `,
                    confirmButtonText: 'I Understand',
                    confirmButtonColor: '#ef4444',
                    width: '600px'
                });
                return;
            }
        }

        // Required field validation
        const requiredFields: Record<string, any> = {
            'Full Name': formData.name,
            'Phone Number': formData.contact,
            'Gender': formData.gender === 'other' ? formData.otherGender : formData.gender,
            'Date of Birth': formData.dob,
            'Ghana Card Number': formData.ghanaCardNumber,
            'Region': formData.region,
            'District': formData.district === 'other' ? formData.otherDistrict : formData.district,
            'Community': formData.community === 'Other (Specify)' ? manualCommunity : formData.community,
            'Farm Type': formData.farmType,
            'Experience Portfolio': formData.yearsOfExperience,
            'Land Stewardship': formData.landOwnershipStatus
        };

        // Password is auto-generated, no longer required from agent

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            toast.error(`Missing required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Validate Ghana Card Number format: GHA-XXXXXXXXX-X
        const ghanaCardRegex = /^GHA-\d{9}-\d$/;
        if (!ghanaCardRegex.test(formData.ghanaCardNumber)) {
            toast.error('Invalid Ghana Card format. Expected: GHA-XXXXXXXXX-X');
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

        const finalCommunity = formData.community === 'Other (Specify)' ? manualCommunity : formData.community;
        
        // Generate a temporary password if not provided (for agent-onboarded farmers)
        let tempPassword = formData.password;
        if (!isEditMode && !tempPassword) {
            // Generate a secure random password (farmer will be prompted to change on first login)
            tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        }
        
        const payload = {
            ...formData,
            gender: formData.gender === 'other' ? formData.otherGender : formData.gender,
            district: formData.district === 'other' ? formData.otherDistrict : formData.district,
            password: !isEditMode ? tempPassword : undefined, // Only send password for new farmers, not on edit
            community: finalCommunity,
            farmSize: Number(formData.farmSize),
            yearsOfExperience: Number(formData.yearsOfExperience),
            landOwnershipStatus: formData.landOwnershipStatus,
            cropsGrown: formData.cropsGrown,
            livestockType: formData.livestockType,
            estimatedCapitalNeed: formData.estimatedCapitalNeed ? Number(formData.estimatedCapitalNeed) : 0,
            investmentReadinessScore: Number(formData.investmentReadinessScore),
            ghanaCardNumber: formData.ghanaCardNumber,
            verificationConfirmed: certificationChecked,
            gpsLocation,
            profilePicture,
            idCardFront,
            idCardBack,
            status: 'active'
        };

        // Remove password from payload if editing (don't update password unless explicitly changed)
        if (isEditMode) {
            delete payload.password;
        }

        addFarmerMutation.mutate(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-6xl w-[95vw] sm:w-full h-[80vh] flex flex-col p-0 gap-0 bg-white dark:bg-[#002f37] border-none overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] z-[150]">
                {/* Solid Header with Subtle Pattern */}
                <div className="relative overflow-hidden shrink-0 bg-[#065f46]">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    
                    <div className="relative pt-6 px-8 pb-4">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shrink-0">
                                    <Plus className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <DialogTitle className="text-2xl font-black text-white tracking-tight">
                                        {isEditMode ? 'Update Grower' : 'Grower Onboarding'}
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-white/70">
                                        {isEditMode ? 'Refining operational data for registered farmers.' : 'Capturing new agricultural talent for the AgriLync Nexus network.'}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Premium Stepper */}
                        <div className="flex items-center justify-between mb-2 relative">
                            {[
                                { id: 1, label: 'Identify', icon: User },
                                { id: 2, label: 'Operation', icon: Sprout },
                                { id: 3, label: 'Capital', icon: Coins },
                                { id: 4, label: 'Validate', icon: FileText }
                            ].flatMap((s, idx) => {
                                const elements = [
                                    <div key={`step-${s.id}`} className="flex flex-col items-center gap-2 relative z-10">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                                            step >= s.id 
                                                ? 'bg-white text-[#065f46] border-white shadow-lg' 
                                                : 'bg-white/10 text-white/40 border-white/20'
                                        }`}>
                                            <s.icon className={`h-5 w-5 ${step === s.id ? 'animate-pulse' : ''}`} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                                            step >= s.id ? 'text-white' : 'text-white/30'
                                        }`}>
                                            {s.label}
                                        </span>
                                    </div>
                                ];

                                if (idx < 3) {
                                    elements.push(
                                        <div key={`sep-${s.id}`} className="flex-1 h-[2px] mb-6 mx-2 bg-white/10 relative">
                                            <div 
                                                className="absolute inset-0 bg-white transition-all duration-700 ease-in-out" 
                                                style={{ width: step > s.id ? '100%' : '0%' }}
                                            />
                                        </div>
                                    );
                                }

                                return elements;
                            })}
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-10 py-10 overflow-y-auto bg-gray-50/50 dark:bg-transparent">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-8 bg-[#065f46] rounded-full" />
                                    <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Identity & Bio</h3>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Section 1 of 4</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Profile Picture Column */}
                                <div className="lg:col-span-4 flex flex-col items-center">
                                    <div className="relative group">
                                        <div className={`w-40 h-40 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${profilePicture ? 'border-[#065f46] bg-[#065f46]/10 shadow-2xl shadow-[#065f46]/10' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#065f46]/40'}`}>
                                            {profilePicture ? (
                                                <img src={profilePicture} alt="Farmer Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                                                    <Camera className="w-10 h-10 mb-2 opacity-20 group-hover:opacity-100 transition-opacity" />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">Capture Bio</span>
                                                </div>
                                            )}
                                            <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-emerald-600/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
                                                <div className="bg-white p-2 rounded-full shadow-lg">
                                                    <Plus className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, 'profile')} disabled={!isEditable} />
                                            </label>
                                        </div>
                                        {profilePicture && isEditable && (
                                            <button
                                                onClick={() => setProfilePicture('')}
                                                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all hover:scale-110"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-4 uppercase tracking-widest text-center">Biometric Profile</p>
                                </div>

                                {/* Form Fields Column */}
                                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-white/5 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5">
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Full Name *</Label>
                                        <Input
                                            placeholder="Enter grower's legal name"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-emerald-500"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Contact Phone *</Label>
                                        <Input
                                            placeholder="+233 XX XXX XXXX"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            value={formData.contact}
                                            onChange={(e) => handleInputChange('contact', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Gender *</Label>
                                        <Select value={formData.gender} onValueChange={(val) => handleInputChange('gender', val)} disabled={!isEditable}>
                                            <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500">
                                                <SelectValue placeholder="Identify Gender" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other (Specify)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {formData.gender === 'other' && (
                                            <Input
                                                placeholder="Specify gender"
                                                className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 mt-2"
                                                value={formData.otherGender}
                                                onChange={(e) => handleInputChange('otherGender', e.target.value)}
                                                disabled={!isEditable}
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Ghana Card No. *</Label>
                                        <Input
                                            placeholder="GHA-XXXXXXXXX-X"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            value={formData.ghanaCardNumber}
                                            onChange={(e) => handleInputChange('ghanaCardNumber', e.target.value.toUpperCase())}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Birth Date *</Label>
                                        <Input
                                            type="date"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            value={formData.dob}
                                            onChange={(e) => handleInputChange('dob', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Email (Optional)</Label>
                                        <Input
                                            type="email"
                                            placeholder="grower@domain.com"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Farm Information */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-8 bg-[#065f46] rounded-full" />
                                    <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Agricultural Operation</h3>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Section 2 of 4</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-white/5 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Region Area *</Label>
                                    <Select 
                                        value={formData.region} 
                                        onValueChange={(val) => handleInputChange('region', val)} 
                                        disabled={true}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-100 cursor-not-allowed">
                                            <SelectValue placeholder={formData.region || "Operational Region"} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                            {Object.keys(GHANA_REGIONS).map(region => (
                                                <SelectItem key={region} value={region}>{region}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">District Jurisdiction *</Label>
                                    <Select
                                        value={formData.district}
                                        onValueChange={(val) => handleInputChange('district', val)}
                                        disabled={!formData.region || !isEditable}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-50">
                                            <SelectValue placeholder={formData.region ? "Identify District" : "Pending Region..."} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                            {formData.region && GHANA_REGIONS[formData.region]?.map(district => (
                                                <SelectItem key={district} value={district}>{district}</SelectItem>
                                            ))}
                                            <SelectItem value="other">Other (Specify)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formData.district === 'other' && (
                                        <Input
                                            placeholder="Specify district"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 mt-2"
                                            value={formData.otherDistrict || ''}
                                            onChange={(e) => handleInputChange('otherDistrict', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Community Hub *</Label>
                                    <Select
                                        value={formData.community}
                                        onValueChange={(val) => handleInputChange('community', val)}
                                        disabled={!formData.district || !isEditable}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-50">
                                            <SelectValue placeholder={formData.district ? "Select Local Hub" : "Pending District..."} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                            {formData.district && GHANA_COMMUNITIES[formData.district]?.map(community => (
                                                <SelectItem key={community} value={community}>{community}</SelectItem>
                                            ))}
                                            <SelectItem value="Other (Specify)">Other (Specify)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formData.community === 'Other (Specify)' && (
                                        <Input
                                            placeholder="Specify community hub"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 mt-2"
                                            value={manualCommunity}
                                            onChange={(e) => setManualCommunity(e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Preferred Language</Label>
                                    <Select
                                        value={formData.language}
                                        onValueChange={(val) => handleInputChange('language', val)}
                                        disabled={!formData.region || !isEditable}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-50">
                                            <SelectValue placeholder={formData.region ? "Primary Dialect" : "Pending Region..."} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                            {formData.region && GHANA_LANGUAGES[formData.region]?.map(lang => (
                                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                            ))}
                                            {(!formData.region || !GHANA_LANGUAGES[formData.region]?.includes('Dagbani')) &&
                                                <SelectItem value="Dagbani">Dagbani</SelectItem>
                                            }
                                            {(!formData.region || !GHANA_LANGUAGES[formData.region]?.includes('Ewe')) &&
                                                <SelectItem value="Ewe">Ewe</SelectItem>
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Agricultural Engine *</Label>
                                    <Select value={formData.farmType} onValueChange={(val) => handleInputChange('farmType', val)} disabled={!isEditable}>
                                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500">
                                            <SelectValue placeholder="System Type" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                            <SelectItem value="crop">Crop Cycle Management</SelectItem>
                                            <SelectItem value="livestock">Livestock Architecture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Operational Scale (Acres) *</Label>
                                    <Input
                                        type="number"
                                        placeholder="E.g., 25"
                                        className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500"
                                        value={formData.farmSize}
                                        onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                        disabled={formData.farmType === 'livestock' || !isEditable}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Experience Portfolio (Years) *</Label>
                                    <Input
                                        type="number"
                                        placeholder="E.g., 10"
                                        className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500"
                                        value={formData.yearsOfExperience}
                                        onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Land Stewardship Status *</Label>
                                    <Select 
                                        value={formData.landOwnershipStatus} 
                                        onValueChange={(val) => handleInputChange('landOwnershipStatus', val)} 
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500">
                                            <SelectValue placeholder="Ownership Tier" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                            <SelectItem value="owned">Legal Ownership</SelectItem>
                                            <SelectItem value="leased">Leasehold Agreement</SelectItem>
                                            <SelectItem value="rented">Rental Arrangement</SelectItem>
                                            <SelectItem value="communal">Communal/Stool Land</SelectItem>
                                            <SelectItem value="other">Other Status</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formData.farmType === 'crop' && (
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Primary Crop Cultivation *</Label>
                                        <Input
                                            placeholder="E.g., Cocoa, Maize, Cashew"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            value={formData.cropsGrown}
                                            onChange={(e) => handleInputChange('cropsGrown', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                )}
                                {formData.farmType === 'livestock' && (
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Livestock Portfolio *</Label>
                                        <Input
                                            placeholder="E.g., Poultry, Cattle, Piggery"
                                            className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            value={formData.livestockType}
                                            onChange={(e) => handleInputChange('livestockType', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
                                <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Geospatial Mapping</Label>
                                <div className="rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner">
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
                                <p className="text-[10px] font-medium text-gray-400 italic">Satellite-verified acreage will override manual entry for crop farms.</p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Investment & Financials */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-8 bg-[#065f46] rounded-full" />
                                    <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Economic Strategy</h3>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Section 3 of 4</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-white/5 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Investment Appetite *</Label>
                                    <Select value={formData.investmentInterest} onValueChange={(val) => handleInputChange('investmentInterest', val)} disabled={!isEditable}>
                                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500">
                                            <SelectValue placeholder="Commitment Level" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                            <SelectItem value="yes">Yes, Optimized Growth</SelectItem>
                                            <SelectItem value="maybe">Review Opportunities</SelectItem>
                                            <SelectItem value="no">Self-Sustaining Mode</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Growth Vehicle</Label>
                                    <Select
                                        value={formData.preferredInvestmentType}
                                        onValueChange={(val) => handleInputChange('preferredInvestmentType', val)}
                                        disabled={formData.investmentInterest === 'no' || !isEditable}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-50">
                                            <SelectValue placeholder="Resource Type" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-xl border-none shadow-2xl">
                                            <SelectItem value="inputs">Technical Inputs</SelectItem>
                                            <SelectItem value="cash">Capital Liquidity</SelectItem>
                                            <SelectItem value="equipment">Infrastructure/Tools</SelectItem>
                                            <SelectItem value="partnership">Strategic Equity</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Injected Capital Target (GHS)</Label>
                                    <Input
                                        type="number"
                                        placeholder="E.g., 25,000"
                                        className="h-12 bg-gray-50 dark:bg-white/5 border-none text-base font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                        value={formData.estimatedCapitalNeed}
                                        onChange={(e) => handleInputChange('estimatedCapitalNeed', e.target.value)}
                                        disabled={formData.investmentInterest === 'no' || !isEditable}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Market Readiness index ({formData.investmentReadinessScore}%)</Label>
                                    <div className="flex items-center gap-6 h-12 px-5 bg-gray-50 dark:bg-white/5 rounded-xl">
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            className="flex-1 accent-emerald-500"
                                            value={formData.investmentReadinessScore}
                                            onChange={(e) => handleInputChange('investmentReadinessScore', parseInt(e.target.value))}
                                            disabled={!isEditable}
                                        />
                                        <span className="text-base font-bold text-emerald-600 w-10 text-right">
                                            {formData.investmentReadinessScore}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="col-span-1 md:col-span-2 mt-4 p-6 bg-[#065f46]/5 rounded-[1.5rem] border border-[#065f46]/10 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
                                        <Coins className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="hasPreviousInvestment" className="text-sm font-black text-gray-900 dark:text-emerald-400 uppercase tracking-tight cursor-pointer">
                                                Elite Credit History
                                            </Label>
                                            <Checkbox
                                                id="hasPreviousInvestment"
                                                checked={formData.hasPreviousInvestment}
                                                onCheckedChange={(checked) => handleInputChange('hasPreviousInvestment', checked as boolean)}
                                                disabled={!isEditable}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                            Confirm whether this operator has a documented history of capital repayment or successful agricultural partnerships.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Documents & Final Review */}
                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-8 bg-[#065f46] rounded-full" />
                                    <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Final Validation</h3>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Section 4 of 4</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Ghana Card (Front) *</Label>
                                    <label className={`block group p-1 border-2 border-dashed ${idCardFront ? 'border-[#065f46]' : 'border-gray-200 dark:border-white/10 hover:border-[#065f46]'} rounded-[2.5rem] cursor-pointer transition-all duration-300`}>
                                        <div className={`flex flex-col items-center justify-center text-center min-h-[240px] rounded-[2.2rem] transition-colors ${idCardFront ? 'bg-[#065f46]/5' : 'bg-gray-50 dark:bg-white/5 group-hover:bg-[#065f46]/5'}`}>
                                            {idCardFront ? (
                                                <div className="relative w-full h-full p-4 overflow-hidden">
                                                    <img src={idCardFront} alt="Front Preview" className="w-full h-32 object-cover rounded-2xl shadow-lg border border-white/20" />
                                                    <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                                                        <CheckCircle2 className="h-4 w-4" /> Digital Record Captured
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="p-4 bg-white dark:bg-white/10 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                                        <Upload className="h-8 w-8 text-emerald-600" />
                                                    </div>
                                                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">Capture Front Side</span>
                                                </div>
                                            )}
                                        </div>
                                        <Input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, 'front')} disabled={!isEditable} />
                                    </label>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-bold uppercase text-gray-700 dark:text-gray-200 tracking-widest">Ghana Card (Back) *</Label>
                                    <label className={`block group p-1 border-2 border-dashed ${idCardBack ? 'border-[#065f46]' : 'border-gray-200 dark:border-white/10 hover:border-[#065f46]'} rounded-[2.5rem] cursor-pointer transition-all duration-300`}>
                                        <div className={`flex flex-col items-center justify-center text-center min-h-[240px] rounded-[2.2rem] transition-colors ${idCardBack ? 'bg-[#065f46]/5' : 'bg-gray-50 dark:bg-white/5 group-hover:bg-[#065f46]/5'}`}>
                                            {idCardBack ? (
                                                <div className="relative w-full h-full p-4 overflow-hidden">
                                                    <img src={idCardBack} alt="Back Preview" className="w-full h-32 object-cover rounded-2xl shadow-lg border border-white/20" />
                                                    <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                                                        <CheckCircle2 className="h-4 w-4" /> Digital Record Captured
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="p-4 bg-white dark:bg-white/10 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                                        <Upload className="h-8 w-8 text-emerald-600" />
                                                    </div>
                                                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">Capture Back Side</span>
                                                </div>
                                            )}
                                        </div>
                                        <Input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, 'back')} disabled={!isEditable} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Textarea
                                    placeholder="Operational field notes or specific grower observations..."
                                    className="min-h-[140px] bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 rounded-[1.5rem] shadow-sm p-6 text-sm resize-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.fieldNotes}
                                    onChange={(e) => handleInputChange('fieldNotes', e.target.value)}
                                    disabled={!isEditable}
                                />

                                <div className="space-y-4">
                                    <div className="flex items-start gap-5 p-6 bg-white dark:bg-white/5 rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm group hover:border-emerald-500/30 transition-colors">
                                        <Checkbox
                                            id="idVerification"
                                            className="mt-1 h-5 w-5 rounded-md border-gray-300"
                                            checked={idVerificationChecked}
                                            onCheckedChange={(checked) => setIdVerificationChecked(checked as boolean)}
                                            disabled={!isEditable}
                                        />
                                        <div className="space-y-1">
                                            <Label htmlFor="idVerification" className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight cursor-pointer">ID Fidelity Confirmation</Label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">I verify that the biometric data and identity credentials on the Ghana Card exactly match the physical subject.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5 p-6 bg-emerald-600/5 dark:bg-emerald-500/10 rounded-[1.5rem] border border-emerald-600/10 shadow-sm group hover:border-emerald-500/30 transition-colors">
                                        <Checkbox
                                            id="certification"
                                            className="mt-1 h-5 w-5 rounded-md border-emerald-600"
                                            checked={certificationChecked}
                                            onCheckedChange={(checked) => setCertificationChecked(checked as boolean)}
                                            disabled={!isEditable}
                                        />
                                        <div className="space-y-1">
                                            <Label htmlFor="certification" className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-tight cursor-pointer">Protocol Certification</Label>
                                            <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 font-medium">As a certified field agent, I attest that the operation has been physically inspected and complies with AgriLync standards.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="p-10 border-t dark:border-gray-800 bg-gray-50/50 dark:bg-[#0b2528] flex items-center justify-between shrink-0">
                    <Button
                        variant="ghost"
                        onClick={step === 1 ? () => onOpenChange?.(false) : prevStep}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-black uppercase tracking-widest text-[10px]"
                        disabled={isSubmitting}
                    >
                        {step === 1 ? <X className="h-4 w-4 mr-2" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                        {step === 1 ? 'Discard' : 'Go Back'}
                    </Button>

                    <div className="flex items-center gap-4">
                        {isEditMode && !isEditable && (
                            <Button
                                onClick={() => setIsEditable(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-12 px-10 rounded-2xl shadow-2xl shadow-indigo-600/20 uppercase tracking-widest text-[11px]"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Entry
                            </Button>
                        )}
                        {step < 4 ? (
                            <Button
                                onClick={nextStep}
                                className="bg-[#065f46] hover:bg-[#065f46]/90 text-white font-black h-12 px-10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(5,150,105,0.4)] uppercase tracking-widest text-[11px] group border-none"
                            >
                                Next Strategy
                                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isEditable}
                                className={`bg-[#065f46] hover:bg-[#065f46]/90 text-white font-black h-12 px-10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(5,150,105,0.4)] uppercase tracking-widest text-[11px] ${isEditable && !isSubmitting ? 'animate-pulse' : ''} disabled:opacity-50 border-none`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ARCHIVING...
                                    </>
                                ) : (
                                    <>
                                        {isEditMode ? (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Sync Update
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Deploy Profile
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




