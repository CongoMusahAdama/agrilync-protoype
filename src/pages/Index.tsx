import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, MapPin, Calendar, Shield, Award, Play, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const heroImages = [
  '/lovable-uploads/image.png',
];

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [splashTimeout, setSplashTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Only show splash on mobile devices and only on first visit
    const hasSeenSplash = window.sessionStorage.getItem('agrilync_splash_seen');
    if (window.innerWidth <= 640 && !hasSeenSplash) {
      setShowSplash(true);
      const timeout = setTimeout(() => {
        setShowSplash(false);
        window.sessionStorage.setItem('agrilync_splash_seen', 'true');
      }, 2000);
      setSplashTimeout(timeout);
      // Failsafe: hide splash after 3s no matter what
      const failsafe = setTimeout(() => setShowSplash(false), 3000);
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
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999] sm:hidden" style={{ background: '#7ede56' }}>
        <img
          src="/lovable-uploads/logo.png"
          alt="Logo"
          className="w-24 h-24 animate-spin-slower"
          style={{ animation: 'spin 2s linear' }}
        />
        <div className="mt-4 text-center text-base font-semibold text-[#002f37] drop-shadow-sm tracking-wide">
          Join the AgriLync movement
        </div>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slower { animation: spin 2s linear; }
        `}</style>
      </div>
    );
  }

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Single Image */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-0 m-0">
        {/* Single Hero Image */}
        <img
          src="/lovable-uploads/image.png"
          alt="Hero background"
          className="w-full h-full object-cover absolute inset-0 z-0"
          loading="eager"
          fetchPriority="high"
        />
        {/* Overlay for darkening */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* Navbar overlayed above image */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <Navbar variant="transparent" />
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-12 sm:mt-20">
          <div className="animate-fade-in-up w-full">
            <h1 ref={heroHeadingRef} className={"text-xl sm:text-2xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-2xl transition-all duration-700 ease-in-out leading-tight " + (heroHeadingVisible ? " animate-fade-in-up" : " opacity-0") }>
              Transforming African Agriculture Through <span className="font-extrabold animate-purple-glow typewriter align-middle" style={{ color: '#921573', display: 'inline-block', maxWidth: '100%', verticalAlign: 'middle' }}>
                AI and Easy Access To Finace
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in delay-1000 w-full">
              <a 
                href="https://agrilync.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto max-w-xs"
              >
                <Button className="w-full sm:w-auto max-w-xs bg-white/100 border-2 border-[#002f37] text-[#002f37] hover:bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Join the Waitlist
                </Button>
              </a>
              <a
                href="https://www.youtube.com/watch?v=-gOZgTW00GY"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto max-w-xs"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto max-w-xs bg-white/20 border-white text-white hover:bg-white hover:text-gray-900 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-full shadow-xl backdrop-blur-sm"
                >
                  Watch Demo Video
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-2 sm:gap-4">
            {/* Title - very close to content */}
            <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
              <h2 ref={whoWeAreRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 text-left transition-all duration-700 ease-in-out " + (whoWeAreVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: '#002f37' }}>
                Who We Are
              </h2>
              <div className="w-16 h-0.5 bg-purple-600 mb-1 sm:mb-2"></div>
            </div>
            {/* Content - very close to title */}
            <div className="animate-fade-in-left transition-all duration-700 ease-in-out flex-1">
              <div className="max-w-4xl">
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                  We are Agrilync. We're focused on revolutionizing agriculture in Africa through AI and digital technologies. Our AI-powered platform connects key actors along the value chain with various stakeholders, providing access to financing, market opportunities, and farming intelligence.
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                  Agrilync empowers farmers with tools for sustainable growth, higher yields, and improved market access.
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
            <h2 ref={succeedHeadingRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (succeedHeadingVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: '#002f37' }}>
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
                  onClick={() => handleFeatureClick('/about')}>
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
                onClick={() => handleFeatureClick('/about')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Learn More
              </Button>
            </div>
            <div ref={feature1Ref} className={(feature1Visible ? "animate-slide-in-left" : "opacity-0") + " order-1 lg:order-2 lg:col-start-2"}>
              <img 
                src="/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png"
                alt="AI Consultation"
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick('/about')}
              />
            </div>
          </div>

          {/* Feature 2 - Weather with scroll-triggered slide-in */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-10 sm:mb-16 md:mb-20">
            <div ref={feature2Ref} className={(feature2Visible ? "animate-slide-in-left" : "opacity-0") + " order-1 lg:order-1 lg:col-start-1"}>
              <img 
                src="/lovable-uploads/3e19a1d1-e890-436d-ba69-4227c2a1c8b1.png"
                alt="Weather Forecast"
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick('/about')}
              />
            </div>
            <div className="order-2 lg:order-2 animate-fade-in-left delay-600 lg:col-start-2 mt-6 sm:mt-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-purple-600">02</span>
                <MapPin className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 cursor-pointer hover:text-purple-600 transition-colors animate-fade-in transition-all duration-700 ease-in-out" style={{ color: '#002f37' }}
                  onClick={() => handleFeatureClick('/about')}>
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
                onClick={() => handleFeatureClick('/about')}
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
                  onClick={() => handleFeatureClick('/about')}>
                FarmPartner Investment Initiative
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Connect verified farmers with impact investors through our transparent 
                partnership platform. Secure funding, share profits, and build sustainable agricultural communities.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>• Verified farmer profiles</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>• Transparent profit sharing</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>• Extension agent monitoring</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>• Impact tracking dashboard</li>
              </ul>
              <Button 
                onClick={() => handleFeatureClick('/about')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Learn More
              </Button>
            </div>
            <div ref={feature3Ref} className={(feature3Visible ? "animate-slide-in-left delay-800" : "opacity-0") + " order-1 lg:order-2 lg:col-start-2"}>
              <img 
                src="/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png"
                alt="FarmPartner Investment"
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick('/about')}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
