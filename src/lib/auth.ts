"use server";
import { signIn as authSignIn } from "@/auth";

import { type ProfileInsertion, profile, users } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

/**
 *
 * @param form
 */
export async function signIn(form: FormData) {
  return authSignIn("resend", form);
}

/**
 *
 * @param userId
 * @param profileData
 */
export async function setUserProfile(
  userId: string,
  profileData: Omit<ProfileInsertion, "userId">,
) {
  await db.insert(profile).values({
    userId,
    ...profileData,
  });
  await db
    .update(users)
    .set({
      hasProfile: true,
    })
    .where(eq(users.id, userId));
}
