import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, UserCheck, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SignupAgent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        phone: '',
        email: '',
        password: '',
        acceptTerms: false,
        acceptDataPolicy: false
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
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

        // Show application success message
        alert('📝 Application Submitted Successfully!\n\nThank you for your interest in becoming a Lync Agent. Your application has been received and is under review.\n\nOur team will contact you shortly regarding the next steps.');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-manrope">
            <Navbar variant="light" />

            <div className="max-w-4xl mx-auto px-4 py-8">
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
                        <UserCheck className="h-10 w-10 text-purple-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lync Agent Application</h1>
                            <p className="text-gray-600">Apply to become an extension officer or field agent</p>
                        </div>
                    </div>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                        <CardTitle className="text-2xl">Submit Your Application</CardTitle>
                        <CardDescription>Register your interest to manage farms and farmers</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="password">Password (for account creation if approved) *</Label>
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

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg"
                                disabled={!formData.acceptTerms || !formData.acceptDataPolicy}
                            >
                                Submit Application
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default SignupAgent;
