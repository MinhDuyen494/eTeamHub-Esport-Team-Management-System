import axiosClient from './axiosClient';

// Legacy exports (giữ nguyên để tương thích)
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

export const addMember = async (id: string, data:any) => {
  const res = await axiosClient.post(`/teams/${id}/add-member`, data);
  return res.data;
};

export const removeMember = async (id: string, data: any) => {
  const res = await axiosClient.delete(`/teams/${id}/remove-member`, { data });
  return res.data;
};

export const leaveTeam = async (id: number) => {
  const res = await axiosClient.post(`/teams/${id}/leave-team`);
  return res.data;
};

export const getTeams = async () => {
  const res = await axiosClient.get('/teams');
  return res.data;
};

export const getTeamById = async (id: string) => {
  const res = await axiosClient.get(`/teams/${id}`);
  return res.data;
};

// Dashboard API - Lấy tổng số teams
export const getTeamStats = async () => {
  const res = await axiosClient.get('/teams/stats');
  return res.data;
};

// New teamsApi object (cách mới)
export const teamsApi = {
  // Admin APIs
  getTeams: () => {
    return axiosClient.get('/teams');
  },
  getTeamStats: () => {
    return axiosClient.get('/teams/stats');
  },
  getTeamById: (id: number) => {
    return axiosClient.get(`/teams/${id}`);
  },
  createTeam: (data: any) => {
    return axiosClient.post('/teams', data);
  },
  updateTeam: (id: number, data: any) => {
    return axiosClient.patch(`/teams/${id}`, data);
  },
  deleteTeam: (id: number) => {
    return axiosClient.delete(`/teams/${id}`);
  },
  addMember: (teamId: number, playerId: number) => {
    return axiosClient.post(`/teams/${teamId}/add-member`, { playerId });
  },
  removeMember: (teamId: number, playerId: number) => {
    return axiosClient.delete(`/teams/${teamId}/remove-member`, { data: { playerId } });
  },

  // Player APIs
  getPlayerTeams: () => {
    return axiosClient.get('/teams/player/teams');
  },
};

export * from './team-invites.api';
export * from './attendance.api';
export * from './events.api';
export * from './activity-log.api'; 