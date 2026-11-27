import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import PostForm from '@/components/PostForm';
import { formatDate } from '@/lib/format';
import { listMine, parseStatus } from '@/lib/my-posts';
import type { PostStatus } from '@/types';
import { createPostAction, resolvePostAction } from './actions';

export const metadata: Metadata = {
  title: 'Tin đăng của tôi',
  robots: { index: false },
};

const PAGE_SIZE = 8;

const STATUS_LABELS: Record<PostStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đang hiển thị',
  hidden: 'Đã ẩn',
};

interface Props {
  searchParams: Promise<{ status?: string; limit?: string }>;
}

export default async function MyPostsPage({ searchParams }: Props) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect('/login?callbackUrl=%2Fmy-posts');

  const params = await searchParams;
  const status = parseStatus(params.status);
  const parsed = Number(params.limit);
  const limit = Number.isInteger(parsed) && parsed > 0 ? parsed : PAGE_SIZE;
  const { items, nextCursor, total } = listMine(email, status, 0, limit);

  return (
    <>
      <h1>Tin đăng của tôi</h1>
      <PostForm action={createPostAction} />

      <form className="filters" action="/my-posts" method="get">
        <label htmlFor="status">Trạng thái</label>
        <select id="status" name="status" defaultValue={status ?? ''}>
          <option value="">Tất cả</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit">Lọc</button>
      </form>

      <p>{`Hiển thị ${items.length} / ${total} tin`}</p>
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{formatDate(p.date)}</td>
              <td>{p.resolved ? 'Đã nhận lại' : STATUS_LABELS[p.status]}</td>
              <td>
                {p.status === 'approved' && !p.resolved && (
                  <form action={resolvePostAction.bind(null, p.id)}>
                    <button type="submit">Đánh dấu đã nhận lại</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {nextCursor !== null ? (
        <p>
          <Link href={`/my-posts?status=${status ?? ''}&limit=${limit + PAGE_SIZE}`} scroll={false}>
            Xem thêm
          </Link>
        </p>
      ) : (
        <p>Đã hiển thị hết tin</p>
      )}
    </>
  );
}
