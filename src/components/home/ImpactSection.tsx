import React from "react";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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

const SDG_GOALS = [
  {
    number: "1",
    title: "NO POVERTY",
    color: "#E5243B",
    icon: (
      <svg
        viewBox="0 0 120 80"
        className="w-[72%] max-w-[9rem] h-auto"
        aria-hidden="true"
      >
        <g fill="currentColor">
          <circle cx="28" cy="22" r="7" />
          <path d="M16 48c0-8 5.5-14 12-14s12 6 12 14v4H16v-4z" />
          <circle cx="52" cy="18" r="6" />
          <path d="M42 44c0-7 4.5-12 10-12s10 5 10 12v4H42v-4z" />
          <circle cx="74" cy="24" r="5.5" />
          <path d="M64 48c0-6.5 4-11 10-11s10 4.5 10 11v4H64v-4z" />
          <circle cx="94" cy="20" r="6.5" />
          <path d="M83 48c0-7.5 5-13 11-13s11 5.5 11 13v4H83v-4z" />
          <circle cx="40" cy="52" r="4.5" />
          <path d="M33 70c0-5 3-8.5 7-8.5s7 3.5 7 8.5v2H33v-2z" />
          <circle cx="66" cy="54" r="4" />
          <path d="M59 70c0-4.5 3-8 7-8s7 3.5 7 8v2H59v-2z" />
        </g>
      </svg>
    ),
  },
  {
    number: "2",
    title: "ZERO HUNGER",
    color: "#DDA63A",
    icon: (
      <svg
        viewBox="0 0 100 90"
        className="w-[58%] max-w-[7.5rem] h-auto"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M28 42c0-10 8-18 22-18s22 8 22 18" />
          <path d="M38 34c0-7 5-12 12-12s12 5 12 12" />
          <path d="M48 28c0-5 3-9 7-9" />
          <path
            d="M18 52h64c0 18-14 30-32 30S18 70 18 52z"
            fill="currentColor"
            stroke="none"
          />
          <ellipse
            cx="50"
            cy="52"
            rx="32"
            ry="6"
            fill="currentColor"
            stroke="none"
          />
        </g>
      </svg>
    ),
  },
  {
    number: "5",
    title: "GENDER EQUALITY",
    color: "#FF3A21",
    icon: (
      <svg
        viewBox="0 0 100 100"
        className="w-[62%] max-w-[7.5rem] h-auto"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
        >
          <circle cx="50" cy="42" r="22" />
          <path d="M35 27 L22 14 M22 14 h14 M22 14 v14" />
          <path d="M50 64 v22 M40 76 h20" />
          <path d="M42 42 h16" strokeWidth="6" />
          <path d="M50 34 v16" strokeWidth="6" />
        </g>
      </svg>
    ),
  },
  {
    number: "13",
    title: "CLIMATE ACTION",
    color: "#3F7E44",
    icon: (
      <svg
        viewBox="0 0 120 80"
        className="w-[78%] max-w-[9.5rem] h-auto"
        aria-hidden="true"
      >
        <g fill="currentColor">
          <path
            d="M8 40c18-28 36-34 52-34s34 6 52 34c-18 28-36 34-52 34S26 68 8 40z"
            opacity="0.95"
          />
          <ellipse cx="60" cy="40" rx="22" ry="22" fill="#3F7E44" />
          <path
            d="M48 28c6-2 12-2 18 0-2 4-2 8 0 12-6 2-12 2-18 0 2-4 2-8 0-12z"
            fill="currentColor"
            opacity="0.35"
          />
          <path
            d="M42 40c0-8 6-16 18-18-2 6 0 12 4 16-8 2-16 4-22 2z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M60 28c8 2 14 8 16 16-6 0-12 2-16 6-2-8-4-16 0-22z"
            fill="currentColor"
            opacity="0.2"
          />
        </g>
      </svg>
    ),
  },
  {
    number: "17",
    title: "PARTNERSHIPS FOR THE GOALS",
    color: "#19486A",
    icon: (
      <svg
        viewBox="0 0 100 100"
        className="w-[68%] max-w-[8rem] h-auto"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor" strokeWidth="5.5">
          <circle cx="50" cy="28" r="14" />
          <circle cx="28" cy="44" r="14" />
          <circle cx="72" cy="44" r="14" />
          <circle cx="36" cy="70" r="14" />
          <circle cx="64" cy="70" r="14" />
        </g>
      </svg>
    ),
  },
] as const;

export const ImpactSection: React.FC<ImpactSectionProps> = ({
  heroImages,
  currentHeroImage,
}) => {
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
                The <span className="italic text-[#7ede56]">Impact</span>
              </h2>
            </div>
            <div
              className={`max-w-xl transition-all duration-700 delay-200 ease-out ${whoWeAreVisible ? "animate-fade-in-left opacity-100" : "opacity-0 translate-x-12"}`}
            >
              <p className="text-gray-600 font-montserrat text-base md:text-lg leading-relaxed mb-6">
                Sarah spent{" "}
                <strong className="text-[#002f37]">
                  months growing her vegetables
                </strong>
                . But once they're picked, the real race begins. Without a way
                to connect with the right{" "}
                <strong className="text-[#002f37]">investors and buyers</strong>
                , even her best harvest can go to waste before it reaches the
                market.
              </p>
              <p className="text-gray-600 font-montserrat text-base md:text-lg leading-relaxed">
                It's the same for{" "}
                <strong className="text-[#002f37]">
                  farmers like Emmanuel
                </strong>
                . His hard work is valuable in cattle rearing, but without{" "}
                <strong className="text-[#002f37]">
                  timely health data and field support
                </strong>
                , his livestock's health or growth potential could be
                compromised.
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
                      <h3 className="text-xl md:text-2xl font-semibold font-montserrat text-white mb-2">Meet {img.name}, {img.age}</h3>
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
              { end: 500, suffix: '+', label: 'Pilot Farmers', desc: 'Across 7 regions in Ghana', duration: 2200, delay: 2000 },
              { end: 15, suffix: '%+', label: 'Income Growth', desc: 'Average annual increase', duration: 1800, delay: 2400 },
              { end: 95, suffix: '%', label: 'Engagement', desc: 'WhatsApp community active', duration: 2000, delay: 2200 },
              { end: 10, suffix: '', label: 'Webinars', desc: 'Training sessions delivered', duration: 1600, delay: 2600 },
              { end: 50, suffix: '+', label: 'Waitlist', desc: 'Organic platform signups', duration: 1900, delay: 2000 },
              { end: 28, suffix: '', label: 'Consultations', desc: 'One-on-one expert sessions', duration: 2100, delay: 2800 },
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
            Our SDG Commitments
          </h2>
          <p className="mt-3 text-sm md:text-base font-montserrat text-gray-500 max-w-xl mx-auto">
            Aligning AgriLync Nexus with the UN Sustainable Development Goals
            that matter most to smallholder farmers.
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
                      {goal.title}
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
