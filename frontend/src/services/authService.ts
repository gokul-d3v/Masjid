import useAuthStore from '../store/authStore';
import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  phone?: string;
  registrationNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
  message: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000'}/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Login failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  },

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await axios.post<{ message: string }>(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000'}/auth/forgot-password`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Forgot password request failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  },

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await axios.post<{ message: string }>(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000'}/auth/reset-password`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Password reset failed');
      } else {
        throw new Error('Network error. Please try again.');
      }
    }
  },
};