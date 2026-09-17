import api from './axios';

export interface PracticePlan {
  _id: string;
  title: string;
  description?: string;
  totalDurationMinutes: number;
  sections?: { title: string }[];
}

export const createPracticePlan = async (teamId: string, payload: unknown) => {
  const response = await api.post(`/practices/${teamId}`, payload);

  return response.data.data;
};

export const getPracticePlans = async (teamId: string): Promise<PracticePlan[]> => {
  const response = await api.get(`/practices/${teamId}`);

  return response.data.data;
};

export const editPracticePlan = async (planId: string, payload: unknown) => {
  const response = await api.patch(`/practices/${planId}`, payload);

  return response.data.data;
};

export const deletePracticePlan = async (planId: string) => {
  const response = await api.delete(`/practices/${planId}`);

  return response.data.data;
};
