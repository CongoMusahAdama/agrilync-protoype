import React from 'react';
import { Star } from 'lucide-react';
import GrowerProfileSection from '@/components/grower/farm-profile/GrowerProfileSection';
import type { FarmProfileRating } from '@/types/growerFarmProfile';

type Props = {
    rating: FarmProfileRating;
};

const GrowerPerformanceRating: React.FC<Props> = ({ rating }) => {
    const displayStars = rating.isConfirmed ? rating.stars : rating.proposedStars;

    return (
        <GrowerProfileSection
            icon={<Star className="h-5 w-5" />}
            title="Field rating"
            subtitle="From your agent & admin"
        >
            <div className="flex flex-col items-center py-4 sm:py-6">
                <div className="flex items-center gap-1.5 mb-4">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                            key={n}
                            className={`h-9 w-9 sm:h-10 sm:w-10 transition-colors ${
                                n <= displayStars
                                    ? rating.isConfirmed
                                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                        : 'fill-gray-200 text-gray-300'
                                    : 'text-gray-200'
                            }`}
                            strokeWidth={1.5}
                        />
                    ))}
                </div>

                {rating.isConfirmed ? (
                    <>
                        <p className="text-4xl font-black text-[#002f37] tabular-nums">
                            {rating.stars}
                            <span className="text-xl font-bold text-gray-300">/5</span>
                        </p>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-2">
                            Verified
                        </p>
                    </>
                ) : rating.isPendingReview ? (
                    <p className="text-sm text-center text-amber-700 font-semibold max-w-[220px] leading-relaxed">
                        Your agent submitted a rating — admin review in progress
                    </p>
                ) : (
                    <p className="text-sm text-center text-gray-500 max-w-[220px] leading-relaxed">
                        Your rating appears here after field visits
                    </p>
                )}
            </div>
        </GrowerProfileSection>
    );
};

export default GrowerPerformanceRating;
