import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userData = await apiLogin(formData);

      if (userData) {
        setAuthUser(userData);
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden'>
        {/* Form Section */}
        <div className='w-full md:w-1/2 p-8 md:p-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>
            Welcome Back
          </h2>
          <p className='text-gray-500 mb-8'>Login to continue to TRINITY.</p>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <p className='text-red-500 text-sm bg-red-100 p-3 rounded-md'>
                {error}
              </p>
            )}
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
              Login
            </button>
          </form>
          <p className='text-sm text-center text-gray-500 mt-6'>
            Don't have an account?{" "}
            <Link
              to='/register'
              className='font-medium text-black hover:underline'
            >
              Register here
            </Link>
          </p>
        </div>
        {/* Image Section */}
        <div className='w-full md:w-1/2 hidden md:block'>
          <img
            src='https://i.pinimg.com/736x/46/dc/3b/46dc3b30e16f72c6aa8857d6dde87971.jpg'
            alt='Fashion model'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
