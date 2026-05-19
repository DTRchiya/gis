Letakkan file GeoJSON per provinsi di sini.
Nama file harus persis sama dengan PROVINCE_LIST di src/lib/geojson.ts

Contoh:
- Aceh.geojson
- Jawa Barat.geojson
- DKI Jakarta.geojson
- dst.

Format properties minimal:
{
  "id": 12345,
  "WADMPR": "Nama Provinsi",
  "WADMKK": "Nama Kabupaten/Kota",
  "pmiskin_grid": 42.5
}
