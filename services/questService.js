import axiosClient from "../config/axiosConfig";

export const getQuestListAPI = async () => {
  const res = await axiosClient.get("/quest");

  return res;
};

export const getQuestByIdAPI = async (id) => {
  const res = await axiosClient.get(`/quest/${id}`);

  return res;
};

export const startQuestAPI = async (data) => {
  const res = await axiosClient.post("/accountquest/start", data);

  return res;
};

export const getAccountQuestListAPI = async (id) => {
  const res = await axiosClient.get(`/accountquest/account/${id}`);

  return res;
};
