const DataItem = require('../models/DataItem');

class DataController {
  // Get all data items
  static async getAll(req, res) {
    try {
      const data = await DataItem.findAll();
      res.json({
        message: 'Hello from the backend!',
        data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a specific data item
  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const item = await DataItem.findById(id);

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json(item);
    } catch (error) {
      console.error('Error fetching data item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create a new data item
  static async create(req, res) {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }

      const newItem = await DataItem.create({ name, description });
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating data item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update a data item
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const updatedItem = await DataItem.update(parseInt(id), { name, description });

      if (!updatedItem) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating data item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a data item
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await DataItem.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.status(204).send(); // No content
    } catch (error) {
      console.error('Error deleting data item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = DataController;