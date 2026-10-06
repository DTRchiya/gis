'use client';

import Sidebar from '@/components/sidebar/Sidebar';

/* ------------------------------------------------------------------ */
/* Data ringkas dari output notebook (pipeline revisi CRISP-DM)        */
/* ------------------------------------------------------------------ */

const RINGKASAN = [
  { label: 'Grid 1 km²', value: '1.969.024' },
  { label: 'Kab/kota dimodelkan', value: '514' },
  { label: 'Fitur final', value: '13 dari 20' },
  { label: 'R² uji (skala log)', value: '0,858' },
  { label: 'Total nasional', value: '23.854.910 jiwa' },
];

const TAHAPAN = [
  {
    judul: 'Data Understanding',
    isi: 'Data grid 1 km × 1 km seluruh Indonesia (1.969.102 baris) dipadukan dengan jumlah penduduk miskin resmi per kab/kota (514 kab/kota, satuan ribu jiwa dikali 1.000 menjadi jiwa). Nama kab/kota di dua sumber diseragamkan lewat kamus penggantian nama.',
  },
  {
    judul: 'Data Preparation',
    isi: 'Grid tanpa kab/kota dibuang (tersisa 1.969.024). Missing value ditangani per jenis variabel, fitur skewed ditransformasi log, lalu seluruh fitur dirata-ratakan ke level kab/kota dengan bobot luas grid.',
  },
  {
    judul: 'Modelling',
    isi: 'Random Forest Regressor dengan Grid Search dan K-Fold CV pada target log. Evaluasi memakai nested CV agar skor uji tidak bocor dari proses tuning.',
  },
  {
    judul: 'Evaluation',
    isi: 'Metrik dihitung dari prediksi out-of-fold seluruh kab/kota, dilaporkan pada tiga skala: log, jiwa per grid, dan total kab/kota.',
  },
  {
    judul: 'Deployment',
    isi: 'Model final memprediksi setiap grid, lalu total resmi kab/kota dibagi ke grid sesuai bobot prediksi. Hasilnya adalah jumlah penduduk miskin per grid (jiwa) yang tampil di halaman Peta.',
  },
];

const PERBAIKAN = [
  'Target model adalah rata-rata jiwa miskin per grid (jml_pmiskin ÷ luas kab/kota), selaras dengan fitur rata-rata per grid.',
  'Transformasi log dilakukan di level grid sebelum agregasi; agregasi dan redistribusi berbobot luas grid.',
  'Seleksi fitur otomatis berdasarkan korelasi antarfitur, tanpa melihat target sehingga tidak ada kebocoran data.',
  'Grid hyperparameter diperluas, karena pada versi awal nilai terbaik menempel di batas grid.',
  'Nested CV, adjusted R² dengan n yang benar, dan MAPE pada skala asli.',
];

const MISSING = [
  ['Kepadatan POI', 'diisi 0'],
  ['Jarak ke POI / pusat / pusat non-villa (d2poi, d2pusat, d2pusatnv)', 'diisi nilai maksimum kolom'],
  ['DEM, HSI, MODIS, NTL, Sentinel-2, Sentinel-5P, Slope', 'rata-rata provinsi (cadangan: rata-rata nasional)'],
  ['Luas grid (area_km²)', 'diisi 1 km², batas bawah 10⁻⁶'],
];

const FITUR_DIBUANG = [
  ['log_NTL_range', 'log_NTL_stdDev', '0,995'],
  ['S2_BUI', 'S2_NDVI', '0,979'],
  ['S2_NDVI', 'S2_NDWI', '0,979'],
  ['log_NTL_mean', 'log_NTL_stdDev', '0,979'],
  ['log_d2pusat_mean', 'log_d2pusatnv_mean', '0,929'],
  ['log_road_dense', 'log_d2poi_mean', '0,925'],
  ['log_d2poi_mean', 'log_POIdensity_sum', '0,902'],
];

