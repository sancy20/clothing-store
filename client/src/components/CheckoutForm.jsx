import React, { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import {
  createCodOrder,
  initiateKhqrPayment,
  getOrderStatus,
} from "../../../server/orderService";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "KH",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("khqr");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!orderId || !qrCodeData) return;

    const interval = setInterval(async () => {
      try {
        const data = await getOrderStatus(orderId);
        if (data.status === "paid") {
          clearInterval(interval);
          clearCart();
          navigate("/order-success");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, qrCodeData, clearCart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (paymentMethod === "cod") {
      try {
        await createCodOrder({ cartItems, shippingAddress });
        clearCart();
        navigate("/order-success");
      } catch (err) {
        setErrorMessage("Failed to place order. Please try again.");
        setIsLoading(false);
      }
    }

    if (paymentMethod === "khqr") {
      try {
        const response = await initiateKhqrPayment({
          cartItems,
          shippingAddress,
        });
        setQrCodeData(response.qrCode);
        setOrderId(response.orderId);
      } catch (err) {
        setErrorMessage("Failed to generate QR Code. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (qrCodeData) {
    return (
      <div className='bg-gray-800 p-8 rounded-lg text-center'>
        <h2 className='text-2xl font-bold text-white mb-4'>Scan to Pay</h2>
        <p className='text-gray-300 mb-6'>
          Use your mobile banking app to scan the KHQR code below.
        </p>
        <img
          src={`data:image/png;base64,${qrCodeData}`}
          alt='KHQR Payment Code'
          className='mx-auto rounded-md w-64 h-64'
        />
        <p className='text-indigo-400 mt-6 animate-pulse'>
          Waiting for payment confirmation...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-gray-800 p-8 rounded-lg shadow-xl'
    >
      <h2 className='text-2xl font-bold mb-6 text-white'>
        Shipping Information
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <input
          name='name'
          placeholder='Full Name'
          value={shippingAddress.name}
          onChange={handleShippingChange}
          required
          className='p-3 bg-gray-700 rounded border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none'
        />
        <input
          name='address'
          placeholder='Address'
          value={shippingAddress.address}
          onChange={handleShippingChange}
          required
          className='p-3 bg-gray-700 rounded border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none'
        />
        <input
          name='city'
          placeholder='City'
          value={shippingAddress.city}
          onChange={handleShippingChange}
          required
          className='p-3 bg-gray-700 rounded border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none'
        />
        <input
          name='postalCode'
          placeholder='Postal Code'
          value={shippingAddress.postalCode}
          onChange={handleShippingChange}
          required
          className='p-3 bg-gray-700 rounded border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none'
        />
      </div>

      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-4 text-white'>Payment Method</h2>
        <div className='space-y-3'>
          <label className='flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600'>
            <input
              type='radio'
              name='paymentMethod'
              value='khqr'
              checked={paymentMethod === "khqr"}
              onChange={() => setPaymentMethod("khqr")}
              className='w-5 h-5 text-indigo-500 bg-gray-600 border-gray-500 focus:ring-indigo-600'
            />
            <span className='ml-4 text-white font-semibold'>Pay with KHQR</span>
          </label>
          <label className='flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600'>
            <input
              type='radio'
              name='paymentMethod'
              value='cod'
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className='w-5 h-5 text-indigo-500 bg-gray-600 border-gray-500 focus:ring-indigo-600'
            />
            <span className='ml-4 text-white font-semibold'>
              Cash on Delivery
            </span>
          </label>
        </div>
      </div>

      {errorMessage && (
        <div className='mt-4 text-red-500 text-center'>{errorMessage}</div>
      )}

      <button
        disabled={isLoading}
        className='w-full mt-8 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-500'
      >
        {isLoading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
};

export default CheckoutForm;
