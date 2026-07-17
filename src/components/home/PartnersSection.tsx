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
  { id: 'ispace', name: 'iSpace Foundation', logo: '/lovable-uploads/ispace.png', angle: 160 },
  { id: 'eyramax', name: 'Eyramax', logo: '/lovable-uploads/exramax.png', angle: 125 },
  { id: 'agrilync', name: 'AgriLync', logo: '/Frame 74.png', angle: 90, featured: true },
  { id: 'unitedway', name: 'United Way', logo: '/lovable-uploads/unitedway.png', angle: 55 },
  { id: 'duapa', name: 'Duapa Werkspace', logo: '/lovable-uploads/duapawerkspace.png', angle: 20 },
];

const ARC_RADIUS = 42;
const ARC_CX = 50;
const ARC_CY = 90;

function arcPosition(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `${ARC_CX + ARC_RADIUS * Math.cos(rad)}%`,
    top: `${ARC_CY - ARC_RADIUS * Math.sin(rad)}%`,
  };
}

const PartnerLogo: React.FC<{ partner: Partner }> = ({ partner }) => {
  const bubble = partner.featured
    ? 'w-[4.5rem] h-[4.5rem] md:w-24 md:h-24'
    : 'w-14 h-14 md:w-[4.25rem] md:h-[4.25rem]';
  const img = partner.featured
    ? 'w-10 h-10 md:w-14 md:h-14'
    : 'w-9 h-9 md:w-10 md:h-10';

  return (
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
  );
};

const PartnerLabel: React.FC<{ name: string }> = ({ name }) => (
  <p className="text-[9px] md:text-[10px] font-bold text-[#002f37] uppercase tracking-widest text-center leading-tight w-[5.5rem] md:w-[6.5rem] min-h-[2rem] md:min-h-[2.25rem]">
    {name}
  </p>
);

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

      <div className="md:hidden flex flex-wrap justify-center items-end gap-x-6 gap-y-8 px-4 pb-2">
        {PARTNERS.map((partner) => (
          <div key={partner.id} className="flex flex-col items-center gap-2">
            <PartnerLogo partner={partner} />
            <PartnerLabel name={partner.name} />
          </div>
        ))}
      </div>

      <div className="hidden md:block relative mx-auto w-full max-w-4xl lg:max-w-5xl h-[250px] lg:h-[270px] px-8 lg:px-12">
        <div
          className="absolute left-1/2 bottom-[16%] lg:bottom-[14%] -translate-x-1/2 w-[90%] lg:w-[88%] h-[210px] lg:h-[230px] border-t-[1.5px] border-dashed border-gray-200 rounded-[100%] pointer-events-none"
          aria-hidden
        />

        {PARTNERS.map((partner) => {
          const { left, top } = arcPosition(partner.angle);
          const labelOffset = partner.featured ? 'calc(3rem + 0.5rem)' : 'calc(2.125rem + 0.5rem)';

          return (
            <div
              key={partner.id}
              className="absolute z-10"
              style={{ left, top, width: 0, height: 0 }}
            >
              <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                <PartnerLogo partner={partner} />
              </div>
              <div
                className="absolute left-0 top-0 -translate-x-1/2"
                style={{ marginTop: labelOffset }}
              >
                <PartnerLabel name={partner.name} />
              </div>
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
