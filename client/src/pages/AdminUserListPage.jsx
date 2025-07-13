import React, { useState, useEffect } from "react";
import { getAllUsers, updateUserProfile } from "../services/userService";
import { IoPencil } from "react-icons/io5";

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("customer");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsModalOpen(true);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUserProfile(editingUser.id, { role: selectedRole });
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user role.");
    }
  };

  if (loading) return <p className='text-center'>Loading users...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Customer Management</h1>
      <div className='bg-gray-800 shadow-lg rounded-lg overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-300'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-700'>
            <tr>
              <th className='px-6 py-3'>User ID</th>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Email</th>
              <th className='px-6 py-3'>Role</th>
              <th className='px-6 py-3'>Joined On</th>
              <th className='px-6 py-3'>Actions</th>{" "}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className='border-b border-gray-700 hover:bg-gray-600'
              >
                <td className='px-6 py-4 font-medium text-white'>{user.id}</td>
                <td className='px-6 py-4'>{user.name}</td>
                <td className='px-6 py-4'>{user.email}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      user.role === "admin"
                        ? "bg-green-600 text-green-100"
                        : "bg-blue-600 text-blue-100"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4'>
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className='text-yellow-400 hover:text-yellow-300'
                    title='Edit Role'
                  >
                    <IoPencil />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingUser && (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
          <div className='bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md'>
            <h2 className='text-2xl font-bold mb-4'>
              Edit Role for {editingUser.name}
            </h2>
            <p className='text-sm text-gray-400 mb-6'>{editingUser.email}</p>
            <form onSubmit={handleRoleSubmit}>
              <label htmlFor='role' className='block mb-2 text-sm font-medium'>
                Role
              </label>
              <select
                id='role'
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className='w-full p-2 bg-gray-700 rounded'
              >
                <option value='customer'>Customer</option>
                <option value='admin'>Admin</option>
              </select>
              <div className='flex justify-end space-x-4 pt-6'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700'
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserListPage;
