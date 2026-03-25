const express = require('express');
const router = express.Router();
const { getConsultations, handleConsultationAction } = require('../controllers/consultationController');
const auth = require('../middleware/auth');

router.get('/', auth, getConsultations);
router.post('/:id/:action', auth, handleConsultationAction);

module.exports = router;
