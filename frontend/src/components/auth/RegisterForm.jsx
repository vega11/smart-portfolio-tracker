// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { register as registerApi } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerApi(userData);
      console.log('Registration successful:', response.data.message);

      // Clear the form fields
      setUserData({ username: '', email: '', password: '' });

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;