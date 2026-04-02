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
    Coins,
    ShieldCheck
} from 'lucide-react';
import { GHANA_REGIONS, GHANA_LANGUAGES, GHANA_COMMUNITIES, getRegionKey } from '@/data/ghanaRegions';

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
        region: getRegionKey(agent?.region),
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
                    region: getRegionKey(farmer.region || agent?.region),
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
                password: '', region: getRegionKey(agent?.region), district: '', community: '', farmType: '', farmSize: '',
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
        onSuccess: async (response: any) => {
            const savedFarmer = response.data;
            const lyncId = savedFarmer?.id || savedFarmer?.ghanaCardNumber || 'N/A';
            
            await Swal.fire({
                icon: 'success',
                title: 'Onboarding Finalized',
                html: `
                    <div style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 18px; color: #065f46; margin: 0 0 15px 0; font-weight: 800;">
                            ${isEditMode ? 'Farmer profile updated successfully!' : 'Farmer onboarded successfully!'}
                        </p>
                        <div style="background: #f0fdf4; border: 2px dashed #059669; padding: 15px; border-radius: 12px; margin: 15px 0;">
                            <p style="text-transform: uppercase; font-size: 10px; font-weight: 800; color: #059669; margin-bottom: 5px; letter-spacing: 2px;">Assigned Lync ID</p>
                            <p style="font-size: 24px; font-family: monospace; font-weight: 900; color: #064e3b; margin: 0;">${lyncId}</p>
                        </div>
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

    const steps = [
        { id: 1, label: 'Identify', sub: 'Bio & personal info', icon: User },
        { id: 2, label: 'Operation', sub: 'Farm location details', icon: Sprout },
        { id: 3, label: 'Capital', sub: 'Investment & financials', icon: Coins },
        { id: 4, label: 'Validate', sub: 'Review and submit', icon: FileText }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-w-5xl w-[96vw] sm:w-full max-h-[95vh] flex flex-col p-0 gap-0 bg-white dark:bg-[#002f37] border-none overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] z-[150] font-outfit">

                {/* Top Interactive Progress Indicator */}
                <div className="h-1.5 bg-gray-50 dark:bg-white/5 shrink-0 relative overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#065f46] to-[#059669] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        style={{ width: `${(step / steps.length) * 100}%` }}
                    />
                </div>

                {/* Main layout: sidebar + content */}
                <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-hidden">

                    {/* ── LEFT SIDEBAR ── */}
                    <div className="sm:w-72 shrink-0 bg-[#F9FAFB] dark:bg-[#001e24]/50 backdrop-blur-xl border-b sm:border-b-0 sm:border-r border-gray-100/80 dark:border-white/5 flex flex-col">

                        {/* Brand header */}
                        <div className="p-8 border-b border-gray-100/80 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#059669] shrink-0 shadow-lg shadow-emerald-900/20">
                                    <Leaf className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-[#065f46] uppercase tracking-[0.2em]">AgriLync</p>
                                    <DialogTitle className="text-base font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                                        {isEditMode ? 'Update Profile' : 'Grower Onboarding'}
                                    </DialogTitle>
                                    <DialogDescription className="text-[11px] font-medium text-gray-400 dark:text-gray-500 leading-tight">
                                        {isEditMode ? 'Refine operational data' : `Step ${step} of ${steps.length} completed`}
                                    </DialogDescription>
                                </div>
                            </div>
                        </div>

                        {/* Step list — optimized for visual clarity */}
                        <div className="flex sm:flex-col gap-2 p-4 overflow-x-auto sm:overflow-x-visible sm:flex-1 mt-4">
                            {steps.map((s) => {
                                const Icon = s.icon;
                                const isActive = step === s.id;
                                const isDone = step > s.id;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setStep(s.id)}
                                        className={`flex items-center gap-4 rounded-[1.25rem] px-4 py-4 transition-all duration-300 shrink-0 sm:shrink text-left relative group ${
                                            isActive
                                                ? 'bg-white dark:bg-white/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] scale-[1.02]'
                                                : 'bg-transparent hover:bg-white/50 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#065f46] rounded-r-full" />
                                        )}
                                        
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm transition-all duration-500 ${
                                            isActive
                                                ? 'bg-[#065f46] text-white shadow-lg shadow-emerald-900/20 rotate-[360deg]'
                                                : isDone
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/20 text-[#065f46]'
                                                    : 'bg-gray-200/50 dark:bg-white/10 text-gray-400 dark:text-gray-500'
                                        }`}>
                                            {isDone ? <CheckCircle2 className="h-5 w-5" /> : s.id}
                                        </div>
                                        
                                        <div className="hidden sm:block">
                                            <p className={`text-xs font-black uppercase tracking-widest leading-tight mb-0.5 ${
                                                isActive ? 'text-gray-900 dark:text-white' : isDone ? 'text-[#065f46]' : 'text-gray-400 dark:text-gray-600'
                                            }`}>{s.label}</p>
                                            <p className={`text-[10px] font-semibold leading-tight ${
                                                isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-700'
                                            }`}>{s.sub}</p>
                                        </div>
                                        
                                        <p className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${
                                            isActive ? 'text-gray-900 dark:text-white' : isDone ? 'text-[#065f46]' : 'text-gray-400'
                                        }`}>{s.label}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Step counter — only on desktop */}
                        <div className="hidden sm:block px-4 pb-5 mt-auto">
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Step {step} of {steps.length}</p>
                        </div>
                    </div>

                    {/* ── RIGHT CONTENT ── */}
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

                        {/* Section heading */}
                        <div className="px-8 sm:px-12 pt-10 pb-4 shrink-0 transition-all duration-500">
                            <p className="text-[11px] font-black text-[#059669] uppercase tracking-[0.25em] mb-1">
                                Step {step}/{steps.length}
                            </p>
                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">
                                {steps[step - 1]?.label}
                            </h2>
                            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">{steps[step - 1]?.sub}</p>
                        </div>

                        <ScrollArea className="flex-1 px-5 sm:px-8 py-6 overflow-y-auto">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

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
                                                   {/* Form Fields Column */}
                                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 bg-[#F8F9FB] dark:bg-white/5 p-12 rounded-[3.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-gray-100/50 dark:border-white/5">
                                    <div className="space-y-3 col-span-2">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Full Name *</Label>
                                        <Input
                                            placeholder="Enter grower's legal name"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Contact Phone *</Label>
                                        <Input
                                            placeholder="+233 XX XXX XXXX"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
                                            value={formData.contact}
                                            onChange={(e) => handleInputChange('contact', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Gender *</Label>
                                        <Select value={formData.gender} onValueChange={(val) => handleInputChange('gender', val)} disabled={!isEditable}>
                                            <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all">
                                                <SelectValue placeholder="Identify Gender" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                                <SelectItem value="male" className="rounded-xl py-3 font-bold">Male</SelectItem>
                                                <SelectItem value="female" className="rounded-xl py-3 font-bold">Female</SelectItem>
                                                <SelectItem value="other" className="rounded-xl py-3 font-bold">Other (Specify)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {formData.gender === 'other' && (
                                            <Input
                                                placeholder="Specify gender"
                                                className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 mt-2 placeholder:text-gray-300"
                                                value={formData.otherGender}
                                                onChange={(e) => handleInputChange('otherGender', e.target.value)}
                                                disabled={!isEditable}
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Ghana Card No. *</Label>
                                        <Input
                                            placeholder="GHA-XXXXXXXXX-X"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
                                            value={formData.ghanaCardNumber}
                                            onChange={(e) => handleInputChange('ghanaCardNumber', e.target.value.toUpperCase())}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Birth Date *</Label>
                                        <Input
                                            type="date"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            value={formData.dob}
                                            onChange={(e) => handleInputChange('dob', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                    <div className="space-y-3 col-span-2 md:col-span-1">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Email (Optional)</Label>
                                        <Input
                                            type="email"
                                            placeholder="grower@domain.com"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                </div>
                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Farm Information */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 ease-out">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 bg-[#F8F9FB] dark:bg-white/5 p-12 rounded-[3.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-gray-100/50 dark:border-white/5">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Region Area *</Label>
                                    <Select 
                                        value={formData.region} 
                                        onValueChange={(val) => handleInputChange('region', val)} 
                                        disabled={true}
                                    >
                                        <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-100 cursor-not-allowed">
                                            <SelectValue placeholder={formData.region || "Operational Region"} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                            {Object.keys(GHANA_REGIONS).map(region => (
                                                <SelectItem key={region} value={region} className="rounded-xl py-3 font-bold">{region}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">District Jurisdiction *</Label>
                                    <Select
                                        value={formData.district}
                                        onValueChange={(val) => handleInputChange('district', val)}
                                        disabled={!formData.region || !isEditable}
                                    >
                                        <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all">
                                            <SelectValue placeholder={formData.region ? "Identify District" : "Pending Region..."} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                            {formData.region && GHANA_REGIONS[formData.region]?.map(district => (
                                                <SelectItem key={district} value={district} className="rounded-xl py-3 font-bold">{district}</SelectItem>
                                            ))}
                                            <SelectItem value="other" className="rounded-xl py-3 font-bold text-emerald-600">Other (Specify)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formData.district === 'other' && (
                                        <Input
                                            placeholder="Specify district"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 mt-2 placeholder:text-gray-300"
                                            value={formData.otherDistrict || ''}
                                            onChange={(e) => handleInputChange('otherDistrict', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Community Hub *</Label>
                                    <Select
                                        value={formData.community}
                                        onValueChange={(val) => handleInputChange('community', val)}
                                        disabled={!formData.district || !isEditable}
                                    >
                                        <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all">
                                            <SelectValue placeholder={formData.district ? "Select Local Hub" : "Pending District..."} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                            {formData.district && GHANA_COMMUNITIES[formData.district]?.map(community => (
                                                <SelectItem key={community} value={community} className="rounded-xl py-3 font-bold">{community}</SelectItem>
                                            ))}
                                            <SelectItem value="Other (Specify)" className="rounded-xl py-3 font-bold text-emerald-600">Other (Specify)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formData.community === 'Other (Specify)' && (
                                        <Input
                                            placeholder="Specify community hub"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 mt-2 placeholder:text-gray-300"
                                            value={manualCommunity}
                                            onChange={(e) => setManualCommunity(e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Preferred Language</Label>
                                    <Select
                                        value={formData.language}
                                        onValueChange={(val) => handleInputChange('language', val)}
                                        disabled={!formData.region || !isEditable}
                                    >
                                        <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all">
                                            <SelectValue placeholder={formData.region ? "Primary Dialect" : "Pending Region..."} />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                            {formData.region && GHANA_LANGUAGES[formData.region]?.map(lang => (
                                                <SelectItem key={lang} value={lang} className="rounded-xl py-3 font-bold">{lang}</SelectItem>
                                            ))}
                                            <SelectItem value="Dagbani" className="rounded-xl py-3 font-bold">Dagbani</SelectItem>
                                            <SelectItem value="Ewe" className="rounded-xl py-3 font-bold">Ewe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Agricultural Engine *</Label>
                                    <Select value={formData.farmType} onValueChange={(val) => handleInputChange('farmType', val)} disabled={!isEditable}>
                                        <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all">
                                            <SelectValue placeholder="System Type" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                            <SelectItem value="crop" className="rounded-xl py-3 font-bold">Crop Cycle Management</SelectItem>
                                            <SelectItem value="livestock" className="rounded-xl py-3 font-bold">Livestock Architecture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Scale (Acres) *</Label>
                                    <Input
                                        type="number"
                                        placeholder="E.g., 25"
                                        className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
                                        value={formData.farmSize}
                                        onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                        disabled={formData.farmType === 'livestock' || !isEditable}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Portfolio (Years) *</Label>
                                    <Input
                                        type="number"
                                        placeholder="E.g., 10"
                                        className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
                                        value={formData.yearsOfExperience}
                                        onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Land Stewardship *</Label>
                                    <Select 
                                        value={formData.landOwnershipStatus} 
                                        onValueChange={(val) => handleInputChange('landOwnershipStatus', val)} 
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all">
                                            <SelectValue placeholder="Ownership Tier" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                            <SelectItem value="owned" className="rounded-xl py-3 font-bold">Legal Ownership</SelectItem>
                                            <SelectItem value="leased" className="rounded-xl py-3 font-bold">Leasehold Agreement</SelectItem>
                                            <SelectItem value="rented" className="rounded-xl py-3 font-bold">Rental Arrangement</SelectItem>
                                            <SelectItem value="communal" className="rounded-xl py-3 font-bold">Communal/Stool Land</SelectItem>
                                            <SelectItem value="other" className="rounded-xl py-3 font-bold">Other Status</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formData.farmType === 'crop' && (
                                    <div className="space-y-3 col-span-1 md:col-span-2">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Primary Crop Cultivation *</Label>
                                        <Input
                                            placeholder="E.g., Cocoa, Maize, Cashew"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
                                            value={formData.cropsGrown}
                                            onChange={(e) => handleInputChange('cropsGrown', e.target.value)}
                                            disabled={!isEditable}
                                        />
                                    </div>
                                )}
                                {formData.farmType === 'livestock' && (
                                    <div className="space-y-3 col-span-1 md:col-span-2">
                                        <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Livestock Portfolio *</Label>
                                        <Input
                                            placeholder="E.g., Poultry, Cattle, Piggery"
                                            className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
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
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 ease-out">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 bg-[#F8F9FB] dark:bg-white/5 p-12 rounded-[3.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-gray-100/50 dark:border-white/5">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Investment Appetite *</Label>
                                    <Select value={formData.investmentInterest} onValueChange={(val) => handleInputChange('investmentInterest', val)} disabled={!isEditable}>
                                        <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all">
                                            <SelectValue placeholder="Commitment Level" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                            <SelectItem value="yes" className="rounded-xl py-3 font-bold">Yes, Optimized Growth</SelectItem>
                                            <SelectItem value="maybe" className="rounded-xl py-3 font-bold">Review Opportunities</SelectItem>
                                            <SelectItem value="no" className="rounded-xl py-3 font-bold">Self-Sustaining Mode</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Growth Vehicle</Label>
                                    <Select
                                        value={formData.preferredInvestmentType}
                                        onValueChange={(val) => handleInputChange('preferredInvestmentType', val)}
                                        disabled={formData.investmentInterest === 'no' || !isEditable}
                                    >
                                        <SelectTrigger className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50">
                                            <SelectValue placeholder="Resource Type" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[2000] rounded-[1.5rem] border-none shadow-2xl p-2">
                                            <SelectItem value="inputs" className="rounded-xl py-3 font-bold">Technical Inputs</SelectItem>
                                            <SelectItem value="cash" className="rounded-xl py-3 font-bold">Capital Liquidity</SelectItem>
                                            <SelectItem value="equipment" className="rounded-xl py-3 font-bold">Infrastructure/Tools</SelectItem>
                                            <SelectItem value="partnership" className="rounded-xl py-3 font-bold">Strategic Equity</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Capital Target (GHS)</Label>
                                    <Input
                                        type="number"
                                        placeholder="E.g., 25,000"
                                        className="h-16 px-6 bg-white dark:bg-white/5 border-none text-lg font-bold rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50 placeholder:text-gray-300"
                                        value={formData.estimatedCapitalNeed}
                                        onChange={(e) => handleInputChange('estimatedCapitalNeed', e.target.value)}
                                        disabled={formData.investmentInterest === 'no' || !isEditable}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Market Readiness index ({formData.investmentReadinessScore}%)</Label>
                                    <div className="flex items-center gap-6 h-16 px-6 bg-white dark:bg-white/5 rounded-2xl shadow-sm">
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            className="flex-1 accent-emerald-500 cursor-pointer"
                                            value={formData.investmentReadinessScore}
                                            onChange={(e) => handleInputChange('investmentReadinessScore', parseInt(e.target.value))}
                                            disabled={!isEditable}
                                        />
                                        <span className="text-lg font-black text-emerald-600 w-12 text-right">
                                            {formData.investmentReadinessScore}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="col-span-1 md:col-span-2 mt-4 p-8 bg-[#065f46]/5 dark:bg-[#065f46]/10 rounded-[2.5rem] border border-[#065f46]/10 flex items-start gap-6 shadow-inner">
                                    <div className="h-14 w-14 rounded-[1.25rem] bg-gradient-to-br from-[#065f46] to-[#059669] flex items-center justify-center shrink-0 shadow-xl shadow-emerald-900/20">
                                        <Coins className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="hasPreviousInvestment" className="text-base font-black text-gray-900 dark:text-emerald-400 uppercase tracking-tight cursor-pointer">
                                                Elite Credit History
                                            </Label>
                                            <Checkbox
                                                id="hasPreviousInvestment"
                                                className="h-6 w-6 rounded-lg border-2 border-[#065f46]"
                                                checked={formData.hasPreviousInvestment}
                                                onCheckedChange={(checked) => handleInputChange('hasPreviousInvestment', checked as boolean)}
                                                disabled={!isEditable}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                                            Confirm whether this operator has a documented history of capital repayment or successful agricultural partnerships.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Documents & Final Review */}
                    {step === 4 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 ease-out">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Ghana Card (Front) *</Label>
                                    <label className={`block group p-1 border-2 border-dashed ${idCardFront ? 'border-[#065f46]' : 'border-gray-200 dark:border-white/10 hover:border-[#065f46]'} rounded-[3rem] cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10`}>
                                        <div className={`flex flex-col items-center justify-center text-center min-h-[280px] rounded-[2.8rem] transition-all duration-500 ${idCardFront ? 'bg-[#065f46]/5 blur-[0.5px] hover:blur-0' : 'bg-[#F8F9FB] dark:bg-white/5 group-hover:bg-[#065f46]/5'}`}>
                                            {idCardFront ? (
                                                <div className="relative w-full h-full p-6 flex flex-col items-center gap-4">
                                                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
                                                        <img src={idCardFront} alt="Front Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                                                            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                                                                <ShieldCheck className="h-3 w-3 text-white" />
                                                                <span className="text-[10px] text-white font-black uppercase tracking-widest">Secure Scan</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[#065f46] font-black text-[11px] uppercase tracking-tighter bg-emerald-100/50 dark:bg-emerald-900/20 px-4 py-2 rounded-full">
                                                        <CheckCircle2 className="h-4 w-4" /> Identification Locked
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="h-20 w-20 rounded-3xl bg-white dark:bg-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                                        <Camera className="h-10 w-10 text-emerald-600" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Capture Front Side</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tap to enable camera</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, 'front')} disabled={!isEditable} />
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Ghana Card (Back) *</Label>
                                    <label className={`block group p-1 border-2 border-dashed ${idCardBack ? 'border-[#065f46]' : 'border-gray-200 dark:border-white/10 hover:border-[#065f46]'} rounded-[3rem] cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10`}>
                                        <div className={`flex flex-col items-center justify-center text-center min-h-[280px] rounded-[2.8rem] transition-all duration-500 ${idCardBack ? 'bg-[#065f46]/5 blur-[0.5px] hover:blur-0' : 'bg-[#F8F9FB] dark:bg-white/5 group-hover:bg-[#065f46]/5'}`}>
                                            {idCardBack ? (
                                                <div className="relative w-full h-full p-6 flex flex-col items-center gap-4">
                                                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
                                                        <img src={idCardBack} alt="Back Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                                                            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                                                                <ShieldCheck className="h-3 w-3 text-white" />
                                                                <span className="text-[10px] text-white font-black uppercase tracking-widest">Metadata Verify</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[#065f46] font-black text-[11px] uppercase tracking-tighter bg-emerald-100/50 dark:bg-emerald-900/20 px-4 py-2 rounded-full">
                                                        <CheckCircle2 className="h-4 w-4" /> Signature Captured
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="h-20 w-20 rounded-3xl bg-white dark:bg-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                                                        <Camera className="h-10 w-10 text-emerald-600" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Capture Back Side</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tap to enable camera</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, 'back')} disabled={!isEditable} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-[0.15em] ml-1">Agent Field Intelligence</Label>
                                    <Textarea
                                        placeholder="Enter operational field notes, specific grower behavioral observations, or infrastructure health status..."
                                        className="min-h-[160px] bg-[#F8F9FB] dark:bg-white/5 border-none rounded-[2rem] shadow-inner p-8 text-base font-medium placeholder:text-gray-300 focus:ring-4 focus:ring-emerald-500/10 resize-none transition-all"
                                        value={formData.fieldNotes}
                                        onChange={(e) => handleInputChange('fieldNotes', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-6 p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm group hover:border-[#065f46]/30 transition-all duration-500">
                                        <Checkbox
                                            id="idVerification"
                                            className="mt-1 h-6 w-6 rounded-lg border-2 border-gray-200 checked:bg-[#065f46]"
                                            checked={idVerificationChecked}
                                            onCheckedChange={(checked) => setIdVerificationChecked(checked as boolean)}
                                            disabled={!isEditable}
                                        />
                                        <div className="space-y-2">
                                            <Label htmlFor="idVerification" className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight cursor-pointer">ID Fidelity Confirmation</Label>
                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold leading-relaxed">I verify that the biometric data and identity credentials on the Ghana Card exactly match the physical subject.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 p-8 bg-emerald-600/5 dark:bg-emerald-500/10 rounded-[2.5rem] border border-emerald-600/10 shadow-sm group hover:border-emerald-500/30 transition-all duration-500">
                                        <Checkbox
                                            id="certification"
                                            className="mt-1 h-6 w-6 rounded-lg border-2 border-emerald-600 checked:bg-[#065f46]"
                                            checked={certificationChecked}
                                            onCheckedChange={(checked) => setCertificationChecked(checked as boolean)}
                                            disabled={!isEditable}
                                        />
                                        <div className="space-y-2">
                                            <Label htmlFor="certification" className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-tight cursor-pointer">Protocol Certification</Label>
                                            <p className="text-[11px] text-emerald-700/60 dark:text-emerald-400/60 font-bold leading-relaxed">As a certified field agent, I attest that the operation has been physically inspected and complies with AgriLync standards.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                        </ScrollArea>

                        {/* Footer */}
                        <div className="px-8 sm:px-12 py-8 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#001e24] flex items-center justify-between shrink-0">
                            <Button
                                variant="ghost"
                                onClick={step === 1 ? () => onOpenChange?.(false) : prevStep}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-black uppercase tracking-widest text-[10px] h-14 px-8 rounded-2xl transition-all duration-300"
                                disabled={isSubmitting}
                            >
                                {step === 1 ? <X className="h-4 w-4 mr-2" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                                {step === 1 ? 'Discard' : 'Go Back'}
                            </Button>

                            <div className="flex items-center gap-4">
                                {isEditMode && !isEditable && (
                                    <Button
                                        onClick={() => setIsEditable(true)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 px-8 rounded-2xl shadow-lg shadow-indigo-600/20 uppercase tracking-widest text-[10px]"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Unlock Profile
                                    </Button>
                                )}
                                {step < 4 ? (
                                    <Button
                                        onClick={nextStep}
                                        className="bg-gradient-to-br from-[#065f46] to-[#059669] hover:brightness-110 text-white font-black h-14 px-10 rounded-2xl shadow-[0_15px_30px_-10px_rgba(5,150,105,0.4)] uppercase tracking-[0.15em] text-[11px] group border-none transition-all duration-500 active:scale-95"
                                    >
                                        Next Component
                                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !isEditable}
                                        className={`bg-gradient-to-br from-[#065f46] to-[#059669] hover:brightness-110 text-white font-black h-14 px-10 rounded-2xl shadow-[0_15px_30px_-10px_rgba(5,150,105,0.4)] uppercase tracking-[0.15em] text-[11px] disabled:opacity-50 border-none transition-all duration-500 active:scale-95`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {isEditMode ? (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Update Operation
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
                        </div>

                    </div>{/* end right content */}
                </div>{/* end flex row */}
            </DialogContent>
        </Dialog>
    );
};

export default AddFarmerModal;




