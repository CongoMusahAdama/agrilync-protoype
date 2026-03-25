const express = require('express');
const router = express.Router();
const { getFarmers, getFarmerById, addFarmer, updateFarmer, getPendingFarmersByRegion, registerFarmerPublic, getFlaggedFarmers, resolveFlag } = require('../controllers/farmerController');
const auth = require('../middleware/auth');

router.get('/', auth, getFarmers);
router.get('/queue/pending', auth, getPendingFarmersByRegion);
router.get('/flagged', auth, getFlaggedFarmers);
router.post('/', auth, addFarmer);
router.post('/public/register', registerFarmerPublic);
router.get('/:id', auth, getFarmerById);
router.put('/:id', auth, updateFarmer);
router.put('/:id/resolve-flag', auth, resolveFlag);

module.exports = router;
