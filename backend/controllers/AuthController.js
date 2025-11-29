const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const emailService = require('../utils/emailService');
const { validatePassword, validateEmail } = require('../middleware/auth');
require('dotenv').config();

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      // Validate email
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ error: passwordValidation.message });
      }

      // Validate phone number (optional but if provided, should be valid)
      if (phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      // Check if phone already exists (if phone is provided)
      if (phone) {
        const existingPhone = await User.findByPhone(phone);
        if (existingPhone) {
          return res.status(409).json({ error: 'User with this phone number already exists' });
        }
      }

      // Create new user
      const userData = await User.create({ name, email, password, phone });

      // Generate JWT token
      const token = jwt.sign(
        { userId: userData.id, email: userData.email },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userData
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // For login, we need to get the full user document to access comparePassword
      const fullUser = await require('../models/User').findByEmailForAuth(email);
      if (!fullUser) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await fullUser.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // Forgot password
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.status(200).json({
          message: 'If an account with this email exists, a password reset link has been sent.'
        });
      }

      // In a real application, you would send an email with a reset token
      // For this demo, we'll just return a success message
      return res.status(200).json({
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Reset password
  static async resetPassword(req, res) {
    try {
      // In a real application, you would verify the reset token
      // For this demo, we'll just return a success message
      return res.status(200).json({
        message: 'Password reset successful'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Request OTP for registration
  static async requestOTP(req, res) {
    try {
      const { email, name, password, phone } = req.body;

      // Validation
      if (!email || !name || !password) {
        return res.status(400).json({ error: 'Email, name, and password are required' });
      }

      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ error: passwordValidation.message });
      }

      // Validate phone number (optional but if provided, should be valid)
      if (phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      // Generate and store OTP
      const otp = await OTP.createOTP(email);
      console.log('Controller: Generated OTP for user registration:', { email, otp }); // Logging for debugging

      // Log the attempt to send OTP
      console.log('Attempting to send OTP to:', email, 'with OTP length:', otp.length);

      // Send OTP via email
      const emailResult = await emailService.sendOTP(email, otp);

      console.log('Email service result:', emailResult); // Log the email result

      if (!emailResult.success) {
        console.error('Failed to send OTP:', emailResult.error);

        // For development and debugging, return the actual error
        // In production, you might want to return a generic message to prevent enumeration
        if (process.env.NODE_ENV === 'development') {
          return res.status(500).json({
            error: 'Failed to send OTP',
            details: emailResult.error
          });
        } else {
          // In production, return generic message to prevent email enumeration
          return res.status(200).json({
            message: 'If an account with this email exists, an OTP has been sent.',
            email: email
          });
        }
      }

      // Return success response without creating user yet
      res.status(200).json({
        message: 'OTP sent successfully. Please check your email.',
        email: email // Send email back so frontend can store it for verification step
      });
    } catch (error) {
      console.error('Request OTP error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Verify OTP and register user
  static async verifyOTPAndRegister(req, res) {
    try {
      const { email, name, password, phone, otp } = req.body;

      // Validation
      if (!email || !name || !password || !otp) {
        return res.status(400).json({ error: 'Email, name, password, and OTP are required' });
      }

      // Verify OTP
      console.log('Controller: Attempting to verify OTP:', { email, otp }); // Logging for debugging
      const isValidOTP = await OTP.verifyOTP(email, otp);
      console.log('Controller: OTP verification result:', isValidOTP); // Logging for debugging

      if (!isValidOTP) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Create new user (the OTP verification means we can proceed with registration)
      const userData = await User.create({ name, email, password, phone });

      // Generate JWT token
      const token = jwt.sign(
        { userId: userData.id, email: userData.email },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userData
      });
    } catch (error) {
      console.error('Verify OTP and register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AuthController;