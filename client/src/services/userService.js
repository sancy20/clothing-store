import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const getAllUsers = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

// --- NEW SERVICE FUNCTIONS ---

const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const updateUserProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/profile`, userData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAddresses = async () => {
  const response = await axios.get(`${API_URL}/addresses`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await axios.post(`${API_URL}/addresses`, addressData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateAddress = async (id, addressData) => {
  const response = await axios.put(`${API_URL}/addresses/${id}`, addressData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await axios.delete(`${API_URL}/addresses/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export { getAllUsers, getUserProfile, updateUserProfile };
