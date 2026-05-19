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

  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;

  // Equal interval breaks (5 classes)
  const interval = (max - min) / 5;
  const breaks = Array.from({ length: 6 }, (_, i) => Math.round((min + i * interval) * 10) / 10);

  return { min, max, mean, breaks };
}
