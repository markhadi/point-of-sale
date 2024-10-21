import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { users } from '@/data/users';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = users.find(user => user.username === credentials?.username && user.password === credentials?.password);
        if (user) {
          return { id: user.id, username: user.username, name: user.name, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
