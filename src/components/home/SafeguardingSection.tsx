import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const highlights = [
  'Informed consent before any photo, video, or story is shared',
  'Extra precautions to protect children during farm and community activities',
  'Equal respect and dignity for every farmer, agent, and partner',
  'Confidential reporting, no impact on your access to our services',
];

export const SafeguardingSection: React.FC = () => {
  const [sectionRef, sectionVisible] = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-[#FDFCFB]">
      <div
        ref={sectionRef}
        className={`max-w-7xl mx-auto px-6 lg:px-24 transition-all duration-700 ease-out ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[#7ede56] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <Shield className="w-4 h-4" />
              Safeguarding
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#002f37] font-montserrat leading-tight mb-6">
              Safety, dignity, and wellbeing, always
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              Agrilync Nexus is committed to protecting every farmer, family, and community we work with, from farm visits to the stories we share.
            </p>
            <Button
              asChild
              className="rounded-full bg-[#002f37] hover:bg-[#002f37]/90 text-white px-8 py-6 text-sm font-semibold"
            >
              <Link to="/safeguarding-policy">
                Read our Safeguarding Policy
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(0,47,55,0.1)] border border-[#7ede56]/20">
            <ul className="space-y-5">
              {highlights.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#7ede56] shrink-0" />
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500 leading-relaxed">
              To report a concern:{' '}
              <a href="mailto:agrilync@gmail.com" className="text-[#002f37] font-medium hover:text-[#7ede56] transition-colors">
                agrilync@gmail.com
              </a>
              {' · '}
              <a href="tel:0506626068" className="text-[#002f37] font-medium hover:text-[#7ede56] transition-colors">
                0506626068
              </a>
              {' / '}
              <a href="tel:0247552111" className="text-[#002f37] font-medium hover:text-[#7ede56] transition-colors">
                0247552111
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
