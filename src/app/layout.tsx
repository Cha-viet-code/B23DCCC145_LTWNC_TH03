import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'PTIT Found', template: '%s | PTIT Found' },
  description: 'Tìm đồ thất lạc trong trường PTIT',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <header>
          <nav>
            <Link href="/">Trang chủ</Link>
            <Link href="/posts">Tin đăng</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
