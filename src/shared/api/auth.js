import { axiosAuth } from './api';

export const login = async (data) => {
  return await axiosAuth.post("/auth/login", data);
}
export const register = async (data) => {
  return await axiosAuth.post("/auth/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const getProfile = async () => {
  return await axiosAuth.get("/auth/profile");
}

export const verifyEmail = async (token) => {
  return await axiosAuth.post("/auth/verify-email", { token });
}

export const resendVerification = async (data) => {
  return await axiosAuth.post("/auth/resend-verification", data);
}
export const forgotPassword = async (data) => {
  return await axiosAuth.post("/auth/forgot-password", data);
}
export const resetPassword = async (token, newPassword) => {
  return await axiosAuth.post("/auth/reset-password", { token, newPassword });
} 

export const refreshToken = async (refreshToken) => {
  return await axiosAuth.post("/auth/refresh", { refreshToken });
}
