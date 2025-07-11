import React from "react";

const AdminOrderTable = ({ orders, onStatusChange }) => {
  const orderStatuses = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className='bg-gray-800 shadow-lg rounded-lg overflow-x-auto'>
      <table className='w-full text-sm text-left text-gray-300'>
        <thead className='text-xs text-gray-400 uppercase bg-gray-700'>
          <tr>
            <th className='px-6 py-3'>Order ID</th>
            <th className='px-6 py-3'>Customer</th>
            <th className='px-6 py-3'>Date</th>
            <th className='px-6 py-3'>Total</th>
            <th className='px-6 py-3'>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className='border-b border-gray-700 hover:bg-gray-600'
            >
              <td className='px-6 py-4 font-medium text-white'>{order.id}</td>
              <td className='px-6 py-4'>{order.User?.name || "N/A"}</td>
              <td className='px-6 py-4'>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className='px-6 py-4'>${order.total_price}</td>
              <td className='px-6 py-4'>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className='p-2 bg-gray-700 rounded border border-gray-600 text-white'
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status} className='capitalize'>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderTable;
