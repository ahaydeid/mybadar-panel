"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type KelasItem = {
  id: number;
  nama_rombel: string;
  wali_nama: string | null;
};

export default function AbsensiSiswaPage() {
  const router = useRouter();
  const [kelasList, setKelasList] = useState<KelasItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKelas = async () => {
      setLoading(true);

      // Ambil data kelas + wali kelas
      const { data, error } = await supabase.from("kelas").select("id, nama_rombel, wali_guru_id, guru:wali_guru_id(nama)").order("nama_rombel", { ascending: true });

      if (error) {
        console.error("Error load kelas:", error);
        setLoading(false);
        return;
      }

      const mapped = (data ?? []).map((k) => {
        const guruData = Array.isArray(k.guru) ? k.guru[0] : k.guru;
        return {
          id: k.id,
          nama_rombel: k.nama_rombel,
          wali_nama: guruData?.nama ?? null,
        };
      });

      setKelasList(mapped);
      setLoading(false);
    };

    loadKelas();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold">
        Rekap Absensi <span className="text-sky-600">Siswa</span>
      </h1>
      <p className="text-gray-600">Pilih kelas untuk melihat rekap absensi.</p>

      {/* LOADING */}
      {loading && <p className="text-gray-500">Memuat data kelas...</p>}

      {/* LIST CARD KELAS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {kelasList.map((k) => (
          <div key={k.id} className="p-5 bg-gray-50 rounded-sm shadow border hover:shadow-md transition cursor-pointer" onClick={() => router.push(`/absensi/siswa/${k.id}`)}>
            <h2 className="text-2xl font-bold mb-1">{k.nama_rombel}</h2>
            <p className="text-gray-600">Wali kelas: {k.wali_nama ?? "—"}</p>
          </div>
        ))}
      </div>

      {/* TIDAK ADA DATA */}
      {!loading && kelasList.length === 0 && <p className="text-gray-500">Belum ada data kelas.</p>}
    </div>
  );
}
