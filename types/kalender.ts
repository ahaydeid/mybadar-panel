export interface KegiatanTahunanRow {
  nama: string | null;
  kategori: string | null;
}

export interface KalenderAkademikRow {
  id: number;
  tanggal: string;
  hari_efektif: boolean;
  semester_id: number | null;
  status: string | null;
  kegiatan_tahunan: KegiatanTahunanRow | KegiatanTahunanRow[] | null;
}

export interface CalendarEvent {
  id: number;
  tanggal: string;
  kegiatan: string | null;
  hari_efektif: boolean;
  kategori: string | null;

  semester?: number | null;
  status?: string | null;
}
