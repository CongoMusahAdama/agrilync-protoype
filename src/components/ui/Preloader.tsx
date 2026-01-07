import React from 'react';
import { Leaf } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

const Preloader: React.FC = () => {
    const { darkMode } = useDarkMode();

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
            <div className="relative flex items-center justify-center">
                {/* Main spinning ring - responsive sizing */}
                <div className="absolute h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full border-2 sm:border-[3px] md:border-4 border-[#7ede56]/10 border-t-[#7ede56] animate-spin"></div>

                {/* Secondary reverse spinning ring - responsive sizing */}
                <div className="absolute h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full border-2 sm:border-[3px] md:border-4 border-transparent border-t-[#7ede56]/40 border-b-[#7ede56]/40 animate-[spin_1.5s_linear_infinite_reverse]"></div>

                {/* Pulsing center circle - responsive sizing */}
                <div className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center shadow-lg ${darkMode ? 'bg-[#01343c]' : 'bg-gray-50'}`}>
                    <Leaf className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#7ede56] animate-pulse" />
                </div>

                {/* Particles/Dots orbiting - responsive sizing */}
                <div className="absolute h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 animate-[spin_3s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#7ede56] shadow-[0_0_8px_#7ede56] sm:shadow-[0_0_10px_#7ede56]"></div>
                </div>
                <div className="absolute h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 animate-[spin_4s_linear_infinite_reverse]">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#7ede56]/60 shadow-[0_0_6px_#7ede56] sm:shadow-[0_0_8px_#7ede56]"></div>
                </div>
            </div>

            {/* Branding text - responsive positioning and sizing */}
            <div className="absolute bottom-8 sm:bottom-12 flex flex-col items-center gap-2 mt-8 sm:mt-12">
                <p className={`text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                    AgriLync
                </p>
                <div className="flex gap-1">
                    <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#7ede56] animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#7ede56] animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#7ede56] animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
