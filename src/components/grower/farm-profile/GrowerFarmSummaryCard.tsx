import React from 'react';
import { MapPin, Ruler, Satellite, Sprout, Wheat } from 'lucide-react';
import GrowerProfileSection from '@/components/grower/farm-profile/GrowerProfileSection';
import { PRIMARY_ACTIVITY_LABELS } from '@/constants/farmProfile';
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

const DETAIL_ROWS = [
    { key: 'size', icon: Ruler, label: 'Farm size', getValue: formatSize },
    { key: 'gps', icon: Satellite, label: 'GPS', getValue: (s: FarmProfileSummary) => formatGps(s.gps) },
    {
        key: 'activity',
        icon: Sprout,
        label: 'Primary activity',
        getValue: (s: FarmProfileSummary) =>
            PRIMARY_ACTIVITY_LABELS[s.primaryActivity] || s.primaryActivity,
    },
    { key: 'season', icon: Wheat, label: 'Season', getValue: (s: FarmProfileSummary) => s.currentSeason },
] as const;

const GrowerFarmSummaryCard: React.FC<Props> = ({ summary }) => {
    return (
        <GrowerProfileSection
            icon={<MapPin className="h-5 w-5" />}
            title="Farm summary"
            subtitle={summary.farmId}
        >
            <h2 className="text-lg font-black text-[#002f37] leading-snug">{summary.farmName}</h2>
            <p className="text-sm text-gray-500 mt-2 flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#065f46] mt-0.5" />
                {[summary.community, summary.district, summary.region].filter(Boolean).join(', ') ||
                    '—'}
            </p>

            <dl className="mt-5 space-y-0 divide-y divide-gray-100 border-t border-gray-100">
                {DETAIL_ROWS.map(({ key, icon: Icon, label, getValue }) => (
                    <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                        <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <Icon className="h-3.5 w-3.5 text-[#065f46]" />
                            {label}
                        </dt>
                        <dd
                            className={`text-sm font-bold text-[#002f37] text-right ${key === 'gps' ? 'font-mono text-xs' : ''}`}
                        >
                            {getValue(summary)}
                        </dd>
                    </div>
                ))}
                <div className="flex items-center justify-between gap-4 py-3.5">
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#065f46]">
                        Current stage
                    </dt>
                    <dd className="text-sm font-black text-[#065f46]">
                        {summary.currentStageLabel || summary.currentStage || '—'}
                    </dd>
                </div>
            </dl>
        </GrowerProfileSection>
    );
};

export default GrowerFarmSummaryCard;
