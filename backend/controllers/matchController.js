const Match = require('../models/Match');
const Activity = require('../models/Activity');

// @route   GET api/matches
// @desc    Get all matches for current agent
exports.getMatches = async (req, res) => {
    try {
        const matches = await Match.find({ agent: req.agent.id })
            .populate('farmer', 'name region district community landSize productionStage verified')
            .sort({ createdAt: -1 });
        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/matches
// @desc    Create a new match (Apply for opportunity)
exports.createMatch = async (req, res) => {
    const { farmerId, investor, farmType, value, investmentType, category } = req.body;

    try {
        // Verify farmer belongs to agent (Enforces Regional Operational Area)
        const farmer = await require('../models/Farmer').findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ msg: 'Farmer not found' });
        }

        if (farmer.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized: Farmer is outside your operational jurisdiction' });
        }

        // Generate simple ID
        const count = await Match.countDocuments();
        const id = `M-${100 + count + 1}`;

        const newMatch = new Match({
            id,
            investor,
            farmer: farmerId,
            farmType: farmType || farmer.farmType || 'Crop',
            value,
            investmentType,
            category: category || 'General',
            matchDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'Pending Approval',
            approvalStatus: 'pending',
            progress: 0,
            timeline: [{
                action: 'Match Created',
                date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                type: 'match'
            }],
            agent: req.agent.id
        });

        const match = await newMatch.save();

        // Populate farmer details for frontend
        await match.populate('farmer', 'name region district community');

        // Log Activity
        await Activity.create({
            agent: req.agent.id,
            type: 'info',
            title: 'New Investment Match',
            description: `Matched farmer to ${investor} (${category})`
        });

        res.json(match);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/matches/:id
// @desc    Update match status or approval
exports.updateMatch = async (req, res) => {
    const { status, approvalStatus, notes, documents } = req.body;

    try {
        let match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ msg: 'Match not found' });

        if (match.agent.toString() !== req.agent.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (status) match.status = status;
        if (approvalStatus) match.approvalStatus = approvalStatus;
        if (notes) match.notes = notes;
        if (documents) {
            match.documents = { ...match.documents, ...documents };
        }

        await match.save();
        res.json(match);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
