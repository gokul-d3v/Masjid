const express = require('express');
const Member = require('../models/Member');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Add a new member
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      age,
      phone,
      adharNumber,
      registrationNumber,
      houseType,
      familyMembersCount,
      familyMembers
    } = req.body;

    // Validation
    if (!fullName || !age || !phone || !adharNumber || !registrationNumber || !houseType || !familyMembersCount) {
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
});

// Get all members
router.get('/', authenticateToken, async (req, res) => {
  try {
    const members = await Member.findAll();
    res.json({
      members
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific member by ID
router.get('/:id', authenticateToken, async (req, res) => {
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
});

// Update a member
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      age,
      phone,
      adharNumber,
      registrationNumber,
      houseType,
      familyMembersCount,
      familyMembers
    } = req.body;

    const updatedMember = await Member.update(id, {
      fullName,
      age,
      phone,
      adharNumber,
      registrationNumber,
      houseType,
      familyMembersCount,
      familyMembers
    });

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
});

// Update mayyathu fund status
router.patch('/:id/mayyathu-status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { mayyathuStatus } = req.body;

    if (typeof mayyathuStatus !== 'boolean') {
      return res.status(400).json({ error: 'mayyathuStatus must be a boolean' });
    }

    // Update the member's mayyathu status
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
});

// Delete a member
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Member.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;