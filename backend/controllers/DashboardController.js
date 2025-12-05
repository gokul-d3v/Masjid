const User = require('../models/User');
const UserMongooseModel = User.mongooseModel;
const Member = require('../models/Member');
const MemberMongooseModel = Member.mongooseModel;
const MoneyCollection = require('../models/MoneyCollection');

class DashboardController {
    // Get dashboard statistics
    static async getStats(req, res) {
        try {
            // Total members registered
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
    }

    // Get mayyathu fund data
    static async getMayyathuData(req, res) {
        try {
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
    }

    // Get monthly donation data
    static async getMonthlyDonations(req, res) {
        try {
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
    }

    // Add a new money collection
    static async addMoneyCollection(req, res) {
        try {
            const { amount, description, category, userId, fundType, date, collectedBy, receiptNumber } = req.body;

            console.log('Received donation data:', { amount, description, category, userId, fundType, date, collectedBy, receiptNumber });

            if (!amount || !category) {
                return res.status(400).json({ error: 'Amount and category (fundType) are required' });
            }

            if (!collectedBy) {
                return res.status(400).json({ error: 'Collected By (admin name) is required' });
            }

            const collectionDescription = description || `${fundType || 'donation'} collection`;

            const collectionData = {
                amount: parseFloat(amount),
                description: collectionDescription,
                category: fundType || category,
                collectedBy: collectedBy,
                userId: userId,
                date: date ? new Date(date) : new Date(),
                receiptNumber: receiptNumber || `REC${Date.now()}`
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
    }

    // Get all money collections
    static async getAllMoneyCollections(req, res) {
        try {
            const collections = await MoneyCollection.findAll();
            res.json(collections);
        } catch (error) {
            console.error('Get money collections error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Update a money collection
    static async updateMoneyCollection(req, res) {
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
    }

    // Delete a money collection
    static async deleteMoneyCollection(req, res) {
        try {
            const { id } = req.params;

            const deleted = await MoneyCollection.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Collection not found' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Delete money collection error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get recent activities
    static async getRecentActivities(req, res) {
        try {
            const recentCollections = await MoneyCollection.findAll();

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

            res.json({
                activities: collectionActivities
            });
        } catch (error) {
            console.error('Get recent activities error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = DashboardController;
