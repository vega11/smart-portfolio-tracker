// src/components/auth/LogoutButton.jsx
import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout(); // Clear token and user data
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred while logging out. Please try again.');
    }
  };

  return (
    <button onClick={handleLogout} style={{ marginLeft: 'auto', display: 'block' }}>
      Logout
    </button>
  );
};

export default LogoutButton;