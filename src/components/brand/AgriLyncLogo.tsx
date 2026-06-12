import React from 'react';
import { Leaf } from 'lucide-react';

type AgriLyncLogoProps = {
    variant?: 'onDark' | 'onLight';
    showWordmark?: boolean;
    className?: string;
    iconClassName?: string;
};

/** Inline brand mark — avoids broken /Frame 74.png and works with html2canvas print/export. */
const AgriLyncLogo: React.FC<AgriLyncLogoProps> = ({
    variant = 'onDark',
    showWordmark = true,
    className = '',
    iconClassName = 'h-9 w-9',
}) => {
    const onDark = variant === 'onDark';

    return (
        <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
            <div
                className={`${iconClassName} rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    onDark ? 'bg-[#7ede56]' : 'bg-[#065f46]'
                }`}
            >
                <Leaf className={`h-[55%] w-[55%] ${onDark ? 'text-[#002f37]' : 'text-[#7ede56]'}`} strokeWidth={2.5} />
            </div>
            {showWordmark && (
                <span
                    className={`font-black text-sm tracking-tight leading-none ${
                        onDark ? 'text-white' : 'text-[#002f37]'
                    }`}
                >
                    AgriLync
                </span>
            )}
        </div>
    );
};

export default AgriLyncLogo;
