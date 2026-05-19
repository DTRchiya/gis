'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';
import { getLegendColors } from '@/lib/colors';

interface LegendProps {
  min: number;
  max: number;
}

// Renders as a Leaflet control
export default function Legend({ min, max }: LegendProps) {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend-control');
      div.style.cssText = `
        background: #0f1623;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 14px;
        min-width: 160px;
        font-family: 'Sora', sans-serif;
      `;

      const steps = getLegendColors(5);
      const interval = (max - min) / 5;

      div.innerHTML = `
        <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;font-family:'JetBrains Mono',monospace">
          Prediksi Miskin
        </div>
        ${steps
          .map((s, i) => {
            const val = Math.round(min + i * interval);
            return `
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
                <div style="width:14px;height:14px;border-radius:3px;background:${s.color};flex-shrink:0"></div>
                <span style="font-size:11px;color:#94a3b8">${val}${i === steps.length - 1 ? '+' : `–${Math.round(min + (i + 1) * interval)}`}</span>
              </div>
            `;
          })
          .join('')}
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05);font-size:10px;color:#475569;font-family:'JetBrains Mono',monospace">
          jiwa / grid km²
        </div>
      `;

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, min, max]);

  return null;
}
