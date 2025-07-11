import React from "react";
import { Link } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const OrderSuccessPage = () => {
  return (
    <div className='flex items-center justify-center text-center py-20 bg-gray-50 min-h-[60vh]'>
      <div className='bg-white p-10 rounded-lg shadow-md max-w-lg'>
        <IoCheckmarkCircleOutline className='mx-auto text-6xl text-green-500' />
        <h2 className='text-3xl font-bold text-gray-800 mt-6'>
          Order Placed Successfully!
        </h2>
        <p className='text-gray-600 mt-2'>
          Thank you for your purchase. You can view your order details and
          status in your dashboard.
        </p>
        <div className='mt-8 space-x-4'>
          <Link
            to='/collection'
            className='inline-block px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
          >
            Continue Shopping
          </Link>
          <Link
            to='/dashboard/orders'
            className='inline-block px-6 py-3 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-colors'
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
