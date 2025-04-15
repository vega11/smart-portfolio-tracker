// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { decodeToken } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Decode token to extract user information
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        console.log('Decoded user:', decodedUser); // Log the decoded user
        setUser(decodedUser);
      } else {
        console.error('Invalid token. Logging out.');
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  /**
   * Logs in the user and saves the token.
   * @param {string} accessToken - JWT access token.
   */
  const login = (accessToken) => {
    try {
      // Save token to localStorage
      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      // Decode token to extract user information
      const decodedUser = decodeToken(accessToken);
      if (decodedUser) {
        console.log('Decoded user after login:', decodedUser); // Log the decoded user
        setUser(decodedUser);
      } else {
        throw new Error('Failed to decode token.');
      }
    } catch (error) {
      console.error('Failed to decode token:', error.message);
      throw error;
    }
  };

  /**
   * Logs out the user by clearing the token and user data.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};