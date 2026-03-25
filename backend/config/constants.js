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
    },

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
    }
};
