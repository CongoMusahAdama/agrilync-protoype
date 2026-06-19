import React from 'react';
import { Calendar } from 'lucide-react';
import { GROWER_PROFILE_CARD } from '@/constants/farmProfile';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';

type Props = {
    currentSeason: string;
    plantingDate?: string | null;
    lastAgentVisit?: string | null;
};

function formatDate(value?: string | null) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const GrowerFarmSeasonCard: React.FC<Props> = ({ currentSeason, plantingDate, lastAgentVisit }) => {
    return (
        <section className={`${GROWER_PROFILE_CARD} ${GROWER_DASHBOARD_FONT} p-6 sm:p-7 lg:p-8 h-full`}>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#065f46]" />
                Season & visits
            </h2>
            <dl className="space-y-4">
                <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Current season
                    </dt>
                    <dd className="text-base font-bold text-[#002f37] mt-1">{currentSeason || '—'}</dd>
                </div>
                <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Planting date
                    </dt>
                    <dd className="text-base font-bold text-[#002f37] mt-1">{formatDate(plantingDate)}</dd>
                </div>
                <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Last agent visit
                    </dt>
                    <dd className="text-base font-bold text-[#002f37] mt-1">{formatDate(lastAgentVisit)}</dd>
                </div>
            </dl>
        </section>
    );
};

export default GrowerFarmSeasonCard;
