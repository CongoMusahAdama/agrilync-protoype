const express = require('express');
const router = express.Router();
const {
    getScheduledVisits,
    createScheduledVisit,
    updateScheduledVisit,
    cancelScheduledVisit,
    sendSMSNotification,
    logPhoneCall
} = require('../controllers/scheduledVisitController');
const auth = require('../middleware/auth');

router.get('/', auth, getScheduledVisits);
router.post('/', auth, createScheduledVisit);
router.put('/:id', auth, updateScheduledVisit);
router.delete('/:id', auth, cancelScheduledVisit);
router.post('/:id/send-sms', auth, sendSMSNotification);
router.post('/:id/phone-call', auth, logPhoneCall);

module.exports = router;
