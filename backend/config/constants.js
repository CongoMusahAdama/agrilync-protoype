/**
 * Centralized business logic constants and performance targets
 */

module.exports = {
    // Performance Targets
    PERFORMANCE_TARGETS: {
        ONBOARDING_VOLUME: 500, // farmers
        COMPLETION_RATE: 90, // %
        VERIFICATION_PASS_RATE: 85, // %
        VISIT_FREQUENCY: 2.0, // visits per farmer per month
        SYNC_RATE: 95, // %
        MONTHLY_VISITS: 20,
        TRAINING_RATE: 80, // %
        GENDER_FEMALE_TARGET: 60, // %
    },

    INCENTIVE_RATES: {
        ONBOARDING_BONUS: 300,
        ONBOARDING_THRESHOLD: 250,
        TRAINING_BONUS: 200,
        TRAINING_PARTIAL: 100,
        MEDIA_BONUS: 200,
        MAX_POTENTIAL: 700,
    },

    TRAINING_MODULE_DEFS: [
        { id: 'soil_crop', title: 'Soil & Crop Management', tag: 'Required' },
        { id: 'financial_lit', title: 'Financial Literacy & Record Keeping', tag: 'Required' },
        { id: 'market_access', title: 'Market Access & Pricing', tag: 'Required' },
        { id: 'sustainable_farming', title: 'Sustainable Farming Practices', tag: 'Required' },
        { id: 'climate_smart', title: 'Climate Smart Agriculture', tag: 'Required' },
        { id: 'farmpartner_orientation', title: 'FarmPartner Investment Orientation', tag: 'Advanced' },
    ],

    // Ticket Categories & Mapping
    TICKET_CATEGORIES: {
        TECHNICAL: 'Technical Issue',
        ACCOUNT: 'Account Access',
        PAYOUT: 'Payout Issue',
        OTHER: 'Other'
    },

    // Category Map for DB
    SUPPORT_CATEGORY_MAP: {
        'Technical Issue': 'Technical',
        'Account Access': 'Other',
        'Payout Issue': 'Payouts',
        'Other': 'Other'
    },

    // Cache TTLs
    CACHE_TTL: {
        DASHBOARD: 300, // 5 minutes
    },

    // Super-admin API defaults
    DB_QUERY_TIMEOUT_MS: 10000,
    DEFAULT_PAGE_SIZE: 50,
    MAX_PAGE_SIZE: 200,
};
