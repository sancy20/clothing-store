import React, { useState, useEffect } from "react";
import { getMyOrders } from "../services/orderService";
import { Link } from "react-router-dom";
import { IoCubeOutline } from "react-icons/io5";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className='text-center p-8'>Loading your orders...</p>;
  if (error) return <p className='text-center text-red-500 p-8'>{error}</p>;

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>My Orders</h1>
      {orders.length === 0 ? (
        <div className='text-center py-16 px-6 bg-white rounded-lg shadow-md'>
          <IoCubeOutline className='mx-auto text-5xl text-gray-300' />
          <p className='text-gray-500 text-lg mt-4'>
            You haven't placed any orders yet.
          </p>
          <Link
            to='/collection'
            className='mt-6 inline-block px-8 py-3 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-colors'
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className='space-y-8'>
          {orders.map((order) => (
            <div
              key={order.id}
              className='bg-white p-6 rounded-lg shadow-md border border-gray-200'
            >
              <div className='flex flex-wrap justify-between items-start mb-4 border-b border-gray-200 pb-4'>
                <div className='space-y-1'>
                  <p className='text-sm text-gray-500'>
                    Order Placed:{" "}
                    <span className='font-medium text-gray-700'>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className='text-sm text-gray-500'>
                    Order Total:{" "}
                    <span className='font-bold text-gray-800'>
                      ${parseFloat(order.total_price).toFixed(2)}
                    </span>
                  </p>
                  <p className='text-sm text-gray-500'>
                    Order #:{" "}
                    <span className='font-mono text-gray-700 bg-gray-100 px-1 rounded'>
                      {order.id}
                    </span>
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold capitalize px-3 py-1 rounded-full mt-2 md:mt-0 ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "paid"
                      ? "bg-indigo-100 text-indigo-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </div>
              </div>

              <div className='space-y-4'>
                {order.orderItems.map((item) => (
                  <Link
                    to={`/product/${item.productId}`}
                    key={item.id}
                    className='flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50'
                  >
                    <img
                      src={
                        item.product?.image_url ||
                        "https://placehold.co/100x100"
                      }
                      alt={item.product?.name}
                      className='w-20 h-20 object-cover rounded-md border'
                    />
                    <div className='flex-grow'>
                      <p className='font-semibold text-gray-800'>
                        {item.product?.name}
                      </p>
                      <p className='text-sm text-gray-500'>
                        Color: {item.color_at_purchase}
                      </p>
                      <p className='text-sm text-gray-500'>
                        Size: {item.size_at_purchase}
                      </p>
                      <p className='text-sm text-gray-500'>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-800'>
                        ${parseFloat(item.price_at_purchase).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
