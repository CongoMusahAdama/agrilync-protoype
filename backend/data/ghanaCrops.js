/** Standard crop & livestock lists for structured farmer onboarding */
exports.GHANA_CROPS = [
    'Maize',
    'Rice',
    'Cocoa',
    'Cassava',
    'Yam',
    'Plantain',
    'Tomato',
    'Pepper',
    'Soybean',
    'Groundnut',
    'Cowpea',
    'Millet',
    'Sorghum',
    'Oil Palm',
    'Coconut',
    'Citrus',
    'Mango',
    'Pineapple',
    'Vegetables (Mixed)',
    'Other',
];

exports.GHANA_LIVESTOCK = [
    'Poultry',
    'Cattle',
    'Goats',
    'Sheep',
    'Pigs',
    'Fish / Aquaculture',
    'Rabbits',
    'Bees / Apiculture',
    'Other',
];

const cropLookup = new Map(
    exports.GHANA_CROPS.map((c) => [c.toLowerCase(), c])
);

exports.normalizeCropName = (raw) => {
    if (!raw || typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const key = trimmed.toLowerCase();
    if (cropLookup.has(key)) return cropLookup.get(key);
    // Fuzzy: "maize farming" → Maize
    for (const [k, v] of cropLookup) {
        if (key.includes(k) || k.includes(key)) return v;
    }
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};
