import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/format';
import { can } from '@/lib/permissions';
import type { PostStatus } from '@/types';
import { moderatePost } from './actions';

export const metadata: Metadata = {
  title: 'Kiểm duyệt tin đăng',
  robots: { index: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!can(session?.user?.role, 'post:moderate')) redirect('/forbidden');

  const count = (status: PostStatus) => db.posts.filter((p) => p.status === status).length;
  const pending = db.posts.filter((p) => p.status === 'pending');

  return (
    <>
      <h1>Kiểm duyệt tin đăng</h1>
      <p>
        {`Chờ duyệt: ${count('pending')} | Đang hiển thị: ${count('approved')} | Đã ẩn: ${count('hidden')}`}
      </p>
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Ngày</th>
            <th>Người đăng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{formatDate(p.date)}</td>
              <td>{p.authorEmail}</td>
              <td>
                <form action={moderatePost.bind(null, p.id, 'approved')}>
                  <button type="submit">Duyệt</button>
                </form>
                <form action={moderatePost.bind(null, p.id, 'hidden')}>
                  <button type="submit">Ẩn</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
