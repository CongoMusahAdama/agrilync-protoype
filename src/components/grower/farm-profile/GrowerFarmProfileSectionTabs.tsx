import React, { useState } from 'react';
import { ClipboardList, Sprout } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GrowerStageTrackerPanel from '@/components/grower/farm-profile/GrowerStageTrackerPanel';
import { GrowerActivitiesSection } from '@/components/grower/farm-profile/GrowerActivitiesTable';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import { GROWER_TAB_ACTIVE, GROWER_TAB_INACTIVE } from '@/constants/growerTheme';
import type { FarmProfileActivity, FarmProfileTracker } from '@/types/growerFarmProfile';

type Props = {
    trackers: FarmProfileTracker[];
    activities: FarmProfileActivity[];
    showFarmColumn?: boolean;
};

const tabTriggerClass = (active: boolean) =>
    `flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 rounded-none transition-all font-inter ${
        active ? GROWER_TAB_ACTIVE : GROWER_TAB_INACTIVE
    }`;

const GrowerFarmProfileSectionTabs: React.FC<Props> = ({
    trackers,
    activities,
    showFarmColumn,
}) => {
    const [activeTab, setActiveTab] = useState<'stages' | 'activities'>(() =>
        trackers.length > 0 ? 'stages' : 'activities'
    );

    if (!trackers.length && activities.length === 0) return null;

    return (
        <div className={GROWER_DASHBOARD_FONT}>
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as 'stages' | 'activities')}
                className="w-full"
            >
                <TabsList className="flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide bg-transparent p-0 h-auto gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-gray-200">
                    {trackers.length > 0 && (
                        <TabsTrigger
                            value="stages"
                            className={tabTriggerClass(activeTab === 'stages')}
                        >
                            <Sprout className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                            <span className="hidden sm:inline">Farm stage tracker</span>
                            <span className="sm:hidden">Stages</span>
                        </TabsTrigger>
                    )}
                    <TabsTrigger
                        value="activities"
                        className={tabTriggerClass(activeTab === 'activities')}
                    >
                        <ClipboardList className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                        <span className="hidden sm:inline">Recent activities</span>
                        <span className="sm:hidden">Activities</span>
                        <span className="ml-1">({activities.length})</span>
                    </TabsTrigger>
                </TabsList>

                {trackers.length > 0 && (
                    <TabsContent value="stages" className="mt-0 space-y-4">
                        <GrowerStageTrackerPanel trackers={trackers} />
                    </TabsContent>
                )}

                <TabsContent value="activities" className="mt-0 space-y-4">
                    <GrowerActivitiesSection
                        activities={activities}
                        showFarmColumn={showFarmColumn}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default GrowerFarmProfileSectionTabs;
