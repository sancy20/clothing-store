import api from "../api";

export const getProductReviews = async (productId) => {
  const response = await api.get(`/reviews/${productId}`);
  return response.data;
};

export const createProductReview = async (productId, reviewData) => {
  const response = await api.post(`/reviews/${productId}`, reviewData);
  return response.data;
};
