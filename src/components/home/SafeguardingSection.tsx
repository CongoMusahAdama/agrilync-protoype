import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';

export const SafeguardingSection: React.FC = () => {
  const { t } = useLanguage();
  const [sectionRef, sectionVisible] = useScrollReveal();

  const highlights = [
    t('safe.h1'),
    t('safe.h2'),
    t('safe.h3'),
    t('safe.h4'),
  ];

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
              {t('safe.label')}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#002f37] font-montserrat leading-tight mb-6">
              {t('safe.title')}
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              {t('safe.blurb')}
            </p>
            <Button
              asChild
              className="rounded-full bg-[#002f37] hover:bg-[#002f37]/90 text-white px-8 py-6 text-sm font-semibold"
            >
              <Link to="/safeguarding-policy">
                {t('safe.cta')}
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
              {t('safe.report')}{' '}
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
