import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

// Auth endpoints
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);

export const getAssets = () => api.get('/assets');
export const addAsset = (assetData) => api.post('/assets', assetData);
export const updateAsset = (id, assetData) => api.put(`/assets/${id}`, assetData);
export const deleteAsset = (id) => api.delete(`/assets/${id}`);
export const getUsers = () => api.get('/users');
export const addUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getRequests = () => api.get('/requests');
export const addRequest = (requestData) => api.post('/requests', requestData);
export const updateRequest = (id, status) => api.put(`/requests/${id}`, { status });
export const getReports = () => api.get('/reports');
export const generateReport = () => api.post('/reports');
export const getLocations = () => api.get('/lookup/locations');
export const getCategories = () => api.get('/lookup/categories');
export const getSuppliers = () => api.get('/lookup/suppliers');

export default api;