const Member = require('../models/Member');

class MembersController {
    // Add a new member
    static async create(req, res) {
        try {
            const {
                fullName,
                age,
                phone,
                adharNumber,
                occupation,
                registrationNumber,
                houseType,
                familyMembersCount,
                familyMembers
            } = req.body;

            // Validation
            if (!fullName || !age || !phone || !adharNumber || !occupation || !registrationNumber || !houseType || !familyMembersCount) {
                return res.status(400).json({ error: 'All required fields must be provided' });
            }

            // Validate phone format
            if (!/^\d{10}$/.test(phone)) {
                return res.status(400).json({ error: 'Phone number must be a 10-digit number' });
            }

            // Validate Aadhaar number format
            if (!/^\d{12}$/.test(adharNumber)) {
                return res.status(400).json({ error: 'Aadhaar number must be a 12-digit number' });
            }

            // Validate age
            if (age < 1 || age > 120) {
                return res.status(400).json({ error: 'Age must be between 1 and 120' });
            }

            // Validate occupation
            if (typeof occupation !== 'string' || occupation.trim().length < 2) {
                return res.status(400).json({ error: 'Occupation must be at least 2 characters' });
            }

            // Validate family members
            if (!Array.isArray(familyMembers)) {
                return res.status(400).json({ error: 'Family members must be an array' });
            }

            if (familyMembers.length !== familyMembersCount) {
                return res.status(400).json({ error: 'Family members count does not match the number of family member entries' });
            }

            // Validate each family member
            for (const member of familyMembers) {
                if (!member.name || !member.relation || !member.age) {
                    return res.status(400).json({ error: 'Each family member must have name, relation, and age' });
                }

                if (member.age < 0 || member.age > 120) {
                    return res.status(400).json({ error: 'Each family member age must be between 0 and 120' });
                }
            }

            // Create new member
            const newMember = await Member.create({
                fullName,
                age,
                phone,
                adharNumber,
                occupation,
                registrationNumber,
                houseType,
                familyMembersCount,
                familyMembers
            });

            res.status(201).json({
                message: 'Member registered successfully',
                member: newMember
            });
        } catch (error) {
            console.error('Add member error:', error);

            // Check for duplicate key error
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                let fieldName = field;
                if (field === 'adharNumber') fieldName = 'Aadhaar number';
                else if (field === 'registrationNumber') fieldName = 'registration number';
                else if (field === 'phone') fieldName = 'phone number';
                return res.status(400).json({ error: `A member with this ${fieldName} already exists` });
            }

            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get all members
    static async getAll(req, res) {
        try {
            const members = await Member.findAll();
            res.json({ members });
        } catch (error) {
            console.error('Get members error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get a specific member by ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const member = await Member.findById(id);

            if (!member) {
                return res.status(404).json({ error: 'Member not found' });
            }

            res.json({ member });
        } catch (error) {
            console.error('Get member error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Update a member
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Sanitize update data to prevent updating fields that should not be updated
            const allowedUpdates = ['fullName', 'age', 'phone', 'adharNumber', 'occupation', 'houseType', 'familyMembersCount', 'familyMembers', 'mayyathuStatus'];
            const requestedUpdates = Object.keys(updateData);

            // Filter out disallowed updates to allow only valid ones
            const filteredUpdateData = {};
            requestedUpdates.forEach(update => {
                if (allowedUpdates.includes(update)) {
                    filteredUpdateData[update] = updateData[update];
                }
            });

            // Remove registrationNumber from update if it exists to prevent uniqueness constraint errors
            if (filteredUpdateData.registrationNumber) {
                delete filteredUpdateData.registrationNumber;
            }

            // Additional validation for age
            if (filteredUpdateData.age !== undefined) {
                const age = parseInt(filteredUpdateData.age);
                if (isNaN(age) || age < 0 || age > 120) {
                    return res.status(400).json({ error: 'Age must be between 0 and 120' });
                }
                filteredUpdateData.age = age;
            }

            // Additional validation for familyMembersCount
            if (filteredUpdateData.familyMembersCount !== undefined) {
                const count = parseInt(filteredUpdateData.familyMembersCount);
                if (isNaN(count) || count < 0) {
                    return res.status(400).json({ error: 'Family members count must be a non-negative number' });
                }
                filteredUpdateData.familyMembersCount = count;
            }

            const updatedMember = await Member.update(id, filteredUpdateData);

            if (!updatedMember) {
                return res.status(404).json({ error: 'Member not found' });
            }

            res.json({
                message: 'Member updated successfully',
                member: updatedMember
            });
        } catch (error) {
            console.error('Update member error:', error);

            // Check for duplicate key error
            if (error.code === 11000) {
                const field = Object.keys(error.keyValue)[0];
                let fieldName = field;
                if (field === 'adharNumber') fieldName = 'Aadhaar number';
                else if (field === 'registrationNumber') fieldName = 'registration number';
                else if (field === 'phone') fieldName = 'phone number';
                return res.status(400).json({ error: `A member with this ${fieldName} already exists` });
            }

            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Update mayyathu fund status
    static async updateMayyathuStatus(req, res) {
        try {
            const { id } = req.params;
            const { mayyathuStatus } = req.body;

            if (typeof mayyathuStatus !== 'boolean') {
                return res.status(400).json({ error: 'mayyathuStatus must be a boolean' });
            }

            const updateData = { mayyathuStatus };
            const updatedMember = await Member.update(id, updateData);

            if (!updatedMember) {
                return res.status(404).json({ error: 'Member not found' });
            }

            res.json({
                message: `Member ${mayyathuStatus ? 'added to' : 'removed from'} Mayyathu Fund`,
                member: updatedMember
            });
        } catch (error) {
            console.error('Update mayyathu status error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Delete a member
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Member.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Member not found' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Delete member error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = MembersController;
