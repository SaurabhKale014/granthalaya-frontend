
import React, { useState } from 'react';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ THIS IS THE CORRECTED FUNCTION FOR YOUR API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // The API call is the same
      const response = await api.post('/login/', formData);
      
      const { access, refresh } = response.data;

      // Check for the essential access token
      if (!access) {
        throw new Error('Invalid response from server. Missing access token.');
      }

      // Manually construct the user object from the API's flat response.
      // Notice we are using `response.data.Email` to match your API's casing.
      const user = {
        id: response.data.id,
        email: response.data.Email, // <-- Matches your API response key
        first_name: response.data.first_name,
        // Add last_name if it exists, otherwise it will be undefined (which is fine)
        last_name: response.data.last_name, 
        is_admin: response.data.is_admin,
      };

      // Store tokens in localStorage
      localStorage.setItem('accessToken', access);
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }
      
      // Store the newly constructed user object
      localStorage.setItem('user', JSON.stringify(user));
      
      // Pass the complete user object to App.js to trigger the redirect
      onLogin(user);
      
    } catch (err) {
      let errorMessage = 'Login failed. Please check your credentials.';
      // Use a more specific error message from the backend if it exists
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      setError(errorMessage);
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES AND JSX (No changes needed here) ---
  const containerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', backgroundColor: '#f0f2f5',
  };
  const formWrapperStyle = {
    padding: '40px', maxWidth: '400px', width: '100%',
    margin: '0 auto', backgroundColor: 'white', borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center',
  };
  const inputStyle = {
    width: '100%', padding: '12px', margin: '10px 0',
    borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box',
  };
  const buttonStyle = {
    width: '100%', padding: '12px', margin: '10px 0',
    border: 'none', borderRadius: '4px', backgroundColor: '#4e73df',
    color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
    opacity: loading ? 0.7 : 1,
  };
  const errorStyle = { color: '#e74a3b', margin: '10px 0' };

  return (
    <div style={containerStyle}>
      <div style={formWrapperStyle}>
        <h2>Welcome to Granthalaya</h2>
        <p>Please sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            style={inputStyle}
          />
          {error && <p style={errorStyle}>{error}</p>}
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;