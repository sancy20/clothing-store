import axios from "axios";

// Create a new axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend API URL
});

// This is an "interceptor" that runs before every single request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
