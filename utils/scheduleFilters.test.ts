import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildScheduleQueryParams,
  getScheduleEmptyMessage,
  scheduleQueryKey,
} from './scheduleFilters.ts';

test('all types omits the type query parameter', () => {
  assert.deepEqual(buildScheduleQueryParams('upcoming', 'all'), { period: 'upcoming' });
});

test('each type filter maps to its API value', () => {
  for (const type of ['game', 'practice', 'event', 'other'] as const) {
    assert.deepEqual(buildScheduleQueryParams('upcoming', type), { period: 'upcoming', type });
  }
});

test('query identity changes with type so selecting a filter refetches independently', () => {
  assert.notDeepEqual(
    scheduleQueryKey('team-1', 'upcoming', 'all'),
    scheduleQueryKey('team-1', 'upcoming', 'game'),
  );
});

test('query identity includes both upcoming and past periods', () => {
  assert.deepEqual(scheduleQueryKey('team-1', 'upcoming', 'practice'), [
    'team-schedule', 'team-1', 'upcoming', 'practice',
  ]);
  assert.deepEqual(scheduleQueryKey('team-1', 'past', 'practice'), [
    'team-schedule', 'team-1', 'past', 'practice',
  ]);
  assert.deepEqual(buildScheduleQueryParams('past', 'practice'), {
    period: 'past', type: 'practice',
  });
});

test('filtered empty states identify the period and selected type', () => {
  assert.equal(getScheduleEmptyMessage('upcoming', 'game'), 'No upcoming games.');
  assert.equal(getScheduleEmptyMessage('past', 'practice'), 'No past practices.');
  assert.equal(getScheduleEmptyMessage('upcoming', 'event'), 'No upcoming events.');
  assert.equal(getScheduleEmptyMessage('past', 'other'), 'No past other schedule items.');
  assert.equal(getScheduleEmptyMessage('upcoming', 'all'), 'No upcoming schedule items.');
});
