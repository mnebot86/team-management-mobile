export type SchedulePeriod = 'upcoming' | 'past';
export type ScheduleType = 'game' | 'practice' | 'event' | 'other';
export type ScheduleTypeFilter = 'all' | ScheduleType;

export const buildScheduleQueryParams = (
  period: SchedulePeriod,
  type: ScheduleTypeFilter,
) => type === 'all' ? { period } : { period, type };

export const scheduleQueryKey = (
  teamId: string,
  period: SchedulePeriod,
  type: ScheduleTypeFilter,
) => ['team-schedule', teamId, period, type] as const;

export const getScheduleEmptyMessage = (
  period: SchedulePeriod,
  type: ScheduleTypeFilter,
) => {
  const periodLabel = period === 'upcoming' ? 'upcoming' : 'past';
  const typeLabel = type === 'all'
    ? 'schedule items'
    : type === 'practice'
      ? 'practices'
      : type === 'other'
        ? 'other schedule items'
      : `${type}s`;

  return `No ${periodLabel} ${typeLabel}.`;
};
