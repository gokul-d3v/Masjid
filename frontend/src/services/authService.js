// authService.js
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:5000'; // For Android emulator
// const API_BASE_URL = 'http://localhost:5000'; // For iOS simulator

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
        timeout: 10000, // 10 seconds timeout for mobile
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Login failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  },

  // Forgot password
  async forgotPassword(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, data, {
        timeout: 10000, // 10 seconds timeout for mobile
      });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Forgot password request failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  },

  // Reset password
  async resetPassword(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, data, {
        timeout: 10000, // 10 seconds timeout for mobile
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Password reset failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  },
};