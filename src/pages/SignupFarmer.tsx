import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Leaf, MapPin, UserCheck, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/utils/api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { GHANA_CROPS } from '@/data/ghanaCrops';
import { getRegionKey, SIGNUP_REGION_OPTIONS, GHANA_REGION_SIGNUP_LABELS } from '@/data/ghanaRegions';

const SignupFarmer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        farmRegion: '',
        farmDistrict: '',
        farmAddress: '',
        farmType: '',
        selectedCrops: [] as string[],
        cropsGrownOther: '',
        acceptTerms: false,
        acceptDataPolicy: false
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [activeTab, setActiveTab] = useState('personal');

    const handleInputChange = (field: string, value: string | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleCrop = (crop: string) => {
        setFormData((prev) => ({
            ...prev,
            selectedCrops: prev.selectedCrops.includes(crop)
                ? prev.selectedCrops.filter((c) => c !== crop)
                : [...prev.selectedCrops, crop],
        }));
    };

    const sendOTP = () => {
        setOtpSent(true);
        console.log('OTP sent to:', formData.phone);
    };

    const verifyOTP = () => {
        if (otpCode === '1234') {
            return true;
        }
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!verifyOTP()) {
            toast.error('Please enter the correct OTP code');
            return;
        }

        try {
            const payload = {
                name: formData.fullName,
                gender: formData.gender,
                contact: formData.phone,
                email: formData.email,
                password: formData.password,
                region: getRegionKey(formData.farmRegion),
                district: formData.farmDistrict,
                community: formData.farmAddress,
                farmType: formData.farmType || 'crop',
                cropList: formData.selectedCrops,
                cropsGrownOther: formData.selectedCrops.includes('Other') ? formData.cropsGrownOther : '',
                onboardingSource: 'self',
            };

            const res = await api.post('/farmers/public/register', payload);

            if (res.data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    html: `
                        <div style="text-align: center; padding: 10px 0;">
                            <p style="font-size: 18px; color: #059669; margin: 15px 0;">
                                Registration successful! Please wait for agent verification.
                            </p>
                        </div>
                    `,
                    confirmButtonText: 'Continue to Login',
                    confirmButtonColor: '#7ede56',
                    timer: 3000,
                    timerProgressBar: true
                });
                setTimeout(() => navigate('/login'), 1000);
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            toast.error(err.response?.data?.msg || 'Failed to register. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-manrope">
            <Navbar variant="light" />

            <div className="max-w-5xl mx-auto px-4 pt-24 pb-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/signup')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Role Selection
                    </Button>
                    <div className="flex items-center gap-3">
                        <Leaf className="h-10 w-10 text-[#7ede56]" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Solo Farmer Registration</h1>
                            <p className="text-gray-600">Join AgriLync for AI advisory and weather forecast</p>
                        </div>
                    </div>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-[#7ede56]/10 to-white">
                        <CardTitle className="text-2xl">Create Your Account</CardTitle>
                        <CardDescription>Complete the form below to get started</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit}>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="personal" className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4" />
                                        Personal Info
                                    </TabsTrigger>
                                    <TabsTrigger value="farm" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Farm Location
                                    </TabsTrigger>
                                </TabsList>

                                {/* Personal Info Tab */}
                                <TabsContent value="personal" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="fullName">Full Name *</Label>
                                            <Input
                                                id="fullName"
                                                value={formData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gender">Gender *</Label>
                                            <Select onValueChange={(value) => handleInputChange('gender', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <div className="space-y-2">
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    placeholder="+233 XX XXX XXXX"
                                                    required
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={sendOTP}
                                                    disabled={!formData.phone}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    Send OTP
                                                </Button>
                                                {otpSent && (
                                                    <Input
                                                        value={otpCode}
                                                        onChange={(e) => setOtpCode(e.target.value)}
                                                        placeholder="Enter 4-digit OTP"
                                                        maxLength={4}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email Address (Optional)</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="password">Password *</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                placeholder="Create a password"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                placeholder="Confirm your password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="button" onClick={() => setActiveTab('farm')}>
                                            Next: Farm Location
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Farm Location Tab */}
                                <TabsContent value="farm" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="farmRegion">Region *</Label>
                                            <Select onValueChange={(value) => handleInputChange('farmRegion', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select region" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SIGNUP_REGION_OPTIONS.map((region) => (
                                                        <SelectItem key={region} value={region}>
                                                            {GHANA_REGION_SIGNUP_LABELS[region] || region.replace(' Region', '')}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="farmDistrict">District/Community *</Label>
                                            <Input
                                                id="farmDistrict"
                                                value={formData.farmDistrict}
                                                onChange={(e) => handleInputChange('farmDistrict', e.target.value)}
                                                placeholder="Enter district or community"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="farmAddress">Farm Address *</Label>
                                            <Input
                                                id="farmAddress"
                                                value={formData.farmAddress}
                                                onChange={(e) => handleInputChange('farmAddress', e.target.value)}
                                                placeholder="Enter detailed farm address or nearest landmark"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="farmType">Farm Type *</Label>
                                            <Select onValueChange={(value) => handleInputChange('farmType', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select farm type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="crop">Crop Farming</SelectItem>
                                                    <SelectItem value="livestock">Livestock Farming</SelectItem>
                                                    <SelectItem value="mixed">Mixed Farming</SelectItem>
                                                    <SelectItem value="aquaculture">Aquaculture</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {(formData.farmType === 'crop' || formData.farmType === 'mixed') && (
                                        <div className="space-y-3">
                                            <Label>Primary Crops (select all that apply)</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {GHANA_CROPS.map((crop) => (
                                                    <button
                                                        key={crop}
                                                        type="button"
                                                        onClick={() => toggleCrop(crop)}
                                                        className={`p-2 rounded-lg border text-xs font-semibold transition-all ${formData.selectedCrops.includes(crop) ? 'bg-[#7ede56]/20 border-[#7ede56] text-[#002f37]' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                                                    >
                                                        {crop}
                                                    </button>
                                                ))}
                                            </div>
                                            {formData.selectedCrops.includes('Other') && (
                                                <Input
                                                    value={formData.cropsGrownOther}
                                                    onChange={(e) => handleInputChange('cropsGrownOther', e.target.value)}
                                                    placeholder="Specify other crop(s)"
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Terms */}
                                    <div className="space-y-3 border-t pt-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="acceptTerms"
                                                checked={formData.acceptTerms}
                                                onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                                            />
                                            <Label htmlFor="acceptTerms" className="text-sm">
                                                I accept the Terms & Conditions *
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="acceptDataPolicy"
                                                checked={formData.acceptDataPolicy}
                                                onCheckedChange={(checked) => handleInputChange('acceptDataPolicy', checked as boolean)}
                                            />
                                            <Label htmlFor="acceptDataPolicy" className="text-sm">
                                                I accept the Data Privacy Policy *
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}>
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-[#7ede56] hover:bg-[#6ccb4b]"
                                            disabled={!formData.acceptTerms || !formData.acceptDataPolicy}
                                        >
                                            Create Account
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

export default SignupFarmer;



