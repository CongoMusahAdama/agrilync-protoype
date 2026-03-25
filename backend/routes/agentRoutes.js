const express = require('express');
const router = express.Router();
const { getProfile, updateVerification, getStats, updateProfile, getPerformance, updateSettings, updatePassword } = require('../controllers/agentController');
const auth = require('../middleware/auth');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/settings', auth, updateSettings);
router.put('/password', auth, updatePassword);
router.put('/verify', auth, updateVerification);
router.get('/stats', auth, getStats);
router.get('/performance', auth, getPerformance);

module.exports = router;
