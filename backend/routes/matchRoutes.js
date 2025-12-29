const express = require('express');
const router = express.Router();
const { getMatches, updateMatch } = require('../controllers/matchController');
const auth = require('../middleware/auth');

router.get('/', auth, getMatches);
router.put('/:id', auth, updateMatch);

module.exports = router;
