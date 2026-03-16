import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

const AUTHORIZED_GITHUB_ID = process.env.AUTHORIZED_GITHUB_ID ?? '';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    signIn({ profile }) {
      return profile?.login === AUTHORIZED_GITHUB_ID;
    },
  },
});
