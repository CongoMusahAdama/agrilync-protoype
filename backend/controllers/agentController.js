const Agent = require('../models/Agent');

// @route   GET api/agents/profile
// @desc    Get current agent profile
exports.getProfile = async (req, res) => {
    try {
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

        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

        agent = await Agent.findByIdAndUpdate(
            req.agent.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json({ success: true, data: agent });
    } catch (err) {
        console.error('updateProfile error:', err.message);
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
