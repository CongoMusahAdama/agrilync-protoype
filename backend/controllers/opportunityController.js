const Opportunity = require('../models/Opportunity');

// @route   GET api/opportunities
// @desc    Get all open investment opportunities
exports.getOpportunities = async (req, res) => {
    try {
        // Build query - optionally filter by agent's region if needed, 
        // but for now show all open opportunities or those targeting agent's region
        const agentRegion = req.agent.region;

        const query = {
            status: 'Open',
            $or: [
                { targetRegions: { $size: 0 } }, // Targets all/any
                { targetRegions: agentRegion }   // Targets specific agent region
            ]
        };

        const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
