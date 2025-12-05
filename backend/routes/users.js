const express = require('express');
const UsersController = require('../controllers/UsersController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a new user
router.post('/users', authenticateToken, UsersController.create);

// Get all users
router.get('/users', authenticateToken, UsersController.getAll);

// Get a specific user by ID
router.get('/users/:id', authenticateToken, UsersController.getById);

// Update a user
router.put('/users/:id', authenticateToken, UsersController.update);

// Delete a user
router.delete('/users/:id', authenticateToken, UsersController.delete);

module.exports = router;