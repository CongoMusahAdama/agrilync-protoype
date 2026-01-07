const jwt = require('jsonwebtoken');

/**
 * Check if request is from localhost
 * Allows development without authentication while still fetching from database
 */
const isLocalhost = (req) => {
    const hostname = req.hostname || req.get('host')?.split(':')[0];
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
};

const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    const isDev = isLocalhost(req);

    // On localhost, allow access without token for development (still fetches from DB)
    if (isDev && !token) {
        // Try to get first available agent for localhost development
        try {
            const Agent = require('../models/Agent');
            const agent = await Agent.findOne({ status: 'active' }).select('-password');
            if (agent) {
                req.agent = agent;
                console.log('[AUTH] Localhost: Using first active agent for development');
                return next();
            }
        } catch (err) {
            console.error('[AUTH] Localhost: Error fetching agent:', err.message);
            // Continue to normal auth flow if agent fetch fails
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch agent and attach to request
        const Agent = require('../models/Agent');
        const agent = await Agent.findById(decoded.agent.id).select('-password');

        if (!agent) {
            return res.status(401).json({ msg: 'Agent not found' });
        }

        // Verify session ID to enforce single device login
        // Only enforce if both exist
        if (agent.currentSessionId && decoded.agent.sessionId && agent.currentSessionId !== decoded.agent.sessionId) {
            return res.status(401).json({ msg: 'Session active on another device' });
        }

        // If DB has a session but token has NONE, it's an old token. Force logout.
        if (agent.currentSessionId && !decoded.agent.sessionId) {
            return res.status(401).json({ msg: 'Session expired (version update)' });
        }

        // Attach full agent object. Mongoose objects have .id getter for ._id
        req.agent = agent;
        next();
    } catch (err) {
        console.error('[AUTH] Token verification error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
