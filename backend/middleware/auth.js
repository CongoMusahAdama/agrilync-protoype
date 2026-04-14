const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');

/**
 * Helper to race DB queries against a timeout
 */
const dbTimeout = (promise, ms = 3000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('AUTH_DB_TIMEOUT')), ms))
]);

/**
 * Token Based Authentication Middleware
 * Supports Cookies (preferred), x-auth-token, and Bearer tokens
 */
const auth = async (req, res, next) => {
    // 1. Check cookies first (preferred for cookie-based auth)
    let token = req.cookies ? req.cookies.accessToken : null;

    // 2. Fallback to headers for API/Mobile compatibility
    if (!token) {
        token = req.header('x-auth-token');
    }

    // 3. Fallback to Authorization: Bearer token
    if (!token) {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch agent with timeout to prevent hanging on DB latency
        const agent = await dbTimeout(Agent.findById(decoded.agent.id).select('-password'));

        if (!agent) {
            return res.status(401).json({ msg: 'Agent not found' });
        }

        // Verify session ID to enforce single device login (if sessionId exists in token)
        if (agent.currentSessionId && decoded.agent.sessionId && agent.currentSessionId !== decoded.agent.sessionId) {
            return res.status(401).json({ msg: 'Session active on another device' });
        }

        // Attachment of agent to request
        req.agent = agent;
        next();
    } catch (err) {
        if (err.message === 'AUTH_DB_TIMEOUT') {
            return res.status(503).json({ msg: 'Identity service busy, please try again' });
        }
        
        console.error('[AUTH] Token verification error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
