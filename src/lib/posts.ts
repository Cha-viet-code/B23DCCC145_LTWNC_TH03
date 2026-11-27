import type { Kind, Post } from '../types';
import { db } from './db';

export type PostSort = 'date-desc' | 'date-asc';

export interface PostFilter {
  q?: string;
  kind?: Kind;
  sort?: PostSort;
}

const isPublic = (post: Post): boolean =>
  post.status === 'approved' && !post.resolved;

export async function getPosts({ q, kind, sort }: PostFilter = {}): Promise<Post[]> {
  // Giả lập truy vấn chậm
  await new Promise((r) => setTimeout(r, 600));

  const keyword = (q ?? '').trim().toLowerCase();
  // filter() trả về mảng mới nên sort() không làm đổi db.posts
  const result = db.posts.filter(
    (p) =>
      isPublic(p) &&
      p.title.toLowerCase().includes(keyword) &&
      (!kind || p.kind === kind),
  );
  if (sort === 'date-desc') result.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === 'date-asc') result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}

export async function getPost(id: number): Promise<Post | undefined> {
  return db.posts.find((p) => p.id === id && isPublic(p));
}
