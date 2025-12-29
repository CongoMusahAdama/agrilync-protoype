const express = require('express');
const router = express.Router();
const { login, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/login
router.post('/login', login);

// @route   POST api/auth/change-password
router.post('/change-password', auth, changePassword);

module.exports = router;
