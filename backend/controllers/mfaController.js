const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const Agent = require('../models/Agent');
const crypto = require('crypto');
const AuditLog = require('../models/AuditLog');
const { generateTokens, setTokenCookies } = require('../services/tokenService');

// @desc    Generate MFA QR Code
// @route   POST /api/auth/mfa/setup
// @access  Private
exports.setupMFA = async (req, res) => {
    try {
        const agent = await Agent.findById(req.agent.id);
        
        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `AgriLync:${agent.email}`
        });

        // Save secret temporarily (not enabled yet)
        agent.mfaSecret = secret.base32;
        await agent.save();

        // Generate QR code URL
        const dataUrl = await qrcode.toDataURL(secret.otpauth_url);

        res.json({
            qrCode: dataUrl,
            secret: secret.base32
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Verify and Enable MFA
// @route   POST /api/auth/mfa/verify
// @access  Private
exports.verifyMFA = async (req, res) => {
    const { token } = req.body;

    try {
        const agent = await Agent.findById(req.agent.id);
        
        const verified = speakeasy.totp.verify({
            secret: agent.mfaSecret,
            encoding: 'base32',
            token
        });

        if (verified) {
            agent.mfaEnabled = true;
            await agent.save();
            res.json({ msg: 'MFA enabled successfully' });
        } else {
            res.status(400).json({ msg: 'Invalid verification token' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Verify MFA Token during Login & Issue Tokens
// @route   POST /api/auth/mfa/login-verify
// @access  Public
exports.loginVerifyMFA = async (req, res) => {
    const { email, token } = req.body;

    try {
        const agent = await Agent.findOne({ email });
        if (!agent || !agent.mfaEnabled) {
            return res.status(400).json({ msg: 'MFA not active' });
        }

        const verified = speakeasy.totp.verify({
            secret: agent.mfaSecret,
            encoding: 'base32',
            token
        });

        if (verified) {
            // Generate secure session ID
            const sessionId = crypto.randomBytes(32).toString('hex');
            agent.isLoggedIn = true;
            agent.currentSessionId = sessionId;

            // Generate tokens
            const payload = {
                agent: { id: agent.id, sessionId: sessionId }
            };
            const { accessToken, refreshToken } = generateTokens(payload);

            // Store refresh token and save
            agent.refreshToken = refreshToken;
            await agent.save();

            // Audit
            await AuditLog.create({
                action: 'MFA_VERIFY',
                user: agent.id,
                userRole: agent.role,
                details: `Agent ${agent.name} completed MFA login`,
                ipAddress: req.ip || 'unknown'
            });

            // Set cookies
            setTokenCookies(res, accessToken, refreshToken);

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
        } else {
            res.status(400).json({ msg: 'Invalid token' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
