import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      await register(formData);
      navigate("/"); // Redirect without reloading
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden'>
        {/* Form Section */}
        <div className='w-full md:w-1/2 p-8 md:p-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>
            Create an Account
          </h2>
          <p className='text-gray-500 mb-8'>Join the TRINITY. community.</p>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <p className='text-red-500 text-sm bg-red-100 p-3 rounded-md'>
                {error}
              </p>
            )}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Full Name
              </label>
              <input
                type='text'
                name='name'
                id='name'
                required
                className='w-full px-4 py-2 mt-1 text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email Address
              </label>
              <input
                type='email'
                name='email'
                id='email'
                required
                className='w-full px-4 py-2 mt-1 text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                required
                className='w-full px-4 py-2 mt-1 text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type='submit'
              className='w-full py-3 font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-colors'
            >
              Create Account
            </button>
          </form>
          <p className='text-sm text-center text-gray-500 mt-6'>
            Already have an account?{" "}
            <Link
              to='/login'
              className='font-medium text-black hover:underline'
            >
              Login here
            </Link>
          </p>
        </div>
        {/* Image Section */}
        <div className='w-full md:w-1/2 hidden md:block'>
          <img
            src='https://i.pinimg.com/736x/18/44/f0/1844f0550592e46ff7cdf242df0cc917.jpg'
            alt='Fashion model'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
