import axiosClient from "../config/axiosConfig";

export const getUserByIdAPI = async (id) => {
  const res = await axiosClient.get(`/account/${id}`);
  return res;
};
