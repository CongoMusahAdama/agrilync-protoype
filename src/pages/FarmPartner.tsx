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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Brand colors
const BRAND_MAGENTA = '#921573';
const BRAND_GREEN = '#7ede56';
const BRAND_TEAL = '#002F37';
const BRAND_WHITE = '#FFFFFF';

const FarmPartner = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contactFarmer, setContactFarmer] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logText, setLogText] = useState('');
  const [progressLogs, setProgressLogs] = useState([
    { date: '2024-07-10', text: 'Planted maize seeds. Soil moisture optimal.' },
    { date: '2024-07-11', text: 'Applied fertilizer. No issues reported.' },
  ]);

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
      image: '/placeholder.svg',
      pending: false // Added for new section
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
      image: '/placeholder.svg',
      pending: true // Added for new section
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
      image: '/placeholder.svg',
      pending: false // Added for new section
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

  function handleContact(farmer) {
    setContactFarmer(farmer);
  }
  function handleSendContact() {
    setContactFarmer(null);
    // Simulate sending message
  }
  function handleAddLog() {
    setProgressLogs([...progressLogs, { date: new Date().toISOString().slice(0,10), text: logText }]);
    setLogText('');
    setShowLogModal(false);
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] w-full overflow-hidden mb-8 bg-white">
        <div className="text-center mb-8 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-down" style={{ color: BRAND_MAGENTA }}>
            FarmPartner Initiative
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto mb-8">
            Revolutionizing agriculture through intelligent farmer-investor partnerships. 
            <span className="block mt-2 font-semibold" style={{ color: BRAND_TEAL }}>
              Transparent collaboration. Verified investors. Shared success.
            </span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="mr-2 h-4 w-4" />
              Verified Partners
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <TrendingUp className="mr-2 h-4 w-4" />
              25% Average ROI
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="mr-2 h-4 w-4" />
              500+ Successful Partnerships
            </Badge>
          </div>
        </div>
      </section>
      {/* Add smooth scroll nav */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur shadow-sm py-2 mb-6 animate-fade-in-down">
        <ul className="flex flex-wrap justify-center gap-6 text-sm font-semibold">
          <li><a href="#how-it-works" className="hover:text-[#921573] transition-colors">How it Works</a></li>
          <li><a href="#verified-farmers" className="hover:text-[#177209] transition-colors">Verified Farmers</a></li>
          <li><a href="#profit-sharing" className="hover:text-[#002F37] transition-colors">Profit Sharing</a></li>
          <li><a href="#benefits" className="hover:text-[#7ede56] transition-colors">Benefits</a></li>
          <li><a href="#progress" className="hover:text-[#921573] transition-colors">Progress Log</a></li>
        </ul>
      </nav>
      {/* Matchmaking Engine Section */}
      <section id="how-it-works" className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-12 animate-fade-in-up bg-white rounded-xl shadow-sm py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: BRAND_TEAL }}>
          Intelligent Matchmaking Engine
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Modern Vertical Stepper for How It Works */}
          <div className="flex flex-col justify-center h-full">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: BRAND_MAGENTA }}>
              <Target size={24} />
              How It Works
            </h3>
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#921573] via-[#7ede56] to-[#002F37] rounded-full"></div>
              {[
                {
                  color: BRAND_MAGENTA,
                  number: 1,
                  title: 'Farm Profile Analysis',
                  desc: 'AI analyzes crop type, farm size, location, and financial needs',
                },
                {
                  color: BRAND_GREEN,
                  number: 2,
                  title: 'Investor Matching',
                  desc: 'Connect with verified investors aligned with your goals',
                },
                {
                  color: BRAND_TEAL,
                  number: 3,
                  title: 'Partnership Management',
                  desc: 'Real-time tracking and transparent communication',
                },
              ].map((step, idx) => (
                <div
                  key={step.number}
                  className="flex items-start gap-4 mb-8 last:mb-0 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 250}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg" style={{ backgroundColor: step.color }}>
                      {step.number}
                    </div>
                    {idx < 2 && (
                      <div className="absolute left-1/2 top-full w-1 h-6 bg-gray-200 -translate-x-1/2"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Modern Partnership Flow */}
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: BRAND_TEAL }}>Partnership Flow</h3>
            <div className="flex items-center gap-6 w-full justify-center">
              <div className="flex flex-col items-center">
                <div className="bg-[#921573] p-4 rounded-full shadow-lg mb-2">
                  <Users color="#fff" size={32} />
                </div>
                <span className="text-sm font-semibold text-[#921573]">Farmers</span>
              </div>
              <div className="flex items-center">
                <span className="block w-10 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full animate-flow-arrow"></span>
                <span className="mx-2 text-2xl font-bold text-[#7ede56]">⇄</span>
                <span className="block w-10 h-1 bg-gradient-to-r from-[#7ede56] to-[#002F37] rounded-full animate-flow-arrow"></span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[#7ede56] p-4 rounded-full shadow-lg mb-2">
                  <DollarSign color="#fff" size={32} />
                </div>
                <span className="text-sm font-semibold text-[#177209]">Investors</span>
              </div>
            </div>
            <div className="flex flex-col items-center mt-6">
              <span className="text-2xl">↕</span>
              <div className="flex flex-col items-center mt-2">
                <span className="font-semibold text-[#002F37]">Verified Partnership</span>
                <span className="text-xs text-gray-600">Impact-focused, transparent, and secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Investor Verification & Transparency Measures */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: BRAND_MAGENTA }}>
          Investor Verification & Transparency Measures
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Shield color={BRAND_MAGENTA} size={48} className="mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_MAGENTA }}>Strict Verification</h3>
            <p className="text-sm text-gray-600">
              Multi-step verification process including financial background checks, 
              agricultural experience validation, and reference verification.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp color={BRAND_GREEN} size={48} className="mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_GREEN }}>Real-time Tracking</h3>
            <p className="text-sm text-gray-600">
              Track every transaction, milestone, and partnership progress through 
              our transparent dashboard system.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <CheckCircle color={BRAND_TEAL} size={48} className="mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Accountability</h3>
            <p className="text-sm text-gray-600">
              Regular audits, performance reviews, and farmer feedback ensure 
              continuous accountability and quality partnerships.
            </p>
          </div>
        </div>
      </section>
      {/* Verified Farmer Access Section */}
      <section id="verified-farmers" className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-12 animate-fade-in-up bg-white rounded-xl shadow-sm py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: BRAND_GREEN }}>
          Verified Farmers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {farmers.map((farmer: any, idx: number) => (
            <div key={farmer.id} className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start animate-fade-in-up transition-transform duration-300 hover:scale-105 border-t-4" style={{ borderTopColor: farmer.pending ? '#fbbf24' : '#7ede56', animationDelay: `${idx * 120}ms` }}>
              <div className="flex items-center gap-3 mb-2 w-full">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-[#921573]">
                  {farmer.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg" style={{ color: BRAND_MAGENTA }}>{farmer.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={14} className="inline" /> {farmer.location}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${farmer.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  <CheckCircle size={14} className="inline" /> Verified
                </span>
              </div>
              <div className="mb-2 w-full">
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  <span className="bg-gray-50 px-2 py-1 rounded">Crop: <span className="font-semibold text-[#177209]">{farmer.crop}</span></span>
                  <span className="bg-gray-50 px-2 py-1 rounded">Farm Size: <span className="font-semibold">{farmer.farmSize}</span></span>
                  <span className="bg-gray-50 px-2 py-1 rounded">Experience: <span className="font-semibold">{farmer.experience}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 w-full">
                <span className="inline-flex items-center gap-1 font-semibold text-green-700">
                  <Star size={16} className="inline" />
                  {farmer.credibilityScore}
                </span>
                <span className="text-xs text-gray-500">Credibility Score</span>
              </div>
              <div className="flex items-center gap-2 mt-auto w-full">
                <Button size="sm" variant="outline" onClick={() => handleContact(farmer)}>
                  Contact
                </Button>
                {farmer.pending ? (
                  <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Pending Approval</span>
                ) : (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Available</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Modal or popup for contact can be implemented here */}
      </section>
      {/* Profit Sharing Diagram */}
      <section id="profit-sharing" className="w-full max-w-3xl mx-auto px-2 sm:px-6 mb-8 animate-fade-in-up bg-white rounded-xl shadow-sm py-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center" style={{ color: BRAND_MAGENTA }}>Profit Sharing</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Enhanced Circular Diagram */}
          <div className="relative w-56 h-56 mb-6 animate-fade-in-up">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              {/* Farmer: 60% */}
              <circle cx="18" cy="18" r="16" fill="none" stroke="#921573" strokeWidth="4" strokeDasharray="60,40" strokeDashoffset="0" className="animate-stroke-draw" style={{ animationDelay: '0ms' }} />
              {/* Investor: 35% */}
              <circle cx="18" cy="18" r="16" fill="none" stroke="#7ede56" strokeWidth="4" strokeDasharray="35,65" strokeDashoffset="60" className="animate-stroke-draw" style={{ animationDelay: '300ms' }} />
              {/* Extension Agent: 5% */}
              <circle cx="18" cy="18" r="16" fill="none" stroke="#002F37" strokeWidth="4" strokeDasharray="5,95" strokeDashoffset="95" className="animate-stroke-draw" style={{ animationDelay: '600ms' }} />
            </svg>
            {/* Animated center icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PieChart color={BRAND_MAGENTA} size={48} className="animate-weather-bounce" />
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-4 min-w-[160px]">
            <div className="flex items-center gap-3">
              <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: '#921573' }}></span>
              <span className="font-bold text-[#921573] text-base">Farmer</span>
              <span className="ml-auto text-sm font-semibold">60%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: '#7ede56' }}></span>
              <span className="font-bold text-[#7ede56] text-base">Investor</span>
              <span className="ml-auto text-sm font-semibold">35%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: '#002F37' }}></span>
              <span className="font-bold text-[#002F37] text-base">Extension Agent</span>
              <span className="ml-auto text-sm font-semibold">5%</span>
            </div>
          </div>
        </div>
        <div className="text-center max-w-xl mx-auto mb-4 text-gray-700 animate-fade-in-up mt-6">
          <p>
            Profit is shared transparently among all stakeholders. Farmers receive the largest share, investors gain attractive returns, and extension agents ensure accountability and success.
          </p>
        </div>
        <div className="mt-2 text-xs text-gray-500 animate-fade-in-up">*Example split. Actual terms may vary by partnership.</div>
      </section>
      {/* Benefits Section */}
      <section id="benefits" className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-8 animate-fade-in-up bg-white rounded-xl shadow-sm py-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_TEAL }}>Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-0 animate-fade-in-up">
            <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_MAGENTA }}>For Farmers</h3>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-800">
              {[
                'Access to verified investors',
                'Resource support (inputs, seeds, equipment)',
                'Expert monitoring and advice',
                'Transparent profit sharing',
                'Improved yields and income'
              ].map((point, idx) => (
                <li key={point} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 120}ms`, animationFillMode: 'forwards' }}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="p-0 animate-fade-in-up">
            <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_GREEN }}>For Investors</h3>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-800">
              {[
                'Partner with credible farmers',
                'Transparent investment process',
                'Impact tracking and reporting',
                'Attractive ROI and shared success',
                'Support sustainable agriculture'
              ].map((point, idx) => (
                <li key={point} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${idx * 120}ms`, animationFillMode: 'forwards' }}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {/* Enhanced Daily Progress Log */}
      <section id="progress" className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-12 animate-fade-in-up bg-white rounded-xl shadow-sm py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: BRAND_MAGENTA }}>
          Daily Progress Log
        </h2>
        <div className="mb-4 flex justify-end">
          <Button size="sm" onClick={() => setShowLogModal(true)}>
            Add Update
          </Button>
        </div>
        <div className="relative">
          <div className="border-l-4 border-[#921573] absolute left-6 top-0 h-full z-0"></div>
          <ul className="space-y-6 pl-12">
            {progressLogs.map((log, idx) => (
              <li key={idx} className="relative animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="absolute -left-7 top-1.5 w-6 h-6 rounded-full bg-[#921573] flex items-center justify-center text-white shadow-lg">
                  <Calendar size={16} />
                </div>
                <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#921573]">{log.date}</span>
                    {/* Optionally, add activity type icons here */}
                  </div>
                  <div className="text-base text-gray-800 leading-relaxed">{log.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Modal for adding log */}
        <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Daily Update</DialogTitle>
            </DialogHeader>
            <textarea className="w-full border rounded p-2 mb-4" rows={4} value={logText} onChange={e => setLogText(e.target.value)} placeholder="Describe today's farm activity, issues, or milestones..." />
            <DialogFooter>
              <Button onClick={handleAddLog} disabled={!logText.trim()}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      {/* Success Stories & Impact */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-6 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: BRAND_MAGENTA }}>Success Stories & Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Success Story Card Example */}
          <div className="bg-white rounded-xl shadow p-6 animate-fade-in-up">
            <div className="font-bold text-base mb-2" style={{ color: BRAND_MAGENTA }}>Isaac Mensah</div>
            <div className="text-xs text-gray-600 mb-2">Tomatoes | 8 months | ROI: 30%</div>
            <div className="text-gray-700 mb-2">"Partnering with AgriLync helped me expand my farm and increase my profits. The process was transparent and supportive."</div>
            <div className="flex items-center gap-2 mt-2">
              <Star color={BRAND_GREEN} size={18} />
              <span className="text-xs text-gray-600">Investor: GreenGrow Investments</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 animate-fade-in-up">
            <div className="font-bold text-base mb-2" style={{ color: BRAND_GREEN }}>Fatima Al-Hassan</div>
            <div className="text-xs text-gray-600 mb-2">Onions | 6 months | ROI: 30%</div>
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
      {/* Contact Farmer Modal */}
      <Dialog open={!!contactFarmer} onOpenChange={() => setContactFarmer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {contactFarmer?.name}</DialogTitle>
          </DialogHeader>
          <textarea className="w-full border rounded p-2 mb-4" rows={4} placeholder="Write your message to the farmer..." />
          <DialogFooter>
            <Button onClick={handleSendContact}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default FarmPartner;

