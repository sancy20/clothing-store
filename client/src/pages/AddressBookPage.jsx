import React, { useState, useEffect } from "react";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../services/userService";
import { IoAdd, IoTrash, IoPencil, IoHome } from "react-icons/io5";

const AddressModal = ({ address, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    address || {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
      isDefault: false,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-lg'>
        <h2 className='text-2xl font-bold mb-6'>
          {address ? "Edit Address" : "Add New Address"}
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Form fields for each address property */}
          <input
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            placeholder='Full Name'
            required
            className='w-full p-2 border rounded'
          />
          <input
            name='addressLine1'
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder='Address Line 1'
            required
            className='w-full p-2 border rounded'
          />
          <input
            name='city'
            value={formData.city}
            onChange={handleChange}
            placeholder='City'
            required
            className='w-full p-2 border rounded'
          />
          <input
            name='state'
            value={formData.state}
            onChange={handleChange}
            placeholder='State / Province'
            required
            className='w-full p-2 border rounded'
          />
          <input
            name='postalCode'
            value={formData.postalCode}
            onChange={handleChange}
            placeholder='Postal Code'
            required
            className='w-full p-2 border rounded'
          />
          <input
            name='country'
            value={formData.country}
            onChange={handleChange}
            placeholder='Country'
            required
            className='w-full p-2 border rounded'
          />
          <input
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder='Phone Number'
            className='w-full p-2 border rounded'
          />
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              name='isDefault'
              checked={formData.isDefault}
              onChange={handleChange}
            />
            <span>Set as default address</span>
          </label>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-200 rounded'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-black text-white rounded'
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddressBookPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      setError("Failed to fetch addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (addressData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
      } else {
        await addAddress(addressData);
      }
      setIsModalOpen(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (err) {
      setError("Failed to save address.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
        fetchAddresses();
      } catch (err) {
        setError("Failed to delete address.");
      }
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await updateAddress(address.id, { ...address, isDefault: true });
      fetchAddresses();
    } catch (err) {
      setError("Failed to set default address.");
    }
  };

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Address Book</h1>
        <button
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
          className='flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800'
        >
          <IoAdd />
          <span>Add New Address</span>
        </button>
      </div>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <div className='space-y-4'>
        {addresses.map((address) => (
          <div
            key={address.id}
            className='bg-white p-6 rounded-lg shadow-md flex justify-between items-start'
          >
            <div>
              {address.isDefault && (
                <span className='text-xs font-bold bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full mb-2 inline-block'>
                  Default
                </span>
              )}
              <p className='font-semibold'>{address.fullName}</p>
              <p>{address.addressLine1}</p>
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
              <p>{address.phoneNumber}</p>
            </div>
            <div className='flex items-center space-x-2'>
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address)}
                  title='Set as Default'
                  className='text-gray-500 hover:text-black'
                >
                  <IoHome />
                </button>
              )}
              <button
                onClick={() => {
                  setEditingAddress(address);
                  setIsModalOpen(true);
                }}
                title='Edit'
                className='text-gray-500 hover:text-black'
              >
                <IoPencil />
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                title='Delete'
                className='text-gray-500 hover:text-red-500'
              >
                <IoTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <AddressModal
          address={editingAddress}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AddressBookPage;
