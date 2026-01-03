const express = require('express');
const router = express.Router();
const { getSummary, refreshSummary } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/summary', auth, getSummary);
router.post('/refresh', auth, refreshSummary);

module.exports = router;
