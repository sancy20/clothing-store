import axios from "axios";

const API_URL = "/api/hero-panels";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// --- Public Function ---
export const getActiveHeroPanels = async () => {
  const response = await axios.get(`${API_URL}/active`);
  return response.data;
};

// --- Admin Functions ---
export const getAllHeroPanels = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createHeroPanel = async (panelData) => {
  const response = await axios.post(API_URL, panelData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// --- NEW FUNCTION ---
export const updateHeroPanel = async (id, panelData) => {
  const response = await axios.put(`${API_URL}/${id}`, panelData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteHeroPanel = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
