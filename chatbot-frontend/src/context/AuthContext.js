// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access)
      : null
  );

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
      axiosInstance.defaults.headers['Authorization'] =
        'Bearer ' + authTokens.access;
    }
  }, [authTokens]);

  const loginUser = async (username, password) => {
    try {
      const response = await axiosInstance.post('/dj-rest-auth/login/', {
        username,
        password,
      });

      if (response.data.access) {
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        axiosInstance.defaults.headers['Authorization'] =
          'Bearer ' + response.data.access;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const registerUser = async (username, email, password1, password2) => {
    try {
      const response = await axiosInstance.post(
        '/dj-rest-auth/registration/',
        {
          'username': username,
          "email": email,
          "password1": password1,
          "password2": password2,
        }
      );

      if (response.data.access) {
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        axiosInstance.defaults.headers['Authorization'] =
          'Bearer ' + response.data.access;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await axiosInstance.post('/dj-rest-auth/logout/');
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem('authTokens');
      delete axiosInstance.defaults.headers['Authorization'];
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, authTokens, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
