'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { can } from '@/lib/permissions';

export async function moderatePost(id: number, status: 'approved' | 'hidden'): Promise<void> {
  const session = await auth();
  if (!can(session?.user?.role, 'post:moderate')) throw new Error('Không có quyền');
  // Kiểu TypeScript không được kiểm tra lúc chạy, nên kiểm tra lại giá trị
  if (status !== 'approved' && status !== 'hidden') return;

  const post = db.posts.find((p) => p.id === id);
  if (!post || post.status !== 'pending') return;
  post.status = status;

  revalidatePath('/admin');
  revalidatePath('/posts');
  revalidatePath('/');
  revalidatePath(`/posts/${id}`);
}
