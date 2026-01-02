import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, MapPin, UserCheck, Upload, Phone, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SignupGrower = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        password: '',
        farmRegion: '',
        farmDistrict: '',
        farmAddress: '',
        extensionAgentName: '',
        nationalId: null as File | null,
        acceptTerms: false,
        acceptDataPolicy: false
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [activeTab, setActiveTab] = useState('personal');

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (field: string, file: File | null) => {
        setFormData(prev => ({
            ...prev,
            [field]: file
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!verifyOTP()) {
            alert('Please enter the correct OTP code');
            return;
        }

        // Show under development message
        alert('🌾 Thank you for your interest in AgriLync!\n\nOur authentication system and user dashboards are currently under development and will be available very soon.\n\nStay tuned for updates!');
        return;

        // console.log('Grower Registration Data:', formData);
        // navigate('/dashboard/grower');
    };

    const ghanaRegions = [
        'Ashanti', 'Eastern', 'Northern', 'Western', 'Volta', 'Central', 'Bono',
        'Greater Accra', 'Upper East', 'Upper West', 'Western North', 'Ahafo',
        'Bono East', 'Oti', 'Savannah', 'North East'
    ];

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
                        <Users className="h-10 w-10 text-[#7ede56]" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lync Grower Registration</h1>
                            <p className="text-gray-600">Join the smart investor matching program</p>
                        </div>
                    </div>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                        <CardTitle className="text-2xl">Create Your Account</CardTitle>
                        <CardDescription>Complete all sections to join the program</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit}>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-6">
                                    <TabsTrigger value="personal" className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4" />
                                        Personal
                                    </TabsTrigger>
                                    <TabsTrigger value="farm" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Farm Info
                                    </TabsTrigger>
                                    <TabsTrigger value="documents" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Documents
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
                                            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                            />
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
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="button" onClick={() => setActiveTab('farm')}>
                                            Next: Farm Info
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
                                                    {ghanaRegions.map(region => (
                                                        <SelectItem key={region} value={region.toLowerCase()}>{region}</SelectItem>
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
                                        <Label htmlFor="extensionAgentName">Extension Agent (Optional)</Label>
                                        <Input
                                            id="extensionAgentName"
                                            value={formData.extensionAgentName}
                                            onChange={(e) => handleInputChange('extensionAgentName', e.target.value)}
                                            placeholder="If onboarded by an agent"
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('personal')}>
                                            Back
                                        </Button>
                                        <Button type="button" onClick={() => setActiveTab('documents')}>
                                            Next: Documents
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Documents Tab */}
                                <TabsContent value="documents" className="space-y-6">
                                    <div>
                                        <Label>Upload National ID or Ghana Card *</Label>
                                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#7ede56] transition-colors">
                                            <div className="space-y-2 text-center">
                                                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="nationalId" className="relative cursor-pointer bg-white rounded-md font-medium text-[#7ede56] hover:text-[#6bc947]">
                                                        <span>Upload ID</span>
                                                        <input
                                                            id="nationalId"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*,.pdf"
                                                            onChange={(e) => handleFileUpload('nationalId', e.target.files?.[0] || null)}
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                                {formData.nationalId && (
                                                    <p className="text-sm text-green-600 font-medium mt-2">
                                                        ✓ {formData.nationalId.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

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
                                        <Button type="button" variant="outline" onClick={() => setActiveTab('farm')}>
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-[#7ede56] hover:bg-[#6bc947]"
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

export default SignupGrower;
