import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export const getWishlist = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axios.post(
    API_URL,
    { productId },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await axios.delete(`${API_URL}/${productId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
