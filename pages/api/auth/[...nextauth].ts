import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { dbConnect } from '../../../lib/dbConnect';
import { Admin } from '../../../models/Admin';
import { DefaultSession } from "next-auth"

// Add this type declaration to extend the session user type
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          if (!credentials?.email || !credentials.password) {
            throw new Error('Please enter email and password');
          }

          const admin = await Admin.findOne({ email: credentials.email });

          if (!admin) {
            throw new Error('No admin found with this email');
          }

          const isValid = await compare(credentials.password, admin.password);

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);