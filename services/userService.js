import axiosClient from "../config/axiosConfig";

export const getUserByIdAPI = async (id) => {
  const res = await axiosClient.get(`/account/${id}`);
  return res;
};

export const updateUserProfileAPI = async (id, body) => {
  const res = await axiosClient.put(`/account/${id}`, body);
  return res;
};

export const updateUserInterestAPI = async (id, body) => {
  const res = await axiosClient.put(`/account/interest/${id}`, body);
  return res;
};

export const updateUserAvatarAPI = async (id, body) => {
  const res = await axiosClient.put(`/account/avatar/${id}`, body);
  return res;
};

export const updateUserCharacterAPI = async (id, body) => {
  const res = await axiosClient.put(`/account/character/${id}`, body);
  return res;
};
