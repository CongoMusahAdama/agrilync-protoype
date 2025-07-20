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

// Brand colors
const BRAND_MAGENTA = '#921573';
const BRAND_GREEN = '#7ede56';
const BRAND_TEAL = '#002F37';
const BRAND_WHITE = '#FFFFFF';

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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[220px] sm:min-h-[320px] md:min-h-[400px] lg:min-h-[480px] w-full overflow-hidden mb-4 sm:mb-8 bg-white">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 animate-fade-in-down" style={{ color: BRAND_MAGENTA }}>
            FarmPartner Initiative
          </h1>
          <p className="text-sm sm:text-lg text-gray-700 max-w-xs sm:max-w-md md:max-w-2xl mx-auto">
            Empowering farmers and investors through transparent, impactful partnerships. Grow together, succeed together.
          </p>
        </div>
      </section>
      {/* Matchmaking Engine Section */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_TEAL }}>Matchmaking Engine</h2>
        <div className="flex flex-col md:flex-row gap-6 items-center bg-[#f8f6ff] rounded-xl shadow-md border-2 border-[#921573] p-6 animate-fade-in-up">
          <div className="flex-1 text-base text-gray-800">
            <p>
              Our intelligent engine connects <span style={{ color: BRAND_MAGENTA, fontWeight: 'bold' }}>verified farmers</span> with <span style={{ color: BRAND_GREEN, fontWeight: 'bold' }}>impact investors</span> based on needs, goals, and location. 
              Enjoy a seamless, transparent partnership journey.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Smart matching based on farm profile & investment goals</li>
              <li>Real-time status updates</li>
              <li>Secure, transparent communication</li>
            </ul>
          </div>
          {/* Simple visual flow */}
          <div className="flex flex-col items-center gap-2">
            <Users color={BRAND_MAGENTA} size={36} />
            <span className="text-2xl">⇄</span>
            <TrendingUp color={BRAND_GREEN} size={36} />
          </div>
        </div>
      </section>
      {/* Investor Verification & Transparency */}
      <section className="w-full max-w-4xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_MAGENTA }}>Investor Verification & Transparency</h2>
        <div className="flex items-center gap-4 bg-[#e6fbe6] rounded-xl shadow border-2 border-[#7ede56] p-6 animate-fade-in-up">
          <Shield color={BRAND_TEAL} size={32} />
          <div className="flex-1 text-base text-gray-800">
            <p>
              All investors undergo a <span style={{ color: BRAND_TEAL, fontWeight: 'bold' }}>strict verification process</span> to ensure trust and transparency. Track every transaction and partnership milestone in real time.
            </p>
          </div>
        </div>
      </section>
      {/* Resource Support Section */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_GREEN }}>Resource Support</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 border-2 border-[#921573]">
            <img src="/lovable-uploads/58a418db-b2d5-4bcb-94c1-d230345ec90b.png" alt="Inputs" className="w-10 h-10 mb-2" />
            <span className="font-semibold" style={{ color: BRAND_MAGENTA }}>Inputs</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 border-2 border-[#7ede56]">
            <img src="/lovable-uploads/3e19a1d1-e890-436d-ba69-4227c2a1c8b1.png" alt="Seeds" className="w-10 h-10 mb-2" />
            <span className="font-semibold" style={{ color: BRAND_GREEN }}>Seeds</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 border-2 border-[#002F37]">
            <img src="/lovable-uploads/78cc82b9-7fa6-4dd5-9cba-9498e9d21862.png" alt="Fertilizer" className="w-10 h-10 mb-2" />
            <span className="font-semibold" style={{ color: BRAND_TEAL }}>Fertilizer</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-4 border-2 border-[#921573]">
            <img src="/lovable-uploads/512cd931-d1b6-4a18-8b57-63786de9ffb8.png" alt="Equipment" className="w-10 h-10 mb-2" />
            <span className="font-semibold" style={{ color: BRAND_MAGENTA }}>Equipment</span>
          </div>
        </div>
      </section>
      {/* Change Agents Section */}
      <section className="w-full max-w-4xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_TEAL }}>Role of Change Agents</h2>
        <div className="flex items-center gap-4 bg-[#f8f6ff] rounded-xl shadow border-2 border-[#002F37] p-6 animate-fade-in-up">
          <Award color={BRAND_MAGENTA} size={32} />
          <div className="flex-1 text-base text-gray-800">
            <p>
              <span style={{ color: BRAND_MAGENTA, fontWeight: 'bold' }}>Change Agents</span> monitor project progress, provide expert advice, and ensure accountability for all stakeholders.
            </p>
          </div>
        </div>
      </section>
      {/* Profit Sharing Diagram */}
      <section className="w-full max-w-3xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_MAGENTA }}>Profit Sharing</h2>
        <div className="flex flex-col items-center bg-white rounded-xl shadow border-2 border-[#921573] p-6 animate-fade-in-up">
          <PieChart color={BRAND_GREEN} size={40} />
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg" style={{ color: BRAND_MAGENTA }}>Farmer</span>
              <span className="text-base font-semibold">60%</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: BRAND_TEAL }}>+</span>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg" style={{ color: BRAND_GREEN }}>Investor</span>
              <span className="text-base font-semibold">35%</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: BRAND_TEAL }}>+</span>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg" style={{ color: BRAND_TEAL }}>Change Agent</span>
              <span className="text-base font-semibold">5%</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">*Example split. Actual terms may vary by partnership.</div>
        </div>
      </section>
      {/* Benefits Section */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_TEAL }}>Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f8f6ff] rounded-xl shadow border-2 border-[#921573] p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_MAGENTA }}>For Farmers</h3>
            <ul className="list-disc pl-5 space-y-1 text-base text-gray-800">
              <li>Access to verified investors</li>
              <li>Resource support (inputs, seeds, equipment)</li>
              <li>Expert monitoring and advice</li>
              <li>Transparent profit sharing</li>
              <li>Improved yields and income</li>
            </ul>
          </div>
          <div className="bg-[#e6fbe6] rounded-xl shadow border-2 border-[#7ede56] p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_GREEN }}>For Investors</h3>
            <ul className="list-disc pl-5 space-y-1 text-base text-gray-800">
              <li>Partner with credible farmers</li>
              <li>Transparent investment process</li>
              <li>Impact tracking and reporting</li>
              <li>Attractive ROI and shared success</li>
              <li>Support sustainable agriculture</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Success Stories & Impact Metrics */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_MAGENTA }}>Success Stories & Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Success Story Card Example */}
          <div className="bg-white rounded-xl shadow border-2 border-[#921573] p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <img src="/lovable-uploads/hero-farmer-highquality.png" alt="Success Farmer" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-bold text-base" style={{ color: BRAND_MAGENTA }}>Isaac Mensah</div>
                <div className="text-xs text-gray-600">Tomatoes | 8 months | ROI: 30%</div>
              </div>
            </div>
            <div className="text-gray-700 mb-2">"Partnering with AgriLync helped me expand my farm and increase my profits. The process was transparent and supportive."</div>
            <div className="flex items-center gap-2 mt-2">
              <Star color={BRAND_GREEN} size={18} />
              <span className="text-xs text-gray-600">Investor: GreenGrow Investments</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border-2 border-[#7ede56] p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <img src="/lovable-uploads/musa.png" alt="Success Farmer" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-bold text-base" style={{ color: BRAND_GREEN }}>Fatima Al-Hassan</div>
                <div className="text-xs text-gray-600">Onions | 6 months | ROI: 30%</div>
              </div>
            </div>
            <div className="text-gray-700 mb-2">"The investor partnership enabled me to upgrade my irrigation and boost my harvest. Highly recommended!"</div>
            <div className="flex items-center gap-2 mt-2">
              <Star color={BRAND_MAGENTA} size={18} />
              <span className="text-xs text-gray-600">Investor: AgriVest Partners</span>
            </div>
          </div>
        </div>
        {/* Impact Metrics */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold" style={{ color: BRAND_MAGENTA }}>120+</div>
            <div className="text-xs text-gray-600">Successful Partnerships</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold" style={{ color: BRAND_GREEN }}>98%</div>
            <div className="text-xs text-gray-600">On-Time Project Delivery</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold" style={{ color: BRAND_TEAL }}>15%</div>
            <div className="text-xs text-gray-600">Average ROI</div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FarmPartner;
