import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IoPersonOutline,
  IoBagHandleOutline,
  IoLogOutOutline,
  IoLocationOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { useAuth } from "../hooks/useAuth";

const UserDashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    {
      icon: <IoPersonOutline />,
      text: "My Information",
      path: "/dashboard/info",
    },
    {
      icon: <IoBagHandleOutline />,
      text: "My Orders",
      path: "/dashboard/orders",
    },
    {
      icon: <IoLocationOutline />,
      text: "Address Book",
      path: "/dashboard/addresses",
    },
    {
      icon: <IoHeartOutline />,
      text: "My Wishlist",
      path: "/dashboard/wishlist",
    },
  ];

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800'>
      <aside className='w-full md:w-64 bg-white p-6 shadow-md md:min-h-screen'>
        <div className='text-center mb-10'>
          <h2 className='text-xl font-bold'>Hello, {user?.name}</h2>
          <p className='text-sm text-gray-500'>Welcome to your dashboard</p>
        </div>
        <nav className='space-y-4'>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {link.icon}
              <span>{link.text}</span>
            </Link>
          ))}
        </nav>
        <div className='mt-auto pt-10'>
          <button
            onClick={handleLogout}
            className='flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-red-500 hover:bg-red-50'
          >
            <IoLogOutOutline />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className='flex-1 p-4 md:p-8 overflow-y-auto'>{children}</main>
    </div>
  );
};

export default UserDashboardLayout;
