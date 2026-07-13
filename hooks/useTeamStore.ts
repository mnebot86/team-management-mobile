import { create } from 'zustand';

type TeamState = {
  teamId: string | null;

  setTeamId: (teamId: string | null) => void;
  clearTeam: () => void;
  getTeamId: () => string | null;
};

export const useTeamStore = create<TeamState>((set, get) => ({
  teamId: null,
  teamList: [],
  setTeamId: (teamId) =>
    set({
      teamId,
    }),

  clearTeam: () =>
    set({
      teamId: null,
    }),

  getTeamId: () => get().teamId,
}));
