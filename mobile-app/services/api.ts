import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Configuration
// Temporarily using local backend until Render deploys CORS fix
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://192.168.25.60:5000';

// For production (Render), use this instead:
// const BASE_URL = 'https://masjid-backend-rn3t.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config: any) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized (logout user)
            await AsyncStorage.removeItem('token');
            // You might want to navigate to login screen here or emit an event
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
    resetPassword: (data: any) => api.post('/auth/reset-password', data),
};

export const dashboardService = {
    getStats: () => api.get('/dashboard/stats'),
    getRecentActivities: () => api.get('/dashboard/recent-activities'),
    getMoneyCollections: () => api.get('/dashboard/money-collection'),
    addMoneyCollection: (data: any) => api.post('/dashboard/money-collection', data),
    updateMoneyCollection: (id: string, data: any) => api.put(`/dashboard/money-collection/${id}`, data),
    deleteMoneyCollection: (id: string) => api.delete(`/dashboard/money-collection/${id}`),
    getMayyathuData: () => api.get('/dashboard/mayyathu'),
    getMonthlyDonations: () => api.get('/dashboard/monthly-donations'),
};

export const memberService = {
    getAll: () => api.get('/members'),
    getById: (id: string) => api.get(`/members/${id}`),
    create: (data: any) => api.post('/members', data),
    update: (id: string, data: any) => api.put(`/members/${id}`, data),
    updateMayyathuStatus: (id: string, status: boolean) => api.patch(`/members/${id}/mayyathu-status`, { mayyathuStatus: status }),
    delete: (id: string) => api.delete(`/members/${id}`),
};

export const userService = {
    getAll: () => api.get('/users/users'),
    getById: (id: string) => api.get(`/users/users/${id}`),
    create: (data: any) => api.post('/users/users', data),
    update: (id: string, data: any) => api.put(`/users/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/users/${id}`),
};

export const profileService = {
    update: (data: any) => api.put('/profile', data),
};

export default api;
