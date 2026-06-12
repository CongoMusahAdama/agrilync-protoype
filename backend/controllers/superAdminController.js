const crypto = require('crypto');
const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const BlogAdmin = require('../models/BlogAdmin');
const Subscriber = require('../models/Subscriber');
const Farm = require('../models/Farm');
const Farmer = require('../models/Farmer');
const Match = require('../models/Match');
const Escalation = require('../models/Escalation');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const FieldVisit = require('../models/FieldVisit');
const ScheduledVisit = require('../models/ScheduledVisit');
const Media = require('../models/Media');
const { Training, AgentTraining } = require('../models/Training');
const TrainingDelivery = require('../models/TrainingDelivery');
const Task = require('../models/Task');
const performanceService = require('../services/performanceService');
const { PERFORMANCE_TARGETS, DB_QUERY_TIMEOUT_MS, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../config/constants');
const FarmerDeletionRequest = require('../models/FarmerDeletionRequest');
const { deleteFarmerCascade } = require('../utils/deleteFarmerCascade');
const { sendPushNotification } = require('../utils/firebase');
const { generateUniqueStaffId } = require('../utils/generateAgentId');
const {
    notifySupervisorAssignmentPair,
    notifyStaffAgent,
    notifyEscalationResolved,
    staffSms,
    truncateSms,
} = require('../utils/staffNotifications');

const parsePagination = (query, { defaultLimit = DEFAULT_PAGE_SIZE, maxLimit = MAX_PAGE_SIZE } = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
    return { page, limit, skip: (page - 1) * limit };
};

// Helper to enforce timeout on DB operations (fail fast)
const withTimeout = (promise, ms = DB_QUERY_TIMEOUT_MS) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`DB_TIMEOUT_EXCEEDED_${ms}ms`)), ms)
        )
    ]);
};

const toDbRole = (role) => {
    if (!role) return null;
    if (role === 'super_admin' || role === 'Super Admin') return 'super_admin';
    if (role === 'supervisor' || role === 'Supervisor') return 'supervisor';
    return 'agent';
};

const getRequestAgentId = (agent) => agent?._id || agent?.id || null;

const writeAuditLog = async (payload) => {
    try {
        await AuditLog.create(payload);
    } catch (err) {
        console.error('Audit log failed:', err.message);
    }
};

const resolveSupervisorAssignment = async (supervisorId, role) => {
    const dbRole = toDbRole(role);
    if (dbRole !== 'agent') {
        return null;
    }
    if (!supervisorId) {
        const err = new Error('Please assign a supervisor for this field agent.');
        err.status = 400;
        throw err;
    }
    if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
        const err = new Error('Invalid supervisor selected.');
        err.status = 400;
        throw err;
    }
    const supervisor = await Agent.findOne({
        _id: supervisorId,
        role: 'supervisor',
        status: { $ne: 'inactive' },
    }).select('name contact email agentId region').lean();
    if (!supervisor) {
        const err = new Error('Selected supervisor was not found or is inactive.');
        err.status = 400;
        throw err;
    }
    return supervisor;
};

const formatSupervisorContact = (supervisor) => supervisor?.contact || supervisor?.email || '';

const buildAccountCreationSms = ({ name, dbRole, agentId, region, loginUrl, supervisor }) => {
    const regionLabel = region || 'Unassigned';
    const securityNote = 'Your temporary password was set by an administrator — contact them if you need it. You must change it on first login.';
    if (dbRole === 'supervisor') {
        return (
            `Hello ${name}, your AgriLync Supervisor account has been created. ` +
            `Supervisor ID: ${agentId}. Region: ${regionLabel}. ` +
            `Login at ${loginUrl} using your email or phone. ${securityNote}`
        );
    }
    if (dbRole === 'super_admin') {
        return (
            `Hello ${name}, your AgriLync Admin account has been created. ` +
            `Staff ID: ${agentId}. Region: ${regionLabel}. ` +
            `Login at ${loginUrl} using your email or phone. ${securityNote}`
        );
    }
    let message =
        `Hello ${name}, your AgriLync account has been successfully created by an Admin. ` +
        `Agent ID: ${agentId}. Region: ${regionLabel}. ` +
        `Login at ${loginUrl} using your email or phone number. ${securityNote}`;
    if (supervisor) {
        const supervisorContact = formatSupervisorContact(supervisor);
        message +=
            ` Your reporting supervisor is ${supervisor.name} (ID: ${supervisor.agentId || 'N/A'})` +
            `${supervisorContact ? `. Contact: ${supervisorContact}` : ''}.`;
    }
    return message;
};

