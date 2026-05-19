import React from 'react';
import { Leaf, Users, TrendingUp, MessageCircle, Play, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from '@/components/CountUp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface HeroImage {
  src: string;
  name: string;
  age: string;
  location: string;
  position: string;
}

interface ImpactSectionProps {
  heroImages: HeroImage[];
  currentHeroImage: number;
}

export const ImpactSection: React.FC<ImpactSectionProps> = ({ heroImages, currentHeroImage }) => {
  const [whoWeAreRef, whoWeAreVisible] = useScrollReveal();

  return (
    <section className="bg-[#002f37] py-16 md:py-24 text-white relative overflow-hidden">
      {/* Subtle Background Patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* Floating Leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Leaf className="absolute top-10 left-[10%] w-12 h-12 text-[#7ede56] -rotate-12 animate-pulse" style={{ animationDuration: '4s' }} />
        <Leaf className="absolute top-[30%] right-[5%] w-20 h-20 text-[#7ede56] rotate-45 opacity-10 animate-bounce" style={{ animationDuration: '7s' }} />
        <Leaf className="absolute bottom-[20%] left-[5%] w-16 h-16 text-[#7ede56] rotate-[160deg] opacity-10" />
        <Leaf className="absolute top-[60%] left-[40%] w-8 h-8 text-[#7ede56] -rotate-45 opacity-10 animate-pulse" style={{ animationDuration: '5s' }} />
        <Leaf className="absolute bottom-[10%] right-[15%] w-24 h-24 text-[#7ede56] rotate-[120deg] opacity-5" />
        <Leaf className="absolute top-[15%] left-[25%] w-6 h-6 text-[#7ede56] rotate-12 opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-12">
          <div ref={whoWeAreRef} className={`transition-all duration-700 ease-out ${whoWeAreVisible ? 'animate-fade-in-right opacity-100' : 'opacity-0 -translate-x-12'}`}>
            <h2 className="text-4xl md:text-6xl font-bold font-montserrat leading-[0.9] text-[#7ede56] mb-6 md:mb-0">
              The <span className="italic">Impact</span>
            </h2>
          </div>
          <div className={`max-w-xl transition-all duration-700 delay-200 ease-out ${whoWeAreVisible ? 'animate-fade-in-left opacity-100' : 'opacity-0 translate-x-12'}`}>
            <p className="text-gray-300 font-sans text-base md:text-lg leading-relaxed mb-6">
              Sarah spent <strong className="text-white">months growing her vegetables</strong>. But once they're picked, the real race begins. Without a way to connect with the right <strong className="text-white">investors and buyers</strong>, even her best harvest can go to waste before it reaches the market.
            </p>
            <p className="text-gray-300 font-sans text-base md:text-lg leading-relaxed">
              It's the same for <strong className="text-white">farmers like Emmanuel</strong>. His hard work is valuable in cattle rearing, but without <strong className="text-white">timely health data and field support</strong>, his livestock's health or growth potential could be compromised.
            </p>
          </div>
        </div>

        {/* Cinematic Image Carousel */}
        <div className="relative mb-12 perspective-3000 overflow-visible group cursor-crosshair">
          <div className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] h-[350px] md:h-[500px] transform-style-3d hover-slow-zoom">
            {heroImages.map((img, idx) => {
              const isActive = idx === currentHeroImage;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 backface-hidden transition-all duration-[3500ms] ${isActive ? 'animate-page-rotate z-10' : 'opacity-0 z-0'}`}
                >
                  <img
                    src={img.src}
                    alt={img.name}
                    className="w-full h-full object-cover transition-transform duration-[12000ms] ease-out will-change-transform"
                    style={{ objectPosition: img.position || 'center top' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <div className={`absolute bottom-10 left-10 md:bottom-16 md:left-16 transition-all duration-700 delay-500 drop-shadow-md ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <h3 className="text-xl md:text-2xl font-semibold font-montserrat text-white mb-2">Meet {img.name}, {img.age}</h3>
                    <p className="text-sm md:text-base font-sans text-[#7ede56] font-medium tracking-wide">{img.location}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Progress indicators */}
          <div className="absolute bottom-6 right-10 flex gap-2 z-20">
            {heroImages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${idx === currentHeroImage ? 'w-8 bg-[#7ede56]' : 'w-2 bg-white/30'}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 border-t border-white/10 pt-12">
          {[
            { icon: Users, label: 'Pilot Farmers', end: 500, suffix: '', desc: 'across 7 target regions in Ghana: Western, Eastern, Volta, Ashanti, Central, Northern, and Bono.', duration: 2200, delay: 2000 },
            { icon: TrendingUp, label: 'Income Growth', end: 15, suffix: '%+', desc: 'average increase in annual income for farmers connected to our investment ecosystem.', duration: 1800, delay: 2400 },
            { icon: MessageCircle, label: 'Engagement', end: 95, suffix: '%', desc: 'WhatsApp community engagement across our farmer networks.', duration: 2000, delay: 2200 },
            { icon: Play, label: 'Webinars', end: 8, suffix: '', desc: 'Online training sessions covering all essential aspects of farming.', duration: 1600, delay: 2600 },
            { icon: Users, label: 'Waitlist', end: 50, suffix: '+', desc: 'Organic signups for our upcoming platform launch.', duration: 1900, delay: 2000 },
            { icon: Bot, label: 'Consultations', end: 28, suffix: '', desc: 'One-on-one expert farm consultations completed.', duration: 2100, delay: 2800 },
          ].map(({ icon: Icon, label, end, suffix, desc, duration, delay }, i) => (
            <div key={i} className="flex items-start gap-4 md:gap-6 group">
              <div className="flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                <Icon className="w-10 h-10 text-[#FFD700] stroke-[1.5px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <CountUp end={end} suffix={suffix} loop loopDelay={delay} duration={duration} className="text-3xl md:text-5xl font-black text-[#FFD700] font-montserrat tracking-tight" />
                  </motion.div>
                </div>
                <p className="text-white/80 font-bold text-xs uppercase tracking-widest mb-2">{label}</p>
                <p className="text-gray-400 font-sans text-xs leading-relaxed max-w-[200px]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
