const Match = require('../models/Match');

// @route   GET api/matches
// @desc    Get all matches for current agent
exports.getMatches = async (req, res) => {
    try {
        const matches = await Match.find({ agent: req.agent.id }).populate('farmer', 'name');
        res.json(matches);
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
