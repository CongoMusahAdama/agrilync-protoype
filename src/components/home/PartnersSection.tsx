import React from 'react';

export const PartnersSection: React.FC = () => {
  return (
    <section className="bg-white py-6 md:py-8 border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-24 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold font-montserrat leading-[0.9] text-[#002f37] mb-6 md:mb-0">
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

      <div className="relative h-[280px] md:h-[200px] w-full max-w-4xl mx-auto px-6 lg:px-24">
        {/* Arc/Curve */}
        <div className="absolute top-[28%] md:top-[18%] left-1/2 -translate-x-1/2 w-[150%] md:w-[110%] h-[500px] border-t-[1.5px] border-dashed border-gray-200 rounded-[100%] pointer-events-none" />

        {/* Central Logo (AgriLync) */}
        <div className="absolute top-[22%] md:top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center w-24">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-center border border-gray-100 transition-transform hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-[#7ede56] opacity-10 blur-xl" />
            <img src="/Frame 74.png" alt="AgriLync" className="w-14 h-14 md:w-16 md:h-16 object-contain relative z-10" />
          </div>
          <p className="mt-2 text-[10px] font-bold text-[#002f37] uppercase tracking-widest text-center leading-tight">AgriLync</p>
        </div>

        {/* Inner Left: Eyramax */}
        <div className="absolute top-[50%] md:top-[30%] left-[22%] md:left-[30%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center w-20 md:w-24">
          <div className="w-16 h-16 md:w-16 md:h-16 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden p-2 mx-auto">
            <img src="/lovable-uploads/exramax.png" alt="Eyramax" loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <p className="mt-2 text-[9px] md:text-[10px] font-bold text-[#002f37] uppercase tracking-widest text-center leading-tight">Eyramax</p>
        </div>

        {/* Inner Right: United Way Ghana */}
        <div className="absolute top-[50%] md:top-[30%] left-[78%] md:left-[70%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center w-20 md:w-24">
          <div className="w-16 h-16 md:w-16 md:h-16 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden p-2 mx-auto">
            <img src="/lovable-uploads/unitedway.png" alt="United Way Ghana" loading="lazy" className="w-full h-full object-contain" />
          </div>
          <p className="mt-2 text-[9px] md:text-[10px] font-bold text-[#002f37] uppercase tracking-widest text-center leading-tight">United Way</p>
        </div>

        {/* Outer Left: iSpace Foundation */}
        <div className="absolute top-[85%] md:top-[63%] left-[30%] md:left-[13%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center w-24">
          <div className="w-16 h-16 md:w-18 md:h-18 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden p-2.5 mx-auto">
            <img src="/lovable-uploads/ispace.png" alt="iSpace Foundation" loading="lazy" className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-[10px] font-black text-gray-400">iSpace</span>'; }} />
          </div>
          <p className="mt-2 text-[9px] md:text-[10px] font-bold text-[#002f37] uppercase tracking-widest text-center leading-tight">iSpace Foundation</p>
        </div>

        {/* Outer Right: Duapa Werkspace */}
        <div className="absolute top-[85%] md:top-[63%] left-[70%] md:left-[87%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center w-24">
          <div className="w-16 h-16 md:w-18 md:h-18 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden p-2.5 mx-auto">
            <img src="/lovable-uploads/duapawerkspace.png" alt="Duapa Werkspace" loading="lazy" className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-[10px] font-black text-gray-400">Duapa</span>'; }} />
          </div>
          <p className="mt-2 text-[9px] md:text-[10px] font-bold text-[#002f37] uppercase tracking-widest text-center leading-tight">Duapa Werkspace</p>
        </div>

        {/* Decorative dots */}
        <div className="absolute top-[82%] left-[28%] md:left-[28%] w-2 h-2 rounded-full bg-[#7ede56] animate-ping opacity-30" />
        <div className="absolute top-[68%] right-[28%] md:right-[28%] w-2.5 h-2.5 rounded-full bg-[#FFD700] animate-pulse opacity-30" style={{ animationDelay: '1.2s' }} />
      </div>
    </section>
  );
};
