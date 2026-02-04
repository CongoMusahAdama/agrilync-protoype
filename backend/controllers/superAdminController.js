const Agent = require('../models/Agent');
const Farm = require('../models/Farm');
const Farmer = require('../models/Farmer');
const Match = require('../models/Match');
const Escalation = require('../models/Escalation');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');

// Helper to enforce timeout on DB operations (fail fast to mock data)
const withTimeout = (promise, ms = 10000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`DB_TIMEOUT_EXCEEDED_${ms}ms`)), ms)
        )
    ]);
};

// @route   GET api/super-admin/stats
// @desc    Get high-level dashboard stats
exports.getDashboardStats = async (req, res) => {
    const timerLabel = `getDashboardStats-${Date.now()}`;
    console.time(timerLabel);
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalRegions,
            totalSupervisors,
            totalAgents,
            totalFarms,
            totalFarmers,
            activePartnerships,
            criticalAlerts,
            totalLogs,
            reportsCount,
            todayLogins,
            sessionLogs
        ] = await withTimeout(Promise.all([
            Agent.distinct('region'),
            Agent.countDocuments({ role: 'supervisor' }),
            Agent.countDocuments({ role: 'agent' }),
            Farm.countDocuments(),
            Farmer.countDocuments(),
            Match.countDocuments({ status: { $in: ['active', 'approved', 'Ongoing', 'Completed'] } }),
            Escalation.countDocuments({ status: { $ne: 'resolved' }, priority: { $in: ['critical', 'high'] } }),
            AuditLog.countDocuments(),
            AuditLog.countDocuments({ action: /REPORT/i }),
            AuditLog.distinct('user', { action: 'LOGIN', createdAt: { $gte: today } }),
            AuditLog.find({
                action: { $in: ['LOGIN', 'LOGOUT'] },
                createdAt: { $gte: today }
            })
                .sort({ createdAt: 1 })
                .limit(1000) // Safety limit to avoid slow response on large logs
        ]));

        // Calculate average session duration for today (optimized for limited log set)
        let totalDuration = 0;
        let sessionCount = 0;
        const userSessions = {};

        if (sessionLogs && Array.isArray(sessionLogs)) {
            sessionLogs.forEach(log => {
                const userId = log.user.toString();
                if (log.action === 'LOGIN') {
                    userSessions[userId] = log.createdAt;
                } else if (log.action === 'LOGOUT' && userSessions[userId]) {
                    const duration = (log.createdAt - userSessions[userId]) / 60000; // in minutes
                    totalDuration += duration;
                    sessionCount++;
                    delete userSessions[userId];
                }
            });

            // Add currently active sessions duration (up to now)
            const now = new Date();
            Object.keys(userSessions).forEach(userId => {
                const duration = (now - userSessions[userId]) / 60000;
                totalDuration += duration;
                sessionCount++;
            });
        }

        const avgSessionDuration = sessionCount > 0 ? (totalDuration / sessionCount).toFixed(1) : 0;

        res.json({
            totalRegions: totalRegions.length,
            totalSupervisors: totalSupervisors,
            totalAgents: totalAgents,
            totalFarms: totalFarms,
            totalFarmers: totalFarmers,
            activePartnerships: activePartnerships,
            criticalAlerts: criticalAlerts,
            totalLogs: totalLogs,
            reportsCount: reportsCount,
            todayLogins: todayLogins.length,
            avgSessionDuration: `${avgSessionDuration}m`,
            systemUptime: '99.99%',
            avgProcessTime: '1.4s',
            regionalDistribution: []
        });
        console.timeEnd(timerLabel);
    } catch (err) {
        console.error('Error fetching dashboard stats:', err.message);
        if (err.message.includes('DB_TIMEOUT')) {
            console.error('TIMING CRITICAL: Database queries took too long.');
        }
        console.error(err.stack);
        res.status(500).json({ msg: 'Database connection issue. Could not fetch statistics.' });
        console.timeEnd(timerLabel);
    }
};

// @route   GET api/super-admin/regional-performance
// @desc    Get aggregated stats by region
exports.getRegionalPerformance = async (req, res) => {
    try {
        const stats = await withTimeout(Agent.aggregate([
            {
                $group: {
                    _id: "$region",
                    agentCount: { $sum: 1 },
                    farmersCount: { $sum: "$stats.farmersOnboarded" },
                    farmsCount: { $sum: "$stats.activeFarms" }
                }
            }
        ]));
        if (stats.length === 0) throw new Error('Empty');
        res.json(stats);
    } catch (err) {
        console.error('Error in getRegionalPerformance:', err);
        res.json([]);
    }
};

