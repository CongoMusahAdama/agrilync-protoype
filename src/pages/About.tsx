
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Users, TrendingUp, Award, Shield, Target, Heart, Lightbulb, Handshake, Eye, Building2, ArrowUp, Rocket, Smartphone, MapPin, Search, Globe, GraduationCap, Sprout, Check } from 'lucide-react';
import { Button } from '../components/ui/button'; // Added Button import
import CountUp from '../components/CountUp';

// Brand colors
const BRAND_MAGENTA = '#921573';
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
  const [roadmapRef, roadmapVisible] = useScrollReveal();
  const [mobileAppRef, mobileAppVisible] = useScrollReveal();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
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
                console.log(`Image ${index + 1} failed to load`);
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

        {/* Navbar overlayed above image */}
        <div className="fixed top-0 left-0 right-0 z-30">
          <Navbar variant={isScrolledPastHero ? "light" : "transparent"} />
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
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 ref={whoWeAreRef} className={"text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 transition-all duration-700 ease-in-out " + (whoWeAreVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: BRAND_TEAL }}>
              Who We Are
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-4 sm:mb-6"></div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
              AgriLync is a revolutionary agricultural technology platform that connects farmers, investors, and agricultural experts in a seamless ecosystem. We bridge the gap between traditional farming practices and modern agricultural innovation, empowering farmers with the resources, knowledge, and financial support they need to thrive in today's competitive agricultural landscape.
            </p>

            {/* Impact Figures */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 border-t pt-8 border-gray-100">
              <div className="text-center sm:text-left transition-all duration-700 ease-in-out">
                <div className="text-5xl sm:text-6xl font-extrabold mb-2" style={{ color: BRAND_TEAL }}>
                  <CountUp end={95} suffix="%" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-snug font-medium">
                  WhatsApp community engagement
                </p>
              </div>
              <div className="text-center sm:text-left transition-all duration-700 ease-in-out">
                <div className="text-5xl sm:text-6xl font-extrabold mb-2" style={{ color: BRAND_TEAL }}>
                  <CountUp end={8} />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-snug font-medium">
                  Online webinars covering all aspects of farming
                </p>
              </div>
              <div className="text-center sm:text-left transition-all duration-700 ease-in-out">
                <div className="text-5xl sm:text-6xl font-extrabold mb-2" style={{ color: BRAND_TEAL }}>
                  <CountUp end={50} suffix="+" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-snug font-medium">
                  Signups for our waitlist
                </p>
              </div>
              <div className="text-center sm:text-left transition-all duration-700 ease-in-out">
                <div className="text-5xl sm:text-6xl font-extrabold mb-2" style={{ color: BRAND_TEAL }}>
                  <CountUp end={28} />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-snug font-medium">
                  One-on-one consultations done
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision Section */}
            <div className="p-8 sm:p-12 text-center" style={{ backgroundColor: BRAND_TEAL }}>
              <div className="flex justify-center mb-6">
                <Eye className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 uppercase tracking-wider">
                Vision
              </h3>
              <p className="text-white text-sm sm:text-base leading-relaxed mb-6">
                To revolutionize African agriculture through innovative technology solutions, creating sustainable farming ecosystems that empower farmers and drive economic growth across the continent.
              </p>
              <a href="#" className="inline-flex items-center text-white hover:underline transition-colors duration-300">
                Our Solutions →
              </a>
            </div>

            {/* Mission Section */}
            <div className="p-8 sm:p-12 text-center bg-white border border-gray-200">
              <div className="flex justify-center mb-6">
                <Building2 className="w-12 h-12" style={{ color: BRAND_TEAL }} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 uppercase tracking-wider" style={{ color: BRAND_TEAL }}>
                Mission
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                To connect farmers with investors, markets, and intelligent farming solutions through our AI-powered platform, ensuring sustainable agricultural practices and shared prosperity for all stakeholders.
              </p>
              <a href="#" className="inline-flex items-center hover:underline transition-colors duration-300" style={{ color: BRAND_TEAL }}>
                Discover More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-8 sm:py-10 md:py-12" style={{ backgroundColor: BRAND_TEAL }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in-up transition-all duration-700 ease-in-out">
            <div className="flex items-center justify-center mb-3">
              <div className="w-2 h-2" style={{ backgroundColor: BRAND_GREEN }}></div>
              <span className="text-gray-300 text-xs uppercase tracking-wider ml-3">OUR FOUNDATION</span>
            </div>
            <h2 ref={valuesRef} className={"text-xl sm:text-2xl md:text-3xl font-bold mb-2 transition-all duration-700 ease-in-out " + (valuesVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: 'white' }}>
              Core Values
            </h2>
            <div className="w-16 h-0.5 bg-purple-400 mb-3 mx-auto"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16">
            {/* Inclusivity */}
            <div ref={value1Ref} className={"transition-all duration-700 ease-in-out transform " + (value1Visible ? " animate-fade-in-up opacity-100" : " opacity-0")}>
              <div className="flex flex-col items-center text-center">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Inclusivity</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Accessible to all farmers
                </p>
              </div>
            </div>

            {/* Collaboration */}
            <div ref={value2Ref} className={"transition-all duration-700 ease-in-out transform " + (value2Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '100ms' }}>
              <div className="flex flex-col items-center text-center">
                <Handshake className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Collaboration</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Working together
                </p>
              </div>
            </div>

            {/* Innovation */}
            <div ref={value3Ref} className={"transition-all duration-700 ease-in-out transform " + (value3Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '200ms' }}>
              <div className="flex flex-col items-center text-center">
                <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Innovation</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Cutting-edge solutions
                </p>
              </div>
            </div>

            {/* Empowerment */}
            <div ref={value4Ref} className={"transition-all duration-700 ease-in-out transform " + (value4Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '300ms' }}>
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Empowerment</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Tools to succeed
                </p>
              </div>
            </div>

            {/* Transparency */}
            <div ref={value5Ref} className={"transition-all duration-700 ease-in-out transform " + (value5Visible ? " animate-fade-in-up opacity-100" : " opacity-0")} style={{ animationDelay: '400ms' }}>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 mb-3 transition-transform hover:scale-110" style={{ color: BRAND_GREEN }} />
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Transparency</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[140px]">
                  Open communication
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
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
              <div className="w-16 h-0.5 bg-purple-600 mb-4 sm:mb-6"></div>
            </div>

            {/* Right Column - Stakeholders */}
            <div className="space-y-6 animate-fade-in-left transition-all duration-700 ease-in-out">
              {/* Solo Farmers */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Solo Farmers</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Farmers who join to seek consultation, book appointments, and interact with our AI agent Akuafo Adanfo, which supports three local languages: Twi, Ewe, and Dagomba, with English as the default language.
                  </p>
                </div>
              </div>

              {/* Lync Growers */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: BRAND_TEAL }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>Lync Growers</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Registered farmers with proven track records across regions under our Lync Growers Association. They are matched with investors.
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
                    Investors who connect with farmers for opportunities, providing capital, tools, or equipment for agricultural projects.
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
                    Extension agents assigned to monitor activities on/off the farm, ensuring accountability for both farmers and investors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Do It Section */}
      <section className="py-10 sm:py-16 md:py-20" style={{ backgroundColor: BRAND_TEAL }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <div className="flex items-center justify-center mb-4">
              <div className="w-2 h-2" style={{ backgroundColor: BRAND_GREEN }}></div>
              <span className="text-gray-300 text-sm uppercase tracking-wider ml-3">Our Process</span>
            </div>
            <h2 ref={howWeDoItRef} className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (howWeDoItVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: 'white' }}>
              how we do it
            </h2>
            <div className="w-16 h-0.5 bg-purple-400 mb-4 sm:mb-6 mx-auto"></div>
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
              <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                02
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Monitor</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Extension agents are assigned to oversee activities on/off the farm, ensuring accountability and transparency for both farmers and investors.
              </p>
            </div>

            {/* Step 3: Invest */}
            <div className="text-center group">
              <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                03
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Invest</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Investment can be in the form of money, tools, or equipment, providing comprehensive support for agricultural projects and ensuring success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
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
              <div className="w-16 h-0.5 bg-purple-600 mb-4 sm:mb-6"></div>
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

      {/* Our Journey to Launch Section */}
      <section ref={roadmapRef} className={"py-10 sm:py-16 md:py-20 bg-gray-50 overflow-hidden"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ede56]/20 text-[#002f37] font-semibold text-sm mb-4 animate-fade-in-up">
              Launch Roadmap
            </div>
            <h2 className={"text-3xl sm:text-4xl md:text-5xl font-bold mb-4 transition-all duration-700 ease-in-out " + (roadmapVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: BRAND_TEAL }}>
              Our Journey to Launch
            </h2>
            <p className={"text-gray-600 max-w-2xl mx-auto transition-all duration-700 ease-in-out " + (roadmapVisible ? " animate-fade-in-up" : " opacity-0")}>
              Follow our progress as we revolutionize agriculture across Africa, one milestone at a time.
            </p>
          </div>

          <div className="relative">
            {/* Center Vertical Line */}
            <div className="absolute left-9 md:left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 block"></div>

            {/* Timeline Items */}
            <div className="space-y-8 md:space-y-0 relative">
              {[
                { phase: 'PHASE 1', date: 'October 2024', title: 'Problem Release', description: 'Identified and released the core problem statement addressing agricultural inefficiencies.', status: 'completed' },
                { phase: 'PHASE 2', date: 'Q1 2025', title: 'Dry Run Launch', description: 'Successfully launched our initial dry run to test core system functionalities.', status: 'completed' },
                { phase: 'PHASE 3', date: 'Q2 2025', title: 'Waitlist Release', description: 'Opened early access waitlist for interested farmers and partners.', status: 'completed' },
                { phase: 'PHASE 4', date: 'Q3 2025', title: 'Mobile App Development', description: 'Commenced comprehensive development of our mobile application for farmers.', status: 'completed' },
                { phase: 'PHASE 5', date: 'Q4 2025', title: 'Pilot Regions Launch', description: 'Launching pilot regions for specialized farm partner investments.', status: 'completed' },
                { phase: 'PHASE 6', date: 'Q1 2026', title: 'Website Launch', description: 'Official launch of the full-featured AgriLync platform website.', status: 'current' },
                { phase: 'PHASE 7', date: 'Q1 2026', title: 'Agent Training', description: 'Lync Agent lookout and specialized training programs begin.', status: 'upcoming' },
                { phase: 'PHASE 8', date: 'Q2 2026', title: 'Farmer Onboarding', description: 'Starting farmer onboarding and training in elected pilot regions.', status: 'upcoming' },
                { phase: 'PHASE 9', date: 'Future', title: 'More to Come', description: 'Continuing to expand our impact and innovate for the future of agriculture.', status: 'upcoming' }
              ].map((step, index) => (
                <div key={index} className={`md:flex items-center justify-between w-full mb-4 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  <div className="hidden md:block w-5/12"></div>

                  {/* Center Node */}
                  <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-10 h-10 rounded-full border-4 shadow-lg z-10 flex items-center justify-center transition-all duration-300 ${step.status === 'completed' ? 'bg-[#7ede56] border-white' : (step.status === 'current' ? 'bg-white border-[#7ede56]' : 'bg-white border-gray-200')}`}>
                    {step.status === 'completed' && <Check className="w-5 h-5 text-white" />}
                    {step.status === 'current' && <div className="w-3 h-3 bg-[#7ede56] rounded-full animate-pulse"></div>}
                    {step.status === 'upcoming' && <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                  </div>

                  {/* Content Card */}
                  <div className={`w-auto ml-16 md:w-5/12 md:ml-0 p-5 bg-white rounded-xl shadow-md border-0 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center group ${roadmapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}>

                    {/* Phase Label */}
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-[#7ede56]">
                      {step.phase}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_TEAL }}>{step.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 text-xs leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Date Pill at Bottom */}
                    <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold bg-[#7ede56]/10 text-[#002f37]">
                      {step.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Development Section */}
      <section ref={mobileAppRef} className={"py-10 sm:py-16 md:py-20 bg-white transition-all duration-700 ease-in-out " + (mobileAppVisible ? " animate-fade-in-up" : " opacity-0")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <h2 className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (mobileAppVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: BRAND_TEAL }}>
              Mobile App Development
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-4 sm:mb-6 mx-auto"></div>
            <h3 className={"text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-gray-600 transition-all duration-700 ease-in-out " + (mobileAppVisible ? " animate-fade-in-up" : " opacity-0")}>
              Bringing AgriLync to Your Pocket
            </h3>
            <p className={"text-gray-700 leading-relaxed text-sm sm:text-base max-w-4xl mx-auto transition-all duration-700 ease-in-out " + (mobileAppVisible ? " animate-fade-in-up" : " opacity-0")}>
              Our mobile app is currently under development, designed to bring our AI-powered agricultural solutions directly to farmers' smartphones. This represents the next step in our mission to transform African agriculture through accessible, mobile-first technology.
            </p>
          </div>

          {/* Mobile App Mockups */}
          <div className="relative max-w-6xl mx-auto">
            {/* Phone Mockups Container */}
            <div className="flex items-center justify-center">
              <img
                src="/lovable-uploads/ui.jpg"
                alt="AgriLync Mobile App Interface"
                className="w-full max-w-2xl h-auto"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  console.log('Mobile app image failed to load');
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
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

export default About;
