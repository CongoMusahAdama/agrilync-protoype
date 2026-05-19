const jwt = require('jsonwebtoken');
const BlogAdmin = require('../models/BlogAdmin');

const blogAuth = async (req, res, next) => {
    let token = req.cookies ? req.cookies.blogToken : null;

    if (!token) {
        token = req.header('x-auth-token');
    }

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
        if (!process.env.JWT_SECRET) {
            console.error('[BLOG-AUTH] FATAL ERROR: JWT_SECRET is not defined in environment variables.');
            return res.status(500).json({ msg: 'Server configuration error' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await BlogAdmin.findById(decoded.admin.id).select('-password');

        if (!admin) {
            return res.status(401).json({ msg: 'Admin credentials not found' });
        }

        req.admin = admin;
        next();
    } catch (err) {
        console.error('[BLOG-AUTH] Error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = blogAuth;
