// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chatbot from './components/Chatbot';
import AuthContext from './context/AuthContext';
import { useContext } from 'react';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? children : <Login />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
