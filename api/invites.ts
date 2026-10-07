import api from './axios';
import type { ApiResponse } from './types';
import type { TeamInviteCode } from './teams';

export const updateInviteCodeStatus = async (codeId: string): Promise<TeamInviteCode> => {
  const response = await api.patch<ApiResponse<TeamInviteCode>>(`/invites/${codeId}/toggle`);

  return response.data.data;
};
