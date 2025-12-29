const Activity = require('../models/Activity');

// @route   GET api/activities
// @desc    Get recent activities for agent
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ agent: req.agent.id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
