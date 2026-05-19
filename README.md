# PovMap Indonesia — Web GIS Dashboard

Interactive Web GIS Dashboard for Poverty Prediction Mapping in Indonesia.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Siapkan data GeoJSON

Letakkan file GeoJSON di:

```
public/
└── data/
    ├── boundary/
    │   └── indonesia.geojson     ← Boundary nasional (dissolve per provinsi)
    └── provinces/
        ├── Aceh.geojson
        ├── Bali.geojson
        ├── ...                   ← Satu file per provinsi
        └── Sumatera Utara.geojson
```

**Format boundary GeoJSON** (minimal properties):
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": { ... },
    "properties": {
      "WADMPR": "Jawa Barat"
    }
  }]
}
```

**Format province GeoJSON** (grid 1x1 km):
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": { ... },
    "properties": {
      "id": 12345,
      "WADMPR": "Jawa Barat",
      "WADMKK": "Bandung",
      "pmiskin_grid": 42.5
    }
  }]
}
```

### 3. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 4. Build untuk production

```bash
npm run build
npm run start
```

## Deployment ke Vercel

```bash
vercel deploy
```

Semua data GeoJSON diserve sebagai static files dari `/public/data/` — tidak ada backend yang diperlukan.

## Arsitektur

```
PRELOAD ALL → RENDER ONE
```

- Saat `/maps` dibuka: boundary nasional di-render, semua GeoJSON provinsi di-preload background
- Cache disimpan di Zustand store (in-memory)
- Klik provinsi → ambil dari cache, render layer aktif
- Layer lama dihapus sebelum layer baru dirender (memory management)

## Tech Stack

- **Next.js 14** — App Router, TypeScript
- **Leaflet + React Leaflet** — Map engine (client-side only)
- **Zustand** — State management & caching
- **chroma-js** — Dynamic color scale
- **Tailwind CSS** — Styling
- **Vercel** — Deployment
