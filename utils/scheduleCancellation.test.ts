import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCancellationPayload,
  buildUpdatePayload,
  isScheduleInMutationScope,
  removeDeletedSchedules,
  scheduleOccurrenceKey,
  shouldRefetchForScheduleSocket,
} from './scheduleCancellation.ts';

test('materialized occurrences use their distinct scheduleId as identity', () => {
  assert.equal(scheduleOccurrenceKey({ scheduleId: 'occurrence-1', recurrenceGroupId: 'group-1' }), 'occurrence-1');
  assert.equal(scheduleOccurrenceKey({ scheduleId: 'occurrence-2', recurrenceGroupId: 'group-1' }), 'occurrence-2');
});

test('occurrence cancellation is scoped and does not send occurrenceDate', () => {
  assert.deepEqual(buildCancellationPayload({
    isRecurring: true, scope: 'occurrence', reason: ' Weather ',
  }), { scope: 'occurrence', reason: 'Weather' });
});

test('non-recurring mutations use occurrence scope without a series prompt', () => {
  assert.deepEqual(buildCancellationPayload({
    isRecurring: false, scope: null, reason: '',
  }), { scope: 'occurrence' });
  assert.deepEqual(buildUpdatePayload({
    changed: { title: 'One event' }, isRecurring: false, scope: null,
  }), { title: 'One event', scope: 'occurrence' });
});

test('series cancellation omits occurrenceDate', () => {
  assert.deepEqual(buildCancellationPayload({
    isRecurring: true, scope: 'series', reason: 'Season ended',
  }), { scope: 'series', reason: 'Season ended' });
});

test('materialized occurrence edits target only the URL scheduleId and exclude recurrence', () => {
  const movedStartDate = '2026-08-18T00:00:00.000Z';
  assert.deepEqual(buildUpdatePayload({
    changed: {
      title: 'Moved practice', startDate: movedStartDate,
      recurrence: { isRecurring: true, frequency: 'weekly', daysOfWeek: [1], endDate: null },
    },
    isRecurring: true, scope: 'occurrence',
  }), { scope: 'occurrence', title: 'Moved practice', startDate: movedStartDate });
});

test('series edits include recurrence changes', () => {
  const recurrence = { isRecurring: true, frequency: 'weekly' as const, daysOfWeek: [1], endDate: null };
  assert.deepEqual(buildUpdatePayload({
    changed: { title: 'Practice Series', recurrence },
    isRecurring: true, scope: 'series',
  }), { title: 'Practice Series', recurrence, scope: 'series' });
});

test('editing or cancelling one occurrence does not target sibling occurrences', () => {
  const selected = { scheduleId: 'one', recurrenceGroupId: 'group' };
  const sibling = { scheduleId: 'two', recurrenceGroupId: 'group' };

  assert.equal(isScheduleInMutationScope(selected, selected, 'occurrence'), true);
  assert.equal(isScheduleInMutationScope(sibling, selected, 'occurrence'), false);
});

test('series-scoped edits and cancellations target sibling occurrences', () => {
  const selected = { scheduleId: 'one', recurrenceGroupId: 'group' };
  const sibling = { scheduleId: 'two', recurrenceGroupId: 'group' };
  const unrelated = { scheduleId: 'three', recurrenceGroupId: 'other' };

  assert.equal(isScheduleInMutationScope(selected, selected, 'series'), true);
  assert.equal(isScheduleInMutationScope(sibling, selected, 'series'), true);
  assert.equal(isScheduleInMutationScope(unrelated, selected, 'series'), false);
});

test('occurrence deletion removes only its unique scheduleId', () => {
  const sections = [{ data: [
    { scheduleId: 'one', recurrenceGroupId: 'group' },
    { scheduleId: 'two', recurrenceGroupId: 'group' },
  ] }];
  const result = removeDeletedSchedules(sections, { scheduleId: 'one', scope: 'occurrence', recurrenceGroupId: 'group' });
  assert.deepEqual(result[0].data.map((item: any) => item.scheduleId), ['two']);
});

test('series deletion removes all recurrenceGroupId siblings', () => {
  const sections = [{ data: [
    { scheduleId: 'one', recurrenceGroupId: 'group' },
    { scheduleId: 'two', recurrenceGroupId: 'group' },
    { scheduleId: 'three', recurrenceGroupId: 'other' },
  ] }];
  const result = removeDeletedSchedules(sections, { scheduleId: 'one', scope: 'series', recurrenceGroupId: 'group' });
  assert.deepEqual(result[0].data.map((item: any) => item.scheduleId), ['three']);
});

test('socket updates refetch only the affected active team', () => {
  assert.equal(shouldRefetchForScheduleSocket('team-1', 'team-1'), true);
  assert.equal(shouldRefetchForScheduleSocket(undefined, 'team-1'), true);
  assert.equal(shouldRefetchForScheduleSocket('team-2', 'team-1'), false);
});
