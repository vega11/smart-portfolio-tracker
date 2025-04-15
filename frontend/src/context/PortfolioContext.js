// src/context/PortfolioContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getPortfolio as apiGetPortfolio, addAsset as apiAddAsset } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state for better UX
  const [error, setError] = useState(null); // Add error state for error handling

  /**
   * Fetches the user's portfolio from the backend.
   */
  const fetchPortfolio = useCallback(async () => {
    if (!token) {
      console.warn('No token found. User is not authenticated.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiGetPortfolio(token);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error.response?.data || error.message);
      setError('Failed to load portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  /**
   * Adds a new asset to the user's portfolio.
   * @param {Object} assetData - Asset details to add.
   */
  const addAssetToPortfolio = async (assetData) => {
    if (!token) {
      console.warn('No token found. User is not authenticated.');
      return;
    }

    try {
      const response = await apiAddAsset(token, assetData);
      console.log('Asset added successfully:', response.data);

      // Update the portfolio state after adding the asset
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to add asset:', error.response?.data || error.message);
      setError('Failed to add asset. Please try again.');
    }
  };

  // Fetch portfolio on component mount
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]); // Include fetchPortfolio in the dependency array

  return (
    <PortfolioContext.Provider value={{ portfolio, addAssetToPortfolio, loading, error }}>
      {children}
    </PortfolioContext.Provider>
  );
};