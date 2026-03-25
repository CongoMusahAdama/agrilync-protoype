const Agent = require('../models/Agent');
const Farmer = require('../models/Farmer');
const { uploadBase64ToCloudinary } = require('../utils/cloudinary');
const { PERFORMANCE_TARGETS } = require('../config/constants');
const performanceService = require('../services/performanceService');

// @route   GET api/agents/profile
// @desc    Get current agent profile
exports.getProfile = async (req, res) => {
    try {
        // DEV BYPASS: If using mock user, skip DB lookup
        if (req.agent && req.agent.isMock) {
            return res.json(req.agent);
        }

        const agent = await Agent.findById(req.agent.id).select('-password').lean();
        res.json(agent);
    } catch (err) {
        console.error('getProfile error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT api/agents/profile
// @desc    Update agent profile
exports.updateProfile = async (req, res) => {
    const { name, contact, region, district, bio, avatar, gender, dob, email } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (contact) profileFields.contact = contact;
    if (region) profileFields.region = region;
    if (district) profileFields.district = district;
    if (bio) profileFields.bio = bio;
    if (avatar) profileFields.avatar = avatar;
    if (gender) profileFields.gender = gender;
    if (dob) profileFields.dob = dob;
    if (email) profileFields.email = email;

    try {
        let agent = await Agent.findById(req.agent.id);

        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

        if (avatar && avatar.startsWith('data:')) {
            profileFields.avatar = await uploadBase64ToCloudinary(avatar, 'agents/avatars');
        } else if (avatar) {
            profileFields.avatar = avatar;
        }

        agent = await Agent.findByIdAndUpdate(
            req.agent.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(agent);
    } catch (err) {
        console.error('updateProfile error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT api/agents/settings
// @desc    Update agent settings (notifications, preferences)
exports.updateSettings = async (req, res) => {
    const { notificationPreferences, appPreferences } = req.body;

    try {
        if (req.agent && req.agent.isMock) {
            return res.json({ success: true, message: 'Mock settings updated' });
        }

        const agent = await Agent.findById(req.agent.id);
        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

        if (notificationPreferences) agent.notificationPreferences = { ...agent.notificationPreferences.toObject(), ...notificationPreferences };
        if (appPreferences) agent.appPreferences = { ...agent.appPreferences.toObject(), ...appPreferences };

        await agent.save();
        res.json({ success: true, data: agent });
    } catch (err) {
        console.error('updateSettings error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT api/agents/verify
// @desc    Update verification status
exports.updateVerification = async (req, res) => {
    const { status } = req.body;

    try {
        let agent = await Agent.findById(req.agent.id);
        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

        agent.verificationStatus = status;
        if (status === 'verified') agent.isVerified = true;

        await agent.save();
        res.json({ success: true, data: agent });
    } catch (err) {
        console.error('updateVerification error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET api/agents/stats
// @desc    Get dashboard stats
exports.getStats = async (req, res) => {
    try {
        const agent = await Agent.findById(req.agent.id).select('stats').lean();
        res.json(agent.stats);
    } catch (err) {
        console.error('getStats error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT api/agents/password
// @desc    Secure password change
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const agentId = req.agent._id || req.agent.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (req.agent && req.agent.isMock) {
            console.log('[MOCK REQ] updatePassword called for:', req.agent.name);
            return res.json({ success: true, message: 'Mock password updated successfully' });
        }

        const agent = await Agent.findById(agentId);
        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

        const isMatch = await agent.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        agent.password = newPassword;
        agent.hasChangedPassword = true;
        await agent.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('updatePassword error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET api/agents/performance
// @desc    Get full performance dashboard data for logged-in agent
exports.getPerformance = async (req, res) => {
    try {
        const agentId = req.agent._id || req.agent.id;

        // DEV BYPASS: If using mock user, return realistic empty response
        if (req.agent && req.agent.isMock) {
            const { PERFORMANCE_TARGETS } = require('../config/constants');
            return res.json({
                success: true,
                agent: {
                    name: req.agent.name,
                    agentId: req.agent.agentId,
                    region: req.agent.region,
                    avatar: req.agent.avatar,
                    title: req.agent.title || 'Field Agent',
                    stats: req.agent.stats,
                },
                summary: { kpisOnTarget: 0, totalKpis: 6, totalFarmers: 0, needsAttention: 0 },
                kpis: [
                    { label: 'Onboarding Volume', value: '0', unit: 'farmers', target: String(PERFORMANCE_TARGETS.ONBOARDING_VOLUME), progress: 0, status: 'Needs Work' },
                    { label: 'Onboarding Completion Rate', value: '0', unit: '%', target: `\u2265${PERFORMANCE_TARGETS.COMPLETION_RATE}%`, progress: 0, status: 'Needs Work' },
                    { label: 'Verification Pass Rate', value: '0', unit: '%', target: `\u2265${PERFORMANCE_TARGETS.VERIFICATION_PASS_RATE}%`, progress: 0, status: 'Needs Work' },
                    { label: 'Monitoring Visit Frequency', value: '0', unit: 'visits/mo', target: `min. ${PERFORMANCE_TARGETS.VISIT_FREQUENCY}`, progress: 0, status: 'Needs Work' },
                    { label: 'Data Sync Timeliness', value: '0', unit: '%', target: `\u2265${PERFORMANCE_TARGETS.SYNC_RATE}%`, progress: 0, status: 'Needs Work' },
                    { label: 'Harvest Yield Documentation', value: '0', unit: 'farms', target: '0', progress: 0, status: 'Needs Work' },
                ],
                trend: [
                    { month: 'Oct', value: 0 }, { month: 'Nov', value: 0 }, { month: 'Dec', value: 0 },
                    { month: 'Jan', value: 0 }, { month: 'Feb', value: 0 }, { month: 'Mar', value: 0 },
                ],
                visitLog: [],
                portfolio: { onTrack: 0, atRisk: 0, offTrack: 0, total: 0 },
                trainingModules: [],
            });
        }

        let agent;

        if (req.agent && req.agent.isMock) {
            agent = req.agent;
        } else {
            agent = await Agent.findById(agentId).select('-password').lean();
            if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
        }

        // ── Load models lazily to avoid circular deps ──────────────────────
        let FieldVisit, Training, Report;
        try { FieldVisit = require('../models/FieldVisit'); } catch (e) { FieldVisit = null; }
        try { Training = require('../models/Training'); } catch (e) { Training = null; }
        try { Report = require('../models/Report'); } catch (e) { Report = null; }

        // ── Farmers ──────────────────────────────────────────────────────────
        const allFarmers = await Farmer.find({ agent: agentId }).lean();
        const totalFarmers = allFarmers.length;
        const activeFarmers = allFarmers.filter(f => f.status === 'active').length;
        const verifiedFarmers = allFarmers.filter(f => f.status === 'verified' || f.status === 'active').length; 

         // KPI calculations moved to service below





        // ── Field Visits this month ─────────────────────────────────────────
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        let visitsThisMonth = [];
        let visitLog = [];
        if (FieldVisit) {
            visitsThisMonth = await FieldVisit.find({
                agent: agentId,
                createdAt: { $gte: monthStart }
            }).populate('farmer', 'name region farmType status').lean();

            visitLog = visitsThisMonth.slice(0, 20).map(v => ({
                farmer: v.farmer?.name || 'Unknown',
                farm: v.farmName || (v.farmer?.farmType ? `${v.farmer.farmType} Farm` : 'Unknown Farm'),
                region: v.farmer?.region || v.region || '—',
                last: v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—',
                visits: '1/2',
                sync: v.synced !== false ? 'Synced' : 'Pending',
                status: v.farmer?.status === 'active' ? 'On Track' : 'At Risk',
                color: v.farmer?.status === 'active' ? 'green' : 'amber'
            }));
        }

        // Visit frequency: avg visits/farmer this month
        const avgVisitsPerFarmer = totalFarmers > 0
            ? parseFloat((visitsThisMonth.length / totalFarmers).toFixed(1))
            : 0;
        const visitFreqProgress = Math.min(Math.round((avgVisitsPerFarmer / 2) * 100), 100);

        // ── Data Sync Timeliness ─────────────────────────────────────────────
        let syncedReports = 0, totalReports = 0;
        if (Report) {
            totalReports = await Report.countDocuments({ agent: agentId });
            syncedReports = await Report.countDocuments({ agent: agentId, synced: true });
        }
        const syncRate = totalReports > 0 ? Math.round((syncedReports / totalReports) * 100) : 0;

        // ── Training ─────────────────────────────────────────────────────────
        let trainingModules = [];
        if (Training) {
            const trainings = await Training.find({ agent: agentId }).lean();
            const completed = trainings.filter(t => t.status === 'completed').length;
            const registered = trainings.filter(t => ['registered', 'upcoming'].includes(t.status)).length;
            trainingModules = [
                { title: 'Financial Literacy', count: `${completed}/${trainings.length}`, perc: trainings.length ? `${Math.round(completed / trainings.length * 100)}%` : '0%' },
                { title: 'Farm Planning & GAP', count: `${registered}/${trainings.length}`, perc: trainings.length ? `${Math.round(registered / trainings.length * 100)}%` : '0%' },
            ];
        }

        // ── Trend calculation via optimized service ───────────────────────
        const trend = await performanceService.calculateOnboardingTrend(agentId);

        // ── Portfolio health split ────────────────────────────────────────────
        const onTrack = allFarmers.filter(f => f.status === 'active').length;
        const atRisk = allFarmers.filter(f => f.status === 'pending').length;
        const offTrack = allFarmers.filter(f => f.status === 'inactive').length;

        // ── KPI scorecard via service ───────────────────────────────────────
        const kpis = performanceService.calculateKpis({
            totalFarmers,
            activeFarmers,
            verifiedFarmers,
            avgVisitsPerFarmer,
            syncRate
        });

        const kpisOnTarget = kpis.filter(k => k.status === 'On Track').length;

        res.json({
            success: true,
            agent: {
                name: agent.name,
                agentId: agent.agentId,
                region: agent.region,
                avatar: agent.avatar,
                title: agent.title,
                stats: agent.stats,
            },
            summary: {
                kpisOnTarget,
                totalKpis: kpis.length,
                totalFarmers,
                needsAttention: offTrack + atRisk,
            },
            kpis,
            trend,
            visitLog,
            portfolio: { onTrack, atRisk, offTrack, total: totalFarmers },
            trainingModules,
        });
    } catch (err) {
        console.error('getPerformance Critical Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error during performance calculation',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};
