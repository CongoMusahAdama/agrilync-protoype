const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    registerForWebinar,
    getRegistrants,
    getSmsReadyRegistrants,
} = require('../controllers/webinarController');

const isSuperAdmin = (req, res, next) => {
    if (req.agent?.role !== 'super_admin') {
        return res.status(403).json({ msg: 'Super Admin access required.' });
    }
    next();
};

router.post('/register', registerForWebinar);
router.get('/registrants', auth, isSuperAdmin, getRegistrants);
router.get('/registrants/sms-ready', auth, isSuperAdmin, getSmsReadyRegistrants);

module.exports = router;
