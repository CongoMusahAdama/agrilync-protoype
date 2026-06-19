import React from 'react';
import { MapPin } from 'lucide-react';
import { GROWER_PROFILE_CARD } from '@/constants/farmProfile';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import type { FarmProfileSummary } from '@/types/growerFarmProfile';

type Props = {
    summary: FarmProfileSummary;
};

function formatGps(gps?: { lat: number; lng: number } | null) {
    if (!gps?.lat) return '—';
    return `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`;
}

function formatSize(summary: FarmProfileSummary) {
    const acres = summary.measuredAcres ?? summary.farmSize;
    if (acres == null) return '—';
    return `${acres} acres`;
}

function formatRegion(summary: FarmProfileSummary) {
    return [summary.community, summary.district, summary.region].filter(Boolean).join(', ') || '—';
}

const GrowerFarmLocationCard: React.FC<Props> = ({ summary }) => {
    return (
        <section className={`${GROWER_PROFILE_CARD} ${GROWER_DASHBOARD_FONT} p-6 sm:p-7 lg:p-8 h-full`}>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                Farm location
            </h2>
            <dl className="space-y-4">
                <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Farm size
                    </dt>
                    <dd className="text-base font-bold text-[#002f37] mt-1">{formatSize(summary)}</dd>
                </div>
                <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Region
                    </dt>
                    <dd className="text-base font-bold text-[#002f37] mt-1">{formatRegion(summary)}</dd>
                </div>
                <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#065f46]" />
                        GPS location
                    </dt>
                    <dd className="text-sm font-mono font-semibold text-[#002f37] mt-1">
                        {formatGps(summary.gps)}
                    </dd>
                </div>
            </dl>
        </section>
    );
};

export default GrowerFarmLocationCard;
