import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { USERS } from './data/users';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize(credentials) {
        const user = USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password,
        );
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  // Cần cho `npm start` trên localhost, nếu thiếu sẽ báo lỗi UntrustedHost
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      // user chỉ có ở lần đăng nhập đầu tiên
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});
