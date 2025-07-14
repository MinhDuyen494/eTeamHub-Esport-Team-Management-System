import axiosClient from './axiosClient';

export const getMyAttendances = async () => {
  const res = await axiosClient.get('/attendance/my-attendances');
  return res.data;
};

export const getTeamAttendances = async (teamId: string) => {
  const res = await axiosClient.get(`/attendance/team/${teamId}`);
  return res.data;
};

export const rsvpAttendance = async (id: string, data: any) => {
  const res = await axiosClient.patch(`/attendance/${id}/rsvp`, data);
  return res.data;
};

export const checkInAttendance = async (id: string, data: any) => {
  const res = await axiosClient.patch(`/attendance/${id}/check-in`, data);
  return res.data;
};

// Dashboard API - Lấy danh sách events vừa diễn ra có điểm danh
export const getRecentAttendanceEvents = async (limit: number = 5) => {
  const res = await axiosClient.get(`/attendance/recent-events?limit=${limit}`);
  return res.data;
}; 