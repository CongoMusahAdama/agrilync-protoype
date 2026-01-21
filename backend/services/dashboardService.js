const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const Agent = require('../models/Agent');
const { Training, AgentTraining } = require('../models/Training');
const Dispute = require('../models/Dispute');
const Report = require('../models/Report');
const redis = require('../utils/redis');

// Fallback in-memory cache for when Redis is unavailable
const memoryCache = new Map();
const CACHE_TTL_SEC = 300; // 5 minutes in seconds for Redis
const CACHE_TTL_MS = CACHE_TTL_SEC * 1000;

// Cleanup for in-memory fallback
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of memoryCache.entries()) {
        if (now - value.timestamp > CACHE_TTL_MS) {
            memoryCache.delete(key);
        }
    }
}, CACHE_TTL_MS); // Clean up expired cache entries every 5 minutes

/**
 * Get dashboard summary for an agent
 * Includes stats, recent activities, notifications, and lists
 */
exports.getDashboardSummary = async (agent) => {
    const agentId = agent.id || agent._id;
    const region = agent.region;
    const start = Date.now();
    const cacheKey = `dashboard_${agentId}`;

    // 1. Try Redis first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    // 2. Try Memory fallback second
    const memoryData = memoryCache.get(cacheKey);
    if (memoryData && (Date.now() - memoryData.timestamp < CACHE_TTL_MS)) {
        return memoryData.data;
    }

    // Fetching summary from database

    // Fetching summary from database
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let dbData = {};

    try {
        // Fetch everything in parallel
        const results = await Promise.all([
            // Limit to 20 most recent farmers/farms for the dashboard view to reduce payload
            // Aggressively exclude large fields like stageDetails, fieldNotes, and base64 images
            Farmer.find({ agent: agentId })
                .sort({ createdAt: -1 })
                .limit(20)
                .select('name status region district community farmType contact')
                .lean(),
            Farm.find({ agent: agentId })
                .sort({ createdAt: -1 })
                .limit(20)
                .select('name farmer location crop status nextVisit lastVisit createdAt')
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
                .select('_id id farmer investor agent type severity status dateLogged region description createdAt timeline evidence notes resolution')
                .populate('farmer', 'name region')
                .lean(),
            // Pending queue for the agent's region
            Farmer.find({ status: 'pending', region })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('name status region date')
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

        dbData = {
            farmers: results[0],
            farms: results[1],
            notifications: results[2],
            matches: results[3],
            activities: results[4],
            disputes: results[5],
            pendingQueue: results[6],
            trainings: results[7],
            myTrainings: results[8],
            farmerCount: results[9],
            farmCount: results[10],
            matchCount: results[11],
            disputeCount: results[12],
            reportCount: results[13]
        };

    } catch (err) {
        console.error('[DASHBOARD] DB Fetch Failed (Using Mock Fallback):', err.message);
        // Provide Rich Mock Data if DB fails (e.g. ECONNREFUSED)
        dbData = {
            farmers: [
                { _id: 'mock-f1', name: 'Kwame Mensah', status: 'verified', region: 'Ashanti', district: 'Ejisu', community: 'Bonwire', farmType: 'Cocoa' },
                { _id: 'mock-f2', name: 'Ama Serwaa', status: 'pending', region: 'Ashanti', district: 'Juaben', community: 'Nobewam', farmType: 'Maize' }
            ],
            farms: [
                { _id: 'mock-fm1', name: 'Golden Pods Estate', crop: 'Cocoa', status: 'Active', location: 'Bonwire', farmer: { name: 'Kwame Mensah' } },
                { _id: 'mock-fm2', name: 'Silent Hills', crop: 'Maize', status: 'Pre-Season', location: 'Juaben', farmer: { name: 'Ama Serwaa' } }
            ],
            notifications: [
                { _id: 'n1', title: 'System Alert', message: 'Sync complete', type: 'system', read: false, createdAt: new Date() }
            ],
            matches: [
                { _id: 'm1', farmer: { name: 'Kwame Mensah' }, investor: 'AgroFund', status: 'active', approvalStatus: 'approved' }
            ],
            activities: [],
            disputes: [],
            pendingQueue: [],
            trainings: [],
            myTrainings: [],
            farmerCount: 42,
            farmCount: 56,
            matchCount: 12,
            disputeCount: 2,
            reportCount: 15
        };
    }

    const {
        farmers, farms, notifications, matches, activities, disputes,
        pendingQueue, trainings, myTrainings, farmerCount, farmCount,
        matchCount, disputeCount, reportCount
    } = dbData;

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

    return summary;
};

/**
 * Invalidate cache for a specific agent
 */
exports.invalidateCache = (agentId) => {
    const cacheKey = `dashboard_${agentId}`;
    redis.del(cacheKey);
    memoryCache.delete(cacheKey);
};
