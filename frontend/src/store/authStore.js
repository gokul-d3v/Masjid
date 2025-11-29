// authStore.js
import { create } from 'zustand';
import { authService } from '../services/authService';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  // Actions
  login: async (email, password) => {
    try {
      const response = await authService.login({ email, password });

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true, user: response.user };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  },

  initializeAuth: async () => {
    // Check if user is already logged in (from async storage)
    // For now, we'll just set loading to false
    set({ loading: false });
  },
}));

export default useAuthStore;