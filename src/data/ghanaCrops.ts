/** Standard crop & livestock lists — keep in sync with backend/data/ghanaCrops.js */
export const GHANA_CROPS = [
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
] as const;

export const GHANA_LIVESTOCK = [
    'Poultry',
    'Cattle',
    'Goats',
    'Sheep',
    'Pigs',
    'Fish / Aquaculture',
    'Rabbits',
    'Bees / Apiculture',
    'Other',
] as const;

export type GhanaCrop = (typeof GHANA_CROPS)[number];
export type GhanaLivestock = (typeof GHANA_LIVESTOCK)[number];

export interface LivestockEntry {
    type: string;
    count: number;
    otherLabel?: string;
}
