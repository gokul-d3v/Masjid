import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Using backend server for all environments
const BASE_URL = 'https://masjid-backend-rn3t.onrender.com';  // Production

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
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Handle unauthorized or forbidden (logout user)
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
    addMoneyCollection: (data: any) => {
        // Ensure amount is properly formatted as a number
        const formattedData = {
            ...data,
            amount: parseFloat(data.amount) || 0,
            // Ensure required collectedBy field is present
            collectedBy: data.collectedBy || data.collected_by || 'Admin'
        };
        return api.post('/dashboard/money-collection', formattedData);
    },
    updateMoneyCollection: (id: string, data: any) => {
        // Ensure amount is properly formatted as a number
        const formattedData = {
            ...data,
            amount: parseFloat(data.amount) || 0
        };
        return api.put(`/dashboard/money-collection/${id}`, formattedData);
    },
    deleteMoneyCollection: (id: string) => api.delete(`/dashboard/money-collection/${id}`),
    getMayyathuData: () => api.get('/dashboard/mayyathu'),
    getMonthlyDonations: () => api.get('/dashboard/monthly-donations'),
};

export const memberService = {
    getAll: () => api.get('/members'),
    getById: (id: string) => api.get(`/members/${id}`),
    create: (data: any) => {
        // Ensure required fields are properly formatted according to MembersController
        const formattedData = {
            ...data,
            age: parseInt(data.age) || 0,
            phone: data.phone?.toString() || '',
            adharNumber: data.adharNumber?.toString() || '',
            registrationNumber: data.registrationNumber || '',
            familyMembersCount: data.familyMembers ? data.familyMembers.length : 0,
            // Format family members to ensure age is a number
            familyMembers: data.familyMembers?.map((fm: any) => ({
                ...fm,
                age: parseInt(fm.age) || 0
            }))
        };
        return api.post('/members', formattedData);
    },
    update: (id: string, data: any) => {
        // Ensure required fields are properly formatted according to MembersController
        const { registrationNumber, ...updateData } = data; // Exclude registration number from updates
        const formattedData = {
            ...updateData,
            age: parseInt(updateData.age) || 0,
            phone: updateData.phone?.toString() || '',
            adharNumber: updateData.adharNumber?.toString() || '',
            familyMembersCount: updateData.familyMembers ? updateData.familyMembers.length : 0,
            // Format family members to ensure age is a number
            familyMembers: updateData.familyMembers?.map((fm: any) => ({
                ...fm,
                age: parseInt(fm.age) || 0
            }))
        };
        return api.put(`/members/${id}`, formattedData);
    },
    updateMayyathuStatus: (id: string, status: boolean) => api.patch(`/members/${id}/mayyathu-status`, { mayyathuStatus: status }),
    delete: (id: string) => api.delete(`/members/${id}`),
};

export const userService = {
    getAll: () => api.get('/users'),
    getById: (id: string) => api.get(`/users/${id}`),
    create: (data: any) => {
        // Ensure the data is properly formatted
        const formattedData = {
            ...data,
            familyMembersCount: data.familyMembersCount ? parseInt(data.familyMembersCount) : undefined
        };
        return api.post('/users', formattedData);
    },
    update: (id: string, data: any) => {
        // Ensure the data is properly formatted
        const formattedData = {
            ...data,
            familyMembersCount: data.familyMembersCount ? parseInt(data.familyMembersCount) : undefined
        };
        return api.put(`/users/${id}`, formattedData);
    },
    delete: (id: string) => api.delete(`/users/${id}`),
};

export const profileService = {
    update: (data: any) => api.put('/profile', data),
};

export const dataService = {
    getAll: () => api.get('/data/data'),
    getById: (id: string) => api.get(`/data/data/${id}`),
    create: (data: any) => api.post('/data/data', data),
    update: (id: string, data: any) => api.put(`/data/data/${id}`, data),
    delete: (id: string) => api.delete(`/data/data/${id}`),
};

export default api;
