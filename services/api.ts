import axios from "axios";
import { LoginResponse } from "../types";

const API_BASE_URL = "https://rn.ltrlabsdev.pl";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const logoutUser = async (token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
