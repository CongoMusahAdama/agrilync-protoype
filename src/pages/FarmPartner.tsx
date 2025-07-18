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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with New Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png')",
          }}
        ></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Transform Your Farm with Smart Investment
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-4xl mx-auto drop-shadow-lg font-medium animate-fade-in delay-700">
              Connect verified farmers with impact investors through our transparent 
              partnership platform. Secure funding, share profits, and build sustainable agricultural communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-1000">
              <Button 
                onClick={handleGetStarted}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-full shadow-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo Video
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="browse" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="browse">Browse Partners</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="success-stories">Success Stories</TabsTrigger>
            <TabsTrigger value="apply">Apply Now</TabsTrigger>
            <TabsTrigger value="monitor">Track Progress</TabsTrigger>
          </TabsList>

          {/* Browse Partners */}
          <TabsContent value="browse">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Verified Farmers Seeking Investment</h2>
                <div className="flex space-x-2">
                  <Input placeholder="Search by crop or location..." className="w-64" />
                  <Button className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200">
                    Search
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmers.map((farmer) => (
                  <Card key={farmer.id} className="hover:shadow-lg transition-shadow transform hover:scale-105 duration-300">
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={farmer.image}
                          alt={farmer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-lg">{farmer.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{farmer.location}</span>
                          </div>
                        </div>
                        {farmer.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Crop Type:</span>
                          <div className="font-semibold">{farmer.crop}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Farm Size:</span>
                          <div className="font-semibold">{farmer.farmSize}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Experience:</span>
                          <div className="font-semibold">{farmer.experience}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Credibility:</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-semibold">{farmer.credibilityScore}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-blue-800 font-semibold">Investment Needed:</span>
                          <span className="text-blue-900 font-bold text-lg">{farmer.needAmount}</span>
                        </div>
                        <div className="text-sm text-blue-700 mb-2">
                          <strong>Purpose:</strong> {farmer.purpose}
                        </div>
                        <div className="text-sm text-blue-700">
                          <strong>Expected ROI:</strong> {farmer.expectedROI}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handlePartnerNow(farmer.id)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition-all duration-200"
                        >
                          <Handshake className="h-4 w-4 mr-2" />
                          Partner Now
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 transform hover:scale-105 transition-all duration-200"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* How It Works */}
          <TabsContent value="how-it-works">
            
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">How FarmPartner Works</h2>
                <p className="text-xl text-gray-600">Simple, transparent, and profitable partnerships</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  {
                    step: '1',
                    title: 'Farmer Registration',
                    description: 'Farmers create verified profiles with farm details, credibility scores, and funding needs.',
                    icon: Users,
                    color: 'bg-green-100 text-green-600'
                  },
                  {
                    step: '2',
                    title: 'Investor Matching',
                    description: 'Smart algorithm matches investors with suitable farmers based on risk profile and returns.',
                    icon: Target,
                    color: 'bg-purple-100 text-purple-600'
                  },
                  {
                    step: '3',
                    title: 'Smart Contracts',
                    description: 'Transparent agreements with automated profit sharing and progress tracking.',
                    icon: Shield,
                    color: 'bg-blue-100 text-blue-600'
                  },
                  {
                    step: '4',
                    title: 'Shared Success',
                    description: 'Extension agents monitor progress while both parties share in the harvest profits.',
                    icon: Award,
                    color: 'bg-orange-100 text-orange-600'
                  }
                ].map((item, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                        <item.icon className="h-8 w-8" />
                      </div>
                      <div className="text-2xl font-bold text-gray-400 mb-2">Step {item.step}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Partnership Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-green-800 mb-4">For Farmers</h4>
                    <ul className="space-y-3">
                      {[
                        'Access to quality inputs and equipment',
                        'No upfront costs or interest rates',
                        'Expert guidance from extension agents',
                        'Guaranteed market for produce',
                        'Profit sharing instead of debt'
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-purple-800 mb-4">For Investors</h4>
                    <ul className="space-y-3">
                      {[
                        'Competitive returns (25-35% annually)',
                        'Social impact investing',
                        'Diversified agricultural portfolio',
                        'Professional monitoring and reports',
                        'Transparent smart contract execution'
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Success Stories */}
          <TabsContent value="success-stories">
            
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Success Stories</h2>
                <p className="text-xl text-gray-600">Real results from our farmer-investor partnerships</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {successStories.map((story, index) => (
                  <Card key={index} className="bg-gradient-to-br from-green-50 to-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Partnership Success</h3>
                        <Badge className="bg-green-600 text-white">{story.roi} ROI</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-gray-500 text-sm">Farmer:</span>
                          <div className="font-semibold">{story.farmer}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Investor:</span>
                          <div className="font-semibold">{story.investor}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Crop:</span>
                          <div className="font-semibold">{story.crop}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Duration:</span>
                          <div className="font-semibold">{story.duration}</div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{story.investment}</div>
                            <div className="text-sm text-gray-600">Investment</div>
                          </div>
                          <div className="text-2xl text-gray-400">→</div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{story.returns}</div>
                            <div className="text-sm text-gray-600">Returns</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-purple-600 text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Join Our Success Network</h3>
                  <p className="text-purple-100 mb-6">
                    Over $500,000 invested, 200+ successful partnerships, and growing every month.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-3xl font-bold">$500K+</div>
                      <div className="text-purple-200">Total Investments</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">200+</div>
                      <div className="text-purple-200">Partnerships</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">28%</div>
                      <div className="text-purple-200">Average ROI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Apply Now */}
          <TabsContent value="apply">
            
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Apply for FarmPartner Initiative</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Button 
                      variant={selectedRole === 'farmer' ? 'default' : 'outline'}
                      onClick={() => setSelectedRole('farmer')}
                      className="h-20 flex flex-col transform hover:scale-105 transition-all duration-200"
                    >
                      <Users className="h-6 w-6 mb-2" />
                      Farmer
                    </Button>
                    <Button 
                      variant={selectedRole === 'investor' ? 'default' : 'outline'}
                      onClick={() => setSelectedRole('investor')}
                      className="h-20 flex flex-col transform hover:scale-105 transition-all duration-200"
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Investor
                    </Button>
                    <Button 
                      variant={selectedRole === 'association' ? 'default' : 'outline'}
                      onClick={() => setSelectedRole('association')}
                      className="h-20 flex flex-col transform hover:scale-105 transition-all duration-200"
                    >
                      <Handshake className="h-6 w-6 mb-2" />
                      Association
                    </Button>
                  </div>

                  {selectedRole === 'farmer' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Farmer Application</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Full Name" />
                        <Input placeholder="Phone Number" />
                        <Input placeholder="Farm Location" />
                        <Input placeholder="Farm Size (hectares)" />
                        <Input placeholder="Primary Crop" />
                        <Input placeholder="Years of Experience" />
                      </div>
                      <Input placeholder="Funding Amount Needed ($)" />
                      <Textarea placeholder="Describe what you need funding for and your farming plans..." />
                      <Button className="w-full bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200">
                        Submit Farmer Application
                      </Button>
                    </div>
                  )}

                  {selectedRole === 'investor' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Investor Application</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Full Name / Organization" />
                        <Input placeholder="Email Address" />
                        <Input placeholder="Phone Number" />
                        <Input placeholder="Investment Capacity ($)" />
                      </div>
                      <Input placeholder="Preferred Investment Range ($)" />
                      <Textarea placeholder="Investment preferences and criteria..." />
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition-all duration-200">
                        Submit Investor Application
                      </Button>
                    </div>
                  )}

                  {selectedRole === 'association' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Association Application</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Association Name" />
                        <Input placeholder="Registration Number" />
                        <Input placeholder="Contact Person" />
                        <Input placeholder="Phone Number" />
                        <Input placeholder="Email Address" />
                        <Input placeholder="Number of Members" />
                      </div>
                      <Input placeholder="Primary Location/Region" />
                      <Textarea placeholder="Describe your association and how you support farmers..." />
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                        Submit Association Application
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Track Progress */}
          <TabsContent value="monitor">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-6 w-6 text-green-600" />
                    <span>Partnership Progress Dashboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-gray-600">Crop Development</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">$2,100</div>
                      <div className="text-gray-600">Investment Used</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">32%</div>
                      <div className="text-gray-600">Projected ROI</div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={handleTrackProgress}
                      className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                    >
                      View Detailed Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: '2 days ago', update: 'Fertilizer application completed successfully' },
                        { date: '1 week ago', update: 'Crop health assessment - excellent growth' },
                        { date: '2 weeks ago', update: 'Pest control measures implemented' },
                        { date: '1 month ago', update: 'Partnership agreement activated' }
                      ].map((item, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">{item.update}</div>
                            <div className="text-sm text-gray-500">{item.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Change Agent Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-semibold text-green-800">Latest Report</div>
                        <div className="text-sm text-green-700 mt-2">
                          Crops are developing well with healthy growth patterns. 
                          Farmer is following all recommended practices. Expected harvest 
                          in 6 weeks with projected yield of 4.2 tons per hectare.
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          By: Samuel Owusu (Extension Agent) - 3 days ago
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default FarmPartner;
