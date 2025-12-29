const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/', auth, getActivities);

module.exports = router;
