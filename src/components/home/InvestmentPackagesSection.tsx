import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sprout, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { whatsappMeUrl } from '@/lib/communityLinks';

const investmentPackages = [
  {
    name: 'Starter',
    farmers: '3–5 farmers',
    bestFor: 'NGOs, CSR programs, small impact funds',
    term: 'Single season',
    return: 'Revenue-share of 15–20% of net harvest value',
    icon: <Sprout className="w-12 h-12 text-[#002f37]" />,
    description: 'Test the model with a few farmers.',
    isHighlighted: false,
  },
  {
    name: 'Growth',
    farmers: '10–20 farmers',
    bestFor: 'MFIs, banks, mid-size impact funds',
    term: 'Single or dual season',
    return: 'Revenue-share of 18–25% of net harvest value, plus impact-linked incentives',
    icon: <TrendingUp className="w-12 h-12 text-[#7ede56]" />,
    description: 'A larger, more managed farm portfolio.',
    isHighlighted: true,
    label: 'Most Popular'
  },
  {
    name: 'Portfolio',
    farmers: '40–100+ farmers',
    bestFor: 'Large funds, DFIs, corporates',
    term: 'Multi-season or rolling',
    return: 'Blended model: revenue-share plus negotiated impact incentives',
    icon: <Award className="w-12 h-12 text-[#FFD700]" />,
    description: 'For institutional partners wanting scale & broader impact.',
    isHighlighted: false,
    label: 'Institutional'
  }
];

