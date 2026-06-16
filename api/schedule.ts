import api from './axios';

export const createSchedule = async (payload: any) => {
  const response = await api.post('/schedules', payload);

  return response.data.data;
};

export const getTeamSchedule = async (teamId: string) => {
  const response = await api.get(`schedules/team/${teamId}`);

  return response.data.data;
};

export const getNextPractice = async (teamId: string) => {
  const response = await api.get(`schedules/team/${teamId}/next-practice`);

  return response.data.data;
};

export const getNextGame = async (teamId: string) => {
  const response = await api.get(`schedules/team/${teamId}/next-game`);

  return response.data.data;
};

export const updateAttendance = async (scheduleId: string, payload: any) => {
  const response = await api.patch(`/schedules/${scheduleId}/attendance`, payload);

  return response.data.data;
};
