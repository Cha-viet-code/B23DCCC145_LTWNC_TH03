'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export interface LoginState {
  error?: string;
  email?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const callbackUrl = String(formData.get('callbackUrl') ?? '');
  // Chỉ cho chuyển tới đường dẫn nội bộ (chống open redirect)
  const redirectTo = /^\/(?![/\\])/.test(callbackUrl) ? callbackUrl : '/my-posts';

  try {
    await signIn('credentials', { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email hoặc mật khẩu không đúng', email };
    }
    throw error; // redirect() cũng là exception, phải ném lại
  }
  return {};
}
