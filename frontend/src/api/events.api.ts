import axiosClient from './axiosClient';

export const createEvent = async (data: any) => {
  const res = await axiosClient.post('/events', data);
  return res.data;
};

export const getEvents = async () => {
  const res = await axiosClient.get('/events');
  return res.data;
};

export const getEventById = async (id: string) => {
  const res = await axiosClient.get(`/events/${id}`);
  return res.data;
};

export const updateEvent = async (id: string, data: any) => {
  const res = await axiosClient.put(`/events/${id}`, data);
  return res.data;
};

export const deleteEvent = async (id: string) => {
  const res = await axiosClient.delete(`/events/${id}`);
  return res.data;
}; 