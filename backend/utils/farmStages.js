/** Crop production cycle stages (display order) */
const CROP_STAGES = [
    { key: 'land_preparation', label: 'Land Preparation', legacyKeys: ['planning'] },
    { key: 'planting', label: 'Planting', legacyKeys: ['planting'] },
    { key: 'growing', label: 'Growing', legacyKeys: ['growing'] },
    { key: 'weeding', label: 'Weeding', legacyKeys: ['maintenance'] },
    { key: 'fertilizing', label: 'Fertilizing', legacyKeys: ['other'] },
    { key: 'harvesting', label: 'Harvesting', legacyKeys: ['harvesting'] },
];

/** Livestock production cycle stages */
const LIVESTOCK_STAGES = [
    { key: 'brooding', label: 'Brooding', legacyKeys: ['planning'] },
    { key: 'growing', label: 'Growing', legacyKeys: ['growing', 'planting'] },
    { key: 'production', label: 'Production', legacyKeys: ['harvesting', 'maintenance'] },
];

const LIVESTOCK_KEYWORDS = [
    'poultry',
    'cattle',
    'goat',
    'sheep',
    'pig',
    'livestock',
    'broiler',
    'layer',
    'chicken',
    'duck',
];

exports.inferFarmCategory = (crop = '', farmCategory) => {
    if (farmCategory === 'crop' || farmCategory === 'livestock') return farmCategory;
    const c = String(crop).toLowerCase();
    return LIVESTOCK_KEYWORDS.some((k) => c.includes(k)) ? 'livestock' : 'crop';
};

exports.getStagesForCategory = (category) =>
    category === 'livestock' ? LIVESTOCK_STAGES : CROP_STAGES;

/** Map agent legacy stage key → display stage key */
exports.normalizeStageKey = (legacyKey, category) => {
    const stages = exports.getStagesForCategory(category);
    const hit = stages.find((s) => s.key === legacyKey || s.legacyKeys.includes(legacyKey));
    return hit?.key || stages[0].key;
};

exports.stageDetailsToObject = (stageDetails) => {
    if (!stageDetails) return {};
    if (stageDetails instanceof Map) {
        return Object.fromEntries([...stageDetails.entries()]);
    }
    return { ...stageDetails };
};
