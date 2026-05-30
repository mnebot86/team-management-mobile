import api from './axios';

interface CreateAndInsertPlayerToTeamParams {
  firstName: string;
  lastName: string;
  avatar?: {
    uri: string;
    name: string;
    type: string;
  };
}

export const createAndInsertPlayerToTeam = async (
  payload: CreateAndInsertPlayerToTeamParams,
  teamId: string,
) => {
  const formData = new FormData();

  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);

  if (payload.avatar) {
    formData.append('avatar', {
      uri: payload.avatar.uri,
      name: payload.avatar.name,
      type: payload.avatar.type,
    } as any);
  }

  const response = await api.post(`/team-members/${teamId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const getTeamRoster = async (teamId: string) => {
  const response = await api.get(`/team-members/${teamId}`);

  return response.data.data;
};

export const getRosterCount = async (teamId: string) => {
  const response = await api.get(`/team-members/${teamId}/count`);

  return response.data.data;
};

export const getTeamMember = async (teamId: string, profileId: string) => {
  const response = await api.get(`/team-members/${teamId}/member/${profileId}`);

  return response.data.data;
};