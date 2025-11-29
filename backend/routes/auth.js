const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

// Register routes (split into two steps: OTP request and OTP verification)
router.post('/register', AuthController.requestOTP);
router.post('/verify-otp', AuthController.verifyOTPAndRegister);

// Login route
router.post('/login', AuthController.login);

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

// Reset password route
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;