const Agent = require('../models/Agent');

// @route   GET api/agents/profile
// @desc    Get current agent profile
exports.getProfile = async (req, res) => {
    try {
        const agent = await Agent.findById(req.agent.id).select('-password');
        res.json(agent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/agents/profile
// @desc    Update agent profile
exports.updateProfile = async (req, res) => {
    const { name, contact, region, district, bio, avatar } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (contact) profileFields.contact = contact;
    if (region) profileFields.region = region;
    if (district) profileFields.district = district;
    if (bio) profileFields.bio = bio;
    if (avatar) profileFields.avatar = avatar;

    try {
        let agent = await Agent.findById(req.agent.id);

        if (!agent) return res.status(404).json({ msg: 'Agent not found' });

        agent = await Agent.findByIdAndUpdate(
            req.agent.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(agent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/agents/verify
// @desc    Update verification status
exports.updateVerification = async (req, res) => {
    const { status } = req.body;

    try {
        let agent = await Agent.findById(req.agent.id);
        if (!agent) return res.status(404).json({ msg: 'Agent not found' });

        agent.verificationStatus = status;
        if (status === 'verified') agent.isVerified = true;

        await agent.save();
        res.json(agent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/agents/stats
// @desc    Get dashboard stats
exports.getStats = async (req, res) => {
    try {
        const agent = await Agent.findById(req.agent.id).select('stats');
        res.json(agent.stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
