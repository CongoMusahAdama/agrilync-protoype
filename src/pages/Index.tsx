import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, MapPin, Calendar, Shield, Award, Play, MessageCircle, X, ArrowUp, Quote, ArrowRight, Bot, ChevronDown, ChevronUp, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const Index = () => {
  const navigate = useNavigate();



  // Scroll-triggered animation hooks (must be at the top level)
  const [feature1Ref, feature1Visible] = useScrollReveal();
  const [feature2Ref, feature2Visible] = useScrollReveal();
  const [feature3Ref, feature3Visible] = useScrollReveal();
  // Headings
  const [heroHeadingRef, heroHeadingVisible] = useScrollReveal();
  const [succeedHeadingRef, succeedHeadingVisible] = useScrollReveal();
  const [whoWeAreRef, whoWeAreVisible] = useScrollReveal();
  const [farmersCryingRef, farmersCryingVisible] = useScrollReveal();
  const [successStoriesRef, successStoriesVisible] = useScrollReveal();
  const [faqRef, faqVisible] = useScrollReveal();
  // Services ref will be handled manually

  const [showServices, setShowServices] = useState(false);



  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does AgriLync ensure the safety of my investment?",
      answer: "We employ a rigorous vetting process for all farmers and implement strict monitoring protocols. Additionally, we work with insurance partners to provide coverage for crops against unforeseen weather events and pests."
    },
    {
      question: "How accurate is the AI crop consultation?",
      answer: "Our AI model is trained on a vast database of plant pathology and continuously updated by agricultural experts. It currently boasts a 95% accuracy rate in early disease detection, though we always recommend verifying with our human experts for critical issues."
    },
    {
      question: "Can I choose which specific farm to invest in?",
      answer: "Yes! Our platform provides detailed profiles for each farm, including their crop history, risk assessment, and projected yield. You can browse and select the partnerships that align with your financial goals and values."
    },
    {
      question: "Is AgriLync available to small-scale farmers?",
      answer: "Absolutely. Our core mission is to empower smallholder farmers. The platform is designed to be accessible even on basic smartphones, and we have local agents to assist farmers with limited digital literacy."
    },
    {
      question: "What is the minimum amount required to start investing?",
      answer: "We believe in democratizing agricultural investment. You can start supporting a farm with as little as GHS 500. We offer various tiers to suit different investment capacities."
    },
    {
      question: "Do you support livestock farming as well?",
      answer: "Yes! We support livestock sectors including poultry and small ruminants. Our health monitoring protocols are adapted to ensure animal welfare and secure returns for investors."
    }
  ];
  const [showSplash, setShowSplash] = useState(false);
  const [splashTimeout, setSplashTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [isScrolledPastHero, setIsScrolledPastHero] = useState(() => typeof window !== 'undefined' ? window.scrollY > 50 : false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      // Hero height is roughly 90vh
      const heroHeight = window.innerHeight * 0.9;
      // Change navbar style earlier than full hero height for better UX
      setIsScrolledPastHero(window.scrollY > 50);
    };

    // Initial check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);





  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Show splash on every mobile/tablet page load
    if (window.innerWidth <= 1024) {
      setShowSplash(true);
      const timeout = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      setSplashTimeout(timeout);

      const failsafe = setTimeout(() => setShowSplash(false), 3500);
      return () => {
        clearTimeout(timeout);
        clearTimeout(failsafe);
      };
    } else {
      setShowSplash(false);
    }
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999]" style={{ background: '#7ede56' }}>
        <img
          src="/lovable-uploads/logo.png"
          alt="Logo"
          className="w-24 h-24 animate-spin-slow"
        />
        <div className="mt-4 text-center text-base font-semibold text-[#002f37] drop-shadow-sm tracking-wide">
          Join the AgriLync movement
        </div>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin 3s linear infinite; }
        `}</style>
      </div>
    );
  }

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  const toggleServices = () => {
    setShowServices(!showServices);
    // Optional: scroll slightly if opening
    if (!showServices) {
      setTimeout(() => {
        const element = document.getElementById('core-services');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <Navbar />



      {/* HERO SECTION - Hubtel Style (Responsive) */}
      <section className="relative min-h-[85vh] bg-gradient-to-br from-gray-50 via-white to-green-50/30 overflow-hidden">
        <style>{`
          @keyframes slideInRight {
            from { 
              transform: translateX(100px); 
              opacity: 0; 
            }
            to { 
              transform: translateX(0); 
              opacity: 1; 
            }
          }
          @keyframes slideInLeft {
            from { 
              transform: translateX(-50px); 
              opacity: 0; 
            }
            to { 
              transform: translateX(0); 
              opacity: 1; 
            }
          }
          .animate-slide-right {
            animation: slideInRight 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .animate-slide-left {
            opacity: 0;
            animation: slideInLeft 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            animation-delay: 0.5s;
          }
        `}</style>

        {/* Main Hero Container with Full Background */}
        <div className="relative w-full h-screen md:h-[85vh] bg-[url('/lovable-uploads/countryside-workers-together-field.jpg')] bg-cover bg-[25%_top] md:bg-[center_35%] bg-no-repeat flex items-end mb-0 transition-all duration-500">
          {/* Dark Overlay for text readability - Bottom heavy for content at the bottom */}
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-black/30 md:bg-gradient-to-r md:from-black/60 md:to-transparent"></div>

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 pb-16 md:pb-20">
            <div className="max-w-4xl">

              {/* Pill Tag */}
              <div className="hidden md:inline-block px-4 py-1.5 mb-6 border border-[#7ede56]/50 rounded-full bg-[#7ede56]/10 backdrop-blur-sm">
                <span className="text-[#7ede56] font-sora font-medium text-sm tracking-wide uppercase">
                  Revolutionizing Agriculture with AI
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-sora animate-slide-left">
                Unlocking Difficult Access to <span className="text-[#FFD700]">Farm Investment and Timely Information Through AI</span>
              </h1>

              {/* Subheadline */}
              <p className="hidden md:block text-sm md:text-xl text-gray-200 mb-8 md:mb-10 leading-relaxed max-w-2xl font-sora font-light">
                We connect smallholder farmers with AI-driven insights and smart investor matching to revolutionize the agricultural value chain.
              </p>

              {/* CTA Buttons */}
              {/* CTA Buttons - Side by Side on Mobile */}
              <div className="flex flex-row gap-3 md:gap-5">
                <a href="https://agrilync.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                  <Button className="w-full sm:w-auto bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] px-4 py-3 md:px-8 md:py-7 text-sm md:text-lg font-bold rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                    Join Waitlist
                  </Button>
                </a>

                <a href="https://youtube.com/shorts/HxPYnwCG6QE?feature=share" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white hover:text-[#002f37] bg-white/5 backdrop-blur-sm px-4 py-3 md:px-8 md:py-7 text-sm md:text-lg font-bold rounded-full transition-all duration-300">
                    Watch Demo
                  </Button>
                </a>
              </div>

              {/* Responsive Sub-headline for Mobile */}
              <div className="mt-8 md:hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-green-300 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-[#7ede56] border-2 border-white"></div>
                  </div>
                  <p className="text-white text-xs font-medium">Join 200+ lync growers & investors</p>
                </div>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-[#7ede56] text-[#002f37] font-bold rounded-full py-4 px-8"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Yellow Info Strip */}
        <div className="w-full bg-[#FFD700] py-4 md:py-6 relative z-20 overflow-hidden">
          {/* Background Pattern for Strip */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#002f37_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

              {/* Feature 1: Distributing Trust... (Spanning 2 cols) */}
              <div className="md:col-span-2 flex items-center gap-6 group cursor-pointer">
                <div className="flex -space-x-4 flex-shrink-0">
                  {/* Using local success story images for local farmers look */}
                  <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] bg-white flex items-center justify-center overflow-hidden shadow-md">
                    <img src="/lovable-uploads/success_story_1.jpg" alt="Local Farmer" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] bg-white flex items-center justify-center overflow-hidden shadow-md">
                    <img src="/lovable-uploads/success_story_2.jpg" alt="Local Farmer" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] bg-white flex items-center justify-center overflow-hidden shadow-md">
                    <img src="/lovable-uploads/success_story_3.jpg" alt="Local Farmer" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] bg-[#002f37] flex items-center justify-center text-white text-sm font-bold shadow-md">
                    200+
                  </div>
                </div>
                <div className="max-w-xl">
                  <h3 className="font-sora font-bold text-[#002f37] text-lg md:text-xl leading-snug group-hover:underline decoration-[#002f37]/30 underline-offset-4 transition-all">
                    <span className="md:hidden">Community Trust</span>
                    <span className="hidden md:inline">Distributing trust first, value second, and technology last.</span>
                    <span className="inline-block bg-[#002f37] text-white text-sm px-3 py-1 rounded-full ml-2 align-middle no-underline">Be Part</span>
                  </h3>
                </div>
              </div>

              {/* Feature 3: Arrow Only (Col 3) */}
              <div className="flex items-center gap-4 justify-start md:justify-end group cursor-pointer pl-8">
                {/* Arrow pointing down like reference */}
                <div className="hidden md:block animate-bounce text-[#002f37]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v13M5 12l7 7 7-7" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#7ede56]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Who We Are Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Left Column - Title */}
            <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-2 h-2" style={{ backgroundColor: '#002f37' }}></div>
                <span className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider ml-3">WHO WE ARE</span>
              </div>
              <h2 ref={whoWeAreRef} className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 transition-all duration-700 ease-in-out " + (whoWeAreVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: '#002f37' }}>
                Who We Are
              </h2>
            </div>

            {/* Right Column - Content */}
            <div className="animate-fade-in-left transition-all duration-700 ease-in-out">
              <div className="max-w-4xl">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We are Agrilync, revolutionizing African agriculture through AI and digital technologies. Our platform connects farmers with investors and intelligent farming solutions. <span className="font-bold text-[#002f37]">We distribute trust first, value second, and technology last.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Farmers Are Crying Section */}
      <section className="py-10 sm:py-16 md:py-20" style={{ backgroundColor: '#002f37' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Left Column - Title */}
            <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-2 h-2" style={{ backgroundColor: '#7ede56' }}></div>
                <span className="text-gray-300 text-xs sm:text-sm uppercase tracking-wider ml-3">THE CHALLENGE</span>
              </div>
              <h2 ref={farmersCryingRef} className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 transition-all duration-700 ease-in-out " + (farmersCryingVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: 'white' }}>
                The Challenge
              </h2>
            </div>

            {/* Right Column - Content */}
            <div className="animate-fade-in-left transition-all duration-700 ease-in-out">
              <div className="max-w-4xl">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  Farmers are not crying without reason. They need timely access to the right information to boost productivity, and most importantly, flexible financing and investor partnerships to scale and improve yield.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need to Succeed Section - Inspiration Redesign */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left Column: Heading, Text, Button */}
            <div className="flex flex-col justify-center animate-fade-in-right transition-all duration-700 ease-in-out">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-[#002f37] font-sora leading-tight">
                  Everything You Need to <span className="text-[#7ede56]">Succeed & Grow.</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
                  From AI-powered consultation to investment opportunities, we provide comprehensive tools for modern farming.
                  We connect verified farmers with impact investors to revolutionize the agricultural ecosystem.
                </p>

                <Button
                  onClick={toggleServices}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#002f37] rounded-full px-8 py-6 text-lg font-bold shadow-lg transition-transform hover:-translate-y-1"
                >
                  Explore Services
                  <div className="ml-3 bg-[#002f37] rounded-full p-1">
                    <ArrowRight className="w-4 h-4 text-[#FFD700]" />
                  </div>
                </Button>
              </div>
            </div>

            {/* Right Column: Large Image */}
            <div className="animate-fade-in-left transition-all duration-700 ease-in-out delay-200">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img
                  src="/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png"
                  alt="AI-Powered Crop Consultation"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <p className="text-white font-bold text-xl font-sora">Empowering 50+ Communities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section - Initially Hidden, toggled by Explore Services button */}
      {/* Core Services Section - Redesigned to Match Reference */}
      {showServices && (
        <section id="core-services" className="py-20 bg-white animate-fade-in-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-24">

              {/* Service 1: AI Consultancy */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-purple-600 font-sora">01</span>
                    <Leaf className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#002f37] mb-6 font-sora">
                    AI-Powered Crop Consultation
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Get instant, personalized advice for your crops. Upload photos of plant diseases, pests, or growth issues and receive expert recommendations powered by advanced AI technology.
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      "Instant disease identification",
                      "Personalized treatment recommendations",
                      "Connect with human experts",
                      "Track crop health over time"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleFeatureClick('/who-we-are')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-base font-bold rounded-lg shadow-md transition-transform hover:-translate-y-1"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="order-1 lg:order-2">
                  <img
                    src="/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png"
                    alt="AI Consultation"
                    className="rounded-[2rem] shadow-2xl w-full object-cover h-[400px] sm:h-[500px]"
                  />
                </div>
              </div>

              {/* Service 2: Smart Weather */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-1">
                  <img
                    src="/lovable-uploads/3e19a1d1-e890-436d-ba69-4227c2a1c8b1.png"
                    alt="Smart Weather"
                    className="rounded-[2rem] shadow-2xl w-full object-cover h-[400px] sm:h-[500px]"
                  />
                </div>
                <div className="order-2">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-purple-600 font-sora">02</span>
                    <MapPin className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#002f37] mb-6 font-sora">
                    Hyperlocal Weather Insights
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Access precise, farm-specific weather forecasts and receive intelligent recommendations for planting, irrigation, and harvesting based on local conditions.
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      "7-day hyperlocal forecasts",
                      "SMS weather alerts",
                      "Farming calendar notifications",
                      "AI-driven recommendations"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleFeatureClick('/who-we-are')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-base font-bold rounded-lg shadow-md transition-transform hover:-translate-y-1"
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Service 3: FarmPartner Wallet */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-purple-600 font-sora">03</span>
                    <TrendingUp className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#002f37] mb-6 font-sora">
                    FarmPartner Investment Initiative
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    Connect verified farmers with impact investors through our transparent partnership platform. Choose from flexible partnership models that work for you.
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      "Profit Sharing Models",
                      "Buy-back Agreements",
                      "Input Financing Options",
                      "Transparent Tracking"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleFeatureClick('/who-we-are')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-base font-bold rounded-lg shadow-md transition-transform hover:-translate-y-1"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="order-1 lg:order-2">
                  <img
                    src="/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png"
                    alt="FarmPartner"
                    className="rounded-[2rem] shadow-2xl w-full object-cover h-[400px] sm:h-[500px]"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Scroll to Top Button - Mobile Optimized */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-white p-4 rounded-full shadow-2xl hover:shadow-[#7ede56]/50 transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}

      {/* Success Stories Section */}
      <section className="py-10 sm:py-16" style={{ backgroundColor: '#002f37' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={successStoriesRef} className={"text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-700 ease-in-out " + (successStoriesVisible ? " animate-fade-in-up" : " opacity-0")}>
              Success Stories
            </h2>
            <div className="w-64 h-[1px] bg-white mb-6 mx-auto opacity-70"></div>
            <p className="text-white text-lg font-medium max-w-2xl mx-auto">
              What Our Clients Say About Us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                name: "Gabienu Emmanuel",
                role: "Vegetable Farmer",
                location: "Ashanti Region, Ejura",
                image: "/lovable-uploads/success_story_1.jpg",
                feedback: "Finding investors for my vegetable farm was always a struggle until I joined AgriLync. Within weeks, I secured funding to expand my operations."
              },
              {
                name: "Sarah Mensah",
                role: "Agri-Investor",
                location: "Greater Accra, East Legon",
                image: "/lovable-uploads/success_story_2.jpg",
                feedback: "The transparency AgriLync offers is unmatched. I can track my investments in real-time and see the actual impact on the farms."
              },
              {
                name: "John Baah",
                role: "Maize Farmer",
                location: "Brong Ahafo, Techiman",
                image: "/lovable-uploads/success_story_3.jpg",
                feedback: "The AI crop consultation saved my maize harvest from a pest outbreak. The advice was timely, accurate, and easy to follow."
              }
            ].map((story, index) => (
              <div
                key={index}
                className={"bg-white rounded-sm p-8 sm:p-10 shadow-lg flex flex-col h-full transform transition-all duration-500 hover:-translate-y-1 " + (successStoriesVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-20")}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="mb-8 flex-grow">
                  <p className="text-gray-800 text-base leading-relaxed font-manrope">
                    {story.feedback}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${story.name}&background=random`
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-gray-900 text-base">{story.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{story.role}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{story.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* FAQ Section */}
      <section className="py-10 sm:py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={faqRef} className={"text-xl sm:text-2xl md:text-3xl font-bold mb-3 transition-all duration-700 ease-in-out " + (faqVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: '#002f37' }}>
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1 bg-[#7ede56] mb-4 mx-auto rounded-full"></div>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">
              Everything you need to know about investing and growing with AgriLync.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={"bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 ease-in-out " + (faqVisible ? " opacity-100 translate-y-0" : " opacity-0 translate-y-10")}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left flex items-start justify-between gap-3 focus:outline-none group hover:bg-gray-50 transition-colors"
                  aria-expanded={openFaqIndex === index}
                >
                  <span className={`font-sora text-sm sm:text-base font-medium transition-colors leading-snug ${openFaqIndex === index ? 'text-[#7ede56]' : 'text-[#002f37] group-hover:text-[#002f37]/80'}`}>
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#7ede56] flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 mt-0.5" />
                  )}
                </button>
                <div
                  className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-32 opacity-100 pb-5' : 'max-h-0 opacity-0'
                    }`}
                >
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="border-2 border-[#002f37] text-[#002f37] hover:bg-[#002f37] hover:text-white bg-transparent rounded-full px-6 py-2 text-sm font-bold transition-all"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
