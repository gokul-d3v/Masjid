const User = require('../models/User');

class ProfileController {
    // Update user profile
    static async update(req, res) {
        try {
            const { name, phone } = req.body;

            // Validation
            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }

            // Update user
            const updatedUser = await User.update(req.user.userId, { name, phone });

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = ProfileController;
