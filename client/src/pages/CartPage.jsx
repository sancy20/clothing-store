import React from "react";
import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import {
  IoRemoveOutline,
  IoAddOutline,
  IoTrashOutline,
  IoChevronBackOutline,
} from "react-icons/io5";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className='container mx-auto max-w-4xl p-4 md:p-8'>
      <div className='flex justify-between items-center mb-6'>
        <Link
          to='/collection'
          className='flex items-center text-sm text-black hover:text-gray-500'
        >
          <IoChevronBackOutline className='mr-1' />
          Continue Shopping
        </Link>
        <span className='text-md font-semibold'>
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
        </span>
      </div>

      {cartItems.length === 0 ? (
        <p className='text-center text-gray-500 py-20'>Your cart is empty.</p>
      ) : (
        <div className='border-t border-gray-200'>
          {cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className='flex items-center justify-between border-b border-gray-200 py-4'
            >
              <div className='flex items-center space-x-4'>
                {/* Product Image */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className='w-20 h-20 object-cover rounded-md'
                />
                <div>
                  <h3 className='font-semibold text-lg'>{item.name}</h3>
                  {/* Color and Size Details */}
                  <p className='text-sm text-gray-600'>Color: {item.color}</p>
                  <p className='text-sm text-gray-600'>Size: {item.size}</p>
                  <p className='text-sm text-black font-bold'>${item.price}</p>
                </div>
              </div>

              <div className='flex items-center space-x-4'>
                <div className='flex items-center border border-gray-300 rounded-md'>
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity - 1)
                    }
                    className='w-8 h-8 flex items-center justify-center hover:bg-gray-100'
                  >
                    <IoRemoveOutline />
                  </button>
                  <span className='text-md font-medium w-8 text-center'>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity + 1)
                    }
                    className='w-8 h-8 flex items-center justify-center hover:bg-gray-100'
                  >
                    <IoAddOutline />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className='w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100'
                >
                  <IoTrashOutline />
                </button>
              </div>
            </div>
          ))}
          <div className='mt-6 flex justify-end'>
            <div className='w-full max-w-sm'>
              <div className='flex justify-between font-semibold text-lg'>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className='text-xs text-gray-500 mt-1 text-right'>
                Tax included. Shipping calculated at checkout.
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className='w-full mt-4 bg-black text-white py-3 rounded-md hover:bg-gray-800 font-semibold'
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