// @route   GET api/super-admin/stats
// @desc    Get high-level dashboard stats
exports.getDashboardStats = async (req, res) => {
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
            sessionLogs,
            uniqueInvestors,
            pendingKYCListRaw,
            criticalEscalationsListRaw,
            topAgentsRaw,
            bottomAgentsRaw,
            regionalPerformanceRaw,
            inactiveAgentsListRaw
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
                .limit(1000), // Safety limit to avoid slow response on large logs
            Match.distinct('investor'), // Get unique investors
            Farmer.find({ status: 'pending' }).limit(5).populate('agent', 'name').select('name region profileCompleteness agent').lean(),
            Escalation.find({ status: { $ne: 'resolved' } }).sort({ createdAt: -1 }).limit(5).populate('farmerId', 'name').lean(),
            Agent.find({ role: 'agent' }).sort({ "stats.farmersOnboarded": -1 }).limit(5).select('name region avatar stats').lean(),
            Agent.find({ role: 'agent' }).sort({ "stats.farmersOnboarded": 1 }).limit(5).select('name region avatar stats').lean(),
            Agent.aggregate([
                {
                    $group: {
                        _id: "$region",
                        agents: { $sum: 1 },
                        farms: { $sum: "$stats.activeFarms" },
                        farmers: { $sum: "$stats.farmersOnboarded" }
                    }
                }
            ]),
            Agent.find({ role: 'agent', status: 'inactive' }).select('name region updatedAt').limit(5).lean()
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

        // Map list outputs for dashboard compliance
        const pendingKYCList = pendingKYCListRaw.map(f => ({
            id: f._id.toString(),
            name: f.name,
            region: f.region,
            agent: f.agent?.name || 'Unassigned',
            kyc: typeof f.profileCompleteness === 'number' ? f.profileCompleteness : 0,
        }));

        const criticalAlertsList = criticalEscalationsListRaw.map(e => ({
            id: e._id.toString(),
            type: e.category || 'Dispute',
            title: e.message || 'Escalated dispute logged',
            description: e.description || 'Agronomic investigation needed',
            priority: e.priority || 'high',
            by: e.source || 'Lync Agent',
            date: e.createdAt ? e.createdAt.toISOString().split('T')[0] : today.toISOString().split('T')[0]
        }));

        const topPerformers = topAgentsRaw.map(a => ({
            name: a.name,
            region: a.region,
            avatar: a.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            farmers: a.stats?.farmersOnboarded || 0,
            farms: a.stats?.activeFarms || 0
        }));

        const lowEngagement = bottomAgentsRaw.map(a => ({
            name: a.name,
            region: a.region,
            avatar: a.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
            farmers: a.stats?.farmersOnboarded || 0,
            farms: a.stats?.activeFarms || 0
        }));

        const regionalDistribution = regionalPerformanceRaw.map(r => ({
            region: r._id || 'Unknown',
            agents: r.agents || 0,
            farms: r.farms || 0,
            farmers: r.farmers || 0
        }));

        const [atRiskFarmsList, scheduledTrainingCount, offTrackFarmersCount] = await Promise.all([
            buildAtRiskFarmsList(),
            TrainingDelivery.countDocuments({ status: { $ne: 'cancelled' } }),
            Farmer.countDocuments({ status: 'inactive' }),
        ]);

        const atRiskFarmsCount = atRiskFarmsList.length;
        const onTrackFarmersCount = Math.max(0, totalFarmers - atRiskFarmsCount - offTrackFarmersCount);

        const farmHealth = {
            onTrack: onTrackFarmersCount,
            atRisk: atRiskFarmsCount,
            offTrack: offTrackFarmersCount,
        };

        const pendingKYCCount = await Farmer.countDocuments({ status: 'pending' });
        const inactiveAgentsCount = await Agent.countDocuments({ role: 'agent', status: 'inactive' });

        const inactiveAgentsList = (inactiveAgentsListRaw || []).map(a => {
            const diffMs = Date.now() - new Date(a.updatedAt).getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const lastSync = diffHours > 24 ? `${Math.floor(diffHours / 24)} days ago` : `${diffHours} hours ago`;
            return {
                id: a._id.toString(),
                name: a.name,
                region: a.region,
                lastSync
            };
        });

        res.json({
            totalRegions: totalRegions.length || 1,
            totalSupervisors: totalSupervisors,
            totalAgents: totalAgents,
            totalFarms: totalFarms,
            totalFarmers: totalFarmers,
            activePartnerships: activePartnerships,
            totalInvestors: uniqueInvestors.length,
            criticalAlerts: criticalAlerts,
            totalLogs: totalLogs,
            reportsCount: reportsCount,
            todayLogins: todayLogins.length,
            avgSessionDuration: `${avgSessionDuration}m`,
            pendingVerificationsCount: pendingKYCCount,
            inactiveAgentsCount: inactiveAgentsCount,
            criticalEscalationsCount: criticalAlerts,
            activeLogins: todayLogins.length,
            failedLogins: 0,
            primaryWorkstation: 'Android Mobile / Tablet',
            pendingApprovals: pendingKYCCount + criticalAlerts,
            atRiskFarms: atRiskFarmsCount,
            atRiskFarmsList,
            scheduledTraining: scheduledTrainingCount,
            farmersVerifiedThisWeek: await Farmer.countDocuments({ status: 'active', createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
            farmHealth,
            topPerformers,
            lowEngagement,
            pendingKYCList,
            criticalAlertsList,
            inactiveAgentsList,
            regionalDistribution
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err.message);
        if (err.message.includes('DB_TIMEOUT')) {
            console.error('TIMING CRITICAL: Database queries took too long.');
        }
        console.error(err.stack);
        res.status(500).json({ msg: 'Database connection issue. Could not fetch statistics.' });
    }
};

const normalizeRegionKey = (regionName) =>
    (regionName || '').replace(/\s+Region$/i, '').trim().toLowerCase();

const regionNameVariants = (regionName) => {
    const normalized = (regionName || '').replace(/\s+Region$/i, '').trim();
    const variants = new Set([regionName, normalized, `${normalized} Region`].filter(Boolean));
    if (/bono/i.test(normalized)) {
        ['Bono', 'Bono Region', 'Bono Ahafo', 'Bono Ahafo Region'].forEach((v) => variants.add(v));
    }
    if (/ahafo|asunafo/i.test(normalized)) {
        ['Ahafo', 'Ahafo Region', 'Asunafo North Ahafo', 'Asunafo North Ahafo Region'].forEach((v) => variants.add(v));
    }
    return Array.from(variants);
};

const parseCapitalAmount = (value) => {
    if (typeof value === 'number') return value;
    return parseInt(String(value || '').replace(/[^\d]/g, ''), 10) || 0;
};

const enrichRegionSummary = (region) => {
    const farmersOnboarded = region.farmers ?? region.farmersOnboarded ?? 0;
    const target = Math.max(farmersOnboarded + 50, Math.ceil(farmersOnboarded * 1.25) || 100);
    const capitalDeployed = parseCapitalAmount(region.capitalMatched) || farmersOnboarded * 3500;
    return {
        ...region,
        farmersOnboarded,
        target,
        capitalDeployed,
        seasonTrend: (region.onTrackRate ?? 100) >= 80 ? 'up' : 'down',
    };
};

const mapFarmerPerformanceStatus = (farmer) => {
    if (farmer.status === 'inactive') return 'Off Track';
    if (
        farmer.investmentStatus === 'At Risk' ||
        farmer.currentStage === 'maintenance' ||
        farmer.status === 'pending'
    ) {
        return 'At Risk';
    }
    return 'On Track';
};

const deriveAtRiskReasons = (farmer, farm, visitsThisMonth) => {
    if (!farmer) return [];
    const reasons = [];
    const visitTarget = Math.ceil(PERFORMANCE_TARGETS.VISIT_FREQUENCY);

    if (farmer.status === 'pending') {
        reasons.push('Pending KYC / grower verification');
    }
    if (farmer.investmentStatus === 'At Risk') {
        reasons.push('Investment partnership flagged at risk');
    }
    if (farmer.currentStage === 'maintenance') {
        reasons.push('Farm in maintenance stage — agronomic review needed');
    }
    if (farmer.status === 'active') {
        if (!(farmer.idCardFront && farmer.idCardBack)) {
            reasons.push('Missing ID card documentation');
        }
        if (!(farmer.farmLocation?.lat && farmer.farmLocation?.lng)) {
            reasons.push('GPS farm location not synced');
        }
        if (visitsThisMonth === 0) {
            reasons.push('No field visits recorded this month');
        } else if (visitsThisMonth < visitTarget) {
            reasons.push(`Low visit compliance (${visitsThisMonth}/${visitTarget} visits this month)`);
        }
    }
    if (farm?.status === 'needs-attention') {
        reasons.push('Farm flagged needs attention by field agent');
    }
    if (farm?.reportStatus === 'Flagged') {
        reasons.push('Farm report flagged for review');
    }

    return reasons;
};

const buildAtRiskFarmsList = async () => {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const visitTarget = Math.ceil(PERFORMANCE_TARGETS.VISIT_FREQUENCY);

    const [flaggedFarmers, needsAttentionFarms, visitAgg, syncIssueFarmers] = await Promise.all([
        withTimeout(
            Farmer.find({
                $or: [
                    { status: 'pending' },
                    { investmentStatus: 'At Risk' },
                    { currentStage: 'maintenance' },
                ],
            })
                .select('name region community district status investmentStatus currentStage idCardFront idCardBack farmLocation farmType agent')
                .populate('agent', 'name')
                .lean()
        ),
        withTimeout(
            Farm.find({ $or: [{ status: 'needs-attention' }, { reportStatus: 'Flagged' }] })
                .select('name crop status reportStatus farmer agent')
                .populate('farmer', 'name region community district status investmentStatus currentStage idCardFront idCardBack farmLocation farmType agent')
                .populate('agent', 'name')
                .lean()
        ),
        withTimeout(
            FieldVisit.aggregate([
                { $match: { date: { $gte: monthStart } } },
                { $group: { _id: '$farmer', count: { $sum: 1 } } },
            ])
        ),
        withTimeout(
            Farmer.find({
                status: 'active',
                $or: [
                    { idCardFront: { $in: [null, ''] } },
                    { idCardBack: { $in: [null, ''] } },
                    { 'farmLocation.lat': { $exists: false } },
                    { 'farmLocation.lng': { $exists: false } },
                    { 'farmLocation.lat': null },
                    { 'farmLocation.lng': null },
                ],
            })
                .select('name region community district status investmentStatus currentStage idCardFront idCardBack farmLocation farmType agent')
                .populate('agent', 'name')
                .limit(500)
                .lean()
        ),
    ]);

    const visitedIds = (visitAgg || []).map((v) => v._id).filter(Boolean);
    const lowVisitIds = (visitAgg || [])
        .filter((v) => v.count < visitTarget)
        .map((v) => v._id)
        .filter(Boolean);

    const farmerSelect =
        'name region community district status investmentStatus currentStage idCardFront idCardBack farmLocation farmType agent';

    const [zeroVisitFarmers, lowVisitFarmers] = await Promise.all([
        withTimeout(
            Farmer.find({ status: 'active', _id: { $nin: visitedIds } })
                .select(farmerSelect)
                .populate('agent', 'name')
                .limit(500)
                .lean()
        ),
        lowVisitIds.length
            ? withTimeout(
                  Farmer.find({ status: 'active', _id: { $in: lowVisitIds } })
                      .select(farmerSelect)
                      .populate('agent', 'name')
                      .limit(500)
                      .lean()
              )
            : Promise.resolve([]),
    ]);

    const visitMap = new Map((visitAgg || []).map((v) => [v._id?.toString(), v.count]));
    const entriesByKey = new Map();

    const addEntry = (farmer, farm) => {
        if (!farmer?._id) return;
        const farmerId = farmer._id.toString();
        const visitsThisMonth = visitMap.get(farmerId) || 0;
        const reasons = deriveAtRiskReasons(farmer, farm, visitsThisMonth);
        if (reasons.length === 0) return;

        const existing = entriesByKey.get(farmerId);
        const mergedReasons = existing
            ? [...new Set([...existing.reasons, ...reasons])]
            : reasons;

        entriesByKey.set(farmerId, {
            id: farmerId,
            farmName: farm?.name || `${farmer.farmType || 'Farm'} — ${farmer.name}`,
            growerName: farmer.name,
            region: farmer.region || 'Unknown',
            community: farmer.community || farmer.district || '',
            agent: farmer.agent?.name || farm?.agent?.name || 'Unassigned',
            status: mapFarmerPerformanceStatus(farmer),
            reasons: mergedReasons,
            visitCount: visitsThisMonth,
            visitTarget,
            crop: farm?.crop || farmer.farmType || '—',
        });
    };

    (flaggedFarmers || []).forEach((farmer) => addEntry(farmer, null));
    (needsAttentionFarms || []).forEach((farm) => addEntry(farm.farmer, farm));
    (syncIssueFarmers || []).forEach((farmer) => addEntry(farmer, null));
    (zeroVisitFarmers || []).forEach((farmer) => addEntry(farmer, null));
    (lowVisitFarmers || []).forEach((farmer) => addEntry(farmer, null));

    const reasonPriority = (reasons) => {
        if (reasons.some((r) => /investment|flagged|no field visits/i.test(r))) return 0;
        if (reasons.some((r) => /pending|maintenance|needs attention|gps|visit compliance/i.test(r))) return 1;
        return 2;
    };

    return Array.from(entriesByKey.values()).sort(
        (a, b) => reasonPriority(a.reasons) - reasonPriority(b.reasons)
    );
};

const buildRegionalList = async () => {
    const [stats, trainingStats] = await Promise.all([
        withTimeout(Agent.aggregate([
            {
                $group: {
                    _id: '$region',
                    agentCount: { $sum: 1 },
                    farmersCount: { $sum: '$stats.farmersOnboarded' },
                    farmsCount: { $sum: '$stats.activeFarms' },
                },
            },
        ])),
        withTimeout(
            TrainingDelivery.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                {
                    $lookup: {
                        from: 'agents',
                        localField: 'agent',
                        foreignField: '_id',
                        as: 'agentInfo',
                    },
                },
                { $unwind: { path: '$agentInfo', preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: '$agentInfo.region',
                        scheduledTraining: { $sum: 1 },
                    },
                },
            ])
        ),
    ]);

    const trainingByRegion = new Map();
    (trainingStats || []).forEach((row) => {
        const key = normalizeRegionKey(row._id);
        if (!key) return;
        trainingByRegion.set(key, (trainingByRegion.get(key) || 0) + (row.scheduledTraining || 0));
    });

    const dbRegions = stats.map((r, i) => {
        const totalFarms = r.farmsCount || 0;
        const atRisk = Math.max(0, Math.floor(totalFarms * 0.1));
        const onTrackRate = totalFarms > 0 ? Math.round(((totalFarms - atRisk) / totalFarms) * 100) : 100;
        const regionName = r._id || 'Unknown Region';

        return enrichRegionSummary({
            id: (i + 1).toString(),
            name: regionName,
            agents: r.agentCount || 0,
            farmers: r.farmersCount || 0,
            activeFarms: totalFarms,
            atRiskFarms: atRisk,
            onTrackRate,
            scheduledTraining: trainingByRegion.get(normalizeRegionKey(regionName)) || 0,
            capitalMatched: `GH₵ ${(r.farmersCount * 3500).toLocaleString()}`,
            leadSupervisor: 'Lead Supervisor',
            isOperational: true,
        });
    });

    return dbRegions;
};

