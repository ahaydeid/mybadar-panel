// lib/session/server.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionData = {
  userId: number;
  role: string;
  name: string;
};

export async function setSession(session: SessionData) {
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionServer(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session");
  if (!raw) return null;

  try {
    return JSON.parse(raw.value) as SessionData;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSessionServer();
  if (!session) redirect("/auth/login");
  return session;
}
