const Agent = require('../models/Agent');
const crypto = require('crypto');
const AuditLog = require('../models/AuditLog');
const { generateTokens, setTokenCookies, clearTokenCookies } = require('../services/tokenService');
const { allowsConcurrentSessions } = require('../utils/sessionPolicy');

// @route   POST api/auth/login
// @desc    Authenticate agent & get token
exports.login = async (req, res) => {
    const { email, password, region } = req.body;

    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        console.error('[AUTH] Login blocked: JWT_SECRET or REFRESH_TOKEN_SECRET is not configured');
        return res.status(500).json({
            msg: 'Server auth is not configured. Set JWT_SECRET and REFRESH_TOKEN_SECRET on the backend host.',
        });
    }

    try {
        let agent = await Agent.findOne({ 
            $or: [{ email: email }, { contact: email }] 
        });
        if (!agent) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await agent.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check if MFA is enabled
        if (agent.mfaEnabled) {
            return res.json({
                mfaRequired: true,
                email: agent.email,
                msg: 'MFA required to complete login'
            });
        }

        const multiSession = allowsConcurrentSessions(agent);

        // Admins / explicitly flagged accounts may sign in on multiple devices
        if (agent.isLoggedIn && !multiSession) {
            return res.status(403).json({ msg: 'Account is already logged in on another device. Please contact an Administrator to reset your session.' });
        }

        if (agent.role === 'super_admin' && !agent.enableMultipleLogin) {
            agent.enableMultipleLogin = true;
        }

        const sessionId = crypto.randomBytes(32).toString('hex');
        agent.isLoggedIn = true;
        // Single-session accounts: new login invalidates other devices
        if (!multiSession) {
            agent.currentSessionId = sessionId;
        }

        if (region) {
            agent.region = region;
        }

        // Generate tokens
        const payload = {
            agent: { id: agent.id, sessionId: sessionId }
        };
        const { accessToken, refreshToken } = generateTokens(payload);

        // Store refresh token and save once
        agent.refreshToken = refreshToken;
        await agent.save();

        AuditLog.create({
            action: 'LOGIN',
            user: agent.id,
            userRole: agent.role,
            details: `Agent ${agent.name} logged in`,
            ipAddress: req.ip || 'unknown'
        }).catch((err) => console.error('Login audit log failed:', err.message));

        // Set cookies and respond
        setTokenCookies(res, accessToken, refreshToken);

        // Send Login Security SMS
        if (agent.contact) {
            const smsService = require('../utils/smsService');
            const timeStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const message = `Security Alert: Your AgriLync account was successfully logged into on ${timeStr}. If this wasn't you, please contact an Administrator immediately.`;
            smsService.sendSMS(agent.contact, message).catch(err => console.error('Login SMS failed:', err.message));
        }

        res.json({
            token: accessToken,
            refreshToken,
            agent: {
                id: agent.id,
                name: agent.name,
                email: agent.email,
                agentId: agent.agentId,
                hasChangedPassword: agent.hasChangedPassword,
                isVerified: agent.isVerified,
                verificationStatus: agent.verificationStatus,
                region: agent.region,
                avatar: agent.avatar,
                role: agent.role,
                status: agent.status
            }
        });
    } catch (err) {
        console.error(err.message);
        if (err.message?.includes('JWT_SECRET') || err.message?.includes('REFRESH_TOKEN_SECRET')) {
            return res.status(500).json({ msg: 'Server auth is not configured. Contact your administrator.' });
        }
        res.status(500).json({ msg: 'Server error. Please try again.' });
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
        if (agent) {
            agent.isLoggedIn = false;
            agent.currentSessionId = null;
            agent.refreshToken = null;
            await agent.save();

            await AuditLog.create({
                action: 'LOGOUT',
                user: agent.id,
                userRole: agent.role,
                details: `Agent ${agent.name} logged out`,
                ipAddress: req.ip || 'unknown'
            });
        }

        clearTokenCookies(res);
        res.json({ msg: 'Logged out successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/auth/refresh
// @desc    Refresh access token
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ msg: 'No refresh token provided' });
    }

    try {
        const jwt = require('jsonwebtoken');
        if (!process.env.REFRESH_TOKEN_SECRET) {
            return res.status(500).json({ msg: 'Server configuration error' });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const agent = await Agent.findById(decoded.id);

        if (!agent || agent.refreshToken !== refreshToken) {
            return res.status(401).json({ msg: 'Invalid refresh token' });
        }

        const payload = {
            agent: { id: agent.id, sessionId: agent.currentSessionId }
        };
        const { accessToken } = generateTokens(payload);

        setTokenCookies(res, accessToken, null); // Only update access token cookie
        res.json({ token: accessToken });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
