import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  registrationNumber?: string;
}

interface Toast {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  toast: Toast;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (profileData: { name: string; phone?: string }) => Promise<void>;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, duration?: number) => void;
  hideToast: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      toast: {
        show: false,
        type: 'info',
        message: '',
        duration: 3000
      },

      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          set({
            loading: false,
            isAuthenticated: true,
            user: data.user,
            token: data.token,
            error: null
          });

          return { success: true };
        } catch (error: any) {
          const errorMessage = error.message || 'Login failed';
          set({ loading: false, error: errorMessage });

          // Show toast notification for login failure
          // We need to import toast first, so let's use the existing show toast method
          set(state => ({
            ...state,
            toast: {
              ...state.toast,
              show: true,
              type: 'error',
              message: errorMessage,
              duration: 3000
            }
          }));

          // Auto hide toast after duration
          setTimeout(() => {
            set(state => ({
              ...state,
              toast: {
                ...state.toast,
                show: false
              }
            }));
          }, 3000);

          return { success: false, error: errorMessage };
        }
      },

      signup: async (name, email, password, phone) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
          }

          set({
            loading: false,
            isAuthenticated: true,
            user: data.user,
            token: data.token,
            error: null
          });

          return { success: true };
        } catch (error: any) {
          const errorMessage = error.message || 'Registration failed';
          set({ loading: false, error: errorMessage });

          // Show toast notification for signup failure
          set(state => ({
            ...state,
            toast: {
              ...state.toast,
              show: true,
              type: 'error',
              message: errorMessage,
              duration: 3000
            }
          }));

          // Auto hide toast after duration
          setTimeout(() => {
            set(state => ({
              ...state,
              toast: {
                ...state.toast,
                show: false
              }
            }));
          }, 3000);

          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      },

      updateProfile: async (profileData) => {
        const { token } = get();

        if (!token) {
          throw new Error('No authentication token available');
        }

        try {
          const response = await fetch(`${(import.meta.env as Record<string, string>).VITE_API_BASE_URL || 'http://localhost:5000/api'}/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile');
          }

          // Update the user in the store
          set((state) => ({
            ...state,
            user: {
              ...state.user!,
              ...profileData
            }
          }));

          toast.success('Profile updated successfully!');
        } catch (error: any) {
          console.error('Update profile error:', error);
          const errorMessage = error.message || 'Failed to update profile';

          // Show toast notification for profile update failure
          set(state => ({
            ...state,
            toast: {
              ...state.toast,
              show: true,
              type: 'error',
              message: errorMessage,
              duration: 3000
            }
          }));

          // Auto hide toast after duration
          setTimeout(() => {
            set(state => ({
              ...state,
              toast: {
                ...state.toast,
                show: false
              }
            }));
          }, 3000);

          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      showToast: (type, message, duration = 3000) => {
        set({
          toast: {
            show: true,
            type,
            message,
            duration
          }
        });
        // Auto hide toast after duration
        setTimeout(() => {
          set(state => ({
            ...state,
            toast: {
              ...state.toast,
              show: false
            }
          }));
        }, duration);
      },

      hideToast: () => {
        set(state => ({
          ...state,
          toast: {
            ...state.toast,
            show: false
          }
        }));
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useAuthStore;