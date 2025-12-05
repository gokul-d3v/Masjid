const express = require('express');
const DashboardController = require('../controllers/DashboardController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, DashboardController.getStats);

// Get mayyathu fund data
router.get('/mayyathu', authenticateToken, DashboardController.getMayyathuData);

// Get monthly donation data
router.get('/monthly-donations', authenticateToken, DashboardController.getMonthlyDonations);

// Add a new money collection
router.post('/money-collection', authenticateToken, DashboardController.addMoneyCollection);

// Get all money collections
router.get('/money-collection', authenticateToken, DashboardController.getAllMoneyCollections);

// Update a money collection
router.put('/money-collection/:id', authenticateToken, DashboardController.updateMoneyCollection);

// Delete a money collection
router.delete('/money-collection/:id', authenticateToken, DashboardController.deleteMoneyCollection);

// Get recent activities
router.get('/recent-activities', authenticateToken, DashboardController.getRecentActivities);

module.exports = router;