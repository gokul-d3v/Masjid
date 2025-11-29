const express = require('express');
const User = require('../models/User');
const UserMongooseModel = User.mongooseModel; // Access the actual Mongoose model
const Member = require('../models/Member');
const MemberMongooseModel = Member.mongooseModel; // Access the actual Mongoose model
const MoneyCollection = require('../models/MoneyCollection');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Total members registered (this matches what's shown in the user management page)
    const totalUsers = await MemberMongooseModel.countDocuments();

    // Total money collected
    const totalMoneyCollected = await MoneyCollection.getTotalAmount();

    // Mayyathu fund collected - check for multiple possible category values
    const mayyathuFundCollected = await MoneyCollection.getTotalByCategory('mayyathu') +
                                  await MoneyCollection.getTotalByCategory('mayyathu_fund') +
                                  await MoneyCollection.getTotalByCategory('mayyathu fund') +
                                  await MoneyCollection.getTotalByCategory('mayyathu-fund');

    // Monthly donations collected - check for multiple possible category values
    const monthlyDonationsCollected = await MoneyCollection.getTotalByCategory('monthly_donation') +
                                    await MoneyCollection.getTotalByCategory('monthly_fund') +
                                    await MoneyCollection.getTotalByCategory('monthly donation') +
                                    await MoneyCollection.getTotalByCategory('monthly-donation');

    // Get monthly collections data for chart
    const monthlyCollections = await MoneyCollection.getMonthlyCollections();

    // Get recent collections
    const recentCollections = await MoneyCollection.findAll();

    res.json({
      totalUsers,
      totalMoneyCollected,
      mayyathuFundCollected,
      monthlyDonationsCollected,
      monthlyCollections,
      recentCollections
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mayyathu fund data
router.get('/mayyathu', authenticateToken, async (req, res) => {
  try {
    // Get collections for multiple possible mayyathu categories
    const mayyathuCollections1 = await MoneyCollection.findByCategory('mayyathu');
    const mayyathuCollections2 = await MoneyCollection.findByCategory('mayyathu_fund');
    const mayyathuCollections3 = await MoneyCollection.findByCategory('mayyathu fund');
    const mayyathuCollections4 = await MoneyCollection.findByCategory('mayyathu-fund');
    const mayyathuCollections = [...mayyathuCollections1, ...mayyathuCollections2, ...mayyathuCollections3, ...mayyathuCollections4];

    const totalMayyathu = await MoneyCollection.getTotalByCategory('mayyathu') +
                          await MoneyCollection.getTotalByCategory('mayyathu_fund') +
                          await MoneyCollection.getTotalByCategory('mayyathu fund') +
                          await MoneyCollection.getTotalByCategory('mayyathu-fund');

    res.json({
      total: totalMayyathu,
      collections: mayyathuCollections
    });
  } catch (error) {
    console.error('Mayyathu data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get monthly donation data
router.get('/monthly-donations', authenticateToken, async (req, res) => {
  try {
    // Get collections for multiple possible monthly donation categories
    const monthlyDonationCollections1 = await MoneyCollection.findByCategory('monthly_donation');
    const monthlyDonationCollections2 = await MoneyCollection.findByCategory('monthly_fund');
    const monthlyDonationCollections3 = await MoneyCollection.findByCategory('monthly donation');
    const monthlyDonationCollections4 = await MoneyCollection.findByCategory('monthly-donation');
    const monthlyDonationCollections = [...monthlyDonationCollections1, ...monthlyDonationCollections2, ...monthlyDonationCollections3, ...monthlyDonationCollections4];

    const totalMonthlyDonations = await MoneyCollection.getTotalByCategory('monthly_donation') +
                                await MoneyCollection.getTotalByCategory('monthly_fund') +
                                await MoneyCollection.getTotalByCategory('monthly donation') +
                                await MoneyCollection.getTotalByCategory('monthly-donation');

    res.json({
      total: totalMonthlyDonations,
      collections: monthlyDonationCollections
    });
  } catch (error) {
    console.error('Monthly donations data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new money collection
router.post('/money-collection', authenticateToken, async (req, res) => {
  try {
    const { amount, description, category, userId, fundType, date, collectedBy, receiptNumber } = req.body;

    console.log('Received donation data:', { amount, description, category, userId, fundType, date, collectedBy, receiptNumber });

    if (!amount || !category) {
      return res.status(400).json({ error: 'Amount and category (fundType) are required' });
    }

    if (!collectedBy) {
      return res.status(400).json({ error: 'Collected By (admin name) is required' });
    }

    // Use fundType as description if no description provided
    const collectionDescription = description || `${fundType || 'donation'} collection`;

    const collectionData = {
      amount: parseFloat(amount),
      description: collectionDescription,
      category: fundType || category, // Use fundType if available, otherwise use category
      collectedBy: collectedBy, // Use provided admin name (required)
      userId: userId, // Associate with the user who made the donation
      date: date ? new Date(date) : new Date(), // Use provided date or current date
      receiptNumber: receiptNumber || `REC${Date.now()}` // Generate if not provided
    };

    const newCollection = await MoneyCollection.create(collectionData);

    res.status(201).json({
      message: 'Donation collected successfully',
      collection: newCollection
    });
  } catch (error) {
    console.error('Add money collection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all money collections
router.get('/money-collection', authenticateToken, async (req, res) => {
  try {
    const collections = await MoneyCollection.findAll();
    res.json(collections);
  } catch (error) {
    console.error('Get money collections error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a money collection
router.put('/money-collection/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, collectedBy, userId, date, receiptNumber } = req.body;

    if (!amount || !category || !collectedBy) {
      return res.status(400).json({ error: 'Amount, category, and collectedBy are required' });
    }

    const collectionData = {
      amount: parseFloat(amount),
      description,
      category,
      collectedBy,
      userId,
      collectedDate: date ? new Date(date) : undefined,
      receiptNumber
    };

    // Remove undefined values
    Object.keys(collectionData).forEach(key => {
      if (collectionData[key] === undefined) {
        delete collectionData[key];
      }
    });

    const updatedCollection = await MoneyCollection.update(id, collectionData);

    if (!updatedCollection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({
      message: 'Donation updated successfully',
      collection: updatedCollection
    });
  } catch (error) {
    console.error('Update money collection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a money collection
router.delete('/money-collection/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await MoneyCollection.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Delete money collection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activities
router.get('/recent-activities', authenticateToken, async (req, res) => {
  try {
    // Get recent money collections as activities
    const recentCollections = await MoneyCollection.findAll();

    // Convert collections to activity format
    const collectionActivities = recentCollections.slice(0, 5).map((collection, index) => ({
      id: `collection-${collection.id}`,
      action: 'Money Collection',
      details: {
        amount: collection.amount,
        category: collection.category,
        collectedBy: collection.collectedBy
      },
      timestamp: collection.collectedDate || collection.createdAt
    }));

    // Return the real collection activities
    res.json({
      activities: collectionActivities
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;