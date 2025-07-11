import React, { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth"; // <-- CORRECTED IMPORT PATH
import {
  createCodOrder,
  initiateKhqrPayment,
  getOrderStatus,
} from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { IoShieldCheckmarkOutline, IoPricetagsOutline } from "react-icons/io5";

// --- A new child component for the Order Summary ---
const OrderSummary = ({ cartItems }) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className='w-full lg:w-1/3 bg-gray-50 p-6 lg:p-8 rounded-lg'>
      <h2 className='text-xl font-bold text-gray-800 border-b pb-4 mb-4'>
        Order Summary
      </h2>
      <div className='space-y-4 max-h-64 overflow-y-auto pr-2'>
        {cartItems.map((item) => (
          <div key={item.cartItemId} className='flex items-center space-x-4'>
            <img
              src={item.image_url}
              alt={item.name}
              className='w-16 h-16 object-cover rounded-md'
            />
            <div className='flex-grow'>
              <p className='font-semibold text-gray-800'>{item.name}</p>
              <p className='text-sm text-gray-500'>Color: {item.color}</p>
              <p className='text-sm text-gray-500'>Size: {item.size}</p>
              <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
            </div>
            <p className='font-semibold text-gray-800'>
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className='border-t pt-4 mt-4 space-y-2'>
        <div className='flex justify-between text-gray-600'>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className='flex justify-between text-gray-600'>
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className='flex justify-between font-bold text-xl text-gray-800 border-t pt-2 mt-2'>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// --- The Main Checkout Page Component ---
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
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

    const orderData = { cartItems, shippingAddress };

    if (paymentMethod === "cod") {
      try {
        await createCodOrder(orderData);
        clearCart();
        navigate("/order-success");
      } catch (err) {
        setErrorMessage("Failed to place order. Please try again.");
      }
    }

    if (paymentMethod === "khqr") {
      try {
        const response = await initiateKhqrPayment(orderData);
        setQrCodeData(response.qrCode);
        setOrderId(response.orderId);
      } catch (err) {
        setErrorMessage("Failed to generate QR Code. Please try again.");
      }
    }
    setIsLoading(false);
  };

  if (qrCodeData) {
    return (
      <div className='max-w-md mx-auto my-12 bg-white p-8 rounded-lg shadow-lg text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Scan to Pay</h2>
        <p className='text-gray-600 mb-6'>
          Use your mobile banking app to scan the KHQR code below.
        </p>
        <img
          src={`data:image/png;base64,${qrCodeData}`}
          alt='KHQR Payment Code'
          className='mx-auto rounded-md w-64 h-64'
        />
        <p className='text-indigo-600 mt-6 animate-pulse font-semibold'>
          Waiting for payment confirmation...
        </p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col lg:flex-row gap-8 lg:gap-16'>
        <div className='w-full lg:w-2/3'>
          <form onSubmit={handleSubmit}>
            <div className='bg-white p-6 lg:p-8 rounded-lg shadow-md'>
              <h2 className='text-xl font-bold text-gray-800 mb-4'>
                Shipping Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input
                  name='name'
                  placeholder='Full Name'
                  value={shippingAddress.name}
                  onChange={handleShippingChange}
                  required
                  className='p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                />
                <input
                  name='address'
                  placeholder='Street Address'
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  required
                  className='p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                />
                <input
                  name='city'
                  placeholder='City / Province'
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  required
                  className='p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                />
                <input
                  name='postalCode'
                  placeholder='Postal Code'
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                  required
                  className='p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                />
              </div>
            </div>

            <div className='bg-white p-6 lg:p-8 rounded-lg shadow-md mt-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-4'>
                Payment Method
              </h2>
              <div className='space-y-3'>
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "khqr"
                      ? "border-black bg-gray-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='khqr'
                    checked={paymentMethod === "khqr"}
                    onChange={() => setPaymentMethod("khqr")}
                    className='w-5 h-5 text-black focus:ring-black'
                  />
                  <IoPricetagsOutline
                    className='mx-4 text-gray-700'
                    size={20}
                  />
                  <span className='text-gray-800 font-semibold'>
                    Pay with KHQR
                  </span>
                </label>
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-black bg-gray-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='cod'
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className='w-5 h-5 text-black focus:ring-black'
                  />
                  <IoShieldCheckmarkOutline
                    className='mx-4 text-gray-700'
                    size={20}
                  />
                  <span className='text-gray-800 font-semibold'>
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className='mt-4 text-red-600 text-center font-semibold'>
                {errorMessage}
              </div>
            )}

            <button
              disabled={isLoading || cartItems.length === 0}
              className='w-full mt-6 py-4 text-lg font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {isLoading ? "Processing..." : `Place Order`}
            </button>
          </form>
        </div>

        <OrderSummary cartItems={cartItems} />
      </div>
    </div>
  );
};

export default CheckoutPage;
