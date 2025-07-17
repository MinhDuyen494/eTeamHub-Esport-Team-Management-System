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

// API lấy danh sách tất cả users (chỉ admin/leader)
export const getAllUsers = async () => {
  const res = await axiosClient.get('/users');
  return res.data;
};



// API tạo user mới (chỉ admin)
export const createUser = async (data: any) => {
  const res = await axiosClient.post('/users', data);
  return res.data;
};

// API cập nhật user (chỉ admin)
export const updateUser = async (id: string, data: any) => {
  const res = await axiosClient.patch(`/users/${id}`, data);
  return res.data;
};

// API xóa user (chỉ admin)
export const deleteUser = async (id: string) => {
  const res = await axiosClient.post(`/users/${id}/delete`);
  return res.data;
}; 

export const getUsers = async (params?: any) => {
  const res = await axiosClient.get('/users', { params });
  return res.data;
}; 

export const getMe = () => {
  return axiosClient.get('/users/me');
}; 
