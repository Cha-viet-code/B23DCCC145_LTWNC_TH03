import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'PTIT Found', template: '%s | PTIT Found' },
  description: 'Tìm đồ thất lạc trong trường PTIT',
};

// Không gọi auth() ở đây: sẽ làm mọi trang thành dynamic
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
