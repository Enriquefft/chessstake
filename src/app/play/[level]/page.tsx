"use server";
import { ErrorType, getLevel, levelSchema } from "@/lib/utils";
import ChessGame from "./ChessGame";
import { db } from "@/db";
import { matches, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import ErrorPage from "@/components/error";
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
    return <ErrorPage type={ErrorType.PlayerNotFound} />;
  }

  if (!player.active) {
    return <ErrorPage type={ErrorType.PlayerNotActive} />;
  }

  const now = new Date();

  if (
    player.last_match &&
    now.getTime() - new Date(player.last_match).getTime() < WAITOUT_TIME
  ) {
    return <ErrorPage type={ErrorType.PlayerCanOnlyPlayEvery24Hours} />;
  }

  const levelName = levelSchema.parse(params.level);
  const level = getLevel(levelName);
  const userId = player.id;
  if (userId === undefined) {
    return null;
  }

  let matchId = player.current_match;
  if (matchId === undefined) {
    matchId = (
      await db
        .insert(matches)
        .values({
          userId,
          userColor: "white",
          aiLevel: levelName,
        })
        .returning({
          id: matches.id,
        })
    ).at(0)?.id;
  }

  await db
    .update(users)
    .set({
      current_match: matchId,
    })
    .where(eq(users.id, userId));

  const newMatchId = matchId;
  if (newMatchId === undefined) {
    throw new Error("Failed to create a new match");
  }

  return <ChessGame level={level} matchId={newMatchId} />;
}