// @route   GET api/super-admin/regional-performance
// @desc    Get aggregated stats by region
exports.getRegionalPerformance = async (req, res) => {
    try {
        const finalRegions = await buildRegionalList();

        const totalAgents = finalRegions.reduce((sum, r) => sum + r.agents, 0);
        const totalAtRisk = finalRegions.reduce((sum, r) => sum + r.atRiskFarms, 0);
        const totalScheduledTraining = finalRegions.reduce((sum, r) => sum + (r.scheduledTraining || 0), 0);
        const avgOnTrackRate = Math.round(
            finalRegions.reduce((sum, r) => sum + r.onTrackRate, 0) / finalRegions.length
        );

        const summaryStats = [
            { label: 'Active Regions', value: finalRegions.length.toString(), trend: null, isPositive: true },
            { label: 'Total Field Agents', value: totalAgents.toString(), trend: null, isPositive: true },
            { label: 'Overall On-Track Rate', value: `${avgOnTrackRate}%`, trend: null, isPositive: true },
            { label: 'At-Risk Farms', value: totalAtRisk.toString(), trend: null, isPositive: true },
            { label: 'Agent-Led Training', value: totalScheduledTraining.toString(), trend: 'From field deliveries', isPositive: true },
        ];

        const alerts = await Escalation.find({ status: { $ne: 'resolved' }, priority: { $in: ['critical', 'high'] } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('region message priority')
            .lean()
            .then((rows) =>
                rows.map((e, i) => ({
                    id: e._id?.toString() || `alt-${i}`,
                    region: e.region || 'Unknown',
                    text: e.message || 'Escalation flagged',
                    severity: e.priority === 'critical' ? 'red' : 'amber',
                }))
            );

        res.json({
            summaryStats,
            regions: finalRegions,
            alerts,
        });
    } catch (err) {
        console.error('Error in getRegionalPerformance:', err);
        res.json({ summaryStats: [], regions: [], alerts: [] });
    }
};

// @route   GET api/super-admin/regional-performance/:id
// @desc    Get deep-dive details for a single region
exports.getRegionalPerformanceDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const regions = await buildRegionalList();
        const region = regions.find((r) => r.id === id);

        if (!region) {
            return res.status(404).json({ msg: 'Region not found' });
        }

        const variants = regionNameVariants(region.name);
        const [agents, farmers] = await Promise.all([
            withTimeout(
                Agent.find({ role: 'agent', region: { $in: variants } })
                    .select('name updatedAt stats agentId')
                    .sort({ updatedAt: -1 })
                    .limit(20)
            ),
            withTimeout(
                Farmer.find({ region: { $in: variants } })
                    .select('name status investmentStatus currentStage updatedAt')
                    .sort({ updatedAt: -1 })
                    .limit(20)
            ),
        ]);

        const agentIds = agents.map((a) => a._id);
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const visitTarget = Math.ceil(PERFORMANCE_TARGETS.VISIT_FREQUENCY);

        const [farmerStats, visitStats, trainingStats] = await Promise.all([
            Farmer.aggregate([
                { $match: { agent: { $in: agentIds } } },
                {
                    $group: {
                        _id: '$agent',
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                        verified: {
                            $sum: {
                                $cond: [
                                    { $or: [{ $eq: ['$status', 'active'] }, { $eq: ['$verificationConfirmed', true] }] },
                                    1,
                                    0,
                                ],
                            },
                        },
                        female: { $sum: { $cond: [{ $eq: [{ $toLower: { $ifNull: ['$gender', ''] } }, 'female'] }, 1, 0] } },
                        male: { $sum: { $cond: [{ $eq: [{ $toLower: { $ifNull: ['$gender', ''] } }, 'male'] }, 1, 0] } },
                        profileComplete: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: [{ $ifNull: ['$idCardFront', ''] }, ''] },
                                            { $ne: [{ $ifNull: ['$idCardBack', ''] }, ''] },
                                            { $gt: [{ $ifNull: ['$farmLocation.lat', 0] }, 0] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
            FieldVisit.aggregate([
                { $match: { agent: { $in: agentIds }, date: { $gte: monthStart } } },
                { $group: { _id: '$agent', visitCount: { $sum: 1 } } },
            ]),
            TrainingDelivery.aggregate([
                { $match: { agent: { $in: agentIds }, status: { $ne: 'cancelled' } } },
                { $group: { _id: '$agent', count: { $sum: 1 } } },
            ]),
        ]);

        const farmerByAgent = new Map(farmerStats.map((r) => [r._id.toString(), r]));
        const visitsByAgent = new Map(visitStats.map((r) => [r._id.toString(), r.visitCount]));
        const trainingByAgent = new Map(trainingStats.map((r) => [r._id.toString(), r.count]));

        const agentsList = agents.map((agent) => {
            const key = agent._id.toString();
            const stats = farmerByAgent.get(key) || { total: 0, active: 0, verified: 0, female: 0, male: 0, profileComplete: 0 };
            const totalFarmers = stats.total || 0;
            const visitCount = visitsByAgent.get(key) || 0;
            const avgVisitsPerFarmer = totalFarmers > 0 ? parseFloat((visitCount / totalFarmers).toFixed(1)) : 0;
            const syncRate = totalFarmers ? Math.round((stats.profileComplete / totalFarmers) * 100) : 0;

            const kpis = performanceService.calculateKpis({
                totalFarmers,
                activeFarmers: stats.active || 0,
                verifiedFarmers: stats.verified || 0,
                avgVisitsPerFarmer,
                syncRate,
                femaleCount: stats.female || 0,
                maleCount: stats.male || 0,
            });
            const overallScore = performanceService.calculateOverallScore(kpis);

            return {
                name: agent.name,
                agentId: agent.agentId,
                lastSync: agent.updatedAt
                    ? new Date(agent.updatedAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                      })
                    : 'N/A',
                kpi: `${overallScore}%`,
                scheduledTraining: trainingByAgent.get(key) || 0,
                visitCompliance: totalFarmers
                    ? Math.min(100, Math.round((avgVisitsPerFarmer / visitTarget) * 100))
                    : 0,
            };
        });

        const farmerRows = farmers.map((farmer) => ({
            name: farmer.name,
            status: mapFarmerPerformanceStatus(farmer),
        }));

        const onTrack = farmerRows.filter((f) => f.status === 'On Track').length;
        const atRisk = farmerRows.filter((f) => f.status === 'At Risk').length;
        const offTrack = farmerRows.filter((f) => f.status === 'Off Track').length;

        const fundedFarms = {
            onTrack: onTrack || Math.max(0, (region.activeFarms || 0) - (region.atRiskFarms || 0)),
            atRisk: atRisk || region.atRiskFarms || 0,
            offTrack: offTrack || Math.max(0, Math.floor((region.activeFarms || 0) * 0.05)),
        };

        const capitalBase = region.capitalDeployed || parseCapitalAmount(region.capitalMatched);
        const capitalFlow = {
            disbursed: Math.round(capitalBase * 0.65),
            pending: Math.round(capitalBase * 0.2),
            settled: Math.round(capitalBase * 0.15),
        };

        res.json({
            ...region,
            agentsList: agentsList.length
                ? agentsList
                : [{ name: 'No field agents assigned yet', lastSync: '—', kpi: '—' }],
            fundedFarms,
            capitalFlow,
            farmers: farmerRows.length
                ? farmerRows
                : [{ name: 'No farmers onboarded in this region yet', status: 'Pending' }],
        });
    } catch (err) {
        console.error('Error in getRegionalPerformanceDetail:', err);
        res.status(500).json({ msg: 'Failed to load region details' });
    }
};

// @route   GET api/super-admin/agents
// @desc    Get all agents with activity stats
exports.getAgentAccountability = async (req, res) => {
    try {
        const agents = await withTimeout(
            Agent.find({ role: 'agent' })
                .select('name region isLoggedIn currentSessionId stats updatedAt status agentId')
                .sort({ updatedAt: -1 })
                .lean()
        );

        if (!agents || agents.length === 0) {
            return res.json([]);
        }

        const agentIds = agents.map((a) => a._id);
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const visitTarget = Math.ceil(PERFORMANCE_TARGETS.VISIT_FREQUENCY);

        const [farmerStats, visitStats] = await Promise.all([
            Farmer.aggregate([
                { $match: { agent: { $in: agentIds } } },
                {
                    $group: {
                        _id: '$agent',
                        total: { $sum: 1 },
                        profileComplete: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: [{ $ifNull: ['$idCardFront', ''] }, ''] },
                                            { $ne: [{ $ifNull: ['$idCardBack', ''] }, ''] },
                                            { $gt: [{ $ifNull: ['$farmLocation.lat', 0] }, 0] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),
            FieldVisit.aggregate([
                { $match: { agent: { $in: agentIds }, date: { $gte: monthStart } } },
                { $group: { _id: '$agent', visitCount: { $sum: 1 } } },
            ]),
        ]);

        const farmerByAgent = new Map(farmerStats.map((r) => [r._id.toString(), r]));
        const visitsByAgent = new Map(visitStats.map((r) => [r._id.toString(), r.visitCount]));

        const mappedAgents = agents.map((agent) => {
            const key = agent._id.toString();
            const stats = farmerByAgent.get(key) || { total: 0, profileComplete: 0 };
            const totalFarmers = stats.total || agent.stats?.farmersOnboarded || 0;
            const visitCount = visitsByAgent.get(key) || 0;
            const avgVisits = totalFarmers > 0 ? visitCount / totalFarmers : 0;
            const dataQuality = totalFarmers
                ? Math.round((stats.profileComplete / totalFarmers) * 100)
                : 0;
            const visitCompliance = totalFarmers
                ? Math.min(100, Math.round((avgVisits / visitTarget) * 100))
                : 0;

            return {
                id: agent._id,
                name: agent.name,
                agentId: agent.agentId,
                region: agent.region,
                lastSync: agent.updatedAt,
                dataQuality,
                visitCompliance,
                corrections: 0,
                commission: (agent.stats?.farmersOnboarded || 0) * 50,
                farmers: agent.stats?.farmersOnboarded || 0,
                status: agent.status === 'active' ? 'Active' : 'At Risk',
            };
        });

        res.json(mappedAgents);
    } catch (err) {
        console.error('Error in getAgentAccountability:', err);
        res.status(500).json({ msg: 'Failed to load agent accountability data' });
    }
};

// @route   GET api/super-admin/escalations
// @desc    Get filtered escalations
exports.getEscalations = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [escalations, total] = await Promise.all([
            withTimeout(Escalation.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean()),
            Escalation.countDocuments(),
        ]);
        
        const mappedEscalations = escalations.map(e => {
            let category = 'System';
            if (e.type === 'supervisor_escalation') category = 'Regional Lead';
            else if (e.type === 'critical_dispute') category = 'Disbursement';
            else if (e.type === 'data_inconsistency') category = 'Data Error';
            else if (e.type === 'agent_performance') category = 'Data Error';

            let priority = 'Medium';
            if (e.priority === 'critical') priority = 'Critical';
            else if (e.priority === 'high') priority = 'High';
            else if (e.priority === 'low') priority = 'Low';

            let status = 'Open';
            if (e.status === 'resolved') status = 'Resolved';
            else if (e.status === 'investigating') status = 'Assigned';

            return {
                id: e._id.toString(),
                priority,
                category,
                issue: e.message || 'Support Request Flagged',
                region: e.region || 'Bono Ahafo Region',
                agent: e.source || 'Lync Agent',
                date: e.createdAt || new Date(),
                status,
                assignee: e.resolvedBy ? 'Super Admin' : null,
                description: e.message || 'No additional description provided.',
                notes: e.notes || []
            };
        });

        res.json({ page, limit, total, data: mappedEscalations });
    } catch (err) {
        console.error('Error in getEscalations:', err);
        res.status(500).json({ msg: 'Failed to load escalations', data: [] });
    }
};

// @route   GET api/super-admin/audit-logs
// @desc    Get system logs
exports.getSystemLogs = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 100, maxLimit: 200 });
        const [logs, total] = await Promise.all([
            withTimeout(
                AuditLog.find()
                    .populate('user', 'name role')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ),
            AuditLog.countDocuments(),
        ]);

        const mappedLogs = logs.map(l => {
            let severity = 'Low';
            if (l.action.includes('DELETE') || l.action.includes('ERROR') || l.action.includes('OVERRIDE')) severity = 'High';
            if (l.action.includes('FAILED')) severity = 'Critical';
            
            let status = 'Success';
            if (l.action.includes('FAILED') || l.action.includes('REJECTED')) status = 'Failed';

            return {
                id: l._id.toString(),
                action: l.action || 'PLATFORM_EVENT',
                user: l.user?.name || 'System Auto-Agent',
                severity,
                status,
                timestamp: l.createdAt || new Date(),
                details: l.details || 'General system registry execution.',
                resource: l.targetResource || 'Platform'
            };
        });

        res.json({ page, limit, total, data: mappedLogs });
    } catch (err) {
        console.error('Error in getSystemLogs:', err);
        res.status(500).json({ msg: 'Failed to load system logs', data: [] });
    }
};
// @route   GET api/super-admin/farms
// @desc    Get all farms with details
exports.getFarmsOversight = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [farms, total] = await Promise.all([
            withTimeout(
                Farm.find()
                    .populate('farmerId', 'name region')
                    .populate('agentId', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
            ),
            Farm.countDocuments(),
        ]);

        const mappedFarms = farms.map(f => ({
            id: f._id,
            name: f.farmName,
            farmer: f.farmerId?.name || 'N/A',
            region: f.farmerId?.region || 'N/A',
            agent: f.agentId?.name || 'Unassigned',
            status: f.status || 'Active',
            compliance: f.reportStatus || '—',
            crop: f.cropType || '—',
            maturity: f.growthStage || '—',
        }));

        res.json({ page, limit, total, data: mappedFarms });
    } catch (err) {
        console.error('Error in getFarmsOversight:', err);
        res.status(500).json({ msg: 'Failed to load farms', data: [] });
    }
};

