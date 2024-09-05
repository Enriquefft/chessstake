import NextAuth, { type NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import Resend from "next-auth/providers/resend";

import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema/auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    authorized({ auth }) {
      return auth?.user !== undefined;
    },
  },
  providers: [
    Resend({
      from: "no-reply@toke.com",
    }),
  ],
} as const satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
