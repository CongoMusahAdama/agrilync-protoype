/**
 * requireRole middleware
 *
 * Usage: requireRole(['super_admin', 'supervisor'])
 *
 * Must be used AFTER the `auth` middleware (which sets req.agent).
 */

module.exports = function requireRole(roles = []) {
    return (req, res, next) => {
        if (!req.agent) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        if (!roles.includes(req.agent.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};
