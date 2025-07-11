import axiosClient from './axiosClient';

export const createPlayer = async (data: any) => {
  const res = await axiosClient.post('/players', data);
  return res.data;
};

export const getPlayers = async () => {
  const res = await axiosClient.get('/players');
  return res.data;
};

export const getPlayerById = async (id: string) => {
  const res = await axiosClient.get(`/players/${id}`);
  return res.data;
};

export const updatePlayer = async (id: string, data: any) => {
  const res = await axiosClient.patch(`/players/${id}`, data);
  return res.data;
};

export const deletePlayer = async (id: string) => {
  const res = await axiosClient.delete(`/players/${id}`);
  return res.data;
}; 