const FITUR_FINAL = [
  'log_POIdensity_sum', 'DEM', 'HSI', 'MODIS_FVC', 'MODIS_LST', 'log_NTL_stdDev', 'S2_NDBI',
  'S2_NDWI', 'S5P_CO', 'S5P_NO2', 'S5P_SO2', 'Slope', 'log_d2pusatnv_mean',
];

const GRID_PARAM = [
  ['n_estimators', '300, 500'],
  ['max_depth', '8, 12, None'],
  ['min_samples_leaf', '1, 2, 4'],
  ['min_samples_split', '2, 5, 10'],
  ['max_features', '0,33; 0,5; 0,75'],
];

const FOLD = [
  [1, '0,9714', '0,8984', '0,5930', '0,4620'],
  [2, '0,9689', '0,8260', '0,7283', '0,4991'],
  [3, '0,9809', '0,8066', '0,6935', '0,5744'],
  [4, '0,9810', '0,8373', '0,6644', '0,5202'],
  [5, '0,9801', '0,9060', '0,5164', '0,4105'],
  [6, '0,9797', '0,8641', '0,7015', '0,5718'],
  [7, '0,9809', '0,8929', '0,5590', '0,4271'],
  [8, '0,9802', '0,8126', '0,7927', '0,5836'],
  [9, '0,9798', '0,8382', '0,7032', '0,5158'],
  [10, '0,9798', '0,8651', '0,6561', '0,5165'],
];

const METRIK = [
  ['Skala log (skala model)', '0,8577', '0,8540', '0,6656', '0,5082', '–'],
  ['Jiwa per grid (skala asli)', '0,7061', '0,6985', '90,22', '31,43', '61,16'],
  ['Total kab/kota (jiwa)', '0,6459', '0,6366', '30.473,64', '18.851,24', '61,16'],
];

// Nilai dibaca dari grafik feature importance (pembulatan visual)
const IMPORTANCE = [
  ['log_POIdensity_sum', 0.272],
  ['log_NTL_stdDev', 0.253],
  ['log_d2pusatnv_mean', 0.119],
  ['S5P_NO2', 0.081],
  ['MODIS_LST', 0.065],
  ['S2_NDBI', 0.057],
  ['HSI', 0.035],
  ['MODIS_FVC', 0.029],
  ['Slope', 0.025],
  ['S2_NDWI', 0.022],
  ['S5P_SO2', 0.016],
  ['DEM', 0.015],
  ['S5P_CO', 0.012],
] as const;

const DESKRIPTIF = [
  ['Jumlah penduduk miskin per kab/kota', '46.410', '1.590', '401.860', '2,34'],
  ['Penduduk miskin per grid (rata-rata kab/kota)', '76,6', '0,13', '1.429', '4,09'],
];

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8 pt-12 first:pt-0">
      <h2 className="text-xl font-semibold text-white mb-4 pb-3 border-b border-white/[0.06]">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-slate-400">{children}</div>
    </section>
  );
}

function Formula({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      {label && <div className="text-xs text-slate-500 mb-1.5">{label}</div>}
      <pre className="font-mono text-[13px] text-blue-300 whitespace-pre-wrap leading-relaxed">{children}</pre>
    </div>
  );
}

