'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="post-form" action={formAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue={state.email} />
      </div>
      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" />
      </div>
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>Đăng nhập</button>
    </form>
  );
}
