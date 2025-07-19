import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, MapPin, Calendar, Shield, Award, Play, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const heroImages = [
  '/lovable-uploads/image.png',
  '/lovable-uploads/image1.jpg',
];

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Scroll-triggered animation hooks (must be at the top level)
  const [feature1Ref, feature1Visible] = useScrollReveal();
  const [feature2Ref, feature2Visible] = useScrollReveal();
  const [feature3Ref, feature3Visible] = useScrollReveal();
  // Headings
  const [heroHeadingRef, heroHeadingVisible] = useScrollReveal();
  const [succeedHeadingRef, succeedHeadingVisible] = useScrollReveal();
  const [storiesHeadingRef, storiesHeadingVisible] = useScrollReveal();

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
      {/* Hero Section - Slideshow */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-0 m-0">
        {/* Slideshow Images */}
        {heroImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Hero slide ${idx + 1}`}
            className={
              `w-full h-full object-cover absolute inset-0 transition-opacity duration-1500 ease-in-out ` +
              (currentSlide === idx ? 'opacity-100 z-0' : 'opacity-0 z-0')
            }
            style={{
              zIndex: 0,
              transition: 'opacity 1.5s cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: 'none',
            }}
            loading={idx === 0 ? 'eager' : 'lazy'}
            fetchPriority={idx === 0 ? 'high' : undefined}
          />
        ))}
        {/* Overlay for darkening */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* Navbar overlayed above image */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <Navbar variant="transparent" />
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-12 sm:mt-20">
          <div className="animate-fade-in-up w-full">
            <h1 ref={heroHeadingRef} className={"text-xl sm:text-2xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-2xl transition-all duration-700 ease-in-out leading-tight " + (heroHeadingVisible ? " animate-fade-in-up" : " opacity-0") }>
              Empowering Africa's Agriculture with <span className="font-extrabold animate-purple-glow typewriter align-middle" style={{ color: '#921573', display: 'inline-block', maxWidth: '100%', verticalAlign: 'middle' }}>
                AI Innovation & Financial Access
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/95 mb-6 max-w-xs sm:max-w-md md:max-w-2xl mx-auto drop-shadow-lg font-medium animate-fade-in delay-700 transition-all duration-700 ease-in-out">
              We put you first—building solutions tailored to your needs, not ours. Empowering African agriculture with AI-driven advice, local weather insights, and innovative financing for a more productive, sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in delay-1000 w-full">
              <Link to="/auth" className="w-full sm:w-auto max-w-xs">
                <Button className="w-full sm:w-auto max-w-xs bg-white/100 border-2 border-[#002f37] text-[#002f37] hover:bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
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

      {/* Everything You Need to Succeed Section - Updated with staggered animations */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={succeedHeadingRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 transition-all duration-700 ease-in-out " + (succeedHeadingVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: '#002f37' }}>
              Everything You Need to Succeed
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
              From AI-powered consultation to investment opportunities, we provide comprehensive tools for modern farming.
            </p>
          </div>

          {/* Feature 1 - AI Consultation with scroll-triggered slide-in */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-10 sm:mb-16 md:mb-20">
            <div className="order-2 lg:order-1 animate-fade-in-right delay-400 mt-6 sm:mt-0 lg:col-start-1">
              <Leaf className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 cursor-pointer hover:text-purple-600 transition-colors animate-fade-in transition-all duration-700 ease-in-out" style={{ color: '#002f37' }}
                  onClick={() => handleFeatureClick('/ai-consultation')}>
                AI-Powered Crop Consultation
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Get instant, personalized advice for your crops. Upload photos of plant diseases, 
                pests, or growth issues and receive expert recommendations powered by advanced AI technology.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Instant disease identification</li>
                <li>• Personalized treatment recommendations</li>
                <li>• Connect with human experts</li>
                <li>• Track crop health over time</li>
              </ul>
              <Button 
                onClick={() => handleFeatureClick('/ai-consultation')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Try AI Consultation
              </Button>
            </div>
            <div ref={feature1Ref} className={(feature1Visible ? "animate-slide-in-left" : "opacity-0") + " order-1 lg:order-2 lg:col-start-2"}>
              <img 
                src="/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png"
                alt="AI Consultation"
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick('/ai-consultation')}
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
                onClick={() => handleFeatureClick('/weather')}
              />
            </div>
            <div className="order-2 lg:order-2 animate-fade-in-left delay-600 lg:col-start-2 mt-6 sm:mt-0">
              <MapPin className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 cursor-pointer hover:text-purple-600 transition-colors animate-fade-in transition-all duration-700 ease-in-out" style={{ color: '#002f37' }}
                  onClick={() => handleFeatureClick('/weather')}>
                Hyperlocal Weather Insights
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Access precise, farm-specific weather forecasts and receive intelligent 
                recommendations for planting, irrigation, and harvesting based on local conditions.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• 7-day hyperlocal forecasts</li>
                <li>• SMS weather alerts</li>
                <li>• Farming calendar notifications</li>
                <li>• AI-driven recommendations</li>
              </ul>
              <Button 
                onClick={() => handleFeatureClick('/weather')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                View Weather Forecast
              </Button>
            </div>
          </div>

          {/* Feature 3 - FarmPartner with scroll-triggered slide-in */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in-right delay-800 mt-6 sm:mt-0">
              <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 cursor-pointer hover:text-purple-600 transition-colors animate-fade-in transition-all duration-700 ease-in-out" style={{ color: '#002f37' }}
                  onClick={() => handleFeatureClick('/farm-partner')}>
                FarmPartner Investment Initiative
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Connect verified farmers with impact investors through our transparent 
                partnership platform. Secure funding, share profits, and build sustainable agricultural communities.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Verified farmer profiles</li>
                <li>• Transparent profit sharing</li>
                <li>• Extension agent monitoring</li>
                <li>• Impact tracking dashboard</li>
              </ul>
              <Button 
                onClick={() => handleFeatureClick('/farm-partner')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Explore FarmPartner
              </Button>
            </div>
            <div ref={feature3Ref} className={(feature3Visible ? "animate-slide-in-left delay-800" : "opacity-0") + " order-1 lg:order-2 lg:col-start-2"}>
              <img 
                src="/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png"
                alt="FarmPartner Investment"
                className="rounded-2xl shadow-2xl w-full h-64 sm:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleFeatureClick('/farm-partner')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section - Ghana Focus */}
      <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <h2 ref={storiesHeadingRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 transition-all duration-700 ease-in-out " + (storiesHeadingVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: '#002f37' }}>
              Success Stories from Ghana
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Real farmers, real results across Ghana's agricultural regions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Farmer 1 */}
            <div className="bg-white p-5 sm:p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                {/* Removed farmer image */}
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#002f37' }}>Kwame Asante</h4>
                  <p className="text-gray-600">Ashanti Region</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "AgriLync helped me increase my cocoa yield by 40% through AI disease detection 
                and connected me with an investor who funded my irrigation system."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Farmer</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Success Video
                </Button>
              </div>
            </div>
            {/* Farmer 2 */}
            <div className="bg-white p-5 sm:p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                {/* Removed farmer image */}
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#002f37' }}>Akosua Mensah</h4>
                  <p className="text-gray-600">Northern Region</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "The weather alerts saved my tomato harvest during the unexpected rains. 
                Now I'm partnered with 3 investors and managing 50 acres successfully."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Farmer</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Success Video
                </Button>
              </div>
            </div>
            {/* Farmer 3 */}
            <div className="bg-white p-5 sm:p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                {/* Removed farmer image */}
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold" style={{ color: '#002f37' }}>Kofi Osei</h4>
                  <p className="text-gray-600">Eastern Region</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "From 2 acres to 15 acres in just 18 months. AgriLync's extension agents 
                guided me through modern farming techniques and secured funding for expansion."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified Farmer</span>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Success Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-2 sm:px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 animate-fade-in">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Join thousands of Ghanaian farmers already growing smarter with AgriLync
          </p>
          <div className="flex justify-center">
            {/* WhatsApp Community Button - small, square, professional */}
            <a 
              href="https://chat.whatsapp.com/Juajl1hFw2vDV6JR3kymUe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-lg transition-all duration-300 border border-green-600"
              title="Join WhatsApp Community"
            >
              {/* WhatsApp SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.828-2.205C13.416 27.168 14.684 27.5 16 27.5c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.18 0-2.336-.207-3.428-.613l-.244-.09-4.652 1.31 1.244-4.41-.16-.253C7.23 18.13 6.5 16.6 6.5 15c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zm5.09-6.41c-.277-.139-1.637-.807-1.89-.899-.253-.093-.437-.139-.62.139-.184.277-.713.899-.874 1.084-.16.184-.32.208-.597.07-.277-.139-1.17-.431-2.23-1.374-.824-.735-1.38-1.64-1.542-1.917-.16-.277-.017-.427.122-.565.126-.125.277-.32.416-.48.139-.16.184-.277.277-.462.093-.184.046-.347-.023-.486-.07-.139-.62-1.497-.85-2.05-.224-.539-.453-.466-.62-.475l-.527-.009c-.17 0-.446.064-.68.298-.233.233-.89.87-.89 2.122s.911 2.465 1.038 2.637c.126.17 1.793 2.736 4.35 3.73.608.209 1.082.334 1.452.427.61.155 1.165.133 1.604.081.489-.058 1.637-.668 1.87-1.312.232-.645.232-1.197.162-1.312-.07-.116-.253-.184-.53-.323z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
