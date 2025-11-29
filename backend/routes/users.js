const express = require('express');
const User = require('../models/User');
const Member = require('../models/Member'); // Import Member model for mayyathu status
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create a new user
router.post('/users', authenticateToken, async (req, res) => {
  try {
    // Extract user data from request body
    const { name, email, phone, adharNumber, registrationNumber, houseType, familyMembersCount } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create new user
    const userData = {
      name,
      email,
      phone,
      adharNumber,
      registrationNumber,
      houseType,
      familyMembersCount
    };

    const createdUser = await User.create(userData);

    res.status(201).json({
      message: 'User created successfully',
      user: createdUser
    });
  } catch (error) {
    console.error('Create user error:', error);

    // Check for duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      let fieldName = field;
      if (field === 'email') fieldName = 'email';
      else if (field === 'adharNumber') fieldName = 'Aadhaar number';
      else if (field === 'registrationNumber') fieldName = 'registration number';
      return res.status(400).json({ error: `User with this ${fieldName} already exists` });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll();

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific user by ID
router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a user
router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Sanitize update data to prevent updating sensitive fields
    const allowedUpdates = ['name', 'email', 'phone', 'adharNumber', 'registrationNumber', 'houseType', 'familyMembersCount', 'role', 'status'];
    const updates = Object.keys(updateData);

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    const updatedUser = await User.update(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);

    // Check for duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete a user
router.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.delete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;