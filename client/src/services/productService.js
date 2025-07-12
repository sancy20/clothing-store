import api from "../api";

// --- Public Functions ---
export const getAllProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getNavigationData = async () => {
  const response = await api.get("/products/navigation-data");
  return response.data;
};

export const getRelatedProducts = async (productId) => {
  const response = await api.get(`/products/${productId}/related`);
  return response.data;
};

// --- Admin Functions ---
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const addVariant = async (productId, variantData) => {
  const response = await api.post(
    `/products/${productId}/variants`,
    variantData
  );
  return response.data;
};

export const updateVariant = async (variantId, variantData) => {
  const response = await api.put(
    `/products/variants/${variantId}`,
    variantData
  );
  return response.data;
};

export const deleteVariant = async (variantId) => {
  const response = await api.delete(`/products/variants/${variantId}`);
  return response.data;
};

export const addImage = async (productId, imageData) => {
  const response = await api.post(`/products/${productId}/images`, imageData);
  return response.data;
};

export const deleteImage = async (imageId) => {
  const response = await api.delete(`/products/images/${imageId}`);
  return response.data;
};
