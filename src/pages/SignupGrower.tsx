import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Phone, Sprout } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { GHANA_CROPS } from '@/data/ghanaCrops';
import {
    getRegionKey,
    SIGNUP_REGION_OPTIONS,
    GHANA_REGION_SIGNUP_LABELS,
    GHANA_REGIONS,
    getCommunitiesForRegion,
} from '@/data/ghanaRegions';
import { persistGrowerSession } from '@/utils/authToken';

const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const SignupGrower = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        language: '',
        farmRegion: '',
        farmDistrict: '',
        farmCommunity: '',
        customCommunity: '',
        yearsOfExperience: '',
        farmType: '',
        farmSize: '',
        landOwnershipStatus: '',
        investmentInterest: 'maybe',
        ghanaCardNumber: '',
        acceptTerms: false,
        acceptDataPolicy: false,
    });
    const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
    const [cropsGrownOther, setCropsGrownOther] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [idCardFront, setIdCardFront] = useState('');
    const [idCardBack, setIdCardBack] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [activeTab, setActiveTab] = useState('personal');

    const regionKey = formData.farmRegion ? getRegionKey(formData.farmRegion) : '';
    const districtOptions = useMemo(
        () => (regionKey ? GHANA_REGIONS[regionKey] || [] : []),
        [regionKey]
    );
    const communityOptions = useMemo(
        () => getCommunitiesForRegion(regionKey),
        [regionKey]
    );

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleCrop = (crop: string) => {
        setSelectedCrops((prev) =>
            prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
        );
    };

    const handleImageUpload = async (file: File | null, setter: (v: string) => void) => {
        if (!file) return;
        try {
            const dataUrl = await readFileAsDataUrl(file);
            setter(dataUrl);
            toast.success('Photo attached');
        } catch {
            toast.error('Could not read image file');
        }
    };

    const sendOTP = () => {
        if (!formData.phone) {
            toast.error('Enter your phone number first');
            return;
        }
        setOtpSent(true);
        toast.info('OTP sent (use 1234 for demo)');
    };

    const verifyOTP = () => otpCode === '1234';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (!verifyOTP()) {
            toast.error('Please enter the correct OTP code (demo: 1234)');
            return;
        }
        if (!formData.ghanaCardNumber.trim()) {
            toast.error('Ghana Card number is required');
            return;
        }
        if (!idCardFront || !idCardBack) {
            toast.error('Ghana Card front and back photos are required');
            return;
        }

        const community =
            formData.farmCommunity === '__other__'
                ? formData.customCommunity.trim()
                : formData.farmCommunity;

        if (!community) {
            toast.error('Community is required');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                name: formData.fullName.trim(),
                gender: formData.gender,
                dob: formData.dateOfBirth,
                contact: formData.phone.trim(),
                email: formData.email.trim() || undefined,
                password: formData.password,
                language: formData.language || undefined,
                region: getRegionKey(formData.farmRegion),
                district: formData.farmDistrict,
                community,
                farmType: formData.farmType || 'crop',
                yearsOfExperience: formData.yearsOfExperience
                    ? Number(formData.yearsOfExperience)
                    : undefined,
                farmSize: formData.farmSize ? Number(formData.farmSize) : undefined,
                landOwnershipStatus: formData.landOwnershipStatus || undefined,
                cropList: selectedCrops,
                cropsGrownOther: selectedCrops.includes('Other') ? cropsGrownOther : '',
                investmentInterest: formData.investmentInterest,
                ghanaCardNumber: formData.ghanaCardNumber.trim().toUpperCase(),
                profilePicture: profilePicture || undefined,
                idCardFront,
                idCardBack,
                onboardingSource: 'self',
            };

            const res = await api.post('/farmers/public/register', payload);

            if (res.data.success) {
                const agentNote = res.data.verificationAgent
                    ? `<p style="font-size:14px;color:#4b5563;margin-top:12px;">Your nearest field agent <b>${res.data.verificationAgent.name}</b> (${res.data.verificationAgent.agentId}) will review your profile.</p>`
                    : '<p style="font-size:14px;color:#4b5563;margin-top:12px;">A field agent in your region will review your profile shortly.</p>';

                await Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    html: `
                        <div style="text-align:center;padding:8px 0;">
                            <p style="font-size:16px;color:#059669;margin:12px 0;">
                                Your Lync Grower ID: <b>${res.data.lyncId || 'Pending'}</b>
                            </p>
                            <p style="font-size:14px;color:#4b5563;">
                                Status: <b>Pending verification</b> — you can sign in now while your profile is reviewed.
                            </p>
                            ${agentNote}
                        </div>
                    `,
                    confirmButtonText: 'Sign In',
                    confirmButtonColor: '#7ede56',
                });

                try {
                    const loginRes = await api.post('/farmers/auth/login', {
                        email: formData.phone.trim(),
                        password: formData.password,
                    });
                    persistGrowerSession(loginRes.data.token, loginRes.data.farmer);
                    navigate('/dashboard/grower');
                } catch {
                    navigate('/login');
                }
            }
        } catch (err: any) {
            console.error('Grower registration error:', err);
            toast.error(err.response?.data?.msg || 'Registration failed. Please check your details.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-manrope">
            <Navbar variant="light" />

            <div className="max-w-5xl mx-auto px-4 pt-24 pb-8">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate('/signup')} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Role Selection
                    </Button>
                    <div className="flex items-center gap-3">
                        <Users className="h-10 w-10 text-[#7ede56]" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lync Grower Registration</h1>
                            <p className="text-gray-600">
                                Same onboarding data as agent-led registration — routed to your nearest field agent for verification
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                        <CardTitle className="text-2xl">Create Your Grower Account</CardTitle>
                        <CardDescription>4 steps — identity, farm, capital interest, and Ghana Card verification</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit}>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                                    <TabsTrigger value="personal">Identity</TabsTrigger>
                                    <TabsTrigger value="farm">Farm</TabsTrigger>
                                    <TabsTrigger value="capital">Capital</TabsTrigger>
                                    <TabsTrigger value="documents">Validate</TabsTrigger>
                                </TabsList>

                                <TabsContent value="personal" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Full name *</Label>
                                            <Input
                                                value={formData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                placeholder="As on Ghana Card"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Gender *</Label>
                                            <Select onValueChange={(v) => handleInputChange('gender', v)}>
                                                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Date of birth *</Label>
                                            <Input
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Phone number *</Label>
                                            <Input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+233 XX XXX XXXX"
                                                required
                                            />
                                            <Button type="button" onClick={sendOTP} size="sm" variant="outline" className="mt-2">
                                                <Phone className="h-4 w-4 mr-2" /> Send OTP
                                            </Button>
                                            {otpSent && (
                                                <Input
                                                    className="mt-2"
                                                    value={otpCode}
                                                    onChange={(e) => setOtpCode(e.target.value)}
                                                    placeholder="Enter OTP (demo: 1234)"
                                                    maxLength={4}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <Label>Email (optional)</Label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Preferred language</Label>
                                            <Input
                                                value={formData.language}
                                                onChange={(e) => handleInputChange('language', e.target.value)}
                                                placeholder="e.g. Twi, Dagbani"
                                            />
                                        </div>
                                        <div>
                                            <Label>Password *</Label>
                                            <Input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Confirm password *</Label>
                                            <Input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Profile photo (optional)</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e.target.files?.[0] || null, setProfilePicture)}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="button" onClick={() => setActiveTab('farm')}>Next: Farm</Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="farm" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Region *</Label>
                                            <Select
                                                value={formData.farmRegion}
                                                onValueChange={(v) => setFormData((p) => ({ ...p, farmRegion: v, farmDistrict: '', farmCommunity: '' }))}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                                                <SelectContent>
                                                    {SIGNUP_REGION_OPTIONS.map((region) => (
                                                        <SelectItem key={region} value={region}>
                                                            {GHANA_REGION_SIGNUP_LABELS[region] || region}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>District *</Label>
                                            {districtOptions.length > 0 ? (
                                                <Select
                                                    value={formData.farmDistrict}
                                                    onValueChange={(v) => handleInputChange('farmDistrict', v)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                                                    <SelectContent>
                                                        {districtOptions.map((d) => (
                                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    value={formData.farmDistrict}
                                                    onChange={(e) => handleInputChange('farmDistrict', e.target.value)}
                                                    placeholder="Enter district"
                                                    required
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <Label>Community *</Label>
                                            {communityOptions.length > 0 ? (
                                                <Select
                                                    value={formData.farmCommunity}
                                                    onValueChange={(v) => handleInputChange('farmCommunity', v)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Select community" /></SelectTrigger>
                                                    <SelectContent>
                                                        {communityOptions.map((c) => (
                                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                                        ))}
                                                        <SelectItem value="__other__">Other (type below)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    value={formData.farmCommunity}
                                                    onChange={(e) => handleInputChange('farmCommunity', e.target.value)}
                                                    placeholder="Community or village"
                                                    required
                                                />
                                            )}
                                            {formData.farmCommunity === '__other__' && (
                                                <Input
                                                    className="mt-2"
                                                    value={formData.customCommunity}
                                                    onChange={(e) => handleInputChange('customCommunity', e.target.value)}
                                                    placeholder="Enter community name"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <Label>Years of experience *</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={formData.yearsOfExperience}
                                                onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Farm type *</Label>
                                            <Select onValueChange={(v) => handleInputChange('farmType', v)}>
                                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="crop">Crop</SelectItem>
                                                    <SelectItem value="livestock">Livestock</SelectItem>
                                                    <SelectItem value="mixed">Mixed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Estimated acreage</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                step="0.1"
                                                value={formData.farmSize}
                                                onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Land ownership</Label>
                                            <Select onValueChange={(v) => handleInputChange('landOwnershipStatus', v)}>
                                                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="owned">Owned</SelectItem>
                                                    <SelectItem value="leased">Leased</SelectItem>
                                                    <SelectItem value="sharecropped">Sharecropped</SelectItem>
                                                    <SelectItem value="communal">Communal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {(formData.farmType === 'crop' || formData.farmType === 'mixed') && (
                                        <div className="space-y-3">
                                            <Label className="flex items-center gap-2"><Sprout className="h-4 w-4" /> Crops under production</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {GHANA_CROPS.map((crop) => (
                                                    <button
                                                        key={crop}
                                                        type="button"
                                                        onClick={() => toggleCrop(crop)}
                                                        className={`p-2 rounded-lg border text-xs font-semibold ${selectedCrops.includes(crop) ? 'bg-[#7ede56]/20 border-[#7ede56]' : 'bg-gray-50 border-gray-200'}`}
                                                    >
                                                        {crop}
                                                    </button>
                                                ))}
                                            </div>
                                            {selectedCrops.includes('Other') && (
                                                <Input
                                                    value={cropsGrownOther}
                                                    onChange={(e) => setCropsGrownOther(e.target.value)}
                                                    placeholder="Specify other crop(s)"
                                                />
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}>Back</Button>
                                        <Button type="button" onClick={() => setActiveTab('capital')}>Next: Capital</Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="capital" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Investment interest</Label>
                                            <Select
                                                value={formData.investmentInterest}
                                                onValueChange={(v) => handleInputChange('investmentInterest', v)}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="yes">Yes — seeking investment</SelectItem>
                                                    <SelectItem value="maybe">Maybe — open to discussion</SelectItem>
                                                    <SelectItem value="no">Not at this time</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Your field agent will complete investment readiness scoring during verification — same as agent-led onboarding.
                                    </p>
                                    <div className="flex justify-between">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('farm')}>Back</Button>
                                        <Button type="button" onClick={() => setActiveTab('documents')}>Next: Validate</Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="documents" className="space-y-6">
                                    <div>
                                        <Label>Ghana Card number *</Label>
                                        <Input
                                            value={formData.ghanaCardNumber}
                                            onChange={(e) => handleInputChange('ghanaCardNumber', e.target.value.toUpperCase())}
                                            placeholder="GHA-XXXXXXXXX-X"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Ghana Card — front *</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0] || null, setIdCardFront)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Ghana Card — back *</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0] || null, setIdCardBack)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 border-t pt-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="acceptTerms"
                                                checked={formData.acceptTerms}
                                                onCheckedChange={(c) => handleInputChange('acceptTerms', c as boolean)}
                                            />
                                            <Label htmlFor="acceptTerms" className="text-sm">I accept the Terms & Conditions *</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="acceptDataPolicy"
                                                checked={formData.acceptDataPolicy}
                                                onCheckedChange={(c) => handleInputChange('acceptDataPolicy', c as boolean)}
                                            />
                                            <Label htmlFor="acceptDataPolicy" className="text-sm">I accept the Data Privacy Policy *</Label>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('capital')}>Back</Button>
                                        <Button
                                            type="submit"
                                            className="bg-[#7ede56] hover:bg-[#6bc947]"
                                            disabled={!formData.acceptTerms || !formData.acceptDataPolicy || submitting}
                                        >
                                            {submitting ? 'Submitting…' : 'Complete Registration'}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default SignupGrower;
