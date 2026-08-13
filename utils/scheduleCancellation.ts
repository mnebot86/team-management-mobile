import type { CancelScheduleInput, CancellationScope, UpdateScheduleInput } from '@/api/schedule';

type ScheduleChanges = Omit<UpdateScheduleInput, 'scope'>;

export const scheduleOccurrenceKey = (occurrence: {
  scheduleId: string;
  recurrenceGroupId?: string | null;
}) => occurrence.scheduleId;

export const shouldRefetchForScheduleSocket = (
  eventTeamId: string | undefined,
  activeTeamId: string,
) => !eventTeamId || eventTeamId === activeTeamId;

export const isScheduleInMutationScope = (
  candidate: { scheduleId: string; recurrenceGroupId?: string | null },
  selected: { scheduleId: string; recurrenceGroupId?: string | null },
  scope: CancellationScope,
) => scope === 'occurrence'
  ? candidate.scheduleId === selected.scheduleId
  : Boolean(selected.recurrenceGroupId && candidate.recurrenceGroupId === selected.recurrenceGroupId);

export const buildCancellationPayload = ({
  isRecurring,
  scope,
  reason,
}: {
  isRecurring: boolean;
  scope: CancellationScope | null;
  reason: string;
}): CancelScheduleInput => {
  const trimmedReason = reason.trim();
  if (!isRecurring) return { scope: 'occurrence', ...(trimmedReason ? { reason: trimmedReason } : {}) };
  if (!scope) throw new Error('A cancellation scope is required for recurring events.');

  return {
    scope,
    ...(trimmedReason ? { reason: trimmedReason } : {}),
  };
};

export const buildUpdatePayload = ({
  changed,
  isRecurring,
  scope,
}: {
  changed: ScheduleChanges;
  isRecurring: boolean;
  scope: CancellationScope | null;
}): UpdateScheduleInput => {
  if (!isRecurring) return { ...changed, scope: 'occurrence' };
  if (!scope) throw new Error('An edit scope is required for recurring events.');
  const { recurrence: _recurrence, ...occurrenceFields } = changed;

  return scope === 'occurrence'
    ? { ...occurrenceFields, scope }
    : { ...changed, scope };
};

export const removeDeletedSchedules = (
  sections: any[],
  event: { scheduleId: string; scope: 'occurrence' | 'series'; recurrenceGroupId?: string | null },
) => sections.map((section) => ({
  ...section,
  data: section.data.filter((item: any) => !isScheduleInMutationScope(item, event, event.scope)),
}));
