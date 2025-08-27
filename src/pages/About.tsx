
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Users, TrendingUp, Award, Shield, Target, Heart, Lightbulb, Handshake, Eye, Building2, ArrowUp } from 'lucide-react';
import { Button } from '../components/ui/button'; // Added Button import

// Brand colors
const BRAND_MAGENTA = '#921573';
const BRAND_GREEN = '#7ede56';
const BRAND_TEAL = '#002F37';
const BRAND_WHITE = '#FFFFFF';

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
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Professional Background Image */}
      <section className="relative h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] flex flex-col items-center justify-center overflow-hidden p-0 m-0">
        {/* Hero Image */}
        <img
          src="/lovable-uploads/ab.jpg"
          alt="Who We Are Hero Background"
          className="w-full h-full object-cover absolute inset-0 z-0"
          loading="eager"
          fetchPriority="high"
          style={{ objectPosition: 'center 60%', objectFit: 'cover' }}
          onError={(e) => {
            console.log('Image failed to load, trying fallback');
            const target = e.target as HTMLImageElement;
            target.src = '/lovable-uploads/image.png'; // Fallback to homepage image
          }}
        />
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50 z-10"></div>
        
        {/* Navbar overlayed above image */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <Navbar variant="transparent" />
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-end h-full pb-8 sm:pb-12 md:pb-16">
          <div className="animate-fade-in-up w-full max-w-4xl mx-auto">
            <h1 ref={heroHeadingRef} className={"text-lg sm:text-xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-2xl transition-all duration-700 ease-in-out leading-tight px-2 " + (heroHeadingVisible ? " animate-fade-in-up" : " opacity-0") } style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Who We Are
            </h1>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 ref={whoWeAreRef} className={"text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 transition-all duration-700 ease-in-out " + (whoWeAreVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
              Who We Are
              </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-4 sm:mb-6"></div>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
              AgriLync is a revolutionary agricultural technology platform that connects farmers, investors, and agricultural experts in a seamless ecosystem. We bridge the gap between traditional farming practices and modern agricultural innovation, empowering farmers with the resources, knowledge, and financial support they need to thrive in today's competitive agricultural landscape.
            </p>
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
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-16 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={valuesRef} className={"text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (valuesVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
              Core Values
            </h2>
            <div className="w-16 h-0.5 bg-purple-600 mb-2 sm:mb-3 mx-auto"></div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
              The principles that guide our mission to transform African agriculture through technology and innovation.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div ref={value1Ref} className={"transition-all duration-700 ease-in-out transform " + (value1Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Inclusivity</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Ensuring our solutions are accessible to all farmers, regardless of their background or resources.
              </p>
            </div>

            <div ref={value2Ref} className={"transition-all duration-700 ease-in-out transform " + (value2Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Collaboration</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Working together with farmers, partners, and stakeholders to achieve shared agricultural goals.
              </p>
            </div>

            <div ref={value3Ref} className={"transition-all duration-700 ease-in-out transform " + (value3Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Innovation</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Continuously developing cutting-edge technologies and solutions for modern farming challenges.
              </p>
            </div>

            <div ref={value4Ref} className={"transition-all duration-700 ease-in-out transform " + (value4Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Empowerment</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Equipping farmers with the knowledge, tools, and resources they need to succeed and grow.
              </p>
            </div>

            <div ref={value5Ref} className={"transition-all duration-700 ease-in-out transform " + (value5Visible ? " animate-slide-in-left opacity-100" : " opacity-0 translate-x-8")}>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND_MAGENTA }}>Transparency</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Maintaining open, honest communication and clear processes in all our partnerships and operations.
              </p>
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
              <h2 ref={whoWeServeRef} className={"text-3xl sm:text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ease-in-out " + (whoWeServeVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: BRAND_TEAL }}>
                Who We Serve
            </h2>
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
            <h2 ref={howWeDoItRef} className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-700 ease-in-out " + (howWeDoItVisible ? " animate-fade-in-up" : " opacity-0") } style={{ color: 'white' }}>
              how we do it
            </h2>
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
            <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2" style={{ backgroundColor: BRAND_TEAL }}></div>
                <span className="text-gray-500 text-sm uppercase tracking-wider ml-3">WHO WE ARE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND_TEAL }}>
                why<br />Choose us
              </h2>
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
