// src/components/forms/SellAssetForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellAsset } from '../../services/api';

const SellAssetForm = () => {
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.symbol.trim()) newErrors.symbol = 'Asset symbol is required.';
    if (!formData.quantity || isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0)
      newErrors.quantity = 'Quantity must be a positive number.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // Retrieve JWT token
      if (!token) {
        throw new Error('User not authenticated.');
      }

      const response = await sellAsset(token, formData); // Pass token explicitly
      console.log('Asset sold successfully:', response.data);

      setFormData({
        symbol: '',
        quantity: '',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to sell asset:', error.response?.data || error.message);
      alert('Failed to sell asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sell Asset</h2>
      <form onSubmit={handleSubmit}>
        {/* Symbol Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="symbol">Asset Symbol:</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="e.g., BTC, ETH"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {errors.symbol && <p style={{ color: 'red', fontSize: '12px' }}>{errors.symbol}</p>}
        </div>

        {/* Quantity Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="quantity">Quantity to Sell:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 2.5"
            step="0.01"
            min="0"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {errors.quantity && <p style={{ color: 'red', fontSize: '12px' }}>{errors.quantity}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#FF6384',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Selling Asset...' : 'Sell Asset'}
        </button>
      </form>
    </div>
  );
};

export default SellAssetForm;