const Report = require('../models/Report');
const Farmer = require('../models/Farmer');
const {
    notifyAgentSupervisorIfAny,
    notifySuperAdmins,
    staffSms,
    truncateSms,
} = require('../utils/staffNotifications');

// @route   POST api/reports
// @desc    Create a new report
exports.createReport = async (req, res) => {
    const { farmerId, type, date, notes, media, cropStage, healthScore } = req.body;

    try {
        const newReport = new Report({
            farmer: farmerId,
            agent: req.agent.id,
            type,
            date: date || new Date().toISOString().split('T')[0],
            notes,
            media,
            cropStage,
            healthScore
        });

        const report = await newReport.save();
        const farmer = farmerId ? await Farmer.findById(farmerId).select('name').lean() : null;
        const agentName = req.agent?.name || 'Field Agent';
        const farmerName = farmer?.name || 'grower';
        const reportMessage = `${agentName} submitted a ${type || 'field'} report for ${farmerName}.`;

        await notifyAgentSupervisorIfAny(req.agent.id, {
            title: 'Field Report Submitted',
            message: reportMessage,
            smsBody: staffSms(`${reportMessage} Notes: ${truncateSms(notes, 60) || 'None'}.`),
            type: 'report',
            priority: 'low',
            senderName: agentName,
        });

        if (healthScore != null && Number(healthScore) < 50) {
            await notifySuperAdmins({
                title: 'Low Farm Health Score',
                message: `${reportMessage} Health score: ${healthScore}.`,
                smsBody: staffSms(`${reportMessage} Health score: ${healthScore}. Review recommended.`),
                type: 'report',
                priority: 'high',
                senderName: agentName,
            });
        }

        res.json({ success: true, data: report });
    } catch (err) {
        console.error('createReport error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: err.message,
            details: err.errors // Mongoose validation errors
        });
    }
};

// @route   GET api/reports/farmer/:farmerId
// @desc    Get reports for a specific farmer (with pagination)
exports.getFarmerReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [reports, total] = await Promise.all([
            Report.find({ farmer: req.params.farmerId })
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Report.countDocuments({ farmer: req.params.farmerId })
        ]);

        res.json({
            success: true,
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            data: reports
        });
    } catch (err) {
        console.error('getFarmerReports error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET api/reports/agent  (also GET api/reports)
// @desc    Get reports created by the current agent (with pagination)
exports.getAgentReports = async (req, res) => {
    try {
        // Guard: mock users have non-ObjectId IDs — skip DB query
        if (req.agent.isMock) {
            return res.json({ success: true, page: 1, limit: 20, total: 0, pages: 0, data: [] });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [reports, total] = await Promise.all([
            Report.find({ agent: req.agent.id })
                .populate('farmer', 'name')
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Report.countDocuments({ agent: req.agent.id })
        ]);

        res.json({
            success: true,
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            data: reports
        });
    } catch (err) {
        console.error('getAgentReports error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
