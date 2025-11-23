import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, MapPin, Calendar, Shield, Award, Play, MessageCircle, X, ArrowUp } from 'lucide-react';
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
  const [farmersCryingRef, farmersCryingVisible] = useScrollReveal();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [splashTimeout, setSplashTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6 seconds per slide
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
      {/* Navbar */}
      <Navbar variant="light" />
      
      {/* Hero Section - Text Left, Images Right */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] bg-white overflow-hidden pt-16 pb-8 sm:pb-12 md:pb-16">
        {/* Leaf Pattern Background */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute top-10 left-10 w-12 h-12"><Leaf className="w-full h-full text-[#7ede56] rotate-12" /></div>
          <div className="absolute top-20 right-20 w-10 h-10"><Leaf className="w-full h-full text-[#7ede56] -rotate-12" /></div>
          <div className="absolute top-30 left-24 w-14 h-14"><Leaf className="w-full h-full text-[#7ede56] rotate-45" /></div>
          <div className="absolute top-40 right-8 w-12 h-12"><Leaf className="w-full h-full text-[#7ede56] -rotate-45" /></div>
          <div className="absolute top-50 left-16 w-10 h-10"><Leaf className="w-full h-full text-[#7ede56] rotate-90" /></div>
          <div className="absolute top-60 right-36 w-14 h-14"><Leaf className="w-full h-full text-[#7ede56] rotate-12" /></div>
          <div className="absolute top-70 left-8 w-12 h-12"><Leaf className="w-full h-full text-[#7ede56] -rotate-12" /></div>
          <div className="absolute top-80 right-12 w-10 h-10"><Leaf className="w-full h-full text-[#7ede56] rotate-45" /></div>
          <div className="absolute top-100 left-28 w-14 h-14"><Leaf className="w-full h-full text-[#7ede56] -rotate-45" /></div>
          <div className="absolute top-120 right-24 w-12 h-12"><Leaf className="w-full h-full text-[#7ede56] rotate-90" /></div>
          <div className="absolute bottom-100 left-10 w-10 h-10"><Leaf className="w-full h-full text-[#7ede56] rotate-12" /></div>
          <div className="absolute bottom-90 right-28 w-14 h-14"><Leaf className="w-full h-full text-[#7ede56] -rotate-12" /></div>
          <div className="absolute bottom-80 left-22 w-12 h-12"><Leaf className="w-full h-full text-[#7ede56] rotate-45" /></div>
          <div className="absolute bottom-70 right-14 w-10 h-10"><Leaf className="w-full h-full text-[#7ede56] -rotate-45" /></div>
          <div className="absolute bottom-60 left-16 w-14 h-14"><Leaf className="w-full h-full text-[#7ede56] rotate-90" /></div>
          <div className="absolute bottom-50 right-32 w-12 h-12"><Leaf className="w-full h-full text-[#7ede56] rotate-12" /></div>
          <div className="absolute bottom-40 left-6 w-10 h-10"><Leaf className="w-full h-full text-[#7ede56] -rotate-12" /></div>
          <div className="absolute bottom-30 right-18 w-14 h-14"><Leaf className="w-full h-full text-[#7ede56] rotate-45" /></div>
          <div className="absolute bottom-20 left-34 w-12 h-12"><Leaf className="w-full h-full text-[#7ede56] -rotate-45" /></div>
          <div className="absolute bottom-10 right-8 w-10 h-10"><Leaf className="w-full h-full text-[#7ede56] rotate-90" /></div>
        </div>
        
        {/* Main Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <div className="order-2 lg:order-1 flex flex-col justify-start animate-fade-in-up -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
              <h1 ref={heroHeadingRef} className={"text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 transition-all duration-700 ease-in-out leading-tight text-gray-800 " + (heroHeadingVisible ? " animate-fade-in-up" : " opacity-0")}>
                <span className="animate-pulse-text">Simplifying access to </span><span className="animated-purple-word">FINANCE</span> and <span className="animated-purple-word">INFORMATION</span> for smallholder farmers while leveraging AI to smart <span className="animated-purple-word">INVESTOR</span> matching
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <a 
                href="https://agrilync.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer"
                  className="w-full sm:w-auto"
              >
                  <Button className="w-full sm:w-auto bg-[#002f37] hover:bg-[#001a1f] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Join the Waitlist
                </Button>
              </a>
                             <Button
                 variant="outline"
                  className="w-full sm:w-auto border-2 border-[#002f37] text-[#002f37] hover:bg-[#002f37] hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                 onClick={() => window.open('https://www.youtube.com/watch?v=-gOZgTW00GY', '_blank')}
               >
                 Watch Demo Video
               </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-green-300 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white"></div>
                  </div>
                  <span className="ml-2">Join us as a lync grower, lync investor or a solo farmer NOW</span>
                </div>
                <Button
                  className="bg-[#7ede56] hover:bg-[#6bc947] text-white px-6 py-2 text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </div>
            </div>
            
            {/* Right Side - Vertical Triptych Image Layout */}
            <div className="order-1 lg:order-2 relative flex items-end justify-center lg:justify-end min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] pb-4 sm:pb-6 md:pb-8">
              {/* Image Panel Container - Overlapping Style */}
              <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-xl h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
                
                {/* Panel 1 - hero1.jpg - Higher Position */}
                <div className="absolute left-0 top-[5%] w-[30%] sm:w-[32%] z-10 animate-hero-image-1">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                    <img
                      src="/lovable-uploads/hero1.jpg"
                      alt="Hero image 1"
                      className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] object-cover"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </div>
                </div>
                
                {/* Panel 2 - hero2.jpg - Lower Position */}
                <div className="absolute left-[35%] sm:left-[34%] top-[20%] w-[30%] sm:w-[32%] z-20 animate-hero-image-2">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                    <img
                      src="/lovable-uploads/hero2.jpg"
                      alt="Hero image 2"
                      className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
                
                {/* Panel 3 - hero3.jpg - Higher Position */}
                <div className="absolute left-[70%] sm:left-[68%] top-[5%] w-[30%] sm:w-[32%] z-30 animate-hero-image-3">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                    <img
                      src="/lovable-uploads/hero3.jpg"
                      alt="Hero image 3"
                      className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <h2 ref={whoWeAreRef} className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 transition-all duration-700 ease-in-out " + (whoWeAreVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: '#002f37' }}>
                Who We Are
              </h2>
            </div>

            {/* Right Column - Content */}
            <div className="animate-fade-in-left transition-all duration-700 ease-in-out">
              <div className="max-w-4xl">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We are Agrilync, revolutionizing African agriculture through AI and digital technologies. Our platform connects farmers with investors, markets, and intelligent farming solutions.
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
              <h2 ref={farmersCryingRef} className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 transition-all duration-700 ease-in-out " + (farmersCryingVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: 'white' }}>
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
                className="shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
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
                className="shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
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
                partnership platform. Secure funding, share profits, and build sustainable agricultural communities.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>• Verified farmer profiles</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>• Transparent profit sharing</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>• Extension agent monitoring</li>
                <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>• Impact tracking dashboard</li>
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
                className="shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
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
          className="fixed bottom-6 right-4 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 md:bottom-8 md:right-6"
          aria-label="Scroll to top"
          size="lg"
        >
          <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      )}

             <Footer />
     </div>
   );
 };

export default Index;