// @route   GET api/super-admin/partnerships
// @desc    Get all active partnerships
exports.getPartnershipsSummary = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [matches, total] = await Promise.all([
            withTimeout(
                Match.find()
                    .populate('farmerId', 'name region')
                    .populate('farmId', 'farmName')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
            ),
            Match.countDocuments(),
        ]);

        const mappedMatches = matches.map(m => ({
            id: m._id,
            farm: m.farmId?.farmName || 'N/A',
            farmer: m.farmerId?.name || 'N/A',
            investor: m.investorName || 'N/A',
            amount: m.amount || 0,
            status: m.status || 'Ongoing',
            region: m.farmerId?.region || 'N/A',
            start: m.createdAt ? m.createdAt.toISOString().split('T')[0] : null,
        }));

        res.json({ page, limit, total, data: mappedMatches });
    } catch (err) {
        console.error('Error in getPartnershipsSummary:', err);
        res.status(500).json({ msg: 'Failed to load partnerships', data: [] });
    }
};

// @route   GET api/super-admin/supervisors
// @desc    List supervisors for agent assignment
exports.getSupervisors = async (req, res) => {
    try {
        const supervisors = await Agent.find({
            role: 'supervisor',
            status: { $ne: 'inactive' },
        })
            .select('name contact email region agentId')
            .sort({ name: 1 })
            .lean();

        res.json(supervisors.map((s) => ({
            id: s._id.toString(),
            name: s.name,
            contact: s.contact || '',
            email: s.email,
            region: s.region,
            staffAccountNumber: s.agentId,
        })));
    } catch (err) {
        console.error('getSupervisors error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @route   GET api/super-admin/users-list
// @desc    Get all supervisors and agents (with pagination)
exports.getUsersList = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const roleQuery = { role: { $in: ['supervisor', 'agent', 'super_admin'] } };

        const [dbUsers, total] = await Promise.all([
            withTimeout(
                Agent.find(roleQuery)
                    .select('name email role region status agentId contact districts avatar hasChangedPassword supervisor enableMultipleLogin')
                    .populate('supervisor', 'name contact')
                    .sort({ role: 1, name: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ),
            Agent.countDocuments(roleQuery),
        ]);

        const mappedUsers = dbUsers.map(u => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            phone: u.contact || '',
            role: u.role === 'supervisor' ? 'Supervisor' : u.role === 'super_admin' ? 'Super Admin' : 'Lync Agent',
            region: u.region,
            communities: u.districts || [],
            passwordChanged: u.hasChangedPassword ? 'Yes' : 'No',
            disabled: (u.status === 'inactive' || u.status === 'suspended') ? 'Yes' : 'No',
            staffAccountNumber: u.agentId,
            avatar: u.avatar || '',
            enableMultipleLogin: u.enableMultipleLogin || false,
            supervisorId: u.supervisor?._id?.toString() || (typeof u.supervisor === 'string' ? u.supervisor : '') || '',
            supervisorName: u.supervisor?.name || '',
            authorised: true
        }));

        res.json({ page, limit, total, data: mappedUsers });
    } catch (err) {
        console.error('Error in getUsersList:', err);
        res.status(500).json({ msg: 'Failed to load users', data: [] });
    }
};

// @route   GET api/super-admin/farmers
// @desc    Get all farmers with contact and investor information
exports.getAllFarmers = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);

        const [farmers, total] = await Promise.all([
            withTimeout(
                Farmer.find()
                    .select('name email contact region farmSize cropsGrown status investmentInterest investmentStatus avatar createdAt profileCompleteness')
                    .populate('agent', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ),
            Farmer.countDocuments(),
        ]);

        const transformedFarmers = farmers.map((farmer) => ({
            id: farmer._id,
            name: farmer.name,
            email: farmer.email || '',
            phone: farmer.contact || '',
            region: farmer.region,
            farmName: `${farmer.name}'s Farm`,
            crop: farmer.cropsGrown || 'Mixed Crops',
            acreage: farmer.farmSize || 0,
            status: farmer.status === 'active' ? 'Active' : farmer.status === 'inactive' ? 'Inactive' : 'Pending',
            hasInvestor: farmer.investmentStatus === 'Matched' || farmer.investmentStatus === 'Active',
            investorName: farmer.investmentStatus === 'Matched' || farmer.investmentStatus === 'Active' ? 'Investment Partner' : null,
            matchDate: farmer.investmentStatus === 'Matched' || farmer.investmentStatus === 'Active'
                ? new Date(farmer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : null,
            agentName: farmer.agent?.name || 'Unassigned',
            avatar: farmer.avatar || null,
            profileCompleteness: farmer.profileCompleteness ?? 0,
        }));

        res.json({ page, limit, total, data: transformedFarmers });
    } catch (err) {
        console.error('Error in getAllFarmers:', err);
        res.status(500).json({ msg: 'Failed to load farmers', data: [] });
    }
};

