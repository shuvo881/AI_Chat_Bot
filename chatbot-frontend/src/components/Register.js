import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate(); // Correctly call useNavigate at the top level

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic form validation
    if (!username || !email || !password1 || !password2) {
      toast.error('All fields are required.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (password1 !== password2) {
      toast.error('Passwords do not match.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const isSuccess = await registerUser(username, email, password1, password2);

    if (isSuccess) {
      toast.success('Registration successful! Redirecting to login...', {
        position: 'top-right',
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after successful registration
      }, 3000);
    } else {
      toast.error('Registration failed! Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-2 mb-4 w-full"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mb-4 w-full"
        />

        <input
          type="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          placeholder="Password"
          className="border p-2 mb-4 w-full"
        />

        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Confirm Password"
          className="border p-2 mb-4 w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mb-4"
        >
          Register
        </button>

        <div className="text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Register;
