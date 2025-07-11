import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// --- Public Functions ---
const getAllProducts = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// ADD THIS NEW FUNCTION
const getNavigationData = async () => {
  try {
    const response = await axios.get(`${API_URL}/navigation-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    throw error;
  }
};

// --- Admin Functions ---
const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/${id}`, productData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// --- NEW ADMIN FUNCTIONS FOR VARIANTS & IMAGES ---
export const addVariant = async (productId, variantData) => {
  const response = await axios.post(
    `${API_URL}/${productId}/variants`,
    variantData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateVariant = async (variantId, variantData) => {
  const response = await axios.put(
    `${API_URL}/variants/${variantId}`,
    variantData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const deleteVariant = async (variantId) => {
  const response = await axios.delete(`${API_URL}/variants/${variantId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const addImage = async (productId, imageData) => {
  const response = await axios.post(
    `${API_URL}/${productId}/images`,
    imageData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const deleteImage = async (imageId) => {
  const response = await axios.delete(`${API_URL}/images/${imageId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getRelatedProducts = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}/related`);
    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

export {
  getAllProducts,
  getProductById,
  getNavigationData,
  createProduct,
  updateProduct,
  deleteProduct,
};
