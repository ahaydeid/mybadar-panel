"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { CalendarPlus, FileDown } from "lucide-react";

type AbsenSesi = {
  tanggal: string;
  jadwal_id: number;
  sakit: number[] | null;
  izin: number[] | null;
  alfa: number[] | null;
};

type RekapItem = {
  id: number;
  nama: string;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
};

export default function RekapAbsensiKelasPage() {
  const params = useParams();
  const router = useRouter();
  const kelasId = Number(params.id);

  const [kelasNama, setKelasNama] = useState("");
  const [list, setList] = useState<RekapItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [groupByDate, setGroupByDate] = useState<Record<string, AbsenSesi[]>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // === Ambil nama kelas ===
      const { data: kelasData } = await supabase.from("kelas").select("nama_rombel").eq("id", kelasId).single();

      setKelasNama(kelasData?.nama_rombel ?? "");

      // === 1. SISWA ===
      const { data: siswa } = await supabase.from("siswa").select("id, nama").eq("kelas_id", kelasId).order("nama");

      if (!siswa) return setLoading(false);

      // === 2. JADWAL ===
      const { data: jadwal } = await supabase.from("jadwal").select("id").eq("kelas_id", kelasId);

      const jadwalIds = (jadwal ?? []).map((j) => j.id);

      // === 3. ABSENSI ===
      const { data: absenRaw } = await supabase.from("absensi_sesi").select("jadwal_id, tanggal, sakit, izin, alfa").in("jadwal_id", jadwalIds);

      const absen: AbsenSesi[] = absenRaw ?? [];

      // === GROUP PER TANGGAL ===
      const gb: Record<string, AbsenSesi[]> = {};
      absen.forEach((a) => {
        if (!gb[a.tanggal]) gb[a.tanggal] = [];
        gb[a.tanggal].push(a);
      });

      setGroupByDate(gb);

      // === LIST TANGGAL SORTING: terbaru → terlama ===
      const dateKeys = Object.keys(gb).sort((a, b) => (a < b ? 1 : -1));

      // === BUAT REKAP TOTAL ===
      const hasil: RekapItem[] = siswa.map((s) => {
        let sakit = 0;
        let izin = 0;
        let alfa = 0;
        let hadir = 0;

        dateKeys.forEach((tanggal) => {
          const sesiList = gb[tanggal];

          const isSakit = sesiList.some((a) => a.sakit?.includes(s.id));
          const isIzin = sesiList.some((a) => a.izin?.includes(s.id));
          const isAlfa = sesiList.some((a) => a.alfa?.includes(s.id));

          if (isSakit) sakit++;
          else if (isIzin) izin++;
          else if (isAlfa) alfa++;
          else hadir++;
        });

        return { id: s.id, nama: s.nama, sakit, izin, alfa, hadir };
      });

      setList(hasil);
      setLoading(false);
    };

    load();
  }, [kelasId]);

  const fmtHeaderDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Daftar tanggal (sudah dari paling baru ke lama)
  const tanggalList = Object.keys(groupByDate).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Rekap Absensi <span className="text-sky-600">{kelasNama}</span>
          </h1>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-2" onClick={() => router.push(`/kelas/absensi/backdate`)}>
            <CalendarPlus className="w-5 h-5" />
            Tambah Absen Backdate
          </button>

          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2" onClick={() => alert("Export belum dibuat")}>
            <FileDown className="w-5 h-5" />
            Export Absensi
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-center">No</th>
              <th className="p-2 border">Nama</th>

              {/* Rekap total */}
              <th className="p-2 border bg-green-500 text-white text-center">Hadir</th>
              <th className="p-2 border bg-yellow-400 text-white text-center">Sakit</th>
              <th className="p-2 border bg-sky-500 text-white text-center">Izin</th>
              <th className="p-2 border bg-red-500 text-white text-center">Alfa</th>

              {/* Kolom TANGGAL */}
              {tanggalList.map((tgl) => (
                <th key={tgl} className="p-2 border min-w-[70px] text-center">
                  {fmtHeaderDate(tgl)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {list.map((s, i) => (
              <tr key={s.id} className="border">
                <td className="p-2 border text-center">{i + 1}</td>
                <td className="p-2 border">{s.nama}</td>

                {/* Rekap */}
                <td className="p-2 border text-center">{s.hadir || "-"}</td>
                <td className="p-2 border text-center">{s.sakit || "-"}</td>
                <td className="p-2 border text-center">{s.izin || "-"}</td>
                <td className="p-2 border text-center">{s.alfa || "-"}</td>

                {/* STATUS PER TANGGAL */}
                {tanggalList.map((tgl) => {
                  const sesi = groupByDate[tgl];

                  const isSakit = sesi.some((a) => a.sakit?.includes(s.id));
                  const isIzin = sesi.some((a) => a.izin?.includes(s.id));
                  const isAlfa = sesi.some((a) => a.alfa?.includes(s.id));

                  let badge = "-";
                  let cls = "text-gray-400";

                  if (isSakit) {
                    badge = "S";
                    cls = "bg-yellow-400 text-white px-2 py-1 rounded";
                  } else if (isIzin) {
                    badge = "I";
                    cls = "bg-sky-500 text-white px-2 py-1 rounded";
                  } else if (isAlfa) {
                    badge = "A";
                    cls = "bg-red-500 text-white px-2 py-1 rounded";
                  } else {
                    badge = "H";
                    cls = "bg-green-600 text-white px-2 py-1 rounded";
                  }

                  return (
                    <td key={tgl} className="p-2 border text-center">
                      <span className={cls}>{badge}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
