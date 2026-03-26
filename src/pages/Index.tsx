import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Users, TrendingUp, MapPin, Calendar, Shield, Award, Play, MessageCircle, X, ArrowUp, Quote, ArrowRight, Bot, ChevronDown, ChevronUp, Check, Salad, Globe, Sun } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const Index = () => {
  const navigate = useNavigate();



  // Hero's Journey Image Index
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroImages = [
    {
      src: "/lovable-uploads/success_story_2.jpg",
      name: "Sarah Mensah",
      age: "32yrs",
      location: "Volta Region",
      position: "center 20%"
    },
    {
      src: "/lovable-uploads/success_story_1.jpg",
      name: "Gabienu Emmanuel",
      age: "45yrs",
      location: "Ashanti Region, Ejura",
      position: "center 15%"
    },
    {
      src: "/lovable-uploads/image%20copy%2013.png",
      name: "Elizabeth",
      age: "41yrs",
      location: "Western Region",
      position: "center 20%"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Cycle every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Scroll-triggered animation hooks (must be at the top level)
  const [feature1Ref, feature1Visible] = useScrollReveal();
  const [feature2Ref, feature2Visible] = useScrollReveal();
  const [feature3Ref, feature3Visible] = useScrollReveal();
  // Headings
  const [heroHeadingRef, heroHeadingVisible] = useScrollReveal();

  const [whoWeAreRef, whoWeAreVisible] = useScrollReveal();
  const [farmersCryingRef, farmersCryingVisible] = useScrollReveal();
  const [successStoriesRef, successStoriesVisible] = useScrollReveal();
  const [faqRef, faqVisible] = useScrollReveal();
  // Services ref will be handled manually





  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does AgriLync Nexus ensure the safety of my investment?",
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
      question: "Is AgriLync Nexus available to small-scale farmers?",
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
      <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-[#7ede56]">
        <div className="relative">
          <img
            src="/Frame 74.png"
            alt="Logo"
            className="w-32 h-32 md:w-48 md:h-48 animate-spin-slow relative z-10"
          />
          {/* Soft glow behind logo */}
          <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full scale-150 animate-pulse opacity-50"></div>
        </div>

        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow { animation: spin-slow 3s linear infinite; }
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



      {/* HERO SECTION - Akofresh Inspired Redesign */}
      <section className="relative h-[85vh] min-h-[600px] md:h-[80vh] overflow-hidden bg-black flex flex-col justify-end pb-12 md:flex-row md:items-start md:justify-start md:pb-0 md:pt-48">
        {/* Background Video / Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Mobile Background Image */}
          <img 
            src="/lovable-uploads/image copy 6.png" 
            alt="Hero background" 
            className="absolute inset-0 w-full h-full object-cover md:hidden opacity-60"
          />
          {/* Desktop Background Video */}
          <div className="hidden md:block absolute inset-0">
            <iframe
              className="absolute top-1/2 left-1/2 min-w-full min-h-full w-[177.77777778vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2 opacity-60 object-cover"
              src="https://www.youtube.com/embed/4dWxFwrLZQs?autoplay=1&mute=1&controls=0&loop=1&playlist=4dWxFwrLZQs&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0"
              allow="autoplay; encrypted-media"
              frameBorder="0"
            ></iframe>
          </div>
          {/* Main Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
          {/* Subtle Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10"></div>
        </div>

        <div className="relative z-20 w-full px-8 sm:px-12 lg:px-24 xl:px-32">
          <div className="max-w-4xl text-left">
            {/* Main Heading with refined spacing and alignment */}
            <h1 className="text-[28px] md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-10 leading-[1.1] md:leading-[1.05] font-montserrat tracking-tight animate-fade-in-up">
              Unlocking Difficult Access to <span className="font-playfair italic text-[#FFD700] inline-block">Farm Investment</span> and <span className="font-playfair italic text-[#FFD700] inline-block">Timely Information</span> Through <span className="font-playfair italic text-[#FFD700] inline-block">AI</span>
            </h1>

            {/* Subheadline - Hidden on mobile, visible on desktop */}
            <p className="hidden md:block text-base md:text-lg text-white/80 mb-12 leading-relaxed max-w-xl font-sans animate-fade-in-up delay-200">
              Empowering <span className="text-[#7ede56] font-bold">smallholder farmers</span> and investors through trusted <span className="text-[#7ede56] font-bold">farm finance</span> and smart advisory.
            </p>

            {/* CTA Buttons - Compact on mobile, prominent on desktop */}
            <div className="flex flex-row flex-wrap items-center sm:items-start justify-start gap-3 md:gap-6 animate-fade-in-up delay-400">
              <a href="https://agrilync.netlify.app/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button className="bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] px-6 py-4 md:px-10 md:py-7 text-sm md:text-lg font-bold font-montserrat rounded-full shadow-[0_15px_30px_-10px_rgba(126,222,86,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Join Waitlist
                </Button>
              </a>

              <Link to="/signup" className="shrink-0">
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white hover:text-[#002f37] bg-white/5 backdrop-blur-md px-6 py-4 md:px-10 md:py-7 text-sm md:text-lg font-bold font-montserrat rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator (Akofresh-like) - Hidden on mobile */}
        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce z-20 opacity-70">
          <div className="w-px h-8 bg-gradient-to-t from-white to-transparent"></div>
          <p className="text-white text-[8px] uppercase tracking-[0.2em] font-montserrat">Scroll</p>
        </div>
      </section>

      {/* Partners Banner - Compact */}
      <section className="bg-white py-8 md:py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="flex flex-row items-center justify-center gap-12 md:gap-32">
            {/* First Partner: Eyramax */}
            <div className="flex flex-col items-center gap-3 translate-y-[-2px]">
              <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Agribusiness media</p>
              <img 
                src="/lovable-uploads/exramax.png" 
                alt="Eyramax" 
                className="h-10 md:h-16 w-auto object-contain grayscale opacity-60 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
              />
            </div>
            
            {/* Second Partner: United Way Ghana */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Youth Empowerment Program</p>
              <img 
                src="/lovable-uploads/unitedway.png" 
                alt="United Way Ghana" 
                className="h-10 md:h-16 w-auto object-contain grayscale opacity-60 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* THE HERO'S JOURNEY - Redesigned Stats Section with Premium Spacing */}
      <section className="bg-[#002f37] py-32 md:py-40 text-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
          {/* Header Row - Constrained for readability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 mb-20">
            <div className="animate-fade-in-right">
              <h2 className="text-4xl md:text-6xl font-bold font-montserrat leading-[0.9] text-[#7ede56] mb-6 md:mb-0">
                The <span className="italic">Hero's</span> <br /> Journey
              </h2>
            </div>
            <div className="animate-fade-in-left max-w-xl">
              <p className="text-gray-300 font-sans text-base md:text-lg leading-relaxed mb-6">
                Sarah spent <strong className="text-white">months growing her vegetables</strong>. But once they're picked, the real race begins. Without a way to connect with the right <strong className="text-white">investors and buyers</strong>, even her best harvest can go to waste before it reaches the market.
              </p>
              <p className="text-gray-300 font-sans text-base md:text-lg leading-relaxed">
                It's the same for <strong className="text-white">farmers like Emmanuel</strong>. His hard work is valuable at harvest, but without <strong className="text-white">timely data and field support</strong>, his crops lose quality or fail to reach their full economic potential.
              </p>
            </div>
          </div>

          {/* Main Cinematic Image Container - 3D Book Flip Animation */}
          <div className="relative mb-12 perspective-3000 overflow-visible group cursor-crosshair">
            <div className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] h-[350px] md:h-[500px] transform-style-3d hover-slow-zoom">
              {heroImages.map((img, idx) => {
                const isActive = idx === currentHeroImage;
                return (
                  <div 
                    key={idx}
                    className={`absolute inset-0 backface-hidden transition-all duration-[2500ms] ${
                      isActive 
                        ? 'animate-page-rotate z-10' 
                        : 'opacity-0 z-0'
                    }`}
                  >
                    <img 
                      src={img.src} 
                      alt={img.name} 
                      className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out"
                      style={{ objectPosition: img.position || 'center 15%' }}
                    />
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <div className={`absolute bottom-10 left-10 md:bottom-16 md:left-16 transition-all duration-700 delay-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <h3 className="text-xl md:text-2xl font-semibold font-montserrat text-white mb-2">Meet {img.name}, {img.age}</h3>
                      <p className="text-sm md:text-base font-sans text-[#7ede56] font-medium tracking-wide">{img.location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress indicators for the images */}
            <div className="absolute bottom-6 right-10 flex gap-2 z-20">
              {heroImages.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 ${idx === currentHeroImage ? 'w-8 bg-[#7ede56]' : 'w-2 bg-white/30'}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Large Stats Row - Inspired by reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 border-t border-white/10 pt-20">
            {/* Stat 1: Produce Managed */}
            <div className="flex items-start gap-6 md:gap-8 group">
              <div className="flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                <Salad className="w-12 h-12 md:w-16 md:h-16 text-[#FFD700] stroke-[1px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl md:text-5xl font-black text-[#7ede56] font-montserrat tracking-tight leading-none">500</span>
                  <span className="text-lg md:text-2xl font-bold text-[#7ede56] font-montserrat leading-none">Pilot Farmers</span>
                </div>
                <p className="text-gray-300 font-sans text-sm md:text-base leading-tight max-w-sm">
                  across 7 target regions in Ghana: Western, Eastern, Volta, Ashanti, Central, Northern, and Bono.
                </p>
              </div>
            </div>

            {/* Stat 2: Income Growth */}
            <div className="flex items-start gap-6 md:gap-8 group">
              <div className="flex-shrink-0 relative transition-transform duration-500 group-hover:scale-110">
                <Globe className="w-12 h-12 md:w-16 md:h-16 text-[#FFD700] stroke-[1px]" />
                <Sun className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700] absolute -top-1 -right-1 stroke-[1.5px] animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl md:text-5xl font-black text-[#7ede56] font-montserrat tracking-tight leading-none">15%+</span>
                  <span className="text-lg md:text-2xl font-bold text-[#7ede56] font-montserrat leading-none">Growth</span>
                </div>
                <p className="text-gray-300 font-sans text-sm md:text-base leading-tight max-w-sm">
                  average increase in annual income for farmers connected to our investment ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR INNOVATION SECTION - Premium Spacing & Constraints */}
      <section className="py-32 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <div className="animate-fade-in-right">
              <h2 className="text-5xl md:text-7xl font-montserrat tracking-tight leading-[0.85] mb-8 md:mb-0">
                <span className="text-[#002f37] font-bold">Our</span> <br />
                <span className="text-[#002f37] font-playfair italic">Innovation</span>
              </h2>
            </div>

            <div className="animate-fade-in-left space-y-8 max-w-xl">
              <p className="text-gray-800 font-sans text-lg md:text-xl leading-relaxed">
                Agrilync Nexus provides a finance-first, training-led platform that connects smallholder farmers and investors/partners, supported by AI advisory and local agent operations.
              </p>
              <p className="text-gray-800 font-sans text-lg md:text-xl leading-relaxed">
                By empowering farmers, investors, and field agents with reliable information and capital, we turn agricultural gaps into stable income and de-risked investments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Farmers Are Crying Section - Redesigned with Breathing Room */}
      <section className="py-24 md:py-32" style={{ backgroundColor: '#002f37' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
            {/* Left Column - Title */}
            <div className="animate-fade-in-right transition-all duration-700 ease-in-out">
              <div className="flex items-center mb-6">
                <div className="w-2.5 h-2.5" style={{ backgroundColor: '#7ede56' }}></div>
                <span className="text-gray-300 text-sm uppercase tracking-[0.2em] ml-4">THE CHALLENGE</span>
              </div>
              <h2 ref={farmersCryingRef} className={"text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight transition-all duration-700 ease-in-out " + (farmersCryingVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: 'white' }}>
                The Challenge
              </h2>
            </div>

            {/* Right Column - Content */}
            <div className="animate-fade-in-left transition-all duration-700 ease-in-out max-w-xl">
              <p className="text-gray-300 leading-relaxed text-lg md:text-xl">
                Farmers are not crying without reason. They need timely access to the right information to boost productivity, ready markets immediately after harvest to reduce post-harvest losses, and most importantly, flexible financing and investor partnerships to scale and improve yield.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section - Premium Editorial Redesign with Spacing */}
      <section id="core-services" className="py-32 md:py-40 bg-[#FDFCFB] relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#7ede56]/5 pointer-events-none -skew-x-12 transform translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-3xl">
              <span className="text-[#002f37]/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-6 block">Our Expertise</span>
              <h2 className="text-4xl md:text-7xl font-bold text-[#002f37] font-playfair italic leading-[1.1]">
                Everything you need to <br className="hidden md:block" />
                <span className="text-[#7ede56] font-sans not-italic">succeed with us</span>
              </h2>
            </div>
            <div className="hidden lg:block max-w-[280px] transition-opacity duration-300">
              <p className="text-[#002f37]/70 text-base leading-relaxed border-l-2 border-[#7ede56] pl-8 py-3">
                We combine deep-rooted farming tradition with the world's most advanced intelligence to empower the hands that feed the nation.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* Service 01 - Large Featured Card */}
            <div 
              ref={feature1Ref}
              className={`md:col-span-7 group relative h-[500px] md:h-[650px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,47,55,0.15)] bg-[#002f37] transition-all duration-1000 opacity-0 translate-y-12 ${feature1Visible ? 'opacity-100 translate-y-0' : ''}`}
            >
              <img 
                src="/lovable-uploads/image%20copy%2012.png" 
                alt="FarmPartner Initiative" 
                className="w-full h-full object-cover opacity-80 transition-transform duration-[2000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] via-transparent to-transparent z-10"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                <div className="mb-4 inline-block px-4 py-1 bg-[#7ede56] text-[#002f37] text-[10px] font-bold uppercase tracking-widest">Core Product</div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-playfair italic">FarmPartner Initiative</h3>
                <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-700 ease-in-out">
                  <p className="text-white/80 text-base md:text-lg max-w-lg mb-8">
                    Structured farm investment products where investors and partner organizations fund verified Lync Growers while receiving continuous visibility.
                  </p>
                </div>
                <button 
                  onClick={() => handleFeatureClick('/signup')}
                  className="flex items-center text-[#7ede56] font-bold text-xs uppercase tracking-[0.2em] group/btn"
                >
                  Join the Initiative
                  <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                </button>
              </div>
            </div>

            {/* Service 02 & 03 Column */}
            <div className="md:col-span-5 flex flex-col gap-10 md:gap-12">
              {/* Service 02 */}
              <div 
                ref={feature2Ref}
                className={`flex-1 group relative h-[400px] md:h-auto overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,47,55,0.12)] bg-[#002f37] transition-all duration-1000 delay-200 opacity-0 translate-y-12 ${feature2Visible ? 'opacity-100 translate-y-0' : ''}`}
              >
                <img 
                  src="/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png" 
                  alt="AI Advisory Agent" 
                  className="w-full h-full object-cover opacity-70 transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] to-transparent z-10"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-4 font-playfair italic">AI Advisory Agent</h3>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-700">
                    <p className="text-white/70 text-sm mb-6">
                      AI-powered crop and livestock advisory aligned with each farm project's plan, guidance on best practices, and risk mitigation.
                    </p>
                  </div>
                  <button className="text-white/60 hover:text-[#7ede56] font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">
                    Get Advisory
                  </button>
                </div>
              </div>

              {/* Service 03 */}
              <div 
                ref={feature3Ref}
                className={`flex-1 group relative h-[400px] md:h-auto overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,47,55,0.12)] bg-[#002f37] transition-all duration-1000 delay-400 opacity-0 translate-y-12 ${feature3Visible ? 'opacity-100 translate-y-0' : ''}`}
              >
                <img 
                  src="/lovable-uploads/image%20copy%2011.png" 
                  alt="Lync Agent" 
                  className="w-full h-full object-cover opacity-70 transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] to-transparent z-10"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-4 font-playfair italic">Lync Agents</h3>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-700">
                    <p className="text-white/70 text-sm mb-6">
                      Lync Agents onboard farmers, collect baseline data, and provide regular visits to ensure ground truth and accountability for Lync Growers and investors.
                    </p>
                  </div>
                  <button className="text-white/60 hover:text-[#7ede56] font-bold text-[10px] uppercase tracking-[0.2em] transition-colors" onClick={() => navigate('/signup')}>
                    Become a Lync Agent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Scroll to Top Button - Mobile Optimized */}
      {
        showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-white p-4 rounded-full shadow-2xl hover:shadow-[#7ede56]/50 transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        )
      }

      {/* Success Stories Section - Premium Padding */}
      <section className="py-32 md:py-40" style={{ backgroundColor: '#002f37' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="text-center mb-24 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={successStoriesRef} className={"text-5xl md:text-7xl font-bold text-white mb-8 transition-all duration-700 ease-in-out " + (successStoriesVisible ? " animate-fade-in-up" : " opacity-0")}>
              Success Stories
            </h2>
            <div className="w-48 h-[1px] bg-[#7ede56] mb-10 mx-auto opacity-70"></div>
            <p className="text-white text-xl md:text-2xl font-playfair italic max-w-2xl mx-auto">
              What Our Clients Say About Us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                name: "Gabienu Emmanuel",
                role: "Vegetable Farmer",
                location: "Ashanti Region, Ejura",
                image: "/lovable-uploads/success_story_1.jpg",
                feedback: "Finding investors for my vegetable farm was always a struggle until I became a Lync Grower. Within weeks, I secured funding to expand my operations."
              },
              {
                name: "Sarah Mensah",
                role: "Vegetable Farmer",
                location: "Volta Region",
                image: "/lovable-uploads/success_story_2.jpg",
                feedback: "Agrilync Nexus changed the game for me. I no longer worry about my vegetables going to waste; the AI insights and investor matches as a Lync Grower have given my farm a new lease on life."
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

      {/* FAQ Section - Clean & Spaced */}
      <section className="py-32 md:py-40 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up transition-all duration-700 ease-in-out">
            <h2 ref={faqRef} className={"text-3xl md:text-5xl font-bold mb-6 transition-all duration-700 ease-in-out " + (faqVisible ? " animate-fade-in-up" : " opacity-0")} style={{ color: '#002f37' }}>
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-[#7ede56] mb-10 mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-sans">
              Everything you need to know about investing and growing with AgriLync Nexus.
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
