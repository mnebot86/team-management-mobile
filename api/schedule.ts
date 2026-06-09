import api from './axios';

export const createSchedule = async (payload: any) => {
  const response = await api.post('/schedules', payload);

  return response.data.data;
};

export const getTeamSchedule = async (teamId: string) => {
  const response = await api.get(`schedules/team/${teamId}`);

  return response.data.data;
};
