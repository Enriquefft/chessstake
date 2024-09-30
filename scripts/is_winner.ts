import { db } from "@/db";
import { matches } from "@/db/schema/matches";
import { eq } from "drizzle-orm";

import * as process from "process";
import chalk from "chalk";

/**
 *
 * @param match_id
 */
async function isWinner(match_id: number) {
  const userWon = (
    await db.query.matches.findFirst({
      where: eq(matches.id, match_id),
      columns: {
        userWon: true,
      },
    })
  )?.userWon;

  if (userWon === undefined || userWon === null) {
    return "NOT FOUND";
  }
  return userWon ? "YES" : "NO";
}

/**
 * Displays usage instructions for the CLI.
 */
function showUsage() {
  console.log(`
Usage: is-winner <match_id>

Check if a user has won a match by providing the match ID.

Arguments:
  match_id    The ID of the match to check.

Examples:
  is-winner 12345
`);
}

/**
 * Main function to execute the CLI logic.
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error(chalk.red("Error: Invalid number of arguments."));
    showUsage();
    process.exit(1);
  }

  const [matchIdStr] = args;
  const matchId = Number(matchIdStr);

  if (isNaN(matchId) || !Number.isInteger(matchId) || matchId <= 0) {
    console.error(
      chalk.red(
        `Error: Invalid match_id '${matchIdStr}'. It must be a positive integer.`,
      ),
    );
    showUsage();
    process.exit(1);
  }

  try {
    const result = await isWinner(matchId);
    switch (result) {
      case "YES":
        console.log(chalk.green.bold("YES"));
        break;
      case "NO":
        console.log(chalk.yellow.bold("NO"));
        break;
      case "NOT FOUND":
        console.log(chalk.red.bold("NOT FOUND"));
        break;
      default:
        // This case should never occur
        throw new Error("Unexpected result from is_winner function.");
    }
  } catch (error: unknown) {
    console.error(chalk.red(error));
    process.exit(1);
  }
}

await main();
