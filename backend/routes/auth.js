const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

// Register route
router.post('/register', AuthController.register);

// Login route
router.post('/login', AuthController.login);

// Forgot password route
router.post('/forgot-password', AuthController.forgotPassword);

// Reset password route
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;