import React, { useCallback, useEffect, useMemo, useState } from 'react';
import GrowerLayout from '@/components/grower/GrowerLayout';
import GrowerFarmLocationCard from '@/components/grower/farm-profile/GrowerFarmLocationCard';
import GrowerFarmSeasonCard from '@/components/grower/farm-profile/GrowerFarmSeasonCard';
import GrowerConfirmationTaps from '@/components/grower/farm-profile/GrowerConfirmationTaps';
import GrowerPerformanceSummary from '@/components/grower/farm-profile/GrowerPerformanceSummary';
import GrowerFarmProgressAnalytics from '@/components/grower/farm-profile/GrowerFarmProgressAnalytics';
import GrowerFarmProfileSectionTabs from '@/components/grower/farm-profile/GrowerFarmProfileSectionTabs';
import api from '@/utils/api';
import { DEV_GROWER_FARM_PROFILE, isGrowerLocalhostBypass } from '@/utils/devGrower';
import type { GrowerFarmProfileData, PendingConfirmation } from '@/types/growerFarmProfile';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

/** First planting-related activity date, else earliest activity in season */
function derivePlantingDate(
    activities: GrowerFarmProfileData['activities']
): string | null {
    const planting = activities.find((a) =>
        /plant/i.test(a.stageLabel || '') || /plant/i.test(a.activityType || '')
    );
    if (planting?.date) return planting.date;
    const sorted = [...activities].filter((a) => a.date).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0]?.date ?? null;
}

const GrowerProfile: React.FC = () => {
    const [profile, setProfile] = useState<GrowerFarmProfileData | null>(null);
    const [pending, setPending] = useState<PendingConfirmation[]>([]);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async () => {
        if (isGrowerLocalhostBypass()) {
            setProfile(DEV_GROWER_FARM_PROFILE);
            setPending(DEV_GROWER_FARM_PROFILE.pendingConfirmations);
            setLoading(false);
            return;
        }
        try {
            const res = await api.get('/grower/farm-profile');
            const data: GrowerFarmProfileData = {
                summary: res.data.summary,
                rating: res.data.rating,
                pendingConfirmations: res.data.pendingConfirmations || [],
                farms: res.data.farms || [],
                activities: res.data.activities || [],
                performance: res.data.performance,
            };
            setProfile(data);
            setPending(data.pendingConfirmations);
        } catch {
            toast.error('Could not load farm profile.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleConfirm = async (
        farmId: string,
        activityId: string,
        response: 'yes' | 'not_yet'
    ) => {
        if (isGrowerLocalhostBypass()) {
            setPending((prev) => prev.filter((p) => p.activityId !== activityId));
            toast.success(response === 'yes' ? 'Thanks — confirmed.' : 'Noted — your agent will follow up.');
            return;
        }
        try {
            await api.post('/grower/activities/confirm', { farmId, activityId, response });
            setPending((prev) => prev.filter((p) => p.activityId !== activityId));
            toast.success(response === 'yes' ? 'Thanks — confirmed.' : 'Noted — your agent will follow up.');
            await loadProfile();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg;
            toast.error(msg || 'Could not save confirmation.');
        }
    };

    const plantingDate = useMemo(
        () => (profile ? derivePlantingDate(profile.activities) : null),
        [profile]
    );

    if (loading) {
        return (
            <GrowerLayout activeSection="farm-profile" title="My Farm Profile" subtitle="">
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-[#065f46]" />
                    <p className="text-sm text-gray-500">Loading your farm profile…</p>
                </div>
            </GrowerLayout>
        );
    }

    if (!profile) {
        return (
            <GrowerLayout activeSection="farm-profile" title="My Farm Profile" subtitle="">
                <p className="text-sm text-gray-500 text-center py-12">Farm profile unavailable.</p>
            </GrowerLayout>
        );
    }

    const trackers = profile.farms.map((f) => f.stageTracker);
    const showFarmColumn = profile.farms.length > 1;
    const hasPending = pending.length > 0;

    const locationSeasonCards = (
        <>
            <GrowerFarmLocationCard summary={profile.summary} />
            <GrowerFarmSeasonCard
                currentSeason={profile.summary.currentSeason}
                plantingDate={plantingDate}
                lastAgentVisit={profile.performance.lastAgentVisit}
            />
        </>
    );

    return (
        <GrowerLayout activeSection="farm-profile" title="My Farm Profile" subtitle="" fullWidth>
            <div className={`${GROWER_DASHBOARD_FONT} w-full space-y-6 sm:space-y-8 pb-8`}>
                {hasPending ? (
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-stretch">
                        <GrowerConfirmationTaps
                            items={pending}
                            onConfirm={handleConfirm}
                            compact
                            className="lg:w-[min(100%,300px)] lg:shrink-0"
                        />
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                            {locationSeasonCards}
                        </div>
                    </div>
                ) : null}

                <GrowerPerformanceSummary
                    performance={profile.performance}
                    trackers={trackers}
                    summary={profile.summary}
                    rating={profile.rating}
                />

                <GrowerFarmProgressAnalytics
                    trackers={trackers}
                    activities={profile.activities}
                    performance={profile.performance}
                    currentSeason={profile.summary.currentSeason}
                />

                {!hasPending && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {locationSeasonCards}
                    </div>
                )}

                <GrowerFarmProfileSectionTabs
                    trackers={trackers}
                    activities={profile.activities}
                    showFarmColumn={showFarmColumn}
                />
            </div>
        </GrowerLayout>
    );
};

export default GrowerProfile;
