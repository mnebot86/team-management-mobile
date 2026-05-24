import api from './axios';

interface CreateAndInsertPlayerToTeamParams {
  firstName: string;
  lastName: string;
};

export const createAndInsertPlayerToTeam = async (payload: CreateAndInsertPlayerToTeamParams, teamId: string) => {
  const response = await api.post(`/team-members/${teamId}`, {
    ...payload,
  });

  return response.data.data;
};

export const getTeamRoster = async (teamId: string) => {
  const response = await api.get(`/team-members/${teamId}`);

  return response.data.data;
};
