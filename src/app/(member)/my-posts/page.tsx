import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin đăng của tôi',
  robots: { index: false },
};

export default function MyPostsPage() {
  return <h1>Tin đăng của tôi</h1>;
}
