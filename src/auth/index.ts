import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import Resend from "next-auth/providers/resend";
import type { Provider } from "next-auth/providers";

import {
  accounts,
  sessions,
  users,
  verificationTokens,
  authenticators,
} from "@/db/schema/auth";

const providers: Provider[] = [
  Resend({
    from: "no-reply@chessstake.com",
  }),
];

declare module "next-auth" {
  interface Session {
    user: {
      // Extra user information needed in the session
      hasProfile: boolean;
      board_state?: string;
      last_match?: Date;
      current_match?: number;
      active: boolean;

      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  callbacks: {
    authorized({ auth }) {
      return auth?.user !== undefined;
    },
  },
  providers,
} as const satisfies NextAuthConfig;

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      console.log("provider", provider);
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    }

    return { id: provider.id, name: provider.name };
  })
  .filter(
    (provider) => provider.id !== "credentials" && provider.id !== "resend",
  );

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
