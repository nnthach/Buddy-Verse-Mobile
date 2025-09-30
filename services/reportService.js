import axiosClient from "../config/axiosConfig";

export const createReportMessageAPI = async (data) => {
  const res = await axiosClient.post("/report", data);

  return res;
};
