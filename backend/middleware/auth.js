const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const { allowsConcurrentSessions } = require('../utils/sessionPolicy');

const AUTH_DB_TIMEOUT_MS = 12000;

/**
 * Helper to race DB queries against a timeout (Render + Atlas can be slow on cold start)
 */
const dbTimeout = (promise, ms = AUTH_DB_TIMEOUT_MS) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('AUTH_DB_TIMEOUT')), ms))
]);

const extractToken = (req) => {
    let token = req.cookies ? req.cookies.accessToken : null;
    if (!token) token = req.header('x-auth-token');
    if (!token) {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    return token;
};

/**
 * Token Based Authentication Middleware
 * Supports Cookies (preferred), x-auth-token, and Bearer tokens
 */
/**
 * JWT-only auth — no DB round-trip (used for first-time password change on slow mobile networks)
 */
const verifyToken = (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.agent = { id: decoded.agent.id, _id: decoded.agent.id };
        next();
    } catch (err) {
        console.error('[AUTH] Token verification error:', err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

const auth = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const loadAgent = () =>
            dbTimeout(Agent.findById(decoded.agent.id).select('-password').lean());

        let agent;
        try {
            agent = await loadAgent();
        } catch (firstErr) {
            if (firstErr.message === 'AUTH_DB_TIMEOUT') {
                agent = await loadAgent();
            } else {
                throw firstErr;
            }
        }

        if (!agent) {
            return res.status(401).json({ msg: 'Agent not found' });
        }

        // Single-session accounts only: reject tokens from a superseded login
        if (
            !allowsConcurrentSessions(agent) &&
            agent.currentSessionId &&
            decoded.agent.sessionId &&
            agent.currentSessionId !== decoded.agent.sessionId
        ) {
            return res.status(401).json({ msg: 'Session active on another device' });
        }

        // Lean documents use _id; normalize so controllers can use req.agent.id
        if (agent && !agent.id && agent._id) {
            agent.id = agent._id;
        }
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
module.exports.verifyToken = verifyToken;
