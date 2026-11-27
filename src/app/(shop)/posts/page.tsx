import type { Metadata } from 'next';
import Link from 'next/link';
import { KINDS } from '@/data/posts';
import { formatDate } from '@/lib/format';
import { getPosts, type PostSort } from '@/lib/posts';
import { formatTime } from '@/lib/time';

export const metadata: Metadata = { title: 'Tin đăng' };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) ?? '';

export default async function PostsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = first(params.q);
  const kind = KINDS.find((k) => k === first(params.kind));
  const sortValue = first(params.sort);
  const sort: PostSort | undefined =
    sortValue === 'date-desc' || sortValue === 'date-asc' ? sortValue : undefined;
  const posts = await getPosts({ q, kind, sort });

  return (
    <>
      <h1>Tin đang hiển thị</h1>
      <form className="filters" action="/posts" method="get">
        <label htmlFor="q">Tìm kiếm</label>
        <input id="q" name="q" defaultValue={q} />
        <label htmlFor="kind">Loại tin</label>
        <select id="kind" name="kind" defaultValue={kind ?? ''}>
          <option value="">Tất cả</option>
          {KINDS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <label htmlFor="sort">Sắp xếp</label>
        <select id="sort" name="sort" defaultValue={sort ?? ''}>
          <option value="">Mặc định</option>
          <option value="date-desc">Mới nhất</option>
          <option value="date-asc">Cũ nhất</option>
        </select>
        <button type="submit">Lọc</button>
      </form>

      <p>{`Có ${posts.length} tin đang hiển thị`}</p>
      <p>{`Render lúc: ${formatTime(new Date())}`}</p>

      {posts.length === 0 ? (
        <p>Không có tin nào phù hợp</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Loại tin</th>
              <th>Địa điểm</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td><Link href={`/posts/${p.id}`}>{p.title}</Link></td>
                <td>{p.kind}</td>
                <td>{p.place}</td>
                <td>{formatDate(p.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
