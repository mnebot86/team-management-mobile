import api from './axios';
import type { ApiResponse } from './types';

export interface SportPositionDefinition {
  id: string;
  name: string;
  shortName: string;
  group: string;
  sortOrder: number;
}

export interface SportDepthChartTemplate {
  name: string;
  sortOrder: number;
  positionIds: string[];
}

export interface SportVariantDefinition {
  id: string;
  name: string;
  positions: SportPositionDefinition[];
  depthCharts: SportDepthChartTemplate[];
}

export interface SportDefinition {
  id: string;
  name: string;
  defaultVariantId: string;
  variants: SportVariantDefinition[];
}

export const getSports = async (): Promise<SportDefinition[]> => {
  const response = await api.get<ApiResponse<SportDefinition[]>>('/sports');

  return response.data.data;
};

export const getSport = async (sportId: string): Promise<SportDefinition> => {
  const response = await api.get<ApiResponse<SportDefinition>>(`/sports/${sportId}`);

  return response.data.data;
};
