import * as process from "process";
import { db } from "@/db";
import { users, profile } from "@/db/schema";
import { eq } from "drizzle-orm";

async function activateUserById(userId: string) {
  try {
    await db.update(users).set({ active: true }).where(eq(users.id, userId));
  } catch (error: unknown) {
    console.error(error);
    throw new Error(`Failed to activate user with id '${userId}'.`);
  }
}

async function activateUserByEmail(email: string) {
  try {
    await db.update(users).set({ active: true }).where(eq(users.email, email));
  } catch (error: unknown) {
    console.error(error);
    throw new Error(`Failed to activate user with email '${email}'.`);
  }
}

async function activateUserByPhone(phone: string) {
  const userId = (
    await db.query.profile.findFirst({
      where: eq(profile.phone, phone),
      columns: {
        userId: true,
      },
    })
  )?.userId;

  if (userId === undefined) {
    throw new Error(`Failed to activate user with phone number '${phone}'.`);
  }

  await activateUserById(userId);
}

async function activateUserByUsername(username: string) {
  const userId = (
    await db.query.profile.findFirst({
      where: eq(profile.username, username),
      columns: {
        userId: true,
      },
    })
  )?.userId;

  if (userId === undefined) {
    throw new Error(`Failed to activate user with username '${username}'.`);
  }

  await activateUserById(userId);
}

// Define allowed identifier types
const allowedTypes = ["id", "email", "phone", "username"] as const;
type IdentifierType = (typeof allowedTypes)[number];

// Function to display usage instructions
function showUsage() {
  console.log(`
Usage: activate-user <type> <value>

Activate a user by specifying the identifier type and its value.

Arguments:
  type    The type of identifier. Must be one of: ${allowedTypes.join(", ")}
  value   The value of the identifier.

Examples:
  activate-user id 12345
  activate-user email user@example.com
  activate-user phone +1234567890
  activate-user username johndoe
`);
}

// Main async function
async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Error: Invalid number of arguments.");
    showUsage();
    process.exit(1);
  }

  const [type, value] = args;

  if (value === undefined) {
    console.error("Error: Missing value.");
    showUsage();
    process.exit(1);
  }

  if (!allowedTypes.includes(type as IdentifierType)) {
    console.error(
      `Error: Invalid type '${type}'. Allowed types are: ${allowedTypes.join(", ")}.`,
    );
    showUsage();
    process.exit(1);
  }

  try {
    switch (type) {
      case "id":
        await activateUserById(value);
        console.log(`Success: User with id '${value}' has been activated.`);
        break;
      case "email":
        await activateUserByEmail(value);
        console.log(`Success: User with email '${value}' has been activated.`);
        break;
      case "phone":
        await activateUserByPhone(value);
        console.log(`Success: User with phone '${value}' has been activated.`);
        break;
      case "username":
        await activateUserByUsername(value);
        console.log(
          `Success: User with username '${value}' has been activated.`,
        );
        break;
      default:
        // This case should never occur due to earlier validation
        throw new Error(`Unsupported type: ${type}`);
    }
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
}

// Execute the main function
await main();
