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

        // DIAGNOSTIC LOGS
        if (!agent) {
            console.log(`[AUTH] Agent not found in DB: ${req.agent.id}`);
        } else if (!agent.isLoggedIn) {
            console.log(`[AUTH] Agent ${agent.email} isLoggedIn is FALSE in DB`);
        } else if (agent.currentSessionId !== req.agent.sessionId) {
            console.log(`[AUTH] Session Mismatch for ${agent.email}: DB=${agent.currentSessionId}, Token=${req.agent.sessionId}`);
        }

        if (!agent || !agent.isLoggedIn || agent.currentSessionId !== req.agent.sessionId) {
            return res.status(401).json({ msg: 'Session expired or logged in on another device' });
        }

        next();
    } catch (err) {
        console.error('[AUTH] Token verification error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
