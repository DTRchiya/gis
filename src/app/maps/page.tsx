import dynamic from 'next/dynamic';
import Sidebar from '@/components/sidebar/Sidebar';

// Map MUST be loaded client-side only (no SSR)
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0d1117]">
      <div className="text-slate-500 text-sm font-mono">Initializing map engine...</div>
    </div>
  ),
});

export default function MapsPage() {
  return (
    <div className="flex h-screen bg-[#080c14] overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden">
        <MapView />
      </main>
    </div>
  );
}
