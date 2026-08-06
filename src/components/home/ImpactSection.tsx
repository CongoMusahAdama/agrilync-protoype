import React from "react";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";

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

/** White SDG icon glyphs — simplified to match official UN icon silhouettes */
const sdgIconClass = "w-[55%] max-w-[7rem] h-auto text-white";

const SDG_GOALS = [
  {
    number: "1",
    titleKey: "impact.sdg1",
    color: "#E5243B",
    icon: (
      <svg viewBox="0 0 96 72" className={sdgIconClass} aria-hidden="true" fill="currentColor">
        {/* Adult left */}
        <circle cx="22" cy="16" r="7" />
        <path d="M10 52c0-9 5.5-16 12-16s12 7 12 16v4H10v-4z" />
        {/* Adult right */}
        <circle cx="74" cy="16" r="7" />
        <path d="M62 52c0-9 5.5-16 12-16s12 7 12 16v4H62v-4z" />
        {/* Adult center */}
        <circle cx="48" cy="14" r="7.5" />
        <path d="M35 50c0-9.5 6-17 13-17s13 7.5 13 17v5H35v-5z" />
        {/* Child */}
        <circle cx="48" cy="42" r="5" />
        <path d="M40 66c0-5.5 3.5-10 8-10s8 4.5 8 10v2H40v-2z" />
      </svg>
    ),
  },
  {
    number: "2",
    titleKey: "impact.sdg2",
    color: "#DDA63A",
    icon: (
      <svg viewBox="0 0 96 80" className={sdgIconClass} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* Steam */}
        <path d="M34 28c0-6 4-10 8-10" />
        <path d="M48 22c0-7 4-12 8-12" />
        <path d="M62 28c0-6 3-10 6-10" />
        {/* Bowl */}
        <path d="M16 40h64c0 20-14 34-32 34S16 60 16 40z" fill="currentColor" stroke="none" />
        <ellipse cx="48" cy="40" rx="32" ry="7" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    number: "5",
    titleKey: "impact.sdg5",
    color: "#FF3A21",
    icon: (
      <svg viewBox="0 0 96 96" className={sdgIconClass} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {/* Combined gender equality symbol */}
        <circle cx="48" cy="36" r="18" />
        {/* Female cross */}
        <path d="M48 54v28M36 68h24" />
        {/* Male arrow */}
        <path d="M35 23L20 8M20 8h16M20 8v16" />
        {/* Equals mark inside circle */}
        <path d="M40 32h16M40 40h16" strokeWidth="5" />
      </svg>
    ),
  },
  {
    number: "13",
    titleKey: "impact.sdg13",
    color: "#3F7E44",
    icon: (
      <svg viewBox="0 0 110 72" className={sdgIconClass} aria-hidden="true">
        {/* White eye with circular iris hole (card color shows through) */}
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M8 36c16-22 32-28 47-28s31 6 47 28c-16 22-32 28-47 28S24 58 8 36zm47-16a16 16 0 1 0 .01 0z"
        />
        {/* Earth detail rings/continents inside the iris */}
        <circle cx="55" cy="36" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path fill="currentColor" d="M47 30c3.5-1 7-.8 10.5.8-1 2.2-.8 4.8.4 7-3.5 1-7.2 1-10.8 0 .9-2.4.8-5.2-.1-7.8z" />
        <path fill="currentColor" d="M57 39c3 .6 5.5 2.8 6.5 5.8-2.6.6-5 1.6-7.2 3.2-.8-3-1.6-6.2.7-9z" />
      </svg>
    ),
  },
  {
    number: "17",
    titleKey: "impact.sdg17",
    color: "#19486A",
    icon: (
      <svg viewBox="0 0 96 96" className={sdgIconClass} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="5.5">
        {/* Interlocking partnership circles */}
        <circle cx="48" cy="26" r="15" />
        <circle cx="28" cy="40" r="15" />
        <circle cx="68" cy="40" r="15" />
        <circle cx="34" cy="64" r="15" />
        <circle cx="62" cy="64" r="15" />
      </svg>
    ),
  },
] as const;

