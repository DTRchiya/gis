import { create } from 'zustand';
import { BoundaryGeoJSON, ProvinceGeoJSON, ProvinceCache, LoadingProgress } from '@/types/geojson';

interface MapStore {
  // Boundary data
  boundaryData: BoundaryGeoJSON | null;
  setBoundaryData: (data: BoundaryGeoJSON) => void;

  // Province cache
  provinceDataCache: ProvinceCache;
  setProvinceCache: (name: string, data: ProvinceGeoJSON) => void;

  // Selected province
  selectedProvince: string | null;
  setSelectedProvince: (name: string | null) => void;

  // Current active layer data
  currentLayer: ProvinceGeoJSON | null;
  setCurrentLayer: (data: ProvinceGeoJSON | null) => void;

  // Loading state
  isPreloading: boolean;
  setIsPreloading: (v: boolean) => void;

  loadingProgress: LoadingProgress;
  setLoadingProgress: (p: LoadingProgress) => void;

  // Map ready
  mapReady: boolean;
  setMapReady: (v: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  boundaryData: null,
  setBoundaryData: (data) => set({ boundaryData: data }),

  provinceDataCache: {},
  setProvinceCache: (name, data) =>
    set((state) => ({
      provinceDataCache: { ...state.provinceDataCache, [name]: data },
    })),

  selectedProvince: null,
  setSelectedProvince: (name) => set({ selectedProvince: name }),

  currentLayer: null,
  setCurrentLayer: (data) => set({ currentLayer: data }),

  isPreloading: false,
  setIsPreloading: (v) => set({ isPreloading: v }),

  loadingProgress: { loaded: 0, total: 0, currentProvince: '' },
  setLoadingProgress: (p) => set({ loadingProgress: p }),

  mapReady: false,
  setMapReady: (v) => set({ mapReady: v }),
}));
