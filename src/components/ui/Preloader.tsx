import React from 'react';
import { Leaf } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';

const Preloader: React.FC = () => {
    const { darkMode } = useDarkMode();

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${darkMode ? 'bg-[#002f37]' : 'bg-white'}`}>
            <div className="relative flex items-center justify-center">
                {/* Main spinning ring */}
                <div className="absolute h-24 w-24 rounded-full border-4 border-[#7ede56]/10 border-t-[#7ede56] animate-spin"></div>

                {/* Secondary reverse spinning ring */}
                <div className="absolute h-18 w-18 rounded-full border-4 border-transparent border-t-[#7ede56]/40 border-b-[#7ede56]/40 animate-[spin_1.5s_linear_infinite_reverse]"></div>

                {/* Pulsing center circle */}
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg ${darkMode ? 'bg-[#01343c]' : 'bg-gray-50'}`}>
                    <Leaf className="h-6 w-6 text-[#7ede56] animate-pulse" />
                </div>

                {/* Particles/Dots orbiting */}
                <div className="absolute h-32 w-32 animate-[spin_3s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#7ede56] shadow-[0_0_10px_#7ede56]"></div>
                </div>
                <div className="absolute h-32 w-32 animate-[spin_4s_linear_infinite_reverse]">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#7ede56]/60 shadow-[0_0_8px_#7ede56]"></div>
                </div>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-2">
                <p className={`text-sm font-bold tracking-[0.2em] uppercase ${darkMode ? 'text-white' : 'text-[#002f37]'}`}>
                    AgriLync
                </p>
                <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
