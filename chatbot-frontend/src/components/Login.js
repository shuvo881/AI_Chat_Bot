import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate(); // useNavigate to redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      // Validate form inputs
      toast.error('Please fill in both fields.');
      return;
    }

    setLoading(true); // Start loading state

    const isLoginSuccessful = await loginUser(username, password);

    setLoading(false); // Stop loading state

    if (isLoginSuccessful) {
      // Show success toast and redirect
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/'); // Redirect to dashboard (or any other route)
      }, 1500); // Give time for the toast to be shown
    } else {
      // Show error toast on login failure
      toast.error('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-2 mb-4 w-full"
          disabled={loading} // Disable input while loading
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 mb-4 w-full"
          disabled={loading} // Disable input while loading
        />

        <button
          type="submit"
          className={`bg-blue-500 text-white py-2 px-4 rounded-lg w-full mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Logging in...' : 'Login'} {/* Show loader text */}
        </button>

        <div className="text-center">
          {/* Link to the Register page */}
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </form>

      {/* Add the ToastContainer to render toasts */}
      <ToastContainer />
    </div>
  );
};

export default Login;