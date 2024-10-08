import React, { createContext, useState } from 'react';
import axiosInstance from '../services/axios';
import { jwtDecode } from 'jwt-decode'; // Correct import for named export

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(
    localStorage.getItem('authTokens')
      ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access)
      : null
  );

  const loginUser = async (username, password) => {
    try {
      const response = await axiosInstance.post('/token/', { username, password });

      if (response.data.access) {
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access)); // Decode access token
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        return true; // Return success
      } else {
        return false; // Return failure
      }
    } catch (error) {
      console.error('Login failed', error);
      return false; // Return failure on error
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const response = await axiosInstance.post('/register/', {
        username,
        email,
        password,
      });

      if (response.data.access) {
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access)); // Decode access token
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        return true; // Return success
      } else {
        return false; // Return failure
      }
    } catch (error) {
      console.error('Registration failed', error);
      return false; // Return failure on error
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };

  return (
    <AuthContext.Provider value={{ user, authTokens, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;