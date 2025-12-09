const express = require('express');
const UsersController = require('../controllers/UsersController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a new user
router.post('/', authenticateToken, UsersController.create);

// Get all users
router.get('/', authenticateToken, UsersController.getAll);

// Get a specific user by ID
router.get('/:id', authenticateToken, UsersController.getById);

// Update a user
router.put('/:id', authenticateToken, UsersController.update);

// Delete a user
router.delete('/:id', authenticateToken, UsersController.delete);

module.exports = router;