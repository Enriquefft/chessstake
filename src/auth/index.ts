import NextAuth, { type NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import Resend from "next-auth/providers/resend";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  adapter: DrizzleAdapter(db),
  callbacks: {
    authorized({ auth }) {
      return auth?.user !== undefined;
    },
  },
  providers: [Resend],
} as const satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
