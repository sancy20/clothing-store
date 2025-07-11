import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { logout } from "../services/authService";
import axios from "axios";
import {
  IoSearchOutline,
  IoBagOutline,
  IoPersonCircleOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoChevronDown,
  IoChevronForward,
} from "react-icons/io5";

// --- Reusable Menu Column Component for the Mega Menu ---
const MenuColumn = ({ title, items, linkPrefix, closeMenu, gender = "" }) => (
  <div className='font-bold uppercase tracking-wider text-sm'>
    <Link
      to={`/collection?main_category=${title}&gender=${gender}`}
      onClick={closeMenu}
    >
      <h3 className='mb-4 hover:text-gray-500'>{title}</h3>
    </Link>
    <ul>
      {items.map((item) => (
        <li key={item} className='mb-2'>
          <Link
            to={`/collection?${linkPrefix}=${item}`}
            className='hover:text-gray-500'
            onClick={closeMenu}
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// --- Reusable Menu Column for Static Links ---
const StaticMenuColumn = ({ title, items, closeMenu }) => (
  <div className='font-bold uppercase tracking-wider text-sm'>
    <h3 className='mb-4'>{title}</h3>
    <ul>
      {items.map((item) => (
        <li key={item.name} className='mb-2'>
          <Link
            to={item.link}
            className='hover:text-gray-500'
            onClick={closeMenu}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// --- Main Navbar Component ---
const Navbar = () => {
  const [user, setUser] = useState(null);
  const { cartItems, openCart, clearCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [navData, setNavData] = useState({ brands: [], men: [], women: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  let leaveTimeout;

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products/navigation-data"
        );

        const desiredOrder = ["Clothing", "Shoes", "Bags", "Accessories"];
        const sortCategories = (categoryData) => {
          return [...categoryData].sort((a, b) => {
            const indexA = desiredOrder.indexOf(a.title);
            const indexB = desiredOrder.indexOf(b.title);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
        };

        setNavData({
          brands: data.brands,
          men: sortCategories(data.men),
          women: sortCategories(data.women),
        });
      } catch (error) {
        console.error("Failed to fetch navigation data", error);
      }
    };
    fetchNavData();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    clearCart();
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collection?search=${searchTerm.trim()}`);
      setSearchTerm("");
      setIsSearchOpen(false);
    }
  };

  const handleMenuHover = (menu) => {
    clearTimeout(leaveTimeout);
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    leaveTimeout = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleMobileSubMenuToggle = (menu) => {
    setOpenMobileSubMenu((prev) => (prev === menu ? null : menu));
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileSubMenu(null);
  };

  const shopAllMenLinks = [
    { name: "Shop All", link: "/collection?gender=Men" },
    { name: "New Arrivals", link: "/collection?gender=Men" },
    { name: "Collaboration", link: "/collection?gender=Men" },
  ];

  const shopAllWomenLinks = [
    { name: "Shop All", link: "/collection?gender=Women" },
    { name: "New Arrivals", link: "/collection?gender=Women" },
    { name: "Collaboration", link: "/collection?gender=Women" },
  ];

  const newArrivalsLinks = [
    { name: "Shop All", link: "/collection" },
    { name: "New Arrivals", link: "/collection" },
    { name: "Collaboration", link: "/collection" },
  ];

  return (
    <>
      <header
        className='w-full bg-white text-black shadow-sm sticky top-0 z-40'
        onMouseLeave={handleMenuLeave}
      >
        <div className='container mx-auto px-4 h-16 flex justify-between items-center'>
          <nav className='hidden lg:flex items-center space-x-6 text-sm font-bold tracking-wider'>
            <div
              className='py-2'
              onMouseEnter={() => handleMenuHover("new-arrivals")}
            >
              <Link to='/collection' className='relative group'>
                <span>NEW ARRIVALS</span>
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full'></span>
              </Link>
            </div>
            <div className='py-2' onMouseEnter={() => handleMenuHover("brand")}>
              <button className='relative group flex items-center space-x-1'>
                <span>BRAND</span> <IoChevronDown size={14} />
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full'></span>
              </button>
            </div>
            <div className='py-2' onMouseEnter={() => handleMenuHover("men")}>
              <button className='relative group flex items-center space-x-1'>
                <span>MEN</span> <IoChevronDown size={14} />
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full'></span>
              </button>
            </div>
            <div className='py-2' onMouseEnter={() => handleMenuHover("women")}>
              <button className='relative group flex items-center space-x-1'>
                <span>WOMEN</span> <IoChevronDown size={14} />
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full'></span>
              </button>
            </div>
          </nav>

          <button
            className='lg:hidden'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <IoMenuOutline size={24} />
          </button>

          <div className='absolute left-1/2 transform -translate-x-1/2'>
            <Link to='/' className='text-2xl font-bold tracking-widest'>
              TRINITY.
            </Link>
          </div>

          <nav className='flex items-center space-x-5'>
            <div className='hidden lg:flex items-center relative'>
              <div
                className={`absolute top-1/2 right-8 -translate-y-1/2 bg-white transition-all duration-300 ease-in-out ${
                  isSearchOpen ? "w-60 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Search...'
                    className='w-full h-10 px-4 py-1 border rounded-md outline-none focus:ring-1 focus:ring-black'
                  />
                </form>
              </div>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className='hover:text-gray-500 z-10'
              >
                <IoSearchOutline size={22} />
              </button>
            </div>

            <button onClick={openCart} className='relative hover:text-gray-500'>
              <IoBagOutline size={22} />
              {cartItemCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center'>
                  {cartItemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className='group relative hidden lg:block'>
                <Link to='/dashboard/info' className='hover:text-gray-500'>
                  <IoPersonCircleOutline size={24} />
                </Link>
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible'>
                  <div className='px-4 py-2 text-sm text-gray-700'>
                    Signed in as <br />
                    <strong>{user.name}</strong>
                  </div>
                  <div className='border-t border-gray-200'></div>
                  <Link
                    to='/dashboard/orders'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to='/admin/dashboard'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className='w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to='/login'
                className='hidden lg:block text-sm font-medium hover:text-gray-500'
              >
                LOGIN
              </Link>
            )}
          </nav>
        </div>

        <div
          className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 transition-opacity duration-300 ${
            activeMenu ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onMouseEnter={() => handleMenuHover(activeMenu)}
          onMouseLeave={handleMenuLeave}
        >
          <div className='container mx-auto px-4 py-8'>
            {activeMenu === "new-arrivals" && (
              <div className='-mt-5 w-48'>
                <StaticMenuColumn
                  title=''
                  items={newArrivalsLinks}
                  closeMenu={() => setActiveMenu(null)}
                />
              </div>
            )}
            {activeMenu === "brand" && (
              <div className='-mt-5 -mt-5w-48'>
                <MenuColumn
                  title=''
                  items={navData.brands}
                  linkPrefix='brand'
                  closeMenu={() => setActiveMenu(null)}
                />
              </div>
            )}
            {(activeMenu === "men" || activeMenu === "women") && (
              <div className='grid grid-cols-5 gap-8'>
                <div className='-mt-5'>
                  <StaticMenuColumn
                    items={
                      activeMenu === "men"
                        ? shopAllMenLinks.slice(0)
                        : shopAllWomenLinks.slice(0)
                    }
                    closeMenu={() => setActiveMenu(null)}
                  />
                </div>
                {(activeMenu === "men" ? navData.men : navData.women).map(
                  (group) => (
                    <MenuColumn
                      key={group.title}
                      title={group.title}
                      items={group.items}
                      linkPrefix='category'
                      closeMenu={() => setActiveMenu(null)}
                      isTitleLink={true}
                      gender={activeMenu}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "bg-black bg-opacity-50"
            : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={closeAllMenus}
      >
        <div
          className={`w-3/4 max-w-sm h-full bg-white shadow-lg transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='p-6 flex flex-col h-full'>
            <div className='flex justify-between items-center mb-8'>
              <h2 className='font-bold'>MENU</h2>
              <button onClick={closeAllMenus}>
                <IoCloseOutline size={24} />
              </button>
            </div>
            <nav className='flex flex-col space-y-2 text-lg'>
              <Link to='/collection' onClick={closeAllMenus} className='py-2'>
                NEW ARRIVALS
              </Link>

              <div>
                <button
                  onClick={() => handleMobileSubMenuToggle("brand")}
                  className='w-full flex justify-between items-center py-2'
                >
                  <span>BRAND</span>
                  <IoChevronDown
                    className={`transition-transform ${
                      openMobileSubMenu === "brand" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileSubMenu === "brand" && (
                  <div className='pl-4 mt-2 space-y-2 text-base'>
                    {navData.brands.map((brand) => (
                      <Link
                        key={brand}
                        to={`/collection?brand=${brand}`}
                        onClick={closeAllMenus}
                        className='block'
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Men */}
              <div>
                <button
                  onClick={() => handleMobileSubMenuToggle("men")}
                  className='w-full flex justify-between items-center py-2'
                >
                  <span>MEN</span>
                  <IoChevronDown
                    className={`transition-transform ${
                      openMobileSubMenu === "men" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileSubMenu === "men" && (
                  <div className='pl-4 mt-2 space-y-2 text-base'>
                    {navData.men.map((group) => (
                      <div key={group.title}>
                        <h4 className='font-bold my-2'>{group.title}</h4>
                        {group.items.map((item) => (
                          <Link
                            key={item}
                            to={`/collection?category=${item}`}
                            onClick={closeAllMenus}
                            className='block ml-2'
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => handleMobileSubMenuToggle("women")}
                  className='w-full flex justify-between items-center py-2'
                >
                  <span>WOMEN</span>
                  <IoChevronDown
                    className={`transition-transform ${
                      openMobileSubMenu === "women" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileSubMenu === "women" && (
                  <div className='pl-4 mt-2 space-y-2 text-base'>
                    {navData.women.map((group) => (
                      <div key={group.title}>
                        <h4 className='font-bold my-2'>{group.title}</h4>
                        {group.items.map((item) => (
                          <Link
                            key={item}
                            to={`/collection?category=${item}`}
                            onClick={closeAllMenus}
                            className='block ml-2'
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            <div className='mt-auto border-t pt-4'>
              {user ? (
                <div className='space-y-2'>
                  <p className='text-sm'>Signed in as {user.name}</p>
                  <Link
                    to='/my-orders'
                    onClick={closeAllMenus}
                    className='block'
                  >
                    My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to='/admin/dashboard'
                      onClick={closeAllMenus}
                      className='block'
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className='w-full text-left text-red-600'
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to='/login' onClick={closeAllMenus} className='block'>
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
