import axiosClient from './axiosClient';

export const createTeam = async (data: any) => {
  const res = await axiosClient.post('/teams', data);
  return res.data;
};

export const updateTeam = async (id: string, data: any) => {
  const res = await axiosClient.patch(`/teams/${id}`, data);
  return res.data;
};

export const deleteTeam = async (id: string) => {
  const res = await axiosClient.delete(`/teams/${id}`);
  return res.data;
};

export const addMember = async (id: string, data: any) => {
  const res = await axiosClient.post(`/teams/${id}/add-member`, data);
  return res.data;
};

export const removeMember = async (id: string, data: any) => {
  const res = await axiosClient.delete(`/teams/${id}/remove-member`, { data });
  return res.data;
};

export const getTeams = async () => {
  const res = await axiosClient.get('/teams');
  return res.data;
};

// Dashboard API - Lấy tổng số teams
export const getTeamStats = async () => {
  const res = await axiosClient.get('/teams/stats');
  return res.data;
}; 