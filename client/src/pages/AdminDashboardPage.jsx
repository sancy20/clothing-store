import React, { useState, useEffect } from "react";
import { getIncomeReport, getAllOrders } from "../services/orderService";
import { getAllUsers } from "../services/userService";
import { getAllProducts } from "../services/productService";
import IncomeChart from "../components/IncomeChart";
import { IoCart, IoPricetags, IoPeople, IoCash } from "react-icons/io5";

// A reusable stat card component
const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-gray-800 p-6 rounded-lg flex items-center space-x-4`}>
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className='text-sm text-gray-400'>{title}</p>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    customers: 0,
    revenue: 0,
  });
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderData, userData, productData, reportData] =
          await Promise.all([
            getAllOrders(),
            getAllUsers(),
            getAllProducts(),
            getIncomeReport(),
          ]);

        const totalRevenue = orderData.reduce(
          (sum, order) => sum + parseFloat(order.total_price),
          0
        );

        setStats({
          orders: orderData.length,
          products: productData.length,
          customers: userData.length,
          revenue: totalRevenue.toFixed(2),
        });
        setIncomeData(reportData);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className='text-center'>Loading Dashboard...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>Dashboard</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          icon={<IoCash size={24} />}
          title='Total Revenue'
          value={`$${stats.revenue}`}
          color='bg-green-500'
        />
        <StatCard
          icon={<IoCart size={24} />}
          title='Total Orders'
          value={stats.orders}
          color='bg-blue-500'
        />
        <StatCard
          icon={<IoPricetags size={24} />}
          title='Total Products'
          value={stats.products}
          color='bg-yellow-500'
        />
        <StatCard
          icon={<IoPeople size={24} />}
          title='Total Customers'
          value={stats.customers}
          color='bg-purple-500'
        />
      </div>

      {/* Income Report */}
      <div>
        <IncomeChart data={incomeData} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
