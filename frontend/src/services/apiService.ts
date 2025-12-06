// apiService.ts
import axios from 'axios';
import useAuthStore from '../store/authStore';

export interface DataItem {
  id: number;
  name: string;
  description: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalMoneyCollected: number;
  mayyathuFundCollected: number;
  monthlyDonationsCollected: number;
  monthlyCollections: any[];
  recentCollections: any[];
}

const getAPIBaseUrl = (): string => {
  // Check for Expo environment variable first (for mobile)
  const expoBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (expoBaseUrl) {
    // Remove any trailing '/api' since the backend routes handle that
    return expoBaseUrl.endsWith('/api') ? expoBaseUrl.slice(0, -4) : expoBaseUrl;
  }

  // Try to get API URL from ExpoConstants if available
  try {
    const expoConstants: any = require('expo-constants');
    if (expoConstants.expoConfig && expoConstants.expoConfig.extra) {
      const expoConfigApiUrl = expoConstants.expoConfig.extra.EXPO_PUBLIC_API_BASE_URL;
      if (expoConfigApiUrl) {
        // Remove any trailing '/api' since the backend routes handle that
        return expoConfigApiUrl.endsWith('/api') ? expoConfigApiUrl.slice(0, -4) : expoConfigApiUrl;
      }
    }
  } catch (e) {
    console.log('Could not access Expo constants, using fallback');
  }

  // Check for development environment (web)
  if (typeof window !== 'undefined') {
    // Type assertion to handle TypeScript issue with import.meta.env
    const env = import.meta.env as Record<string, string>;

    // For web, use environment variable or fallback
    const baseUrl = env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Remove any trailing '/api' since the backend routes handle that
    return baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
  }

  // Default to production backend when running in Expo development
  return 'https://masjid-backend-rn3t.onrender.com';
};

// Create an axios interceptor for handling 403 errors
const apiClient = axios.create({
  baseURL: getAPIBaseUrl(),
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Automatically logout the user if authentication fails
      const { logout } = useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  }
); // Read from environment variable

export const apiService = {
  // Fetch all data items
  async getData(): Promise<{ data: DataItem[] }> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.get<{ data: DataItem[] }>(`/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching data:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Add a new data item
  async addData(item: Omit<DataItem, 'id'>): Promise<DataItem> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.post<DataItem>(`/data`, item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding data:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Update a data item
  async updateData(id: number, item: Partial<DataItem>): Promise<DataItem> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.put<DataItem>(`/data/${id}`, item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating data:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Delete a data item
  async deleteData(id: number): Promise<void> {
    try {
      const { token } = useAuthStore.getState();
      await apiClient.delete(`/data/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error: any) {
      console.error('Error deleting data:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.get<DashboardStats>(`/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Add money collection
  async addMoneyCollection(collectionData: any): Promise<any> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.post<any>(`/dashboard/money-collection`, collectionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding money collection:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Add new member
  async addUser(userData: any): Promise<any> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.post<any>(`/members`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding member:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Get all members
  async getAllUsers(): Promise<any[]> {
    try {
      const { token } = useAuthStore.getState();

      // Check if token exists before making request
      if (!token) {
        console.warn('No authentication token available. User needs to log in first.');
        throw new Error('Authentication required. Please log in to access this resource.');
      }

      const response = await apiClient.get<any>(`/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.members || response.data;
    } catch (error: any) {
      console.error('Error getting members:', error);
      if (error.response) {
        // Different status codes might have different meanings
        if (error.response.status === 401 || error.response.status === 403) {
          console.error('Authentication error - token may be invalid or expired');
          // The interceptor should handle logout automatically
          throw new Error('Authentication failed. Please log in again.');
        } else if (error.response.status === 404) {
          console.error('Members endpoint not found');
          throw new Error('Members service is not available.');
        } else {
          const errorMessage = error.response.data?.error || error.response.data?.message || error.message || 'Unknown error';
          throw new Error(errorMessage);
        }
      }
      // For network errors or other issues
      throw error;
    }
  },

  // Update member
  async updateUser(userId: number, userData: any): Promise<any> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.put<any>(`/members/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating member:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Toggle mayyathu fund status
  async toggleMayyathuStatus(userId: number, status: boolean): Promise<any> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.patch<any>(`/members/${userId}/mayyathu-status`, { mayyathuStatus: status }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error toggling mayyathu status:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Delete member
  async deleteUser(userId: number): Promise<void> {
    try {
      const { token } = useAuthStore.getState();
      await apiClient.delete(`/members/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error: any) {
      console.error('Error deleting member:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Collect donation
  async addDonation(collectionData: any): Promise<any> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.post<any>(`/dashboard/money-collection`, collectionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding donation:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Update a donation
  async updateDonation(collectionId: number, collectionData: any): Promise<any> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.put<any>(`/dashboard/money-collection/${collectionId}`, collectionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating donation:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Get all money collections
  async getMoneyCollections(): Promise<any[]> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.get<any>(`/dashboard/money-collection`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = response.data;
      return Array.isArray(data) ? data : data.collections || [];
    } catch (error: any) {
      console.error('Error getting donations:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Delete a donation
  async deleteDonation(collectionId: number | string): Promise<void> {
    try {
      const { token } = useAuthStore.getState();
      await apiClient.delete(`/dashboard/money-collection/${collectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error: any) {
      console.error('Error deleting donation:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities(): Promise<any[]> {
    try {
      const { token } = useAuthStore.getState();
      const response = await apiClient.get<any>(`/dashboard/recent-activities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = response.data;
      return Array.isArray(data) ? data : data.activities || [];
    } catch (error: any) {
      console.error('Error getting recent activities:', error);
      // Fallback to localStorage activities if API fails
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message || 'Unknown error';
        throw new Error(errorMessage);
      }
      return JSON.parse(localStorage.getItem('activityLogs') || '[]');
    }
  }
};