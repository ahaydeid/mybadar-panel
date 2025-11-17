"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export type GuruRow = {
  id: number;
  nama: string;
};

export type HariRow = {
  id: number;
  nama: string;
  status: boolean;
};

export type JamRow = {
  id: number;
  jam_mulai: string;
  jam_selesai: string;
};

export type JadwalRow = {
  id: number;
  hari_id: number;
  jam_id: number;
  guru_id: number | null;
  semester_id: number;
};

export type AbsenGuruRow = {
  guru_id: number | null;
  tanggal: string;
  keterangan: string | null;
  jam_masuk: string | null;
};

export type GuruLogHari = {
  tanggal: string;
  status: "HADIR" | "TERLAMBAT" | "TIDAK_HADIR";
  jamMasuk: string | null;
};

export type RekapGuru = {
  id: number;
  nama: string;
  totalHari: number;
  hadir: number;
  terlambat: number;
  tidakHadir: number;
  hariIni: "H" | "T" | "-";
};

type HariAktifRow = {
  nama: string;
  status: boolean;
};

function namaHariToJsDay(nama: string): number | null {
  const lower = nama.toLowerCase();
  if (lower.startsWith("senin")) return 1;
  if (lower.startsWith("selasa")) return 2;
  if (lower.startsWith("rabu")) return 3;
  if (lower.startsWith("kamis")) return 4;
  if (lower.startsWith("jum")) return 5;
  if (lower.startsWith("sabtu")) return 6;
  if (lower.startsWith("minggu")) return 0;
  return null;
}

function generateTanggalSemester(start: string, end: string): string[] {
  const result: string[] = [];
  const current = { d: new Date(start) };
  const last = new Date(end);
  while (current.d <= last) {
    result.push(current.d.toISOString().split("T")[0]);
    current.d = new Date(current.d.getFullYear(), current.d.getMonth(), current.d.getDate() + 1);
  }
  return result;
}

