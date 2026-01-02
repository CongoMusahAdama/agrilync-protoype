const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.post('/', auth, reportController.createReport);
router.get('/farmer/:farmerId', auth, reportController.getFarmerReports);
router.get('/agent', auth, reportController.getAgentReports);
router.get('/', auth, reportController.getAgentReports);

module.exports = router;