export const InvestmentPackagesSection: React.FC = () => {
  const [activePackageTab, setActivePackageTab] = useState(1);
  const [mobileInfoVisible, setMobileInfoVisible] = useState(false);
  const [packagesRef, packagesVisible] = useScrollReveal();

  return (
    <section id="investment-packages" className="py-24 md:py-32 bg-gray-50 relative border-t border-gray-100">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">

        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="text-[#7ede56] font-bold text-xs uppercase tracking-[0.3em] mb-4 block">FarmPartner Initiative</span>
          <h2 className="text-4xl md:text-6xl font-bold font-montserrat text-[#002f37] leading-tight">
            Partnership <span className="italic">Tiers</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Choose the structure that fits your capacity, from pilot programs to institutional-scale portfolios.
          </p>
        </div>

        {/* Initiative Intro Banner */}
        <div
          ref={packagesRef}
          onClick={() => setMobileInfoVisible(!mobileInfoVisible)}
          className={`group mb-12 md:mb-20 min-h-[350px] md:min-h-[500px] overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-out flex items-center cursor-pointer ${packagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <img src="/lovable-uploads/investment.png" alt="FarmPartner Initiative" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className={`absolute inset-0 bg-[#002f37]/85 md:hidden transition-opacity duration-500 ${mobileInfoVisible ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="hidden md:block absolute inset-y-0 left-0 w-full md:w-[65%] bg-gradient-to-r from-[#002f37] via-[#002f37]/80 to-transparent"></div>
          <div className={`relative z-10 p-6 md:p-16 lg:px-20 lg:py-16 w-full min-h-[350px] md:min-h-[500px] flex flex-col justify-center transition-all duration-500 ${mobileInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:opacity-100 md:translate-y-0'}`}>
            <div className="lg:w-[60%] text-left space-y-4 md:space-y-6">
              <p className="text-white font-bold text-base md:text-2xl leading-snug md:leading-relaxed font-montserrat drop-shadow-lg">
                The Agrilync Nexus FarmPartner Initiative connects verified smallholder farmers with partners who want to fund real farm production in a structured, transparent way.
              </p>
              <p className="text-white/90 font-medium text-xs md:text-lg leading-relaxed font-sans drop-shadow-md">
                We manage farmer verification, training, field monitoring, AI advisory, milestone-based disbursement, and harvest reporting so partners can invest with absolute clarity and control.
              </p>
              <h2 className="text-[#a8ff85] font-bold text-[10px] md:text-sm uppercase tracking-widest leading-normal drop-shadow-md font-montserrat">
                Connecting verified smallholder farmers with partners to fund real farm production.
              </h2>
            </div>
          </div>
          {!mobileInfoVisible && (
            <div className="md:hidden absolute bottom-0 left-0 w-full z-20">
              <div className="bg-[#002f37] py-3 text-center">
                <p className="text-[10px] text-white font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  Tap to explore initiative <ArrowRight className="w-3 h-3 text-[#a8ff85]" />
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex bg-gray-100 p-1 rounded-xl mb-8">
          {investmentPackages.map((pkg, idx) => (
            <button key={idx} onClick={() => setActivePackageTab(idx)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activePackageTab === idx ? 'bg-[#002f37] text-white shadow-md' : 'text-gray-500 hover:text-[#002f37]'}`}>
              {pkg.name}
            </button>
          ))}
        </div>

        {/* Package Cards */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 mb-24 transition-all duration-1000 delay-200 ease-out ${packagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          {investmentPackages.map((pkg, idx) => {
            const isMiddle = pkg.name === 'Growth';
            return (
              <div
                key={idx}
                className={`group relative flex flex-col p-8 md:p-10 rounded-2xl transition-all duration-700 border border-[#002f37] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] ${idx !== activePackageTab ? 'hidden md:flex' : 'flex'} ${isMiddle ? 'bg-white text-[#002f37] hover:bg-[#002f37] hover:text-white' : 'bg-[#002f37] text-white hover:bg-white hover:text-[#002f37]'} ${pkg.isHighlighted ? `z-20 lg:-translate-y-4` : `z-10`}`}
                style={{ transitionDelay: `${200 + idx * 150}ms` }}
              >
                {pkg.label && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap ${isMiddle ? 'bg-[#002f37] text-white group-hover:bg-[#7ede56] group-hover:text-[#002f37]' : 'bg-[#7ede56] text-[#002f37] group-hover:bg-[#002f37] group-hover:text-white'}`}>
                    {pkg.label}
                  </div>
                )}
                <div className="mb-6 flex justify-between items-center">
                  <h3 className={`text-2xl md:text-3xl font-bold font-montserrat transition-colors duration-300 ${isMiddle ? 'text-[#002f37] group-hover:text-white' : 'text-white group-hover:text-[#002f37]'}`}>{pkg.name}</h3>
                  <div className={`transition-colors duration-300 ${isMiddle ? 'text-[#7ede56] group-hover:text-[#a8ff85]' : 'text-[#a8ff85] group-hover:text-[#7ede56]'}`}>{pkg.icon}</div>
                </div>
<div className={`mb-6 pb-6 border-b transition-colors duration-300 ${isMiddle ? 'border-[#002f37]/10 group-hover:border-white/10' : 'border-white/10 group-hover:border-[#002f37]/10'}`}></div>
                <p className={`text-sm mb-8 min-h-[40px] leading-relaxed transition-colors duration-300 ${isMiddle ? 'text-gray-500 group-hover:text-white/70' : 'text-white/70 group-hover:text-gray-500'}`}>{pkg.description}</p>
                <ul className="space-y-5 mb-10 flex-grow">
                  {[['Farmers Funded', pkg.farmers], ['Best For', pkg.bestFor], ['Term Option', pkg.term]].map(([label, val]) => (
                    <li key={label} className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors duration-300 ${isMiddle ? 'text-gray-400 group-hover:text-white/40' : 'text-white/40 group-hover:text-gray-400'}`}>{label}</span>
                      <strong className={`font-semibold text-sm transition-colors duration-300 ${isMiddle ? 'text-[#002f37] group-hover:text-white' : 'text-white group-hover:text-[#002f37]'}`}>{val}</strong>
                    </li>
                  ))}
                  <li className={`flex flex-col p-4 rounded-xl mt-4 border transition-all duration-300 ${isMiddle ? 'bg-gray-50 border-gray-100 group-hover:bg-white/5 group-hover:border-white/10' : 'bg-white/5 border-white/10 group-hover:bg-gray-50 group-hover:border-gray-100'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors duration-300 ${isMiddle ? 'text-[#7ede56] group-hover:text-[#a8ff85]' : 'text-[#a8ff85] group-hover:text-[#7ede56]'}`}>Return Structure</span>
                    <span className={`text-sm leading-snug font-medium transition-colors duration-300 ${isMiddle ? 'text-gray-700 group-hover:text-white' : 'text-white group-hover:text-gray-700'}`}>{pkg.return}</span>
                  </li>
                </ul>
                <Button
                  onClick={() => window.open(whatsappMeUrl(`Hello Agrilync, I am interested in the FarmPartner Initiative ${pkg.name} Package.`), '_blank', 'noopener,noreferrer')}
                  className={`w-full py-6 text-sm font-bold uppercase tracking-widest transition-all ${isMiddle ? 'bg-[#002f37] hover:bg-black text-white group-hover:bg-white group-hover:text-[#002f37]' : 'bg-white group-hover:bg-[#002f37] text-[#002f37] group-hover:text-white'}`}
                >
                  Select Package
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
