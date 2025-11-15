"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ModalDetailKelas, { JadwalItem } from "./components/ModalDetailKelas";

type KelasItem = {
  id: number;
  nama_rombel: string;
  wali_nama: string | null;
};

type RawHari = {
  id: number;
  nama: string;
};

type RawJam = {
  id: number;
  jam_mulai: string;
  jam_selesai: string;
};

type RawMapel = {
  id: number;
  nama: string;
  warna_hex: string;
};

type RawGuru = {
  id: number;
  nama: string;
};

type RawJadwal = {
  kelas_id: number;
  hari: RawHari | null;
  jam: RawJam | null;
  mapel: RawMapel | null;
  guru: RawGuru | null;
};

export default function JadwalPage() {
  const [kelasList, setKelasList] = useState<KelasItem[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<KelasItem | null>(null);
  const [jadwalList, setJadwalList] = useState<JadwalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const { data: kelasRaw, error } = await supabase.from("kelas").select("id, nama_rombel, wali_guru_id, guru:wali_guru_id(nama)").order("nama_rombel");

      if (error) {
        console.error("ERROR LOAD KELAS:", error);
        return;
      }

      if (!kelasRaw) {
        setKelasList([]);
        return;
      }

      const mapped: KelasItem[] = kelasRaw.map((k) => {
        const guruData = Array.isArray(k.guru) ? k.guru[0] : k.guru;
        return {
          id: k.id,
          nama_rombel: k.nama_rombel,
          wali_nama: guruData?.nama ?? null,
        };
      });

      setKelasList(mapped);
    };

    load();
  }, []);

  const loadJadwal = async (kelasId: number) => {
    setLoading(true);

    const { data, error } = await supabase
      .from("jadwal")
      .select(
        `
        kelas_id,
        hari:hari_id!inner ( id, nama ),
        jam:jam_id!inner ( id, jam_mulai, jam_selesai ),
        mapel:mapel_id!inner ( id, nama, warna_hex ),
        guru:guru_id ( id, nama )
      `
      )
      .eq("kelas_id", kelasId)
      .order("hari_id", { ascending: true })
      .order("jam_id", { ascending: true });

    console.log("LOAD JADWAL UNTUK KELAS:", kelasId);
    console.log("HASIL RAW SUPABASE:", data);
    console.log("ERROR RAW SUPABASE:", error);

    if (error || !data) {
      setJadwalList([]);
      setLoading(false);
      return;
    }

    const mapped: JadwalItem[] = (data as unknown as RawJadwal[]).map((j) => {
      return {
        kelas_id: j.kelas_id,
        hari: j.hari?.nama ?? "",
        jam_mulai: j.jam?.jam_mulai ?? "",
        jam_selesai: j.jam?.jam_selesai ?? "",
        mapel: j.mapel?.nama ?? "",
        guru: j.guru?.nama ?? null,
        warna: j.mapel?.warna_hex ?? "#F1F1F1",
      };
    });

    console.log("JADWAL MAPPED:", mapped);

    setJadwalList(mapped);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Daftar Kelas</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kelasList.map((k) => (
          <div
            key={k.id}
            className="p-5 bg-white rounded-xl shadow border hover:shadow-md transition cursor-pointer"
            onClick={async () => {
              console.log("KELAS DIKLIK:", k);
              setSelectedKelas(k);
              await loadJadwal(k.id);
              setOpen(true);
            }}
          >
            <h2 className="text-xl font-bold mb-1">{k.nama_rombel}</h2>
            <p className="text-sm text-gray-600">- {k.wali_nama ?? "Tanpa wali kelas"}</p>
          </div>
        ))}
      </div>

      {selectedKelas && <ModalDetailKelas open={open} onClose={() => setOpen(false)} nama_kelas={selectedKelas.nama_rombel} wali_kelas={selectedKelas.wali_nama} jadwalList={loading ? [] : jadwalList} />}
    </div>
  );
}
