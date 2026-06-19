import React from 'react';
import { Card } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

export type GrowerHighlightMetricCardProps = {
    title: string;
    value: string | number;
    subtext: string;
    color: string;
    icon: LucideIcon;
    compact?: boolean;
    /** Match homepage / farm profile desktop metric row */
    hero?: boolean;
    rounded?: boolean;
    className?: string;
};

const GrowerHighlightMetricCard: React.FC<GrowerHighlightMetricCardProps> = ({
    title,
    value,
    subtext,
    color,
    icon: Icon,
    compact = false,
    hero = false,
    rounded = false,
    className = '',
}) => {
    const heightClass = hero
        ? 'h-24 lg:h-40'
        : compact
          ? 'h-[5.25rem]'
          : 'h-[5.5rem] sm:h-28';

    return (
        <Card
            className={`${color} border-none ${rounded ? 'rounded-xl' : 'rounded-none'} ${heightClass} flex flex-col justify-between shadow-lg relative overflow-hidden font-inter ${hero ? 'lg:shadow-xl' : ''} ${className}`}
        >
            <div
                className={`absolute ${hero ? '-right-3 lg:-right-6 -bottom-3 lg:-bottom-6' : '-right-3 -bottom-3'} opacity-10 pointer-events-none`}
            >
                <Icon
                    className={`${
                        hero
                            ? 'h-12 w-12 lg:h-32 lg:w-32'
                            : compact
                              ? 'h-12 w-12'
                              : 'h-16 w-16 sm:h-20 sm:w-20'
                    } text-white rotate-12`}
                />
            </div>

            <div
                className={`${hero ? 'p-3 lg:p-8' : compact ? 'p-2.5' : 'p-3 sm:p-4'} h-full flex flex-col justify-between relative z-10`}
            >
                <div className={`flex items-center ${hero ? 'gap-1.5 lg:gap-3' : 'gap-1.5'} min-w-0`}>
                    <div
                        className={`${hero ? 'p-1 lg:p-2.5 rounded-lg lg:rounded-2xl bg-white/10 backdrop-blur-md' : 'p-1 rounded-lg bg-white/15'} border border-white/10 shrink-0`}
                    >
                        <Icon
                            className={`${
                                hero ? 'h-3 w-3 lg:h-6 lg:w-6' : 'h-3 w-3 sm:h-3.5 sm:w-3.5'
                            } text-white`}
                        />
                    </div>
                    <span
                        className={`${
                            hero
                                ? 'text-[7.5px] lg:text-[11px] tracking-widest lg:tracking-[0.2em] text-white/80 lg:text-white'
                                : 'text-[7px] sm:text-[8px] tracking-widest text-white/90'
                        } font-black uppercase leading-none truncate font-inter`}
                    >
                        {title}
                    </span>
                </div>

                <div className={hero ? 'space-y-0' : undefined}>
                    <p
                        className={`${
                            hero
                                ? 'text-[18px] lg:text-4xl'
                                : compact
                                  ? 'text-[17px]'
                                  : 'text-lg sm:text-2xl'
                        } font-black text-white leading-none tracking-tight truncate font-inter`}
                    >
                        {value}
                    </p>
                    <span
                        className={`${
                            hero
                                ? 'text-[8px] lg:text-[12px] tracking-tight lg:tracking-widest text-white/50 lg:text-white/60'
                                : 'text-[7px] sm:text-[8px] tracking-wide text-white/60'
                        } font-bold uppercase line-clamp-1 font-inter`}
                    >
                        {subtext}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default GrowerHighlightMetricCard;
