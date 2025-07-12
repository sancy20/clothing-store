import api from "../api";

// --- Public Function ---
export const getActiveHeroPanels = async () => {
  const response = await api.get("/hero-panels/active");
  return response.data;
};

// --- Admin Functions ---
export const getAllHeroPanels = async () => {
  const response = await api.get("/hero-panels");
  return response.data;
};

export const createHeroPanel = async (panelData) => {
  const response = await api.post("/hero-panels", panelData);
  return response.data;
};

export const updateHeroPanel = async (id, panelData) => {
  const response = await api.put(`/hero-panels/${id}`, panelData);
  return response.data;
};

export const deleteHeroPanel = async (id) => {
  const response = await api.delete(`/hero-panels/${id}`);
  return response.data;
};
