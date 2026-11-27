import type { Category, Kind, Place, Post, PostStatus } from '../types';
import { db } from './db';
import type { PostInput } from './post-validate';

export interface MinePage {
  items: Post[];
  nextCursor: number | null;
  total: number;
}

export type ResolveResult = 'ok' | 'not-found' | 'forbidden' | 'not-approved';

export function parseStatus(v: unknown): PostStatus | undefined {
  return v === 'pending' || v === 'approved' || v === 'hidden' ? v : undefined;
}

export function listMine(
  email: string,
  status: PostStatus | '' | undefined,
  cursor = 0,
  size = 8,
): MinePage {
  const matched = db.posts.filter(
    (p) => p.authorEmail === email && (!status || p.status === status),
  );
  const items = matched.slice(cursor, cursor + size);
  const end = cursor + items.length;
  return { items, nextCursor: end < matched.length ? end : null, total: matched.length };
}

/** input phải được kiểm tra bằng validatePost trước khi gọi. */
export function submitPost(email: string, input: PostInput): Post {
  const post: Post = {
    id: db.nextPostId++,
    title: input.title.trim(),
    kind: input.kind as Kind,
    category: input.category as Category,
    place: input.place as Place,
    date: input.date,
    description:
      `${input.description.trim()}\nLiên hệ: ${input.contactType} ${input.contact.trim()}`,
    authorEmail: email,
    status: 'pending',
    resolved: false,
  };
  db.posts.unshift(post);
  return post;
}

export function resolvePost(email: string, id: number): ResolveResult {
  const post = db.posts.find((p) => p.id === id);
  if (!post) return 'not-found';
  if (post.authorEmail !== email) return 'forbidden';
  if (post.status !== 'approved') return 'not-approved';
  post.resolved = true;
  return 'ok';
}
