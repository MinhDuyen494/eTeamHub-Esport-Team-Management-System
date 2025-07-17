import axiosClient from './axiosClient';

// Dashboard API - Lấy danh sách activity logs gần nhất
export const getRecentActivityLogs = async (limit: number = 5) => {
  const res = await axiosClient.get(`/activity-logs/my?limit=${limit.toString()}`);
  return res.data;
};
