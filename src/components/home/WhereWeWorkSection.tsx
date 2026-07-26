import React, { useEffect, useState } from 'react';
import { Check, MapPin, Rocket } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AfricaLiveMap } from '@/components/home/AfricaLiveMap';

const ACTIVE = '#002f37';
const TAB_IDLE = '#e8f5e4';

const CURRENT_REGIONS = [
  'Northern',
  'Upper East',
  'Bono Ahafo',
  'Ahafo',
  'Ashanti',
  'Eastern',
  'Volta',
  'Western',
  'Central',
] as const;

type FocusId = 'ghana' | 'west-africa' | 'africa';

const FOCUSES: {
  id: FocusId;
  label: string;
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  live?: boolean;
}[] = [
  {
    id: 'africa',
    label: 'Wider Africa',
    badge: 'Long-term vision',
    title: 'Wider Africa',
    description:
      'Ghana is not the end of the map. Over time we aim to grow Agrilync Nexus across Africa — wherever smallholder farmers and partners need investable, data-backed farm infrastructure.',
    bullets: [
      'Continent-wide ambition',
      'Phased, evidence-led growth',
      'Built to travel with partners',
    ],
  },
  {
    id: 'west-africa',
    label: 'West Africa',
    badge: 'Next expansion',
    title: 'West Africa',
    description:
      'As we scale, West Africa is our natural next step — bringing the same finance-first, training-led model to neighbouring markets where smallholder agriculture needs transparent capital and field support.',
    bullets: [
      'Expansion after Ghana depth',
      'Partner-led market entry',
      'Same verification & advisory stack',
    ],
  },
  {
    id: 'ghana',
    label: 'Ghana',
    badge: 'Active now',
    title: 'Ghana',
    live: true,
    description:
      'Agrilync Nexus is live in Ghana today — connecting verified smallholder farmers with agents, AI advisory, and FarmPartner financing across nine regions. This is our home base and proving ground.',
    bullets: [
      '9 regions in active rollout',
      'Agent-supported field network',
      'FarmPartner financing model',
    ],
  },
];

const AUTOPLAY_ORDER: FocusId[] = ['africa', 'west-africa', 'ghana'];
const AUTOPLAY_INTERVAL_MS = 5000;

export const WhereWeWorkSection: React.FC = () => {
  const [focus, setFocus] = useState<FocusId>('africa');
  const [autoPlay, setAutoPlay] = useState(true);
  const [sectionRef, visible] = useScrollReveal();
  const active = FOCUSES.find((f) => f.id === focus)!;

  // Auto-cycle Wider Africa → West Africa → Ghana once the section is visible.
  // A manual tab tap hands control back to the user.
  useEffect(() => {
    if (!visible || !autoPlay) return;
    const timer = window.setInterval(() => {
      setFocus((prev) => {
        const idx = AUTOPLAY_ORDER.indexOf(prev);
        return AUTOPLAY_ORDER[(idx + 1) % AUTOPLAY_ORDER.length];
      });
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [visible, autoPlay]);

  const selectFocus = (id: FocusId) => {
    setAutoPlay(false);
    setFocus(id);
  };

  return (
    <section
      id="where-we-work"
      ref={sectionRef}
      className={`py-14 sm:py-20 md:py-24 bg-white transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat text-[#1a1a1a] tracking-tight text-center">
            Where We Work
          </h2>
        </div>
        <p className="text-center text-sm md:text-base font-montserrat text-gray-500 max-w-xl mx-auto mb-10 md:mb-12">
          Live in Ghana today — expanding across Africa as we grow.
        </p>

        <div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-12"
          role="tablist"
          aria-label="Where we work"
        >
          {FOCUSES.map((f) => {
            const isActive = f.id === focus;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectFocus(f.id)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-montserrat font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 normal-case ${
                  isActive
                    ? 'bg-[#002f37] text-white shadow-md shadow-[#002f37]/20'
                    : 'text-[#002f37] hover:brightness-95'
                }`}
                style={!isActive ? { backgroundColor: TAB_IDLE } : undefined}
              >
                {f.label}
                {f.live && (
                  <span
                    className={`ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle ${
                      isActive ? 'bg-[#7ede56]' : 'bg-[#177209]'
                    }`}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          <div className="lg:col-span-8 min-w-0">
            <AfricaLiveMap focus={focus} />
            <p className="text-center text-xs font-montserrat text-[#002f37]/45 mt-2">
              {focus === 'ghana'
                ? 'Home base · Active operations'
                : focus === 'west-africa'
                  ? 'Next markets after Ghana'
                  : 'Expanding across Africa over time'}
            </p>
          </div>

          <div className="lg:col-span-4 min-w-0">
            <article className="bg-white rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,47,55,0.22)] border border-gray-100 p-6 sm:p-8 lg:sticky lg:top-28">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: active.live ? '#177209' : ACTIVE }}
              >
                {active.live ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : (
                  <Rocket className="w-5 h-5 text-white" strokeWidth={2.4} />
                )}
              </div>

              <p className="text-[11px] font-bold font-montserrat uppercase tracking-wider text-[#177209] mb-2">
                {active.badge}
              </p>
              <h3 className="text-xl md:text-2xl font-bold font-montserrat text-[#002f37] mb-3">
                {active.title}
              </h3>
              <p className="text-gray-600 font-montserrat text-sm leading-relaxed mb-5">
                {active.description}
              </p>

              <ul className="space-y-2 mb-6">
                {active.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-montserrat text-[#002f37]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7ede56] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {focus === 'ghana' && (
                <div>
                  <p className="text-[11px] font-bold font-montserrat uppercase tracking-[0.14em] text-gray-400 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Regions in rollout
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CURRENT_REGIONS.map((region) => (
                      <span
                        key={region}
                        className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold font-montserrat text-[#002f37] bg-[#e8f5e4]"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhereWeWorkSection;
