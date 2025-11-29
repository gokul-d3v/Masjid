import useAuthStore from '../store/authStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
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

export interface OTPRequestData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface OTPVerifyData {
  email: string;
  name: string;
  password: string;
  phone?: string;
  otp: string;
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
      const response = await fetch(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Request OTP for registration
  async requestOTP(userData: OTPRequestData): Promise<{ message: string; email: string }> {
    try {
      const response = await fetch(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      return data;
    } catch (error: any) {
      console.error('Request OTP error:', error);
      throw error;
    }
  },

  // Verify OTP and register user
  async verifyOTPAndRegister(verifyData: OTPVerifyData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      return data;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Forgot password request failed');
      }

      return result;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Password reset failed');
      }

      return result;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
};