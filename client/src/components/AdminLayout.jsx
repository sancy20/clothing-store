import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoSpeedometerOutline,
  IoPricetagsOutline,
  IoCartOutline,
  IoPeopleOutline,
  IoBrowsersOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { useAuth } from "../hooks/useAuth";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navLinks = [
    {
      icon: <IoSpeedometerOutline />,
      text: "Dashboard",
      path: "/admin/dashboard",
    },
    { icon: <IoPricetagsOutline />, text: "Products", path: "/admin/products" },
    { icon: <IoCartOutline />, text: "Orders", path: "/admin/orders" },
    { icon: <IoPeopleOutline />, text: "Customers", path: "/admin/users" },
    {
      icon: <IoBrowsersOutline />,
      text: "Hero Panels",
      path: "/admin/hero-panels",
    },
  ];

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      <aside className='w-64 flex-shrink-0 bg-gray-800 p-6 flex flex-col justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-wider text-center mb-10'>
            TRINITY.
          </h1>
          <nav className='space-y-4'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  location.pathname.startsWith(link.path)
                    ? "bg-indigo-600"
                    : "hover:bg-gray-700"
                }`}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <button
            onClick={logout}
            className='flex items-center space-x-3 p-3 rounded-lg transition-colors w-full hover:bg-red-700'
          >
            <IoLogOutOutline />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
    </div>
  );
};

export default AdminLayout;
