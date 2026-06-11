import React from 'react';

type Partner = {
  id: string;
  name: string;
  logo: string;
  /** Degrees along the arc: 0 = right, 90 = top center, 180 = left */
  angle: number;
  featured?: boolean;
};

const PARTNERS: Partner[] = [
  { id: 'ispace', name: 'iSpace Foundation', logo: '/lovable-uploads/ispace.png', angle: 158 },
  { id: 'eyramax', name: 'Eyramax', logo: '/lovable-uploads/exramax.png', angle: 124 },
  { id: 'agrilync', name: 'AgriLync', logo: '/Frame 74.png', angle: 90, featured: true },
  { id: 'unitedway', name: 'United Way', logo: '/lovable-uploads/unitedway.png', angle: 56 },
  { id: 'duapa', name: 'Duapa Werkspace', logo: '/lovable-uploads/duapawerkspace.png', angle: 22 },
];

/** Place a logo on a semicircle: center bottom, opening upward */
function arcPosition(angleDeg: number, radiusPercent: number, cx = 50, cy = 88) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `${cx + radiusPercent * Math.cos(rad)}%`,
    top: `${cy - radiusPercent * Math.sin(rad)}%`,
  };
}

const PartnerBubble: React.FC<{ partner: Partner }> = ({ partner }) => {
  const bubble = partner.featured ? 'w-[4.5rem] h-[4.5rem] md:w-24 md:h-24' : 'w-14 h-14 md:w-16 md:h-16';
  const img = partner.featured ? 'w-10 h-10 md:w-14 md:h-14' : 'w-9 h-9 md:w-11 md:h-11';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${bubble} bg-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex items-center justify-center border border-gray-100 transition-transform hover:scale-105 overflow-hidden p-2 relative`}
      >
        {partner.featured && (
          <div className="absolute inset-0 rounded-full bg-[#7ede56] opacity-10 blur-xl" />
        )}
        <img
          src={partner.logo}
          alt={partner.name}
          loading="lazy"
          className={`${img} object-contain relative z-10 ${partner.id === 'eyramax' ? 'mix-blend-multiply' : ''}`}
        />
      </div>
      <p className="text-[9px] md:text-[10px] font-bold text-[#002f37] uppercase tracking-widest text-center leading-tight max-w-[5.5rem] md:max-w-[6.5rem]">
        {partner.name}
      </p>
    </div>
  );
};

export const PartnersSection: React.FC = () => {
  return (
    <section className="bg-white py-8 md:py-10 border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-24 mb-8 md:mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold font-montserrat leading-[0.9] text-[#002f37]">
              Partners &amp; <span className="italic">Hubs</span>
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-gray-500 font-sans text-base md:text-lg leading-relaxed">
              Supported by leading institutions and innovation hubs to empower smallholder farmers across the region.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: centered row, same left-to-right order as the arc */}
      <div className="md:hidden flex flex-wrap justify-center items-end gap-x-6 gap-y-8 px-4 pb-2">
        {PARTNERS.map((partner) => (
          <PartnerBubble key={partner.id} partner={partner} />
        ))}
      </div>

      {/* Desktop: arc layout */}
      <div className="hidden md:block relative mx-auto w-full max-w-4xl h-[240px] px-8">
        {/* Dashed semicircle */}
        <div
          className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-[92%] h-[200px] border-t-[1.5px] border-dashed border-gray-200 rounded-[100%] pointer-events-none"
          aria-hidden
        />

        {PARTNERS.map((partner) => {
          const { left, top } = arcPosition(partner.angle, partner.featured ? 36 : 38);
          return (
            <div
              key={partner.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left, top }}
            >
              <PartnerBubble partner={partner} />
            </div>
          );
        })}

        <div className="absolute bottom-[12%] left-[26%] w-2 h-2 rounded-full bg-[#7ede56] animate-ping opacity-30" aria-hidden />
        <div
          className="absolute bottom-[22%] right-[26%] w-2.5 h-2.5 rounded-full bg-[#FFD700] animate-pulse opacity-30"
          style={{ animationDelay: '1.2s' }}
          aria-hidden
        />
      </div>
    </section>
  );
};
