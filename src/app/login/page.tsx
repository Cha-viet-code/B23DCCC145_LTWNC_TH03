import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Đăng nhập' };

interface Props {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect('/');
  const { callbackUrl = '/my-posts' } = await searchParams;

  return (
    <>
      <h1>Đăng nhập</h1>
      <LoginForm callbackUrl={callbackUrl} />
    </>
  );
}
