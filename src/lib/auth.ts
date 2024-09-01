"use server";
import { signIn as authSignIn } from "@/auth";

export async function signIn(form: FormData) {
  return authSignIn("resend", form);
}
