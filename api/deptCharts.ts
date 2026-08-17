import api from './axios';

export interface CreateDeptChartPayload {
  name: string;
  positions?: DeptChartPositionInput[];
}

export interface DeptChartPositionInput {
  positionDefinitionId?: string;
  name: string;
  shortName?: string;
  sortOrder?: number;
  players?: {
    profileId: string;
    depth?: number;
  }[];
}

export interface DeptChartPlayerChange {
  positionId: string;
  profileId: string;
  depth?: number;
}

export interface UpdateDeptChartPayload {
  name?: string;
  positions?: DeptChartPositionInput[];
  addPlayers?: DeptChartPlayerChange[];
  removePlayers?: Omit<DeptChartPlayerChange, 'depth'>[];
}

export interface DeptChartPlayer {
  profileId: string;
  depth: number;
  firstName?: string;
  lastName?: string;
  jerseyNumber?: string | number;
}

export interface DeptChartPosition {
  _id?: string;
  positionDefinitionId?: string | null;
  coordinates?: {
    x: number;
    y: number;
  };
  name: string;
  shortName: string;
  sortOrder: number;
  players: DeptChartPlayer[];
}

export interface DeptChart {
  _id: string;
  teamId: string;
  name: string;
  positions: DeptChartPosition[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const createDeptChart = async (
  teamId: string,
  payload: CreateDeptChartPayload,
) => {
  const response = await api.post(`/dept-charts/${teamId}`, payload);
  return response.data.data;
};

export const getDeptChartFilters = async (teamId: string): Promise<string[]> => {
  const response = await api.get(`/dept-charts/${teamId}/filters`);

  return response.data.data;
};

export const getDeptCharts = async (
  teamId: string,
  name: string,
): Promise<DeptChart[]> => {
  const response = await api.get(`/dept-charts/${teamId}`, {
    params: { name },
  });

  return response.data.data;
};

export const updateDeptChart = async (
  deptChartId: string,
  payload: UpdateDeptChartPayload,
): Promise<DeptChart> => {
  const response = await api.patch(`/dept-charts/${deptChartId}`, payload);

  return response.data.data;
};

export const deleteDeptChart = async (
  deptChartId: string,
): Promise<DeptChart> => {
  const response = await api.delete(`/dept-charts/${deptChartId}`);

  return response.data.data;
};
