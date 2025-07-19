import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  MapPin, 
  Calendar,
  CheckCircle,
  Star,
  Handshake,
  PieChart,
  Target,
  Award,
  Play
} from 'lucide-react';

const FarmPartner = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      toast.error('Please sign in to get started');
      navigate('/auth');
      return;
    }
    // Navigate based on user role or default to application form
    navigate('/auth');
  };

  const handleInvestNow = (farmerId: number) => {
    if (!user) {
      toast.error('Please sign in to invest');
      navigate('/auth');
      return;
    }
    toast.success('Investment process initiated!');
    // Handle investment logic
  };

  const handlePartnerNow = (farmerId: number) => {
    if (!user) {
      toast.error('Please sign in to partner');
      navigate('/auth');
      return;
    }
    toast.success('Partnership request sent!');
    // Handle partnership logic
  };

  const handleTrackProgress = () => {
    if (!user) {
      toast.error('Please sign in to track progress');
      navigate('/auth');
      return;
    }
    // Navigate to dashboard or progress page
    toast.success('Opening progress dashboard...');
  };

  const farmers = [
    {
      id: 1,
      name: 'Kwame Asante',
      location: 'Ashanti Region, Ghana',
      crop: 'Cocoa',
      farmSize: '5 hectares',
      experience: '12 years',
      needAmount: '$2,500',
      purpose: 'Premium fertilizer and pest control',
      expectedROI: '25%',
      credibilityScore: 4.8,
      verified: true,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Amina Ibrahim',
      location: 'Northern Region, Ghana',
      crop: 'Rice',
      farmSize: '3 hectares',
      experience: '8 years',
      needAmount: '$1,800',
      purpose: 'Irrigation system upgrade',
      expectedROI: '30%',
      credibilityScore: 4.6,
      verified: true,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Joseph Osei',
      location: 'Eastern Region, Ghana',
      crop: 'Maize & Beans',
      farmSize: '7 hectares',
      experience: '15 years',
      needAmount: '$3,200',
      purpose: 'Seeds and mechanization',
      expectedROI: '28%',
      credibilityScore: 4.9,
      verified: true,
      image: '/placeholder.svg'
    }
  ];

  const successStories = [
    {
      farmer: 'Isaac Mensah',
      investor: 'GreenGrow Investments',
      investment: '$4,000',
      returns: '$5,200',
      roi: '30%',
      duration: '8 months',
      crop: 'Tomatoes'
    },
    {
      farmer: 'Fatima Al-Hassan',
      investor: 'AgriVest Partners',
      investment: '$2,800',
      returns: '$3,640',
      roi: '30%',
      duration: '6 months',
      crop: 'Onions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 overflow-x-hidden">
      <Navbar />
      <section className="relative flex flex-col items-center justify-center min-h-[220px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[480px] w-full overflow-hidden mb-4 sm:mb-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">FarmPartner Investment Initiative</h1>
          <p className="text-xs sm:text-base text-gray-600 max-w-xs sm:max-w-2xl mx-auto">
            Connect verified farmers with impact investors through our transparent partnership platform. Secure funding, share profits, and build sustainable agricultural communities.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">FarmPartner Investment Initiative</h1>
          <p className="text-xs sm:text-base text-gray-600 max-w-xs sm:max-w-2xl mx-auto">
            Connect verified farmers with impact investors through our transparent partnership platform. Secure funding, share profits, and build sustainable agricultural communities.
          </p>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Left: Info/Features */}
          <div className="space-y-4 sm:space-y-6">
            {/* Features List */}
            <Card className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-xs sm:text-base">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-4 text-xs sm:text-base">
                <ul className="list-disc pl-5">
                  <li>Verified farmer profiles</li>
                  <li>Transparent profit sharing</li>
                  <li>Extension agent monitoring</li>
                  <li>Impact tracking dashboard</li>
                </ul>
              </CardContent>
            </Card>
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
              <Input placeholder="Search by crop or location..." className="w-full sm:w-64 text-xs sm:text-base px-2 py-2" />
              <Button className="text-xs sm:text-base px-3 py-2 bg-green-600 hover:bg-green-700">Search</Button>
            </div>
          </div>
          {/* Right: Farmer Cards */}
          <div className="space-y-4 sm:space-y-6">
            {/* Example Farmer Card */}
            {/* Map over farmers array here in real app */}
            <Card className="hover:shadow-lg transition-shadow transform hover:scale-105 duration-300 rounded-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png"
                    alt="Farmer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-xs sm:text-base">Kwame Asante</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-gray-500">Ashanti Region</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-xs sm:text-base">
                <p className="mb-2">Maize, Cassava</p>
                <p className="text-gray-600">"FarmPartner helped me scale my farm and connect with investors!"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmPartner;
