import { FARM_PARTNERSHIP_HERO_IMAGE } from '@/constants/farmProfile';
import type { FarmProfileSummary, FarmProfileTracker } from '@/types/growerFarmProfile';

const CROP_PHOTO = '/lovable-uploads/image%20copy%2020.png';
const LIVESTOCK_PHOTO = '/lovable-uploads/image%20copy%2021.png';
const COCOA_PHOTO = FARM_PARTNERSHIP_HERO_IMAGE;

export type FarmIdentityBackground =
    | { mode: 'single'; image: string; position: string }
    | { mode: 'split'; left: string; right: string; leftPosition: string; rightPosition: string };

function matchesCrop(text: string, keywords: string[]) {
    const lower = text.toLowerCase();
    return keywords.some((k) => lower.includes(k));
}

function cropBackground(cropLabel: string): { image: string; position: string } {
    if (matchesCrop(cropLabel, ['cocoa', 'cacao'])) {
        return { image: COCOA_PHOTO, position: 'bg-[center_35%] lg:bg-[right_center]' };
    }
    return { image: CROP_PHOTO, position: 'bg-center' };
}

function livestockBackground(cropLabel: string): { image: string; position: string } {
    if (matchesCrop(cropLabel, ['poultry', 'chicken', 'broiler', 'layer'])) {
        return { image: LIVESTOCK_PHOTO, position: 'bg-[center_40%]' };
    }
    if (matchesCrop(cropLabel, ['goat', 'sheep'])) {
        return { image: '/lovable-uploads/emmanuel-the-goat.png', position: 'bg-center' };
    }
    return { image: LIVESTOCK_PHOTO, position: 'bg-center' };
}

function trackerBg(tracker: FarmProfileTracker) {
    const label = `${tracker.crop} ${tracker.farmName}`;
    return tracker.category === 'livestock'
        ? livestockBackground(label)
        : cropBackground(label);
}

/** Pick metric-card background photo(s) from what the farmer actually grows */
export function resolveFarmIdentityBackground(
    summary: FarmProfileSummary,
    trackers: FarmProfileTracker[] = []
): FarmIdentityBackground {
    const cropTrackers = trackers.filter((t) => t.category === 'crop');
    const livestockTrackers = trackers.filter((t) => t.category === 'livestock');
    const fallbackLabel = summary.farmName;

    if (summary.primaryActivity === 'mixed' && cropTrackers.length && livestockTrackers.length) {
        const left = trackerBg(cropTrackers[0]);
        const right = trackerBg(livestockTrackers[0]);
        return {
            mode: 'split',
            left: left.image,
            right: right.image,
            leftPosition: left.position,
            rightPosition: right.position,
        };
    }

    if (summary.primaryActivity === 'livestock') {
        const label = livestockTrackers[0]?.crop ?? fallbackLabel;
        const bg = livestockBackground(label);
        return { mode: 'single', image: bg.image, position: bg.position };
    }

    const label = cropTrackers[0]?.crop ?? fallbackLabel;
    const bg = cropBackground(label);
    return { mode: 'single', image: bg.image, position: bg.position };
}
