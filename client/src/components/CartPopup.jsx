import React, { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import { IoRemoveOutline, IoAddOutline, IoCloseOutline } from "react-icons/io5";

const CartPopup = () => {
  const { cartItems, isCartOpen, closeCart, updateQuantity } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      closeCart();
    }, 300);
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isCartOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black z-50 flex justify-end transition-opacity duration-300 ${
        isVisible ? "bg-opacity-50" : "bg-opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-md h-full bg-white text-black flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold'>Cart</h2>
          <button onClick={handleClose} className='hover:text-gray-500'>
            <IoCloseOutline size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className='flex-grow flex items-center justify-center'>
            <p className='text-gray-500'>Your cart is empty.</p>
          </div>
        ) : (
          <div className='flex-grow overflow-y-auto p-6 space-y-4'>
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className='flex items-center space-x-4'
              >
                {/* Product Image */}
                <img
                  src={item.image_url || "https://placehold.co/100x100"}
                  alt={item.name}
                  className='w-20 h-20 object-cover rounded-md'
                />
                <div className='flex-grow'>
                  <h3 className='font-semibold'>{item.name}</h3>
                  {/* Color and Size Details */}
                  <p className='text-sm text-gray-600'>Color: {item.color}</p>
                  <p className='text-sm text-gray-600'>Size: {item.size}</p>
                  <p className='text-sm font-bold'>${item.price}</p>
                </div>
                <div className='flex items-center border border-gray-300 rounded-md'>
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity - 1)
                    }
                    className='w-8 h-8 flex items-center justify-center hover:bg-gray-100'
                  >
                    <IoRemoveOutline />
                  </button>
                  <span className='w-8 text-center'>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cartItemId, item.quantity + 1)
                    }
                    className='w-8 h-8 flex items-center justify-center hover:bg-gray-100'
                  >
                    <IoAddOutline />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='p-6 border-t border-gray-200'>
          <div className='flex justify-between font-semibold text-lg mb-2'>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className='text-xs text-gray-500 mb-4'>
            Tax included. Shipping calculated at checkout.
          </p>
          <div className='space-y-3'>
            <button
              onClick={() => handleNavigate("/cart")}
              className='w-full bg-white text-black border border-black py-3 rounded-md hover:bg-gray-100 font-semibold'
            >
              View Cart
            </button>
            <button
              onClick={() => handleNavigate("/checkout")}
              className='w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 font-semibold'
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
