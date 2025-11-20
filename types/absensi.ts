// /types/absensi.ts

export type StatusType = "HADIR" | "TERLAMBAT" | "TIDAK HADIR";

export interface DbAbsenRow {
  id: number;
  guru_id: number;
  tanggal: string;
  jam_masuk: string | null;
  lat_masuk: number | null;
  lng_masuk: number | null;
  jam_pulang: string | null;
}

export interface GuruRow {
  id: number;
  nama: string;
}

export interface HariRow {
  id: number;
  nama: string;
}

export interface SemesterRow {
  id: number;
  status: string;
}

export interface JadwalRow {
  id: number;
  guru_id: number;
  hari_id: number;
  jam_id: number;
  mapel_id: number;
  semester_id: number;
}

export interface JamRow {
  id: number;
  jam_mulai: string;
  jam_selesai: string;
}

export interface MapelRow {
  id: number;
  nama: string;
}

export interface AbsenGuru {
  id: number;
  nama: string;
  mapel: string;
  jadwalMasuk: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  lat: number | null;
  lng: number | null;
}
