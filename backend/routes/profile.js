const express = require('express');
const ProfileController = require('../controllers/ProfileController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Update user profile
router.put('/', authenticateToken, ProfileController.update);

module.exports = router;