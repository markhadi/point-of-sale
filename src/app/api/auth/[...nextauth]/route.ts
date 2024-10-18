import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { users } from '@/data/users';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const user = users.find(user => user.username === credentials?.username && user.password === credentials.password);
        if (user) {
          return { id: user.id, username: user.username, name: user.name, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role as string | undefined;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
