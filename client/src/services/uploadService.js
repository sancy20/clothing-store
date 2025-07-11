import axios from "axios";

const API_URL = "http://localhost:5000/api/upload";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${user.token}`,
    };
  }
  return {};
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(API_URL, formData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error.response?.data?.message || "Image upload failed";
  }
};
