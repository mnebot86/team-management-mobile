import api from './axios';
import type { ApiResponse, ReactNativeFormDataFile } from './types';

interface CreateAndInsertPlayerToTeamParams {
  firstName: string;
  lastName: string;
  avatar?: ReactNativeFormDataFile;
}

interface EditTeamMemberParams {
  firstName: string;
  lastName: string;
  jerseyNumber: string;
  positionIds: string[];
  avatar?: ReactNativeFormDataFile;
  avatarPublicId?: string;
}

export const createAndInsertPlayerToTeam = async (
  payload: CreateAndInsertPlayerToTeamParams,
  teamId: string,
): Promise<TeamRosterMember> => {
  const formData = new FormData();

  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);

  if (payload.avatar) {
    formData.append('avatar', {
      uri: payload.avatar.uri,
      name: payload.avatar.name,
      type: payload.avatar.type,
    });
  }

  const response = await api.post<ApiResponse<TeamRosterMember>>(`/team-members/${teamId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export type TeamRosterRole = 'player' | 'coach';

export interface TeamRosterMember {
  profileId: string;
  firstName: string;
  lastName: string;
  role: string;
  jerseyNumber?: number | string;
  positions?: string[] | string;
  positionIds?: string[];
  imageUrl?: string;
  avatar?: string | null;
  avatarPublicId?: string | null;
  isClaimed?: boolean;
  linkCode?: string;
}

export interface RosterCount {
  count: number;
}

export const getTeamRoster = async (
  teamId: string,
  role?: TeamRosterRole,
): Promise<TeamRosterMember[]> => {
  const response = await api.get<ApiResponse<TeamRosterMember[]>>(`/team-members/${teamId}`, {
    params: role ? { role } : undefined,
  });

  return response.data.data;
};

export const getRosterCount = async (teamId: string): Promise<RosterCount> => {
  const response = await api.get<ApiResponse<RosterCount>>(`/team-members/${teamId}/count`);

  return response.data.data;
};

export const getTeamMember = async (
  teamId: string,
  profileId: string,
): Promise<TeamRosterMember> => {
  const response = await api.get<ApiResponse<TeamRosterMember>>(`/team-members/${teamId}/member/${profileId}`);

  return response.data.data;
};

export const editTeamMember = async (
  payload: EditTeamMemberParams,
  teamId: string,
  profileId: string
): Promise<TeamRosterMember> => {
  const formData = new FormData();

  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('jerseyNumber', payload.jerseyNumber);
  formData.append('positionIds', JSON.stringify(payload.positionIds));

  if (payload.avatarPublicId) {
    formData.append('avatarPublicId', payload.avatarPublicId);
  }

  if (payload.avatar) {
    formData.append('avatar', {
      uri: payload.avatar.uri,
      name: payload.avatar.name,
      type: payload.avatar.type,
    });
  }

  const response = await api.patch<ApiResponse<TeamRosterMember>>(`/team-members/${teamId}/member/${profileId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};
