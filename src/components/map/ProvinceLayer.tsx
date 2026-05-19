'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { ProvinceGeoJSON, GridFeature } from '@/types/geojson';
import { getColor } from '@/lib/colors';
import { classifyData } from '@/lib/classification';
import Legend from './Legend';
import { useState } from 'react';

interface Props {
  data: ProvinceGeoJSON;
}

export default function ProvinceLayer({ data }: Props) {
  const map = useMap();
  const layerRef = useRef<L.GeoJSON | null>(null);
  const [stats, setStats] = useState({ min: 0, max: 100 });

  useEffect(() => {
    // Remove previous layer before adding new one (critical for memory)
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!data || !data.features?.length) return;

    const classification = classifyData(data.features as GridFeature[]);
    const { min, max } = classification;
    setStats({ min, max });

    const layer = L.geoJSON(data as any, {
      style: (feature) => {
        const value = (feature?.properties?.pmiskin_grid as number) ?? 0;
        return {
          fillColor: getColor(value, min, max),
          fillOpacity: 0.75,
          color: 'transparent',
          weight: 0,
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as GridFeature['properties'];
        layer.bindPopup(
          `
          <div style="padding:12px 14px">
            <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;font-family:'JetBrains Mono',monospace">
              Info Grid
            </div>
            <div style="margin-bottom:4px">
              <span style="font-size:10px;color:#475569">Provinsi</span>
              <div style="font-size:13px;font-weight:500;color:#f1f5f9">${props?.WADMPR ?? '—'}</div>
            </div>
            <div style="margin-bottom:4px">
              <span style="font-size:10px;color:#475569">Kabupaten/Kota</span>
              <div style="font-size:13px;font-weight:500;color:#f1f5f9">${props?.WADMKK ?? '—'}</div>
            </div>
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.06)">
              <span style="font-size:10px;color:#475569">Prediksi Penduduk Miskin</span>
              <div style="font-size:20px;font-weight:700;color:#3b82f6;font-family:'JetBrains Mono',monospace">
                ${props?.pmiskin_grid?.toLocaleString('id-ID') ?? '—'}
                <span style="font-size:11px;color:#64748b;font-weight:400"> jiwa</span>
              </div>
            </div>
          </div>
        `,
          { maxWidth: 250, className: 'custom-popup' }
        );

        // Hover highlight
        layer.on({
          mouseover: (e) => {
            (e.target as L.Path).setStyle({ fillOpacity: 1, weight: 1, color: '#ffffff30' });
          },
          mouseout: (e) => {
            (e.target as L.Path).setStyle({ fillOpacity: 0.75, weight: 0, color: 'transparent' });
          },
        });
      },
    });

    layer.addTo(map);
    layerRef.current = layer;

    // Fit bounds to the new province
    try {
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 10 });
      }
    } catch {}

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [data, map]);

  return <Legend min={stats.min} max={stats.max} />;
}
