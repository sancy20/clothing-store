import React, { useState, useEffect } from "react";
import { getAllUsers } from "../services/userService";

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchUsers();
  }, []);

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserListPage;
