import React, { useState, useEffect, useRef } from "react";
import {
  getAllHeroPanels,
  createHeroPanel,
  updateHeroPanel,
  deleteHeroPanel,
} from "../services/heroPanelService";
import { uploadImage } from "../services/uploadService";
import {
  IoAdd,
  IoTrash,
  IoPencil,
  IoCloudUploadOutline,
} from "react-icons/io5";

const API_BASE_URL = "http://localhost:5000";

const AdminHeroPanelPage = () => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    imageUrl: "",
    logoUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  const [isUploading, setIsUploading] = useState({
    imageUrl: false,
    logoUrl: false,
  });

  const imageInputRef = useRef(null);
  const logoInputRef = useRef(null);

  useEffect(() => {
    if (editingPanel) {
      setFormData(editingPanel);
    } else {
      setFormData({
        brand: "",
        imageUrl: "",
        logoUrl: "",
        displayOrder: 0,
        isActive: true,
      });
    }
  }, [editingPanel]);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      const data = await getAllHeroPanels();
      setPanels(data);
    } catch (err) {
      setError("Failed to fetch hero panels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        setLoading(true);
        const data = await getAllHeroPanels();
        setPanels(data);
      } catch (err) {
        setError("Failed to fetch hero panels.");
      } finally {
        setLoading(false);
      }
    };
    fetchPanels();
  }, []);

  const handleOpenModalForEdit = (panel) => {
    setEditingPanel(panel);
    setIsModalOpen(true);
  };

  const handleOpenModalForCreate = () => {
    setEditingPanel(null);
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPanel) {
        await updateHeroPanel(editingPanel.id, formData);
      } else {
        await createHeroPanel(formData);
      }
      setIsModalOpen(false);
      fetchPanels();
    } catch (err) {
      setError("Failed to save hero panel.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this panel?")) {
      try {
        await deleteHeroPanel(id);
        fetchPanels();
      } catch (err) {
        setError("Failed to delete panel.");
      }
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const uploadData = await uploadImage(file);
      setFormData((prev) => ({ ...prev, [fieldName]: uploadData.image }));
    } catch (uploadError) {
      setError(`Upload failed for ${fieldName}.`);
    } finally {
      setIsUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  if (loading) return <p className='text-center'>Loading Hero Panels...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Hero Section Panels</h1>
        <button
          onClick={handleOpenModalForCreate}
          className='flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
        >
          <IoAdd />
          <span>Add New Panel</span>
        </button>
      </div>

      <div className='bg-gray-800 shadow-lg rounded-lg overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-300'>
          <thead className='text-xs text-gray-400 uppercase bg-gray-700'>
            <tr>
              <th className='px-6 py-3'>Order</th>
              <th className='px-6 py-3'>Preview</th>
              <th className='px-6 py-3'>Brand</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {panels.map((panel) => (
              <tr
                key={panel.id}
                className='border-b border-gray-700 hover:bg-gray-600'
              >
                <td className='px-6 py-4'>{panel.displayOrder}</td>
                <td className='px-6 py-4'>
                  <div className='flex items-center space-x-2'>
                    <img
                      src={`${API_BASE_URL}${panel.imageUrl}`}
                      alt='Panel'
                      className='w-10 h-16 object-cover rounded-sm bg-gray-700'
                    />
                    <img
                      src={`${API_BASE_URL}${panel.logoUrl}`}
                      alt='Logo'
                      className='w-8 h-8 object-contain bg-gray-700'
                    />
                  </div>
                </td>
                <td className='px-6 py-4 font-medium'>{panel.brand}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      panel.isActive
                        ? "bg-green-600 text-green-100"
                        : "bg-gray-600 text-gray-200"
                    }`}
                  >
                    {panel.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className='px-6 py-10 flex items-center space-x-4'>
                  <button
                    onClick={() => handleOpenModalForEdit(panel)}
                    className='text-blue-400 hover:text-blue-300'
                    title='Edit'
                  >
                    <IoPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(panel.id)}
                    className='text-red-500 hover:text-red-400'
                    title='Delete'
                  >
                    <IoTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
          <div className='bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg'>
            <h2 className='text-2xl font-bold mb-6'>
              {editingPanel ? "Edit Hero Panel" : "Add New Hero Panel"}
            </h2>
            <form onSubmit={handleFormSubmit} className='space-y-4'>
              <input
                name='brand'
                value={formData.brand}
                onChange={handleFormChange}
                placeholder='Brand Name (e.g., BAPE)'
                required
                className='w-full p-2 bg-gray-700 rounded'
              />
              <input
                name='imageUrl'
                value={formData.imageUrl}
                onChange={handleFormChange}
                placeholder='Main Image URL'
                required
                className='w-full p-2 bg-gray-700 rounded'
              />
              <input
                name='logoUrl'
                value={formData.logoUrl}
                onChange={handleFormChange}
                placeholder='Logo Image URL'
                required
                className='w-full p-2 bg-gray-700 rounded'
              />
              <input
                type='number'
                name='displayOrder'
                value={formData.displayOrder}
                onChange={handleFormChange}
                placeholder='Display Order'
                required
                className='w-full p-2 bg-gray-700 rounded'
              />
              <label className='flex items-center space-x-3 text-gray-300'>
                <input
                  type='checkbox'
                  name='isActive'
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className='h-4 w-4 bg-gray-700 border-gray-600'
                />
                <span>Show this panel on the homepage</span>
              </label>
              <div className='flex justify-end space-x-4 pt-4'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 bg-gray-600 rounded-md'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-indigo-600 rounded-md'
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
          <div className='bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg'>
            <h2 className='text-2xl font-bold mb-6'>
              {editingPanel ? "Edit Hero Panel" : "Add New Hero Panel"}
            </h2>
            <form onSubmit={handleFormSubmit} className='space-y-4'>
              <input
                name='brand'
                value={formData.brand}
                onChange={handleFormChange}
                placeholder='Brand Name (e.g., BAPE)'
                required
                className='w-full p-2 bg-gray-700 rounded'
              />

              {/* --- UPDATED IMAGE URL INPUT --- */}
              <div>
                <label className='text-sm text-gray-400'>Main Image</label>
                <div className='flex items-center space-x-2'>
                  <input
                    name='imageUrl'
                    value={formData.imageUrl}
                    onChange={handleFormChange}
                    placeholder='Paste URL or Upload'
                    required
                    className='flex-grow p-2 bg-gray-700 rounded'
                  />
                  <input
                    type='file'
                    ref={imageInputRef}
                    onChange={(e) => handleFileUpload(e, "imageUrl")}
                    className='hidden'
                  />
                  <button
                    type='button'
                    onClick={() => imageInputRef.current.click()}
                    disabled={isUploading.imageUrl}
                    className='p-2 bg-blue-600 rounded'
                  >
                    {isUploading.imageUrl ? "..." : <IoCloudUploadOutline />}
                  </button>
                </div>
              </div>

              {/* --- UPDATED LOGO URL INPUT --- */}
              <div>
                <label className='text-sm text-gray-400'>Logo Image</label>
                <div className='flex items-center space-x-2'>
                  <input
                    name='logoUrl'
                    value={formData.logoUrl}
                    onChange={handleFormChange}
                    placeholder='Paste URL or Upload'
                    required
                    className='flex-grow p-2 bg-gray-700 rounded'
                  />
                  <input
                    type='file'
                    ref={logoInputRef}
                    onChange={(e) => handleFileUpload(e, "logoUrl")}
                    className='hidden'
                  />
                  <button
                    type='button'
                    onClick={() => logoInputRef.current.click()}
                    disabled={isUploading.logoUrl}
                    className='p-2 bg-blue-600 rounded'
                  >
                    {isUploading.logoUrl ? "..." : <IoCloudUploadOutline />}
                  </button>
                </div>
              </div>

              <input
                type='number'
                name='displayOrder'
                value={formData.displayOrder}
                onChange={handleFormChange}
                placeholder='Display Order'
                required
                className='w-full p-2 bg-gray-700 rounded'
              />
              <label className='flex items-center space-x-3 text-gray-300'>
                <input
                  type='checkbox'
                  name='isActive'
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className='h-4 w-4 bg-gray-700 border-gray-600'
                />
                <span>Show this panel on the homepage</span>
              </label>
              <div className='flex justify-end space-x-4 pt-4'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 bg-gray-600 rounded-md'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-indigo-600 rounded-md'
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroPanelPage;
