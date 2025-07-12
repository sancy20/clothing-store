import axios from "axios";

const API_URL = "/api/orders";

const getToken = () => localStorage.getItem("token");

export const getAllOrders = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};

export const getIncomeReport = async () => {
  const response = await axios.get(`${API_URL}/reports/income`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axios.get(`${API_URL}/my-orders`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const initiateKhqrPayment = async (orderData) => {
  const response = await axios.post(`${API_URL}/initiate-khqr`, orderData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const createCodOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/cod`, orderData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getOrderStatus = async (orderId) => {
  const response = await axios.get(`${API_URL}/status/${orderId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};
