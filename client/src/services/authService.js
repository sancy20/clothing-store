import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);

  // After registering, also save the new token and user info
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

  // This is the critical part: save the token and user info separately
  if (response.data && response.data.token) {
    // 1. Save the token string under the key "token"
    localStorage.setItem("token", response.data.token);
    // 2. Save the user object under the key "user"
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

const logout = () => {
  // Make sure to remove both items on logout
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export { register, login, logout };
