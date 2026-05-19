'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapStore } from '@/store/useMapStore';
import { fetchBoundary } from '@/lib/geojson';
import { preloadAllProvinces } from '@/lib/preload';
import ProvinceLayer from './ProvinceLayer';
import ProvinceSelector from './ProvinceSelector';
import LoadingOverlay from './LoadingOverlay';

// Fix Leaflet default icon (Next.js issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Boundary layer component
function BoundaryLayer() {
  const map = useMap();
  const { boundaryData, setSelectedProvince, setCurrentLayer, provinceDataCache } = useMapStore();
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!boundaryData) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const layer = L.geoJSON(boundaryData as any, {
      style: {
        fillColor: '#1e3a5f',
        fillOpacity: 0.4,
        color: '#3b82f6',
        weight: 1,
        opacity: 0.5,
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.WADMPR;
        layer.on({
          click: () => {
            const cached = provinceDataCache[name];
            if (cached) {
              setSelectedProvince(name);
              setCurrentLayer(cached);
            }
          },
          mouseover: (e) => {
            (e.target as L.Path).setStyle({ fillOpacity: 0.6, weight: 2, opacity: 0.8 });
            if (name) {
              (e.target as L.Path).bindTooltip(name, {
                permanent: false,
                direction: 'center',
                className: 'province-tooltip',
              }).openTooltip();
            }
          },
          mouseout: (e) => {
            (e.target as L.Path).setStyle({ fillOpacity: 0.4, weight: 1, opacity: 0.5 });
          },
        });
      },
    });

    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current);
    };
  }, [boundaryData, map, provinceDataCache]);

  return null;
}

export default function MapView() {
  const {
    boundaryData,
    setBoundaryData,
    currentLayer,
    isPreloading,
    mapReady,
    setMapReady,
    loadingProgress,
  } = useMapStore();

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // Step 1: Load boundary
        const boundary = await fetchBoundary();
        setBoundaryData(boundary);
        setInitializing(false);
        setMapReady(true);

        // Step 2: Preload all provinces in background
        preloadAllProvinces();
      } catch (err) {
        console.error('Map init failed:', err);
        setInitializing(false);
      }
    }

    init();
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {initializing && <LoadingOverlay message="Memuat boundary Indonesia..." />}

      {/* Province selector */}
      {!initializing && <ProvinceSelector />}

      {/* Preload progress bar */}
      {isPreloading && (
        <div className="absolute top-0 left-0 right-0 z-[1000] h-0.5 bg-white/5">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${loadingProgress.total > 0 ? (loadingProgress.loaded / loadingProgress.total) * 100 : 0}%`,
            }}
          />
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Basemap */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='© OpenStreetMap, © CARTO'
        />

        {/* Boundary layer (always visible) */}
        {boundaryData && <BoundaryLayer />}

        {/* Active province layer */}
        {currentLayer && <ProvinceLayer data={currentLayer} />}

        {/* Attribution control custom */}
        <div className="leaflet-bottom leaflet-left">
          <div
            className="leaflet-control"
            style={{
              background: 'rgba(15,22,35,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '10px',
              color: '#475569',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            © OpenStreetMap · © CARTO
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