export default function useRekapAbsensiGuru() {
  const [list, setList] = useState<RekapGuru[]>([]);
  const [logs, setLogs] = useState<Record<number, GuruLogHari[]>>({});
  const [loading, setLoading] = useState(true);
  const [totalHariEfektif, setTotalHariEfektif] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data: semesterData, error: semErr } = await supabase.from("semester").select("id, tanggal_mulai, tanggal_selesai").eq("status", "ACTIVE").single();

      if (semErr || !semesterData) {
        setErrorMsg("Semester aktif tidak ditemukan.");
        setLoading(false);
        return;
      }

      const { id: semesterId, tanggal_mulai, tanggal_selesai } = semesterData;

      if (!tanggal_mulai || !tanggal_selesai) {
        setErrorMsg("Tanggal mulai atau selesai semester belum diisi.");
        setLoading(false);
        return;
      }

      const tanggalList = generateTanggalSemester(tanggal_mulai, tanggal_selesai);

      const { data: hariDataBaru } = await supabase.from("hari").select("nama, status");
      const rows: HariAktifRow[] = (hariDataBaru ?? []) as HariAktifRow[];

      const namaHariSet = new Set(
        rows
          .filter((h) => h.status === true)
          .map((h) => namaHariToJsDay(h.nama))
          .filter((n): n is number => n !== null)
      );

      const totalHariKalender = tanggalList.length;
      const totalHariPerMinggu = namaHariSet.size;

      const mingguPenuh = Math.floor(totalHariKalender / 7);
      const sisaHari = totalHariKalender % 7;

      let tambahan = 0;
      for (let i = 0; i < sisaHari; i++) {
        const base = new Date(tanggal_mulai);
        base.setDate(base.getDate() + mingguPenuh * 7 + i);
        if (namaHariSet.has(base.getDay())) tambahan++;
      }

      const totalEfektif = mingguPenuh * totalHariPerMinggu + tambahan;
      setTotalHariEfektif(totalEfektif);

      const { data: guruData } = await supabase.from("guru").select("id, nama").order("nama");
      const gurus = (guruData ?? []) as GuruRow[];

      const { data: hariData } = await supabase.from("hari").select("id, nama, status");
      const hariIdMap: Record<number, number> = {};
      (hariData as HariRow[]).forEach((h) => {
        const hr = h as HariRow & { status: boolean };
        if (!hr.status) return;
        const js = namaHariToJsDay(hr.nama);
        if (js !== null) hariIdMap[hr.id] = js;
      });

      const { data: jamData } = await supabase.from("jam").select("id, jam_mulai, jam_selesai");
      const jamMap: Record<number, JamRow> = {};
      (jamData as JamRow[]).forEach((j) => (jamMap[j.id] = j));

      const { data: jadwalData } = await supabase.from("jadwal").select("id, hari_id, jam_id, guru_id, semester_id").eq("semester_id", semesterId);

      const jadwal = (jadwalData ?? []) as JadwalRow[];
      const guruJadwal: Record<number, Record<number, number[]>> = {};

      jadwal.forEach((j) => {
        if (!j.guru_id) return;
        const js = hariIdMap[j.hari_id];
        if (js === undefined) return;
        if (!guruJadwal[j.guru_id]) guruJadwal[j.guru_id] = {};
        if (!guruJadwal[j.guru_id][js]) guruJadwal[j.guru_id][js] = [];
        guruJadwal[j.guru_id][js].push(j.jam_id);
      });

      const { data: absData } = await supabase.from("absensi_guru").select("guru_id, tanggal, jam_masuk, keterangan").gte("tanggal", tanggal_mulai).lte("tanggal", tanggal_selesai);

      const absMap: Record<number, Record<string, AbsenGuruRow>> = {};
      (absData ?? []).forEach((row: AbsenGuruRow) => {
        if (!row.guru_id) return;
        if (!absMap[row.guru_id]) absMap[row.guru_id] = {};
        absMap[row.guru_id][row.tanggal] = row;
      });

      const today = new Date().toISOString().split("T")[0];
      const rekap: RekapGuru[] = [];
      const logsResult: Record<number, GuruLogHari[]> = {};

      const guruDenganJadwal = gurus.filter((g) => guruJadwal[g.id]);

      guruDenganJadwal.forEach((g) => {
        const logHari: GuruLogHari[] = [];

        tanggalList.forEach((tgl) => {
          const js = new Date(tgl).getDay();
          const jamList = guruJadwal[g.id]?.[js];
          if (!jamList || jamList.length === 0) return;

          const jamPertamaId = Math.min(...jamList);
          const jamPertama = jamMap[jamPertamaId];

          const abs = absMap[g.id]?.[tgl] ?? null;

          if (!abs || !abs.jam_masuk) {
            logHari.push({ tanggal: tgl, status: "TIDAK_HADIR", jamMasuk: null });
            return;
          }

          const jamMasuk = abs.jam_masuk;
          const terlambat = jamMasuk > jamPertama.jam_mulai;

          logHari.push({
            tanggal: tgl,
            status: terlambat ? "TERLAMBAT" : "HADIR",
            jamMasuk,
          });
        });

        const hadir = logHari.filter((l) => l.status === "HADIR").length;
        const terlambat = logHari.filter((l) => l.status === "TERLAMBAT").length;
        const tidakHadir = logHari.filter((l) => l.status === "TIDAK_HADIR").length;

        const logToday = logHari.find((l) => l.tanggal === today);
        const hariIni: "H" | "T" | "-" = logToday ? (logToday.status === "HADIR" ? "H" : "T") : "-";

        logsResult[g.id] = logHari;

        rekap.push({
          id: g.id,
          nama: g.nama,
          totalHari: logHari.length,
          hadir,
          terlambat,
          tidakHadir,
          hariIni,
        });
      });

      setList(rekap);
      setLogs(logsResult);
      setLoading(false);
    };

    load();
  }, []);

  return { list, logs, loading, errorMsg, totalHariEfektif };
}
