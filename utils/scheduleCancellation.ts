import type { CancelScheduleInput, CancellationScope, UpdateScheduleInput } from '@/api/schedule';

export const scheduleOccurrenceKey = (occurrence: {
  scheduleId: string;
  recurrenceGroupId?: string | null;
  recurrenceDate?: string;
}) => occurrence.recurrenceGroupId || !occurrence.recurrenceDate
  ? occurrence.scheduleId
  : `${occurrence.scheduleId}:${occurrence.recurrenceDate}`;

export const shouldRefetchForScheduleSocket = (
  eventTeamId: string | undefined,
  activeTeamId: string,
) => !eventTeamId || eventTeamId === activeTeamId;

export const buildCancellationPayload = ({
  isRecurring,
  scope,
  occurrenceDate,
  isMaterialized,
  reason,
}: {
  isRecurring: boolean;
  scope: CancellationScope | null;
  occurrenceDate?: string;
  isMaterialized: boolean;
  reason: string;
}): CancelScheduleInput => {
  const trimmedReason = reason.trim();
  if (!isRecurring) return { scope: 'occurrence', ...(trimmedReason ? { reason: trimmedReason } : {}) };
  if (!scope) throw new Error('A cancellation scope is required for recurring events.');
  if (scope === 'occurrence' && !isMaterialized && !occurrenceDate) {
    throw new Error('A recurrence date is required for legacy recurring events.');
  }

  return {
    scope,
    ...(scope === 'occurrence' && !isMaterialized ? { occurrenceDate } : {}),
    ...(trimmedReason ? { reason: trimmedReason } : {}),
  };
};

export const buildUpdatePayload = ({
  changed,
  isRecurring,
  scope,
  recurrenceDate,
  isMaterialized,
}: {
  changed: UpdateScheduleInput;
  isRecurring: boolean;
  scope: CancellationScope | null;
  recurrenceDate?: string;
  isMaterialized: boolean;
}): UpdateScheduleInput => {
  if (!isRecurring) return { ...changed, scope: 'occurrence' };
  if (!scope) throw new Error('An edit scope is required for recurring events.');
  if (scope === 'occurrence' && !isMaterialized && !recurrenceDate) {
    throw new Error('A recurrence date is required for legacy recurring events.');
  }
  const { recurrence: _recurrence, ...occurrenceFields } = changed;

  return scope === 'occurrence'
    ? { ...occurrenceFields, scope, ...(!isMaterialized ? { occurrenceDate: recurrenceDate } : {}) }
    : { ...changed, scope };
};

export const removeDeletedSchedules = (
  sections: any[],
  event: { scheduleId: string; scope: 'occurrence' | 'series'; recurrenceGroupId?: string | null },
) => sections.map((section) => ({
  ...section,
  data: section.data.filter((item: any) => event.scope === 'series' && event.recurrenceGroupId
    ? item.recurrenceGroupId !== event.recurrenceGroupId
    : item.scheduleId !== event.scheduleId),
}));
