import axiosClient from "../config/axiosConfig";

export const sendMessageAPI = async (data) => {
  const res = await axiosClient.post("/message/send", data);

  return res;
};

export const getRoomIdByUserIdAPI = async (id) => {
  const res = await axiosClient.get(`/message/room/${id}`);

  return res;
};

export const getAllRoomOfUserAPI = async (userId) => {
  const res = await axiosClient.get(`/room/account/${userId}`);

  return res;
};
