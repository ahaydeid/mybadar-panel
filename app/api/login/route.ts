import { loginWithUsernamePassword } from "@/lib/proxy";
import { setSession } from "@/lib/session/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const cleanUsername = username.trim();

  const result = await loginWithUsernamePassword(cleanUsername, password);

  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 });
  }

  await setSession(result.session);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
