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
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/reports/farmer/:farmerId
// @desc    Get all reports for a specific farmer
exports.getFarmerReports = async (req, res) => {
    try {
        const reports = await Report.find({ farmer: req.params.farmerId }).sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/reports
// @desc    Get all reports created by the current agent
exports.getAgentReports = async (req, res) => {
    try {
        const reports = await Report.find({ agent: req.agent.id })
            .populate('farmer', 'name')
            .sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
