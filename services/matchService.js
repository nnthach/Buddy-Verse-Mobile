import axiosClient from "../config/axiosConfig";

export const matchJoinAPI = async (data) => {
  const res = await axiosClient.post("/match/join", data);

  return res;
};
export const matchContinueAPI = async (data) => {
  const res = await axiosClient.post("/match/continue", data);

  return res;
};

export const matchEndAPI = async (data) => {
  const res = await axiosClient.post("/match/end", data);

  return res;
};
