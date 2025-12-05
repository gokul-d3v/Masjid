const mongoose = require('mongoose');

// Define the Money Collection schema
const moneyCollectionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'mayyathu', 'mayyathu_fund', 'monthly_donation', 'monthly_fund', 'other']
  },
  collectedBy: {
    type: String,
    required: true // Keep as required since we validate in the route
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member' // Associate with member who made the donation
  },
  collectedDate: {
    type: Date,
    default: Date.now
  },
  receiptNumber: {
    type: String
    // Not required in schema since route will provide fallback
  }
}, {
  timestamps: true
});

// Create the Money Collection model
const MoneyCollection = mongoose.model('MoneyCollection', moneyCollectionSchema);

class MoneyCollectionModel {
  // Create a new money collection entry
  static async create(data) {
    // Prepare the collection data, handling the date field
    const collectionData = {
      ...data,
      collectedDate: data.date || data.collectedDate || Date.now() // Use provided date or current date
    };

    const collection = new MoneyCollection(collectionData);
    const savedCollection = await collection.save();

    return {
      id: savedCollection._id,
      amount: savedCollection.amount,
      description: savedCollection.description,
      category: savedCollection.category,
      collectedBy: savedCollection.collectedBy,
      userId: savedCollection.userId,
      collectedDate: savedCollection.collectedDate,
      receiptNumber: savedCollection.receiptNumber
    };
  }

  // Find all money collections
  static async findAll() {
    const collections = await MoneyCollection.find()
      .populate('userId', 'fullName registrationNumber'); // populate member details

    return collections.map(item => ({
      id: item._id,
      amount: item.amount,
      description: item.description,
      category: item.category,
      collectedBy: item.collectedBy,
      userId: item.userId,
      collectedDate: item.collectedDate,
      receiptNumber: item.receiptNumber
    }));
  }

  // Find money collections by category
  static async findByCategory(category) {
    const collections = await MoneyCollection.find({ category })
      .populate('userId', 'fullName registrationNumber'); // populate member details

    return collections.map(item => ({
      id: item._id,
      amount: item.amount,
      description: item.description,
      category: item.category,
      collectedBy: item.collectedBy,
      userId: item.userId,
      collectedDate: item.collectedDate,
      receiptNumber: item.receiptNumber
    }));
  }

  // Get total amount by category
  static async getTotalByCategory(category) {
    const result = await MoneyCollection.aggregate([
      { $match: { category } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  // Get total amount for all collections
  static async getTotalAmount() {
    const result = await MoneyCollection.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  // Get monthly collections
  static async getMonthlyCollections() {
    const result = await MoneyCollection.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$collectedDate" },
            month: { $month: "$collectedDate" }
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return result;
  }

  // Get mayyathu fund collections
  static async getMayyathuFundCollections() {
    return await MoneyCollection.find({ category: 'mayyathu' })
      .populate('userId', 'fullName registrationNumber'); // populate member details
  }

  // Get monthly donation collections
  static async getMonthlyDonationCollections() {
    return await MoneyCollection.find({ category: 'monthly_donation' })
      .populate('userId', 'fullName registrationNumber'); // populate member details
  }

  // Update a money collection entry
  static async update(id, updateData) {
    const updatedCollection = await MoneyCollection.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'fullName registrationNumber');

    if (!updatedCollection) return null;

    return {
      id: updatedCollection._id,
      amount: updatedCollection.amount,
      description: updatedCollection.description,
      category: updatedCollection.category,
      collectedBy: updatedCollection.collectedBy,
      userId: updatedCollection.userId,
      collectedDate: updatedCollection.collectedDate,
      receiptNumber: updatedCollection.receiptNumber
    };
  }

  // Delete a money collection entry
  static async delete(id) {
    const deletedCollection = await MoneyCollection.findByIdAndDelete(id);
    return !!deletedCollection;
  }
}

module.exports = MoneyCollectionModel;