"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../_lib/session";
import { getProfile, signIn } from "../_lib/api";
import { Profile } from "../_lib/types";

export async function logIn(username: string, password: string): Promise<Profile> {
  const signInResult = await signIn(username, password);
  // console.log(`Log in: ${JSON.stringify(signInResult)}`);
  const profile = await getProfile(signInResult.accessToken);

  await createSession(profile.id, signInResult.accessToken);
  return profile;
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}
