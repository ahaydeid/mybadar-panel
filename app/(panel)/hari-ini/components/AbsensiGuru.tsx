"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import LokasiAbsenModal from "./LokasiAbsenModal";

import { StatusType, DbAbsenRow, GuruRow, HariRow, SemesterRow, JadwalRow, JamRow, MapelRow, AbsenGuru } from "@/types/absensi";

function getStatus(jadwalMasuk: string, jamMasuk: string | null): StatusType {
  if (!jamMasuk) return "TIDAK HADIR";

  if (!/^\d{2}:\d{2}/.test(jadwalMasuk)) return "HADIR";

  const [jh, jm] = jadwalMasuk.split(":").map(Number);
  const [ah, am] = jamMasuk.split(":").map(Number);

  const jadwalMinutes = jh * 60 + jm;
  const absenMinutes = ah * 60 + am;

  return absenMinutes <= jadwalMinutes ? "HADIR" : "TERLAMBAT";
}

const HARI_IDN: string[] = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function AbsensiGuru() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AbsenGuru[]>([]);
  const [search, setSearch] = useState("");

  const [detail, setDetail] = useState<{
    nama: string | null;
    mapel: string | null;
    jamMasuk: string | null;
    status: StatusType | null;
    lat: number | null;
    lng: number | null;
  }>({
    nama: null,
    mapel: null,
    jamMasuk: null,
    status: null,
    lat: null,
    lng: null,
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // FIX: tanggal lokal
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      // URUTAN TERBARU DI ATAS
      const { data: absen } = await supabase
        .from("absensi_guru")
        .select("*")
        .eq("tanggal", today)
        .order("id", { ascending: false }) // ⬅ tambahkan ini
        .returns<DbAbsenRow[]>();

      if (!absen || absen.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      const guruIds = Array.from(new Set(absen.map((a) => a.guru_id)));

      const { data: guruData } = await supabase.from("guru").select("id,nama").in("id", guruIds).returns<GuruRow[]>();

      const { data: semesterData } = await supabase.from("semester").select("id,status").eq("status", "ACTIVE").returns<SemesterRow[]>();

      const activeSemesterId = semesterData && semesterData.length > 0 ? semesterData[0].id : null;

      const { data: hariData } = await supabase.from("hari").select("id,nama").returns<HariRow[]>();

      const hariByName = new Map<string, number>();
      (hariData ?? []).forEach((h) => hariByName.set(h.nama.toLowerCase(), h.id));

      const hariIdsUsed = new Set<number>();
      const hariIdPerAbsen = new Map<number, number | null>();

      absen.forEach((row) => {
        const date = new Date(row.tanggal);
        const jsDay = date.getDay();
        const namaHari = HARI_IDN[jsDay];
        const hariId = hariByName.get(namaHari.toLowerCase()) ?? null;
        if (hariId !== null) hariIdsUsed.add(hariId);
        hariIdPerAbsen.set(row.id, hariId);
      });

      let jadwal: JadwalRow[] = [];
      if (activeSemesterId !== null && hariIdsUsed.size > 0) {
        const { data: jadwalData } = await supabase
          .from("jadwal")
          .select("id,guru_id,hari_id,jam_id,mapel_id,semester_id")
          .in("guru_id", guruIds)
          .in("hari_id", Array.from(hariIdsUsed))
          .eq("semester_id", activeSemesterId)
          .returns<JadwalRow[]>();

        jadwal = jadwalData ?? [];
      }

      const jamIds = Array.from(new Set(jadwal.map((j) => j.jam_id)));
      const { data: jamData } = await supabase.from("jam").select("id,jam_mulai,jam_selesai").in("id", jamIds).returns<JamRow[]>();

      const jamById = new Map<number, JamRow>();
      (jamData ?? []).forEach((j) => jamById.set(j.id, j));

      const mapelIds = Array.from(new Set(jadwal.map((j) => j.mapel_id)));
      const { data: mapelData } = await supabase.from("mata_pelajaran").select("id,nama").in("id", mapelIds).returns<MapelRow[]>();

      const mapelById = new Map<number, MapelRow>();
      (mapelData ?? []).forEach((m) => mapelById.set(m.id, m));

      const earliestByKey = new Map<string, { jamMulai: string; mapelId: number | null }>();

      jadwal.forEach((j) => {
        const jam = jamById.get(j.jam_id);
        if (!jam) return;

        const jamMulai = jam.jam_mulai.slice(0, 5);
        const key = `${j.guru_id}-${j.hari_id}`;
        const existing = earliestByKey.get(key);

        if (!existing || jamMulai < existing.jamMulai) {
          earliestByKey.set(key, { jamMulai, mapelId: j.mapel_id });
        }
      });

      const guruById = new Map<number, GuruRow>();
      (guruData ?? []).forEach((g) => guruById.set(g.id, g));

      const mapped: AbsenGuru[] = absen.map((row) => {
        const guru = guruById.get(row.guru_id);
        const hariId = hariIdPerAbsen.get(row.id) ?? null;
        const key = hariId !== null ? `${row.guru_id}-${hariId}` : null;

        let jadwalMasuk = "-";
        let mapelNama = "-";

        if (key && earliestByKey.has(key)) {
          const info = earliestByKey.get(key);
          if (info) {
            jadwalMasuk = info.jamMulai;
            if (info.mapelId !== null) {
              const mp = mapelById.get(info.mapelId);
              if (mp) mapelNama = mp.nama;
            }
          }
        } else if (row.jam_masuk) {
          jadwalMasuk = row.jam_masuk.slice(0, 5);
        }

        return {
          id: row.id,
          nama: guru?.nama ?? `Guru ${row.guru_id}`,
          mapel: mapelNama,
          jadwalMasuk,
          jamMasuk: row.jam_masuk ? row.jam_masuk.slice(0, 5) : null,
          jamPulang: row.jam_pulang ? row.jam_pulang.slice(0, 5) : null, // ⬅ TAMBAHAN
          lat: row.lat_masuk,
          lng: row.lng_masuk,
        };
      });

      setRows(mapped);
      setLoading(false);
    };

    void load();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filtered = rows.filter((item) => {
    const q = search.toLowerCase();
    return item.nama.toLowerCase().includes(q) || item.mapel.toLowerCase().includes(q);
  });

  const openModal = (item: AbsenGuru) => {
    setDetail({
      nama: item.nama,
      mapel: item.mapel,
      jamMasuk: item.jamMasuk,
      status: getStatus(item.jadwalMasuk, item.jamMasuk),
      lat: item.lat,
      lng: item.lng,
    });
    setOpen(true);
  };

  if (loading) {
    return <p>Memuat data absensi...</p>;
  }

  return (
    <div className="space-y-4">
      <input type="text" placeholder="Cari guru atau mapel..." className="w-full md:w-1/3 px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-gray-500" value={search} onChange={handleSearch} />

      <div className="overflow-x-auto border rounded bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Mengajar</th>
              <th className="p-3">Jadwal Masuk</th>
              <th className="p-3">Jam Masuk</th>
              <th className="p-3">Jam Pulang</th>
              <th className="p-3">Status</th>
              <th className="p-3">Lokasi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => {
                const status = getStatus(item.jadwalMasuk, item.jamMasuk);

                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{item.nama}</td>
                    <td className="p-3">{item.mapel}</td>
                    <td className="p-3">{item.jadwalMasuk}</td>
                    <td className="p-3">{item.jamMasuk ?? "-"}</td>
                    <td className="p-3">{item.jamPulang ?? "-"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${status === "HADIR" ? "bg-green-100 text-green-700" : status === "TERLAMBAT" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{status}</span>
                    </td>
                    <td className="p-3">
                      <button type="button" onClick={() => openModal(item)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                        Lihat
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <LokasiAbsenModal open={open} onClose={() => setOpen(false)} lat={detail.lat} lng={detail.lng} nama={detail.nama} jamMasuk={detail.jamMasuk} />
    </div>
  );
}
