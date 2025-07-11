import React from "react";

const AdminUserTable = ({ users }) => {
  return (
    <div className='bg-gray-800 shadow-lg rounded-lg overflow-x-auto'>
      <table className='w-full text-sm text-left text-gray-300'>
        <thead className='text-xs text-gray-400 uppercase bg-gray-700'>
          <tr>
            <th className='px-6 py-3'>User ID</th>
            <th className='px-6 py-3'>Name</th>
            <th className='px-6 py-3'>Email</th>
            <th className='px-6 py-3'>Role</th>
            <th className='px-6 py-3'>Joined</th>
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
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "admin"
                      ? "bg-green-500 text-green-100"
                      : "bg-blue-500 text-blue-100"
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
  );
};

export default AdminUserTable;
