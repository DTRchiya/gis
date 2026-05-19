'use client';

import { BeatLoader } from 'react-spinners';

interface Props {
  message?: string;
}

export default function LoadingOverlay({ message = 'Memuat data...' }: Props) {
  return (
    <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d1117]/90 backdrop-blur-sm">
      <BeatLoader color="#3b82f6" size={10} margin={4} />
      <p className="mt-4 text-sm text-slate-400 font-mono">{message}</p>
    </div>
  );
}
