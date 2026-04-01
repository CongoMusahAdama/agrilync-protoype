const express = require('express');
const router = express.Router();
const {
    getDeliveries,
    createDelivery,
    getDelivery,
    updateDelivery,
    deleteDelivery,
    sendSMSNotification
} = require('../controllers/trainingDeliveryController');
const auth = require('../middleware/auth');

router.use(auth);

router.route('/')
    .get(getDeliveries)
    .post(createDelivery);

router.route('/:id')
    .get(getDelivery)
    .patch(updateDelivery)
    .delete(deleteDelivery);

router.post('/:id/send-sms', sendSMSNotification);

module.exports = router;
