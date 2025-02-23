import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl shadow-lg text-center border border-gray-700">
        <h1 className="text-3xl font-bold text-gray-100">
          Welcome to <span className="text-yellow-400">Missive</span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 text-gray-200 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 text-gray-200 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password & Signup Link */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <Link to="/signup" className="hover:text-yellow-400 transition">
              Don't have an account?
            </Link>
            {/* <Link to="/forgot-password" className="hover:text-yellow-400 transition">
              Forgot Password?
            </Link> */}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
