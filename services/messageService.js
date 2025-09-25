import axiosClient from "../config/axiosConfig";

export const sendMessageAPI = async (data) => {
  const res = await axiosClient.post("/message/send", data);

  return res;
};

export const getRoomIdByUserIdAPI = async (roomId, userId) => {
  const res = await axiosClient.get(
    `/message/room/${roomId}/account/${userId}`
  );

  return res;
};

export const getRoomDetailBetweenUserAPI = async (
  roomId,
  accountID1,
  accountID2
) => {
  const res = await axiosClient.get(
    `/message/room/${roomId}/between/${accountID1}/and/${accountID2}`
  );

  return res;
};

export const getAllRoomOfUserAPI = async (userId) => {
  const res = await axiosClient.get(`/room/account/${userId}`);

  return res;
};
