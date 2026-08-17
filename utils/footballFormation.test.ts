import assert from 'node:assert/strict';
import test from 'node:test';
import { getFootballFormationCoordinates } from './footballFormation.ts';
import type { DeptChartPosition } from '../api/deptCharts.ts';

const position = (shortName: string, sortOrder: number): DeptChartPosition => ({
  name: shortName, shortName, sortOrder, players: [],
});

test('football positions receive familiar field coordinates', () => {
  const qb = position('QB', 1);
  const center = position('C', 2);
  const coordinates = getFootballFormationCoordinates([qb, center]);

  assert.deepEqual(coordinates.get(qb), { x: 50, y: 68 });
  assert.deepEqual(coordinates.get(center), { x: 50, y: 56 });
});

test('repeated positions spread across the field', () => {
  const left = position('WR', 1);
  const right = position('WR', 2);
  const coordinates = getFootballFormationCoordinates([left, right]);

  assert.deepEqual(coordinates.get(left), { x: 7, y: 54 });
  assert.deepEqual(coordinates.get(right), { x: 93, y: 54 });
});

test('a non-placeholder API coordinate takes precedence', () => {
  const qb = { ...position('QB', 1), coordinates: { x: 44, y: 72 } };
  const coordinates = getFootballFormationCoordinates([qb]);

  assert.deepEqual(coordinates.get(qb), { x: 44, y: 72 });
});

test('default center coordinates use the football-position fallback', () => {
  const qb = { ...position('QB', 1), coordinates: { x: 50, y: 50 } };
  const coordinates = getFootballFormationCoordinates([qb]);

  assert.deepEqual(coordinates.get(qb), { x: 50, y: 68 });
});
