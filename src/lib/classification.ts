import { GridFeature } from '@/types/geojson';

export interface ClassificationResult {
  min: number;
  max: number;
  mean: number;
  breaks: number[];
}

export function classifyData(features: GridFeature[]): ClassificationResult {
  const values = features
    .map((f) => f.properties?.pmiskin_grid ?? 0)
    .filter((v) => v !== null && !isNaN(v));

  if (values.length === 0) return { min: 0, max: 100, mean: 50, breaks: [0, 25, 50, 75, 100] };

  // Gunakan loop biasa — Math.min/max(...array) crash pada array besar (stack overflow)
  let min = values[0];
  let max = values[0];
  let sum = 0;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }
  const mean = sum / values.length;

  // Equal interval breaks (5 classes)
  const interval = (max - min) / 5;
  const breaks = Array.from({ length: 6 }, (_, i) => Math.round((min + i * interval) * 10) / 10);

  return { min, max, mean, breaks };
}
