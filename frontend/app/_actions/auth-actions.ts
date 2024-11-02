"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../_lib/session";
import { getProfile, signIn } from "../_lib/api";

export async function logIn(username: string, password: string) {
  const signInResult = await signIn(username, password);
  const user = await getProfile(signInResult.access_token);
  await createSession(user.id);
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}
