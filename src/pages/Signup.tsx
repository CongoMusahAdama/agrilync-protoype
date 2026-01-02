
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCheck, Leaf, Users, TrendingUp, ArrowLeft, ArrowRight, ChevronDown, MapPin, Upload, Check, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    farmRegion: '',
    farmDistrict: '',
    farmAddress: '',
    farmSize: '',
    crops: [] as string[],
    livestock: [] as string[],
    role: '',
    businessName: '',
    investmentInterest: [] as string[],
    extensionAgentName: '',
    acceptTerms: false,
    acceptDataPolicy: false
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState(false); // Kept for safety if referenced, though unused in new layout logic directly

  useEffect(() => {
    setImagesLoaded(true);
  }, []);

  const userTypes = [
    {
      id: 'agent',
      title: 'Apply as Lync Agent',
      description: 'Join our professional extension network',
      icon: <UserCheck className="h-6 w-6 text-white" />,
      color: 'bg-gradient-to-br from-[#7ede56] to-[#00b25c] border-none shadow-2xl hover:shadow-[#7ede56]/40 [&_h3]:!text-white [&_p]:!text-white/80 ring-8 ring-[#7ede56]/10'
    },
    {
      id: 'farmer',
      title: 'Solo Farmer',
      description: 'Direct access to tools & markets',
      icon: <Leaf className="h-6 w-6 text-orange-600" />,
      color: 'bg-white border-gray-100 hover:border-[#7ede56] hover:bg-white shadow-xl'
    },
    {
      id: 'grower',
      title: 'Lync Grower',
      description: 'Scale with smart investor matching',
      icon: <Users className="h-6 w-6 text-green-600" />,
      color: 'bg-white border-gray-100 hover:border-[#7ede56] hover:bg-white shadow-xl'
    },
    {
      id: 'investor',
      title: 'Lync Investor',
      description: 'Fund sustainable agriculture',
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      color: 'bg-white border-gray-100 hover:border-[#7ede56] hover:bg-white shadow-xl'
    }
  ];

  const ghanaRegions = [
    'Ashanti', 'Eastern', 'Northern', 'Western', 'Volta', 'Central', 'Bono',
    'Greater Accra', 'Upper East', 'Upper West', 'Western North', 'Ahafo',
    'Bono East', 'Oti', 'Savannah', 'North East'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    console.log(`File uploaded for ${field}:`, file);
  };

  const sendOTP = () => {
    if (!formData.phone) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to receive OTP",
        variant: "destructive"
      });
      return;
    }
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: "Please check your phone for the verification code",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive"
      });
      return;
    }
    console.log('Form submitted:', { ...formData, userType });
    navigate('/login');
    toast({
      title: "Account Created",
      description: "Please log in with your credentials",
    });
  };

  const renderFormFields = () => {
    switch (userType) {
      case 'farmer':
        return (
          <>
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="mt-1">
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

              <div className="space-y-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="mt-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      onClick={sendOTP}
                      disabled={!formData.phone}
                      className="w-full sm:w-auto"
                    >
                      Send OTP
                    </Button>
                  </div>
                  {otpSent && (
                    <div className="mt-4">
                      <Label htmlFor="otp">Enter OTP Code</Label>
                      <Input
                        id="otp"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                        className="mt-1 w-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-1"
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
                    className="mt-1"
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
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Farm Location Section */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Farm Location *
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="farmRegion">Region *</Label>
                  <Select onValueChange={(value) => handleInputChange('farmRegion', value)}>
                    <SelectTrigger className="mt-1">
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
                    className="mt-1"
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
                  className="mt-1"
                  required
                />
              </div>
            </div>

          </>
        );

      case 'grower':
        return (
          <>
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="mt-1">
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
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="mt-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      onClick={sendOTP}
                      disabled={!formData.phone}
                      className="w-full sm:w-auto"
                    >
                      Send OTP
                    </Button>
                  </div>
                  {otpSent && (
                    <div className="mt-4">
                      <Label htmlFor="otp">Enter OTP Code</Label>
                      <Input
                        id="otp"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                        className="mt-1 w-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-1"
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
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Farm Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Farm Location *
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="farmRegion">Region *</Label>
                  <Select onValueChange={(value) => handleInputChange('farmRegion', value)}>
                    <SelectTrigger className="mt-1">
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
                    className="mt-1"
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
                  className="mt-1"
                  required
                />
              </div>

            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Additional Information
              </h3>

              <div>
                <Label htmlFor="extensionAgentName">Name of Extension Agent (if onboarded by one)</Label>
                <Input
                  id="extensionAgentName"
                  value={formData.extensionAgentName}
                  onChange={(e) => handleInputChange('extensionAgentName', e.target.value)}
                  placeholder="Enter extension agent name"
                />
              </div>

              <div>
                <Label htmlFor="nationalId">Upload National ID or Ghana Card *</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="nationalId" className="relative cursor-pointer bg-white rounded-md font-medium text-[#7ede56] hover:text-[#002f37] focus-within:outline-none">
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
                  </div>
                </div>
              </div>
            </div>

          </>
        );

      case 'investor':
        return (
          <>
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name or Business Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name or business name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      required
                    />
                    <Button type="button" onClick={sendOTP} disabled={!formData.phone}>
                      Send OTP
                    </Button>
                  </div>
                  {otpSent && (
                    <div className="mt-2">
                      <Label htmlFor="otp">Enter OTP Code</Label>
                      <Input
                        id="otp"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
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
            </div>

          </>
        );

      case 'agent':
        return (
          <>
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="mt-1">
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

              <div className="space-y-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="mt-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      onClick={sendOTP}
                      disabled={!formData.phone}
                      className="w-full sm:w-auto"
                    >
                      Send OTP
                    </Button>
                  </div>
                  {otpSent && (
                    <div className="mt-4">
                      <Label htmlFor="otp">Enter OTP Code</Label>
                      <Input
                        id="otp"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                        className="mt-1 w-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-1"
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
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>

          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex font-manrope">
      {/* Left Side - Brand Panel (Deep Teal) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#002f37] relative overflow-hidden flex-col justify-between p-16 text-white">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#7ede56]/10 blur-3xl"></div>

        <div className="relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10 p-0 mb-6 h-auto font-normal flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>

          <h1 className="text-5xl xl:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            Join our growing <br />
            <span className="text-[#7ede56]">ecosystem</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-md leading-relaxed mb-10">
            Start your journey with AgriLync today. Whether you're a farmer, investor, or agent, we have the tools to help you succeed.
          </p>

          <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-1000 max-w-2xl max-h-[380px]">
            <img
              src="/lovable-uploads/signup6.jpg"
              alt="AgriLync Ecosystem"
              className="w-full h-full object-cover opacity-95 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] via-[#002f37]/10 to-transparent"></div>

            {/* Glossy Overlay Tag */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
              Partnering for Growth
            </div>
          </div>
        </div>

        {/* Testimonial / Social Proof */}
        {/* Testimonial Removed */}
      </div>

      {/* Right Side - Collaborative Content Panel */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col p-8 sm:p-12 lg:p-16 xl:p-20 items-center justify-center overflow-y-auto">

        {/* Mobile Header (Back button) */}
        <div className="lg:hidden">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-8 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        <div className="max-w-xl mx-auto w-full">

          {/* Mobile Brand Content (Visible on mobile/tablet) */}
          <div className="lg:hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-2xl font-extrabold text-[#002f37] mb-3 leading-tight">
              Join our growing <br />
              <span className="text-[#7ede56]">ecosystem</span>
            </h2>
            <p className="text-gray-600 mb-4 text-xs leading-relaxed max-w-sm">
              Start your journey with AgriLync today. Whether you're a farmer, investor, or agent, we have the tools to help you succeed.
            </p>
            <div className="rounded-[1.5rem] overflow-hidden shadow-lg mb-4 max-h-[160px]">
              <img
                src="/lovable-uploads/signup6.jpg"
                alt="AgriLync Ecosystem"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Header Area */}
          <div className="mb-8 text-center w-full">
            {userType ? (
              <div className="flex justify-center mb-4">
                <Button variant="ghost" onClick={() => setUserType('')} className="hover:bg-transparent hover:text-[#002f37] text-gray-500">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Change Role
                </Button>
              </div>
            ) : null}

            <h2 className="text-4xl font-extrabold text-[#002f37] mb-2 tracking-tight">
              {userType ? `Register as ${userTypes.find(t => t.id === userType)?.title}` : 'Choose your role'}
            </h2>
            <p className="text-gray-600">
              {userType ? 'Please fill in the details below to create your account.' : 'Select the account type that best describes you.'}
            </p>
          </div>

          {/* Content: Either Role Selection OR Form */}
          {!userType ? (
            <div className="flex flex-col items-center gap-6 max-w-lg mx-auto w-full text-center mt-4">
              {/* Standalone Agent Pill */}
              <button
                onClick={() => window.open('https://form.jotform.com/253482683266062', '_blank')}
                className="group relative w-full h-14 rounded-full bg-[#002f37] border-[1px] border-white/10 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] transition-all duration-300 flex items-center justify-center gap-4 px-8 text-white font-semibold hover:border-[#7ede56]/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white/10 text-[#7ede56]">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span>Apply as Lync Agent</span>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-60" />
              </button>

              {/* Roles Dropdown Pill */}
              <div className="relative w-full">
                <Select onValueChange={(val) => setUserType(val)}>
                  <SelectTrigger
                    className="w-full h-14 rounded-full bg-white border-[1px] border-gray-200 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 px-8 text-[#002f37] font-semibold hover:border-[#7ede56]/50 focus:ring-0 focus:ring-offset-0 flex justify-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-50 text-blue-500">
                        <Users className="w-5 h-5" />
                      </div>
                      <SelectValue placeholder="Join us" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100 shadow-xl p-2">
                    <SelectItem value="farmer" className="rounded-xl py-3 focus:bg-[#7ede56]/10 focus:text-[#002f37]">
                      <div className="flex items-center gap-3">
                        <Leaf className="w-4 h-4 text-orange-500" />
                        <div>
                          <p className="font-bold">Solo Farmer</p>
                          <p className="text-xs text-gray-500">Direct access to tools & markets</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="grower" className="rounded-xl py-3 focus:bg-[#7ede56]/10 focus:text-[#002f37]">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="font-bold">Lync Grower</p>
                          <p className="text-xs text-gray-500">Scale with smart investor matching</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="investor" className="rounded-xl py-3 focus:bg-[#7ede56]/10 focus:text-[#002f37]">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="font-bold">Lync Investor</p>
                          <p className="text-xs text-gray-500">Fund sustainable agriculture</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  Already have an account?{' '}
                  <span onClick={() => navigate('/login')} className="text-[#002f37] font-bold cursor-pointer hover:underline">
                    Log in
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderFormFields()}

              <div className="flex gap-4 pt-4">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the terms and conditions
                  </label>
                  <p className="text-sm text-muted-foreground">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#002f37] hover:bg-[#003f4a] text-white h-12 rounded-xl text-lg font-medium" disabled={!formData.acceptTerms}>
                Create Account
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;