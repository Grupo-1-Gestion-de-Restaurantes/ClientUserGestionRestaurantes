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

export const verifyEmail = async (data) => {
  return await axiosAuth.post("/auth/verify-email", data);
}

export const resendVerification = async (data) => {
  return await axiosAuth.post("/auth/resend-verification", data);
}
export const forgotPassword = async (data) => {
  return await axiosAuth.post("/auth/forgot-password", data);
}
export const resetPassword = async (data) => {
  return await axiosAuth.post("/auth/reset-password", data);
} 
