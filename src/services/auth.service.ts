import { apiClient } from "@/lib/axios/instance";

interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

const login = async (payload: { email: string; password: string }) => {
  const response = await apiClient.post("/auth/login", payload);

  return response.data;
};

const register = async (payload: IRegisterPayload) => {
  console.log(payload);
  const response = await apiClient.post("/auth/register", payload);

  return response.data;
};

const forgotPassword = async (payload: { email: string }) => {
  const response = await apiClient.post("/auth/forget-password", payload);

  return response.data;
};

const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const response = await apiClient.post("/auth/reset-password", payload);

  return response.data;
};

const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/my-profile");

  return response.data;
};

const logout = async () => {
  const response = await apiClient.post("/auth/logout");

  return response.data;
};

export const authService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
};
