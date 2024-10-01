import {
  boolean,
  timestamp,
  text,
  primaryKey,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

import type { AdapterAccountType } from "next-auth/adapters";
import { schema } from "./schema";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userLevelEnum = pgEnum("user_level_enum", [
  "principiante",
  "intermedio",
  "avanzado",
]);
const PHONE_LENGTH = 9;
const DNI_LENGTH = 8;

export const users = schema.table("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  hasProfile: boolean("hasProfile").default(false),
  board_state: text("board_state"),
  last_match: timestamp("last_match", { mode: "date" }),

  active: boolean("active").notNull().default(false),
});

export const profile = schema.table("profile", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  dni: text("dni").primaryKey(),
  username: text("username").unique().notNull(),
  phone: text("phone").unique().notNull(),
  level: userLevelEnum("level").notNull(),
});
export const profileInsertionSchema = createInsertSchema(profile, {
  phone: z.string().regex(new RegExp(`^\\d{${PHONE_LENGTH}}$`, "u"), {
    message: `Número de teléfono inválido, debe tener ${PHONE_LENGTH} dígitos`,
  }),
  dni: z.string().regex(new RegExp(`^\\d{${DNI_LENGTH}}$`, "u"), {
    message: `DNI inválido, debe tener ${DNI_LENGTH} dígitos`,
  }),
});
export type ProfileInsertion = typeof profile.$inferInsert;

export const userRelations = relations(users, ({ one }) => ({
  profile: one(profile),
}));
export const profileRelatiosn = relations(profile, ({ one }) => ({
  user: one(users, { fields: [profile.userId], references: [users.id] }),
}));

export const accounts = schema.table(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = schema.table("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = schema.table(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = schema.table(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  /*
   * (authenticator) => ({
   *   compositePK: primaryKey({
   *     columns: [authenticator.userId, authenticator.credentialID],
   *   }),
   * }),
   */
);
