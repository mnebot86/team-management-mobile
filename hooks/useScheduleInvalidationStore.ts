import { create } from 'zustand';

type ScheduleInvalidationState = {
  versions: Record<string, number>;
  invalidateTeamSchedule: (teamId: string) => void;
};

export const useScheduleInvalidationStore = create<ScheduleInvalidationState>((set) => ({
  versions: {},
  invalidateTeamSchedule: (teamId) => set((state) => ({
    versions: {
      ...state.versions,
      [teamId]: (state.versions[teamId] ?? 0) + 1,
    },
  })),
}));
