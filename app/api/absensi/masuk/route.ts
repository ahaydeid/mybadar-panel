import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  try {
    const body = await req.json();
    const { guru_id, lat, lng, jam_masuk } = body;

    if (!guru_id || !jam_masuk) {
      return NextResponse.json({ error: "Data kurang" }, { status: 400 });
    }

    // Pakai timezone Indonesia (WIB)
    const now = new Date();
    const tanggal = now.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

    // Cek apakah sudah absen masuk
    const existing = await supabase.from("absensi_guru").select("id").eq("guru_id", guru_id).eq("tanggal", tanggal).maybeSingle();

    if ("error" in existing && existing.error) {
      return NextResponse.json({ error: existing.error.message }, { status: 500 });
    }

    if ("data" in existing && existing.data) {
      return NextResponse.json({ error: "Sudah absen masuk hari ini" }, { status: 400 });
    }

    // Insert
    const insert = await supabase
      .from("absensi_guru")
      .insert({
        guru_id,
        tanggal,
        jam_masuk,
        lat_masuk: lat ?? null,
        lng_masuk: lng ?? null,
      })
      .select("*"); // supabase hanya return error jika select dipanggil

    if ("error" in insert && insert.error) {
      return NextResponse.json({ error: insert.error.message }, { status: 500 });
    }

    if (!insert.data) {
      return NextResponse.json({ error: "Insert gagal (data kosong)" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
