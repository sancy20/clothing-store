import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllProducts,
  deleteProduct,
  createProduct,
} from "../services/productService";
import ProductFormModal from "../components/ProductFormModal"; // We can reuse the modal for creating new products

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product and all its variants?"
      )
    ) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh the list
      } catch (err) {
        setError("Failed to delete product.");
      }
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError("Failed to create product.");
    }
  };

  if (loading) return <p className='text-center'>Loading products...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700'
        >
          Add New Product
        </button>
      </div>

      <div className='bg-gray-800 shadow-lg rounded-lg overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-300'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-700'>
            <tr>
              <th className='px-6 py-3'>Product Name</th>
              <th className='px-6 py-3'>Brand</th>
              <th className='px-6 py-3'>Category</th>
              <th className='px-6 py-3'>Price</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className='border-b border-gray-700 hover:bg-gray-600'
              >
                <td className='px-6 py-4 font-medium text-white'>
                  {product.name}
                </td>
                <td className='px-6 py-4'>{product.brand}</td>
                <td className='px-6 py-4'>{product.category}</td>
                <td className='px-6 py-4'>${product.price}</td>
                <td className='px-6 py-4 space-x-4'>
                  <Link
                    to={`/admin/product/${product.id}`}
                    className='font-medium text-blue-500 hover:underline'
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className='font-medium text-red-500 hover:underline'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductFormModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateProduct}
        />
      )}
    </div>
  );
};

export default AdminProductListPage;
