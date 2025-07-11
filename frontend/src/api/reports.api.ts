import axiosClient from './axiosClient';

export const getTeamReport = async (teamId: string) => {
  const res = await axiosClient.get(`/reports/team/${teamId}`);
  return res.data;
};

export const getMyPlayerReport = async () => {
  const res = await axiosClient.get('/reports/player/me');
  return res.data;
}; 