export const ImpactSection: React.FC<ImpactSectionProps> = ({
  heroImages,
  currentHeroImage,
}) => {
  const { t } = useLanguage();
  const [whoWeAreRef, whoWeAreVisible] = useScrollReveal();

  return (
    <>
      {/* Impact intro — light band */}
      <section className="bg-white pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            <div
              ref={whoWeAreRef}
              className={`transition-all duration-700 ease-out ${whoWeAreVisible ? "animate-fade-in-right opacity-100" : "opacity-0 -translate-x-12"}`}
            >
              <h2 className="text-4xl md:text-6xl font-bold font-montserrat leading-[0.9] text-[#002f37] mb-6 md:mb-0">
                {t('impact.titleThe')}<span className="italic text-[#7ede56]">{t('impact.titleImpact')}</span>
              </h2>
            </div>
            <div
              className={`max-w-xl transition-all duration-700 delay-200 ease-out ${whoWeAreVisible ? "animate-fade-in-left opacity-100" : "opacity-0 translate-x-12"}`}
            >
              <p className="text-gray-600 font-montserrat text-base md:text-lg leading-relaxed mb-6">
                {t('impact.p1a')}{" "}
                <strong className="text-[#002f37]">
                  {t('impact.p1b')}
                </strong>
                {t('impact.p1c')}{" "}
                <strong className="text-[#002f37]">{t('impact.p1d')}</strong>
                {t('impact.p1e')}
              </p>
              <p className="text-gray-600 font-montserrat text-base md:text-lg leading-relaxed">
                {t('impact.p2a')}{" "}
                <strong className="text-[#002f37]">
                  {t('impact.p2b')}
                </strong>
                {t('impact.p2c')}{" "}
                <strong className="text-[#002f37]">
                  {t('impact.p2d')}
                </strong>
                {t('impact.p2e')}
              </p>
            </div>
          </div>
        </div>
      </section>

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
          {/* Cinematic Image Carousel — unchanged */}
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
                      <h3 className="text-xl md:text-2xl font-semibold font-montserrat text-white mb-2">{t('impact.meet', { name: img.name, age: img.age })}</h3>
                      <p className="text-sm md:text-base font-montserrat text-[#7ede56] font-medium tracking-wide">{img.location}</p>
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

          {/* Impact stats — clean number strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {[
              { end: 500, suffix: '+', label: t('impact.stat.farmers'), desc: t('impact.stat.farmersDesc'), duration: 2200, delay: 2000 },
              { end: 15, suffix: '%+', label: t('impact.stat.income'), desc: t('impact.stat.incomeDesc'), duration: 1800, delay: 2400 },
              { end: 95, suffix: '%', label: t('impact.stat.engagement'), desc: t('impact.stat.engagementDesc'), duration: 2000, delay: 2200 },
              { end: 10, suffix: '', label: t('impact.stat.webinars'), desc: t('impact.stat.webinarsDesc'), duration: 1600, delay: 2600 },
              { end: 50, suffix: '+', label: t('impact.stat.waitlist'), desc: t('impact.stat.waitlistDesc'), duration: 1900, delay: 2000 },
              { end: 28, suffix: '', label: t('impact.stat.consultations'), desc: t('impact.stat.consultationsDesc'), duration: 2100, delay: 2800 },
            ].map(({ end, suffix, label, desc, duration, delay }, i) => (
              <div
                key={i}
                className="bg-[#002f37] px-5 py-8 md:px-8 md:py-10 flex flex-col items-start"
              >
                <CountUp
                  end={end}
                  suffix={suffix}
                  loop
                  loopDelay={delay}
                  duration={duration}
                  className="text-4xl md:text-5xl font-black text-[#7ede56] font-montserrat tracking-tight"
                />
                <p className="mt-3 text-white font-bold text-xs uppercase tracking-[0.18em]">
                  {label}
                </p>
                <p className="mt-1.5 text-white/50 font-montserrat text-sm leading-snug">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG strip */}
      <section
        className="bg-white pt-14 md:pt-20 pb-14 md:pb-20"
        aria-labelledby="sdg-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto px-6 lg:px-24 mb-10 md:mb-14 text-center"
        >
          <h2
            id="sdg-heading"
            className="text-2xl md:text-3xl font-bold font-montserrat text-[#002f37] tracking-tight"
          >
            {t('impact.sdgTitle')}
          </h2>
          <p className="mt-3 text-sm md:text-base font-montserrat text-gray-500 max-w-xl mx-auto">
            {t('impact.sdgBlurb')}
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[3px] list-none m-0 p-0"
          >
            {SDG_GOALS.map((goal) => (
              <motion.li
                key={goal.number}
                className="min-w-0"
                variants={{
                  hidden: { opacity: 0, y: 48, scale: 0.92 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                <article
                  className="aspect-square flex flex-col text-white p-3 sm:p-4 md:p-5 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:z-10 relative"
                  style={{ backgroundColor: goal.color }}
                >
                  <header className="flex items-start gap-2 md:gap-3">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat leading-none tracking-tight shrink-0">
                      {goal.number}
                    </span>
                    <h3 className="text-[10px] sm:text-xs md:text-sm font-bold font-montserrat uppercase leading-tight pt-1 text-white">
                      {t(goal.titleKey)}
                    </h3>
                  </header>
                  <div className="flex-1 flex items-center justify-center text-white mt-2">
                    {goal.icon}
                  </div>
                </article>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </>
  );
};
