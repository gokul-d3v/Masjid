// authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Update this to your backend URL

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
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
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, data);
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
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, data);
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