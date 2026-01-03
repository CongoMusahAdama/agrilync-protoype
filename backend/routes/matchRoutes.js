const express = require('express');
const router = express.Router();
const { getMatches, updateMatch, createMatch } = require('../controllers/matchController');
const auth = require('../middleware/auth');

router.get('/', auth, getMatches);
router.post('/', auth, createMatch);
router.put('/:id', auth, updateMatch);

module.exports = router;
