import api from './axios';
import type { ITeam } from '@/types/team';
import type { ApiResponse } from './types';
import { apiPaths } from './contracts';

export interface CreateTeamParams {
  name: string;
  ageGroup: string;
  sportId: string;
  sportVariantId: string;
};

export interface CreateInviteCode {
  role: 'player' | 'coach' | 'parent';
  maxUses: number;
  expiresAt: Date | null;
}

export interface JoinTeam {
  code: string
}

export interface TeamMembership {
  team: ITeam;
}

export interface ActiveTeamCount {
  count: number;
}

export interface TeamInviteCode {
  _id: string;
  teamId: string;
  role: CreateInviteCode['role'];
  code: string;
  active: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamInviteSection {
  title: string;
  data: TeamInviteCode[];
}

export interface JoinedTeamMembership {
  teamId: string;
  profileId: string;
  role: CreateInviteCode['role'];
}

export const createTeam = async (payload: CreateTeamParams): Promise<ITeam> => {
  const response = await api.post<ApiResponse<ITeam>>('/teams', payload);

  return response.data.data;
};

export const getTeams = async (): Promise<TeamMembership[]> => {
  const response = await api.get<ApiResponse<TeamMembership[]>>('/teams');

  return response.data.data;
};

export const getActiveTeamsCount = async (): Promise<ActiveTeamCount> => {
  const response = await api.get<ApiResponse<ActiveTeamCount>>(apiPaths.activeTeamCount);

  return response.data.data;
};

export const getTeam = async (teamId: string): Promise<ITeam> => {
  const response = await api.get<ApiResponse<ITeam>>(`/teams/${teamId}`);

  return response.data.data;
};

export const createInviteCode = async (
  payload: CreateInviteCode,
  teamId: string,
): Promise<TeamInviteCode> => {
  const response = await api.post<ApiResponse<TeamInviteCode>>(`/teams/${teamId}/invites`, payload);

  return response.data.data;
};

export const getTeamInviteCodes = async (teamId: string): Promise<TeamInviteSection[]> => {
  const response = await api.get<ApiResponse<TeamInviteSection[]>>(`/teams/${teamId}/invites`);

  return response.data.data;
};

export const joinTeamByCode = async (payload: JoinTeam): Promise<JoinedTeamMembership> => {
  const response = await api.post<ApiResponse<JoinedTeamMembership>>('/teams/join', payload, {
    retryUnauthorizedOnce: true,
    skipSessionLogoutOnUnauthorized: true,
  });

  return response.data.data;
};
