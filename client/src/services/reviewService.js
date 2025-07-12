import axios from "axios";

const API_URL = "/api/reviews";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

/**
 * Fetches all reviews for a specific product.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<Array>} A promise that resolves to an array of reviews.
 */
const getProductReviews = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}`);
  return response.data;
};

/**
 * Creates a new review for a product.
 * @param {string} productId - The ID of the product.
 * @param {object} reviewData - { rating, comment }
 * @returns {Promise<object>} A promise that resolves to the created review.
 */
const createProductReview = async (productId, reviewData) => {
  const response = await axios.post(`${API_URL}/${productId}`, reviewData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export { getProductReviews, createProductReview };
