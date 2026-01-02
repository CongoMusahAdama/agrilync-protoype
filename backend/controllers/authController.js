const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route   POST api/auth/login
// @desc    Authenticate agent & get token
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let agent = await Agent.findOne({ email });
        if (!agent) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // In a "Last Session Wins" model, we don't block the login.
        // Instead, we just update the sessionId which will effectively invalidate the old token
        // if we check it in the auth middleware.

        const isMatch = await agent.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Mark as logged in and generate session ID
        const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        agent.isLoggedIn = true;
        agent.currentSessionId = sessionId;

        await agent.save();

        const payload = {
            agent: {
                id: agent.id,
                sessionId: sessionId // Include sessionId in token payload for verification if needed
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    agent: {
                        id: agent.id,
                        name: agent.name,
                        email: agent.email,
                        agentId: agent.agentId,
                        hasChangedPassword: agent.hasChangedPassword,
                        isVerified: agent.isVerified,
                        verificationStatus: agent.verificationStatus,
                        region: agent.region,
                        avatar: agent.avatar
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/auth/change-password
// @desc    Change password after first login
exports.changePassword = async (req, res) => {
    const { newPassword } = req.body;

    try {
        let agent = await Agent.findById(req.agent.id);
        if (!agent) return res.status(404).json({ msg: 'Agent not found' });

        agent.password = newPassword;
        agent.hasChangedPassword = true;
        await agent.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/auth/logout
// @desc    Clear agent session status
exports.logout = async (req, res) => {
    try {
        let agent = await Agent.findById(req.agent.id);
        if (!agent) return res.status(404).json({ msg: 'Agent not found' });

        agent.isLoggedIn = false;
        agent.currentSessionId = null;
        await agent.save();

        res.json({ msg: 'Logged out successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
