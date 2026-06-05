import { StringifyConfig } from 'expo-router/build/fork/getPathFromState';
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

interface EditTeamMemberParams {
  firstName: string;
  lastName: string;
  jerseyNumber: string;
  positions: string;
  avatar?: {
    uri: string;
    name: string;
    type: string;
  };
  avatarPublicId?: string;
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

export const editTeamMember = async (
  payload: EditTeamMemberParams,
  teamId: string,
  profileId: string
) => {
  const formData = new FormData();

  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('jerseyNumber', payload.jerseyNumber);
  formData.append('positions', payload.positions);

  if (payload.avatarPublicId) {
    formData.append('avatarPublicId', payload.avatarPublicId);
  }

  if (payload.avatar) {
    formData.append('avatar', {
      uri: payload.avatar.uri,
      name: payload.avatar.name,
      type: payload.avatar.type,
    } as any);
  }

  const response = await api.patch(`/team-members/${teamId}/member/${profileId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};
