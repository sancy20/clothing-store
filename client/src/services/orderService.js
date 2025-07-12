import api from "../api";

export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/mine");
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

export const getIncomeReport = async () => {
  const response = await api.get("/orders/reports/income");
  return response.data;
};

export const initiateKhqrPayment = async (orderData) => {
  const response = await api.post("/orders/initiate-khqr", orderData);
  return response.data;
};

export const createCodOrder = async (orderData) => {
  const response = await api.post("/orders/cod", orderData);
  return response.data;
};

export const getOrderStatus = async (orderId) => {
  const response = await api.get(`/orders/status/${orderId}`);
  return response.data;
};
