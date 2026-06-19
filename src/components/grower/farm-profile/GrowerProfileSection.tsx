import React from 'react';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import { cn } from '@/lib/utils';
import { GROWER_PROFILE_CARD } from '@/constants/farmProfile';

type Props = {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    bodyClassName?: string;
    headerRight?: React.ReactNode;
};

const GrowerProfileSection: React.FC<Props> = ({
    icon,
    title,
    subtitle,
    children,
    className,
    bodyClassName,
    headerRight,
}) => {
    return (
        <section className={cn(GROWER_PROFILE_CARD, GROWER_DASHBOARD_FONT, 'h-full', className)}>
            <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#065f46] to-[#054f3a] text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    {icon && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/20 shadow-sm">
                            {icon}
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="text-sm font-black uppercase tracking-wider leading-tight">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-xs text-white/75 mt-0.5 font-medium">{subtitle}</p>
                        )}
                    </div>
                </div>
                {headerRight}
            </div>
            <div className={cn('p-5 sm:p-6', bodyClassName)}>{children}</div>
        </section>
    );
};

export default GrowerProfileSection;
