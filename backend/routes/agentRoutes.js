const express = require('express');
const router = express.Router();
const { getProfile, updateVerification, getStats, updateProfile } = require('../controllers/agentController');
const auth = require('../middleware/auth');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/verify', auth, updateVerification);
router.get('/stats', auth, getStats);

module.exports = router;
