import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  try {
    const body = await req.json();
    const { guru_id, jam_pulang } = body;

    if (!guru_id || !jam_pulang) {
      return NextResponse.json({ error: "Data kurang" }, { status: 400 });
    }

    // Pakai timezone Indonesia (WIB)
    const now = new Date();
    const tanggal = now.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

    // Update jam pulang
    const update = await supabase.from("absensi_guru").update({ jam_pulang }).eq("guru_id", guru_id).eq("tanggal", tanggal).select("*").maybeSingle();

    if ("error" in update && update.error) {
      return NextResponse.json({ error: update.error.message }, { status: 500 });
    }

    if (!("data" in update) || !update.data) {
      return NextResponse.json({ error: "Belum absen masuk hari ini" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
