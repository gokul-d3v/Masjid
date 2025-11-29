const express = require('express');
const DataController = require('../controllers/DataController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Protected data routes
router.get('/data', authenticateToken, DataController.getAll);
router.get('/data/:id', authenticateToken, DataController.getOne);
router.post('/data', authenticateToken, DataController.create);
router.put('/data/:id', authenticateToken, DataController.update);
router.delete('/data/:id', authenticateToken, DataController.delete);

module.exports = router;