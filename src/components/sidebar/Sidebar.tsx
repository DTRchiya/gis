'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Map, BarChart3, Activity } from 'lucide-react';
import { useMapStore } from '@/store/useMapStore';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/maps', icon: Map, label: 'Peta' },
  { href: '/analysis', icon: BarChart3, label: 'Analisis' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isPreloading, loadingProgress, selectedProvince } = useMapStore();

  const progressPct =
    loadingProgress.total > 0
      ? Math.round((loadingProgress.loaded / loadingProgress.total) * 100)
      : 0;

  return (
    <aside
      className="w-[240px] shrink-0 flex flex-col border-r border-white/[0.06]"
      style={{ background: '#0f1623' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <MapPin size={15} className="text-white" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold leading-none mb-0.5">Dashboard</div>
            <div className="text-slate-500 text-[10px] leading-none">Peta Estimasi Jumlah Penduduk Miskin Indonesia 2025</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="text-[10px] uppercase tracking-widest text-slate-600 px-2 mb-2 font-mono">
          Navigation
        </div>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Status panel */}
      <div className="px-4 py-4 border-t border-white/[0.06] space-y-3">
        {/* Preload progress */}
        {isPreloading && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Loading Data
              </span>
              <span className="text-[10px] text-blue-400 font-mono">{progressPct}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {loadingProgress.currentProvince && (
              <div className="text-[10px] text-slate-600 mt-1 truncate font-mono">
                {loadingProgress.currentProvince}
              </div>
            )}
          </div>
        )}

        {!isPreloading && loadingProgress.loaded > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] text-slate-500 font-mono">
              {loadingProgress.loaded} provinsi siap
            </span>
          </div>
        )}

        {/* Selected province */}
        {selectedProvince && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
              Active Layer
            </div>
            <div className="text-xs text-white font-medium">{selectedProvince}</div>
          </div>
        )}

        {/* Activity indicator */}
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <Activity size={10} className="text-slate-600" />
          <span className="font-mono">Dashboard aktif</span>
        </div>
      </div>
    </aside>
  );
}
