"use client";

import type { SessionData } from "./server";

export async function getSessionClient(): Promise<SessionData | null> {
  const res = await fetch("/api/session", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  return res.json() as Promise<SessionData | null>;
}
