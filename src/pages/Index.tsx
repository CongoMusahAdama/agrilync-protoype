import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, MapPin, Calendar, Shield, Award, Play, MessageCircle, X, ArrowUp, Quote, ArrowRight, Bot } from 'lucide-react';
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


  const [activeStory, setActiveStory] = useState(0);
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



  // Auto-play for Success Stories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
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

                <a href="https://www.youtube.com/watch?v=-gOZgTW00GY" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
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
                <div className="max-w-xl hidden md:block">
                  <h3 className="font-sora font-bold text-[#002f37] text-lg md:text-xl leading-snug group-hover:underline decoration-[#002f37]/30 underline-offset-4 transition-all">
                    Distributing trust first, value second, and technology last. <span className="inline-block bg-[#002f37] text-white text-sm px-3 py-1 rounded-full ml-2 align-middle no-underline">Be Part</span>
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
                  We are Agrilync, revolutionizing African agriculture through AI and digital technologies. Our platform connects farmers with investors, markets, and intelligent farming solutions. <span className="font-bold text-[#002f37]">We distribute trust first, value second, and technology last.</span>
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
                  Farmers are not crying without reason. They need timely access to the right information to boost productivity, ready markets immediately after harvest to reduce post-harvest losses, and most importantly, flexible financing and investor partnerships to scale and improve yield.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need to Succeed Section - Updated with staggered animations */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={succeedHeadingRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (succeedHeadingVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: '#002f37' }}>
              Everything You Need to Succeed
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
              From AI-powered consultation to investment opportunities, we provide comprehensive tools for modern farming.
            </p>
          </div>

          {/* Feature 1 - AI Consultation with scroll-triggered slide-in */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-10 sm:mb-16 md:mb-20">
            <div className="order-2 lg:order-1 animate-fade-in-right delay-400 mt-6 sm:mt-0 lg:col-start-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-purple-600">01</span>
                <Leaf className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 cursor-pointer hover:text-purple-600 transition-colors animate-fade-in transition-all duration-700 ease-in-out" style={{ color: '#002f37' }}
                onClick={() => handleFeatureClick('/who-we-are')}>
                AI-Powered Crop Consultation
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Get instant, personalized advice for your crops. Upload photos of plant diseases,
                pests, or growth issues and receive expert recommendations powered by advanced AI technology.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>• Instant disease identification</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>• Personalized treatment recommendations</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>• Connect with human experts</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>• Track crop health over time</li>
              </ul>
              <Button
                onClick={() => handleFeatureClick('/who-we-are')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Learn More
              </Button>
            </div>
            <div ref={feature1Ref} className={(feature1Visible ? "animate-slide-in-left" : "opacity-0") + " order-1 lg:order-2 lg:col-start-2"}>
              <img
                src="/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png"
                alt="AI Consultation"
                className="shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300 rounded-2xl"
                onClick={() => handleFeatureClick('/who-we-are')}
              />
            </div>
          </div>

          {/* Feature 2 - Weather with scroll-triggered slide-in */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-10 sm:mb-16 md:mb-20">
            <div ref={feature2Ref} className={(feature2Visible ? "animate-slide-in-left" : "opacity-0") + " order-1 lg:order-1 lg:col-start-1"}>
              <img
                src="/lovable-uploads/3e19a1d1-e890-436d-ba69-4227c2a1c8b1.png"
                alt="Weather Forecast"
                className="shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300 rounded-2xl"
                onClick={() => handleFeatureClick('/who-we-are')}
              />
            </div>
            <div className="order-2 lg:order-2 animate-fade-in-left delay-600 lg:col-start-2 mt-6 sm:mt-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-purple-600">02</span>
                <MapPin className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 cursor-pointer hover:text-purple-600 transition-colors animate-fade-in transition-all duration-700 ease-in-out" style={{ color: '#002f37' }}
                onClick={() => handleFeatureClick('/who-we-are')}>
                Hyperlocal Weather Insights
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Access precise, farm-specific weather forecasts and receive intelligent
                recommendations for planting, irrigation, and harvesting based on local conditions.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>• 7-day hyperlocal forecasts</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>• SMS weather alerts</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>• Farming calendar notifications</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>• AI-driven recommendations</li>
              </ul>
              <Button
                onClick={() => handleFeatureClick('/who-we-are')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Feature 3 - FarmPartner with scroll-triggered slide-in */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in-right delay-800 mt-6 sm:mt-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-purple-600">03</span>
                <TrendingUp className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 cursor-pointer hover:text-purple-600 transition-colors animate-fade-in transition-all duration-700 ease-in-out" style={{ color: '#002f37' }}
                onClick={() => handleFeatureClick('/who-we-are')}>
                FarmPartner Investment Initiative
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Connect verified farmers with impact investors through our transparent
                partnership platform. Choose from flexible partnership models that work for you.
              </p>

              {/* Partnership Models */}
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                  <span className="font-semibold text-gray-800">• Profit Sharing</span> — Share profits after harvest with your investor partner
                </li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                  <span className="font-semibold text-gray-800">• Buy-back Agreement</span> — Investor purchases your produce at agreed prices
                </li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                  <span className="font-semibold text-gray-800">• Input Financing</span> — Receive loans for seeds, fertilizers, and equipment
                </li>
              </ul>

              <Button
                onClick={() => handleFeatureClick('/who-we-are')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Learn More
              </Button>
            </div>
            <div ref={feature3Ref} className={(feature3Visible ? "animate-slide-in-left delay-800" : "opacity-0") + " order-1 lg:order-2 lg:col-start-2"}>
              <img
                src="/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png"
                alt="FarmPartner Investment"
                className="shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300 rounded-2xl"
                onClick={() => handleFeatureClick('/who-we-are')}
              />
            </div>
          </div>
        </div>
      </section>

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
      <section className="py-4 sm:py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={successStoriesRef} className={"text-xl sm:text-2xl font-bold mb-2 transition-all duration-700 ease-in-out " + (successStoriesVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: '#002f37' }}>
              Success Stories
            </h2>
            <div className="w-16 h-1 bg-[#7ede56] mb-3 mx-auto rounded-full"></div>
            <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Hear from the farmers and investors transforming agriculture with AgriLync.
            </p>
          </div>


          {/* Carousel Implementation */}
          <div className="relative py-12 px-4 max-w-5xl mx-auto">
            {/* Story Content */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-0 relative">

              {/* Profile Side (Left) */}
              <div className="z-20 flex flex-col items-center">
                <div className="w-48 h-56 sm:w-56 sm:h-64 rounded-xl overflow-hidden border-4 border-[#7ede56] shadow-xl relative bg-white">
                  <img
                    src={[
                      "/lovable-uploads/success_story_1.jpg",
                      "/lovable-uploads/success_story_2.jpg",
                      "/lovable-uploads/success_story_3.jpg"
                    ][activeStory] || "/lovable-uploads/hero2.jpg"} // Fallback
                    alt="Success Story Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback logic if needed, e.g. show initials
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${["Gabienu Emmanuel", "Sarah Mensah", "John Baah"][activeStory]}&background=random`
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-xl text-[#002f37]">
                    {["Gabienu Emmanuel", "Sarah Mensah", "John Baah"][activeStory]}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <div className="bg-red-500 rounded-full p-0.5">
                      <div className="text-[10px] font-bold text-white px-1">GH</div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {["Vegetable Farmer", "Agri-Investor", "Maize Farmer"][activeStory]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector Lines (SVG) - Visible on MD+ */}
              <div className="hidden md:block w-32 h-64 -mx-4 z-10 relative">
                <svg className="w-full h-full" viewBox="0 0 100 200" preserveAspectRatio="none">
                  {/* Top line to card top */}
                  <path d="M 0 40 C 50 40, 50 20, 100 20" fill="none" stroke="#7ede56" strokeWidth="2" />
                  <circle cx="0" cy="40" r="4" fill="#002f37" stroke="#7ede56" strokeWidth="2" />

                  {/* Bottom line to card bottom */}
                  <path d="M 0 180 C 50 180, 50 180, 100 180" fill="none" stroke="#7ede56" strokeWidth="2" />
                  <circle cx="0" cy="180" r="4" fill="#002f37" stroke="#7ede56" strokeWidth="2" />
                </svg>
              </div>

              {/* Feedback Card (Right) */}
              <div className="relative mt-8 md:mt-0 z-20 flex-1 max-w-xl">
                {/* Connector nub for card (Left side of card) - Desktop only */}
                <div className="hidden md:block absolute -left-1 top-5 bottom-0 w-4 bg-[#7ede56] rounded-l-lg"></div>

                <div className="bg-[#002f37] rounded-3xl p-2 shadow-2xl relative transform transition-all duration-500">
                  <div className="border border-dashed border-[#7ede56]/30 rounded-2xl p-6 sm:p-10 min-h-[300px] flex flex-col justify-center relative">
                    {/* Quote Icon Background */}
                    <Quote className="absolute top-6 right-8 w-16 h-16 text-[#7ede56]/5" />

                    <div className="mb-6">
                      <h4 className="text-[#7ede56] text-sm font-bold tracking-widest uppercase mb-1">SUCCESS STORY</h4>
                      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">CLIENT'S<br />FEEDBACK</h2>
                      <div className="h-1 w-24 bg-white rounded-full"></div>
                    </div>

                    <p className="text-gray-200 text-lg leading-relaxed mb-6">
                      "{[
                        "Finding investors for my vegetable farm was always a struggle until I joined AgriLync. Within weeks, I secured funding to expand my operations.",
                        "The transparency AgriLync offers is unmatched. I can track my investments in real-time and see the actual impact on the farms.",
                        "The AI crop consultation saved my maize harvest from a pest outbreak. The advice was timely, accurate, and easy to follow."
                      ][activeStory]}"
                    </p>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Award key={star} className="w-6 h-6 text-[#7ede56] fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-12">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveStory(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeStory === index ? 'bg-[#7ede56] w-8' : 'bg-gray-300 hover:bg-[#7ede56]/50'
                    }`}
                  aria-label={`View success story ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
