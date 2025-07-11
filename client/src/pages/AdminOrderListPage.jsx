import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../services/orderService";

const AdminOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh the list to show the updated status
      fetchOrders();
    } catch (err) {
      setError("Failed to update order status.");
    }
  };

  const orderStatuses = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (loading) return <p className='text-center'>Loading orders...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Order Management</h1>
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
                <td className='px-6 py-4 font-medium text-white'>
                  #{order.id}
                </td>
                <td className='px-6 py-4'>{order.User?.name || "N/A"}</td>
                <td className='px-6 py-4'>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4'>
                  ${parseFloat(order.total_price).toFixed(2)}
                </td>
                <td className='px-6 py-4'>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className='p-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  >
                    {orderStatuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className='capitalize'
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderListPage;
