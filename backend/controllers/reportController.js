const Report = require('../models/Report');

// @route   POST api/reports
// @desc    Create a new report
exports.createReport = async (req, res) => {
    const { farmerId, type, date, notes, media } = req.body;

    try {
        const newReport = new Report({
            farmer: farmerId,
            agent: req.agent.id,
            type,
            date,
            notes,
            media
        });

        const report = await newReport.save();
        res.json({ success: true, data: report });
    } catch (err) {
        console.error('createReport error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
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

// @route   GET api/reports
// @desc    Get reports created by the current agent (with pagination)
exports.getAgentReports = async (req, res) => {
    try {
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
