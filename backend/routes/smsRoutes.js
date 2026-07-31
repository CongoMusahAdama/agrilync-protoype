const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getRecipients,
    getGroupCounts,
    getCampaigns,
    sendBulkCampaign,
} = require('../controllers/smsController');

const isSuperAdmin = (req, res, next) => {
    if (req.agent?.role !== 'super_admin') {
        return res.status(403).json({ msg: 'Super Admin access required.' });
    }
    next();
};

router.use(auth);
router.use(isSuperAdmin);

router.get('/recipients', getRecipients);
router.get('/group-counts', getGroupCounts);
router.get('/campaigns', getCampaigns);
router.post('/bulk', sendBulkCampaign);

module.exports = router;
