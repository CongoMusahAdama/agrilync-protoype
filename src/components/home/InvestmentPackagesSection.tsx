import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { whatsappMeUrl } from '@/lib/communityLinks';
import { useLanguage } from '@/contexts/LanguageContext';

export const InvestmentPackagesSection: React.FC = () => {
  const { t } = useLanguage();
  const [mobileInfoVisible, setMobileInfoVisible] = useState(false);
  const [packagesRef, packagesVisible] = useScrollReveal();

  return (
    <section id="investment-packages" className="py-24 md:py-32 bg-gray-50 relative border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-24">

        <div
          ref={packagesRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start mb-12 md:mb-16 transition-all duration-700 ease-out ${packagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div>
            <div className="flex items-center mb-6">
              <div className="w-2.5 h-2.5 bg-[#7ede56]" />
              <span className="text-[#002f37]/60 text-sm uppercase tracking-[0.2em] ml-4">
                {t('packages.label')}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight text-[#002f37]">
              {t('packages.title')} <span className="italic text-[#7ede56]">{t('packages.titleHighlight')}</span>
            </h2>
          </div>
          <div className="max-w-xl lg:pt-12">
            <p className="text-gray-600 font-montserrat text-base md:text-lg leading-relaxed">
              {t('packages.blurb')}
            </p>
          </div>
        </div>

        <div
          onClick={() => setMobileInfoVisible(!mobileInfoVisible)}
          className={`group min-h-[350px] md:min-h-[500px] overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-out delay-150 flex items-center cursor-pointer ${packagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <img src="/lovable-uploads/investment.png" alt="FarmPartner Initiative" className="absolute inset-0 w-full h-full object-cover object-right" />
          <div className={`absolute inset-0 bg-[#002f37]/85 md:hidden transition-opacity duration-500 ${mobileInfoVisible ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="hidden md:block absolute inset-y-0 left-0 w-full md:w-[65%] bg-gradient-to-r from-[#002f37] via-[#002f37]/80 to-transparent"></div>
          <div className={`relative z-10 p-6 md:p-16 lg:px-20 lg:py-16 w-full min-h-[350px] md:min-h-[500px] flex flex-col justify-center transition-all duration-500 ${mobileInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:opacity-100 md:translate-y-0'}`}>
            <div className="lg:w-[60%] text-left space-y-4 md:space-y-6">
              <p className="text-white font-bold text-base md:text-2xl leading-snug md:leading-relaxed font-montserrat drop-shadow-lg">
                {t('packages.banner1')}
              </p>
              <p className="text-white/90 font-medium text-xs md:text-lg leading-relaxed font-sans drop-shadow-md">
                {t('packages.banner2')}
              </p>
              <h2 className="text-[#a8ff85] font-bold text-[10px] md:text-sm uppercase tracking-widest leading-normal drop-shadow-md font-montserrat">
                {t('packages.bannerTag')}
              </h2>
              <a
                href={whatsappMeUrl(t('packages.whatsapp'))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 mt-2 text-[#7ede56] font-bold text-xs uppercase tracking-[0.2em] hover:text-[#a8ff85] transition-colors"
              >
                {t('packages.cta')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          {!mobileInfoVisible && (
            <div className="md:hidden absolute bottom-0 left-0 w-full z-20">
              <div className="bg-[#002f37] py-3 text-center">
                <p className="text-[10px] text-white font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  {t('packages.tap')} <ArrowRight className="w-3 h-3 text-[#a8ff85]" />
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
