// apiService.js
import axios from 'axios';

// Determine the base URL based on the platform
const getAPIBaseUrl = () => {
  // First check for environment variable (for both web and mobile)
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envBaseUrl) {
    return envBaseUrl;
  }

  // This checks if we're running in an environment where 'window' exists (web browser)
  if (typeof window !== 'undefined') {
    // For web, use the same host but different port
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  // For mobile development with Expo:
  // - Android emulator: requires 10.0.2.2 to access host's localhost
  // - iOS simulator: can use localhost to access host's localhost
  // - Physical device: requires host machine's IP address

  // When using Expo development client, you'll need to customize the URL based on your device
  // Android emulator: use 10.0.2.2
  // iOS simulator: use localhost
  // Physical device: use your computer's IP address on the same network
  console.log('Expo development environment detected');

  // Default to Android emulator setting, but you may need to change this based on your setup
  // For Android emulator: return 'http://10.0.2.2:5000';
  // For iOS simulator: return 'http://localhost:5000';
  // For physical device: return 'http://[your_computer_ip]:5000';
  return 'http://10.0.2.2:5000'; // Changed to work with Android emulators by default, change as needed
};

const API_BASE_URL = getAPIBaseUrl();

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout for mobile
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage or state if needed
    // const token = // get token from auth store
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Handle unauthorized access - maybe navigate to login
      console.log('Unauthorized access - need to login');
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Add money collection
  async addMoneyCollection(collectionData) {
    try {
      const response = await apiClient.post('/dashboard/money-collection', collectionData);
      return response.data;
    } catch (error) {
      console.error('Error adding money collection:', error);
      throw error;
    }
  },

  // Get all users/members
  async getAllUsers() {
    try {
      const response = await apiClient.get('/members');
      return response.data;
    } catch (error) {
      console.error('Error getting members:', error);
      throw error;
    }
  },

  // Add new user
  async addUser(userData) {
    try {
      const response = await apiClient.post('/members', userData);
      return response.data;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/members/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(userId) {
    try {
      await apiClient.delete(`/members/${userId}`);
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  },

  // Toggle mayyathu status
  async toggleMayyathuStatus(userId, status) {
    try {
      const response = await apiClient.patch(`/members/${userId}/mayyathu-status`, {
        mayyathuStatus: status,
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling mayyathu status:', error);
      throw error;
    }
  },

  // Get money collections
  async getMoneyCollections() {
    try {
      const response = await apiClient.get('/dashboard/money-collection');
      return response.data;
    } catch (error) {
      console.error('Error getting donations:', error);
      throw error;
    }
  },

  // Add donation
  async addDonation(collectionData) {
    try {
      const response = await apiClient.post('/dashboard/money-collection', collectionData);
      return response.data;
    } catch (error) {
      console.error('Error adding donation:', error);
      throw error;
    }
  },

  // Update donation
  async updateDonation(collectionId, collectionData) {
    try {
      const response = await apiClient.put(`/dashboard/money-collection/${collectionId}`, collectionData);
      return response.data;
    } catch (error) {
      console.error('Error updating donation:', error);
      throw error;
    }
  },

  // Delete donation
  async deleteDonation(collectionId) {
    try {
      await apiClient.delete(`/dashboard/money-collection/${collectionId}`);
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await apiClient.get('/dashboard/recent-activities');
      return response.data;
    } catch (error) {
      console.error('Error getting recent activities:', error);
      throw error;
    }
  },
};