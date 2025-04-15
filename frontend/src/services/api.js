

// src/services/api.js
import axios from 'axios';

// Create the Axios client with global configuration
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5001', // Ensure this matches your backend URL
  headers: { 'Content-Type': 'application/json' }, // Set Content-Type globally
});

// Add request interceptors for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request Headers:', config.headers);
    console.log('Request Payload:', config.data);

    // Warn if the payload is missing
    if (!config.data) {
      console.warn('Request has no payload:', config);
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptors for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response Data:', response.data); // Log the response data
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Export API functions
export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials); // Send credentials to /auth/login
};

export const register = (userData) => {
  return apiClient.post('/auth/register', userData); // Send user data to /auth/register
};

export const getPortfolio = (token) => {
  return apiClient.get('/portfolio/view', {
    headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
  });
};

export const addAsset = (token, assetData) => {
    return apiClient.post('/portfolio/add', assetData, {
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
    });
  };
  
  export const sellAsset = (token, assetData) => {
    return apiClient.post('/portfolio/sell', assetData, {
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
    });
  };