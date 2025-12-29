const express = require('express');
const router = express.Router();
const { getDisputes, createDispute, updateDispute } = require('../controllers/disputeController');
const auth = require('../middleware/auth');

router.get('/', auth, getDisputes);
router.post('/', auth, createDispute);
router.put('/:id', auth, updateDispute);

module.exports = router;
