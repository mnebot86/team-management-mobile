import api from './axios';

export const updateInviteCodeStatus = async (codeId: string) => {
  const response = await api.patch(`/invites/${codeId}/toggle`);

  return response.data.data;
};
