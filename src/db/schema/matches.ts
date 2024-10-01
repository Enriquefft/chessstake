import { boolean, pgEnum, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth.ts";
import { schema } from "./schema";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const levels = ["baby", "easy", "medium", "hard"] as const;

export const aiLevelEnum = pgEnum("ai_level_enum", levels);

export const colorEnum = pgEnum("color", ["white", "black"]);
export const matches = schema.table("matches", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userColor: colorEnum("color").notNull(),
  aiLevel: aiLevelEnum("ai_level").notNull(),
  played_at: timestamp("played_at", { mode: "date" }).default(new Date()),
  match_pgn: text("match_pgn"),

  userWon: boolean("user_won"),
});
export const matchInsertionSchema = createInsertSchema(matches);
export type MatchInsertion = typeof matches.$inferInsert;

export const matchesRelations = relations(matches, ({ one }) => ({
  userId: one(users, {
    fields: [matches.userId],
    references: [users.id],
  }),
}));
