import { getSocket } from './service';

export const joinTeam = (teamId: string) => {
  getSocket().emit('team.join', teamId);
};

export const leaveTeam = (teamId: string) => {
  getSocket().emit('team.leave', teamId);
};
