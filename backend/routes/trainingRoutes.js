const express = require('express');
const router = express.Router();
const { getAvailableTrainings, getMyTrainings, registerTraining, updateTrainingStatus } = require('../controllers/trainingController');
const auth = require('../middleware/auth');

router.get('/', auth, getAvailableTrainings);
router.get('/my', auth, getMyTrainings);
router.post('/register/:id', auth, registerTraining);
router.put('/status/:id', auth, updateTrainingStatus);

module.exports = router;
