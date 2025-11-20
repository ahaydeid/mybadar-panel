import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/session/server";

export async function GET() {
  const session = await getSessionServer();
  return NextResponse.json(session);
}
