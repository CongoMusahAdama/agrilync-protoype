import React from 'react';
import { CheckCircle2, Clock, CreditCard, ShieldCheck, TrendingUp, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    GD_BTN_PILL,
    GD_FONT,
    GD_HERO_BODY,
    GD_HERO_EYEBROW,
    GD_HERO_TITLE,
} from '@/constants/growerDashboardTypography';

const FARM_HERO_IMAGE =
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop';

type GrowerStatusHeroProps = {
    status: 'active' | 'pending' | 'returned' | 'incomplete';
    growerName?: string;
    onViewCard?: () => void;
    className?: string;
    /** Shorter hero for mobile home — keeps farm snapshot above the fold */
    compact?: boolean;
};

type HeroTheme = {
    container: string;
    gradient: string;
    imageOpacity: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    iconWrap: string;
    iconColor: string;
    Icon: React.ComponentType<{ className?: string }>;
    showCard: boolean;
    btnClass: string;
    rounded: string;
};

const GrowerStatusHero: React.FC<GrowerStatusHeroProps> = ({
    status,
    growerName,
    onViewCard,
    className = '',
    compact = false,
}) => {
    const themes: Record<GrowerStatusHeroProps['status'], HeroTheme> = {
        active: {
            container: 'bg-[#ffcc00] border border-black/5',
            gradient: 'from-[#ffcc00] via-[#ffcc00]/35 to-transparent',
            imageOpacity: 'opacity-80',
            eyebrow: 'text-black/75',
            title: 'text-black',
            subtitle: 'text-black/65',
            iconWrap: 'bg-black/10 backdrop-blur-sm border border-black/5',
            iconColor: 'text-black',
            Icon: ShieldCheck,
            showCard: true,
            btnClass: 'bg-[#002f37] hover:bg-[#002f37]/90 text-white rounded-xl shadow-md',
            rounded: 'rounded-[2rem]',
        },
        pending: {
            container: 'bg-amber-500 border border-amber-600/20',
            gradient: 'from-amber-500 via-amber-500/35 to-transparent',
            imageOpacity: 'opacity-70',
            eyebrow: 'text-black/75',
            title: 'text-black',
            subtitle: 'text-black/65',
            iconWrap: 'bg-black/10 backdrop-blur-sm border border-black/5',
            iconColor: 'text-black',
            Icon: Clock,
            showCard: false,
            btnClass: '',
            rounded: 'rounded-[2rem]',
        },
        returned: {
            container: 'bg-[#002f37] border border-white/5',
            gradient: 'from-[#002f37] via-[#002f37]/50 to-transparent',
            imageOpacity: 'opacity-55',
            eyebrow: 'text-red-400',
            title: 'text-white',
            subtitle: 'text-white/65',
            iconWrap: 'bg-red-400/20 backdrop-blur-md border border-red-400/30',
            iconColor: 'text-red-400',
            Icon: XCircle,
            showCard: false,
            btnClass: '',
            rounded: 'rounded-[1.75rem]',
        },
        incomplete: {
            container: 'bg-gray-700 border border-white/5',
            gradient: 'from-gray-800 via-gray-800/50 to-transparent',
            imageOpacity: 'opacity-45',
            eyebrow: 'text-white/70',
            title: 'text-white',
            subtitle: 'text-white/65',
            iconWrap: 'bg-white/10 backdrop-blur-md border border-white/10',
            iconColor: 'text-white/80',
            Icon: CheckCircle2,
            showCard: false,
            btnClass: '',
            rounded: 'rounded-[1.75rem]',
        },
    };

    const theme = themes[status];
    const Icon = theme.Icon;
    const statusIcon =
        status === 'active' ? (
            <TrendingUp className={`h-5 w-5 sm:h-6 sm:w-6 ${theme.iconColor}`} />
        ) : (
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${theme.iconColor}`} />
        );

    return (
        <div
            className={`relative w-full overflow-hidden shadow-xl group active:scale-[0.99] transition-transform sm:min-h-[8rem] sm:h-32 sm:mb-6 ${GD_FONT} ${
                compact ? 'mb-3 rounded-[1.25rem]' : 'mb-6'
            } ${theme.container} ${compact ? 'rounded-[1.25rem]' : theme.rounded} ${className}`}
        >
            <img
                src={FARM_HERO_IMAGE}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover ${theme.imageOpacity} transition-transform duration-[3s] group-hover:scale-105`}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient}`} />

            <div
                className={`relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 md:px-8 sm:py-0 sm:h-full sm:min-h-[8rem] ${
                    compact ? 'gap-2 px-4 py-3' : 'gap-3 px-5 py-4'
                }`}
            >
                <div className="flex items-start justify-between gap-3 sm:block sm:flex-1 min-w-0">
                    <div className={`min-w-0 flex-1 ${compact ? 'space-y-0.5' : 'space-y-1'}`}>
                        <span className={`${GD_HERO_EYEBROW} ${compact ? 'text-[8px]' : ''} ${theme.eyebrow}`}>
                            {status === 'active'
                                ? 'Verified Farm'
                                : status === 'pending'
                                  ? 'Under Review'
                                  : status === 'returned'
                                    ? 'Action Required'
                                    : 'Complete Profile'}
                        </span>
                        <h2 className={`${GD_HERO_TITLE} ${compact ? '!text-base' : ''} ${theme.title}`}>
                            {status === 'active'
                                ? 'Lync Grower Active'
                                : status === 'pending'
                                  ? 'Pending Verification'
                                  : status === 'returned'
                                    ? 'Profile Returned'
                                    : 'Profile Incomplete'}
                        </h2>
                        {!compact && (
                            <p className={`${GD_HERO_BODY} max-w-md line-clamp-2 sm:line-clamp-none ${theme.subtitle}`}>
                                {growerName ? `${growerName} · ` : ''}
                                {status === 'active'
                                    ? 'Your profile is verified.'
                                    : status === 'pending'
                                      ? 'Your field agent is reviewing your profile. Training is still available.'
                                      : status === 'returned'
                                        ? 'Update your profile based on your agent’s feedback, then save again.'
                                        : 'Finish your farm profile so your agent can verify you.'}
                            </p>
                        )}
                        {compact && (
                            <p className={`${GD_HERO_BODY} line-clamp-1 ${theme.subtitle}`}>
                                {status === 'active'
                                    ? 'Verified — tap to view your Lync card.'
                                    : status === 'pending'
                                      ? 'Under review by your field agent.'
                                      : status === 'returned'
                                        ? 'Update profile and save again.'
                                        : 'Complete your farm profile.'}
                            </p>
                        )}
                    </div>
                    {!compact && (
                        <div
                            className={`h-10 w-10 sm:hidden rounded-xl flex items-center justify-center shrink-0 ${theme.iconWrap}`}
                        >
                            {statusIcon}
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 shrink-0 w-full sm:w-auto">
                    {theme.showCard && onViewCard && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={onViewCard}
                            className={`${theme.btnClass} ${GD_BTN_PILL} ${compact ? 'h-9 px-3 text-[10px]' : 'h-10 px-4 text-[11px]'} w-full sm:w-auto tracking-wider gap-2`}
                        >
                            <CreditCard className="h-4 w-4 shrink-0" />
                            View my card
                        </Button>
                    )}
                    <div
                        className={`hidden sm:flex h-11 w-11 sm:h-12 sm:w-12 rounded-2xl items-center justify-center shadow-sm ${theme.iconWrap}`}
                    >
                        {statusIcon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowerStatusHero;
