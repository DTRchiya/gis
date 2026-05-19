'use client';

import { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { PROVINCE_LIST } from '@/lib/geojson';
import { useMapStore } from '@/store/useMapStore';
import clsx from 'clsx';

export default function ProvinceSelector() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { selectedProvince, setSelectedProvince, provinceDataCache, setCurrentLayer, isPreloading } =
    useMapStore();

  const filtered = PROVINCE_LIST.filter((p) => p.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (name: string) => {
    const cached = provinceDataCache[name];
    if (cached) {
      setSelectedProvince(name);
      setCurrentLayer(cached);
    }
    setOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    setSelectedProvince(null);
    setCurrentLayer(null);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-xl',
          'bg-[#0f1623] border text-white',
          open ? 'border-blue-500/50' : 'border-white/10 hover:border-white/20'
        )}
        style={{ minWidth: 220 }}
      >
        <span className={clsx('flex-1 text-left', !selectedProvince && 'text-slate-500')}>
          {selectedProvince ?? 'Pilih Provinsi...'}
        </span>
        {selectedProvince ? (
          <X
            size={14}
            className="text-slate-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        ) : (
          <ChevronDown size={14} className={clsx('text-slate-400 transition-transform', open && 'rotate-180')} />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-1.5 w-64 bg-[#0f1623] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
            <Search size={13} className="text-slate-500 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Cari provinsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none font-mono"
            />
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-500 text-center">Tidak ditemukan</div>
            ) : (
              filtered.map((name) => {
                const isCached = !!provinceDataCache[name];
                const isSelected = selectedProvince === name;
                return (
                  <button
                    key={name}
                    onClick={() => handleSelect(name)}
                    disabled={!isCached}
                    className={clsx(
                      'w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors',
                      isSelected
                        ? 'bg-blue-500/10 text-blue-400'
                        : isCached
                        ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                        : 'text-slate-600 cursor-not-allowed'
                    )}
                  >
                    <span>{name}</span>
                    <span
                      className={clsx(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        isCached ? 'bg-green-400' : 'bg-slate-700'
                      )}
                    />
                  </button>
                );
              })
            )}
          </div>

          {isPreloading && (
            <div className="px-4 py-2 border-t border-white/[0.06] text-[10px] text-slate-600 font-mono">
              ● Loading data background...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
