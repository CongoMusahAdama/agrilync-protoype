import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ClipboardList, GraduationCap, Layers, Star } from 'lucide-react';
import GrowerHighlightMetricCard from '@/components/grower/GrowerHighlightMetricCard';
import GrowerFarmIdentityMetricCard from '@/components/grower/farm-profile/GrowerFarmIdentityMetricCard';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import type {
    FarmProfilePerformance,
    FarmProfileRating,
    FarmProfileSummary,
    FarmProfileTracker,
} from '@/types/growerFarmProfile';

type Props = {
    performance: FarmProfilePerformance;
    trackers?: FarmProfileTracker[];
    summary?: FarmProfileSummary;
    rating?: FarmProfileRating;
    /** Tighter 2×2 grid when beside the confirm card */
    compactLayout?: boolean;
    className?: string;
};

/** @deprecated use compactLayout */
type LegacyProps = Props & { besideConfirm?: boolean };

function daysSince(dateStr: string | null) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '—';
    const days = Math.max(0, Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)));
    return String(days);
}

function RatingMetricCard({
    stars,
    isConfirmed,
    note,
    compact,
    className = '',
}: {
    stars: number;
    isConfirmed: boolean;
    note: string;
    compact?: boolean;
    className?: string;
}) {
    return (
        <Card
            className={`bg-amber-600 border-none rounded-none flex flex-col justify-between shadow-lg relative overflow-hidden font-inter ${
                compact ? 'h-[5.25rem]' : 'h-24 lg:h-40 lg:shadow-xl'
            } ${className}`}
        >
            <div
                className={`absolute opacity-10 pointer-events-none ${
                    compact ? '-right-2 -bottom-2' : '-right-3 lg:-right-6 -bottom-3 lg:-bottom-6'
                }`}
            >
                <Star
                    className={`${compact ? 'h-10 w-10' : 'h-12 w-12 lg:h-32 lg:w-32'} text-white rotate-12`}
                />
            </div>

            <div className={`${compact ? 'p-2.5' : 'p-3 lg:p-8'} h-full flex flex-col justify-between relative z-10`}>
                <div className={`flex items-center min-w-0 ${compact ? 'gap-1' : 'gap-1.5 lg:gap-3'}`}>
                    <div
                        className={`bg-white/10 border border-white/10 shrink-0 ${
                            compact ? 'p-0.5 rounded-md' : 'p-1 lg:p-2.5 rounded-lg lg:rounded-2xl backdrop-blur-md'
                        }`}
                    >
                        <Star className={`${compact ? 'h-2.5 w-2.5' : 'h-3 w-3 lg:h-6 lg:w-6'} text-white`} />
                    </div>
                    <span
                        className={`font-black text-white/90 uppercase leading-none truncate font-inter ${
                            compact
                                ? 'text-[6.5px] tracking-widest'
                                : 'text-[7.5px] lg:text-[11px] tracking-widest lg:tracking-[0.2em] text-white/80 lg:text-white'
                        }`}
                    >
                        Your rating
                    </span>
                </div>

                <div>
                    <div className={`flex items-center ${compact ? 'gap-px' : 'gap-0.5 lg:gap-1'}`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                                key={n}
                                className={`${
                                    compact ? 'h-3 w-3' : 'h-4 w-4 lg:h-7 lg:w-7'
                                } ${
                                    n <= stars
                                        ? isConfirmed
                                            ? 'fill-white text-white'
                                            : 'fill-white/50 text-white/50'
                                        : 'text-white/25'
                                }`}
                                strokeWidth={1.5}
                            />
                        ))}
                    </div>
                    {!compact && (
                        <span className="text-[8px] lg:text-[12px] font-bold text-white/50 lg:text-white/60 uppercase tracking-tight lg:tracking-widest font-inter line-clamp-2 leading-snug mt-1">
                            {note || 'No rating note yet'}
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
}

const GrowerPerformanceSummary: React.FC<LegacyProps> = ({
    performance,
    trackers = [],
    summary,
    rating,
    compactLayout,
    besideConfirm = false,
    className = '',
}) => {
    const isCompact = compactLayout ?? besideConfirm;
    const showIdentity = Boolean(summary && rating);
    const totalStages = useMemo(() => {
        if (!trackers.length) return performance.trainingModulesTotal * 2;
        return trackers.reduce((sum, t) => sum + t.stages.length, 0);
    }, [trackers, performance.trainingModulesTotal]);

    const displayStars = performance.rating.isConfirmed
        ? performance.rating.stars
        : performance.rating.proposedStars;

    const compact = isCompact;
    const cardWidth = isCompact ? 'w-[158px] sm:w-[168px]' : '';

    return (
        <section className={`${GROWER_DASHBOARD_FONT} w-full min-w-0 ${className}`}>
            <div
                className={
                    isCompact
                        ? 'grid grid-cols-2 gap-2.5 w-fit'
                        : showIdentity
                          ? 'grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4'
                          : 'grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4'
                }
            >
                {showIdentity && summary && rating && (
                    <GrowerFarmIdentityMetricCard
                        summary={summary}
                        rating={rating}
                        trackers={trackers}
                        compact={compact}
                        className={isCompact ? cardWidth : 'col-span-2 lg:col-span-2'}
                    />
                )}
                <GrowerHighlightMetricCard
                    title="Stages"
                    value={`${performance.stagesCompleted}/${totalStages}`}
                    subtext="completed"
                    color="bg-[#065f46]"
                    icon={Layers}
                    compact={compact}
                    hero={!compact}
                    className={cardWidth}
                />
                <GrowerHighlightMetricCard
                    title="Training"
                    value={`${performance.trainingModulesCompleted}/${performance.trainingModulesTotal}`}
                    subtext="modules"
                    color="bg-blue-600"
                    icon={GraduationCap}
                    compact={compact}
                    hero={!compact}
                    className={cardWidth}
                />
                <GrowerHighlightMetricCard
                    title="Last visit"
                    value={daysSince(performance.lastAgentVisit)}
                    subtext="days ago"
                    color="bg-rose-600"
                    icon={ClipboardList}
                    compact={compact}
                    hero={!compact}
                    className={cardWidth}
                />
                <RatingMetricCard
                    stars={displayStars}
                    isConfirmed={performance.rating.isConfirmed}
                    note={performance.rating.note}
                    compact={compact}
                    className={cardWidth}
                />
            </div>
        </section>
    );
};

export default GrowerPerformanceSummary;
