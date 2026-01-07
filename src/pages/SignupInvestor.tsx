import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, TrendingUp, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Swal from 'sweetalert2';

const SignupInvestor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
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
            Swal.fire({
                icon: 'error',
                title: 'Invalid OTP',
                text: 'Please enter the correct OTP code.'
            });
            return;
        }

        // Show under development message
        Swal.fire({
            title: 'Under Development',
            html: `🌾 Thank you for your interest in AgriLync!<br><br>Our authentication system and user dashboards are currently under development and will be available very soon.<br><br>Stay tuned for updates!`,
            icon: 'info',
            confirmButtonColor: '#2563eb'
        });
        return;

        // console.log('Investor Registration Data:', formData);
        // navigate('/dashboard/investor');
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
                        <TrendingUp className="h-10 w-10 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Lync Investor Registration</h1>
                            <p className="text-gray-600">Start investing in sustainable agriculture</p>
                        </div>
                    </div>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                        <CardTitle className="text-2xl">Create Your Account</CardTitle>
                        <CardDescription>Join our investment platform</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Label htmlFor="fullName">Full Name or Business Name *</Label>
                                    <Input
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        placeholder="Enter your full name or business name"
                                        required
                                    />
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
                                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                                disabled={!formData.acceptTerms || !formData.acceptDataPolicy}
                            >
                                Create Account
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default SignupInvestor;
