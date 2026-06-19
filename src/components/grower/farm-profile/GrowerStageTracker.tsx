import React from 'react';
import { Sprout } from 'lucide-react';
import GrowerProfileSection from '@/components/grower/farm-profile/GrowerProfileSection';
import type { FarmProfileTracker } from '@/types/growerFarmProfile';

type Props = {
    tracker: FarmProfileTracker;
};

const GrowerStageTracker: React.FC<Props> = ({ tracker }) => {
    const categoryLabel = tracker.category === 'livestock' ? 'Livestock' : 'Crop';
    const done = tracker.stages.filter((s) => s.status === 'completed').length;
    const current = tracker.stages.find((s) => s.status === 'current');

    return (
        <GrowerProfileSection
            icon={<Sprout className="h-5 w-5" />}
            title={`${categoryLabel} · ${tracker.farmName}`}
            subtitle={tracker.crop}
            headerRight={
                <span className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-black">
                    {done}/{tracker.stages.length}
                </span>
            }
        >
            {/* Simple progress bar */}
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-4">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-[#065f46] to-[#7ede56] transition-all"
                    style={{
                        width: `${Math.max(8, (done / tracker.stages.length) * 100)}%`,
                    }}
                />
            </div>

            {current && (
                <p className="text-sm font-bold text-[#065f46] mb-4">
                    You are here: <span className="text-[#002f37]">{current.label}</span>
                </p>
            )}

            {/* Compact step row */}
            <div className="flex items-start justify-between gap-1 overflow-x-auto pb-1">
                {tracker.stages.map((stage, idx) => {
                    const isDone = stage.status === 'completed';
                    const isNow = stage.status === 'current';
                    const isLast = idx === tracker.stages.length - 1;

                    return (
                        <div key={stage.key} className="flex items-start flex-1 min-w-[52px]">
                            <div className="flex flex-col items-center flex-1 min-w-0">
                                <div
                                    className={`h-3 w-3 rounded-full shrink-0 ring-2 ring-offset-2 ${
                                        isDone
                                            ? 'bg-[#065f46] ring-[#065f46]/30'
                                            : isNow
                                              ? 'bg-[#7ede56] ring-[#7ede56]/50 scale-125'
                                              : 'bg-gray-200 ring-gray-200'
                                    }`}
                                />
                                <p
                                    className={`text-[10px] font-bold mt-2 text-center leading-tight px-0.5 ${
                                        isNow ? 'text-[#065f46]' : isDone ? 'text-[#002f37]' : 'text-gray-400'
                                    }`}
                                >
                                    {stage.label}
                                </p>
                            </div>
                            {!isLast && (
                                <div
                                    className={`h-0.5 flex-1 mt-1.5 mx-0.5 min-w-[6px] rounded-full ${
                                        isDone ? 'bg-[#065f46]' : 'bg-gray-200'
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </GrowerProfileSection>
    );
};

export default GrowerStageTracker;
