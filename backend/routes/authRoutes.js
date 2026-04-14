const express = require('express');
const router = express.Router();
const { login, changePassword, logout, refreshToken } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { loginRules, changePasswordRules, validate } = require('../middleware/validator');

const { setupMFA, verifyMFA, loginVerifyMFA } = require('../controllers/mfaController');

// @route   POST api/auth/login
router.post('/login', loginRules, validate, login);

// @route   POST api/auth/logout
router.post('/logout', auth, logout);

// @route   POST api/auth/change-password
router.post('/change-password', auth, changePasswordRules, validate, changePassword);

// @route   POST api/auth/refresh
router.post('/refresh', refreshToken);

// MFA Routes
router.post('/mfa/setup', auth, setupMFA);
router.post('/mfa/verify', auth, verifyMFA);
router.post('/mfa/login-verify', loginVerifyMFA);

module.exports = router;
