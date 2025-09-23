import axiosClient from "../config/axiosConfig";

export const getUserByIdAPI = async (id) => {
  const res = await axiosClient.get(`/account/${id}`);
  return res;
};

export const updateUserProfileAPI = async (id, body) => {
  const res = await axiosClient.put(`/account/${id}`, body);
  return res;
};
