import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarProfileCard from '@/components/SidebarProfileCard';
import {
  Leaf,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Activity,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Menu,
  X,
  Cloud,
  Sun,
  Moon,
  CloudRain,
  Droplets,
  FileText,
  Sprout,
  Scissors,
  Wrench,
  MoreHorizontal,
  CheckCircle,
  Wind,
  Thermometer
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const Dashboard = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [farmStage, setFarmStage] = useState<string>('planning');
  const { darkMode, toggleDarkMode } = useDarkMode();
  const sidebarDarkMode = !darkMode;
  const isMobile = useIsMobile();

  // Show welcome modal on first login (check localStorage)
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenFarmProgressMessage');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
      localStorage.setItem('hasSeenFarmProgressMessage', 'true');
    }
  }, []);

  // Trigger animations on page load
  useEffect(() => {
    // Small delay to ensure smooth animation on page load/refresh
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);


  // Mock data for different user types
  const mockData = {
    grower: {
      name: 'John Agribusiness',
      phone: '+233 24 123 4567',
      email: 'john.agribusiness@email.com',
      region: 'Ashanti',
      district: 'Kumasi',
      farmAddress: 'Off Ejisu Road, Near Kumasi Technical University, Kumasi',
      farmLatitude: 6.6885,
      farmLongitude: -1.6244,
      uniqueId: 'LYG1234567',
      weather: {
        temperature: 30,
        condition: 'Sunny',
        humidity: 58,
        location: 'Kumasi, Ashanti',
        windSpeed: 15,
        windDirection: 'E',
        pressure: 1015,
        visibility: 12,
        uvIndex: 8,
        feelsLike: 32,
        chanceOfRain: 0,
        sunrise: '6:10 AM',
        sunset: '6:25 PM',
        hourlyForecast: [
          { time: '6:00 AM', temperature: 26, condition: 'Sunny', icon: 'sun' },
          { time: '9:00 AM', temperature: 29, condition: 'Sunny', icon: 'sun' },
          { time: '12:00 PM', temperature: 34, condition: 'Sunny', icon: 'sun' },
          { time: '3:00 PM', temperature: 35, condition: 'Sunny', icon: 'sun' },
          { time: '6:00 PM', temperature: 33, condition: 'Sunny', icon: 'sun' },
          { time: '9:00 PM', temperature: 31, condition: 'Partly Cloudy', icon: 'cloud' }
        ],
        forecast: [
          { day: 'Today', high: 32, low: 26, condition: 'Sunny', icon: 'sun' },
          { day: 'Tomorrow', high: 31, low: 25, condition: 'Partly Cloudy', icon: 'cloud' },
          { day: 'Day 3', high: 28, low: 23, condition: 'Cloudy', icon: 'cloud' },
          { day: 'Day 4', high: 30, low: 24, condition: 'Sunny', icon: 'sun' },
          { day: 'Day 5', high: 29, low: 23, condition: 'Sunny', icon: 'sun' },
          { day: 'Day 6', high: 27, low: 21, condition: 'Cloudy', icon: 'cloud' },
          { day: 'Day 7', high: 28, low: 22, condition: 'Rainy', icon: 'rain' }
        ]
      },
      stats: {
        totalProjects: 12,
        activeConnections: 8,
        totalInvestment: 45000,
        monthlyGrowth: 15.2
      },
      recentActivities: [
        { id: 1, type: 'connection', message: 'New farmer connection: Sarah from Kumasi', time: '2 hours ago' },
        { id: 2, type: 'investment', message: 'Investment proposal approved for rice farming', time: '1 day ago' },
        { id: 3, type: 'update', message: 'Weather alert: Heavy rain expected tomorrow', time: '2 days ago' }
      ],
      projects: [
        { id: 1, name: 'Rice Farming Project', location: 'Kumasi', status: 'active', progress: 75, investment: 15000 },
        { id: 2, name: 'Vegetable Garden', location: 'Accra', status: 'planning', progress: 25, investment: 8000 },
        { id: 3, name: 'Poultry Farm', location: 'Tamale', status: 'completed', progress: 100, investment: 22000 }
      ]
    },
    investor: {
      name: 'Maria Investment',
      stats: {
        totalInvestments: 6,
        activePortfolio: 4,
        totalReturns: 12500,
        monthlyGrowth: 8.7
      },
      recentActivities: [
        { id: 1, type: 'return', message: 'Received $2,500 return from rice project', time: '1 hour ago' },
        { id: 2, type: 'proposal', message: 'New investment opportunity: Cassava farming', time: '3 hours ago' },
        { id: 3, type: 'update', message: 'Portfolio performance report available', time: '1 day ago' }
      ],
      investments: [
        { id: 1, name: 'Rice Farming - Kumasi', farmer: 'Sarah Mensah', amount: 15000, returns: 2500, status: 'active' },
        { id: 2, name: 'Vegetable Garden - Accra', farmer: 'Kwame Asante', amount: 8000, returns: 1200, status: 'active' },
        { id: 3, name: 'Poultry Farm - Tamale', farmer: 'Aisha Ibrahim', amount: 22000, returns: 3500, status: 'completed' }
      ]
    },
    farmer: {
      name: 'Kwame Asante',
      phone: '+233 24 123 4567',
      email: 'kwame.asante@email.com',
      region: 'Ashanti',
      district: 'Kumasi',
      farmAddress: 'Off Ejisu Road, Near Kumasi Technical University, Kumasi',
      farmLatitude: 6.6885,
      farmLongitude: -1.6244,
      farmType: 'Crop', // Can be 'Crop', 'Livestock', or 'Mixed'
      weather: {
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        location: 'Kumasi, Ashanti',
        windSpeed: 12,
        windDirection: 'NE',
        pressure: 1013,
        visibility: 10,
        uvIndex: 6,
        feelsLike: 30,
        chanceOfRain: 0,
        sunrise: '6:15 AM',
        sunset: '6:30 PM',
        hourlyForecast: [
          { time: '6:00 AM', temperature: 25, condition: 'Cloudy', icon: 'cloud' },
          { time: '9:00 AM', temperature: 28, condition: 'Partly Cloudy', icon: 'cloud' },
          { time: '12:00 PM', temperature: 33, condition: 'Sunny', icon: 'sun' },
          { time: '3:00 PM', temperature: 34, condition: 'Sunny', icon: 'sun' },
          { time: '6:00 PM', temperature: 32, condition: 'Sunny', icon: 'sun' },
          { time: '9:00 PM', temperature: 30, condition: 'Partly Cloudy', icon: 'cloud' }
        ],
        forecast: [
          { day: 'Today', high: 30, low: 24, condition: 'Partly Cloudy', icon: 'cloud' },
          { day: 'Tomorrow', high: 32, low: 25, condition: 'Sunny', icon: 'sun' },
          { day: 'Day 3', high: 29, low: 23, condition: 'Light Rain', icon: 'rain' },
          { day: 'Day 4', high: 31, low: 24, condition: 'Sunny', icon: 'sun' },
          { day: 'Day 5', high: 28, low: 22, condition: 'Cloudy', icon: 'cloud' },
          { day: 'Day 6', high: 27, low: 21, condition: 'Rainy', icon: 'rain' },
          { day: 'Day 7', high: 29, low: 23, condition: 'Storm', icon: 'rain' }
        ]
      },
      investmentCategory: 'Rice Farming',
      farmSize: '5 acres',
      farmingExperience: '8 years',
      currentStage: 'Growing',
      extensionAgent: {
        name: 'Dr. Sarah Mensah',
        phone: '+233 20 987 6543',
        email: 'sarah.mensah@agrilync.com',
        region: 'Ashanti'
      },
      stats: {
        totalCrops: 5,
        activeProjects: 3,
        totalEarnings: 8500,
        monthlyGrowth: 12.3,
        investorMatches: 2,
        pendingMatches: 1
      },
      recentActivities: [
        { id: 1, type: 'harvest', message: 'Rice harvest completed - 2.5 tons', time: '30 minutes ago' },
        { id: 2, type: 'weather', message: 'Weather alert: Optimal conditions for planting', time: '2 hours ago' },
        { id: 3, type: 'ai', message: 'AI recommendation: Apply fertilizer this week', time: '1 day ago' },
        { id: 4, type: 'investor', message: 'New investor interest in your rice project', time: '2 days ago' },
        { id: 5, type: 'training', message: 'Training session: Modern irrigation techniques', time: '3 days ago' }
      ],
      crops: [
        { id: 1, name: 'Rice', variety: 'Jasmine', area: '2 acres', status: 'harvested', yield: '2.5 tons', investment: 'GHS 15,000' },
        { id: 2, name: 'Tomatoes', variety: 'Cherry', area: '0.5 acres', status: 'growing', yield: 'Expected 1 ton', investment: 'GHS 8,000' },
        { id: 3, name: 'Maize', variety: 'Hybrid', area: '1.5 acres', status: 'planted', yield: 'Expected 3 tons', investment: 'GHS 12,000' },
        { id: 4, name: 'Cassava', variety: 'Local', area: '1 acre', status: 'planning', yield: 'Expected 4 tons', investment: 'GHS 6,000' }
      ],
      livestock: [
        { id: 1, name: 'Poultry', variety: 'Broiler', quantity: '200 birds', status: 'growing', production: '150 kg/month', investment: 'GHS 20,000' },
        { id: 2, name: 'Cattle', variety: 'Local', quantity: '15 heads', status: 'active', production: '50L milk/day', investment: 'GHS 35,000' },
        { id: 3, name: 'Goat', variety: 'West African Dwarf', quantity: '30 heads', status: 'active', production: 'Growing herd', investment: 'GHS 15,000' }
      ],
      investorMatches: [
        { id: 1, investorName: 'Green Investment Ltd', amount: 'GHS 25,000', status: 'matched', interest: 'Rice farming', date: '2024-01-15' },
        { id: 2, investorName: 'AgriFund Ghana', amount: 'GHS 18,000', status: 'matched', interest: 'Mixed farming', date: '2024-01-10' },
        { id: 3, investorName: 'Farm Capital Partners', amount: 'GHS 30,000', status: 'pending', interest: 'Vegetable farming', date: '2024-01-20' }
      ],
      trainingSessions: [
        { id: 1, title: 'Modern Irrigation Techniques', date: '2024-01-25', time: '10:00 AM', status: 'upcoming', type: 'workshop' },
        { id: 2, title: 'Soil Health Management', date: '2024-01-20', time: '2:00 PM', status: 'completed', type: 'webinar' },
        { id: 3, title: 'Pest and Disease Control', date: '2024-01-18', time: '9:00 AM', status: 'completed', type: 'field visit' }
      ],
      notifications: [
        { id: 1, type: 'info', title: 'Weather Update', message: 'Heavy rain expected tomorrow. Consider covering your crops.', time: '2 hours ago', read: false },
        { id: 2, type: 'success', title: 'Investment Approved', message: 'Your rice farming project has been approved for GHS 25,000 investment.', time: '1 day ago', read: true },
        { id: 3, type: 'warning', title: 'Training Reminder', message: 'Modern Irrigation Techniques workshop starts in 2 days.', time: '2 days ago', read: false },
        { id: 4, type: 'info', title: 'Extension Agent Visit', message: 'Dr. Sarah Mensah will visit your farm next week.', time: '3 days ago', read: true }
      ],
      // Livestock-specific notifications (used when farmType is 'Livestock')
      livestockNotifications: [
        { id: 1, type: 'info', title: 'Health Alert', message: 'Vaccination schedule reminder: Poultry vaccination due this week.', time: '2 hours ago', read: false },
        { id: 2, type: 'success', title: 'Investment Approved', message: 'Your livestock farming project has been approved for GHS 35,000 investment.', time: '1 day ago', read: true },
        { id: 3, type: 'warning', title: 'Training Reminder', message: 'Livestock Health Management workshop starts in 2 days.', time: '2 days ago', read: false },
        { id: 4, type: 'info', title: 'Extension Agent Visit', message: 'Dr. Sarah Mensah will visit your farm next week.', time: '3 days ago', read: true }
      ]
    },
    agent: {
      name: 'Aisha Agent',
      stats: {
        totalFarmers: 25,
        activeProjects: 8,
        totalEarnings: 12000,
        monthlyGrowth: 18.5
      },
      recentActivities: [
        { id: 1, type: 'farmer', message: 'New farmer onboarded: Kwame from Kumasi', time: '1 hour ago' },
        { id: 2, type: 'monitoring', message: 'Farm inspection completed for rice project', time: '3 hours ago' },
        { id: 3, type: 'update', message: 'Weather alert sent to 15 farmers', time: '1 day ago' }
      ],
      farmers: [
        { id: 1, name: 'Kwame Asante', location: 'Kumasi', status: 'active', crops: 'Rice, Maize', lastVisit: '2 days ago' },
        { id: 2, name: 'Sarah Mensah', location: 'Accra', status: 'active', crops: 'Tomatoes', lastVisit: '1 week ago' },
        { id: 3, name: 'Aisha Ibrahim', location: 'Tamale', status: 'pending', crops: 'Cassava', lastVisit: '2 weeks ago' }
      ]
    }
  };

  const currentData = mockData[userType as keyof typeof mockData];

  if (!currentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid User Type</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const getDashboardTitle = () => {
    switch (userType) {
      case 'grower': return 'Lync Grower Dashboard';
      case 'investor': return 'Lync Investor Dashboard';
      case 'farmer': return 'Solo Farmer Dashboard';
      case 'agent': return 'Lync Agent Dashboard';
      default: return 'Dashboard';
    }
  };

  const getDashboardIcon = () => {
    switch (userType) {
      case 'grower': return <Users className="h-6 w-6" />;
      case 'investor': return <TrendingUp className="h-6 w-6" />;
      case 'farmer': return <Leaf className="h-6 w-6" />;
      case 'agent': return <UserCheck className="h-6 w-6" />;
      default: return <Activity className="h-6 w-6" />;
    }
  };

  const getActiveInvestmentCount = () => {
    if ('investorMatches' in currentData && Array.isArray(currentData.investorMatches)) {
      return currentData.investorMatches.filter((match: any) => ['matched', 'active', 'approved'].includes(match.status)).length;
    }
    if ('investments' in currentData && Array.isArray((currentData as any).investments)) {
      return (currentData as any).investments.filter((investment: any) => investment.status === 'active' || investment.status === 'matched').length;
    }
    if ('projects' in currentData && Array.isArray((currentData as any).projects)) {
      return (currentData as any).projects.filter((project: any) => project.status === 'active' || project.currentStage === 'active').length;
    }
    return 0;
  };

  const getActiveInvestmentLabel = () => {
    if (userType === 'investor') {
      return 'Active Portfolio';
    }
    if (userType === 'agent') {
      return 'Active Farmer Investments';
    }
    return 'Active Investments';
  };

  // Helper functions to get farm type specific terminology
  const getFarmTypeLabel = () => {
    const farmType = 'farmType' in currentData ? currentData.farmType : '';
    if (farmType === 'Crop') return 'Crops';
    if (farmType === 'Livestock') return 'Livestock';
    return 'Crops/Livestock';
  };

  const getFarmTypeLabelSingular = () => {
    const farmType = 'farmType' in currentData ? currentData.farmType : '';
    if (farmType === 'Crop') return 'Crop';
    if (farmType === 'Livestock') return 'Livestock';
    return 'Farm Item';
  };

  const getFarmTypeLabelLower = () => {
    const farmType = 'farmType' in currentData ? currentData.farmType : '';
    if (farmType === 'Crop') return 'crops';
    if (farmType === 'Livestock') return 'livestock';
    return 'crops/livestock';
  };

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  const getFarmTypeWelcome = () => {
    const greeting = getTimeBasedGreeting();
    const farmType = 'farmType' in currentData ? currentData.farmType : '';
    if (farmType === 'Crop') return `${greeting}! What crops are we harvesting today?`;
    if (farmType === 'Livestock') return `${greeting}! How are your livestock doing today?`;
    return `${greeting}! What are we harvesting today?`;
  };

  const getFarmTypeUpdateMessage = () => {
    const farmType = 'farmType' in currentData ? currentData.farmType : '';
    if (farmType === 'Crop') return "Don't forget to update your crop progress! Track your planting, growth, and harvest activities to help AgriLync monitor your success";
    if (farmType === 'Livestock') return "Don't forget to update your livestock progress! Track your animals' health, feed, and production activities to help AgriLync monitor your success";
    return "Don't forget to update your farm progress! Track your crops and livestock activities to help AgriLync monitor your success";
  };

  const outlineButtonClasses = darkMode
    ? 'bg-[#01424d] text-white border-[#0f4a53] hover:bg-[#02596b] hover:text-white'
    : 'border-gray-200 text-[#002f37] hover:bg-gray-100';


  return (
    <DashboardLayout activeSidebarItem="dashboard" title="Dashboard">
      <div className="mb-6 sm:mb-8">
        <h2 className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Welcome, {currentData.name.split(' ')[0]}</h2>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getFarmTypeWelcome()}</p>
      </div>

      {/* Key Metric Cards */}
      <div className={`grid grid-cols-2 ${(userType === 'farmer' || userType === 'grower') ? 'lg:grid-cols-6' : 'lg:grid-cols-5'
        } gap-3 sm:gap-6 mb-8`}>
        {/* Weather Info - Deep Teal (only for farmers and growers) */}
        {(userType === 'farmer' || userType === 'grower') && 'weather' in currentData && currentData.weather && (
          <Card
            className={`bg-[#002f37] rounded-lg p-3 sm:p-6 shadow-lg transition-all duration-700 cursor-pointer hover:scale-105 relative overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: isLoaded ? '0ms' : '0ms' }}
            onClick={() => setShowWeatherModal(true)}
          >
            {/* Rain and Sun Animation Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
              {/* Sun Icon - Animated */}
              <div className="absolute top-2 right-2 z-20">
                <Sun className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-300 animate-pulse" />
              </div>

              {/* Rain Drops */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white/50 rounded-full"
                  style={{
                    left: `${(i * 5) % 100}%`,
                    top: '-20px',
                    width: '2px',
                    height: `${15 + (i % 5) * 3}px`,
                    animation: `rainFall ${0.8 + (i % 4) * 0.3}s linear infinite`,
                    animationDelay: `${i * 0.05}s`,
                    opacity: 0.5 + (i % 3) * 0.15
                  }}
                />
              ))}
            </div>

            <style>{`
                  @keyframes rainFall {
                    0% {
                      transform: translateY(-20px) translateX(0);
                      opacity: 0.5;
                    }
                    50% {
                      opacity: 0.7;
                    }
                    100% {
                      transform: translateY(250px) translateX(5px);
                      opacity: 0.2;
                    }
                  }
                `}</style>

            <div className="flex flex-col h-full relative z-10">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                {currentData.weather.condition.toLowerCase().includes('rain') ? (
                  <CloudRain className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                ) : currentData.weather.condition.toLowerCase().includes('cloud') ? (
                  <Cloud className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                ) : (
                  <Sun className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                )}
                <p className="text-[10px] sm:text-sm font-medium text-white">Weather</p>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-baseline gap-1 sm:gap-2 mb-0.5 sm:mb-2">
                  <p className="text-2xl sm:text-4xl font-bold text-white">
                    {currentData.weather.temperature}°
                  </p>
                  <span className="text-xs sm:text-lg text-white/80">C</span>
                </div>
                <p className="text-[10px] sm:text-sm text-white/90 mb-1 line-clamp-1">{currentData.weather.condition}</p>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Droplets className="h-3 w-3" />
                  <span>{currentData.weather.humidity}%</span>
                </div>
                <p className="text-xs text-white/70 mt-1 sm:mt-2 hidden sm:block">{currentData.weather.location}</p>
                <p className="text-xs text-white/70 mt-1 sm:mt-2 italic hidden sm:block">
                  Tap to check weather details
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Active Crops/Livestock - Green */}
        <Card className={`bg-[#7ede56] rounded-lg p-3 sm:p-6 shadow-lg transition-all duration-700 relative overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isLoaded ? '100ms' : '0ms' }}>
          {/* Leaf Pattern Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Leaf className="absolute top-1 right-1 h-12 w-12 text-white rotate-12" />
            <Leaf className="absolute bottom-2 left-2 h-8 w-8 text-white -rotate-12" />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
              <Leaf className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              <p className="text-[10px] sm:text-sm font-medium text-white">Active {getFarmTypeLabel()}</p>
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-2xl sm:text-4xl font-bold text-white">
                {'totalCrops' in currentData.stats ? currentData.stats.totalCrops : 0}
              </p>
            </div>
            <div className="flex justify-end mt-2 sm:mt-4">
              <a href="#" className="text-[10px] sm:text-sm font-medium text-white hover:underline">View</a>
            </div>
          </div>
        </Card>

        {/* Investor Matches - Orange */}
        <Card className={`bg-[#ffa500] rounded-lg p-3 sm:p-6 shadow-lg transition-all duration-700 relative overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isLoaded ? '200ms' : '0ms' }}>
          {/* Leaf Pattern Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Users className="absolute top-1 right-1 h-12 w-12 text-white/20" />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
              <Users className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              <p className="text-[10px] sm:text-sm font-medium text-white">Investor Matches</p>
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-2xl sm:text-4xl font-bold text-white">
                {'investorMatches' in currentData.stats ? currentData.stats.investorMatches : 0}
              </p>
            </div>
            <div className="flex justify-end mt-2 sm:mt-4">
              <button
                onClick={() => navigate(`/dashboard/${userType}/investor-matches`)}
                className="text-[10px] sm:text-sm font-medium text-white hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                View
              </button>
            </div>
          </div>
        </Card>

        {/* Training Sessions - Red/Coral */}
        <Card className={`bg-[#ff6347] rounded-lg p-3 sm:p-6 shadow-lg transition-all duration-700 relative overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isLoaded ? '300ms' : '0ms' }}>
          <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
              <Calendar className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              <p className="text-[10px] sm:text-sm font-medium text-white">Training</p>
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-2xl sm:text-4xl font-bold text-white">
                {'trainingSessions' in currentData ? currentData.trainingSessions.length : 0}
              </p>
            </div>
            <div className="flex justify-end mt-2 sm:mt-4">
              <button
                onClick={() => navigate(`/dashboard/${userType}/training-sessions`)}
                className="text-[10px] sm:text-sm font-medium text-white hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                View
              </button>
            </div>
          </div>
        </Card>

        {/* Total Earnings - Deep Magenta */}
        <Card className={`bg-[#921573] rounded-lg p-3 sm:p-6 shadow-lg transition-all duration-700 relative overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isLoaded ? '400ms' : '0ms' }}>
          <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
              <DollarSign className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              <p className="text-[10px] sm:text-sm font-medium text-white">Earnings</p>
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-lg sm:text-4xl font-bold text-white truncate">
                GHS {'totalEarnings' in currentData.stats ? currentData.stats.totalEarnings.toLocaleString() : '0'}
              </p>
            </div>
            <div className="flex justify-end mt-2 sm:mt-4">
              <a href="#" className="text-[10px] sm:text-sm font-medium text-white hover:underline">View</a>
            </div>
          </div>
        </Card>

        {/* Active Investments - Azure */}
        <Card className={`bg-[#1d9bf0] rounded-lg p-3 sm:p-6 shadow-lg transition-all duration-700 relative overflow-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isLoaded ? '500ms' : '0ms' }}>
          <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
              <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              <p className="text-[10px] sm:text-sm font-medium text-white">{getActiveInvestmentLabel()}</p>
            </div>
            <div className="flex-1 flex items-center">
              <p className="text-2xl sm:text-4xl font-bold text-white">
                {getActiveInvestmentCount()}
              </p>
            </div>
            <div className="flex justify-end mt-2 sm:mt-4">
              <button
                onClick={() => navigate(`/dashboard/${userType}/investor-matches?tab=investments`)}
                className="text-[10px] sm:text-sm font-medium text-white hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                View
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Farm Management Center */}
      <div className="relative bg-gradient-to-r from-[#002f37] to-[#921573] rounded-lg p-8 mb-8 overflow-hidden">
        {/* Leaf Pattern Background - Positioned around edges */}
        <div className="absolute inset-0 opacity-15 z-0">
          {/* Top edge leaves */}
          <div className="absolute top-2 left-2 w-6 h-6"><Leaf className="w-full h-full text-[#f4ffee] rotate-12" /></div>
          <div className="absolute top-2 right-2 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] -rotate-12" /></div>
          <div className="absolute top-4 left-1/4 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] rotate-45" /></div>
          <div className="absolute top-4 right-1/4 w-6 h-6"><Leaf className="w-full h-full text-[#f4ffee] -rotate-45" /></div>

          {/* Left edge leaves */}
          <div className="absolute top-1/4 left-2 w-6 h-6"><Leaf className="w-full h-full text-[#f4ffee] rotate-90" /></div>
          <div className="absolute top-3/4 left-2 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] -rotate-90" /></div>

          {/* Right edge leaves */}
          <div className="absolute top-1/4 right-2 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] rotate-12" /></div>
          <div className="absolute top-3/4 right-2 w-6 h-6"><Leaf className="w-full h-full text-[#f4ffee] -rotate-12" /></div>

          {/* Bottom edge leaves */}
          <div className="absolute bottom-2 left-1/4 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] rotate-45" /></div>
          <div className="absolute bottom-2 right-1/4 w-6 h-6"><Leaf className="w-full h-full text-[#f4ffee] -rotate-45" /></div>
          <div className="absolute bottom-2 left-2 w-6 h-6"><Leaf className="w-full h-full text-[#f4ffee] rotate-90" /></div>
          <div className="absolute bottom-2 right-2 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] -rotate-90" /></div>

          {/* Corner accent leaves - larger */}
          <div className="absolute top-1 left-12 w-7 h-7"><Leaf className="w-full h-full text-[#f4ffee] rotate-30" /></div>
          <div className="absolute top-1 right-12 w-7 h-7"><Leaf className="w-full h-full text-[#f4ffee] -rotate-30" /></div>
          <div className="absolute bottom-1 left-12 w-7 h-7"><Leaf className="w-full h-full text-[#f4ffee] rotate-60" /></div>
          <div className="absolute bottom-1 right-12 w-7 h-7"><Leaf className="w-full h-full text-[#f4ffee] -rotate-60" /></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#f4ffee] mb-2">Farm Management Center</h2>
            <p className="text-[#f4ffee] text-opacity-90">Helping farmers easily manage their {getFarmTypeLabelLower()} farm</p>
          </div>
          <div className="w-12 h-12 bg-[#f4ffee] bg-opacity-20 rounded-full flex items-center justify-center">
            <Activity className="h-6 w-6 text-[#f4ffee]" />
          </div>
        </div>
      </div>

      {/* Farm Stage Roadmap - Under Farm Management Center */}
      {(userType === 'farmer' || userType === 'grower') && (
        <Card className={`mb-8 transition-colors ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white'} ${darkMode ? 'border' : ''}`}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className={`flex items-center gap-2 text-lg sm:text-xl ${darkMode ? 'text-white' : ''}`}>
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-[#7ede56]" />
                  Your Farm Journey
                </CardTitle>
                <CardDescription className={`mt-2 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : ''}`}>See where you are in your farming cycle and update your current stage</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Select value={farmStage} onValueChange={setFarmStage}>
                  <SelectTrigger className={`h-10 w-full sm:w-48 border-2 border-[#7ede56] ${darkMode ? 'bg-[#002f37] text-white border-gray-600' : 'bg-white'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                    <SelectItem value="planning" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Planning</SelectItem>
                    <SelectItem value="planting" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Planting</SelectItem>
                    <SelectItem value="growing" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Growing</SelectItem>
                    <SelectItem value="harvesting" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Harvesting</SelectItem>
                    <SelectItem value="maintenance" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Maintenance</SelectItem>
                    <SelectItem value="other" className={darkMode ? 'text-white hover:bg-gray-800' : ''}>Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    // Handle save farm stage
                    console.log('Farm stage updated:', farmStage);
                  }}
                  className="bg-[#7ede56] hover:bg-[#6bc947] text-white w-full sm:w-auto"
                >
                  Update Stage
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6 custom-scrollbar">
            {/* Roadmap Timeline */}
            <div className="relative mt-6 min-w-[600px] px-4">
              {/* Progress Line */}
              <div className={`absolute top-5 sm:top-6 left-4 right-4 h-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div
                  className="h-1 bg-gradient-to-r from-[#7ede56] to-[#6bc947] rounded-full transition-all duration-500"
                  style={{
                    width: `${((['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].indexOf(farmStage) + 1) / 6) * 100}%`
                  }}
                ></div>
              </div>

              {/* Stages */}
              <div className="relative flex justify-between items-start">
                {['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].map((stage, index) => {
                  const currentIndex = ['planning', 'planting', 'growing', 'harvesting', 'maintenance', 'other'].indexOf(farmStage);
                  const isCompleted = index < currentIndex;
                  const isCurrent = index === currentIndex;
                  const isUpcoming = index > currentIndex;

                  // Get appropriate icon for each stage
                  const getStageIcon = () => {
                    if (isCompleted) {
                      return <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />;
                    }
                    switch (stage) {
                      case 'planning':
                        return <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />;
                      case 'planting':
                        return <Sprout className="h-4 w-4 sm:h-6 sm:w-6 text-white" />;
                      case 'growing':
                        return <Leaf className="h-4 w-4 sm:h-6 sm:w-6 text-white" />;
                      case 'harvesting':
                        return <Scissors className="h-4 w-4 sm:h-6 sm:w-6 text-white" />;
                      case 'maintenance':
                        return <Wrench className="h-4 w-4 sm:h-6 sm:w-6 text-white" />;
                      case 'other':
                        return <MoreHorizontal className="h-4 w-4 sm:h-6 sm:w-6 text-white" />;
                      default:
                        return <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-400"></div>;
                    }
                  };

                  return (
                    <div key={stage} className="flex flex-col items-center flex-1">
                      {/* Stage Circle */}
                      <div className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                        ? 'bg-[#7ede56] shadow-lg shadow-[#7ede56]/50'
                        : isCurrent
                          ? 'bg-[#7ede56] shadow-lg shadow-[#7ede56]/50'
                          : 'bg-gray-200 border-2 border-gray-300'
                        }`}>
                        {isUpcoming ? (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-400"></div>
                        ) : (
                          getStageIcon()
                        )}
                      </div>

                      {/* Stage Label */}
                      <div className="mt-2 sm:mt-3 text-center">
                        <p className={`text-xs sm:text-sm font-semibold ${isCurrent ? 'text-[#7ede56]' : isCompleted ? (darkMode ? 'text-gray-300' : 'text-gray-700') : (darkMode ? 'text-gray-500' : 'text-gray-400')
                          }`}>
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-[#7ede56] font-medium mt-1">Current</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Content */}
      <div className="space-y-6">
        {userType === 'farmer' ? (
          // Specialized Farmer Dashboard Layout
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                  <UserCheck className="h-5 w-5" />
                  Profile Summary
                </CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>Your farming profile and key information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Personal Information</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Name:</strong> {currentData.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Phone:</strong> {'phone' in currentData ? currentData.phone : 'N/A'}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Email:</strong> {'email' in currentData ? currentData.email : 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Farm Details</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Region:</strong> {'region' in currentData ? currentData.region : 'N/A'}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>District:</strong> {'district' in currentData ? currentData.district : 'N/A'}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Farm Type:</strong> {'farmType' in currentData ? currentData.farmType : 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Investment Profile</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Category:</strong> {'investmentCategory' in currentData ? currentData.investmentCategory : 'N/A'}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Farm Size:</strong> {'farmSize' in currentData ? currentData.farmSize : 'N/A'}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>Experience:</strong> {'farmingExperience' in currentData ? currentData.farmingExperience : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getFarmTypeLabel()}</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{'totalCrops' in currentData.stats ? currentData.stats.totalCrops : 0}</p>
                    </div>
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Projects</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{'activeProjects' in currentData.stats ? currentData.stats.activeProjects : 0}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Investor Matches</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{'investorMatches' in currentData.stats ? currentData.stats.investorMatches : 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Earnings</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>GHS {'totalEarnings' in currentData.stats ? currentData.stats.totalEarnings.toLocaleString() : '0'}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Extension Agent Contact */}
              <Card className={`lg:col-span-2 ${darkMode ? 'bg-[#002f37] border-gray-600' : ''}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                    <UserCheck className="h-5 w-5" />
                    Extension Agent
                  </CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-400' : ''}>Your assigned extension officer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {'extensionAgent' in currentData ? (
                      <>
                        <div className="text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                            <UserCheck className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentData.extensionAgent.name}</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentData.extensionAgent.region} Region</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</span>
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>{currentData.extensionAgent.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>{currentData.extensionAgent.email}</span>
                          </div>
                        </div>
                        <Button className="w-full">
                          Contact Agent
                        </Button>
                      </>
                    ) : (
                      <p className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>No extension agent assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investor Matching Status */}
            <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                  <TrendingUp className="h-5 w-5" />
                  Investor Matching Status
                </CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>Your current investor matches and pending opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {'investorMatches' in currentData ? currentData.investorMatches.map((match: any) => (
                    <div key={match.id} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border'} border rounded-lg`}>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{match.investorName}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amount: {match.amount}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Interest: {match.interest}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Date: {match.date}</p>
                      </div>
                      <Badge variant={match.status === 'matched' ? 'default' : 'secondary'}>
                        {match.status}
                      </Badge>
                    </div>
                  )) : (
                    <p className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>No investor matches available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Training & Advisory */}
            <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                  <Calendar className="h-5 w-5" />
                  Training & Advisory
                </CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>Upcoming and completed training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {'trainingSessions' in currentData ? currentData.trainingSessions.map((session: any) => (
                    <div key={session.id} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border'} border rounded-lg`}>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.title}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{session.date} at {session.time}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Type: {session.type}</p>
                      </div>
                      <Badge variant={session.status === 'upcoming' ? 'default' : 'outline'}>
                        {session.status}
                      </Badge>
                    </div>
                  )) : (
                    <p className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>No training sessions available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
              <CardHeader>
                <CardTitle className={darkMode ? 'text-white' : ''}>Recent Activities</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>Your latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.recentActivities.map((activity) => (
                    <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="w-2 h-2 bg-[#7ede56] rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.message}</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>

            {/* Notifications Panel */}
            <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>Important updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {'notifications' in currentData ? currentData.notifications.map((notification: any) => (
                    <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${!notification.read ? (darkMode ? 'bg-blue-900/30 border-l-4 border-blue-400' : 'bg-blue-50 border-l-4 border-blue-400') : (darkMode ? 'bg-gray-900/50' : 'bg-gray-50')}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}></div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</h4>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{notification.message}</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{notification.time}</p>
                      </div>
                    </div>
                  )) : (
                    <p className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>No notifications available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Default Dashboard Layout for other user types
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card className={darkMode ? 'bg-[#002f37] border-gray-600' : ''}>
              <CardHeader>
                <CardTitle className={darkMode ? 'text-white' : ''}>Recent Activities</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : ''}>Your latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.recentActivities.map((activity) => (
                    <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      <div className="w-2 h-2 bg-[#7ede56] rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.message}</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className={`rounded-lg shadow-sm border ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-[#002f37] border-none'}`}>
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-300">Quick access to important tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Button
                    className="h-auto min-h-[5rem] py-3 flex flex-col items-center justify-center gap-2 text-center whitespace-normal bg-[#01424d] !text-white hover:bg-[#02596b]"
                    onClick={() => {
                      if (userType === 'farmer' || userType === 'grower') {
                        navigate(`/dashboard/${userType}/farm-management?create=true`);
                      } else {
                        // Handle other user types as needed
                      }
                    }}
                  >
                    <Plus className="h-5 w-5 shrink-0 !text-white" />
                    <span className="text-[11px] sm:text-sm leading-tight !text-white">
                      {userType === 'farmer' ? `Add ${getFarmTypeLabelSingular()}` : userType === 'investor' ? 'New Investment' : userType === 'agent' ? 'Add Farmer' : 'Create a project for your farm'}
                    </span>
                  </Button>
                  <Button variant="outline" className="h-auto min-h-[5rem] py-3 flex flex-col items-center justify-center gap-2 text-center whitespace-normal bg-[#01424d] !text-white border-[#0f4a53] hover:bg-[#02596b] hover:text-white">
                    <Search className="h-5 w-5 shrink-0 text-white" />
                    <span className="text-[11px] sm:text-sm leading-tight text-white">Find information</span>
                  </Button>
                  <Button variant="outline" className="h-auto min-h-[5rem] py-3 flex flex-col items-center justify-center gap-2 text-center whitespace-normal bg-[#01424d] !text-white border-[#0f4a53] hover:bg-[#02596b] hover:text-white">
                    <Filter className="h-5 w-5 shrink-0 text-white" />
                    <span className="text-[11px] sm:text-sm leading-tight text-white">Sort items</span>
                  </Button>
                  <Button variant="outline" className="h-auto min-h-[5rem] py-3 flex flex-col items-center justify-center gap-2 text-center whitespace-normal bg-[#01424d] !text-white border-[#0f4a53] hover:bg-[#02596b] hover:text-white">
                    <BarChart3 className="h-5 w-5 shrink-0 text-white" />
                    <span className="text-[11px] sm:text-sm leading-tight text-white">View reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Welcome Modal - Shows on first login */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Leaf className="h-6 w-6 text-[#7ede56]" />
              Welcome to Your Dashboard!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-4">
              {getFarmTypeUpdateMessage()}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-[#7ede56] bg-opacity-10 border border-[#7ede56] border-opacity-20 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> Keep your farm information updated regularly to get the most accurate insights and recommendations from AgriLync.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowWelcomeModal(false)}
              className="bg-[#002f37] hover:bg-[#001a1f] text-white"
            >
              Got it!
            </Button>
            <Button
              onClick={() => {
                setShowWelcomeModal(false);
                navigate(`/dashboard/${userType}/settings`);
              }}
              variant="outline"
              className="border-[#7ede56] text-[#7ede56] hover:bg-[#7ede56] hover:text-white"
            >
              Update Profile Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weather Modal - Detailed Weather Information */}
      {(userType === 'farmer' || userType === 'grower') && 'weather' in currentData && currentData.weather && (
        <Dialog open={showWeatherModal} onOpenChange={setShowWeatherModal}>
          <DialogContent className={`max-w-6xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#002f37] border-gray-600' : 'bg-white border-gray-200'}`}>
            <DialogHeader className="pb-4">
              <DialogTitle className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentData.weather.location}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detailed weather information for {currentData.weather.location}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Current Weather Section */}
              <div className={`relative rounded-lg p-6 overflow-hidden ${darkMode ? 'bg-gradient-to-br from-[#002f37] to-[#0a1a1f] border border-[#7ede56]/20' : 'bg-gradient-to-br from-[#002f37] to-[#0a1a1f] border border-[#7ede56]/20'}`}>
                <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
                  <div className="absolute top-1 left-1 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] rotate-12" /></div>
                  <div className="absolute top-1 right-1 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] -rotate-12" /></div>
                  <div className="absolute bottom-1 left-1 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] rotate-90" /></div>
                  <div className="absolute bottom-1 right-1 w-5 h-5"><Leaf className="w-full h-full text-[#f4ffee] -rotate-90" /></div>
                </div>

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-white">
                      {currentData.weather.location.split(',')[0]}
                    </h2>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>
                      Chance of rain: {currentData.weather.chanceOfRain || 0}%
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-7xl font-bold text-white">
                        {currentData.weather.temperature}°
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {currentData.weather.condition.toLowerCase().includes('rain') ? (
                      <CloudRain className="h-32 w-32 text-white" />
                    ) : currentData.weather.condition.toLowerCase().includes('cloud') ? (
                      <Cloud className="h-32 w-32 text-white" />
                    ) : (
                      <Sun className="h-32 w-32 text-yellow-300" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Today's Forecast */}
                  {currentData.weather.hourlyForecast && currentData.weather.hourlyForecast.length > 0 && (
                    <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#002f37] border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        TODAY'S FORECAST
                      </h3>
                      <div className="grid grid-cols-6 gap-4">
                        {currentData.weather.hourlyForecast.map((hour, index) => (
                          <div key={index} className="flex flex-col items-center gap-2">
                            <p className="text-xs font-medium text-gray-500">
                              {hour.time}
                            </p>
                            <div className="my-2">
                              {hour.icon === 'rain' ? <CloudRain className="h-6 w-6 text-[#7ede56]" /> : hour.icon === 'cloud' ? <Cloud className="h-6 w-6 text-gray-400" /> : <Sun className="h-6 w-6 text-yellow-400" />}
                            </div>
                            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {hour.temperature}°
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Air Conditions */}
                  <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#0a0f14] border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      AIR CONDITIONS
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-6 w-6 text-[#7ede56]" />
                        <div>
                          <p className="text-xs text-gray-500">Real Feel</p>
                          <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentData.weather.feelsLike}°</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Droplets className="h-6 w-6 text-[#7ede56]" />
                        <div>
                          <p className="text-xs text-gray-500">Chance of rain</p>
                          <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentData.weather.chanceOfRain || 0}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7-Day Forecast */}
                <div className={`rounded-lg p-6 ${darkMode ? 'bg-[#0a0f14] border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>7-DAY FORECAST</h3>
                  <div className="space-y-3">
                    {currentData.weather.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                        <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{day.day}</span>
                        <div className="flex items-center gap-2">
                          {day.icon === 'rain' ? <CloudRain className="h-5 w-5 text-[#7ede56]" /> : day.icon === 'cloud' ? <Cloud className="h-5 w-5 text-gray-400" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                          <span className="text-sm font-semibold text-[#7ede56]">{day.high}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;