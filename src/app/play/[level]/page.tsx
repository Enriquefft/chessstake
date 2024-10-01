"use server";
import { getLevel, levelSchema } from "@/lib/utils";
import ChessGame from "./ChessGame";
import { db } from "@/db";
import { matches } from "@/db/schema";
import { auth } from "@/auth";
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const WAITOUT_TIME = 1000 * 60 * 60 * 24; // 24 Hours in milliseconds for getTime() comparison

/**
 * @param args - Page arguments
 * @param args.params - URL path parameters
 * @param args.params.level - Level of the AI
 * @returns Page component
 */
export default async function ChessPage({
  params,
}: {
  params: { level: string };
}) {
  const player = (await auth())?.user;

  if (!player) {
    throw new Error("Player not found");
  }

  if (!player.active) {
    throw new Error("Player is not active");
  }

  const now = new Date();

  if (
    player.last_match &&
    now.getTime() - new Date(player.last_match).getTime() < WAITOUT_TIME
  ) {
    throw new Error("Player can only play every 24 hours");
  }

  const levelName = levelSchema.parse(params.level);
  const level = getLevel(levelName);
  const userId = player.id;
  if (userId === undefined) {
    return null;
  }

  const [newMatch] = await db
    .insert(matches)
    .values({
      userId,
      userColor: "white",
      aiLevel: levelName,
    })
    .returning({
      id: matches.id,
    });
  const newMatchId = newMatch?.id;
  if (newMatchId === undefined) {
    throw new Error("Failed to create a new match");
  }

  return <ChessGame level={level} matchId={newMatchId} />;
}
