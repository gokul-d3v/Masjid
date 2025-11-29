const mongoose = require('mongoose');

// Define the OTP schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true // Add index for faster lookups
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120 // OTP expires after 2 minutes (120 seconds)
  }
});

// Create the OTP model
const OTP = mongoose.model('OTP', otpSchema);

class OTPModel {
  // Generate and store a new OTP
  static async createOTP(email) {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('Generated OTP for email:', { email, otp }); // Logging for debugging

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });
    console.log('Deleted existing OTPs for email:', email); // Logging for debugging

    // Create new OTP
    const otpDoc = new OTP({ email, otp });
    await otpDoc.save();
    console.log('Saved new OTP to database:', otp); // Logging for debugging

    return otp;
  }

  // Verify OTP
  static async verifyOTP(email, otp) {
    console.log('Verifying OTP:', { email, otp }); // Logging for debugging

    // Find the OTP document by email and OTP value
    const otpDoc = await OTP.findOne({ email, otp }).exec();

    console.log('Found OTP document:', otpDoc); // Logging for debugging

    if (otpDoc) {
      // Delete the OTP after successful verification
      await OTP.deleteOne({ _id: otpDoc._id });
      console.log('OTP verified and deleted from database'); // Logging for debugging
      return true;
    }

    console.log('OTP not found or does not match'); // Logging for debugging
    return false;
  }

  // Delete OTP after use or on error
  static async deleteOTP(email) {
    await OTP.deleteMany({ email });
  }
}

module.exports = OTPModel;