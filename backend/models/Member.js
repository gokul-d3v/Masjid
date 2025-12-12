const mongoose = require('mongoose');

// Function to generate a unique 4-character registration number
function generateRegistrationNumber() {
  // Generate a random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000).toString(); // Generates numbers from 1000 to 9999
  // Prefix with REG to form a 4-digit registration number like REG1234
  return `REG${random}`;
}

// Define the Family Member sub-schema
const familyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  relation: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  }
});

// Define the Member schema
const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  adharNumber: {
    type: String,
    required: true,
    match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhaar number'],
    unique: true
  },
  occupation: {
    type: String,
    required: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => generateRegistrationNumber()
  },
  houseType: {
    type: String,
    required: true
  },
  familyMembersCount: {
    type: Number,
    required: true,
    min: 0
  },
  mayyathuStatus: {
    type: Boolean,
    default: false
  },
  familyMembers: [familyMemberSchema] // Array of family members
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the Mongoose model
const MongooseMemberModel = mongoose.model('Member', memberSchema);

// Create the Member model class
class MemberModel {
  // Create a new member
  static async create(data) {
    // Ensure registration number is generated if not provided
    const memberData = {
      ...data,
      registrationNumber: data.registrationNumber || generateRegistrationNumber()
    };

    const member = new MongooseMemberModel(memberData);
    const savedMember = await member.save();

    return {
      id: savedMember._id,
      fullName: savedMember.fullName,
      age: savedMember.age,
      phone: savedMember.phone,
      adharNumber: savedMember.adharNumber,
      occupation: savedMember.occupation,
      registrationNumber: savedMember.registrationNumber,
      houseType: savedMember.houseType,
      familyMembersCount: savedMember.familyMembersCount,
      familyMembers: savedMember.familyMembers,
      mayyathuStatus: savedMember.mayyathuStatus,
      createdAt: savedMember.createdAt,
      updatedAt: savedMember.updatedAt
    };
  }

  // Find all members
  static async findAll() {
    const members = await MongooseMemberModel.find();

    return members.map(member => ({
      id: member._id,
      fullName: member.fullName,
      age: member.age,
      phone: member.phone,
      adharNumber: member.adharNumber,
      occupation: member.occupation,
      registrationNumber: member.registrationNumber,
      houseType: member.houseType,
      familyMembersCount: member.familyMembersCount,
      familyMembers: member.familyMembers,
      mayyathuStatus: member.mayyathuStatus,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt
    }));
  }

  // Find member by ID
  static async findById(id) {
    const member = await MongooseMemberModel.findById(id);
    if (!member) return null;

    return {
      id: member._id,
      fullName: member.fullName,
      age: member.age,
      phone: member.phone,
      adharNumber: member.adharNumber,
      occupation: member.occupation,
      registrationNumber: member.registrationNumber,
      houseType: member.houseType,
      familyMembersCount: member.familyMembersCount,
      familyMembers: member.familyMembers,
      mayyathuStatus: member.mayyathuStatus,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt
    };
  }

  // Update member
  static async update(id, updateData) {
    const update = { ...updateData };
    delete update.id;

    const updatedMember = await MongooseMemberModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedMember) return null;

    return {
      id: updatedMember._id,
      fullName: updatedMember.fullName,
      age: updatedMember.age,
      phone: updatedMember.phone,
      adharNumber: updatedMember.adharNumber,
      occupation: updatedMember.occupation,
      registrationNumber: updatedMember.registrationNumber,
      houseType: updatedMember.houseType,
      familyMembersCount: updatedMember.familyMembersCount,
      familyMembers: updatedMember.familyMembers,
      mayyathuStatus: updatedMember.mayyathuStatus,
      createdAt: updatedMember.createdAt,
      updatedAt: updatedMember.updatedAt
    };
  }

  // Delete member
  static async delete(id) {
    const deletedMember = await MongooseMemberModel.findByIdAndDelete(id);
    return !!deletedMember;
  }

  // Check if a registration number already exists
  static async findByRegistrationNumber(registrationNumber) {
    const member = await MongooseMemberModel.findOne({ registrationNumber: new RegExp(`^${registrationNumber}$`, 'i') }); // Case insensitive exact match
    if (!member) return null;

    return {
      id: member._id,
      fullName: member.fullName,
      phone: member.phone,
      adharNumber: member.adharNumber,
      registrationNumber: member.registrationNumber,
      mayyathuStatus: member.mayyathuStatus
    };
  }
}

// Export the Mongoose model for direct DB operations
module.exports = Object.assign(MemberModel, { mongooseModel: MongooseMemberModel });