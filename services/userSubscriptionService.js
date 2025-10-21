import axiosClient from "../config/axiosConfig";

export const getUserSubscriptionByAccountAPI = async (userId) => {
  const res = await axiosClient.get(`/UserSubscription/by-account/${userId}`);

  return res;
};

export const getSubscriptionPlanDetailAPI = async (planId) => {
  const res = await axiosClient.get(`/SubscriptionPlan/${planId}`);

  return res;
};

export const getSubscriptionPlanAPI = async (params) => {
  // const res = await axiosClient.get(`/SubscriptionPlan/`, { params });
  const name = encodeURIComponent(params?.name || "");
  const url = `/SubscriptionPlan/${name}`;
  const res = await axiosClient.get(url);

  return res;
};

export const createPaymentAPI = async (data) => {
  const res = await axiosClient.post(`/payment/create-checkout`, data);

  return res;
};

export const getPaymentAPI = async (id) => {
  const res = await axiosClient.get(`/payment/${id}`);

  return res;
};
