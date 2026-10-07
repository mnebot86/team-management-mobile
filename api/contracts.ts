export const apiPaths = {
  activeTeamCount: '/teams/active-team-count',
  teamSchedule: (teamId: string) => `/schedules/team/${teamId}`,
  teamScheduleStats: (teamId: string) => `/schedules/team/${teamId}/stats`,
  cancelSchedule: (scheduleId: string) => `/schedules/${scheduleId}/cancel`,
  deleteSchedule: (scheduleId: string) => `/schedules/${scheduleId}`,
} as const;

export interface TeamStatsContract {
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
}

export const mapTeamStats = (data: TeamStatsContract): TeamStatsContract => ({
  wins: data.wins,
  losses: data.losses,
  draws: data.draws,
  total: data.total,
  winRate: data.winRate,
});
