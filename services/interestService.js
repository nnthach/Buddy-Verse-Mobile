import axiosClient from "../config/axiosConfig";

export const getInterestListAPI = async () => {
  const res = await axiosClient.get("/interest");

  return res;
};

export const getInterestByIdAPI = async (id) => {
  const res = await axiosClient.get(`/interest/${id}`);

  return res;
};

export const createInterestAPI = async (data) => {
  const res = await axiosClient.post("/interest", data);

  return res;
};

export const updateInterestAPI = async (id, data) => {
  const res = await axiosClient.put(`/interest/${id}`, data);

  return res;
};

export const deleteInterestAPI = async (id) => {
  const res = await axiosClient.delete(`/interest/${id}`);

  return res;
};
