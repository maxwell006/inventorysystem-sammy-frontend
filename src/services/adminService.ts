import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getMonthlySales = async (token: string) => {
  const res = await axios.get(`${API_BASE_URL}/api/admin/monthly-sales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
