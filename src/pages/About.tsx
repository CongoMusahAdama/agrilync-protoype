
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Users, TrendingUp, Award, Shield, Target, Heart, Lightbulb, Handshake, Eye, Building2, ArrowUp, Rocket, Smartphone, MapPin, Search, Globe, GraduationCap, Sprout, Check, Flag } from 'lucide-react';
import { Button } from '../components/ui/button'; // Added Button import
import CountUp from '../components/CountUp';

// Brand colors
const BRAND_MAGENTA = '#7ede56';
const BRAND_GREEN = '#7ede56';
const BRAND_TEAL = '#002F37';
const BRAND_WHITE = '#FFFFFF';

// Hero images for carousel - using all "who we are" images
const heroImages = [
  '/lovable-uploads/who.jpg',
  '/lovable-uploads/' + encodeURIComponent('who we are 2.jpg'),
  '/lovable-uploads/' + encodeURIComponent('who we are 4.jpg'),
  '/lovable-uploads/whoweare2.jpg',
];

const About = () => {
  // Scroll-triggered animation hooks
  const [heroHeadingRef, heroHeadingVisible] = useScrollReveal();
  const [whoWeAreRef, whoWeAreVisible] = useScrollReveal();
  const [visionRef, visionVisible] = useScrollReveal();
  const [missionRef, missionVisible] = useScrollReveal();
  const [valuesRef, valuesVisible] = useScrollReveal();
  const [value1Ref, value1Visible] = useScrollReveal();
  const [value2Ref, value2Visible] = useScrollReveal();
  const [value3Ref, value3Visible] = useScrollReveal();
  const [value4Ref, value4Visible] = useScrollReveal();
  const [value5Ref, value5Visible] = useScrollReveal();
  const [whoWeServeRef, whoWeServeVisible] = useScrollReveal();
  const [serve1Ref, serve1Visible] = useScrollReveal();
  const [serve2Ref, serve2Visible] = useScrollReveal();
  const [serve3Ref, serve3Visible] = useScrollReveal();
  const [serve4Ref, serve4Visible] = useScrollReveal();
  const [howWeDoItRef, howWeDoItVisible] = useScrollReveal();
  const [whyChooseUsRef, whyChooseUsVisible] = useScrollReveal();
  const [monitoringRef, monitoringVisible] = useScrollReveal();
  const [trustRef, trustVisible] = useScrollReveal();
  const [mobileAppRef, mobileAppVisible] = useScrollReveal();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, []);

  // Handle scroll to top button visibility and navbar variant
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.75; // 75vh hero section
      setShowScrollTop(window.scrollY > 300);
      setIsScrolledPastHero(window.scrollY > heroHeight);
    };

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

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar - Always visible, transparent on top */}
      <Navbar />

      {/* Hero Section with Carousel Background Images */}
      <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] flex flex-col items-center justify-center overflow-hidden p-0 m-0">
        {/* Carousel Container */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Who We Are Hero Background ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              style={{
                objectPosition: index === 0 ? 'center center' : 'center 25%',
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ))}
        </div>

        {/* Enhanced overlay for better text readability - lighter at top to show faces */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 z-10"></div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/75 w-2 sm:w-2.5'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-end h-full pb-8 sm:pb-12 md:pb-16">
          <div className="animate-fade-in-up w-full max-w-4xl mx-auto">
            <h1 ref={heroHeadingRef} className={"text-lg sm:text-xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-2xl transition-all duration-700 ease-in-out leading-tight px-2 " + (heroHeadingVisible ? " animate-fade-in-up" : " opacity-0")} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Who We Are
            </h1>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section id="who-we-are" className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Left Column - Title */}
            <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
              <h2 ref={whoWeAreRef} className={"text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (whoWeAreVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: BRAND_TEAL }}>
                What We Do
              </h2>
              <div className="w-16 h-0.5 bg-[#7ede56] mb-4 sm:mb-6"></div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-6 animate-fade-in-left transition-all duration-700 ease-in-out">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
                Agrilync Nexus is a Ghana-based AgriFinTech and advisory platform that connects smallholder farmers with farm investors and partner organizations through a structured, transparent finance-first model supported by training, AI-powered advisory, and an agent network.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
                We operate a B2B2C model, working with partner organizations and investor entities who in turn serve and fund smallholder farmers. Our first rollout targets 500 pilot smallholder farmers across seven regions of Ghana.
              </p>
              <p className="text-gray-500 text-xs italic mb-4 p-4 border-l-4 border-[#7ede56]/20 bg-[#7ede56]/10">
                "Agrilync Nexus is a technology-enabled agricultural platform that connects farmers, agricultural experts, and independent investors. We do not operate as a fund manager, financial institution, or farm operator. Agrilync Nexus does not custody user funds or guarantee investment returns."
              </p>

              {/* Impact Figures */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div className="text-left transition-all duration-700 ease-in-out">
                  <div className="text-4xl sm:text-5xl font-extrabold mb-2" style={{ color: BRAND_TEAL }}>
                    <CountUp end={95} suffix="%" />
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-snug font-medium">
                    WhatsApp community engagement
                  </p>
                </div>
                <div className="text-left transition-all duration-700 ease-in-out">
                  <div className="text-4xl sm:text-5xl font-extrabold mb-2" style={{ color: BRAND_TEAL }}>
                    <CountUp end={8} />
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-snug font-medium">
                    Online webinars covering all aspects of farming
                  </p>
                </div>
                <div className="text-left transition-all duration-700 ease-in-out">
                  <div className="text-4xl sm:text-5xl font-extrabold mb-2" style={{ color: BRAND_TEAL }}>
                    <CountUp end={50} suffix="+" />
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-snug font-medium">
                    Signups for our waitlist
                  </p>
                </div>
                <div className="text-left transition-all duration-700 ease-in-out">
                  <div className="text-4xl sm:text-5xl font-extrabold mb-2" style={{ color: BRAND_TEAL }}>
                    <CountUp end={28} />
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-snug font-medium">
                    One-on-one consultations done
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Vision & Mission Section */}
      <section id="vision-mission" className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision Section */}
            <div className="p-8 sm:p-12 text-center rounded-2xl" style={{ backgroundColor: BRAND_TEAL }}>
              <div className="flex justify-center mb-6">
                <Eye className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                Vision
              </h3>
              <p className="text-white text-sm sm:text-base leading-relaxed mb-6">
                To become Africa’s leading smallholder farm investment and training platform, trusted by farmers, partners, and investors for transparent, data-driven agricultural finance.
              </p>
              <a href="#" className="inline-flex items-center text-white hover:underline transition-colors duration-300">
                Our Solutions ?
              </a>
            </div>

            {/* Mission Section */}
            <div className="p-8 sm:p-12 text-center bg-white border border-gray-200 rounded-2xl">
              <div className="flex justify-center mb-6">
                <Building2 className="w-12 h-12" style={{ color: BRAND_TEAL }} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wider" style={{ color: BRAND_TEAL }}>
                Mission
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                To unlock capital and knowledge for smallholder farmers by connecting them to investors and partners through a transparent, agent-supported, AI-driven platform.
              </p>
              <a href="#" className="inline-flex items-center hover:underline transition-colors duration-300" style={{ color: BRAND_TEAL }}>
                Discover More ?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="core-values" className="py-8 sm:py-10 md:py-12" style={{ backgroundColor: BRAND_TEAL }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in-up transition-all duration-700 ease-in-out">
            <div className="flex items-center justify-center mb-3">
              <div className="w-2 h-2" style={{ backgroundColor: BRAND_GREEN }}></div>
              <span className="text-gray-300 text-xs uppercase tracking-wider ml-3">OUR FOUNDATION</span>
            </div>
            <h2 ref={valuesRef} className={"text-xl sm:text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 ease-in-out " + (valuesVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: 'white' }}>
              Core Values
            </h2>
            <div className="w-16 h-0.5 bg-[#7ede56]/40 mb-3 mx-auto"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16">
            {/* Trust */}
            <div ref={value5Ref} className={"transition-all duration-700 ease-in-out transform " + (value5Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '0ms' }}>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Trust</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Verified farmers, transparent reporting, and clear agreements.
                </p>
              </div>
            </div>

            {/* Inclusion */}
            <div ref={value1Ref} className={"transition-all duration-700 ease-in-out transform " + (value1Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '100ms' }}>
              <div className="flex flex-col items-center text-center">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Inclusion</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Serving smallholder farmers, including those without smartphones, through agents.
                </p>
              </div>
            </div>

            {/* Impact */}
            <div ref={value4Ref} className={"transition-all duration-700 ease-in-out transform " + (value4Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '200ms' }}>
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Impact</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Improving farmer incomes and de-risking agricultural investment.
                </p>
              </div>
            </div>

            {/* Innovation */}
            <div ref={value3Ref} className={"transition-all duration-700 ease-in-out transform " + (value3Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '300ms' }}>
              <div className="flex flex-col items-center text-center">
                <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Innovation</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Using AI, digital tools, and creative finance structures.
                </p>
              </div>
            </div>

            {/* Growth */}
            <div ref={value2Ref} className={"transition-all duration-700 ease-in-out transform " + (value2Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '400ms' }}>
              <div className="flex flex-col items-center text-center">
                <Target className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Growth</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Helping farmers and partners grow sustainably together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section id="who-we-serve" className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Left Column - Title */}
            <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2" style={{ backgroundColor: BRAND_TEAL }}></div>
                <span className="text-gray-500 text-sm uppercase tracking-wider ml-3">WHO WE SERVE</span>
              </div>
              <h2 ref={whoWeServeRef} className={"text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (whoWeServeVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: BRAND_TEAL }}>
                Who We Serve
              </h2>
              <div className="w-16 h-0.5 bg-[#7ede56] mb-4 sm:mb-6"></div>
            </div>

            {/* Right Column - Stakeholders */}
            <div className="space-y-6 animate-fade-in-left transition-all duration-700 ease-in-out">
              {/* Lync Growers */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Lync Growers</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Verified smallholder farmers in Ghana (initially 500 pilot farmers) who are matched with investors and partners for shared-profit agricultural projects.
                  </p>
                </div>
              </div>

              {/* Individual Farmers */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Individual Farmers</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Farmers who interact with our AI advisory agent or book expert consultations for smart crop and livestock advice, without investor matching.
                  </p>
                </div>
              </div>

              {/* Lync Investors */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Lync Investors</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Impact investors and financial institutions looking to deploy capital into structured, verified smallholder agricultural projects with transparent data.
                  </p>
                </div>
              </div>

              {/* Agricultural & Development Partners */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Agricultural & Development Partners</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    NGOs, cooperatives, and producer groups that need a structured finance and training platform to support the farmers they work with.
                  </p>
                </div>
              </div>

              {/* Lync Agents */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Lync Agents</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Local youth and extension-type workers who onboard Lync Growers, collect baseline data, and monitor farm progress to ensure accountability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Do It Section */}
      <section id="process" className="py-10 sm:py-16 md:py-20" style={{ backgroundColor: BRAND_TEAL }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <div className="flex items-center justify-center mb-4">
              <div className="w-2 h-2" style={{ backgroundColor: BRAND_GREEN }}></div>
              <span className="text-gray-300 text-sm uppercase tracking-wider ml-3">Our Process</span>
            </div>
            <h2 ref={howWeDoItRef} className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (howWeDoItVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: 'white' }}>
              how we do it
            </h2>
            <div className="w-16 h-0.5 bg-[#7ede56]/40 mb-4 sm:mb-6 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {/* Step 1: Connect */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white group-hover:text-green-400 transition-colors duration-300 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                01
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Connect</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Connect farmers to investors on a shared-profit basis, creating mutually beneficial partnerships that drive sustainable agricultural growth.
              </p>
            </div>

            {/* Step 2: Monitor */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white group-hover:text-[#7ede56] transition-colors duration-300 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                02
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Monitor</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Extension agents are assigned to oversee activities on/off the farm, ensuring accountability and transparency for both farmers and investors.
              </p>
            </div>

            {/* Step 3: Support */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                03
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Strategic Support</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                AgriLync Nexus provides agricultural guidance and education for farmers and investors. We support project planning and best practices without offering regulated financial advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Monitoring & Verification Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-2 h-2" style={{ backgroundColor: BRAND_MAGENTA }}></div>
                <span className="text-gray-500 text-sm uppercase tracking-wider ml-3">ACCOUNTABILITY</span>
              </div>
              <h2 ref={monitoringRef} className={"text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-[#002f37] transition-all duration-700 ease-in-out " + (monitoringVisible ? " animate-fade-in-up" : " opacity-0")}>
                Field Monitoring & Transparency
              </h2>
              <div className="w-16 h-0.5 bg-[#7ede56] mb-6"></div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                AgriLync Nexus uses independent field verification agents to monitor farm project progress and improve transparency between farmers and investors.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                These agents collect data, photos, and progress updates. They do not manage farm operations, handle funds, or make agricultural decisions. This ensures that all stakeholders have access to accurate, real-time information about the project's status.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-[#002f37] mb-2">Real-time Data</h4>
                  <p className="text-sm text-gray-500">Live updates from the field directly to your dashboard.</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-[#002f37] mb-2">Verified Updates</h4>
                  <p className="text-sm text-gray-500">Independent verification of all project milestones.</p>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="rounded-3xl overflow-hidden shadow-2xl max-w-[280px] sm:max-w-xs md:max-w-sm border-4 border-gray-900">
                <img
                  src="/lovable-uploads/app-dashboard.png"
                  alt="Monitoring App"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 p-4 md:p-6 bg-white rounded-2xl shadow-xl max-w-[180px] md:max-w-xs hidden sm:block">
                <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-xs md:text-sm">Active Monitoring</span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500">Field agent verified 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section className="py-10 sm:py-16 md:py-20" style={{ backgroundColor: BRAND_TEAL }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 ref={trustRef} className={"text-3xl sm:text-4xl font-bold mb-3 text-white transition-all duration-700 ease-in-out " + (trustVisible ? " animate-fade-in-up" : " opacity-0")}>Trust & Compliance</h2>
          <div className="w-16 h-0.5 bg-[#7ede56]/40 mb-12 mx-auto"></div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Registered Business Entity", desc: "Fully compliant with local regulations." },
              { title: "Secure Payment Processing", desc: "International standard encryption." },
              { title: "Data Protection Compliant", desc: "Your information is safe with us." },
              { title: "Encrypted Platform Security", desc: "Advanced cybersecurity measures." },
              { title: "Transparent Reporting System", desc: "Full visibility for all stakeholders." },
              { title: "Independent Verification", desc: "Third-party field monitoring agents." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors bg-white/5">
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Left Column - Title */}
            <div ref={whyChooseUsRef} className={"animate-fade-in-right transition-all duration-700 ease-in-out " + (whyChooseUsVisible ? " animate-fade-in-up" : " opacity-0")}>
              <div className="flex items-center mb-4">
                <div className="w-2 h-2" style={{ backgroundColor: BRAND_TEAL }}></div>
                <span className="text-gray-500 text-sm uppercase tracking-wider ml-3">WHO WE ARE</span>
              </div>
              <h2 className={"text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (whyChooseUsVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: BRAND_TEAL }}>
                why<br />Choose us
              </h2>
              <div className="w-16 h-0.5 bg-[#7ede56] mb-4 sm:mb-6"></div>
            </div>

            {/* Right Column - Reasons */}
            <div className="space-y-8 animate-fade-in-left transition-all duration-700 ease-in-out">
              {/* Reason 1 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    We are consummate professionals and specialists in agricultural technology, with a proven track record in AI-driven farming solutions. Our expertise in connecting farmers with investors and providing digital tools backs up our reputation. We take care of the technical details, so farmers can focus on what they do best.
                  </p>
                </div>
              </div>

              {/* Reason 2 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    When it comes to agricultural technology and farmer support, we recognize that you have a choice. Our goal is to be your platform of choice - through the right technology, with dedication, integrity, enthusiasm and time-tested processes that have helped over 200 farmers across Ghana.
                  </p>
                </div>
              </div>

              {/* Reason 3 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    We have over the years through innovation, creativity, commitment and sheer hard work pioneered the era of AI-powered agricultural consultation and digital farming solutions with a strategic approach to support farmers' growth strategies across Africa.
                  </p>
                </div>
              </div>

              {/* Reason 4 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    We have grown and expanded our service offering to include comprehensive agricultural technology solutions since our founding. This makes us a one-stop platform for all farming digital needs, from AI consultation to investment matching.
                  </p>
                </div>
              </div>

              {/* Reason 5 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    We love what we do, working with us puts you in good company. A passionate team with experience in both agriculture and technology, working with some of the most innovative farming communities and investors across Ghana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Enhanced Mobile App Development Section */}
      <section ref={mobileAppRef} className={"py-16 sm:py-24 relative overflow-hidden transition-all duration-1000 ease-in-out " + (mobileAppVisible ? " animate-fade-in-up" : " opacity-0")} style={{ backgroundColor: BRAND_TEAL }}>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#7ede56] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 hidden md:block" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-[128px] opacity-10 hidden md:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Content Area */}
            <div className="text-left space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <Smartphone className="w-4 h-4 text-[#7ede56]" />
                <span className="text-white text-xs font-bold tracking-wider uppercase">Coming Soon</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-sora">
                AgriLync Nexus in <span className="text-[#7ede56]">Your Pocket.</span>
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Our mobile app is currently under development, crafted to bring AI-powered agricultural solutions straight to farmers' smartphones. Experience the future of African agriculture through accessible, mobile-first technology.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-5 h-5 text-[#7ede56]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Instant Access</h4>
                    <p className="text-gray-400 text-sm">Farm insights and AI consultation on the go.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#7ede56]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Offline Support</h4>
                    <p className="text-gray-400 text-sm">Critical features work in low-connectivity areas.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 flex items-center gap-3 backdrop-blur-sm shadow-xl">
                  <Globe className="w-6 h-6 text-gray-300" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Available Soon on</span>
                    <span className="text-white font-bold text-sm">App Store</span>
                  </div>
                </div>
                <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 flex items-center gap-3 backdrop-blur-sm shadow-xl">
                  <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Available Soon on</span>
                    <span className="text-white font-bold text-sm">Google Play</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Display Area - 3D Mockup Arrangement */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full mt-12 lg:mt-0 flex justify-center items-center perspective-[2000px]">

              {/* Back Left Mockup */}
              <div className="absolute left-[5%] md:left-[10%] transform -rotate-y-12 -rotate-12 translate-z-[-100px] scale-[0.85] md:scale-95 opacity-60 hover:opacity-100 hover:scale-100 hover:z-30 transition-all duration-500 rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden w-[180px] sm:w-[220px] md:w-[260px] bg-black">
                <img src="/lovable-uploads/app-menu.png" alt="App Menu" className="w-full h-auto object-cover" />
              </div>

              {/* Front Center Mockup */}
              <div className="absolute z-20 transform hover:-translate-y-4 hover:scale-105 transition-all duration-500 rounded-[2.5rem] border-[8px] border-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden w-[220px] sm:w-[260px] md:w-[300px] bg-white ring-4 ring-[#7ede56]/30">
                <img src="/lovable-uploads/app-dashboard.png" alt="App Dashboard" className="w-full h-auto object-cover" />
              </div>

              {/* Back Right Mockup */}
              <div className="absolute right-[5%] md:right-[10%] transform rotate-y-12 rotate-12 translate-z-[-100px] scale-[0.85] md:scale-95 opacity-60 hover:opacity-100 hover:scale-100 hover:z-30 transition-all duration-500 rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden w-[180px] sm:w-[220px] md:w-[260px] bg-black">
                <img src="/lovable-uploads/app-grower-directory.png" alt="Grower Directory" className="w-full h-auto object-cover" />
              </div>
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

export default About;
