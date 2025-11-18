"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CalendarEvent, KegiatanTahunanRow } from "@/types/kalender";
import KalenderModal from "./components/KalenderModal";

/** RAW DATA TYPE FROM SUPABASE QUERY (TS STRICT) */
type RawKA = {
  id: number;
  tanggal: string;
  hari_efektif: boolean;
  semester_id: number | null;
  status: string | null;
  kegiatan_tahunan: KegiatanTahunanRow | KegiatanTahunanRow[] | null;
};

export default function KalenderAkademikManagePage() {
  const [items, setItems] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  /** ===== Load Data (TS STRICT SAFE) ===== */
  const loadData = async (): Promise<void> => {
    setLoading(true);

    const { data, error } = await supabase
      .from("kalender_akademik")
      .select(
        `
        id,
        tanggal,
        hari_efektif,
        semester_id,
        status,
        kegiatan_tahunan ( nama, kategori )
      `
      )
      .order("tanggal", { ascending: true });

    if (error || !data) {
      console.error("Error:", error);
      setLoading(false);
      return;
    }

    const mapped: CalendarEvent[] = (data as RawKA[]).map((row) => {
      let kegiatanName: string | null = null;
      let kategori: string | null = null;

      const rel = row.kegiatan_tahunan;

      if (Array.isArray(rel)) {
        if (rel[0]) {
          kegiatanName = rel[0].nama;
          kategori = rel[0].kategori;
        }
      } else {
        kegiatanName = rel?.nama ?? null;
        kategori = rel?.kategori ?? null;
      }

      return {
        id: row.id,
        tanggal: row.tanggal,
        kegiatan: kegiatanName,
        hari_efektif: row.hari_efektif,
        kategori,
        semester: row.semester_id,
        status: row.status,
      };
    });

    setItems(mapped);
    setLoading(false);
  };

  /** ===== useEffect SAFE (tanpa warning ESLint) ===== */
  useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, []);

  return (
    <section className="w-full min-h-screen px-2py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Kalender Akademik</h1>

        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition">
          <Plus className="w-5 h-5" />
          Tambah
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sky-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 border-b">No</th>
              <th className="p-3 border-b">Kegiatan</th>
              <th className="p-3 border-b">Hari Efektif</th>
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b">Semester</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Tidak ada data kalender akademik.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b text-center">{index + 1}</td>

                  <td className="p-3 border-b">{item.kegiatan}</td>

                  <td className="p-3 border-b">{item.hari_efektif ? <span className="text-green-600 font-semibold">Ya</span> : <span className="text-red-500 font-semibold">Tidak</span>}</td>

                  <td className="p-3 border-b">{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>

                  <td className="p-3 border-b text-center">{item.semester ?? "-"}</td>

                  <td className="p-3 border-b">{item.status === "ACTIVE" ? <span className="text-green-600 font-semibold">Aktif</span> : <span className="text-gray-400">Nonaktif</span>}</td>

                  <td className="p-3 border-b text-center">
                    <div className="flex items-center gap-3 justify-center">
                      <button className="text-gray-700 flex py-2 px-3 items-center rounded-lg bg-yellow-400 gap-1">
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button className="text-white bg-red-500 py-2 px-3 flex gap-1 rounded-lg items-center">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && <KalenderModal onClose={() => setShowModal(false)} onSuccess={loadData} />}
    </section>
  );
}
