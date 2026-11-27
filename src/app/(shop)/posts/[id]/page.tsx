import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { USERS } from '@/data/users';
import { formatDate } from '@/lib/format';
import { getPost, getPosts } from '@/lib/posts';
import { formatTime } from '@/lib/time';

export const revalidate = 30;

const BASE_URL = 'http://localhost:3000';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.slice(0, 10).map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(Number(id));
  if (!post) return { title: 'Không tìm thấy tin đăng' };

  const title = `${post.title} – ${post.place}`;
  return {
    title,
    description: post.description,
    openGraph: { title, description: post.description },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(Number(id));
  if (!post) notFound();

  const author = USERS.find((u) => u.email === post.authorEmail);
  const crumbs = [
    { name: 'Trang chủ', item: `${BASE_URL}/` },
    { name: 'Tin đăng', item: `${BASE_URL}/posts` },
    { name: post.title, item: `${BASE_URL}/posts/${post.id}` },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
  };

  return (
    <article>
      {/* Đổi ký tự < để nội dung người dùng nhập không thể đóng thẻ script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <h1>{post.title}</h1>
      <p>{`Loại tin: ${post.kind}`}</p>
      <p>{`Danh mục: ${post.category}`}</p>
      <p>{`Địa điểm: ${post.place}`}</p>
      <p>{`Ngày: ${formatDate(post.date)}`}</p>
      <p>{`Người đăng: ${author?.name ?? post.authorEmail}`}</p>
      <p className="description">{post.description}</p>
      <p>{`Cập nhật lúc: ${formatTime(new Date())}`}</p>
    </article>
  );
}
