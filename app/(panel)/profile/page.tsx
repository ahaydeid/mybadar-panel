"use client";

import { User } from "lucide-react";
import KonfirmasiLogoutModal from "./components/KonfirmasiLogoutModal";
import { useEffect, useState } from "react";
import { getSessionClient } from "@/lib/session/client";
import { supabase } from "@/lib/supabase/client";
import type { GuruProfile } from "@/types/guru";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [guru, setGuru] = useState<GuruProfile | null>(null);
  const [mapel, setMapel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const session = await getSessionClient();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("guru")
        .select(
          `
          *,  
          guru_mapel (
            mata_pelajaran ( nama )
          )
        `
        )
        .eq("user_id", session.userId)
        .maybeSingle();

      if (data) {
        setGuru(data);
        const mp = data?.guru_mapel?.[0]?.mata_pelajaran?.nama ?? null;
        setMapel(mp);
      }

      setLoading(false);
    }

    void loadProfile();
  }, []);

  if (loading) return <p className="p-6">Memuat...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Profil Guru</h1>

      {/* Kartu Profil */}
      <div className="bg-white shadow rounded-xl p-6 w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-600" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">{guru?.nama ?? "Nama tidak tersedia"}</h2>
            <p className="text-gray-600 text-sm">{mapel ?? "-"}</p>
          </div>
        </div>

        {/* Detail guru atau fallback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>NUPTK:</strong> {guru?.nuptk ?? "-"}
          </div>
          <div>
            <strong>Jenis Kelamin:</strong> {guru?.jk ?? "-"}
          </div>
          <div>
            <strong>Tempat Lahir:</strong> {guru?.tempat_lahir ?? "-"}
          </div>
          <div>
            <strong>Tanggal Lahir:</strong> {guru?.tanggal_lahir ?? "-"}
          </div>
          <div>
            <strong>NIK:</strong> {guru?.nik ?? "-"}
          </div>
          <div>
            <strong>NIP:</strong> {guru?.nip ?? "-"}
          </div>
          <div>
            <strong>Jenis PTK:</strong> {guru?.jenis_ptk ?? "-"}
          </div>
          <div>
            <strong>Gelar:</strong> {guru?.gelar ?? "-"}
          </div>
          <div>
            <strong>Jenjang:</strong> {guru?.jenjang ?? "-"}
          </div>
          <div>
            <strong>Prodi:</strong> {guru?.prodi ?? "-"}
          </div>
          <div>
            <strong>Sertifikasi:</strong> {guru?.sertifikasi ?? "-"}
          </div>
          <div>
            <strong>TMT Kerja:</strong> {guru?.tmt_kerja ?? "-"}
          </div>
          <div>
            <strong>Tugas Tambahan:</strong> {guru?.tugas_tambahan ?? "-"}
          </div>
          <div>
            <strong>Kompetensi:</strong> {guru?.kompetensi ?? "-"}
          </div>
        </div>
      </div>

      {/* Tombol Logout SELALU tampil */}
      <button onClick={() => setOpen(true)} className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition">
        Logout
      </button>

      <KonfirmasiLogoutModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
