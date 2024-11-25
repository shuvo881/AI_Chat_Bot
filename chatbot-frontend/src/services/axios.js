import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';  // Fallback URL if not provided

const axiosInstance = axios.create({
  baseURL: baseURL,  // Use the API base URL from .env or fallback
  timeout: 5000,  // 5 seconds timeout for API requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor to attach tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null;

    // If tokens exist, add Authorization header
    if (authTokens) {
      config.headers['Authorization'] = `Bearer ${authTokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default axiosInstance;
