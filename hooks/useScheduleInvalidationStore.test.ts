import assert from 'node:assert/strict';
import test from 'node:test';
import { useScheduleInvalidationStore } from './useScheduleInvalidationStore.ts';

test('schedule invalidation is scoped to the affected team', () => {
  useScheduleInvalidationStore.setState({ versions: {} });
  useScheduleInvalidationStore.getState().invalidateTeamSchedule('team-1');
  assert.equal(useScheduleInvalidationStore.getState().versions['team-1'], 1);
  assert.equal(useScheduleInvalidationStore.getState().versions['team-2'], undefined);
});

test('repeated mutations and socket events advance the refetch version', () => {
  useScheduleInvalidationStore.setState({ versions: {} });
  const invalidate = useScheduleInvalidationStore.getState().invalidateTeamSchedule;
  invalidate('team-1');
  invalidate('team-1');
  assert.equal(useScheduleInvalidationStore.getState().versions['team-1'], 2);
});
