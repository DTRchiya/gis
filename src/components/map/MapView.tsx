'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapStore } from '@/store/useMapStore';
import { fetchBoundary } from '@/lib/geojson';
import { preloadAllProvinces } from '@/lib/preload';
import { getPovertyCount, formatJiwa } from '@/lib/povertyData';
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

// Boundary layer — klik untuk load data grid, hover untuk jumlah miskin
function BoundaryLayer() {
  const map = useMap();
  const {
    boundaryData,
    setSelectedProvince,
    setCurrentLayer,
    setProvinceCache,
    provinceDataCache,
  } = useMapStore();
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
        // Nama provinsi dari GeoJSON property — coba beberapa key umum
        const name: string =
          feature.properties?.WADMPR ??
          feature.properties?.provinsi ??
          feature.properties?.PROVINSI ??
          '';

        layer.on({
          // Klik → load grid data provinsi (sama seperti pilih dropdown)
          click: async () => {
            const cached = provinceDataCache[name];
            if (cached) {
              setSelectedProvince(name);
              setCurrentLayer(cached);
              return;
            }
            // Fetch on demand jika belum di-cache
            setSelectedProvince(name);
            try {
              const { fetchProvince } = await import('@/lib/geojson');
              const data = await fetchProvince(name);
              setProvinceCache(name, data);
              setCurrentLayer(data);
            } catch (err) {
              console.error(`Gagal load provinsi: ${name}`, err);
              setSelectedProvince(null);
            }
          },

          // Hover → tooltip nama + jumlah penduduk miskin
          mouseover: (e) => {
            (e.target as L.Path).setStyle({
              fillOpacity: 0.65,
              weight: 2,
              color: '#60a5fa',
              opacity: 0.9,
            });

            const poverty = getPovertyCount(name);
            const tooltipContent = `
              <div style="
                font-family: 'JetBrains Mono', monospace;
                background: #0f1623;
                border: 1px solid rgba(255,255,255,0.10);
                border-radius: 10px;
                padding: 10px 13px;
                min-width: 180px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
              ">
                <div style="font-size:12px;font-weight:600;color:#f1f5f9;margin-bottom:6px;">
                  ${name || '—'}
                </div>
                <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:2px;">
                  Penduduk Miskin
                </div>
                <div style="font-size:16px;font-weight:700;color:#3b82f6;">
                  ${poverty !== null ? formatJiwa(poverty) : '—'}
                  <span style="font-size:10px;color:#64748b;font-weight:400"> jiwa</span>
                </div>
              </div>
            `;

            (e.target as L.Path)
              .bindTooltip(tooltipContent, {
                permanent: false,
                direction: 'top',
                offset: [0, -4],
                opacity: 1,
                className: 'province-hover-tooltip',
              })
              .openTooltip();
          },

          mouseout: (e) => {
            (e.target as L.Path).setStyle({
              fillOpacity: 0.4,
              weight: 1,
              color: '#3b82f6',
              opacity: 0.5,
            });
            (e.target as L.Path).unbindTooltip();
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
    setMapReady,
    loadingProgress,
  } = useMapStore();

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const boundary = await fetchBoundary();
        setBoundaryData(boundary);
        setInitializing(false);
        setMapReady(true);
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
              width: `${
                loadingProgress.total > 0
                  ? (loadingProgress.loaded / loadingProgress.total) * 100
                  : 0
              }%`,
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
        {/* Basemap — CARTO kini mewajibkan API key gratis, jika tidak ada tile akan
            muncul watermark "API KEY REQUIRED". Ambil key gratis di
            https://carto.com/basemaps/apikey lalu isi NEXT_PUBLIC_CARTO_API_KEY di .env.local */}
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${
            process.env.NEXT_PUBLIC_CARTO_API_KEY
              ? `?key=${process.env.NEXT_PUBLIC_CARTO_API_KEY}`
              : ''
          }`}
          attribution="© OpenStreetMap, © CARTO"
        />

        {/* Boundary layer — selalu tampil, bisa diklik & hover */}
        {boundaryData && <BoundaryLayer />}

        {/* Active province grid layer */}
        {currentLayer && <ProvinceLayer data={currentLayer} />}

        {/* Attribution */}
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
