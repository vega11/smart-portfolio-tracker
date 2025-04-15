// src/services/auth.js
import { login as apiLogin, register as apiRegister } from './api';
import { jwtDecode } from 'jwt-decode';

/**
 * Logs in the user and saves the JWT token.
 * @param {Object} credentials - User credentials (e.g., username and password).
 * @returns {Promise<Object>} - Decoded JWT payload or error.
 */
export const login = async (credentials) => {
  try {
    const response = await apiLogin(credentials);
    console.log('Login API response:', response.data); // Log the API response

    const token = response.data.token;

    // Decode JWT token to extract user information
    const decodedUser = jwtDecode(token);
    console.log('Decoded user:', decodedUser); // Log the decoded user

    // Save token to localStorage
    localStorage.setItem('token', token);

    return { token, user: decodedUser }; // Return both token and decoded user data
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error; // Re-throw the error for handling in components
  }
};

/**
 * Registers a new user.
 * @param {Object} userData - User registration data (e.g., username, email, password).
 * @returns {Promise<Object>} - Registration success message or error.
 */
export const register = async (userData) => {
  try {
    const response = await apiRegister(userData);
    return response.data; // Success message
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error; // Re-throw the error for handling in components
  }
};

/**
 * Decodes a JWT token to extract user information.
 * @param {string} token - JWT token.
 * @returns {Object|null} - Decoded token payload or null if invalid.
 */
export const decodeToken = (token) => {
  try {
    return jwtDecode(token); // Use the named export
  } catch (error) {
    console.error('Failed to decode token:', error.message);
    return null;
  }
};

