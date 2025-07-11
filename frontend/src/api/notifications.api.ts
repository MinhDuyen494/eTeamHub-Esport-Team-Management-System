import axiosClient from './axiosClient';

export const getNotifications = async () => {
  const res = await axiosClient.get('/notifications');
  return res.data;
};

export const markAsRead = async (id: string) => {
  const res = await axiosClient.patch(`/notifications/${id}/read`);
  return res.data;
}; 