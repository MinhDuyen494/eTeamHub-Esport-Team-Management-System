import axiosClient from './axiosClient';

export const getMyActivityLogs = async (limit = 20) => {
  const res = await axiosClient.get('/activity-logs/my', { params: { limit } });
  return res.data;
};

export const getAllActivityLogs = async (limit = 50) => {
  const res = await axiosClient.get('/activity-logs', { params: { limit } });
  return res.data;
};
