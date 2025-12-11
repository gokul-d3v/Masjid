const express = require('express');
const MembersController = require('../controllers/MembersController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Add a new member
router.post('/', authenticateToken, MembersController.create);

// Get all members
router.get('/', authenticateToken, MembersController.getAll);

// Get a specific member by ID
router.get('/:id', authenticateToken, MembersController.getById);

// Update a member
router.put('/:id', authenticateToken, MembersController.update);

// Update mayyathu fund status
router.patch('/:id/mayyathu-status', authenticateToken, MembersController.updateMayyathuStatus);

// Public cron job endpoint (no authentication required) - must be defined before dynamic routes
router.get('/cron', (req, res) => {
    // Add your cron job logic here as needed
    console.log(`Cron job executed at ${new Date().toISOString()}`);

    res.status(200).json({
        status: 'success',
        message: 'Cron job executed successfully',
        timestamp: new Date().toISOString()
    });
});

// Delete a member
router.delete('/:id', authenticateToken, MembersController.delete);

module.exports = router;