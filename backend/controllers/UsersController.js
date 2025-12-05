const User = require('../models/User');

class UsersController {
    // Create a new user
    static async create(req, res) {
        try {
            const { name, email, phone, adharNumber, registrationNumber, houseType, familyMembersCount } = req.body;

            // Validation
            if (!name || !email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }

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
    }

    // Get all users
    static async getAll(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get a specific user by ID
    static async getById(req, res) {
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
    }

    // Update a user
    static async update(req, res) {
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

            if (error.code === 11000) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Delete a user
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await User.delete(id);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UsersController;
