import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = async ({ search = "", category = "", page = 1, limit = 10 }) => {
  const response = await axios.get(`${API_BASE_URL}/api/products`, {
    params: { search, category, page, limit },
  });
  return response.data;
};