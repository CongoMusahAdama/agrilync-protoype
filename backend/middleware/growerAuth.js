const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

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

/** Lync Grower JWT — accountType: grower, farmer.id in payload */
const growerAuth = async (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.accountType !== 'grower' || !decoded.farmer?.id) {
            return res.status(401).json({ msg: 'Grower authorization required' });
        }

        const farmer = await Farmer.findById(decoded.farmer.id).select('-password').lean();
        if (!farmer) {
            return res.status(401).json({ msg: 'Grower account not found' });
        }
        if (farmer.status === 'inactive') {
            return res.status(403).json({
                msg: 'This account is inactive. Please contact your AgriLync field agent.',
            });
        }

        req.grower = farmer;
        req.farmerId = String(farmer._id);
        next();
    } catch (err) {
        console.error('[GROWER_AUTH]', err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = growerAuth;
