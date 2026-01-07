const express = require('express');
const router = express.Router();
const { getSummary, refreshSummary } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Test endpoint to verify route is registered (no auth required)
router.get('/test', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Dashboard routes are working',
        timestamp: new Date().toISOString()
    });
});

router.get('/summary', auth, getSummary);
router.post('/refresh', auth, refreshSummary);

module.exports = router;
