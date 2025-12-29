const express = require('express');
const router = express.Router();
const { getFieldVisits, logFieldVisit, deleteFieldVisit, updateFieldVisit } = require('../controllers/fieldVisitController');
const auth = require('../middleware/auth');

router.get('/', auth, getFieldVisits);
router.post('/', auth, logFieldVisit);
router.put('/:id', auth, updateFieldVisit);
router.delete('/:id', auth, deleteFieldVisit);

module.exports = router;
