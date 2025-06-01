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
