import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../services/userService";

const UserInfoPage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile();
        setUser({ name: profile.name, email: profile.email });
      } catch (err) {
        setError("Failed to fetch user information.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleInfoChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const updatedUser = await updateUserProfile({
        name: user.name,
        email: user.email,
      });
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    try {
      await updateUserProfile(passwordData);
      setSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  if (loading) return <p>Loading your information...</p>;

  return (
    <div className='space-y-8 max-w-2xl mx-auto'>
      {error && (
        <p className='text-red-500 bg-red-100 p-3 rounded-md'>{error}</p>
      )}
      {success && (
        <p className='text-green-500 bg-green-100 p-3 rounded-md'>{success}</p>
      )}

      {/* Update Information Form */}
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6'>My Information</h2>
        <form onSubmit={handleInfoSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <input
              type='text'
              name='name'
              value={user.name}
              onChange={handleInfoChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              value={user.email}
              onChange={handleInfoChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black'
            />
          </div>
          <div className='text-right'>
            <button
              type='submit'
              className='bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6'>Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Current Password
            </label>
            <input
              type='password'
              name='currentPassword'
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              New Password
            </label>
            <input
              type='password'
              name='newPassword'
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black'
            />
          </div>
          <div className='text-right'>
            <button
              type='submit'
              className='bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800'
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfoPage;
