import axiosClient from "../config/axiosConfig";

export const matchJoinAPI = async (data) => {
  const res = await axiosClient.post("/match/join", data);

  return res;
};
export const matchContinueAPI = async (data) => {
  const res = await axiosClient.post("/match/continue", data);

  return res;
};

export const matchDeleteAPI = async (id) => {
  const res = await axiosClient.delete(`/match/${id}`);

  return res;
};
