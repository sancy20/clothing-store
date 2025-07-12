import axios from "axios";

const API_URL = "/api/users";

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);

  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export { register, login, logout };
