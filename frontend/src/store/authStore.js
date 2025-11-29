// authStore.js
import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  // Actions
  login: async (email, password) => {
    try {
      // This would call your authService
      // const response = await authService.login({ email, password });
      // For now, simulating the login process
      set({
        user: { id: 1, email, name: 'Admin' },
        token: 'mock-token', // In real app, use response.token
        isAuthenticated: true,
        loading: false,
      });
      
      return { success: true };
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