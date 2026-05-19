import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PovMap Indonesia — Poverty Prediction Dashboard',
  description:
    'Interactive Web GIS Dashboard for poverty prediction mapping across Indonesia at 1x1 km grid resolution.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
