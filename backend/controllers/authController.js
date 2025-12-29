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

        const isMatch = await agent.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            agent: {
                id: agent.id
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
                        verificationStatus: agent.verificationStatus
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
