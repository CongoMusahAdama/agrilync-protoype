const express = require('express');
const router = express.Router();
const { getFarms, addFarm, updateFarm } = require('../controllers/farmController');
const auth = require('../middleware/auth');

router.get('/', auth, getFarms);
router.post('/', auth, addFarm);
router.put('/:id', auth, updateFarm);

module.exports = router;
