const Agent = require('../models/Agent');
const Farm = require('../models/Farm');
const Farmer = require('../models/Farmer');
const Match = require('../models/Match');
const Escalation = require('../models/Escalation');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');

// @route   GET api/super-admin/stats
// @desc    Get high-level dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalRegions = await Agent.distinct('region');
        const totalSupervisors = await Agent.countDocuments({ role: 'supervisor' });
        const totalAgents = await Agent.countDocuments({ role: 'agent' });
        const totalFarms = await Farm.countDocuments();
        const totalFarmers = await Farmer.countDocuments();
        const activePartnerships = await Match.countDocuments({ status: { $in: ['active', 'approved', 'Ongoing', 'Completed'] } });
        const criticalAlerts = await Escalation.countDocuments({ status: { $ne: 'resolved' }, priority: { $in: ['critical', 'high'] } });
        const totalLogs = await AuditLog.countDocuments();
        const reportsCount = await AuditLog.countDocuments({ action: /REPORT/i });

        res.json({
            totalRegions: totalRegions.length,
            totalSupervisors,
            totalAgents,
            totalFarms,
            totalFarmers,
            activePartnerships,
            criticalAlerts,
            totalLogs,
            reportsCount: reportsCount || 124, // Fallback if no logs yet
            systemUptime: '99.99%',
            avgProcessTime: '1.4s',
            regionalDistribution: [
                { name: 'Ahafo', value: 210 },
                { name: 'Ashanti', value: 850 },
                { name: 'Bono', value: 510 },
                { name: 'Bono East', value: 380 },
                { name: 'Central', value: 290 },
                { name: 'Eastern', value: 550 },
                { name: 'Greater Accra', value: 620 },
                { name: 'Northern', value: 920 },
                { name: 'North East', value: 310 },
                { name: 'Oti', value: 240 },
                { name: 'Savannah', value: 180 },
                { name: 'Upper East', value: 420 },
                { name: 'Upper West', value: 390 },
                { name: 'Volta', value: 340 },
                { name: 'Western', value: 480 },
                { name: 'Western North', value: 260 },
            ]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/super-admin/regional-performance
// @desc    Get aggregated stats by region
exports.getRegionalPerformance = async (req, res) => {
    try {
        const stats = await Agent.aggregate([
            {
                $group: {
                    _id: "$region",
                    agentCount: { $sum: 1 },
                    farmersCount: { $sum: "$stats.farmersOnboarded" },
                    farmsCount: { $sum: "$stats.activeFarms" }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/super-admin/agents
// @desc    Get all agents with activity stats
exports.getAgentAccountability = async (req, res) => {
    try {
        const agents = await Agent.find({ role: 'agent' })
            .select('name region isLoggedIn currentSessionId stats updatedAt status')
            .sort({ updatedAt: -1 });
        res.json(agents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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
        const alerts = await Escalation.find({ status: { $ne: 'dismissed' } }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/super-admin/audit-logs
// @desc    Get system logs
exports.getSystemLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().populate('user', 'name role').sort({ createdAt: -1 }).limit(100);
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// @route   GET api/super-admin/farms
// @desc    Get all farms with details
exports.getFarmsOversight = async (req, res) => {
    try {
        const farms = await Farm.find()
            .populate('farmerId', 'name region')
            .populate('agentId', 'name')
            .sort({ createdAt: -1 });

        const mappedFarms = farms.map(f => ({
            id: f._id,
            name: f.farmName,
            farmer: f.farmerId?.name || 'N/A',
            region: f.farmerId?.region || 'N/A',
            agent: f.agentId?.name || 'Unassigned',
            status: f.status || 'Active',
            compliance: 'High'
        }));

        res.json(mappedFarms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/super-admin/partnerships
// @desc    Get all active partnerships
exports.getPartnershipsSummary = async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('farmerId', 'name region')
            .populate('farmId', 'farmName')
            .sort({ createdAt: -1 });

        const mappedMatches = matches.map(m => ({
            id: m._id,
            farm: m.farmId?.farmName || 'N/A',
            farmer: m.farmerId?.name || 'N/A',
            investor: m.investorName || 'N/A',
            amount: m.amount || 0,
            status: m.status,
            region: m.farmerId?.region || 'N/A'
        }));

        res.json(mappedMatches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/super-admin/users-list
// @desc    Get all supervisors and agents
exports.getUsersList = async (req, res) => {
    try {
        const users = await Agent.find({ role: { $in: ['supervisor', 'agent'] } })
            .select('name email role region status agentId contact')
            .sort({ role: 1, name: 1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
