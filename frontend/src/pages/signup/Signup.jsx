import { Link } from 'react-router-dom';
import { useState } from 'react';
import useSignup from '../../hooks/useSignup';
import GenderCheck from './GenderCheck';

const Signup = () => {
  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const { loading, signup } = useSignup();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    await signup(inputs);
  };

  const checkboxHandler = (gender) => {
    setInputs({ ...inputs, gender });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-100">
          Sign Up to <span className="text-yellow-500">Missive</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              value={inputs.fullName}
              name="fullName"
              onChange={handleChange}
            />
            {formSubmitted && !inputs.fullName && <p className="text-red-500 text-xs">Full Name is required</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm font-medium">Username</label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              name="username"
              value={inputs.username}
              onChange={handleChange}
            />
            {formSubmitted && !inputs.username && <p className="text-red-500 text-xs">Username is required</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            {formSubmitted && !inputs.password && <p className="text-red-500 text-xs">Password is required</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
              name="confirmPassword"
              value={inputs.confirmPassword}
              onChange={handleChange}
            />
            {formSubmitted && inputs.password !== inputs.confirmPassword && (
              <p className="text-red-500 text-xs">Passwords do not match</p>
            )}
          </div>

          {/* Gender Selection */}
          <GenderCheck onCheckboxChange={checkboxHandler} selectedGender={inputs.gender} />
          {formSubmitted && !inputs.gender && <p className="text-red-500 text-xs">Please select a gender</p>}

          {/* Already have an account? */}
          <Link to="/login" className="block text-sm text-center text-blue-400 hover:underline">
            Already have an account?
          </Link>

          {/* Sign Up Button */}
          <button
            className="w-full py-2 mt-2 text-white font-semibold rounded-lg bg-yellow-500 hover:bg-yellow-600 transition duration-300"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
