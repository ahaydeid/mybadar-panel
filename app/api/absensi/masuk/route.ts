import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CorsHeaders = {
  "Access-Control-Allow-Origin": "https://my-badar.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Preflight handler
export function OPTIONS() {
  return NextResponse.json({}, { headers: CorsHeaders });
}

export async function POST(req: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  try {
    const body = await req.json();
    const { guru_id, lat, lng, jam_masuk } = body;

    if (!guru_id || !jam_masuk) {
      return NextResponse.json({ error: "Data kurang" }, { status: 400, headers: CorsHeaders });
    }

    const now = new Date();
    const tanggal = now.toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });

    const existing = await supabase.from("absensi_guru").select("id").eq("guru_id", guru_id).eq("tanggal", tanggal).maybeSingle();

    if (existing.error) {
      return NextResponse.json({ error: existing.error.message }, { status: 500, headers: CorsHeaders });
    }

    if (existing.data) {
      return NextResponse.json({ error: "Sudah absen masuk hari ini" }, { status: 400, headers: CorsHeaders });
    }

    const insert = await supabase
      .from("absensi_guru")
      .insert({
        guru_id,
        tanggal,
        jam_masuk,
        lat_masuk: lat ?? null,
        lng_masuk: lng ?? null,
      })
      .select("*")
      .maybeSingle();

    if (insert.error) {
      return NextResponse.json({ error: insert.error.message }, { status: 500, headers: CorsHeaders });
    }

    return NextResponse.json({ success: true }, { headers: CorsHeaders });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CorsHeaders });
  }
}
