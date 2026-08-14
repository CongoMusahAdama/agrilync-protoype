const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const {
    submitInquiry,
    getInquiries,
    updateInquiryStatus,
} = require('../controllers/partnershipController');

router.post('/submit', submitInquiry);
router.get('/', auth, requireRole(['super_admin']), getInquiries);
router.patch('/:id/status', auth, requireRole(['super_admin']), updateInquiryStatus);

module.exports = router;
