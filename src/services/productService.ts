import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllProducts = async (token: string) => {
  const res = await axios.get(`${API_BASE_URL}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteProduct = async (id: string, token: string) => {
  const res = await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update product
export const updateProduct = async (
  id: string,
  token: string,
  updatedData: { name?: string; price?: number; quantity?: number; expiryDate?: string; image?: string }
) => {
  const res = await axios.put(`${API_BASE_URL}/api/products/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
