'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Header() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();

  // Đăng nhập bằng Server Action không tải lại trang, nên phải đọc lại phiên
  // mỗi khi đổi đường dẫn để menu cập nhật ngay.
  useEffect(() => {
    void update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const user = session?.user;

  return (
    <header>
      <nav>
        <Link href="/">Trang chủ</Link>
        <Link href="/posts">Tin đăng</Link>
        {user ? (
          <>
            <Link href="/my-posts">Tin của tôi</Link>
            {user.role === 'admin' && <Link href="/admin">Quản trị</Link>}
            <span>{`Xin chào, ${user.name} (${user.role})`}</span>
            <button type="button" onClick={() => signOut({ redirectTo: '/' })}>
              Đăng xuất
            </button>
          </>
        ) : (
          status !== 'loading' && <Link href="/login">Đăng nhập</Link>
        )}
      </nav>
    </header>
  );
}
