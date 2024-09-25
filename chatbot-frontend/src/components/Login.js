// src/components/Login.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(username, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-2 mb-4 w-full"
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 mb-4 w-full"
        />
        
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mb-4"
        >
          Login
        </button>

        <div className="text-center">
          {/* Link to the Register page */}
          <p className="text-sm">
            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
