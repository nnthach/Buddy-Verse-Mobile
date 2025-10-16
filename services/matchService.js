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

export const createGroupAPI = async (data) => {
  const res = await axiosClient.post("/match/create-group-room", data);

  return res;
};

export const matchGroupByInterestAPI = async (data) => {
  const res = await axiosClient.post("/match/match-group-by-interest", data);

  return res;
};

export const joinGroupAPI = async (data) => {
  const res = await axiosClient.post("/match/join-group-room", data);

  return res;
};

export const updateGroupAPI = async (data) => {
  const res = await axiosClient.put("/match/update-group", data);

  return res;
};

export const getAllGroupAPI = async (params) => {
  console.log("param", params);
  let url = "/match/get-all-groups";
  if (params) {
    const queryString = Object.keys(params)
      .map((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");

    url += `?${queryString}`;
    console.log("Final URL:", url);
  }

  const res = await axiosClient.get(url);
  // const res = await axiosClient.get(`/match/get-all-groups`, { params });
  return res;
};

export const getMemberInRoomAPI = async (roomId) => {
  const res = await axiosClient.get(`/match/${roomId}/members`);

  return res;
};
