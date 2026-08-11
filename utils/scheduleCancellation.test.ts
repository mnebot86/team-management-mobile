import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCancellationPayload,
  buildUpdatePayload,
  removeDeletedSchedules,
  scheduleOccurrenceKey,
  shouldRefetchForScheduleSocket,
} from './scheduleCancellation.ts';

const legacyDate = '2026-08-17T00:00:00.000Z';

test('materialized occurrences use their distinct scheduleId as identity', () => {
  assert.equal(scheduleOccurrenceKey({ scheduleId: 'occurrence-1', recurrenceGroupId: 'group-1' }), 'occurrence-1');
  assert.equal(scheduleOccurrenceKey({ scheduleId: 'occurrence-2', recurrenceGroupId: 'group-1' }), 'occurrence-2');
});

test('legacy generated occurrences retain the composite identity fallback', () => {
  assert.equal(scheduleOccurrenceKey({ scheduleId: 'legacy-1', recurrenceDate: legacyDate }), `legacy-1:${legacyDate}`);
});

test('materialized occurrence cancellation omits occurrenceDate', () => {
  assert.deepEqual(buildCancellationPayload({
    isRecurring: true, isMaterialized: true, scope: 'occurrence', occurrenceDate: legacyDate, reason: ' Weather ',
  }), { scope: 'occurrence', reason: 'Weather' });
});

test('non-recurring mutations use occurrence scope without a series prompt', () => {
  assert.deepEqual(buildCancellationPayload({
    isRecurring: false, isMaterialized: true, scope: null, reason: '',
  }), { scope: 'occurrence' });
  assert.deepEqual(buildUpdatePayload({
    changed: { title: 'One event' }, isRecurring: false, isMaterialized: true, scope: null,
  }), { title: 'One event', scope: 'occurrence' });
});

test('legacy occurrence cancellation sends recurrenceDate', () => {
  assert.deepEqual(buildCancellationPayload({
    isRecurring: true, isMaterialized: false, scope: 'occurrence', occurrenceDate: legacyDate, reason: '',
  }), { scope: 'occurrence', occurrenceDate: legacyDate });
});

test('series cancellation omits occurrenceDate', () => {
  assert.deepEqual(buildCancellationPayload({
    isRecurring: true, isMaterialized: true, scope: 'series', occurrenceDate: legacyDate, reason: 'Season ended',
  }), { scope: 'series', reason: 'Season ended' });
});

test('materialized occurrence edits target only the URL scheduleId and exclude recurrence', () => {
  const movedStartDate = '2026-08-18T00:00:00.000Z';
  assert.deepEqual(buildUpdatePayload({
    changed: {
      title: 'Moved practice', startDate: movedStartDate,
      recurrence: { isRecurring: true, frequency: 'weekly', daysOfWeek: [1], endDate: null },
    },
    isRecurring: true, isMaterialized: true, scope: 'occurrence', recurrenceDate: legacyDate,
  }), { scope: 'occurrence', title: 'Moved practice', startDate: movedStartDate });
});

test('series edits include recurrence changes', () => {
  const recurrence = { isRecurring: true, frequency: 'weekly' as const, daysOfWeek: [1], endDate: null };
  assert.deepEqual(buildUpdatePayload({
    changed: { title: 'Practice Series', recurrence },
    isRecurring: true, isMaterialized: true, scope: 'series', recurrenceDate: legacyDate,
  }), { title: 'Practice Series', recurrence, scope: 'series' });
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
