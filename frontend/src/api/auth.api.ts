import axiosClient from './axiosClient';

export const register = async (data: any) => {
  const res = await axiosClient.post('/auth/register-player', data);
  return res.data;
};
export const registerUser = async (data: any) => {
  const res = await axiosClient.post('/auth/register', data);
  return res.data;
};

export const login = async (data: any) => {
  const res = await axiosClient.post('/auth/login', data);
  return res.data;
};

export const fixMissingPlayers = async () => {
  const res = await axiosClient.post('/auth/fix-missing-players');
  return res.data;
}; 