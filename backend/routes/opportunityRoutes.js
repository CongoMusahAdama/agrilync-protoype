const express = require('express');
const router = express.Router();
const { getOpportunities } = require('../controllers/opportunityController');
const auth = require('../middleware/auth');

router.get('/', auth, getOpportunities);

module.exports = router;
