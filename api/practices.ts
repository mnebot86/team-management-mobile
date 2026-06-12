import api from './axios';

export const createPracticePlan = async (teamId: string, payload: any) => {
  const response = await api.post(`/practices/${teamId}`, payload);

  return response.data.data;
};

export const getPracticePlans = async (teamId: string) => {
  const response = await api.get(`/practices/${teamId}`);

  return response.data.data;
};

export const editPracticePlan = async (planId: string, payload: any) => {
  const response = await api.patch(`/practices/${planId}`, payload);

  return response.data.data;
};
