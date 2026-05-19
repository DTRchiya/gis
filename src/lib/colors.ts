import chroma from 'chroma-js';

// Sequential red-orange-yellow scale for poverty prediction
const COLOR_SCALE = chroma.scale(['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026']).mode('lch');

export function getColor(value: number, min: number, max: number): string {
  if (max === min) return COLOR_SCALE(0.5).hex();
  const normalized = (value - min) / (max - min);
  return COLOR_SCALE(normalized).hex();
}

export function getLegendColors(steps: number = 5): { color: string; label: string }[] {
  return Array.from({ length: steps }, (_, i) => ({
    color: COLOR_SCALE(i / (steps - 1)).hex(),
    label: `${Math.round((i / (steps - 1)) * 100)}%`,
  }));
}

export { COLOR_SCALE };
