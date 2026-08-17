import type { DeptChartPosition } from '@/api/deptCharts';

export type FormationCoordinate = { x: number; y: number };

const coordinateGroups: Record<string, FormationCoordinate[]> = {
  QB: [{ x: 50, y: 68 }],
  RB: [{ x: 59, y: 84 }, { x: 50, y: 88 }, { x: 66, y: 84 }],
  HB: [{ x: 59, y: 84 }],
  FB: [{ x: 41, y: 80 }],
  C: [{ x: 50, y: 56 }],
  LG: [{ x: 37, y: 56 }],
  RG: [{ x: 63, y: 56 }],
  LT: [{ x: 24, y: 56 }],
  RT: [{ x: 76, y: 56 }],
  OL: [{ x: 24, y: 56 }, { x: 37, y: 56 }, { x: 50, y: 56 }, { x: 63, y: 56 }, { x: 76, y: 56 }],
  WR: [{ x: 7, y: 54 }, { x: 93, y: 54 }, { x: 14, y: 66 }, { x: 86, y: 66 }],
  TE: [{ x: 84, y: 66 }, { x: 16, y: 66 }],
  DE: [{ x: 27, y: 55 }, { x: 73, y: 55 }],
  DT: [{ x: 42, y: 55 }, { x: 58, y: 55 }],
  NT: [{ x: 50, y: 55 }],
  DL: [{ x: 28, y: 55 }, { x: 42, y: 55 }, { x: 58, y: 55 }, { x: 72, y: 55 }],
  LB: [{ x: 30, y: 39 }, { x: 50, y: 36 }, { x: 70, y: 39 }],
  OLB: [{ x: 27, y: 39 }, { x: 73, y: 39 }],
  ILB: [{ x: 43, y: 38 }, { x: 57, y: 38 }],
  MLB: [{ x: 50, y: 37 }],
  CB: [{ x: 11, y: 29 }, { x: 89, y: 29 }],
  S: [{ x: 42, y: 17 }, { x: 58, y: 17 }],
  FS: [{ x: 58, y: 16 }],
  SS: [{ x: 42, y: 21 }],
  DB: [{ x: 12, y: 29 }, { x: 38, y: 18 }, { x: 62, y: 18 }, { x: 88, y: 29 }],
  K: [{ x: 50, y: 76 }],
  P: [{ x: 50, y: 78 }],
  LS: [{ x: 50, y: 51 }],
  KR: [{ x: 38, y: 82 }, { x: 62, y: 82 }],
  PR: [{ x: 50, y: 82 }],
};

const normalizeCode = (position: DeptChartPosition) =>
  (position.shortName || position.name).replace(/[^a-z0-9]/gi, '').toUpperCase();

export const getFootballFormationCoordinates = (
  positions: DeptChartPosition[],
): Map<DeptChartPosition, FormationCoordinate> => {
  const occurrences: Record<string, number> = {};
  const result = new Map<DeptChartPosition, FormationCoordinate>();

  positions.forEach((position, index) => {
    const code = normalizeCode(position);
    const options = coordinateGroups[code];
    const occurrence = occurrences[code] ?? 0;
    occurrences[code] = occurrence + 1;

    const fallbackColumn = index % 6;
    const fallbackRow = Math.floor(index / 6);
    const apiCoordinate = position.coordinates;
    const hasPlacedCoordinate = apiCoordinate
      && Number.isFinite(apiCoordinate.x)
      && Number.isFinite(apiCoordinate.y)
      && (apiCoordinate.x !== 50 || apiCoordinate.y !== 50);

    result.set(position, hasPlacedCoordinate ? {
      x: Math.max(5, Math.min(95, apiCoordinate.x)),
      y: Math.max(8, Math.min(92, apiCoordinate.y)),
    } : options?.[occurrence % options.length] ?? {
      x: 10 + fallbackColumn * 16,
      y: 30 + fallbackRow * 25,
    });
  });

  return result;
};
