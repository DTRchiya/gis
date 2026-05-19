'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Grid3X3, TrendingDown, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, #ffffff 39px, #ffffff 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #ffffff 39px, #ffffff 40px)',
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <MapPin size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-wide">PovMap Indonesia</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/maps" className="hover:text-white transition-colors">
            Maps
          </Link>
          <a href="#methodology" className="hover:text-white transition-colors">
            Methodology
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Penelitian Spasial Kemiskinan Indonesia
        </div>

        <h1 className="text-6xl font-bold leading-[1.1] tracking-tight mb-6">
          Peta Prediksi
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400">
            Kemiskinan
          </span>
          <br />
          Indonesia
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mb-10">
          Dashboard Web GIS interaktif untuk visualisasi prediksi jumlah penduduk miskin pada resolusi
          grid <span className="text-white font-medium">1×1 kilometer</span> di seluruh wilayah Indonesia.
          Eksplorasi distribusi spasial kemiskinan dari skala nasional hingga kecamatan.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/maps"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            Explore Map
            <ArrowRight size={16} />
          </Link>
          <a
            href="#about"
            className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white px-6 py-3 rounded-xl text-sm transition-all"
          >
            Pelajari Metodologi
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-20">
          {[
            { icon: Grid3X3, label: 'Grid 1×1 km', value: '±1.9 Juta', sub: 'sel grid seluruh Indonesia' },
            { icon: MapPin, label: 'Provinsi', value: '34', sub: 'provinsi dicakup' },
            { icon: TrendingDown, label: 'Resolusi Spasial', value: '1 km²', sub: 'per unit analisis' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
            >
              <Icon size={18} className="text-blue-400 mb-3" />
              <div className="text-2xl font-bold mb-1">{value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</div>
              <div className="text-xs text-slate-600">{sub}</div>
            </div>
          ))}
        </div>

        {/* Research description */}
        <section id="about" className="mt-24 grid grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tentang Penelitian</h2>
            <p className="text-slate-400 leading-relaxed text-sm mb-4">
              Penelitian ini mengembangkan model prediksi kemiskinan berbasis data spasial dengan resolusi
              tinggi untuk Indonesia. Menggunakan pendekatan machine learning yang mengintegrasikan data
              citra satelit, sensus, dan statistik sosial ekonomi.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Hasil prediksi divisualisasikan dalam grid 1×1 km yang memungkinkan analisis distribusi
              kemiskinan secara spasial dengan presisi tinggi, mendukung perencanaan intervensi yang lebih
              terarah.
            </p>
          </div>

          <div id="methodology" className="space-y-3">
            <h2 className="text-2xl font-semibold mb-4">Metodologi</h2>
            {[
              { step: '01', title: 'Data Pengumpulan', desc: 'Integrasi data multi-sumber: BPS, Citra Satelit, dan data geospasial nasional' },
              { step: '02', title: 'Pemodelan Spasial', desc: 'Model prediksi berbasis machine learning dengan fitur spasial dan sosial ekonomi' },
              { step: '03', title: 'Validasi & Evaluasi', desc: 'Cross-validation spasial untuk memastikan akurasi prediksi antar wilayah' },
              { step: '04', title: 'Visualisasi GIS', desc: 'Choropleth interaktif pada grid 1×1 km di seluruh Indonesia' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <span className="text-xs font-mono text-blue-400 opacity-60 mt-0.5 shrink-0">{step}</span>
                <div>
                  <div className="text-sm font-medium mb-1">{title}</div>
                  <div className="text-xs text-slate-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-6 mt-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <span>© 2024 PovMap Indonesia. Penelitian Akademis.</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
