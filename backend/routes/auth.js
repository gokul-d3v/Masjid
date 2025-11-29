const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

// Login route
router.post('/login', AuthController.login);

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

// Reset password route
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;