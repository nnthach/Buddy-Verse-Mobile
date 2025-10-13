import axiosClient from "../config/axiosConfig";

export const getAllPostAPI = async () => {
  const res = await axiosClient.get("/post/all");

  return res;
};

export const getAllPostOfUserAPI = async (id) => {
  const res = await axiosClient.get(`/post/account/${id}`);

  return res;
};

export const createPostAPI = async (data) => {
  const res = await axiosClient.post("/post/create", data);

  return res;
};

export const likePostAPI = async (id, params) => {
  const res = await axiosClient.post(`/post/${id}/like`, null, { params });
  return res;
};

export const commentPostAPI = async (id, data, params) => {
  const res = await axiosClient.post(`/post/${id}/comment`, data, { params });
  return res;
};

export const getPostCommentAPI = async (id) => {
  const res = await axiosClient.get(`/post/${id}/comments`);
  return res;
};
