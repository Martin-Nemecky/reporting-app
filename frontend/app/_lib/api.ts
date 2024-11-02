import { User } from "./types";

// Auth API
type AccessToken = { access_token: string };

export async function signIn(username: string, password: string): Promise<AccessToken> {
  const result = await fetch("https://localhost:8080/api/auth", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });

  return result.json();
}

export async function getProfile(token: string): Promise<User> {
  const profile = await fetch("https://localhost:8080/api/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return profile.json();
}
