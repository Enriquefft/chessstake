"use server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * @param fen - The current board state in Forsyth-Edwards Notation (FEN)
 */
export async function storeUserFen(fen: string) {
  const user_id = (await auth())?.user.id;
  if (user_id === undefined) {
    throw new Error("User not found");
  }

  await db.update(users).set({ board_state: fen }).where(eq(users.id, user_id));
}

/**
 * Retrieve the current board state in Forsyth-Edwards Notation (FEN) for the current user
 * @returns The current board state in Forsyth-Edwards Notation (FEN)
 */
export async function getUserFen() {
  const user = (await auth())?.user;
  if (user === undefined) {
    throw new Error("User not found");
  }
  return user.board_state;
}