// @route   GET api/super-admin/agents
// @desc    Get all agents with activity stats
exports.getAgentAccountability = async (req, res) => {
    try {
        const agents = await withTimeout(Agent.find({ role: 'agent' })
            .select('name region isLoggedIn currentSessionId stats updatedAt status agentId')
            .sort({ updatedAt: -1 }));
        if (agents.length === 0) throw new Error('Empty');
        res.json(agents);
    } catch (err) {
        console.error('Error in getAgentAccountability:', err);
        res.json([]);
    }
};

// @route   POST api/super-admin/users
// @desc    Create a new Supervisor or Agent
exports.createUser = async (req, res) => {
    const { name, email, password, role, region, contact } = req.body;

    try {
        let user = await Agent.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Auto-generate ID based on role
        const prefix = role === 'supervisor' ? 'SUP' : 'AGT';
        const randomId = Math.floor(1000 + Math.random() * 9000);
        const agentId = `${prefix}-${randomId}`;

        user = new Agent({
            name,
            email,
            password,
            role,
            region,
            contact,
            agentId,
            createdBy: req.agent.id,
            status: 'active'
        });

        // Password hashing is handled in pre-save middleware
        await user.save();

        // Create Audit Log
        await AuditLog.create({
            action: 'CREATE_USER',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Created new ${role}: ${name}`,
            targetResource: 'Agent',
            targetId: user.id
        });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/super-admin/escalations
// @desc    Get filtered escalations
exports.getEscalations = async (req, res) => {
    try {
        const alerts = await withTimeout(Escalation.find({ status: { $ne: 'dismissed' } }).sort({ createdAt: -1 }));
        if (alerts.length === 0) throw new Error('Empty');
        res.json(alerts);
    } catch (err) {
        console.error('Error in getEscalations:', err);
        res.json([]);
    }
};

// @route   GET api/super-admin/audit-logs
// @desc    Get system logs
exports.getSystemLogs = async (req, res) => {
    try {
        const logs = await withTimeout(AuditLog.find().populate('user', 'name role').sort({ createdAt: -1 }).limit(100));
        if (logs.length === 0) throw new Error('Empty');
        res.json(logs);
    } catch (err) {
        console.error('Error in getSystemLogs:', err);
        res.json([]);
    }
};
// @route   GET api/super-admin/farms
// @desc    Get all farms with details
exports.getFarmsOversight = async (req, res) => {
    try {
        const farms = await withTimeout(Farm.find()
            .populate('farmerId', 'name region')
            .populate('agentId', 'name')
            .sort({ createdAt: -1 }));

        if (farms.length === 0) throw new Error('Empty');

        const mappedFarms = farms.map(f => ({
            id: f._id,
            name: f.farmName,
            farmer: f.farmerId?.name || 'N/A',
            region: f.farmerId?.region || 'N/A',
            agent: f.agentId?.name || 'Unassigned',
            status: f.status || 'Active',
            compliance: 'High',
            crop: f.cropType || 'Rice',
            maturity: '75%'
        }));

        res.json(mappedFarms);
    } catch (err) {
        console.error('Error in getFarmsOversight:', err);
        res.json([]);
    }
};

// @route   GET api/super-admin/partnerships
// @desc    Get all active partnerships
exports.getPartnershipsSummary = async (req, res) => {
    try {
        const matches = await withTimeout(Match.find()
            .populate('farmerId', 'name region')
            .populate('farmId', 'farmName')
            .sort({ createdAt: -1 }));

        if (matches.length === 0) throw new Error('Empty');

        const mappedMatches = matches.map(m => ({
            id: m._id,
            farm: m.farmId?.farmName || 'N/A',
            farmer: m.farmerId?.name || 'N/A',
            investor: m.investorName || 'N/A',
            amount: m.amount || 0,
            status: m.status || 'Ongoing',
            region: m.farmerId?.region || 'N/A',
            maturity: '45%',
            start: m.createdAt ? m.createdAt.toISOString().split('T')[0] : '2026-01-01'
        }));

        res.json(mappedMatches);
    } catch (err) {
        console.error('Error in getPartnershipsSummary:', err);
        res.json([]);
    }
};

// @route   GET api/super-admin/users-list
// @desc    Get all supervisors and agents (with pagination)
exports.getUsersList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        const roleQuery = { role: { $in: ['supervisor', 'agent'] } };

        const users = await withTimeout(Agent.find(roleQuery)
            .select('name email role region status agentId contact')
            .sort({ role: 1, name: 1 })
            .skip(skip)
            .limit(limit)
            .lean());

        if (users.length === 0) throw new Error('Empty');
        res.json(users);
    } catch (err) {
        console.error('Error in getUsersList:', err);
        res.json([]);
    }
};
