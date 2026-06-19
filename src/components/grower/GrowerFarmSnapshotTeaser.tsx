import React from 'react';
import { ChevronDown, Sprout } from 'lucide-react';
import { GD_BODY_SM, GD_FONT } from '@/constants/growerDashboardTypography';

type GrowerFarmSnapshotTeaserProps = {
    crop: string;
    stageLabel: string;
    onTap: () => void;
};

const GrowerFarmSnapshotTeaser: React.FC<GrowerFarmSnapshotTeaserProps> = ({
    crop,
    stageLabel,
    onTap,
}) => (
    <button
        type="button"
        onClick={onTap}
        className={`w-full bg-white rounded-xl border border-dashed border-[#065f46]/25 px-3 py-2.5 flex items-center gap-2.5 active:bg-[#065f46]/5 transition-colors ${GD_FONT}`}
        aria-label={`Jump to farm snapshot for ${crop}`}
    >
        <Sprout className="h-4 w-4 text-[#065f46] shrink-0" aria-hidden />
        <span className={`flex-1 min-w-0 text-left ${GD_BODY_SM} truncate`}>
            <span className="font-semibold text-[#065f46]">Farm snapshot</span>
            {' — '}
            {crop}, {stageLabel}
        </span>
        <ChevronDown className="h-4 w-4 text-[#065f46] animate-bounce shrink-0" aria-hidden />
    </button>
);

export default GrowerFarmSnapshotTeaser;
