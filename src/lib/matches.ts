"use server";
import { matches } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

/**
 * Update a match PGn and whether the user won
 * @param match_id - The ID of the match
 * @param pgn - The PGN of the match
 * @param userWon - Whether the user won the match or the AI
 */
export async function updateMatch(
  match_id: number,
  pgn: string,
  userWon: boolean,
) {
  await db
    .update(matches)
    .set({ match_pgn: pgn, userWon })
    .where(eq(matches.id, match_id));
}
