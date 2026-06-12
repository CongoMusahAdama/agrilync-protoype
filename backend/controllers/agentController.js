const Agent = require('../models/Agent');
const Farmer = require('../models/Farmer');
const { uploadBase64ToCloudinary } = require('../utils/cloudinary');
const { PERFORMANCE_TARGETS } = require('../config/constants');
const performanceService = require('../services/performanceService');

// @route   GET api/agents/profile
// @desc    Get current agent profile
exports.getProfile = async (req, res) => {
    try {
        if (!req.agent) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // DEV BYPASS or Pre-loaded agent
        // If we have the agent object already (from auth middleware), use it safely
        const agent = await Agent.findById(req.agent._id || req.agent.id)
            .populate('supervisor', 'name contact email agentId region')
            .select('-password')
            .lean();
        
        if (!agent) {
            return res.status(404).json({ success: false, message: 'Agent not found' });
        }

        if (!agent.assignedRegions?.length && agent.region) {
            agent.assignedRegions = [agent.region];
        }

        if (!agent.supervisor && agent.role === 'agent' && agent.region) {
            const fallbackSupervisor = await Agent.findOne({
                role: 'supervisor',
                region: agent.region,
                status: { $ne: 'inactive' },
            }).select('name contact email agentId region').lean();
            if (fallbackSupervisor) {
                agent.supervisor = fallbackSupervisor;
            }
        }

        res.json(agent);
    } catch (err) {
        console.error('getProfile error:', err.message);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// @route   PUT api/agents/profile
// @desc    Update agent profile
exports.updateProfile = async (req, res) => {
    const { name, contact, region, district, community, bio, avatar, gender, dob, email, fcmToken } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (contact) profileFields.contact = contact;
    if (region) profileFields.region = region;
    if (district) profileFields.district = district;
    if (community) profileFields.community = community;
    if (bio) profileFields.bio = bio;
    if (avatar) profileFields.avatar = avatar;
    if (gender) profileFields.gender = gender;
    if (dob) profileFields.dob = dob;
    if (email) profileFields.email = email;
    if (fcmToken) profileFields.fcmToken = fcmToken;

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
        const range = ['month', 'season', 'all'].includes(req.query.range) ? req.query.range : 'month';

        let agent;
        if (req.agent?.isMock) {
            agent = req.agent;
        } else {
            agent = await Agent.findById(agentId).select('-password').lean();
            if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
        }

        const now = new Date();
        const rangeStart = range === 'month'
            ? new Date(now.getFullYear(), now.getMonth(), 1)
            : range === 'season'
                ? new Date(now.getFullYear(), now.getMonth() - 5, 1)
                : new Date(2000, 0, 1);

        const FieldVisit = require('../models/FieldVisit');
        const Report = require('../models/Report');
        const Match = require('../models/Match');

        const allFarmers = await Farmer.find({ agent: agentId }).lean();
        const scopedFarmers = allFarmers.filter((f) => new Date(f.createdAt) >= rangeStart);
        const totalFarmers = scopedFarmers.length;
        const activeFarmers = scopedFarmers.filter((f) => f.status === 'active').length;
        const verifiedFarmers = scopedFarmers.filter((f) => f.status === 'active' || f.verificationConfirmed).length;

        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const visitsThisMonth = await FieldVisit.find({
            agent: agentId,
            date: { $gte: monthStart },
        }).populate('farmer', 'name region farmType status').lean();

        const avgVisitsPerFarmer = allFarmers.length > 0
            ? parseFloat((visitsThisMonth.length / allFarmers.length).toFixed(1))
            : 0;

        const totalReports = await Report.countDocuments({ agent: agentId, createdAt: { $gte: rangeStart } });
        const reviewedReports = await Report.countDocuments({ agent: agentId, status: 'reviewed', createdAt: { $gte: rangeStart } });
        const syncRate = totalReports > 0 ? Math.round((reviewedReports / totalReports) * 100) : (allFarmers.length ? 100 : 0);

        const profileComplete = allFarmers.filter((f) => f.idCardFront && f.idCardBack && f.farmLocation?.lat).length;
        const profileSyncRate = allFarmers.length ? Math.round((profileComplete / allFarmers.length) * 100) : 0;
        const effectiveSyncRate = Math.max(syncRate, profileSyncRate);

        const femaleCount = scopedFarmers.filter((f) => f.gender?.toLowerCase() === 'female').length;
        const maleCount = scopedFarmers.filter((f) => f.gender?.toLowerCase() === 'male').length;

        const kpis = performanceService.calculateKpis({
            totalFarmers: range === 'all' ? allFarmers.length : totalFarmers,
            activeFarmers: range === 'all' ? allFarmers.filter((f) => f.status === 'active').length : activeFarmers,
            verifiedFarmers: range === 'all'
                ? allFarmers.filter((f) => f.status === 'active' || f.verificationConfirmed).length
                : verifiedFarmers,
            avgVisitsPerFarmer,
            syncRate: effectiveSyncRate,
            femaleCount: range === 'all'
                ? allFarmers.filter((f) => f.gender?.toLowerCase() === 'female').length
                : femaleCount,
            maleCount: range === 'all'
                ? allFarmers.filter((f) => f.gender?.toLowerCase() === 'male').length
                : maleCount,
        });

        const overallScore = performanceService.calculateOverallScore(kpis);
        const trend = await performanceService.calculateOnboardingTrend(agentId);
        const metricTrends = await performanceService.calculateMetricTrends(agentId, allFarmers.length);
        const visitLog = performanceService.buildVisitLog(allFarmers, visitsThisMonth);
        const trainingModules = performanceService.calculateTrainingDeliveryProgress(allFarmers);
        const compliance = performanceService.calculateCompliance(allFarmers, effectiveSyncRate);
        const verification = performanceService.calculateVerificationStats(allFarmers);

        const farmersWithTraining = allFarmers.filter((f) => (f.trainingModules || []).length >= 3).length;
        const trainingRate = allFarmers.length ? Math.round((farmersWithTraining / allFarmers.length) * 100) : 0;
        const mediaVerified = effectiveSyncRate >= 95 && profileComplete === allFarmers.length && allFarmers.length > 0;
        const incentives = performanceService.calculateIncentives({
            totalFarmers: allFarmers.length,
            trainingRate,
            syncRate: effectiveSyncRate,
            mediaVerified,
        });

        const onTrack = allFarmers.filter((f) => f.status === 'active').length;
        const atRisk = allFarmers.filter((f) => f.status === 'pending').length;
        const offTrack = allFarmers.filter((f) => f.status === 'inactive').length;
        const pendingSync = allFarmers.filter((f) => f.status === 'pending' || !(f.idCardFront && f.idCardBack) || !f.farmLocation?.lat).length;

        let matches = [];
        try {
            matches = await Match.find({ agent: agentId }).lean();
        } catch {
            matches = [];
        }
        const activeMatches = matches.filter((m) => m.status === 'Active' || m.approvalStatus === 'approved').length;
        const capitalTotal = matches.reduce((sum, m) => {
            const num = parseFloat(String(m.value || '0').replace(/[^0-9.]/g, ''));
            return sum + (Number.isFinite(num) ? num : 0);
        }, 0);

        const activeAlerts = allFarmers
            .filter((f) => f.status === 'pending' || f.status === 'inactive')
            .slice(0, 5)
            .map((f, i) => ({
                id: f._id?.toString() || i,
                type: f.status === 'pending' ? 'Verification' : 'Inactive',
                message: `${f.name} (${f.community || f.region}) requires follow-up`,
                color: f.status === 'pending' ? 'amber' : 'rose',
            }));

        let supervisor = null;
        let supervisorAgent = null;
        if (agent.supervisor) {
            supervisorAgent = await Agent.findById(agent.supervisor)
                .select('name contact email agentId region')
                .lean();
        }
        if (!supervisorAgent) {
            supervisorAgent = await Agent.findOne({
                role: 'supervisor',
                region: agent.region,
                status: { $ne: 'inactive' },
            }).select('name contact email agentId region').lean();
        }
        if (supervisorAgent) {
            const initials = supervisorAgent.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
            supervisor = {
                initials,
                name: supervisorAgent.name,
                contact: supervisorAgent.contact || '',
                email: supervisorAgent.email || '',
                agentId: supervisorAgent.agentId || '',
                region: supervisorAgent.region || '',
                rating: 0,
                comment: '',
                nextReview: 'Awaiting Schedule',
            };
        }

        res.json({
            success: true,
            range,
            agent: {
                name: agent.name,
                agentId: agent.agentId,
                region: agent.region,
                avatar: agent.avatar,
                title: agent.title,
                stats: agent.stats,
            },
            summary: {
                kpisOnTarget: kpis.filter((k) => k.status === 'On Track').length,
                totalKpis: kpis.length,
                totalFarmers: allFarmers.length,
                needsAttention: offTrack + atRisk,
            },
            overallScore,
            pendingSync,
            kpis,
            trend,
            metricTrends,
            visitLog,
            portfolio: { onTrack, atRisk, offTrack, total: allFarmers.length },
            trainingModules,
            compliance,
            verification,
            incentives,
            supervisor,
            seasonOutcomes: {
                yieldEst: '0.0',
                repaymentRate: activeMatches > 0 && allFarmers.length > 0
                    ? `${Math.round((activeMatches / allFarmers.length) * 100)}%`
                    : '0%',
                capitalDeployed: matches.length ? `GH¢${capitalTotal.toLocaleString()}` : 'GH¢0',
                partnerKpiMet: `${activeMatches}/${matches.length || 0}`,
            },
            activeAlerts,
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