// @route   GET api/super-admin/grower-id-cards
// @desc    Registry of digital ID cards issued to onboarded growers
exports.getGrowerIdCards = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
        const skip = (page - 1) * limit;
        const search = String(req.query.search || '').trim();

        const query = { digitalCardGenerated: true, status: 'active' };
        if (search) {
            const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            query.$or = [{ name: re }, { id: re }, { digitalCardNumber: re }, { region: re }];
        }

        const [data, total] = await Promise.all([
            Farmer.find(query)
                .select(
                    'name id digitalCardNumber digitalCardIssuedAt region district community dob yearsOfExperience profilePicture agent onboardingAgentId status'
                )
                .populate('agent', 'name agentId')
                .sort({ digitalCardIssuedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Farmer.countDocuments(query),
        ]);

        res.json({ success: true, page, limit, total, data });
    } catch (err) {
        console.error('Error in getGrowerIdCards:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET api/super-admin/farmers/:id
// @desc    Get detailed farmer profile, visits, and KYC
exports.getFarmerDetails = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id)
            .populate('agent', 'name agentId contact email region')
            .select('-password')
            .lean();

        if (!farmer) return res.status(404).json({ msg: 'Farmer not found' });

        const [fieldVisits, farms, scheduledVisits, media] = await Promise.all([
            FieldVisit.find({ farmer: farmer._id }).sort({ date: -1 }).limit(25).lean(),
            Farm.find({ farmer: farmer._id }).sort({ createdAt: -1 }).lean(),
            ScheduledVisit.find({ farmers: farmer._id }).sort({ scheduledDate: -1 }).limit(15).lean(),
            Media.find({ farmer: farmer._id }).sort({ createdAt: -1 }).limit(20).select('name type url category createdAt').lean(),
        ]);

        res.json({
            farmer,
            fieldVisits,
            farms,
            scheduledVisits,
            media,
        });
    } catch (err) {
        console.error('Error in getFarmerDetails:', err);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/super-admin/notifications
// @desc    Send notification to a specific agent
exports.sendNotification = async (req, res) => {
    const { agentId, title, message, type, priority, senderRole, senderName } = req.body;

    try {
        const agentExists = await Agent.findById(agentId);
        if (!agentExists) {
            return res.status(404).json({ msg: 'Target agent not found' });
        }

        await notifyStaffAgent({
            agentId,
            title,
            message,
            smsBody: staffSms(`${title}. ${message}`),
            type: type || 'message',
            priority: priority || 'medium',
            senderRole: senderRole || 'super-admin',
            senderName: senderName || req.agent.name || 'Admin',
        });

        await AuditLog.create({
            action: 'SEND_NOTIFICATION',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Sent notification: ${title} to Agent: ${agentExists.name}`,
            targetResource: 'Notification',
            targetId: agentId
        });

        res.json({ success: true, msg: 'Notification sent with SMS where enabled.' });
    } catch (err) {
        console.error('Error in sendNotification:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/super-admin/users
// @desc    Create Supervisor or Agent
exports.createUser = async (req, res) => {
    const { name, email, phone, role, region, communities, disabled, staffAccountNumber, enableMultipleLogin, avatar, supervisorId } = req.body;
    try {
        let user = await Agent.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const dbRole = role === 'super_admin' ? 'super_admin' : role === 'supervisor' ? 'supervisor' : 'agent';
        let assignedSupervisor = null;
        try {
            assignedSupervisor = await resolveSupervisorAssignment(supervisorId, dbRole);
        } catch (assignErr) {
            return res.status(assignErr.status || 400).json({ msg: assignErr.message });
        }

        const generatedPassword = crypto.randomBytes(4).toString('hex');
        const finalAgentId = staffAccountNumber?.trim() || (await generateUniqueStaffId(Agent, dbRole));

        user = new Agent({
            name,
            email,
            contact: phone,
            role: dbRole,
            region,
            districts: communities,
            status: disabled === 'Yes' ? 'inactive' : 'active',
            password: generatedPassword,
            hasChangedPassword: false, // Force password update on first login
            agentId: finalAgentId,
            supervisor: assignedSupervisor?._id || null,
            enableMultipleLogin:
                role === 'super_admin' || role === 'Super Admin' || role === 'supervisor' || role === 'Supervisor'
                    ? true
                    : Boolean(enableMultipleLogin),
            avatar: avatar?.trim() || ''
        });

        await user.save();

        // Create Audit Log
        await AuditLog.create({
            action: 'CREATE_USER',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Created ${user.role}: ${user.name}`,
            targetResource: 'Agent',
            targetId: user.id
        });

        if (phone) {
            const smsService = require('../utils/smsService');
            const frontendUrl = process.env.FRONTEND_URL || 'https://agrilync.com';
            const agentLoginUrl = `${frontendUrl.replace(/\/$/, '')}/agent/login`;
            const message = buildAccountCreationSms({
                name,
                dbRole,
                agentId: finalAgentId,
                region,
                loginUrl: agentLoginUrl,
                supervisor: assignedSupervisor || null,
            });
            smsService.sendSMS(phone, message).catch((err) => console.error('Account creation SMS failed:', err.message));
        }

        if (dbRole === 'agent' && assignedSupervisor) {
            const agentForNotify = await Agent.findById(user._id)
                .select('name contact agentId region email fcmToken notificationPreferences')
                .lean();
            await notifySupervisorAssignmentPair(agentForNotify, assignedSupervisor);
        }

        const supervisorDoc = assignedSupervisor || null;

        res.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.contact || '',
            role: user.role === 'supervisor' ? 'Supervisor' : user.role === 'super_admin' ? 'Super Admin' : 'Lync Agent',
            region: user.region,
            communities: user.districts || [],
            passwordChanged: 'No',
            disabled: user.status === 'inactive' ? 'Yes' : 'No',
            staffAccountNumber: user.agentId,
            avatar: user.avatar,
            enableMultipleLogin: user.enableMultipleLogin,
            supervisorId: supervisorDoc?._id?.toString() || '',
            supervisorName: supervisorDoc?.name || '',
            authorised: true
        });
    } catch (err) {
        console.error('createUser error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/super-admin/users/:id
// @desc    Update Supervisor or Agent
exports.updateUser = async (req, res) => {
    const { name, email, phone, role, region, communities, disabled, resetPassword, resetSession, enableMultipleLogin, avatar, supervisorId } = req.body;
    try {
        let user = await Agent.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (name !== undefined) user.name = name || user.name;
        if (email !== undefined) user.email = email || user.email;
        if (phone !== undefined) user.contact = phone || user.contact;
        if (role !== undefined) {
            const dbRole = toDbRole(role);
            if (dbRole) user.role = dbRole;
        }
        if (region !== undefined) user.region = region || user.region;
        if (communities !== undefined) user.districts = communities;

        const previousSupervisorId = user.supervisor ? String(user.supervisor) : '';
        let assignedSupervisorDoc = null;
        const effectiveRole = role !== undefined ? toDbRole(role) : user.role;
        if (supervisorId !== undefined || role !== undefined) {
            if (effectiveRole === 'agent') {
                try {
                    const targetSupervisorId =
                        supervisorId !== undefined ? supervisorId : previousSupervisorId || null;
                    assignedSupervisorDoc = await resolveSupervisorAssignment(targetSupervisorId, 'agent');
                    user.supervisor = assignedSupervisorDoc._id;
                } catch (assignErr) {
                    return res.status(assignErr.status || 400).json({ msg: assignErr.message });
                }
            } else {
                user.supervisor = null;
            }
        }
        const previousStatus = user.status;
        let generatedPassword = null;

        if (disabled !== undefined) {
            user.status = disabled === 'Yes' ? 'inactive' : 'active';
        }

        if (enableMultipleLogin !== undefined) {
            user.enableMultipleLogin = enableMultipleLogin;
        }
        if (user.role === 'super_admin' || user.role === 'supervisor') {
            user.enableMultipleLogin = true;
        }

        if (avatar !== undefined) {
            user.avatar = avatar?.trim() || '';
        }

        if (resetSession) {
            user.isLoggedIn = false;
            user.currentSessionId = null;
            user.refreshToken = null;
        }

        if (resetPassword) {
            generatedPassword = crypto.randomBytes(4).toString('hex');
            user.password = generatedPassword;
            user.hasChangedPassword = false;
            user.isLoggedIn = false;
            user.currentSessionId = null;
            user.refreshToken = null;
        }

        await user.save();

        if (
            effectiveRole === 'agent' &&
            assignedSupervisorDoc &&
            String(assignedSupervisorDoc._id) !== previousSupervisorId
        ) {
            const agentForNotify = await Agent.findById(user._id)
                .select('name contact agentId region email fcmToken notificationPreferences')
                .lean();
            await notifySupervisorAssignmentPair(agentForNotify, assignedSupervisorDoc);
        }

        const adminName = req.agent.name || 'Admin';
        if (generatedPassword) {
            await notifyStaffAgent({
                agentId: user._id,
                title: 'Password Reset',
                message: 'An admin reset your AgriLync password. Contact your administrator for the new temporary password, then change it after signing in.',
                smsBody: staffSms(
                    `Your AgriLync password was reset by ${adminName}. ` +
                        `Contact your administrator for your temporary password. Change it after signing in.`
                ),
                priority: 'high',
                senderName: adminName,
            });
        }

        if (disabled !== undefined && previousStatus !== user.status) {
            if (user.status === 'inactive') {
                await notifyStaffAgent({
                    agentId: user._id,
                    title: 'Account Deactivated',
                    message: 'Your AgriLync staff account has been deactivated by an admin.',
                    smsBody: staffSms(`Your AgriLync account was deactivated by ${adminName}. Contact admin if this is unexpected.`),
                    priority: 'high',
                    senderName: adminName,
                });
            } else if (previousStatus === 'inactive' && user.status === 'active') {
                await notifyStaffAgent({
                    agentId: user._id,
                    title: 'Account Reactivated',
                    message: 'Your AgriLync staff account is active again.',
                    smsBody: staffSms(`Your AgriLync account was reactivated by ${adminName}. You can sign in again.`),
                    priority: 'medium',
                    senderName: adminName,
                });
            }
        }

        const actorId = getRequestAgentId(req.agent);
        if (actorId) {
            await writeAuditLog({
                action: resetSession ? 'RESET_SESSION' : 'UPDATE_USER',
                user: actorId,
                userRole: req.agent.role,
                details: resetSession
                    ? `Reset login session for ${user.role}: ${user.name}`
                    : `Updated ${user.role}: ${user.name}`,
                targetResource: 'Agent',
                targetId: user._id.toString()
            });
        }

        const populated = await Agent.findById(user._id)
            .populate('supervisor', 'name contact')
            .select('name email contact role region districts hasChangedPassword status agentId avatar enableMultipleLogin supervisor')
            .lean();

        res.json({
            id: populated._id.toString(),
            name: populated.name,
            email: populated.email,
            phone: populated.contact || '',
            role: populated.role === 'supervisor' ? 'Supervisor' : populated.role === 'super_admin' ? 'Super Admin' : 'Lync Agent',
            region: populated.region,
            communities: populated.districts || [],
            passwordChanged: populated.hasChangedPassword ? 'Yes' : 'No',
            disabled: (populated.status === 'inactive' || populated.status === 'suspended') ? 'Yes' : 'No',
            staffAccountNumber: populated.agentId,
            avatar: populated.avatar,
            enableMultipleLogin: populated.enableMultipleLogin,
            supervisorId: populated.supervisor?._id?.toString() || '',
            supervisorName: populated.supervisor?.name || '',
            authorised: true
        });
    } catch (err) {
        console.error('updateUser error:', err.message);
        res.status(500).json({ msg: err.message || 'Failed to update user' });
    }
};

// @route   POST api/super-admin/users/:id/reset-session
// @desc    Clear a user's active login session so they can sign in again
exports.resetUserSession = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid user id' });
        }

        const user = await Agent.findByIdAndUpdate(
            id,
            { $set: { isLoggedIn: false, currentSessionId: null, refreshToken: null } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const adminName = req.agent.name || 'Admin';
        await notifyStaffAgent({
            agentId: user._id,
            title: 'Session Reset',
            message: `${adminName} cleared your active login session. You can sign in again.`,
            smsBody: staffSms(`${adminName} reset your AgriLync login session. Please sign in again if you were logged out.`),
            priority: 'medium',
            senderName: adminName,
        });

        const actorId = getRequestAgentId(req.agent);
        if (actorId) {
            await writeAuditLog({
                action: 'RESET_SESSION',
                user: actorId,
                userRole: req.agent.role || 'super_admin',
                details: `Reset login session for ${user.role}: ${user.name}`,
                targetResource: 'Agent',
                targetId: user._id.toString()
            });
        }

        res.json({ msg: 'Session cleared successfully' });
    } catch (err) {
        console.error('resetUserSession error:', err.message);
        res.status(500).json({ msg: err.message || 'Failed to clear user session' });
    }
};

// @route   DELETE api/super-admin/users/:id
// @desc    Delete Supervisor or Agent
exports.deleteUser = async (req, res) => {
    try {
        let user = await Agent.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const adminName = req.agent.name || 'Admin';
        if (user.contact) {
            await notifyStaffAgent({
                agentDoc: user.toObject ? user.toObject() : user,
                title: 'Account Removed',
                message: `Your AgriLync staff account was removed by ${adminName}.`,
                smsBody: staffSms(`Your AgriLync staff account was removed by ${adminName}. Contact admin if you need assistance.`),
                priority: 'high',
                senderName: adminName,
            });
        }

        await Agent.findByIdAndDelete(req.params.id);

        await AuditLog.create({
            action: 'DELETE_USER',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Deleted ${user.role}: ${user.name}`,
            targetResource: 'Agent',
            targetId: user.id
        });

        res.json({ success: true, msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/super-admin/farmers/:id/status
// @desc    Update farmer verification status
exports.updateFarmerStatus = async (req, res) => {
    const { status, note } = req.body;
    try {
        let farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ msg: 'Farmer not found' });
        }

        farmer.status = status === 'On Track' || status === 'Active' ? 'active' : status === 'Pending' ? 'pending' : 'inactive';
        await farmer.save();

        await AuditLog.create({
            action: 'OVERRIDE_FARMER_STATUS',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Updated status of farmer ${farmer.name} to ${status}. Note: ${note || 'None'}`,
            targetResource: 'Farmer',
            targetId: farmer.id
        });

        const adminName = req.agent.name || 'Admin';
        if (farmer.agent) {
            await notifyStaffAgent({
                agentId: farmer.agent,
                title: 'Grower Status Updated',
                message: `${adminName} set ${farmer.name} to ${status}.${note ? ` Note: ${truncateSms(note, 120)}` : ''}`,
                smsBody: staffSms(
                    `${adminName} updated grower ${farmer.name} status to ${status}.` +
                        (note ? ` Note: ${truncateSms(note, 80)}` : '')
                ),
                type: 'verification',
                priority: 'high',
                senderName: adminName,
            });
        }

        res.json({ success: true, farmer });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/super-admin/escalations/:id/resolve
// @desc    Resolve support ticket
exports.resolveEscalation = async (req, res) => {
    try {
        let escalation = await Escalation.findById(req.params.id);
        if (!escalation) {
            // Support resolving standard hardcoded tickets smoothly by returning success
            return res.json({ success: true, msg: 'Demo ticket resolved successfully' });
        }

        escalation.status = 'resolved';
        escalation.resolvedBy = req.agent.id;
        escalation.resolvedAt = new Date();
        await escalation.save();

        // Create Audit Log
        await AuditLog.create({
            action: 'RESOLVE_ESCALATION',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Resolved support ticket: ${escalation.message}`,
            targetResource: 'Escalation',
            targetId: escalation.id
        });

        await notifyEscalationResolved(escalation, req.agent.name || 'Admin');

        res.json({ success: true, escalation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/super-admin/visits
// @desc    Get all field visits with details
exports.getVisits = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [visits, total] = await Promise.all([
            withTimeout(
                FieldVisit.find()
                    .populate('agent', 'name')
                    .populate('farmer', 'name region')
                    .sort({ date: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ),
            FieldVisit.countDocuments(),
        ]);

        const mappedVisits = visits.map(v => ({
            id: v._id.toString(),
            date: v.date,
            agent: v.agent?.name || 'Lync Agent',
            farmer: v.farmer?.name || 'Verified Grower',
            region: v.farmer?.region || '—',
            purpose: v.purpose || 'Farm Monitoring',
            status: v.status || 'Completed',
            notes: v.notes || '',
            challenges: v.challenges || 'None',
            images: v.visitImages && v.visitImages.length > 0 ? v.visitImages : [],
        }));

        res.json({ page, limit, total, data: mappedVisits });
    } catch (err) {
        console.error('Error in getVisits:', err);
        res.status(500).json({ msg: 'Failed to load visits', data: [] });
    }
};

// @route   GET api/super-admin/media
// @desc    Get all field media files
exports.getMedia = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [media, total] = await Promise.all([
            withTimeout(
                Media.find()
                    .populate('agent', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ),
            Media.countDocuments(),
        ]);

        // Helper: attempt to make a Cloudinary URL public by switching delivery type
        const fixCloudinaryUrl = (url) => {
            if (!url) return null;
            // Convert private/authenticated delivery to public
            return url
                .replace('/private/', '/upload/')
                .replace('/authenticated/', '/upload/')
                .replace('/image/private/', '/image/upload/')
                .replace('/video/private/', '/video/upload/')
                .replace('/raw/private/', '/raw/upload/');
        };

        const mappedMedia = media.map(m => {
            const rawUrl = m.url;
            const rawThumb = m.thumbnail;
            const isVideo = m.type === 'Video' || (rawUrl && /\.(mp4|mov|avi|webm|mkv)$/i.test(rawUrl));

            return {
                id: m._id.toString(),
                url: fixCloudinaryUrl(rawUrl),
                thumbnail: fixCloudinaryUrl(rawThumb) || null,
                caption: m.name || 'Field Media',
                type: m.type || (isVideo ? 'Video' : 'Photo'),
                isVideo,
                album: m.album || null,
                format: m.format || (isVideo ? 'MP4' : 'JPG'),
                date: m.createdAt ? m.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                agent: m.agent?.name || 'Lync Agent',
                region: m.region || null
            };
        });

        res.json({ page, limit, total, data: mappedMedia });
    } catch (err) {
        console.error('Error in getMedia:', err);
        res.status(500).json({ msg: 'Failed to load media', data: [] });
    }
};

// @route   GET api/super-admin/training
// @desc    Get agent-led training delivery sessions (field training scheduled by agents)
exports.getTraining = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [deliveries, total] = await Promise.all([
            withTimeout(
                TrainingDelivery.find({ status: { $ne: 'cancelled' } })
                    .populate('agent', 'name region agentId')
                    .populate('farmers', 'name id community')
                    .sort({ deliveryDate: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ),
            TrainingDelivery.countDocuments({ status: { $ne: 'cancelled' } }),
        ]);

        const mappedTrainings = deliveries.map((t) => {
            const statusMap = {
                scheduled: 'Scheduled',
                completed: 'Completed',
                cancelled: 'Cancelled',
            };
            return {
                id: t._id.toString(),
                date: t.deliveryDate
                    ? new Date(t.deliveryDate).toISOString().split('T')[0]
                    : t.createdAt?.toISOString().split('T')[0] || 'Unknown',
                trainee: t.agent?.name || 'Field Agent',
                region: t.agent?.region || t.community || null,
                agent: t.agent?.name || 'Field Agent',
                course: t.moduleTitle || 'Training Module',
                category: t.moduleSubtitle || 'AgriLync Field Module',
                mode: t.mode || 'In-Person Farm Visit',
                trainer: t.agent?.name || 'Field Agent',
                status: statusMap[t.status] || 'Scheduled',
                certificate: t.status === 'completed',
                growerCount: Array.isArray(t.farmers) ? t.farmers.length : 0,
                community: t.community || '',
                smsSent: Boolean(t.smsSent),
                deliveryTime: t.deliveryTime || '',
            };
        });

        res.json({ page, limit, total, data: mappedTrainings });
    } catch (err) {
        console.error('Error in getTraining:', err);
        res.status(500).json({ msg: 'Failed to load training sessions', data: [] });
    }
};

// @route   GET api/super-admin/tasks
// @desc    Get field task/mission assignments
exports.getTasks = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const [tasks, total] = await Promise.all([
            withTimeout(
                Task.find()
                    .populate('agent', 'name region')
                    .sort({ dueDate: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ),
            Task.countDocuments(),
        ]);

        const mappedTasks = tasks.map(t => ({
            id: t._id.toString(),
            priority: t.priority === 'urgent' ? 'High' : 'Low',
            dueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : null,
            title: t.title || 'General Farm Verification',
            agent: t.agent?.name || 'Lync Agent',
            region: t.agent?.region || '—',
            progress: t.status === 'done' ? 100 : t.status === 'in-progress' ? 50 : 0
        }));

        res.json({ page, limit, total, data: mappedTasks });
    } catch (err) {
        console.error('Error in getTasks:', err);
        res.status(500).json({ msg: 'Failed to load tasks', data: [] });
    }
};

// @route   GET api/super-admin/reports
// @desc    Get dynamic analytics and reporting logs
exports.getReports = async (req, res) => {
    try {
        const sysActivityData = [
            { time: '00:00', load: 20 }, { time: '04:00', load: 15 }, { time: '08:00', load: 65 },
            { time: '12:00', load: 85 }, { time: '16:00', load: 95 }, { time: '20:00', load: 55 },
        ];

        const reports = [
            { id: 'R1', name: 'Operational Pulse Report', desc: 'Real-time agent productivity and field active thresholds.', format: ['PDF', 'Excel'], lastGenerated: '2 hours ago', data: [{ date: '04/01', val: 450 }, { date: '04/02', val: 520 }, { date: '04/03', val: 480 }, { date: '04/04', val: 610 }] },
            { id: 'R2', name: 'Regional Yield Matrix', desc: 'Deep dive into target fulfillment vs actual yields across all core hubs.', format: ['PDF', 'Excel', 'CSV'], lastGenerated: '1 day ago', data: [{ name: 'Ashanti', val: 850 }, { name: 'Western', val: 920 }, { name: 'Volta', val: 410 }, { name: 'Northern', val: 680 }] },
            { id: 'R3', name: 'Asset Vitality Audit', desc: 'Longitudinal health forensics for all registered farm plots.', format: ['PDF', 'CSV'], lastGenerated: '3 days ago' },
            { id: 'R4', name: 'Strategic Compliance Ledger', desc: 'Full audit logs of policy overrides and security triggers.', format: ['PDF', 'Excel'], lastGenerated: '12 hours ago' },
        ];

        res.json({ reports, sysActivityData });
    } catch (err) {
        console.error('Error in getReports:', err);
        res.json({ reports: [], sysActivityData: [] });
    }
};

const mapBlogAuthor = (author) => ({
    id: author._id.toString(),
    username: author.username,
    email: author.email,
    requiresPasswordChange: author.requiresPasswordChange,
    isActive: author.isActive !== false,
    createdAt: author.createdAt
});

const generateTempPassword = () => crypto.randomBytes(4).toString('hex');

// @route   GET api/super-admin/subscribers
exports.getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
            .select('email phone source lastResource createdAt updatedAt')
            .sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (err) {
        console.error('getSubscribers error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/super-admin/blog-authors
exports.getBlogAuthors = async (req, res) => {
    try {
        const authors = await BlogAdmin.find()
            .select('username email requiresPasswordChange isActive createdAt')
            .sort({ createdAt: -1 });
        res.json(authors.map(mapBlogAuthor));
    } catch (err) {
        console.error('getBlogAuthors error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/super-admin/blog-authors
exports.createBlogAuthor = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim()) {
        return res.status(400).json({ msg: 'Display name and email are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const existing = await BlogAdmin.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ msg: 'A blog author with this email already exists.' });
        }

        const tempPassword = password?.trim() || generateTempPassword();
        if (tempPassword.length < 8) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters.' });
        }

        const author = new BlogAdmin({
            username: username.trim(),
            email: normalizedEmail,
            password: tempPassword,
            requiresPasswordChange: true,
            isActive: true
        });

        await author.save();

        await AuditLog.create({
            action: 'CREATE_BLOG_AUTHOR',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Created blog author: ${author.username} (${author.email})`,
            targetResource: 'BlogAdmin',
            targetId: author.id
        });

        res.status(201).json({
            author: mapBlogAuthor(author),
            temporaryPassword: password?.trim() ? undefined : tempPassword,
            loginUrl: '/blog/admin/login'
        });
    } catch (err) {
        console.error('createBlogAuthor error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/super-admin/blog-authors/:id
exports.updateBlogAuthor = async (req, res) => {
    const { username, email, resetPassword, isActive } = req.body;

    try {
        const author = await BlogAdmin.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ msg: 'Blog author not found.' });
        }

        if (username?.trim()) author.username = username.trim();
        if (email?.trim()) {
            const normalizedEmail = email.trim().toLowerCase();
            const duplicate = await BlogAdmin.findOne({ email: normalizedEmail, _id: { $ne: author._id } });
            if (duplicate) {
                return res.status(400).json({ msg: 'Another blog author already uses this email.' });
            }
            author.email = normalizedEmail;
        }
        if (typeof isActive === 'boolean') author.isActive = isActive;

        let temporaryPassword;
        if (resetPassword) {
            temporaryPassword = generateTempPassword();
            author.password = temporaryPassword;
            author.requiresPasswordChange = true;
        }

        await author.save();

        await AuditLog.create({
            action: 'UPDATE_BLOG_AUTHOR',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Updated blog author: ${author.username}${resetPassword ? ' (password reset)' : ''}${typeof isActive === 'boolean' ? ` (active: ${isActive})` : ''}`,
            targetResource: 'BlogAdmin',
            targetId: author.id
        });

        res.json({
            author: mapBlogAuthor(author),
            temporaryPassword,
            loginUrl: '/blog/admin/login'
        });
    } catch (err) {
        console.error('updateBlogAuthor error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/super-admin/blog-authors/:id
exports.deleteBlogAuthor = async (req, res) => {
    try {
        const author = await BlogAdmin.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ msg: 'Blog author not found.' });
        }

        await BlogAdmin.findByIdAndDelete(req.params.id);

        await AuditLog.create({
            action: 'DELETE_BLOG_AUTHOR',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Deleted blog author: ${author.username} (${author.email})`,
            targetResource: 'BlogAdmin',
            targetId: author.id
        });

        res.json({ success: true, msg: 'Blog author removed.' });
    } catch (err) {
        console.error('deleteBlogAuthor error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/super-admin/farmer-deletion-requests
// @desc    List grower deletion requests (default: pending)
exports.getFarmerDeletionRequests = async (req, res) => {
    try {
        const status = req.query.status || 'pending';
        const filter = status === 'all' ? {} : { status };

        const requests = await FarmerDeletionRequest.find(filter)
            .populate('farmer', 'name id contact region community status profilePicture ghanaCardNumber')
            .populate('requestedBy', 'name agentId contact region')
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        res.json(requests);
    } catch (err) {
        console.error('getFarmerDeletionRequests error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// @route   PUT api/super-admin/farmer-deletion-requests/:id/review
// @desc    Approve or reject a grower deletion request
exports.reviewFarmerDeletionRequest = async (req, res) => {
    const { action, reviewNote } = req.body;

    if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ msg: 'Action must be approve or reject.' });
    }

    try {
        const request = await FarmerDeletionRequest.findById(req.params.id)
            .populate('farmer', 'name id contact')
            .populate('requestedBy', 'name _id');

        if (!request) {
            return res.status(404).json({ msg: 'Deletion request not found.' });
        }
        if (request.status !== 'pending') {
            return res.status(409).json({ msg: 'This request has already been reviewed.' });
        }

        const farmerRef = request.farmer;
        const farmerName = farmerRef?.name || request.farmerSnapshot?.name || 'Grower';
        const agentId = request.requestedBy?._id || request.requestedBy;

        if (action === 'approve') {
            if (!farmerRef) {
                return res.status(404).json({ msg: 'Grower record no longer exists.' });
            }

            const deletionSummary = await deleteFarmerCascade(farmerRef._id);

            request.status = 'approved';
            request.reviewedBy = req.agent._id || req.agent.id;
            request.reviewNote = (reviewNote || '').trim() || 'Approved by admin';
            request.reviewedAt = new Date();
            await request.save();

            await AuditLog.create({
                action: 'APPROVE_FARMER_DELETION',
                user: req.agent.id,
                userRole: req.agent.role,
                details: `Approved deletion of grower ${farmerName}. Agent reason: ${request.reason}. Admin note: ${request.reviewNote}`,
                targetResource: 'FarmerDeletionRequest',
                targetId: request._id.toString(),
            });

            if (agentId) {
                const adminName = req.agent.name || 'Admin';
                await notifyStaffAgent({
                    agentId,
                    title: 'Grower Deletion Approved',
                    message: `Admin approved removal of ${farmerName}. The grower has been permanently deleted.`,
                    smsBody:
                        `AgriLync: Your deletion request for grower ${farmerName} was approved by ${adminName}. ` +
                        `The grower has been permanently removed from the system.`,
                    priority: 'high',
                    senderName: adminName,
                });
            }

            return res.json({
                success: true,
                msg: `${farmerName} has been permanently deleted.`,
                deletionSummary,
                request,
            });
        }

        request.status = 'rejected';
        request.reviewedBy = req.agent._id || req.agent.id;
        request.reviewNote = (reviewNote || '').trim() || 'Rejected by admin';
        request.reviewedAt = new Date();
        await request.save();

        await AuditLog.create({
            action: 'REJECT_FARMER_DELETION',
            user: req.agent.id,
            userRole: req.agent.role,
            details: `Rejected deletion of grower ${farmerName}. Agent reason: ${request.reason}. Admin note: ${request.reviewNote}`,
            targetResource: 'FarmerDeletionRequest',
            targetId: request._id.toString(),
        });

        if (agentId) {
            const adminName = req.agent.name || 'Admin';
            await notifyStaffAgent({
                agentId,
                title: 'Grower Deletion Rejected',
                message: `Admin rejected deletion of ${farmerName}. Note: ${request.reviewNote}`,
                smsBody:
                    `AgriLync: Your deletion request for grower ${farmerName} was rejected by ${adminName}. ` +
                    `Note: ${request.reviewNote}`,
                priority: 'medium',
                senderName: adminName,
            });
        }

        res.json({
            success: true,
            msg: `Deletion request for ${farmerName} was rejected.`,
            request,
        });
    } catch (err) {
        console.error('reviewFarmerDeletionRequest error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
