import React from 'react';
import { useDarkMode } from '@/contexts/DarkModeContext';

/** Circular preloader for dashboard / app shells (agent, grower, admin). */
const Preloader: React.FC = () => {
    const { darkMode } = useDarkMode();

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ${
                darkMode ? 'bg-[#002f37]/95' : 'bg-white/95'
            } backdrop-blur-[2px]`}
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
            <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
                <div
                    className={`absolute inset-0 rounded-full border-[3px] ${
                        darkMode ? 'border-white/10' : 'border-[#002f37]/8'
                    }`}
                />
                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#7ede56] border-r-[#7ede56]/40 animate-spin" />
                <div className="absolute inset-3 rounded-full border-[2.5px] border-transparent border-b-[#7ede56]/70 animate-[spin_1.2s_linear_infinite_reverse]" />
                <div
                    className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
                        darkMode ? 'bg-[#01343c]' : 'bg-[#f4ffee]'
                    } shadow-sm`}
                >
                    <img
                        src="/Frame 74.png"
                        alt=""
                        className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                    />
                </div>
            </div>

            <p
                className={`mt-8 text-xs font-bold uppercase tracking-[0.2em] ${
                    darkMode ? 'text-white/90' : 'text-[#002f37]'
                }`}
            >
                AgriLync
            </p>
            <div className="mt-3 flex gap-1.5" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#7ede56] animate-bounce" />
            </div>
        </div>
    );
};

export default Preloader;
