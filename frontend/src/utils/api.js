import axios from 'axios';

// Vite replaces these at build time.
// Local: http://localhost:5001/api
// Production build: Render backend
const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? 'https://hgenterprises.onrender.com/api'
        : 'http://localhost:5001/api')
).replace(/\/$/, '');

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('hg_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;
