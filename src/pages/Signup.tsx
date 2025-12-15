import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Leaf, Users, TrendingUp, UserCheck, ArrowLeft, Upload, MapPin, Calendar, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Professional Info (for specific user types)
    investorType: '',
    investmentSize: '',
    preferredRegion: '',
    expectedReturnModel: '',
    agribusinessExperience: '',
    assignedRegion: '',
    operationalZone: '',
    qualification: '',
    yearsExperience: '',
    linkedOrganization: '',

    // Additional Info
    nationalId: null as File | null,
    businessCertificate: null as File | null,
    profilePhoto: null as File | null,
    extensionAgentName: '',

    // Farm Location (for growers and farmers)
    farmRegion: '',
    farmDistrict: '',
    farmAddress: '',
    farmLatitude: '',
    farmLongitude: '',
    farmSize: 0, // in hectares

    // Terms
    acceptTerms: false,
    acceptDataPolicy: false
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    // Trigger animations after component mounts
    setImagesLoaded(true);
  }, []);

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
    // Simulate OTP sending
    setOtpSent(true);
    console.log('OTP sent to:', formData.phone);
  };

  const verifyOTP = () => {
    // Simulate OTP verification
    if (otpCode === '1234') { // Demo OTP
      console.log('OTP verified successfully');
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

    console.log('User Type:', userType);
    console.log('Form Data:', formData);

    // Navigate to appropriate dashboard
    if (userType === 'grower') {
      navigate('/dashboard/grower');
    } else if (userType === 'investor') {
      navigate('/dashboard/investor');
    } else if (userType === 'farmer') {
      navigate('/dashboard/farmer');
    } else if (userType === 'agent') {
      navigate('/dashboard/agent');
    }
  };

  const userTypes = [
    {
      id: 'farmer',
      title: 'Solo Farmer',
      description: 'Independent farmers using AgriLync tools for AI advisory and weather forecast',
      icon: <Leaf className="h-8 w-8 text-orange-600" />,
      color: 'border-orange-200 hover:border-orange-400'
    },
    {
      id: 'grower',
      title: 'Lync Grower',
      description: 'Farmers under smart investor matching program',
      icon: <Users className="h-8 w-8 text-[#7ede56]" />,
      color: 'border-green-200 hover:border-green-400'
    },
    {
      id: 'investor',
      title: 'Lync Investor',
      description: 'Individuals or institutions investing in farms',
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      color: 'border-blue-200 hover:border-blue-400'
    },
    {
      id: 'agent',
      title: 'Apply as Lync Agent',
      description: 'Extension officer application',
      icon: <UserCheck className="h-8 w-8 text-purple-600" />,
      color: 'border-purple-200 hover:border-purple-400'
    }
  ];

  const ghanaRegions = [
    'Ashanti', 'Eastern', 'Northern', 'Western', 'Volta', 'Central', 'Bono',
    'Greater Accra', 'Upper East', 'Upper West', 'Western North', 'Ahafo',
    'Bono East', 'Oti', 'Savannah', 'North East'
  ];

  const farmTypes = ['Crop', 'Livestock', 'Mixed'];
  const cropCategories = ['Maize', 'Rice', 'Cocoa', 'Cassava', 'Yam', 'Plantain', 'Tomato', 'Onion', 'Pepper'];
  const livestockCategories = ['Poultry', 'Cattle', 'Goat', 'Sheep', 'Pig', 'Fish'];
  const languages = ['English', 'Twi', 'Ga', 'Ewe', 'Hausa', 'Dagbani'];
  const farmStages = ['Planting', 'Growing', 'Harvesting', 'Maintenance', 'Planning'];
  const investmentInterests = ['Input support', 'Equipment', 'Land preparation', 'Seeds', 'Fertilizer', 'Irrigation'];
  const investorTypes = ['Individual', 'Company', 'Organization', 'NGO'];
  const returnModels = ['Profit share', 'Buy-back', 'Equity', 'Fixed return'];
  const qualifications = ['Diploma', 'BSc Agriculture', 'Extension Officer', 'MSc Agriculture', 'PhD', 'Other'];

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
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
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
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender *</Label>
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
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
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
                      <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Enter OTP Code</Label>
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
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address (Optional)</Label>
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
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
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
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
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
                  <Label htmlFor="farmRegion" className="text-sm font-medium text-gray-700">Region *</Label>
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
                  <Label htmlFor="farmDistrict" className="text-sm font-medium text-gray-700">District/Community *</Label>
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
                <Label htmlFor="farmAddress" className="text-sm font-medium text-gray-700">Farm Address *</Label>
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
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
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
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender *</Label>
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
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date of Birth *</Label>
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
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
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
                      <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Enter OTP Code</Label>
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
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
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
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
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
                  <Label htmlFor="farmRegion" className="text-sm font-medium text-gray-700">Region *</Label>
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
                  <Label htmlFor="farmDistrict" className="text-sm font-medium text-gray-700">District/Community *</Label>
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
                <Label htmlFor="farmAddress" className="text-sm font-medium text-gray-700">Farm Address *</Label>
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
                      <label htmlFor="nationalId" className="relative cursor-pointer bg-white rounded-md font-medium text-[#7ede56] hover:text-[#6bc947] focus-within:outline-none">
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
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
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
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender *</Label>
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
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
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
                      <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Enter OTP Code</Label>
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
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
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
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
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
    <div className="min-h-screen bg-white">
      <Navbar variant="light" />

      <div className="flex min-h-screen">
        {/* Left Side - Image Grid */}
        <div className="hidden lg:flex lg:flex-1 bg-gray-50 p-6 items-center justify-center">
          <div className="w-full max-w-3xl grid grid-cols-3 gap-3">
            {/* Column 1 */}
            <div className="space-y-3">
              <div
                className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: '0.1s' }}
              >
                <img
                  src="/lovable-uploads/signup1.jpg"
                  alt="Agricultural content creation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>

              <div
                className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: '0.3s' }}
              >
                <img
                  src="/lovable-uploads/signup2.jpg"
                  alt="Digital farming consultation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <div
                className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: '0.2s' }}
              >
                <img
                  src="/lovable-uploads/signup3.jpg"
                  alt="Agricultural training session"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>

              <div
                className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: '0.4s' }}
              >
                <img
                  src="/lovable-uploads/signup4.jpg"
                  alt="Farm planning and analysis"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <div
                className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: '0.3s' }}
              >
                <img
                  src="/lovable-uploads/signup5.jpg"
                  alt="Harvest and agricultural success"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>

              <div
                className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: '0.5s' }}
              >
                <img
                  src="/lovable-uploads/signup6.jpg"
                  alt="Agricultural communication"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mb-6 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AgriLync</h1>
              <p className="text-gray-600">Choose your role and start your agricultural journey</p>
            </div>

            {/* User Type Selection */}
            {!userType && (
              <div className="space-y-4">
                {userTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${type.color}`}
                    onClick={() => {
                      if (type.id === 'agent') {
                        window.open('https://form.jotform.com/253482683266062', '_blank');
                      } else {
                        navigate(`/signup/${type.id}`);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">{type.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{type.title}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Registration Form */}
            {userType && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    {userTypes.find(t => t.id === userType)?.title} Registration
                  </CardTitle>
                  <CardDescription className="text-center">
                    {userTypes.find(t => t.id === userType)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {renderFormFields()}

                    {/* Terms and Conditions */}
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>

                      <div className="space-y-3">
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
                            I agree to the Data Use Policy *
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setUserType('')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#7ede56] hover:bg-[#6bc947]"
                        disabled={!formData.acceptTerms || !formData.acceptDataPolicy}
                      >
                        Complete Registration
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Image Section */}
      <div className="lg:hidden bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Mobile Image Grid - 3 columns */}
            <div
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '0.1s' }}
            >
              <img
                src="/lovable-uploads/signup1.jpg"
                alt="Agricultural content creation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            <div
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '0.2s' }}
            >
              <img
                src="/lovable-uploads/signup2.jpg"
                alt="Digital farming consultation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            <div
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '0.3s' }}
            >
              <img
                src="/lovable-uploads/signup3.jpg"
                alt="Agricultural training session"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            <div
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '0.4s' }}
            >
              <img
                src="/lovable-uploads/signup4.jpg"
                alt="Farm planning and analysis"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            <div
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '0.5s' }}
            >
              <img
                src="/lovable-uploads/signup5.jpg"
                alt="Harvest and agricultural success"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            <div
              className={`relative overflow-hidden rounded-lg shadow-lg h-48 transition-all duration-700 ease-out ${imagesLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: '0.6s' }}
            >
              <img
                src="/lovable-uploads/signup6.jpg"
                alt="Agricultural communication"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;