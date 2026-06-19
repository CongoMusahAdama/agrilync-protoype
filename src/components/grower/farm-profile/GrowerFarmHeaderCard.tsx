import React from 'react';
import { Beef, Sprout, Trees } from 'lucide-react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FARM_STATUS_LABELS, GROWER_PROFILE_CARD, PRIMARY_ACTIVITY_LABELS } from '@/constants/farmProfile';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import type { FarmProfileRating, FarmProfileSummary } from '@/types/growerFarmProfile';

type Props = {
    summary: FarmProfileSummary;
    rating: FarmProfileRating;
};

function ActivityIcon({ activity }: { activity: FarmProfileSummary['primaryActivity'] }) {
    const cls = 'h-4 w-4 text-[#065f46]';
    if (activity === 'livestock') return <Beef className={cls} aria-hidden />;
    if (activity === 'mixed') return <Trees className={cls} aria-hidden />;
    return <Sprout className={cls} aria-hidden />;
}

function StarRow({ rating }: { rating: FarmProfileRating }) {
    const count = rating.isConfirmed ? rating.stars : rating.proposedStars;
    return (
        <div className="flex items-center justify-end gap-1" aria-label={`${count} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    className={`h-6 w-6 sm:h-7 sm:w-7 ${
                        n <= count
                            ? rating.isConfirmed
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-gray-300 text-gray-300'
                            : 'text-gray-200'
                    }`}
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
}

const GrowerFarmHeaderCard: React.FC<Props> = ({ summary, rating }) => {
    const status = FARM_STATUS_LABELS[summary.farmStatusFlag] || FARM_STATUS_LABELS.on_track;
    const activityLabel = PRIMARY_ACTIVITY_LABELS[summary.primaryActivity] || summary.primaryActivity;

    return (
        <section className={`${GROWER_PROFILE_CARD} ${GROWER_DASHBOARD_FONT} p-6 sm:p-8 lg:p-10`}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#002f37] leading-tight tracking-tight">
                        {summary.farmName}
                    </h1>
                    <p className="text-sm font-mono font-bold text-[#065f46] mt-2">{summary.farmId}</p>
                    <p className="flex items-center gap-2 text-sm font-semibold text-gray-600 mt-3">
                        <ActivityIcon activity={summary.primaryActivity} />
                        {activityLabel}
                    </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <Badge
                        className={`text-xs font-black uppercase tracking-wider px-4 py-2 border-0 ${status.className}`}
                    >
                        {status.label}
                    </Badge>
                    <StarRow rating={rating} />
                    {!rating.isConfirmed && rating.isPendingReview && (
                        <p className="text-[11px] text-amber-700 font-medium text-right max-w-[200px]">
                            Rating pending admin review
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default GrowerFarmHeaderCard;