function Table({ head, rows, align = 'left' }: { head: string[]; rows: (string | number)[][]; align?: 'left' | 'right' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-white/[0.03] text-slate-300">
            {head.map((h, i) => (
              <th
                key={h}
                className={`px-3 py-2 font-medium whitespace-nowrap ${i === 0 || align === 'left' ? 'text-left' : 'text-right'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-white/[0.05]">
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={`px-3 py-2 ${ci === 0 || align === 'left' ? 'text-left' : 'text-right font-mono'} ${
                    ci === 0 ? 'text-slate-300' : ''
                  }`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TOC = [
  ['ringkasan', 'Ringkasan'],
  ['tahapan', 'Tahapan'],
  ['data', 'Data'],
  ['persiapan', 'Persiapan data'],
  ['fitur', 'Seleksi fitur'],
  ['model', 'Pemodelan'],
  ['evaluasi', 'Evaluasi'],
  ['deployment', 'Redistribusi ke grid'],
  ['catatan', 'Catatan'],
];

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function AnalysisPage() {
  return (
    <div className="flex h-screen bg-[#080c14] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">Analisis Estimasi Penduduk Miskin per Grid 1 km × 1 km</h1>
            <p className="text-sm leading-relaxed text-slate-400">
              Ringkasan metode dan hasil di balik peta. Jumlah penduduk miskin resmi tiap kab/kota diturunkan ke grid
              1 km² memakai model Random Forest yang dilatih dari data penginderaan jauh dan geospasial, dengan alur
              CRISP-DM.
            </p>
          </header>

          {/* Daftar isi */}
          <nav className="flex flex-wrap gap-2 mb-12">
            {TOC.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="px-3 py-1.5 rounded-full text-xs text-slate-400 border border-white/[0.08] hover:text-white hover:border-blue-500/40 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          <div>
            {/* RINGKASAN */}
            <Section id="ringkasan" title="Ringkasan hasil">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {RINGKASAN.map((s) => (
                  <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <div className="text-lg font-semibold text-white">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <p>
                Pada skala model (log), model menjelaskan sekitar 86% variasi antar kab/kota dalam pengujian
                out-of-fold. Setelah dikembalikan ke skala asli, R² turun menjadi 0,71 untuk jiwa per grid dan 0,65
                untuk total kab/kota. Hasil akhir tetap konsisten dengan data resmi: total tiap kab/kota hasil
                redistribusi sama persis dengan angka resmi.
              </p>
            </Section>

            {/* TAHAPAN */}
            <Section id="tahapan" title="Tahapan analisis">
              <ol className="space-y-4">
                {TAHAPAN.map((t, i) => (
                  <li key={t.judul} className="flex gap-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-slate-200 font-medium mb-0.5">{t.judul}</div>
                      <p>{t.isi}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="pt-2">
                <div className="text-slate-300 font-medium mb-2">Perubahan utama dibanding versi awal</div>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-slate-600">
                  {PERBAIKAN.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </Section>

            {/* DATA */}
            <Section id="data" title="Data">
              <p>
                Setiap grid memuat 20 kandidat fitur: kepadatan jalan dan POI, ketinggian dan kemiringan (DEM, Slope),
                indeks vegetasi dan lahan terbangun (MODIS FVC, Sentinel-2 BUI, NDBI, NDVI, NDWI), suhu permukaan
                (MODIS LST), cahaya malam (NTL), polutan Sentinel-5P (CO, NO₂, SO₂), HSI, dan jarak ke POI serta pusat
                kota. Target berasal dari jumlah penduduk miskin resmi per kab/kota.
              </p>
              <Table
                head={['Variabel (level kab/kota)', 'Rata-rata', 'Min', 'Maks', 'Skewness']}
                rows={DESKRIPTIF}
                align="right"
              />
              <p>
                Sebaran target sangat miring ke kanan (skewness 4,09 untuk jiwa per grid), sehingga model dilatih pada
                logaritma target.
              </p>
            </Section>

            {/* PERSIAPAN */}
            <Section id="persiapan" title="Persiapan data">
              <p>
                <span className="text-slate-300">Missing value.</span> Sisa missing value setelah pembersihan adalah
                nol. Aturan pengisian:
              </p>
              <Table head={['Variabel', 'Pengisian']} rows={MISSING} />
              <p>
                <span className="text-slate-300">Bobot luas.</span> Sebanyak 56.933 dari 1.969.024 grid berukuran
                kurang dari 0,5 km² (grid tepi pantai atau batas wilayah). Karena itu, agregasi dan redistribusi
                dibobot dengan luas grid.
              </p>
              <Formula label="Transformasi log di level grid (v = road_dense, POIdensity_sum, NTL_*, d2*)">
                {'log_v = ln(1 + max(v, 0))'}
              </Formula>
              <Formula label="Agregasi grid → kab/kota (rata-rata berbobot luas), untuk fitur x di kab/kota k">
                {'x̄ₖ = Σ(wᵢ · xᵢ) / Σ wᵢ ,   wᵢ = luas grid i (km²)\nLₖ = Σ wᵢ   (luas efektif kab/kota)'}
              </Formula>
              <Formula label="Variabel target">
                {'y_asli,k = jml_pmiskinₖ / Lₖ     (jiwa miskin per grid 1 km²)\ny_log,k   = ln(y_asli,k)'}
              </Formula>
            </Section>

            {/* FITUR */}
            <Section id="fitur" title="Seleksi fitur">
              <p>
                Fitur dengan korelasi mutlak antarfitur di atas 0,90 disaring secara iteratif: pada setiap langkah,
                pasangan dengan |r| tertinggi dicari, lalu fitur yang rata-rata korelasinya lebih besar dibuang.
                Target tidak dipakai, sehingga tidak ada kebocoran informasi.
              </p>
              <Table head={['Fitur dibuang', 'Pasangan', '|r|']} rows={FITUR_DIBUANG} />
              <div>
                <div className="text-slate-300 font-medium mb-2">13 fitur final</div>
                <div className="flex flex-wrap gap-1.5">
                  {FITUR_FINAL.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-xs text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Section>

            {/* MODEL */}
            <Section id="model" title="Pemodelan">
              <p>
                Model yang dipakai adalah Random Forest Regressor (random_state 42) dengan target y_log. Grid Search
                memilih kombinasi hyperparameter terbaik berdasarkan RMSE negatif.
              </p>
              <Table head={['Hyperparameter', 'Nilai yang dicoba']} rows={GRID_PARAM} />
              <p>
                <span className="text-slate-300">Nested CV.</span> Fold luar 10 untuk evaluasi, fold dalam 5 untuk
                tuning di tiap fold luar. Model final dituning dengan 10-fold CV pada seluruh data.
              </p>
              <Formula label="Parameter terbaik model final">
                {'n_estimators = 300      max_depth = None\nmin_samples_leaf = 1   min_samples_split = 2\nmax_features = 0,33\nRMSE CV (skala log) = 0,6572'}
              </Formula>
              <div>
                <div className="text-slate-300 font-medium mb-3">Kepentingan fitur</div>
                <div className="space-y-1.5">
                  {IMPORTANCE.map(([nama, v]) => (
                    <div key={nama} className="flex items-center gap-3">
                      <div className="w-40 shrink-0 font-mono text-xs text-slate-400 text-right truncate">{nama}</div>
                      <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(v / 0.28) * 100}%` }} />
                      </div>
                      <div className="w-10 text-xs font-mono text-slate-500">{v.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 mt-2">Nilai dibaca dari grafik feature importance di notebook.</p>
              </div>
              <p>
                Kepadatan POI dan variasi cahaya malam menyumbang lebih dari separuh kepentingan model, disusul jarak
                ke pusat kota non-villa dan NO₂.
              </p>
            </Section>

            {/* EVALUASI */}
            <Section id="evaluasi" title="Evaluasi">
              <Formula label="Metrik (n = jumlah kab/kota, p = jumlah fitur)">
                {'R²      = 1 − Σ(yᵢ − ŷᵢ)² / Σ(yᵢ − ȳ)²\nAdj R²  = 1 − (1 − R²) · (n − 1) / (n − p − 1)\nRMSE    = √( Σ(yᵢ − ŷᵢ)² / n )\nMAE     = Σ|yᵢ − ŷᵢ| / n\nMAPE    = 100% · Σ|(yᵢ − ŷᵢ) / yᵢ| / n'}
              </Formula>
              <p>Hasil uji out-of-fold (n = 514 kab/kota, p = 13 fitur):</p>
              <Table head={['Skala', 'R²', 'Adj R²', 'RMSE', 'MAE', 'MAPE (%)']} rows={METRIK} align="right" />
              <p>
                MAPE pada skala log tidak dilaporkan karena nilai log bisa mendekati nol atau negatif. Konversi ke
                skala asli dilakukan dengan ŷ = exp(ŷ_log), lalu dikali Lₖ untuk total kab/kota.
              </p>
              <div>
                <div className="text-slate-300 font-medium mb-2">Kestabilan antar fold luar</div>
                <Table
                  head={['Fold', 'R² train', 'R² test', 'RMSE test', 'MAE test']}
                  rows={FOLD}
                  align="right"
                />
                <p className="mt-3">
                  Rata-rata R² uji 0,8547 dengan simpangan baku 0,036 antar fold, RMSE uji 0,6608, dan MAE uji 0,5081.
                  R² latih rata-rata 0,9783 (Adj R² 0,9777), jauh di atas R² uji, yang lazim pada Random Forest dengan
                  pohon tak dibatasi.
                </p>
              </div>
            </Section>

            {/* DEPLOYMENT */}
            <Section id="deployment" title="Redistribusi ke grid">
              <p>
                Model memprediksi tiap grid, lalu total resmi kab/kota dibagi ke grid secara proporsional. Faktor
                konstanta hasil konversi balik dari log hilang saat normalisasi, sehingga cukup memakai exp(prediksi).
              </p>
              <Formula label="Bobot grid i di kab/kota k">
                {'bᵢ = exp(ŷ_log,i) · wᵢ'}
              </Formula>
              <Formula label="Jiwa miskin grid i (jiwa)">
                {'P̂ᵢ = ( bᵢ / Σⱼ∈k bⱼ ) · Pₖ\n\nPₖ = jumlah penduduk miskin resmi kab/kota k'}
              </Formula>
              <p>Validasi hasil redistribusi:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  ['Selisih maksimum grid vs resmi', '≈ 3 × 10⁻¹¹ jiwa'],
                  ['Total nasional (grid)', '23.854.910'],
                  ['Total nasional (resmi)', '23.854.910'],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <div className="text-sm font-semibold text-white">{v}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
              <p>
                Dari 1.969.024 grid, rata-rata hasil 12,1 jiwa per grid dengan median 2,4 dan maksimum 2.872,6 jiwa.
                Tidak ada grid yang tanpa total kab/kota.
              </p>
            </Section>

            {/* CATATAN */}
            <Section id="catatan" title="Catatan penggunaan">
              <ul className="list-disc pl-5 space-y-1.5 marker:text-slate-600">
                <li>
                  Model dilatih pada 514 kab/kota, bukan pada grid. Pola antar-kab/kota diterapkan ke grid, sehingga
                  sebaran dalam satu kab/kota adalah estimasi, bukan hasil pengukuran.
                </li>
                <li>
                  Akurasi paling kuat pada skala log. Pada skala asli kesalahan relatif masih cukup besar (MAPE
                  61,16%), jadi nilai per grid lebih tepat dibaca sebagai pola relatif.
                </li>
                <li>
                  Beberapa nilai terbaik pada model final berada di batas grid pencarian (max_features 0,33,
                  min_samples_leaf 1, min_samples_split 2, n_estimators 300), jadi pencarian dapat diperluas bila
                  diperlukan.
                </li>
                <li>
                  Hasil per grid dipakai di halaman Peta, dan total tiap kab/kota selalu sama dengan data resmi.
                </li>
              </ul>
            </Section>
          </div>

          <div className="h-16" />
        </div>
      </main>
    </div>
  );
}
