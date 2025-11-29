const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Function to generate a unique 4-character registration number
function generateRegistrationNumber() {
  // Generate a random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000).toString(); // Generates numbers from 1000 to 9999
  // Prefix with REG to form a 4-digit registration number like REG1234
  return `REG${random}`;
}

// Define the User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  // Additional fields for user management
  adharNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true // Allows multiple documents with null/undefined value
  },
  registrationNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    default: () => generateRegistrationNumber()
  },
  houseType: {
    type: String,
    required: false,
    trim: true
  },
  familyMembersCount: {
    type: Number,
    required: false,
    min: 0
  },
  role: {
    type: String,
    required: false,
    default: 'User',
    enum: ['User', 'Admin']
  },
  status: {
    type: String,
    required: false,
    default: 'Active',
    enum: ['Active', 'Inactive']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the Mongoose model for direct DB operations
module.exports.mongooseModel = User;

// Wrapper methods to maintain the same interface
class UserModel {
  // Create a new user
  static async create(userData) {
    try {
      // If registration number is not provided, generate a unique one
      let finalRegistrationNumber = userData.registrationNumber;
      if (!finalRegistrationNumber) {
        // Keep generating until we find a unique registration number
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loop

        while (!isUnique && attempts < maxAttempts) {
          const candidateRegNumber = generateRegistrationNumber();
          const existingUser = await this.findByRegistrationNumber(candidateRegNumber);
          const existingMember = await require('./Member').findByRegistrationNumber(candidateRegNumber); // Check against members too

          if (!existingUser && !existingMember) {
            finalRegistrationNumber = candidateRegNumber;
            isUnique = true;
          } else {
            attempts++;
          }
        }

        if (!isUnique) {
          throw new Error('Failed to generate unique registration number after multiple attempts');
        }
      } else {
        // If a registration number was provided, check if it already exists
        const existingUser = await this.findByRegistrationNumber(finalRegistrationNumber);
        const existingMember = await require('./Member').findByRegistrationNumber(finalRegistrationNumber); // Check against members too
        if (existingUser || existingMember) {
          throw new Error('Registration number already exists');
        }
      }

      // Create user with the final registration number
      const user = new User({
        ...userData,
        registrationNumber: finalRegistrationNumber
      });
      const savedUser = await user.save();

      return {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        phone: savedUser.phone,
        registrationNumber: savedUser.registrationNumber // Include registration number in response
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  // Find user by email (returns full user document for password comparison)
  static async findByEmailForAuth(email) {
    return await User.findOne({ email });
  }

  // Find user by email (returns sanitized object for general use)
  static async findByEmail(email) {
    const user = await User.findOne({ email });
    if (!user) return null;

    return {
      id: user._id,
      email: user.email,
      password: user.password,
      name: user.name,
      phone: user.phone,
      registrationNumber: user.registrationNumber
    };
  }

  // Find user by phone
  static async findByPhone(phone) {
    const user = await User.findOne({ phone });
    if (!user) return null;

    return {
      id: user._id,
      email: user.email,
      password: user.password,
      name: user.name,
      phone: user.phone,
      registrationNumber: user.registrationNumber
    };
  }

  // Find user by ID
  static async findById(id) {
    const user = await User.findById(id);
    if (!user) return null;

    return {
      id: user._id,
      email: user.email,
      password: user.password,
      name: user.name,
      phone: user.phone,
      registrationNumber: user.registrationNumber
    };
  }

  // Update user
  static async update(id, updateData) {
    // Remove id from update data to prevent updating it
    const update = { ...updateData };
    delete update.id;

    // Only allow updating specific fields for security
    const allowedUpdates = [
      'name',
      'email',
      'phone',
      'adharNumber',
      'registrationNumber',
      'houseType',
      'familyMembersCount',
      'role',
      'status'
    ];
    const updates = Object.keys(update);
    const filteredUpdate = {};

    for (const updateKey of updates) {
      if (allowedUpdates.includes(updateKey)) {
        filteredUpdate[updateKey] = update[updateKey];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: filteredUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return null;

    return {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      adharNumber: updatedUser.adharNumber,
      registrationNumber: updatedUser.registrationNumber,
      houseType: updatedUser.houseType,
      familyMembersCount: updatedUser.familyMembersCount,
      role: updatedUser.role,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  }

  // Find all users
  static async findAll() {
    const users = await User.find();

    return users.map(user => ({
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      adharNumber: user.adharNumber,
      registrationNumber: user.registrationNumber,
      houseType: user.houseType,
      familyMembersCount: user.familyMembersCount,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  // Delete user
  static async delete(id) {
    const deletedUser = await User.findByIdAndDelete(id);
    return !!deletedUser;
  }

  // Check if a registration number already exists
  static async findByRegistrationNumber(registrationNumber) {
    const user = await User.findOne({ registrationNumber });
    if (!user) return null;

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      registrationNumber: user.registrationNumber
    };
  }
}

module.exports = Object.assign(UserModel, { mongooseModel: User });