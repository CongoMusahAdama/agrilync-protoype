const express = require('express');
const router = express.Router();
const {
    getMatches,
    updateMatch,
    createMatch,
    approveMatch,
    rejectMatch,
} = require('../controllers/matchController');
const auth = require('../middleware/auth');

router.get('/', auth, getMatches);
router.post('/', auth, createMatch);
router.post('/:id/approve', auth, approveMatch);
router.post('/:id/reject', auth, rejectMatch);
router.put('/:id', auth, updateMatch);

module.exports = router;
