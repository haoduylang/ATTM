import axios from "axios";

const API_URL = "https://your-api-url.com"; // Thay đổi URL của bạn

// Hàm lấy chi tiết sản phẩm
export const getProductDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product detail:", error);
    throw error;
  }
};

// Các hàm API khác của bạn
export const getAllCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const getAllProducts = async (params) => {
  const response = await axios.get(`${API_URL}/products`, { params });
  return response.data;
};

export const getDataProduct = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};
