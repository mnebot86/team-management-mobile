import api from './axios';
import type { ApiResponse } from './types';

export interface PracticeSectionInput {
  title: string;
  description?: string;
  durationMinutes: number;
  order: number;
  notes?: string;
}

export interface PracticePlanInput {
  title: string;
  description?: string;
  focusAreas?: string[];
  totalDurationMinutes: number;
  status?: 'draft' | 'published' | 'archived';
  sections: PracticeSectionInput[];
}

export interface PracticePlan {
  _id: string;
  title: string;
  description?: string;
  totalDurationMinutes: number;
  sections?: PracticeSectionInput[];
}

export const createPracticePlan = async (
  teamId: string,
  payload: PracticePlanInput,
): Promise<PracticePlan> => {
  const response = await api.post<ApiResponse<PracticePlan>>(`/practices/${teamId}`, payload);

  return response.data.data;
};

export const getPracticePlans = async (teamId: string): Promise<PracticePlan[]> => {
  const response = await api.get<ApiResponse<PracticePlan[]>>(`/practices/${teamId}`);

  return response.data.data;
};

export const editPracticePlan = async (
  planId: string,
  payload: Partial<PracticePlanInput>,
): Promise<PracticePlan> => {
  const response = await api.patch<ApiResponse<PracticePlan>>(`/practices/${planId}`, payload);

  return response.data.data;
};

export const deletePracticePlan = async (planId: string): Promise<null> => {
  const response = await api.delete<ApiResponse<null>>(`/practices/${planId}`);

  return response.data.data;
};
