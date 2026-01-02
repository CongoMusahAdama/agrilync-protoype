const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.agent = decoded.agent;

        // Verify session ID to enforce single device login
        const Agent = require('../models/Agent');
        const agent = await Agent.findById(req.agent.id);

        if (!agent || !agent.isLoggedIn || agent.currentSessionId !== req.agent.sessionId) {
            return res.status(401).json({ msg: 'Session expired or logged in on another device' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
