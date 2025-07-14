import axiosClient from './axiosClient';

export const getProfile = async () => {
  const res = await axiosClient.get('/users/profile');
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await axiosClient.put('/users/profile/update', data);
  return res.data;
};

export const changePassword = async (data: any) => {
  const res = await axiosClient.post('/users/change-password-secure', data);
  return res.data;
};

export const adminResetPassword = async (id: string, data: any) => {
  const res = await axiosClient.put(`/users/admin/${id}/reset-password`, data);
  return res.data;
};

// Dashboard API - Lấy tổng số users
export const getUserStats = async () => {
  const res = await axiosClient.get('/users/stats');
  return res.data;
}; 
