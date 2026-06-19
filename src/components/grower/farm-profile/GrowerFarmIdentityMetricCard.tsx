import React, { useMemo } from 'react';
import { Beef, Sprout, Star, Trees } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FARM_STATUS_LABELS, PRIMARY_ACTIVITY_LABELS } from '@/constants/farmProfile';
import { resolveFarmIdentityBackground } from '@/utils/farmIdentityBackground';
import type {
    FarmProfileRating,
    FarmProfileSummary,
    FarmProfileTracker,
} from '@/types/growerFarmProfile';

type Props = {
    summary: FarmProfileSummary;
    rating: FarmProfileRating;
    trackers?: FarmProfileTracker[];
    compact?: boolean;
    className?: string;
};

function ActivityIcon({ activity }: { activity: FarmProfileSummary['primaryActivity'] }) {
    const cls = 'h-3 w-3 lg:h-4 lg:w-4 text-white';
    if (activity === 'livestock') return <Beef className={cls} aria-hidden />;
    if (activity === 'mixed') return <Trees className={cls} aria-hidden />;
    return <Sprout className={cls} aria-hidden />;
}

function statusBadgeClass(flag: FarmProfileSummary['farmStatusFlag'], compact: boolean) {
    const size = compact ? 'text-[7px] px-1.5 py-0.5' : 'text-[8px] lg:text-[9px] px-2 py-0.5';
    if (flag === 'at_risk') {
        return `shrink-0 border-0 font-black uppercase tracking-wide bg-amber-400/90 text-amber-950 backdrop-blur-sm ${size}`;
    }
    if (flag === 'off_track') {
        return `shrink-0 border-0 font-black uppercase tracking-wide bg-red-500/90 text-white backdrop-blur-sm ${size}`;
    }
    return `shrink-0 border-0 font-black uppercase tracking-wide bg-[#7ede56]/90 text-[#065f46] backdrop-blur-sm ${size}`;
}

function BackgroundPhoto({ background }: { background: ReturnType<typeof resolveFarmIdentityBackground> }) {
    if (background.mode === 'split') {
        return (
            <>
                <div
                    className={`absolute inset-y-0 left-0 w-[52%] bg-cover scale-105 ${background.leftPosition}`}
                    style={{ backgroundImage: `url('${background.left}')` }}
                    aria-hidden
                />
                <div
                    className={`absolute inset-y-0 right-0 w-[52%] bg-cover scale-105 ${background.rightPosition}`}
                    style={{ backgroundImage: `url('${background.right}')` }}
                    aria-hidden
                />
            </>
        );
    }

    return (
        <div
            className={`absolute inset-0 bg-cover scale-105 ${background.position}`}
            style={{ backgroundImage: `url('${background.image}')` }}
            aria-hidden
        />
    );
}

const GrowerFarmIdentityMetricCard: React.FC<Props> = ({
    summary,
    rating,
    trackers = [],
    compact = false,
    className = '',
}) => {
    const status = FARM_STATUS_LABELS[summary.farmStatusFlag] || FARM_STATUS_LABELS.on_track;
    const activityLabel = PRIMARY_ACTIVITY_LABELS[summary.primaryActivity] || summary.primaryActivity;
    const starCount = rating.isConfirmed ? rating.stars : rating.proposedStars;
    const heightClass = compact ? 'h-[5.25rem]' : 'h-24 lg:h-40 lg:shadow-xl';

    const background = useMemo(
        () => resolveFarmIdentityBackground(summary, trackers),
        [summary, trackers]
    );

    return (
        <Card
            className={`border-none rounded-none flex flex-col justify-between shadow-lg relative overflow-hidden font-inter ${heightClass} ${className}`}
        >
            <BackgroundPhoto background={background} />

            <div
                className="absolute inset-0 bg-gradient-to-r from-[#065f46]/95 via-[#065f46]/85 to-[#065f46]/35"
                aria-hidden
            />
            <div
                className="absolute inset-0 bg-gradient-to-t from-[#002f37]/80 via-transparent to-[#065f46]/15"
                aria-hidden
            />

            <div
                className={`${compact ? 'p-2.5' : 'p-3 lg:p-5'} h-full flex flex-col justify-between relative z-10 min-w-0`}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <div className="p-1 rounded-lg bg-white/15 border border-white/20 backdrop-blur-md shrink-0">
                            <ActivityIcon activity={summary.primaryActivity} />
                        </div>
                        <span
                            className={`font-black uppercase leading-none truncate text-white/90 ${
                                compact
                                    ? 'text-[6.5px] tracking-widest'
                                    : 'text-[7.5px] lg:text-[10px] tracking-widest lg:tracking-[0.18em]'
                            }`}
                        >
                            My farm
                        </span>
                    </div>
                    <Badge className={statusBadgeClass(summary.farmStatusFlag, compact)}>
                        {status.label}
                    </Badge>
                </div>

                <div className="min-w-0 mt-1">
                    <p
                        className={`font-black text-white leading-tight line-clamp-2 drop-shadow-sm ${
                            compact ? 'text-[13px]' : 'text-sm lg:text-lg'
                        }`}
                    >
                        {summary.farmName}
                    </p>
                    <p
                        className={`font-bold text-white/75 uppercase tracking-wide mt-1 truncate ${
                            compact ? 'text-[7px]' : 'text-[7px] lg:text-[10px]'
                        }`}
                    >
                        {summary.farmId} · {activityLabel}
                    </p>
                    <div
                        className={`flex items-center gap-0.5 mt-1.5 ${compact ? '' : 'lg:mt-2'}`}
                        aria-label={`${starCount} out of 5 stars`}
                    >
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                                key={n}
                                className={`${
                                    compact ? 'h-2.5 w-2.5' : 'h-3 w-3 lg:h-4 lg:w-4'
                                } drop-shadow-sm ${
                                    n <= starCount
                                        ? rating.isConfirmed
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'fill-white/50 text-white/50'
                                        : 'text-white/25'
                                }`}
                                strokeWidth={1.5}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default GrowerFarmIdentityMetricCard;
