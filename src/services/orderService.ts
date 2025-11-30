import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllOrders = async (token: string) => {
  const res = await axios.get(`${API_BASE_URL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
