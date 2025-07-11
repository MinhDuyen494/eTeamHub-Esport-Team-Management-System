import axiosClient from './axiosClient';

export const createTeamInvite = async (data: any) => {
  const res = await axiosClient.post('/team-invites', data);
  return res.data;
};

export const getTeamInvites = async () => {
  const res = await axiosClient.get('/team-invites');
  return res.data;
};

export const acceptTeamInvite = async (id: string) => {
  const res = await axiosClient.patch(`/team-invites/${id}/accept`);
  return res.data;
};

export const rejectTeamInvite = async (id: string) => {
  const res = await axiosClient.patch(`/team-invites/${id}/reject`);
  return res.data;
}; 