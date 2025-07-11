import React, { useState, useEffect } from "react";

const ProductFormModal = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    image_url: "",
    image_url_alt: "",
    uploaded_image_path: "",
    category: "",
    brand: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock_quantity: product.stock_quantity ?? "",
        image_url: product.image_url || "",
        image_url_alt: product.image_url_alt || "",
        uploaded_image_path: product.uploaded_image_path || "",
        category: product.category || "",
        brand: product.brand || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto'>
        <h2 className='text-2xl font-bold mb-6 text-white'>
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            name='name'
            placeholder='Product Name'
            value={formData.name}
            onChange={handleChange}
            required
            className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white'
          />
          <textarea
            name='description'
            placeholder='Description'
            value={formData.description}
            onChange={handleChange}
            required
            className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white h-24'
          />
          <div className='grid grid-cols-2 gap-4'>
            <input
              type='number'
              name='price'
              placeholder='Price'
              value={formData.price}
              onChange={handleChange}
              required
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white'
            />
            <input
              type='number'
              name='stock_quantity'
              placeholder='Stock Quantity'
              value={formData.stock_quantity}
              onChange={handleChange}
              required
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white'
            />
          </div>

          {/* --- Hybrid Image Inputs --- */}
          <div className='p-4 border border-dashed border-gray-600 rounded-lg'>
            <p className='text-sm text-gray-400 mb-2 text-center'>
              Use one of the options below for the main product image.
            </p>
            <input
              name='image_url'
              placeholder='External Image URL'
              value={formData.image_url}
              onChange={handleChange}
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white'
            />
            <div className='flex items-center my-2'>
              <hr className='flex-grow border-gray-600' />
              <span className='px-2 text-gray-500 text-sm'>OR</span>
              <hr className='flex-grow border-gray-600' />
            </div>
            <input
              name='uploaded_image_path'
              placeholder='Uploaded Image Path (e.g., my-image.jpg)'
              value={formData.uploaded_image_path}
              onChange={handleChange}
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white'
            />
            <p className='text-xs text-gray-500 mt-2'>
              For a real app, this would be a file upload button.
            </p>
          </div>
          <input
            name='image_url_alt'
            placeholder='Alternate External Image URL (for hover)'
            value={formData.image_url_alt}
            onChange={handleChange}
            className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white'
          />

          <div className='grid grid-cols-2 gap-4'>
            <input
              name='category'
              placeholder='Category'
              value={formData.category}
              onChange={handleChange}
              required
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white'
            />
            <input
              name='brand'
              placeholder='Brand'
              value={formData.brand}
              onChange={handleChange}
              required
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 text-white'
            />
          </div>
          <div className='flex justify-end space-x-4 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 font-semibold text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700'
            >
              {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
