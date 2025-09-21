import axiosClient from "../config/axiosConfig";

export const loginAPI = async (body) => {
  const res = await axiosClient.post("/account/login", body);
  return res;
};

export const registerAPI = async (data) => {
  const res = await axiosClient.post("/account/register", data);

  return res;
};

export const refreshTokenAPI = async (data) => {
  const res = await axiosClient.post("/account/refresh-token", data);

  return res;
};

export const forgotPasswordAPI = async (data) => {
  const res = await axiosClient.post("/password/forget-password", data);

  return res;
};

export const verifyOTPAPI = async (data) => {
  const res = await axiosClient.post("/password/verify-otp", data);

  return res;
};

export const resetPasswordAPI = async (data) => {
  const res = await axiosClient.post("/password/reset-password", data);

  return res;
};
