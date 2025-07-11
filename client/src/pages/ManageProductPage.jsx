import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  addImage,
  deleteImage,
} from "../services/productService";

const Modal = ({ children, onClose }) => (
  <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'>
    <div className='bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative'>
      <button
        onClick={onClose}
        className='absolute top-3 right-3 text-gray-400 hover:text-white'
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

const ManageProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for modals
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      setError("Failed to fetch product data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleVariantFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      color: formData.get("color"),
      size: formData.get("size"),
      stock_quantity: parseInt(formData.get("stock_quantity"), 10),
    };

    try {
      if (editingVariant) {
        await updateVariant(editingVariant.id, {
          stock_quantity: data.stock_quantity,
        });
      } else {
        await addVariant(id, data);
      }
      setShowVariantModal(false);
      setEditingVariant(null);
      fetchProduct();
    } catch (err) {
      setError("Failed to save variant. It might already exist.");
    }
  };

  const handleImageFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      image_url: formData.get("image_url"),
      color_hint: formData.get("color_hint"),
    };
    try {
      await addImage(id, data);
      setShowImageModal(false);
      fetchProduct();
    } catch (err) {
      setError("Failed to add image.");
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await deleteVariant(variantId);
        fetchProduct();
      } catch (err) {
        setError("Failed to delete variant.");
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage(imageId);
        fetchProduct();
      } catch (err) {
        setError("Failed to delete image.");
      }
    }
  };

  if (loading)
    return <p className='text-center p-8'>Loading Product Details...</p>;
  if (error) return <p className='text-center p-8 text-red-500'>{error}</p>;
  if (!product) return <p className='text-center p-8'>Product not found.</p>;

  return (
    <div className='p-4 md:p-8 space-y-8 text-white'>
      <h1 className='text-3xl font-bold'>Manage: {product.name}</h1>

      {/* Image Management */}
      <div className='bg-gray-800 p-6 rounded-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Image Gallery</h2>
          <button
            onClick={() => setShowImageModal(true)}
            className='bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700'
          >
            Add Image
          </button>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {product.images.map((img) => (
            <div key={img.id} className='relative group'>
              <img
                src={img.image_url}
                alt={img.color_hint || "Product image"}
                className='w-full h-32 object-cover rounded-md'
              />
              <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className='text-red-500 font-bold'
                >
                  Delete
                </button>
              </div>
              <p className='text-xs text-center mt-1'>{img.color_hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Variant Management */}
      <div className='bg-gray-800 p-6 rounded-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Product Variants (SKUs)</h2>
          <button
            onClick={() => {
              setEditingVariant(null);
              setShowVariantModal(true);
            }}
            className='bg-green-600 px-4 py-2 rounded-md hover:bg-green-700'
          >
            Add Variant
          </button>
        </div>
        <table className='w-full text-sm text-left text-gray-300'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-700'>
            <tr>
              <th className='px-6 py-3'>Color</th>
              <th className='px-6 py-3'>Size</th>
              <th className='px-6 py-3'>Stock</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {product.variants.map((v) => (
              <tr
                key={v.id}
                className='border-b border-gray-700 hover:bg-gray-600'
              >
                <td className='px-6 py-4'>{v.color}</td>
                <td className='px-6 py-4'>{v.size}</td>
                <td className='px-6 py-4'>{v.stock_quantity}</td>
                <td className='px-6 py-4 space-x-2'>
                  <button
                    onClick={() => {
                      setEditingVariant(v);
                      setShowVariantModal(true);
                    }}
                    className='font-medium text-blue-500 hover:underline'
                  >
                    Edit Stock
                  </button>
                  <button
                    onClick={() => handleDeleteVariant(v.id)}
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

      {/* Modals */}
      {showVariantModal && (
        <Modal onClose={() => setShowVariantModal(false)}>
          <h3 className='text-lg font-bold mb-4'>
            {editingVariant ? "Edit Variant Stock" : "Add New Variant"}
          </h3>
          <form onSubmit={handleVariantFormSubmit} className='space-y-4'>
            <input
              name='color'
              defaultValue={editingVariant?.color || ""}
              placeholder='Color (e.g., Black)'
              required
              disabled={!!editingVariant}
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 disabled:opacity-50'
            />
            <input
              name='size'
              defaultValue={editingVariant?.size || ""}
              placeholder='Size (e.g., L)'
              required
              disabled={!!editingVariant}
              className='w-full p-2 bg-gray-700 rounded border border-gray-600 disabled:opacity-50'
            />
            <input
              type='number'
              name='stock_quantity'
              defaultValue={editingVariant?.stock_quantity ?? 0}
              placeholder='Stock Quantity'
              required
              className='w-full p-2 bg-gray-700 rounded border border-gray-600'
            />
            <div className='flex justify-end'>
              <button
                type='submit'
                className='bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700'
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showImageModal && (
        <Modal onClose={() => setShowImageModal(false)}>
          <h3 className='text-lg font-bold mb-4'>Add New Image</h3>
          <form onSubmit={handleImageFormSubmit} className='space-y-4'>
            <input
              name='image_url'
              placeholder='Image URL'
              required
              className='w-full p-2 bg-gray-700 rounded border border-gray-600'
            />
            <input
              name='color_hint'
              placeholder='Color Hint (e.g., Black)'
              className='w-full p-2 bg-gray-700 rounded border border-gray-600'
            />
            <div className='flex justify-end'>
              <button
                type='submit'
                className='bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700'
              >
                Add Image
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManageProductPage;
