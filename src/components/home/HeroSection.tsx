import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[75svh] md:h-[80vh] md:min-h-[600px] overflow-hidden bg-black flex flex-col md:flex-row md:items-start md:justify-start pt-28 md:pt-48 pb-12 md:pb-0">
      {/* Background Video / Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Mobile Background Image */}
        <img
          src="/lovable-uploads/image%20copy%2012.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-[85%_top] sm:object-right-top md:hidden opacity-60"
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

      <div className="relative z-20 w-full px-4 sm:px-12 lg:px-24 xl:px-32 mt-auto md:mt-0 pb-6 md:pb-0">
        <div className="max-w-3xl text-left pr-12 sm:pr-0">
          <h1 className="text-[22px] leading-[1.35] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 md:mb-10 md:leading-[1.05] font-montserrat tracking-tight animate-fade-in-up drop-shadow-lg max-w-[280px] sm:max-w-full">
            Unlocking Difficult Access to <br className="hidden md:block"/> <span className="text-[#7ede56]">Farm Investment</span> and <span className="text-[#7ede56]">Timely Information</span> Through <span className="text-[#7ede56]">AI</span>
          </h1>

          {/* Subheadline */}
          <p className="hidden md:block text-base md:text-lg text-white/80 mb-12 leading-relaxed max-w-xl font-sans animate-fade-in-up delay-200">
            Empowering <span className="text-[#7ede56] font-bold">smallholder farmers</span> and investors through trusted <span className="text-[#7ede56] font-bold">farm finance</span> and smart advisory.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start justify-start gap-3 md:gap-6 animate-fade-in-up delay-400">
            <a
              href="https://wa.me/233506626068"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-full sm:w-auto"
            >
              <Button className="bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] px-6 py-4 md:px-10 md:py-7 text-sm md:text-lg font-bold font-montserrat rounded-full shadow-[0_15px_30px_-10px_rgba(126,222,86,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95">
                Get in Touch
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
    </section>
  );
};
