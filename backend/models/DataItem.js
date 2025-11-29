const mongoose = require('mongoose');

// Define the DataItem schema
const dataItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the DataItem model
const DataItem = mongoose.model('DataItem', dataItemSchema);

// Wrapper methods to maintain the same interface
class DataItemModel {
  // Create a new data item
  static async create(data) {
    const dataItem = new DataItem(data);
    const savedDataItem = await dataItem.save();

    return {
      id: savedDataItem._id,
      name: savedDataItem.name,
      description: savedDataItem.description
    };
  }

  // Find all data items
  static async findAll() {
    const items = await DataItem.find();

    return items.map(item => ({
      id: item._id,
      name: item.name,
      description: item.description
    }));
  }

  // Find data item by ID
  static async findById(id) {
    const item = await DataItem.findById(id);
    if (!item) return null;

    return {
      id: item._id,
      name: item.name,
      description: item.description
    };
  }

  // Update data item
  static async update(id, updateData) {
    // Remove id from update data to prevent updating it
    const update = { ...updateData };
    delete update.id;

    // Only allow updating specific fields
    const allowedUpdates = ['name', 'description'];
    const updates = Object.keys(update);
    const filteredUpdate = {};

    for (const updateKey of updates) {
      if (allowedUpdates.includes(updateKey)) {
        filteredUpdate[updateKey] = update[updateKey];
      }
    }

    const updatedItem = await DataItem.findByIdAndUpdate(
      id,
      { $set: filteredUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedItem) return null;

    return {
      id: updatedItem._id,
      name: updatedItem.name,
      description: updatedItem.description
    };
  }

  // Delete data item
  static async delete(id) {
    const deletedItem = await DataItem.findByIdAndDelete(id);
    return !!deletedItem;
  }
}

module.exports = DataItemModel;