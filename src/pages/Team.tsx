import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowRight } from 'lucide-react';
import {
  leadership,
  coFounders,
  productTeam,
  marketingTeam,
  operationsTeam,
  TeamMember
} from '@/data/teamData';

// Brand colors
const BRAND_TEAL = '#002F37';
const BRAND_MAGENTA = '#921573';

const TeamMemberCard = ({ member, index = 0 }: { member: TeamMember; index?: number }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group animate-fade-in-up flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full h-full border border-transparent hover:border-gray-100"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-6 shadow-sm">
        <div className="w-full h-full" style={{ transform: member.scale ? `scale(${member.scale})` : 'none' }}>
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:grayscale"
            style={{ objectPosition: member.imagePosition || 'center' }}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">${member.initials}</div>`;
            }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-3 w-full">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {member.name}
        </h3>
        <p className="text-[#921573] text-xs font-bold uppercase tracking-wider h-8 flex items-center justify-center">
          {member.role}
        </p>

        <button
          onClick={() => navigate(`/team/${member.id}`)}
          className="mt-2 text-sm font-semibold text-gray-600 hover:text-[#7ede56] transition-colors flex items-center gap-1 group/btn"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

const Team = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [headerRef, headerVisible] = useScrollReveal();
  const [ceoRef, ceoVisible] = useScrollReveal();
  const [foundersRef, foundersVisible] = useScrollReveal();
  const [productRef, productVisible] = useScrollReveal();
  const [marketingRef, marketingVisible] = useScrollReveal();
  const [operationsRef, operationsVisible] = useScrollReveal();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] overflow-x-hidden">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div ref={headerRef} className={`mb-16 sm:mb-24 transition-all duration-700 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Teams</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#002F37] mb-6">
            Meet our team
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full mb-8"></div>

          <p className="text-lg sm:text-x text-gray-500 max-w-2xl leading-relaxed">
            Meet our exceptional team at AgriLync! Comprising diverse talents and expertise, we are a dedicated group committed to delivering excellence in every project.
          </p>
        </div>

        {/* CEO Section - Kept distinct as requested */}
        <div id="leadership" ref={ceoRef} className={`mb-24 transition-all duration-700 ease-out ${ceoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-[320px] mx-auto">
            {/* Using slightly larger scale for CEO card */}
            <TeamMemberCard member={leadership} />
          </div>
        </div>

        {/* Co-Founders Section - Grid of 3 */}
        <div id="founding-team" ref={foundersRef} className={`mb-24 transition-all duration-700 ease-out ${foundersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-10 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#002F37] mb-2">Founding Team</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full"></div>
          </div>
          {/* Strict 3 column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 justify-items-center">
            {coFounders.map((member, index) => (
              <div key={index} className="w-full max-w-[340px]">
                <TeamMemberCard member={member} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Product & Design Section - Grid of 3 */}
        <div id="product-design" ref={productRef} className={`mb-24 transition-all duration-700 ease-out ${productVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-10 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#002F37] mb-2">Product & Design Team</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 justify-items-center">
            {productTeam.map((member, index) => (
              <div key={index} className="w-full max-w-[340px]">
                <TeamMemberCard member={member} index={index + 3} />
              </div>
            ))}
          </div>
        </div>

        {/* Strategy & Marketing Section - Grid of 3 */}
        <div id="marketing" ref={marketingRef} className={`mb-24 transition-all duration-700 ease-out ${marketingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-10 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#002F37] mb-2">Strategy & Marketing Team</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 justify-items-center">
            {marketingTeam.map((member, index) => (
              <div key={index} className="w-full max-w-[340px]">
                <TeamMemberCard member={member} index={index + 6} />
              </div>
            ))}
          </div>
        </div>

        {/* Operations Section - Grid of 3 */}
        <div id="operations" ref={operationsRef} className={`mb-12 transition-all duration-700 ease-out ${operationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-10 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#002F37] mb-2">Community & Operations</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#921573] to-[#7ede56] rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 justify-items-center">
            {operationsTeam.map((member, index) => (
              <div key={index} className="w-full max-w-[340px]">
                <TeamMemberCard member={member} index={index + 9} />
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />

      {
        showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-50 bg-gray-900 hover:bg-gray-800 text-white rounded-full p-3 shadow-lg transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        )
      }
    </div >
  );
};

export default Team;
