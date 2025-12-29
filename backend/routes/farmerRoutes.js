const express = require('express');
const router = express.Router();
const { getFarmers, addFarmer, updateFarmer, getPendingFarmersByRegion, registerFarmerPublic } = require('../controllers/farmerController');
const auth = require('../middleware/auth');

router.get('/', auth, getFarmers);
router.get('/queue/pending', auth, getPendingFarmersByRegion);
router.post('/', auth, addFarmer);
router.post('/public/register', registerFarmerPublic);
router.put('/:id', auth, updateFarmer);

module.exports = router;
