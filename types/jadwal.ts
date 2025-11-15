// src/types/jadwal.ts
export interface KelasItem {
  id: number;
  nama_rombel: string;
}

export interface JadwalItem {
  kelas_id: number;
  jam_mulai: string;
  jam_selesai: string;
  mapel: string;
  guru: string | null;
  warna: string;
}
