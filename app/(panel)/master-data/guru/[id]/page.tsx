"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Download, Pencil, Trash2 } from "lucide-react";

import GuruModal, { GuruFormData } from "@/app/(panel)/master-data/guru/components/GuruModal";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import SuccessSaveModal from "@/app/components/SuccessSaveModal";
import SuccessDeleteModal from "@/app/components/SuccessDeleteModal";

type GuruDetail = {
  id: number;
  nama: string;
  nuptk: string;
  jk: "L" | "P";
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  nik: string | null;
  nip: string | null;
  jenis_ptk: string | null;
  gelar: string | null;
  jenjang: string | null;
  prodi: string | null;
  sertifikasi: string | null;
  tmt_kerja: string | null;
  tugas_tambahan: string | null;
  kompetensi: string | null;
  status: string;
};

function DetailItem({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value ?? "-"}</span>
    </div>
  );
}

export default function GuruDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [guru, setGuru] = useState<GuruDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // MODALS
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openSuccessSave, setOpenSuccessSave] = useState(false);
  const [openSuccessDelete, setOpenSuccessDelete] = useState(false);

  const [formData, setFormData] = useState<GuruFormData | undefined>();

  // ==========================================================
  // LOAD DETAIL
  // ==========================================================
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("guru").select("*").eq("id", Number(id)).single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (data) {
        const mapped: GuruDetail = {
          id: data.id,
          nama: data.nama,
          nuptk: data.nuptk,
          jk: data.jk,
          tempat_lahir: data.tempat_lahir,
          tanggal_lahir: data.tanggal_lahir,
          nik: data.nik,
          nip: data.nip,
          jenis_ptk: data.jenis_ptk,
          gelar: data.gelar,
          jenjang: data.jenjang,
          prodi: data.prodi,
          sertifikasi: data.sertifikasi,
          tmt_kerja: data.tmt_kerja,
          tugas_tambahan: data.tugas_tambahan,
          kompetensi: data.kompetensi,
          status: data.status,
        };

        setGuru(mapped);

        setFormData({
          id: Number(data.id),
          nama: data.nama ?? "",
          nuptk: data.nuptk ?? "",
          jk: data.jk,
          tempatLahir: data.tempat_lahir ?? "",
          tanggalLahir: data.tanggal_lahir ?? "",
          nik: data.nik ?? "",
          nip: data.nip ?? "",
          jenisPTK: data.jenis_ptk ?? "",
          gelar: data.gelar ?? "",
          jenjang: data.jenjang ?? "",
          prodi: data.prodi ?? "",
          sertifikasi: data.sertifikasi ?? "",
          tmtKerja: data.tmt_kerja ?? "",
          tugasTambahan: data.tugas_tambahan ?? "",
          mapelIds: [],
          kompetensi: data.kompetensi ?? "",
          status: data.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        });
      }

      setLoading(false);
    }

    load();
  }, [id]);

  // ==========================================================
  // SAVE EDIT
  // ==========================================================
  const handleSave = async (data: GuruFormData) => {
    const payload = {
      nama: data.nama,
      nuptk: data.nuptk,
      jk: data.jk,
      tempat_lahir: data.tempatLahir,
      tanggal_lahir: data.tanggalLahir,
      nik: data.nik,
      nip: data.nip,
      jenis_ptk: data.jenisPTK,
      gelar: data.gelar,
      jenjang: data.jenjang,
      prodi: data.prodi,
      sertifikasi: data.sertifikasi,
      tmt_kerja: data.tmtKerja,
      tugas_tambahan: data.tugasTambahan,
      kompetensi: data.kompetensi,
      status: data.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    };

    const { error } = await supabase.from("guru").update(payload).eq("id", Number(id));
    if (error) console.error(error);

    setOpenEdit(false);
    setOpenSuccessSave(true);

    // === Refresh detail ===
    const { data: updated } = await supabase.from("guru").select("*").eq("id", Number(id)).single();

    if (updated) {
      const mapped: GuruDetail = {
        id: updated.id,
        nama: updated.nama,
        nuptk: updated.nuptk,
        jk: updated.jk,
        tempat_lahir: updated.tempat_lahir,
        tanggal_lahir: updated.tanggal_lahir,
        nik: updated.nik,
        nip: updated.nip,
        jenis_ptk: updated.jenis_ptk,
        gelar: updated.gelar,
        jenjang: updated.jenjang,
        prodi: updated.prodi,
        sertifikasi: updated.sertifikasi,
        tmt_kerja: updated.tmt_kerja,
        tugas_tambahan: updated.tugas_tambahan,
        kompetensi: updated.kompetensi,
        status: updated.status,
      };

      setGuru(mapped);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================
  const handleDelete = async () => {
    await supabase.from("guru").delete().eq("id", Number(id));

    setOpenConfirmDelete(false);
    setOpenSuccessDelete(true);

    setTimeout(() => {
      // arahkan kembali
      router.push("/panel/master-data/guru");
    }, 600);
  };

  if (loading || !guru) return <p className="p-4">Memuat data...</p>;

  return (
    <div className="w-full p-6 space-y-6">
      {/* BACK BUTTON */}
      <button onClick={() => window.history.back()} className="mb-4 bg-gray-100 px-3 py-1 flex rounded items-center text-gray-700 hover:bg-gray-200">
        <ArrowLeft className="w-5 h-5" /> Kembali
      </button>

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
            <User className="w-8 h-8 text-sky-600" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{guru.nama}</h1>
            <p className="text-gray-500 text-sm">NUPTK: {guru.nuptk ?? "-"}</p>
          </div>
        </div>

        <Button className="bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-2">
          <Download className="w-4 h-4" />
          Unduh Data Guru
        </Button>
      </div>

      {/* DETAIL GRID */}
      <div className="grid grid-cols-2 gap-4 p-4 border rounded bg-white">
        <DetailItem label="Nama" value={guru.nama} />
        <DetailItem label="NUPTK" value={guru.nuptk} />
        <DetailItem label="NIP" value={guru.nip} />
        <DetailItem label="Jenis Kelamin" value={guru.jk} />
        <DetailItem label="Tempat Lahir" value={guru.tempat_lahir} />
        <DetailItem label="Tanggal Lahir" value={guru.tanggal_lahir} />
        <DetailItem label="NIK" value={guru.nik} />
        <DetailItem label="Jenis PTK" value={guru.jenis_ptk} />
        <DetailItem label="Gelar" value={guru.gelar} />
        <DetailItem label="Jenjang" value={guru.jenjang} />
        <DetailItem label="Jurusan / Prodi" value={guru.prodi} />
        <DetailItem label="Sertifikasi" value={guru.sertifikasi} />
        <DetailItem label="TMT Kerja" value={guru.tmt_kerja} />
        <DetailItem label="Tugas Tambahan" value={guru.tugas_tambahan} />
        <DetailItem label="Kompetensi" value={guru.kompetensi} />
        <DetailItem label="Status" value={guru.status} />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2" onClick={() => setOpenEdit(true)}>
          <Pencil className="w-4 h-4" />
          Edit
        </Button>

        <Button className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2" onClick={() => setOpenConfirmDelete(true)}>
          <Trash2 className="w-4 h-4" />
          Hapus
        </Button>
      </div>

      {/* MODALS */}
      <GuruModal open={openEdit} mode="edit" initialData={formData} onClose={() => setOpenEdit(false)} onSubmit={handleSave} />

      <ConfirmDeleteModal open={openConfirmDelete} onCancel={() => setOpenConfirmDelete(false)} onConfirm={handleDelete} />

      <SuccessSaveModal open={openSuccessSave} onClose={() => setOpenSuccessSave(false)} message="Perubahan data guru berhasil disimpan." />

      <SuccessDeleteModal open={openSuccessDelete} onClose={() => setOpenSuccessDelete(false)} message="Data guru berhasil dihapus." />
    </div>
  );
}
