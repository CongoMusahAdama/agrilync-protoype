const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const Agent = require('../models/Agent');
const { Training, AgentTraining } = require('../models/Training');
const Dispute = require('../models/Dispute');
const Report = require('../models/Report');

// Simple in-memory cache with improved performance
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes - optimized for mobile and desktop performance

// Cache cleanup interval to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL * 2) {
            cache.delete(key);
        }
    }
}, CACHE_TTL); // Clean up expired cache entries every 5 minutes

/**
 * Get dashboard summary for an agent
 * Includes stats, recent activities, notifications, and lists
 */
exports.getDashboardSummary = async (agent) => {
    const agentId = agent.id || agent._id;
    const region = agent.region;
    const start = Date.now();
    const cacheKey = `dashboard_${agentId}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
        console.log(`[DASHBOARD] Summary served from cache for ${agentId}`);
        return cachedData.data;
    }

    console.log(`[DASHBOARD] Fetching summary for ${agentId} in region ${region}...`);

    // Calculate start of current month for reports metric
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Fetch everything in parallel
    const [
        farmers,
        farms,
        notifications,
        matches,
        activities,
        disputes,
        pendingQueue,
        trainings,
        myTrainings,
        farmerCount,
        farmCount,
        matchCount,
        disputeCount,
        reportCount
    ] = await Promise.all([
        // Limit to 20 most recent farmers/farms for the dashboard view to reduce payload
        // Aggressively exclude large fields like stageDetails, fieldNotes, and base64 images
        Farmer.find({ agent: agentId })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('name status region district community farmType contact profilePicture') // Include profilePicture for avatar display
            .lean(),
        Farm.find({ agent: agentId })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('name farmer location crop status nextVisit lastVisit createdAt') // Only select what's needed for cards
            .populate('farmer', 'name region community farmType')
            .lean(),
        Notification.find({ agent: agentId }).sort({ createdAt: -1 }).limit(20).lean(),
        // Limit matches to recent 20 to prevent loading all matches
        Match.find({ agent: agentId })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('id farmer investor status approvalStatus createdAt')
            .populate('farmer', 'name')
            .lean(),
        Activity.find({ agent: agentId }).sort({ createdAt: -1 }).limit(10).lean(),
        // Limit disputes to recent 20 to prevent loading all disputes
        Dispute.find({ agent: agentId })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('id farmer investor agent type severity status dateLogged region description createdAt')
            .populate('farmer', 'name region')
            .lean(),
        // Pending queue for the agent's region
        Farmer.find({ status: 'pending', region })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name status region date') // minimal fields for queue count/list
            .lean(),
        Training.find().sort({ date: 1 }).limit(5).select('title date location status').lean(),
        AgentTraining.find({ agent: agentId })
            .limit(10)
            .select('training status completedAt')
            .populate('training', 'title date location')
            .lean(),
        // Actual counts for metrics
        Farmer.countDocuments({ agent: agentId }),
        Farm.countDocuments({ agent: agentId }),
        Match.countDocuments({ agent: agentId }),
        Dispute.countDocuments({ agent: agentId }),
        Report.countDocuments({ agent: agentId, createdAt: { $gte: startOfMonth } })
    ]);

    const summary = {
        agent,
        stats: {
            ...agent?.stats,
            farmersOnboarded: farmerCount,
            activeFarms: farmCount,
            investorMatches: matchCount,
            pendingDisputes: disputeCount,
            reportsThisMonth: reportCount
        },
        farmers,
        farms,
        notifications,
        matches,
        activities,
        disputes,
        pendingQueue,
        trainings,
        myTrainings,
        timestamp: new Date().toISOString()
    };

    // Update cache
    cache.set(cacheKey, {
        timestamp: Date.now(),
        data: summary
    });

    const duration = Date.now() - start;
    console.log(`[DASHBOARD] Summary for ${agentId} took ${duration}ms`);

    return summary;
};

/**
 * Invalidate cache for a specific agent
 */
exports.invalidateCache = (agentId) => {
    cache.delete(`dashboard_${agentId}`);
};
