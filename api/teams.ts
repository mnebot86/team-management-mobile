import api from './axios';

interface CreateTeamParams {
  name: string;
  ageGroup: string;
  sport: string;
};

export const createTeam = async ({ name, ageGroup, sport }: CreateTeamParams) => {
  const response = await api.post('/teams', {
    name,
    ageGroup,
    sport,
  });

  return response.data.data;
};

export const getTeams = async () => {
  const response = await api.get('/teams');

  return response.data.data;
};

export const getActiveTeamsCount = async () => {
  const response = await api.get('/active-team-count');

  return response.data.data;
};

export const getTeam = async (teamId: string) => {
  const response = await api.get(`/teams/${teamId}`);

  return response.data.data;
};

