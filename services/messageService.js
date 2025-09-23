import axiosClient from "../config/axiosConfig";

export const sendMessageAPI = async (data) => {
  const res = await axiosClient.post("/message/send", data);

  return res;
};
