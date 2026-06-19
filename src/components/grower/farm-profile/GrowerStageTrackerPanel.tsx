import React, { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GROWER_PROFILE_CARD } from '@/constants/farmProfile';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import type { FarmProfileTracker } from '@/types/growerFarmProfile';

type Props = {
    trackers: FarmProfileTracker[];
};

function HorizontalTracker({ tracker }: { tracker: FarmProfileTracker }) {
    return (
        <div className="flex items-start justify-between gap-1 sm:gap-2 overflow-x-auto pb-2 pt-1">
            {tracker.stages.map((stage, idx) => {
                const isDone = stage.status === 'completed';
                const isNow = stage.status === 'current';
                const isLast = idx === tracker.stages.length - 1;

                return (
                    <div key={stage.key} className="flex items-start flex-1 min-w-[64px] sm:min-w-[72px]">
                        <div className="flex flex-col items-center flex-1 min-w-0">
                            <div
                                className={`rounded-full flex items-center justify-center border-2 transition-all ${
                                    isDone
                                        ? 'h-9 w-9 bg-[#065f46] border-[#065f46] text-white'
                                        : isNow
                                          ? 'h-11 w-11 bg-[#7ede56] border-[#7ede56] text-[#065f46] shadow-md scale-110'
                                          : 'h-9 w-9 bg-white border-gray-300 text-gray-300'
                                }`}
                            >
                                {isDone ? (
                                    <Check className="h-4 w-4" strokeWidth={3} />
                                ) : (
                                    <span className="text-[10px] font-black">{idx + 1}</span>
                                )}
                            </div>
                            <p
                                className={`text-[10px] sm:text-[11px] font-bold mt-2 text-center leading-tight px-0.5 ${
                                    isNow ? 'text-[#065f46]' : isDone ? 'text-[#002f37]' : 'text-gray-400'
                                }`}
                            >
                                {stage.label}
                            </p>
                        </div>
                        {!isLast && (
                            <div
                                className={`h-0.5 flex-1 mt-[18px] sm:mt-5 mx-0.5 min-w-[8px] rounded-full ${
                                    isDone ? 'bg-[#065f46]' : 'bg-gray-200'
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

const GrowerStageTrackerPanel: React.FC<Props> = ({ trackers }) => {
    const cropTracker = trackers.find((t) => t.category === 'crop');
    const livestockTracker = trackers.find((t) => t.category === 'livestock');
    const hasMixed = Boolean(cropTracker && livestockTracker);

    const defaultTab = cropTracker ? 'crop' : livestockTracker ? 'livestock' : 'crop';
    const [tab, setTab] = useState(defaultTab);

    const singleTracker = useMemo(() => {
        if (hasMixed) return null;
        return trackers[0] ?? null;
    }, [hasMixed, trackers]);

    if (!trackers.length) return null;

    return (
        <section className={`${GROWER_PROFILE_CARD} ${GROWER_DASHBOARD_FONT} p-6 sm:p-7 lg:p-8`}>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                Farm stage tracker
            </h2>

            {hasMixed && cropTracker && livestockTracker ? (
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="grid w-full max-w-xs grid-cols-2 mb-5 bg-gray-100">
                        <TabsTrigger
                            value="crop"
                            className="font-bold text-xs uppercase data-[state=active]:bg-[#065f46] data-[state=active]:text-white"
                        >
                            Crop
                        </TabsTrigger>
                        <TabsTrigger
                            value="livestock"
                            className="font-bold text-xs uppercase data-[state=active]:bg-[#065f46] data-[state=active]:text-white"
                        >
                            Livestock
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="crop" className="mt-0">
                        <p className="text-sm font-semibold text-[#002f37] mb-3">{cropTracker.farmName}</p>
                        <HorizontalTracker tracker={cropTracker} />
                    </TabsContent>
                    <TabsContent value="livestock" className="mt-0">
                        <p className="text-sm font-semibold text-[#002f37] mb-3">
                            {livestockTracker.farmName}
                        </p>
                        <HorizontalTracker tracker={livestockTracker} />
                    </TabsContent>
                </Tabs>
            ) : singleTracker ? (
                <>
                    <p className="text-sm font-semibold text-[#002f37] mb-3">{singleTracker.farmName}</p>
                    <HorizontalTracker tracker={singleTracker} />
                </>
            ) : null}
        </section>
    );
};

export default GrowerStageTrackerPanel;
