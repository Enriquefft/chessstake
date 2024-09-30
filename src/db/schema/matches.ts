import { boolean, pgEnum, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth.ts";
import { schema } from "./schema";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { levels } from "@/lib/utils";

export const aiLevelEnum = pgEnum("ai_level", levels);
export const colorEnum = pgEnum("color", ["white", "black"]);
export const matches = schema.table("matches", {
  id: serial("id").primaryKey(),
  userId: text("white_player")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userColor: colorEnum("color").notNull(),
  aiLevel: aiLevelEnum("ai_level").notNull(),
  played_at: timestamp("played_at", { mode: "date" }),

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
