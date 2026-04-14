const jwt = require('jsonwebtoken');

/**
 * Generate Access and Refresh Tokens
 * @param {Object} payload 
 * @returns {Object} { accessToken, refreshToken }
 */
const generateTokens = (payload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { id: payload.agent.id },
        process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_fallback_123',
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

/**
 * Set Secure Cookies for Tokens
 * @param {Object} res 
 * @param {string} accessToken 
 * @param {string} refreshToken 
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    const accessCookieOptions = {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000 // 1 hour
    };

    if (accessToken) res.cookie('accessToken', accessToken, accessCookieOptions);
    if (refreshToken) res.cookie('refreshToken', refreshToken, cookieOptions);
};

/**
 * Clear Auth Cookies
 * @param {Object} res 
 */
const clearTokenCookies = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};

module.exports = {
    generateTokens,
    setTokenCookies,
    clearTokenCookies
};
