const express = require('express');
const router = express.Router();
const growerAuth = require('../middleware/growerAuth');
const {
    getMe,
    updateMe,
    getMyIdCard,
    getDashboard,
    getMyFarms,
    getFarmProfile,
    updateFarmProfile,
    confirmActivity,
} = require('../controllers/growerController');

router.get('/me/id-card', growerAuth, getMyIdCard);
router.get('/me', growerAuth, getMe);
router.put('/me', growerAuth, updateMe);
router.get('/farm-profile', growerAuth, getFarmProfile);
router.post('/activities/confirm', growerAuth, confirmActivity);
router.patch('/me/farm-profile', growerAuth, updateFarmProfile);
router.get('/dashboard', growerAuth, getDashboard);
router.get('/farms', growerAuth, getMyFarms);

module.exports = router;
