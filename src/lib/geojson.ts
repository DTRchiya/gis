import { BoundaryGeoJSON, ProvinceGeoJSON } from '@/types/geojson';

export async function fetchBoundary(): Promise<BoundaryGeoJSON> {
  const res = await fetch('/data/boundary/indonesia.geojson');
  if (!res.ok) throw new Error('Failed to load boundary data');
  return res.json();
}

export async function fetchProvince(name: string): Promise<ProvinceGeoJSON> {
  const res = await fetch(`/data/provinces/${encodeURIComponent(name)}.geojson`);
  if (!res.ok) throw new Error(`Failed to load province: ${name}`);
  return res.json();
}

// List of all provinces (must match filenames in /public/data/provinces/)
export const PROVINCE_LIST = [
  'Aceh',
  'Bali',
  'Bangka Belitung',
  'Banten',
  'Bengkulu',
  'DI Yogyakarta',
  'DKI Jakarta',
  'Gorontalo',
  'Jambi',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Kalimantan Barat',
  'Kalimantan Selatan',
  'Kalimantan Tengah',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Kepulauan Riau',
  'Lampung',
  'Maluku',
  'Maluku Utara',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Papua',
  'Papua Barat',
  'Riau',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tengah',
  'Sulawesi Tenggara',
  'Sulawesi Utara',
  'Sumatera Barat',
  'Sumatera Selatan',
  'Sumatera Utara',
];
