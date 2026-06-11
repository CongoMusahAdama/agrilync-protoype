import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// ── Section Components ─────────────────────────────────────────────────────────
import { HeroSection } from '@/components/home/HeroSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { ImpactSection } from '@/components/home/ImpactSection';
import { InvestmentPackagesSection } from '@/components/home/InvestmentPackagesSection';
import { SuccessStoriesSection } from '@/components/home/SuccessStoriesSection';
import { TeamSection } from '@/components/home/TeamSection';
import { FAQSection } from '@/components/home/FAQSection';

// ── Module-level static data (allocated once, not per-render) ──────────────────
const heroImages = [
  { src: "/lovable-uploads/image%20copy%2020.png", name: "Sarah Mensah", age: "42yrs", location: "Volta Region", position: "center 5%" },
  { src: "/lovable-uploads/signup2.jpg", name: "Gabienu Emmanuel", age: "30yrs", location: "Ashanti Region, Ejura", position: "center 10%" },
  { src: "/lovable-uploads/gallery16.jpg", name: "Elizabeth", age: "53yrs", location: "Bono Region, Dormaa Ahenkro", position: "center bottom" }
];

const Index = () => {
  const navigate = useNavigate();
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll-triggered animation refs used in inline sections below
  const [innovationRef, innovationVisible] = useScrollReveal();
  const [farmersCryingRef, farmersCryingVisible] = useScrollReveal();
  const [expertiseRef, expertiseVisible] = useScrollReveal();
  const [feature1Ref, feature1Visible] = useScrollReveal();
  const [feature2Ref, feature2Visible] = useScrollReveal();
  const [feature3Ref, feature3Visible] = useScrollReveal();

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Mobile splash screen
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setShowSplash(true);
      const timeout = setTimeout(() => setShowSplash(false), 3000);
      const failsafe = setTimeout(() => setShowSplash(false), 3500);
      return () => { clearTimeout(timeout); clearTimeout(failsafe); };
    }
  }, []);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (showSplash) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-white">
        <div className="relative flex flex-col items-center">
          <img
            src="/Frame 74.png"
            alt="AgriLync Nexus"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain relative z-10 animate-splash-logo"
          />
        </div>
        <style>{`
          @keyframes splash-logo {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-splash-logo { animation: splash-logo 0.6s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── 1. HERO ── */}
      <HeroSection />

      {/* ── 2. PARTNERS ── */}
      <PartnersSection />

      {/* ── 3. IMPACT STATS + CINEMATIC IMAGES ── */}
      <ImpactSection heroImages={heroImages} currentHeroImage={currentHeroImage} />

      {/* ── 4. OUR INNOVATION ── */}
      <section className="py-32 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <div ref={innovationRef} className={`transition-all duration-700 ease-out ${innovationVisible ? 'animate-fade-in-right opacity-100' : 'opacity-0 -translate-x-12'}`}>
              <h2 className="text-5xl md:text-7xl font-montserrat tracking-tight leading-[0.85] mb-8 md:mb-0">
                <span className="text-[#002f37] font-bold">Our</span> <br />
                <span className="text-[#002f37] font-montserrat italic">Innovation</span>
              </h2>
            </div>
            <div className={`space-y-8 max-w-xl transition-all duration-700 delay-200 ease-out ${innovationVisible ? 'animate-fade-in-left opacity-100' : 'opacity-0 translate-x-12'}`}>
              <p className="text-gray-800 font-sans text-lg md:text-xl leading-relaxed">Agrilync Nexus provides a finance-first, training-led platform that connects smallholder farmers and investors/partners, supported by AI advisory and local agent operations.</p>
              <p className="text-gray-800 font-sans text-lg md:text-xl leading-relaxed">By empowering farmers, investors, and field agents with reliable information and capital, we turn agricultural gaps into stable income and de-risked investments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. THE CHALLENGE ── */}
      <section className="py-24 md:py-32" style={{ backgroundColor: '#002f37' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-start">
            <div ref={farmersCryingRef} className={`transition-all duration-700 ease-out ${farmersCryingVisible ? 'animate-fade-in-right opacity-100' : 'opacity-0 -translate-x-12'}`}>
              <div className="flex items-center mb-6">
                <div className="w-2.5 h-2.5" style={{ backgroundColor: '#7ede56' }}></div>
                <span className="text-gray-300 text-sm uppercase tracking-[0.2em] ml-4">THE CHALLENGE</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight text-white">The Challenge</h2>
            </div>
            <div className={`max-w-xl transition-all duration-700 delay-200 ease-out ${farmersCryingVisible ? 'animate-fade-in-left opacity-100' : 'opacity-0 translate-x-12'}`}>
              <p className="text-gray-300 leading-relaxed text-lg md:text-xl">Farmers are not crying without reason. They need timely access to the right information to boost productivity, ready markets immediately after harvest to reduce post-harvest losses, and most importantly, flexible financing and investor partnerships to scale and improve yield.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CORE SERVICES ── */}
      <section id="core-services" className="py-32 md:py-40 bg-[#FDFCFB] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#7ede56]/5 pointer-events-none -skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
          <div ref={expertiseRef} className={`flex flex-col md:flex-row justify-between items-end mb-24 gap-12 transition-all duration-700 ease-out ${expertiseVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-12'}`}>
            <div className="max-w-3xl">
              <span className="text-[#002f37]/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-6 block">Our Expertise</span>
              <h2 className="text-4xl md:text-7xl font-bold text-[#002f37] font-montserrat italic leading-[1.1]">Everything you need to <br className="hidden md:block" /><span className="text-[#7ede56] font-montserrat not-italic">succeed with us</span></h2>
            </div>
            <div className="hidden lg:block max-w-[280px]">
              <p className="text-[#002f37]/70 text-base leading-relaxed border-l-2 border-[#7ede56] pl-8 py-3">We combine deep-rooted farming tradition with the world's most advanced intelligence to empower the hands that feed the nation.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* Service 01 */}
            <div ref={feature1Ref} className={`md:col-span-7 group relative h-[500px] md:h-[650px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,47,55,0.15)] bg-[#002f37] transition-all duration-1000 opacity-0 translate-y-12 ${feature1Visible ? 'opacity-100 translate-y-0' : ''}`}>
              <img src="/lovable-uploads/image%20copy%2012.png" alt="FarmPartner Initiative" loading="lazy" className="w-full h-full object-cover opacity-80 transition-transform duration-[2000ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] via-transparent to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                <div className="mb-4 inline-block px-4 py-1 bg-[#7ede56] text-[#002f37] text-[10px] font-bold uppercase tracking-widest">Core Product</div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-montserrat italic">FarmPartner Initiative</h3>
                <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-700 ease-in-out">
                  <p className="text-white/80 text-base md:text-lg max-w-lg mb-8">Structured farm investment products where investors and partner organizations fund verified Lync Growers while receiving continuous visibility.</p>
                </div>
                <button onClick={() => document.getElementById('investment-packages')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center text-[#7ede56] font-bold text-xs uppercase tracking-[0.2em] group/btn">
                  Browse Packages <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                </button>
              </div>
            </div>
            {/* Service 02 & 03 */}
            <div className="md:col-span-5 flex flex-col gap-10 md:gap-12">
              <div ref={feature2Ref} className={`flex-1 group relative h-[400px] md:h-auto overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,47,55,0.12)] bg-[#002f37] transition-all duration-1000 delay-200 opacity-0 translate-y-12 ${feature2Visible ? 'opacity-100 translate-y-0' : ''}`}>
                <img src="/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png" alt="AI Advisory Agent" loading="lazy" className="w-full h-full object-cover opacity-70 transition-transform duration-[2000ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-4 font-montserrat italic">AI Advisory Agent</h3>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-700">
                    <p className="text-white/70 text-sm mb-6">AI-powered crop and livestock advisory aligned with each farm project's plan, guidance on best practices, and risk mitigation.</p>
                  </div>
                  <button className="text-white/60 hover:text-[#7ede56] font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">Get Advisory</button>
                </div>
              </div>
              <div ref={feature3Ref} className={`flex-1 group relative h-[400px] md:h-auto overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,47,55,0.12)] bg-[#002f37] transition-all duration-1000 delay-400 opacity-0 translate-y-12 ${feature3Visible ? 'opacity-100 translate-y-0' : ''}`}>
                <img src="/lovable-uploads/image%20copy%2011.png" alt="Lync Agent" loading="lazy" className="w-full h-full object-cover opacity-70 transition-transform duration-[2000ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002f37] to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-4 font-montserrat italic">Lync Agents</h3>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-700">
                    <p className="text-white/70 text-sm mb-6">Lync Agents onboard farmers, collect baseline data, and provide regular visits to ensure ground truth and accountability for Lync Growers and investors.</p>
                  </div>
                  <button className="text-white/60 hover:text-[#7ede56] font-bold text-[10px] uppercase tracking-[0.2em] transition-colors" onClick={() => navigate('/signup')}>Become a Lync Agent</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. INVESTMENT PACKAGES ── */}
      <InvestmentPackagesSection />

      {/* ── 8. SUCCESS STORIES ── */}
      <SuccessStoriesSection />

      {/* ── 9. TEAM ── */}
      <TeamSection />


      {/* ── 10. FAQ ── */}
      <FAQSection />

      {/* Scroll to Top */}
      {showScrollTop && (
        <Button onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#7ede56] to-[#66cc44] hover:from-[#66cc44] hover:to-[#7ede56] text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110" aria-label="Scroll to top">
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}

      <Footer />
    </div>
  );
};

export default Index;
