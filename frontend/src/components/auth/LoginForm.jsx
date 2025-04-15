

//LoginForm.jsx

import React, { useState } from 'react';
import { login as apiLogin } from '../../services/api'; // Import the correct function
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a flag to track submission

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (isSubmitting) {
      console.warn('Already submitting. Ignoring duplicate request.');
      return;
    }

    try {
      setIsSubmitting(true); // Set submitting flag to true

      // Log the credentials being sent
      console.log('Sending credentials:', credentials);

      // Ensure credentials are not empty
      if (!credentials.username || !credentials.password) {
        console.error('Missing username or password');
        return;
      }

      const response = await apiLogin(credentials); // Call the login function from api.js
      console.log('Backend response:', response);

      // Pass the access_token to AuthContext's login function
      login(response.data.access_token); // Use response.data.access_token

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Improve error handling to log more details
      if (error.response) {
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error details:', error.message);
      }
    } finally {
      setIsSubmitting(false); // Reset submitting flag after completion
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;