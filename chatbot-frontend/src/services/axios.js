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

// Response Interceptor to handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => response,  // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Handle cases where there's no response (e.g., network errors)
    if (!error.response) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors (Token expired)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Mark request as retry

      const authTokens = localStorage.getItem('authTokens')
        ? JSON.parse(localStorage.getItem('authTokens'))
        : null;

      const refreshToken = authTokens ? authTokens.refresh : null;

      // Check if refreshToken exists
      if (refreshToken) {
        try {
          const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });

          // Save new tokens in localStorage
          localStorage.setItem('authTokens', JSON.stringify(response.data));

          // Update Authorization header with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } catch (err) {
          // Refresh token failed, clear tokens and redirect to login
          localStorage.removeItem('authTokens');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('authTokens');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
