import assert from 'node:assert/strict';
import test from 'node:test';
import { apiPaths, mapTeamStats } from '../api/contracts.ts';

test('dashboard endpoints use the canonical team and schedule resources', () => {
  assert.equal(apiPaths.activeTeamCount, '/teams/active-team-count');
  assert.equal(apiPaths.teamScheduleStats('team-1'), '/schedules/team/team-1/stats');
});

test('schedule mutations use the plural schedules resource', () => {
  assert.equal(apiPaths.cancelSchedule('schedule-1'), '/schedules/schedule-1/cancel');
  assert.equal(apiPaths.deleteSchedule('schedule-1'), '/schedules/schedule-1');
});

test('team stats preserve the dashboard response field names', () => {
  assert.deepEqual(mapTeamStats({
    wins: 4,
    losses: 2,
    draws: 1,
    total: 7,
    winRate: 57.14,
  }), {
    wins: 4,
    losses: 2,
    draws: 1,
    total: 7,
    winRate: 57.14,
  });
});
