// Centralized API configuration
// In development: Uses localhost (from .env or default)
// In production: Uses VITE_API_URL from Vercel environment variables
const isDevelopment = import.meta.env.MODE === 'development';
const defaultUrl = isDevelopment ? 'http://localhost:3000' : 'https://luxurycars-6iif.onrender.com';

export const API_URL = import.meta.env.VITE_API_URL || defaultUrl;
