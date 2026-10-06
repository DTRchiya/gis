// Mapping nama provinsi dari JSON (huruf besar) ke nama file GeoJSON
// Data: jumlah penduduk miskin per provinsi (BPS)
const RAW_DATA: Record<string, number> = {
  'ACEH': 704690,
  'SUMATERA UTARA': 1140250,
  'SUMATERA BARAT': 312350,
  'RIAU': 460960,
  'JAMBI': 270940,
  'SUMATERA SELATAN': 919600,
  'BENGKULU': 252970,
  'LAMPUNG': 887020,
  'KEP. BANGKA BELITUNG': 77710,
  'KEP. RIAU': 117280,
  'DKI JAKARTA': 464870,
  'JAWA BARAT': 3654740,
  'JAWA TENGAH': 3366690,
  'DI YOGYAKARTA': 425820,
  'JAWA TIMUR': 3875880,
  'BANTEN': 772780,
  'BALI': 173240,
  'NUSA TENGGARA BARAT': 654570,
  'NUSA TENGGARA TIMUR': 1088780,
  'KALIMANTAN BARAT': 330950,
  'KALIMANTAN TENGAH': 147800,
  'KALIMANTAN SELATAN': 172720,
  'KALIMANTAN TIMUR': 199710,
  'KALIMANTAN UTARA': 42570,
  'SULAWESI UTARA': 173840,
  'SULAWESI TENGAH': 356190,
  'SULAWESI SELATAN': 698130,
  'SULAWESI TENGGARA': 304430,
  'GORONTALO': 162740,
  'SULAWESI BARAT': 152310,
  'MALUKU': 287760,
  'MALUKU UTARA': 77270,
  'PAPUA BARAT': 106900,
  'PAPUA BARAT DAYA': 103570,
  'PAPUA': 171380,
  'PAPUA SELATAN': 105530,
  'PAPUA TENGAH': 302310,
  'PAPUA PEGUNUNGAN': 337320,
};

// Lookup dengan nama GeoJSON (nama file / PROVINCE_LIST) → jumlah miskin
// Nama GeoJSON pakai Title Case, data JSON pakai ALL CAPS + singkatan berbeda
const GEOJSON_TO_JSON_MAP: Record<string, string> = {
  'Aceh': 'ACEH',
  'Bali': 'BALI',
  'Banten': 'BANTEN',
  'Bengkulu': 'BENGKULU',
  'Daerah Istimewa Yogyakarta': 'DI YOGYAKARTA',
  'DKI Jakarta': 'DKI JAKARTA',
  'Gorontalo': 'GORONTALO',
  'Jambi': 'JAMBI',
  'Jawa Barat': 'JAWA BARAT',
  'Jawa Tengah': 'JAWA TENGAH',
  'Jawa Timur': 'JAWA TIMUR',
  'Kalimantan Barat': 'KALIMANTAN BARAT',
  'Kalimantan Selatan': 'KALIMANTAN SELATAN',
  'Kalimantan Tengah': 'KALIMANTAN TENGAH',
  'Kalimantan Timur': 'KALIMANTAN TIMUR',
  'Kalimantan Utara': 'KALIMANTAN UTARA',
  'Kepulauan Bangka Belitung': 'KEP. BANGKA BELITUNG',
  'Kepulauan Riau': 'KEP. RIAU',
  'Lampung': 'LAMPUNG',
  'Maluku': 'MALUKU',
  'Maluku Utara': 'MALUKU UTARA',
  'Nusa Tenggara Barat': 'NUSA TENGGARA BARAT',
  'Nusa Tenggara Timur': 'NUSA TENGGARA TIMUR',
  'Papua': 'PAPUA',
  'Papua Barat': 'PAPUA BARAT',
  'Papua Barat Daya': 'PAPUA BARAT DAYA',
  'Papua Pegunungan': 'PAPUA PEGUNUNGAN',
  'Papua Selatan': 'PAPUA SELATAN',
  'Papua Tengah': 'PAPUA TENGAH',
  'Riau': 'RIAU',
  'Sulawesi Barat': 'SULAWESI BARAT',
  'Sulawesi Selatan': 'SULAWESI SELATAN',
  'Sulawesi Tengah': 'SULAWESI TENGAH',
  'Sulawesi Tenggara': 'SULAWESI TENGGARA',
  'Sulawesi Utara': 'SULAWESI UTARA',
  'Sumatera Barat': 'SUMATERA BARAT',
  'Sumatera Selatan': 'SUMATERA SELATAN',
  'Sumatera Utara': 'SUMATERA UTARA',
};

/**
 * Ambil jumlah penduduk miskin berdasarkan nama provinsi GeoJSON.
 * @param geoJsonName - nama provinsi sesuai PROVINCE_LIST / nama file .geojson
 * @returns jumlah jiwa atau null jika tidak ditemukan
 */
export function getPovertyCount(geoJsonName: string): number | null {
  const key = GEOJSON_TO_JSON_MAP[geoJsonName];
  if (!key) return null;
  return RAW_DATA[key] ?? null;
}

/**
 * Format angka ke format Indonesia (e.g. 1.140.250)
 */
export function formatJiwa(n: number): string {
  return n.toLocaleString('id-ID');
}
