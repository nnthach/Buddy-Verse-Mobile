import axiosClient from "../config/axiosConfig";

export const getQuestListAPI = async () => {
  const res = await axiosClient.get("/quest");

  return res;
};

export const getQuestByIdAPI = async (id) => {
  const res = await axiosClient.get(`/quest/${id}`);

  return res;
};

export const getAccountQuestByIdAPI = async (id) => {
  const res = await axiosClient.get(`/accountquest/${id}`);

  return res;
};

export const startQuestAPI = async (data) => {
  const res = await axiosClient.post("/accountquest/start", data);

  return res;
};

export const claimQuestAPI = async (accountQuestId) => {
  const res = await axiosClient.post(`/accountquest/${accountQuestId}/claim`);

  return res;
};

export const completeQuestAPI = async (accountQuestId) => {
  const res = await axiosClient.post(
    `/accountquest/${accountQuestId}/complete`
  );

  return res;
};

export const getAccountQuestListAPI = async (id) => {
  const res = await axiosClient.get(`/accountquest/account/${id}`);

  return res;
};
