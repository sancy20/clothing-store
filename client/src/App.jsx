import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// --- CONTEXT PROVIDERS (UPDATED) ---
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

// --- LAYOUTS & PAGES ---
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CartPopup from "./components/CartPopup";

// Admin Panel Imports
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductListPage from "./pages/AdminProductListPage";
import ManageProductPage from "./pages/ManageProductPage";
import AdminOrderListPage from "./pages/AdminOrderListPage";
import AdminUserListPage from "./pages/AdminUserListPage";
import AdminHeroPanelPage from "./pages/AdminHeroPanelPage";

// User Dashboard Imports
import UserDashboardLayout from "./components/UserDashboardLayout";
import UserInfoPage from "./pages/UserInfoPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AddressBookPage from "./pages/AddressBookPage";
import WishlistPage from "./pages/WishlistPage";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserDashboard = location.pathname.startsWith("/dashboard");
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  // Decide which layout to show
  if (isAdminRoute) {
    return (
      <AdminRoute>
        <AdminLayout>
          <Routes>
            <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
            <Route path='/admin/products' element={<AdminProductListPage />} />
            <Route path='/admin/product/:id' element={<ManageProductPage />} />
            <Route path='/admin/orders' element={<AdminOrderListPage />} />
            <Route path='/admin/users' element={<AdminUserListPage />} />
            <Route path='/admin/hero-panels' element={<AdminHeroPanelPage />} />
          </Routes>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (isUserDashboard) {
    return (
      <ProtectedRoute>
        <Navbar />
        <UserDashboardLayout>
          <Routes>
            <Route path='/dashboard/info' element={<UserInfoPage />} />
            <Route path='/dashboard/orders' element={<MyOrdersPage />} />
            <Route path='/dashboard/addresses' element={<AddressBookPage />} />
            <Route path='/dashboard/wishlist' element={<WishlistPage />} />
          </Routes>
        </UserDashboardLayout>
      </ProtectedRoute>
    );
  }

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    );
  }

  // Render the main public website layout
  return (
    <>
      <Navbar />
      <CartPopup />
      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/collection' element={<CollectionPage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route
            path='/checkout'
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/order-success'
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
