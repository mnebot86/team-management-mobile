import api from './axios';
import type { ITeam } from '@/types/team';

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

export const createTeam = async (payload: CreateTeamParams) => {
  const response = await api.post('/teams', payload);

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

export const getTeam = async (teamId: string): Promise<ITeam> => {
  const response = await api.get(`/teams/${teamId}`);

  return response.data.data;
};

export const createInviteCode = async (payload: CreateInviteCode, teamId: string) => {
  const response = await api.post(`/teams/${teamId}/invites`, payload);

  return response.data.data;
};

export const getTeamInviteCodes = async (teamId: string) => {
  const response = await api.get(`/teams/${teamId}/invites`);

  return response.data.data;
};

export const joinTeamByCode = async (payload: JoinTeam) => {
  const response = await api.post(`/teams/join`, payload, {
    retryUnauthorizedOnce: true,
    skipSessionLogoutOnUnauthorized: true,
  });

  return response.data.data;
};
