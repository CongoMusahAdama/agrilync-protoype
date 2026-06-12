import React, { useState } from 'react';
import { Leaf } from 'lucide-react';

/** Same asset used on the marketing site navbar & footer */
export const AGRILYNC_LOGO_SRC = '/Frame 74.png';
export const AGRILYNC_LOGO_ALT_SRC = '/lovable-uploads/Frame 74.png';

type AgriLyncLogoProps = {
    variant?: 'onDark' | 'onLight';
    showWordmark?: boolean;
    className?: string;
    /** Height class for the logo image (e.g. h-9, h-12) */
    iconClassName?: string;
};

const AgriLyncLogo: React.FC<AgriLyncLogoProps> = ({
    variant = 'onDark',
    showWordmark = true,
    className = '',
    iconClassName = 'h-9',
}) => {
    const [src, setSrc] = useState(AGRILYNC_LOGO_SRC);
    const [svgFallback, setSvgFallback] = useState(false);
    const onDark = variant === 'onDark';
    const heightClass = iconClassName.includes('h-') ? iconClassName : `h-9 ${iconClassName}`;

    const handleError = () => {
        if (src === AGRILYNC_LOGO_SRC) setSrc(AGRILYNC_LOGO_ALT_SRC);
        else setSvgFallback(true);
    };

    if (!svgFallback) {
        return (
            <div className={`flex items-center min-w-0 ${className}`}>
                <img
                    src={src}
                    alt="AgriLync"
                    crossOrigin="anonymous"
                    onError={handleError}
                    className={`${heightClass} w-auto object-contain object-left ${
                        onDark ? 'brightness-0 invert' : ''
                    } ${!showWordmark ? 'max-w-[32px]' : ''}`}
                    draggable={false}
                />
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
            <div
                className={`${heightClass} aspect-square rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
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

/** Faint logo watermark for official documents & ID cards */
export const AgriLyncLogoWatermark: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        aria-hidden
    >
        <img
            src={AGRILYNC_LOGO_SRC}
            alt=""
            crossOrigin="anonymous"
            onError={(e) => {
                const img = e.currentTarget;
                if (img.src.endsWith(encodeURI(AGRILYNC_LOGO_SRC)) || img.getAttribute('src') === AGRILYNC_LOGO_SRC) {
                    img.src = AGRILYNC_LOGO_ALT_SRC;
                }
            }}
            className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[58%] max-w-[280px] opacity-[0.07] object-contain select-none"
            draggable={false}
        />
    </div>
);

export default AgriLyncLogo;
